from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime, timezone


class GISSummaryResponse(BaseModel):
    generated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    data_label: str = "SAMPLE SPATIAL DATA (SIH26071)"
    total_zones: int
    severe_risk_zones: int
    high_risk_zones: int
    total_population_at_risk: int
    hospitals_at_risk: int
    schools_at_risk: int
    roads_compromised: int
    active_shelters: int
    total_shelter_capacity: int
    last_updated: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    prediction_confidence: float = 88.5


class SpatialZoneQueryResponse(BaseModel):
    zone_id: str
    zone_name: str
    ward_number: int
    severity_level: str
    risk_score: float
    flood_probability_pct: float
    estimated_water_depth_cm: float
    elevation_masl: float
    drainage_capacity_pct: float
    population_exposed: int
    hospitals: List[Dict[str, Any]]
    schools: List[Dict[str, Any]]
    shelters: List[Dict[str, Any]]
    roads: List[Dict[str, Any]]
    primary_risk_drivers: List[str]
    confidence_pct: float
    data_label: str = "SAMPLE SPATIAL DATA (SIH26071)"
