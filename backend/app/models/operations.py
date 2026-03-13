from sqlalchemy import Column, String, Float, DateTime, Integer, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid

from app.database import Base

# Default weather limits for common offshore wind operations
DEFAULT_OPERATION_PROFILES = {
    "ctv_transfer": {
        "label": "CTV Crew Transfer",
        "description": "Crew transfer via Crew Transfer Vessel with push-on bow",
        "limits": {
            "wave_height_m": 1.5,
            "wave_period_s": None,
            "wind_speed_10m_ms": 15.0,
            "wind_gusts_ms": 20.0,
            "visibility_m": 1000,
            "precipitation_mm": None,
            "current_speed_ms": 2.0,
        },
        "min_window_hours": 4,
        "typical_duration_hours": 8,
        "color": "#22c55e",
    },
    "sov_transfer": {
        "label": "SOV Gangway Transfer",
        "description": "Crew transfer via Service Operation Vessel with motion-compensated gangway",
        "limits": {
            "wave_height_m": 2.5,
            "wave_period_s": None,
            "wind_speed_10m_ms": 20.0,
            "wind_gusts_ms": 25.0,
            "visibility_m": 500,
            "precipitation_mm": None,
            "current_speed_ms": None,
        },
        "min_window_hours": 6,
        "typical_duration_hours": 12,
        "color": "#3b82f6",
    },
    "rope_access": {
        "label": "Blade Repair (Rope Access)",
        "description": "External blade inspection or repair via rope access technicians",
        "limits": {
            "wave_height_m": 1.5,
            "wave_period_s": None,
            "wind_speed_10m_ms": 12.0,
            "wind_gusts_ms": 15.0,
            "visibility_m": 1000,
            "precipitation_mm": 0.5,
            "current_speed_ms": None,
        },
        "min_window_hours": 6,
        "typical_duration_hours": 8,
        "color": "#f59e0b",
    },
    "crane_ops": {
        "label": "Crane Operations",
        "description": "Major component exchange using jack-up vessel or crane",
        "limits": {
            "wave_height_m": 1.2,
            "wave_period_s": None,
            "wind_speed_10m_ms": 10.0,
            "wind_gusts_ms": 12.0,
            "visibility_m": 2000,
            "precipitation_mm": 2.0,
            "current_speed_ms": 1.5,
        },
        "min_window_hours": 8,
        "typical_duration_hours": 12,
        "color": "#ef4444",
    },
    "internal_work": {
        "label": "Internal Nacelle/Tower Work",
        "description": "Work inside the turbine nacelle or tower — only needs safe transfer conditions",
        "limits": {
            "wave_height_m": 1.5,
            "wave_period_s": None,
            "wind_speed_10m_ms": 15.0,
            "wind_gusts_ms": 20.0,
            "visibility_m": 1000,
            "precipitation_mm": None,
            "current_speed_ms": None,
        },
        "min_window_hours": 6,
        "typical_duration_hours": 10,
        "color": "#8b5cf6",
    },
    "drone_inspection": {
        "label": "Blade Inspection (Drone)",
        "description": "Drone-based blade inspection — needs calm wind and good visibility",
        "limits": {
            "wave_height_m": 2.0,
            "wave_period_s": None,
            "wind_speed_10m_ms": 8.0,
            "wind_gusts_ms": 10.0,
            "visibility_m": 3000,
            "precipitation_mm": 0.1,
            "current_speed_ms": None,
        },
        "min_window_hours": 4,
        "typical_duration_hours": 6,
        "color": "#06b6d4",
    },
}


class OperationConfig(Base):
    """Per-site operation configuration — allows overriding default limits."""
    __tablename__ = "operation_configs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    site_id = Column(String, ForeignKey("sites.id"), nullable=False)
    operation_type = Column(String, nullable=False)
    is_enabled = Column(Boolean, default=True)
    custom_limits = Column(JSON, default=None)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    site = relationship("Site", back_populates="operation_configs")

    def get_limits(self) -> dict:
        defaults = DEFAULT_OPERATION_PROFILES.get(self.operation_type, {}).get("limits", {})
        if self.custom_limits:
            merged = {**defaults, **self.custom_limits}
            return merged
        return defaults
