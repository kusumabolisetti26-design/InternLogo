from __future__ import annotations
from pydantic import BaseModel
from typing import Dict, Any, List, Optional

class HostMetrics(BaseModel):
    cpu_utilization_percent: float
    memory_used_percent: float
    memory_available_mb: float
    disk_free_gb: float
    python_version: str
    os: str
    architecture: str

class SubsystemStatus(BaseModel):
    status: str
    message: str
    operational: Optional[bool] = None
    layers_present: Optional[bool] = None
    records_available: Optional[bool] = None
    file_present: Optional[bool] = None
    tools_registered: Optional[List[str]] = None
    algorithms: Optional[List[str]] = None
    models_loaded: Optional[List[str]] = None
    sectors_count: Optional[int] = None
    features_loaded: Optional[int] = None

class SystemHealthResponse(BaseModel):
    system: str
    version: str
    overall_status: str
    timestamp: str
    telemetry_latency_ms: float
    host_metrics: HostMetrics
    subsystems: Dict[str, Any]
    failover_mode: str
    sih_problem_code: str
