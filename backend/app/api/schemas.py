from pydantic import BaseModel, Field
from datetime import datetime


class SiteCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    country: str = ""
    num_turbines: float = 0
    water_depth_m: float = 30.0
    distance_from_port_km: float = 0
    port_name: str = ""


class SiteUpdate(BaseModel):
    name: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    country: str | None = None
    num_turbines: float | None = None
    water_depth_m: float | None = None
    distance_from_port_km: float | None = None
    port_name: str | None = None
    is_active: bool | None = None


class SiteResponse(BaseModel):
    id: str
    name: str
    latitude: float
    longitude: float
    country: str
    num_turbines: float
    water_depth_m: float
    distance_from_port_km: float
    port_name: str
    is_active: bool
    created_at: datetime | None = None

    class Config:
        from_attributes = True


class ObservationCreate(BaseModel):
    observed_at: datetime
    source: str = "manual"
    wave_height_m: float | None = None
    wave_period_s: float | None = None
    wind_speed_10m_ms: float | None = None
    wind_speed_hub_ms: float | None = None
    wind_gusts_ms: float | None = None
    visibility_m: float | None = None
    precipitation_mm: float | None = None
    temperature_c: float | None = None
    notes: str = ""


class WindowFinderRequest(BaseModel):
    operation_type: str
    min_duration_hours: float = 4.0
    include_marginal: bool = True


class CampaignFinderRequest(BaseModel):
    operation_type: str
    required_days: int = 3
