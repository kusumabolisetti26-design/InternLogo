from typing import List, Dict
from pydantic import BaseModel, Field
from datetime import datetime, timezone


class SensorFeedStatus(BaseModel):
    sensor_name: str
    sensor_type: str
    status: str  # ONLINE, DEGRADED, OFFLINE
    last_reading: str
    quality_pct: float
    data_label: str = "SIMULATION DATA"


class DataQualityStatusResponse(BaseModel):
    overall_quality_score: float = Field(..., ge=0.0, le=1.0)
    confidence_pct: float = Field(..., ge=0.0, le=100.0)
    active_sources_count: int
    missing_sources_count: int
    active_sources: List[str]
    missing_sources: List[str]
    sensors: List[SensorFeedStatus]
    system_advisory: str
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ToggleOutageRequest(BaseModel):
    sensor_name: str  # e.g., "Radar", "Satellite", "AWS", "NWP"
    set_offline: bool
