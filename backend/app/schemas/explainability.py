"""
Pydantic Schemas for Explainable AI (XAI) & Human-in-the-Loop (HITL) Decision Support.
"""
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from ai.explainability.engine import FeatureContribution, RainfallExplanation, ZoneExplanation, NaturalLanguageAnswer
from ai.explainability.recommendations import RecommendationItem, AuditLogEntry


class RainfallExplainResponse(BaseModel):
    status: str = "success"
    explanation: RainfallExplanation


class ZoneExplainResponse(BaseModel):
    status: str = "success"
    zone: ZoneExplanation


class NaturalQueryRequest(BaseModel):
    query: str = Field(..., description="Natural language question, e.g., 'Why is Zone-02 critical?'")
    zone_id: Optional[str] = Field(None, description="Optional target zone ID (e.g. ZONE-02)")
    rainfall_24h_mm: float = Field(default=125.0, ge=0.0, le=500.0)


class NaturalQueryResponse(BaseModel):
    status: str = "success"
    result: NaturalLanguageAnswer


class RecommendationsListResponse(BaseModel):
    status: str = "success"
    total_recommendations: int
    pending_count: int
    approved_count: int
    modified_count: int
    rejected_count: int
    recommendations: List[RecommendationItem]


class RecommendationDetailResponse(BaseModel):
    status: str = "success"
    recommendation: RecommendationItem


class ApproveRecommendationRequest(BaseModel):
    reviewer_name: str = Field(..., min_length=2, description="Name and title of authorized authority reviewer")
    notes: Optional[str] = Field(None, description="Optional operational sign-off notes")


class ModifyRecommendationRequest(BaseModel):
    reviewer_name: str = Field(..., min_length=2, description="Name and title of authorized authority reviewer")
    modified_action: str = Field(..., min_length=5, description="Amended tactical directive text")
    notes: Optional[str] = Field(None, description="Reason for amendment")


class RejectRecommendationRequest(BaseModel):
    reviewer_name: str = Field(..., min_length=2, description="Name and title of authorized authority reviewer")
    reason: str = Field(..., min_length=5, description="Mandatory justification for rejecting recommendation")


class AuditLogsResponse(BaseModel):
    status: str = "success"
    total_logs: int
    logs: List[AuditLogEntry]


class AuditSummaryResponse(BaseModel):
    status: str = "success"
    total_actions: int
    approved_count: int
    modified_count: int
    rejected_count: int
    last_audit_timestamp: Optional[str]
