"""
Ingests marine weather forecasts from Open-Meteo's free Marine API
and standard weather API for wind/visibility at hub height.
"""
import httpx
import logging
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from app.config import get_settings
from app.models.weather import WeatherForecast
from app.models.site import Site

logger = logging.getLogger(__name__)
settings = get_settings()


async def fetch_marine_data(lat: float, lon: float, forecast_days: int = 14) -> dict:
    params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": ",".join([
            "wave_height",
            "wave_period",
            "wave_direction",
            "ocean_current_velocity",
            "ocean_current_direction",
        ]),
        "forecast_days": forecast_days,
        "timeformat": "unixtime",
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.get(settings.open_meteo_base_url, params=params)
        resp.raise_for_status()
        return resp.json()


async def fetch_weather_data(lat: float, lon: float, forecast_days: int = 14) -> dict:
    params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": ",".join([
            "wind_speed_10m",
            "wind_speed_80m",
            "wind_speed_120m",
            "wind_direction_10m",
            "wind_gusts_10m",
            "visibility",
            "precipitation",
            "temperature_2m",
            "cloud_cover",
            "pressure_msl",
        ]),
        "forecast_days": forecast_days,
        "timeformat": "unixtime",
        "wind_speed_unit": "ms",
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.get(settings.open_meteo_weather_url, params=params)
        resp.raise_for_status()
        return resp.json()


def _safe_float(val) -> float | None:
    if val is None:
        return None
    try:
        return float(val)
    except (TypeError, ValueError):
        return None


async def ingest_weather_for_site(db: AsyncSession, site: Site) -> int:
    """Fetch and store hourly forecasts for a site. Returns number of records stored."""
    try:
        marine_data = await fetch_marine_data(site.latitude, site.longitude, settings.forecast_days)
        weather_data = await fetch_weather_data(site.latitude, site.longitude, settings.forecast_days)
    except httpx.HTTPError as e:
        logger.error(f"Failed to fetch weather for site {site.name}: {e}")
        raise

    marine_hourly = marine_data.get("hourly", {})
    weather_hourly = weather_data.get("hourly", {})

    marine_times = marine_hourly.get("time", [])
    weather_times = weather_hourly.get("time", [])

    weather_by_time = {}
    for i, t in enumerate(weather_times):
        weather_by_time[t] = {
            "wind_speed_10m_ms": _safe_float(weather_hourly.get("wind_speed_10m", [None] * len(weather_times))[i]),
            "wind_speed_80m_ms": _safe_float(weather_hourly.get("wind_speed_80m", [None] * len(weather_times))[i]),
            "wind_speed_120m_ms": _safe_float(weather_hourly.get("wind_speed_120m", [None] * len(weather_times))[i]),
            "wind_direction_deg": _safe_float(weather_hourly.get("wind_direction_10m", [None] * len(weather_times))[i]),
            "wind_gusts_ms": _safe_float(weather_hourly.get("wind_gusts_10m", [None] * len(weather_times))[i]),
            "visibility_m": _safe_float(weather_hourly.get("visibility", [None] * len(weather_times))[i]),
            "precipitation_mm": _safe_float(weather_hourly.get("precipitation", [None] * len(weather_times))[i]),
            "temperature_c": _safe_float(weather_hourly.get("temperature_2m", [None] * len(weather_times))[i]),
            "cloud_cover_pct": _safe_float(weather_hourly.get("cloud_cover", [None] * len(weather_times))[i]),
            "pressure_hpa": _safe_float(weather_hourly.get("pressure_msl", [None] * len(weather_times))[i]),
        }

    # Clear old forecasts for this site
    await db.execute(delete(WeatherForecast).where(WeatherForecast.site_id == site.id))

    now = datetime.now(timezone.utc)
    records = []
    for i, t in enumerate(marine_times):
        forecast_time = datetime.fromtimestamp(t, tz=timezone.utc)
        wx = weather_by_time.get(t, {})

        record = WeatherForecast(
            site_id=site.id,
            forecast_time=forecast_time,
            ingested_at=now,
            model_run="open_meteo",
            wave_height_m=_safe_float(marine_hourly.get("wave_height", [None] * len(marine_times))[i]),
            wave_period_s=_safe_float(marine_hourly.get("wave_period", [None] * len(marine_times))[i]),
            wave_direction_deg=_safe_float(marine_hourly.get("wave_direction", [None] * len(marine_times))[i]),
            current_speed_ms=_safe_float(marine_hourly.get("ocean_current_velocity", [None] * len(marine_times))[i]),
            current_direction_deg=_safe_float(marine_hourly.get("ocean_current_direction", [None] * len(marine_times))[i]),
            wind_speed_10m_ms=wx.get("wind_speed_10m_ms"),
            wind_speed_80m_ms=wx.get("wind_speed_80m_ms"),
            wind_speed_120m_ms=wx.get("wind_speed_120m_ms"),
            wind_direction_deg=wx.get("wind_direction_deg"),
            wind_gusts_ms=wx.get("wind_gusts_ms"),
            visibility_m=wx.get("visibility_m"),
            precipitation_mm=wx.get("precipitation_mm"),
            temperature_c=wx.get("temperature_c"),
            cloud_cover_pct=wx.get("cloud_cover_pct"),
            pressure_hpa=wx.get("pressure_hpa"),
        )
        records.append(record)

    db.add_all(records)
    await db.commit()
    logger.info(f"Ingested {len(records)} forecast records for site {site.name}")
    return len(records)


async def ingest_all_sites(db: AsyncSession) -> dict:
    """Fetch weather for all active sites."""
    result = await db.execute(select(Site).where(Site.is_active == True))
    sites = result.scalars().all()
    summary = {}
    for site in sites:
        try:
            count = await ingest_weather_for_site(db, site)
            summary[site.name] = {"status": "ok", "records": count}
        except Exception as e:
            summary[site.name] = {"status": "error", "error": str(e)}
            logger.error(f"Failed to ingest weather for {site.name}: {e}")
    return summary
