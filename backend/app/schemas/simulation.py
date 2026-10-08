from __future__ import annotations
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional

class SimulationRequest(BaseModel):
    baseline_rainfall_mm: float = Field(default=125.0, ge=0.0, le=1000.0, description="Baseline 24h rainfall in mm")
    multiplier: Optional[float] = Field(default=None, ge=0.5, le=5.0, description="Rainfall multiplier")
    target_rainfall_mm: Optional[float] = Field(default=None, ge=0.0, le=1000.0, description="Target scenario rainfall in mm")
    scenario_key: str = Field(default="PLUS_25", description="Preset scenario key (BASELINE, PLUS_10, PLUS_25, PLUS_50, EXTREME)")

class ZoneScenarioDelta(BaseModel):
    zone_id: str
    zone_name: str
    baseline_hazard_tier: str
    scenario_hazard_tier: str
    baseline_water_depth_cm: float
    scenario_water_depth_cm: float
    water_depth_delta_cm: float
    baseline_priority_tier: str
    scenario_priority_tier: str
    baseline_impact_score: float
    scenario_impact_score: float
    impact_score_delta: float
    population_exposed: int
    newly_threatened_assets: List[str]
    priority_escalated: bool

class ScenarioComparisonResult(BaseModel):
    scenario_name: str
    scenario_label: str
    rainfall_multiplier: float
    baseline_rainfall_mm: float
    scenario_rainfall_mm: float
    delta_rainfall_mm: float
    baseline_critical_zones: int
    scenario_critical_zones: int
    critical_zones_delta: int
    baseline_population_at_risk: int
    scenario_population_at_risk: int
    population_delta: int
    baseline_compromised_hospitals: int
    scenario_compromised_hospitals: int
    hospitals_delta: int
    baseline_compromised_roads: int
    scenario_compromised_roads: int
    roads_delta: int
    baseline_shelter_demand: int
    scenario_shelter_demand: int
    shelter_demand_delta: int
    zone_deltas: List[ZoneScenarioDelta]
    key_findings: List[str]
    simulation_disclaimer: str
    model_version: str
    timestamp: str
