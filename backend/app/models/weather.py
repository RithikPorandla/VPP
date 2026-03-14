from sqlalchemy import Column, String, Float, DateTime, Integer, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid

from app.database import Base


class WeatherForecast(Base):
    __tablename__ = "weather_forecasts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    site_id = Column(String, ForeignKey("sites.id"), nullable=False)
    forecast_time = Column(DateTime(timezone=True), nullable=False)
    ingested_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    model_run = Column(String, default="open_meteo")

    wave_height_m = Column(Float)
    wave_period_s = Column(Float)
    wave_direction_deg = Column(Float)
    wind_speed_10m_ms = Column(Float)
    wind_speed_80m_ms = Column(Float)
    wind_speed_120m_ms = Column(Float)
    wind_direction_deg = Column(Float)
    wind_gusts_ms = Column(Float)
    visibility_m = Column(Float)
    precipitation_mm = Column(Float)
    temperature_c = Column(Float)
    cloud_cover_pct = Column(Float)
    pressure_hpa = Column(Float)
    current_speed_ms = Column(Float)
    current_direction_deg = Column(Float)

    site = relationship("Site", back_populates="weather_data")


class WeatherObservation(Base):
    """Actual observed conditions — for calibration and accuracy tracking."""
    __tablename__ = "weather_observations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    site_id = Column(String, ForeignKey("sites.id"), nullable=False)
    observed_at = Column(DateTime(timezone=True), nullable=False)
    recorded_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    source = Column(String, default="manual")

    wave_height_m = Column(Float)
    wave_period_s = Column(Float)
    wind_speed_10m_ms = Column(Float)
    wind_speed_hub_ms = Column(Float)
    wind_gusts_ms = Column(Float)
    visibility_m = Column(Float)
    precipitation_mm = Column(Float)
    temperature_c = Column(Float)
    notes = Column(String, default="")
