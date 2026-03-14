from sqlalchemy import Column, String, Float, DateTime, JSON, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid

from app.database import Base


class Site(Base):
    __tablename__ = "sites"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    country = Column(String, default="")
    num_turbines = Column(Float, default=0)
    water_depth_m = Column(Float, default=30.0)
    distance_from_port_km = Column(Float, default=0)
    port_name = Column(String, default="")
    is_active = Column(Boolean, default=True)
    metadata_json = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    weather_data = relationship("WeatherForecast", back_populates="site", cascade="all, delete-orphan")
    operation_configs = relationship("OperationConfig", back_populates="site", cascade="all, delete-orphan")
