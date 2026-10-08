from pydantic import BaseModel, Field
from datetime import datetime, timezone


class HealthCheckResponse(BaseModel):
    status: str = Field(default="ok", description="Overall system health status")
    project: str = Field(default="FloodGuard AI", description="Project identity")
    version: str = Field(default="0.1.0", description="Current release version")
    environment: str = Field(default="development", description="Current operating environment")
    mode: str = Field(default="PROTOTYPE", description="Execution mode")
    timestamp: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat(),
        description="Current UTC timestamp"
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "status": "ok",
                "project": "FloodGuard AI",
                "version": "0.1.0",
                "environment": "development",
                "mode": "PROTOTYPE",
                "timestamp": "2026-09-10T09:00:00.000000+00:00"
            }
        }
    }
