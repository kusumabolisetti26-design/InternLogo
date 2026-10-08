from __future__ import annotations
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional

class RoutingRequest(BaseModel):
    origin_zone_id: str = Field(default="ZONE-02", description="Starting sector ID (e.g. ZONE-01 to ZONE-10)")
    destination_shelter_id: Optional[str] = Field(default=None, description="Optional designated shelter ID (e.g. SHELTER-01)")
    rainfall_24h_mm: float = Field(default=125.0, description="Active rainfall scenario in mm")

class RouteSegment(BaseModel):
    segment_id: str
    from_node: str
    to_node: str
    road_name: str
    distance_km: float
    water_depth_cm: float
    road_status: str
    is_elevated_bypass: bool
    warning: Optional[str] = None

class EvacuationRouteOption(BaseModel):
    route_type: str
    label: str
    total_distance_km: float
    estimated_travel_time_mins: float
    maximum_water_depth_cm: float
    overall_risk_level: str
    segments: List[RouteSegment]
    path_nodes: List[str]
    coordinates: List[List[float]]
    why_recommended: str
    is_recommended: bool = False

class ShelterRecommendation(BaseModel):
    shelter_id: str
    shelter_name: str
    zone_id: str
    elevation_masl: float
    distance_km: float
    capacity_persons: int
    current_occupancy: int
    available_headroom: int
    flood_safety_tier: str
    route_safety_score: float
    selection_rationale: str
    recommended_route_type: str

class EvacuationPlanResult(BaseModel):
    origin_zone_id: str
    origin_zone_name: str
    destination_shelter_id: str
    destination_shelter_name: str
    recommended_shelter: ShelterRecommendation
    routes: Dict[str, EvacuationRouteOption]
    active_rainfall_scenario_mm: float
    advisory_warning: str
    timestamp: str
