from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime, timezone
from ai.impact.engine import (
    ZoneImpactAssessment, 
    ImpactSummaryData,
    RoadImpactItem,
    HospitalImpactItem,
    SchoolImpactItem,
    ShelterAnalysisItem
)


class ImpactSummaryResponse(BaseModel):
    generated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    scenario_rainfall_24h_mm: float
    data_label: str = "SAMPLE IMPACT DATA (SIH26071)"
    summary: ImpactSummaryData


class ZoneImpactListResponse(BaseModel):
    generated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    scenario_rainfall_24h_mm: float
    data_label: str = "SAMPLE IMPACT DATA (SIH26071)"
    total_zones: int
    ranked_zones: List[ZoneImpactAssessment]


class PopulationExposureItem(BaseModel):
    zone_id: str
    zone_name: str
    population_exposed: int
    population_density_per_sqkm: int
    pct_population_affected: float
    social_vulnerability_index: float
    priority_level: str


class PopulationExposureResponse(BaseModel):
    generated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    scenario_rainfall_24h_mm: float
    total_exposed_population: int
    data_label: str = "SAMPLE POPULATION DATA (SIH26071)"
    zones: List[PopulationExposureItem]


class RoadImpactResponse(BaseModel):
    generated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    total_roads_monitored: int
    impassable_roads_count: int
    data_label: str = "SAMPLE ROAD DATA (SIH26071)"
    roads: List[RoadImpactItem]


class HospitalImpactResponse(BaseModel):
    generated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    total_hospitals_monitored: int
    threatened_hospitals_count: int
    total_icu_beds_threatened: int
    data_label: str = "SAMPLE HEALTHCARE DATA (SIH26071)"
    hospitals: List[HospitalImpactItem]


class SchoolImpactResponse(BaseModel):
    generated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    total_schools_monitored: int
    inundated_schools_count: int
    data_label: str = "SAMPLE EDUCATION DATA (SIH26071)"
    schools: List[SchoolImpactItem]


class ShelterAnalysisResponse(BaseModel):
    generated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    total_shelters_active: int
    total_capacity: int
    total_estimated_demand: int
    capacity_status: str
    data_label: str = "SAMPLE SHELTER DATA (SIH26071)"
    shelters: List[ShelterAnalysisItem]
