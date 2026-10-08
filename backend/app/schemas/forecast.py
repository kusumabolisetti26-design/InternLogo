from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from datetime import datetime, timezone


class HorizonItem(BaseModel):
    horizon_hours: int
    predicted_cumulative_mm: float
    lower_bound_mm: float
    upper_bound_mm: float


class ForecastResponse(BaseModel):
    target_zone: str = "Zone-01 (Urban Command Sector)"
    generated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    data_label: str = "SIMULATION DATA (SIH26071)"
    current_fused_rate_mmph: float
    horizons: Dict[str, HorizonItem]
    imd_alert_category: str
    imd_alert_color: str
    confidence_score: float
    forecast_summary: str
    model_name: str
    active_sources: List[str]
    missing_sources: List[str]


class ForecastRequest(BaseModel):
    target_zone: Optional[str] = "Zone-01 (Urban Command Sector)"
    temperature_c: Optional[float] = 27.5
    relative_humidity_pct: Optional[float] = 92.0
    pressure_hpa: Optional[float] = 1002.5
    radar_dbz: Optional[float] = 48.0
    satellite_tb_k: Optional[float] = 212.0
    aws_rain_rate_mmph: Optional[float] = 38.0
    nwp_forecast_rain_mmph: Optional[float] = 32.0
