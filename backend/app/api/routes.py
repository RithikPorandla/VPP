from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone

from app.database import get_db
from app.models.site import Site
from app.models.weather import WeatherForecast, WeatherObservation
from app.models.operations import DEFAULT_OPERATION_PROFILES, OperationConfig
from app.services.weather_ingestion import ingest_weather_for_site, ingest_all_sites
from app.services.go_no_go import evaluate_forecast_series
from app.services.window_finder import find_windows, find_campaign_windows
from app.services.daily_briefing import generate_briefing
from app.api.schemas import (
    SiteCreate, SiteUpdate, SiteResponse,
    ObservationCreate, WindowFinderRequest, CampaignFinderRequest,
)

router = APIRouter()


# ──────────────────────────── Sites ────────────────────────────

@router.get("/sites", tags=["Sites"])
async def list_sites(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Site).order_by(Site.created_at.desc()))
    sites = result.scalars().all()
    return [SiteResponse.model_validate(s) for s in sites]


@router.post("/sites", tags=["Sites"])
async def create_site(site_in: SiteCreate, db: AsyncSession = Depends(get_db)):
    site = Site(**site_in.model_dump())
    db.add(site)

    for op_type in DEFAULT_OPERATION_PROFILES:
        config = OperationConfig(site_id=site.id, operation_type=op_type, is_enabled=True)
        db.add(config)

    await db.commit()
    await db.refresh(site)

    try:
        await ingest_weather_for_site(db, site)
    except Exception:
        pass

    return SiteResponse.model_validate(site)


@router.get("/sites/{site_id}", tags=["Sites"])
async def get_site(site_id: str, db: AsyncSession = Depends(get_db)):
    site = await db.get(Site, site_id)
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    return SiteResponse.model_validate(site)


@router.patch("/sites/{site_id}", tags=["Sites"])
async def update_site(site_id: str, site_in: SiteUpdate, db: AsyncSession = Depends(get_db)):
    site = await db.get(Site, site_id)
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")

    update_data = site_in.model_dump(exclude_unset=True)
    for key, val in update_data.items():
        setattr(site, key, val)

    await db.commit()
    await db.refresh(site)
    return SiteResponse.model_validate(site)


@router.delete("/sites/{site_id}", tags=["Sites"])
async def delete_site(site_id: str, db: AsyncSession = Depends(get_db)):
    site = await db.get(Site, site_id)
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    await db.delete(site)
    await db.commit()
    return {"status": "deleted"}


# ──────────────────────── Weather Data ─────────────────────────

@router.post("/sites/{site_id}/weather/refresh", tags=["Weather"])
async def refresh_weather(site_id: str, db: AsyncSession = Depends(get_db)):
    site = await db.get(Site, site_id)
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    try:
        count = await ingest_weather_for_site(db, site)
        return {"status": "ok", "records_ingested": count}
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Weather fetch failed: {str(e)}")


@router.post("/weather/refresh-all", tags=["Weather"])
async def refresh_all_weather(db: AsyncSession = Depends(get_db)):
    summary = await ingest_all_sites(db)
    return summary


@router.get("/sites/{site_id}/weather", tags=["Weather"])
async def get_weather(
    site_id: str,
    db: AsyncSession = Depends(get_db),
    hours: int = Query(default=168, ge=1, le=336),
):
    site = await db.get(Site, site_id)
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")

    result = await db.execute(
        select(WeatherForecast)
        .where(WeatherForecast.site_id == site_id)
        .order_by(WeatherForecast.forecast_time.asc())
        .limit(hours)
    )
    forecasts = result.scalars().all()
    return [_forecast_to_dict(f) for f in forecasts]


# ──────────────────── Go/No-Go Engine ──────────────────────────

@router.get("/sites/{site_id}/go-no-go", tags=["Go/No-Go"])
async def get_go_no_go(
    site_id: str,
    db: AsyncSession = Depends(get_db),
    operation: str = Query(default=None),
    hours: int = Query(default=48, ge=1, le=336),
):
    """
    Get go/no-go assessments for all (or a specific) operation type
    across the forecast period.
    """
    site = await db.get(Site, site_id)
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")

    result = await db.execute(
        select(WeatherForecast)
        .where(WeatherForecast.site_id == site_id)
        .order_by(WeatherForecast.forecast_time.asc())
        .limit(hours)
    )
    forecasts = result.scalars().all()
    if not forecasts:
        raise HTTPException(status_code=404, detail="No weather data. Refresh weather first.")

    forecast_rows = [_forecast_to_dict(f) for f in forecasts]

    op_types = [operation] if operation else list(DEFAULT_OPERATION_PROFILES.keys())
    assessments = {}

    for op_type in op_types:
        if op_type not in DEFAULT_OPERATION_PROFILES:
            continue
        results = evaluate_forecast_series(op_type, forecast_rows)
        assessments[op_type] = [r.to_dict() for r in results]

    return assessments


# ──────────────────── Weather Windows ──────────────────────────

@router.post("/sites/{site_id}/windows", tags=["Windows"])
async def find_weather_windows(
    site_id: str,
    req: WindowFinderRequest,
    db: AsyncSession = Depends(get_db),
):
    site = await db.get(Site, site_id)
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")

    result = await db.execute(
        select(WeatherForecast)
        .where(WeatherForecast.site_id == site_id)
        .order_by(WeatherForecast.forecast_time.asc())
    )
    forecasts = result.scalars().all()
    if not forecasts:
        raise HTTPException(status_code=404, detail="No weather data. Refresh weather first.")

    forecast_rows = [_forecast_to_dict(f) for f in forecasts]
    windows = find_windows(
        req.operation_type, forecast_rows,
        min_duration_hours=req.min_duration_hours,
        include_marginal=req.include_marginal,
    )
    return {
        "operation_type": req.operation_type,
        "operation_label": DEFAULT_OPERATION_PROFILES.get(req.operation_type, {}).get("label", req.operation_type),
        "min_duration_hours": req.min_duration_hours,
        "windows_found": len(windows),
        "windows": [w.to_dict() for w in windows],
    }


@router.post("/sites/{site_id}/campaign-windows", tags=["Windows"])
async def find_campaign_weather_windows(
    site_id: str,
    req: CampaignFinderRequest,
    db: AsyncSession = Depends(get_db),
):
    site = await db.get(Site, site_id)
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")

    result = await db.execute(
        select(WeatherForecast)
        .where(WeatherForecast.site_id == site_id)
        .order_by(WeatherForecast.forecast_time.asc())
    )
    forecasts = result.scalars().all()
    if not forecasts:
        raise HTTPException(status_code=404, detail="No weather data. Refresh weather first.")

    forecast_rows = [_forecast_to_dict(f) for f in forecasts]
    windows = find_campaign_windows(
        req.operation_type, forecast_rows, required_days=req.required_days
    )
    return {
        "operation_type": req.operation_type,
        "required_days": req.required_days,
        "windows": windows,
    }


# ──────────────────── Daily Briefing ───────────────────────────

@router.get("/sites/{site_id}/briefing", tags=["Briefing"])
async def get_daily_briefing(
    site_id: str,
    db: AsyncSession = Depends(get_db),
):
    site = await db.get(Site, site_id)
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")

    result = await db.execute(
        select(WeatherForecast)
        .where(WeatherForecast.site_id == site_id)
        .order_by(WeatherForecast.forecast_time.asc())
    )
    forecasts = result.scalars().all()
    if not forecasts:
        raise HTTPException(status_code=404, detail="No weather data. Refresh weather first.")

    forecast_rows = [_forecast_to_dict(f) for f in forecasts]
    briefing = generate_briefing(site.name, forecast_rows)
    return briefing


# ──────────────────── Observations ─────────────────────────────

@router.post("/sites/{site_id}/observations", tags=["Observations"])
async def add_observation(
    site_id: str,
    obs_in: ObservationCreate,
    db: AsyncSession = Depends(get_db),
):
    site = await db.get(Site, site_id)
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")

    obs = WeatherObservation(site_id=site_id, **obs_in.model_dump())
    db.add(obs)
    await db.commit()
    return {"status": "ok", "id": obs.id}


# ──────────────────── Operations Config ────────────────────────

@router.get("/operation-profiles", tags=["Operations"])
async def get_operation_profiles():
    return DEFAULT_OPERATION_PROFILES


# ──────────────────── Helpers ──────────────────────────────────

def _forecast_to_dict(f: WeatherForecast) -> dict:
    return {
        "forecast_time": f.forecast_time,
        "wave_height_m": f.wave_height_m,
        "wave_period_s": f.wave_period_s,
        "wave_direction_deg": f.wave_direction_deg,
        "wind_speed_10m_ms": f.wind_speed_10m_ms,
        "wind_speed_80m_ms": f.wind_speed_80m_ms,
        "wind_speed_120m_ms": f.wind_speed_120m_ms,
        "wind_direction_deg": f.wind_direction_deg,
        "wind_gusts_ms": f.wind_gusts_ms,
        "visibility_m": f.visibility_m,
        "precipitation_mm": f.precipitation_mm,
        "temperature_c": f.temperature_c,
        "cloud_cover_pct": f.cloud_cover_pct,
        "pressure_hpa": f.pressure_hpa,
        "current_speed_ms": f.current_speed_ms,
        "current_direction_deg": f.current_direction_deg,
    }
