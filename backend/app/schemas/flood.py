from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime, timezone


class ZoneInundationSchema(BaseModel):
    zone_id: str
    zone_name: str
    flood_probability_pct: float
    estimated_water_depth_cm: float
    severity_level: str
    risk_score: float
    confidence_pct: float
    primary_risk_drivers: List[str]
    elevation_masl: float
    drainage_capacity_pct: float


class InundationAssessmentResponse(BaseModel):
    scenario_rainfall_24h_mm: float
    scenario_rain_rate_mmph: float
    generated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    data_label: str = "SIMULATION DATA (SIH26071)"
    total_zones_monitored: int
    severe_risk_count: int
    high_risk_count: int
    moderate_risk_count: int
    low_risk_count: int
    zones: List[ZoneInundationSchema]


class InundationSimulationRequest(BaseModel):
    rainfall_24h_mm: float = Field(default=120.0, ge=0.0, le=500.0, description="Cumulative 24h rainfall in mm")
    rainfall_rate_mmph: Optional[float] = Field(default=35.0, ge=0.0, le=250.0, description="Peak rainfall rate in mm/h")
