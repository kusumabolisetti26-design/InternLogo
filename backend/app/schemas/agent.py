from __future__ import annotations
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional

class AgentQueryRequest(BaseModel):
    query: str = Field(..., description="Natural language disaster question or command")
    context_zone: Optional[str] = Field(default=None, description="Optional zone ID in focus")

class ToolExecutionRecord(BaseModel):
    tool_name: str
    tool_input: Dict[str, Any]
    output_summary: str
    execution_time_ms: float = 12.0

class EmergencyResponsePlan(BaseModel):
    plan_id: str
    title: str
    target_zone_id: str
    target_zone_name: str
    risk_level: str
    priority_level: str
    immediate_actions: List[str]
    infrastructure_defenses: List[str]
    evacuation_corridor: str
    destination_shelter: str
    human_approval_status: str = "PENDING HUMAN APPROVAL"
    created_at: str

class AgentResponse(BaseModel):
    query: str
    intent_detected: str
    multi_step_thought_process: List[str]
    tools_executed: List[ToolExecutionRecord]
    synthesized_answer: str
    emergency_plan: Optional[EmergencyResponsePlan] = None
    data_grounding_verified: bool = True
    advisory_notice: str = "AI DECISION SUPPORT - REQUIRES AUTHORIZED HUMAN COMMAND SIGN-OFF"
    timestamp: str

class PlanGenerateRequest(BaseModel):
    zone_id: Optional[str] = Field(default=None, description="Target zone for response plan, or None for citywide plan")

class DeploymentOrder(BaseModel):
    asset: str
    target_sector: str
    priority: str
    mission: str

class EmergencyResponsePlanResponse(BaseModel):
    plan_id: str
    timestamp: str
    status: str
    target_sector: str
    overall_threat_level: str
    situation_summary: str
    action_directives: List[str]
    deployment_orders: List[DeploymentOrder]
    evacuation_guidelines: List[str]
    shelter_strategy: str
    approval_status: str
    human_in_the_loop_notice: str
