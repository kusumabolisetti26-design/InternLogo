from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

# ----------------- Auth & User Schemas -----------------
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "student"  # 'student', 'company', 'admin'

class UserCreate(UserBase):
    password: str
    college: Optional[str] = None
    degree: Optional[str] = None
    branch: Optional[str] = None
    graduation_year: Optional[int] = None
    company_name: Optional[str] = None  # for company registration

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None
    user_id: Optional[int] = None

# ----------------- Student Profile Schemas -----------------
class StudentSkillBase(BaseModel):
    skill_name: str
    proficiency: str = "Intermediate"

class StudentSkillCreate(StudentSkillBase):
    pass

class StudentSkillOut(StudentSkillBase):
    id: int

    class Config:
        from_attributes = True

class StudentProfileBase(BaseModel):
    college: Optional[str] = None
    degree: Optional[str] = None
    branch: Optional[str] = None
    graduation_year: Optional[int] = None
    career_goal: Optional[str] = None
    preferred_domain: Optional[str] = None
    preferred_location: Optional[str] = None
    work_mode_preference: Optional[str] = "Any"
    min_stipend: Optional[int] = 0
    duration_preference: Optional[str] = "3-6 months"
    experience_summary: Optional[str] = None
    certifications: Optional[str] = None
    completed_onboarding: Optional[bool] = False

class StudentProfileUpdate(StudentProfileBase):
    skills: Optional[List[str]] = None

class StudentProfileOut(StudentProfileBase):
    id: int
    user_id: int
    skills: List[StudentSkillOut] = []

    class Config:
        from_attributes = True

# ----------------- Company Profile Schemas -----------------
class CompanyProfileBase(BaseModel):
    company_name: str
    website: Optional[str] = None
    industry: Optional[str] = None
    description: Optional[str] = None
    contact_email: Optional[str] = None
    location: Optional[str] = None
    logo_url: Optional[str] = None

class CompanyProfileCreate(CompanyProfileBase):
    pass

class CompanyProfileUpdate(BaseModel):
    company_name: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    description: Optional[str] = None
    contact_email: Optional[str] = None
    location: Optional[str] = None
    logo_url: Optional[str] = None

class CompanyProfileOut(CompanyProfileBase):
    id: int
    user_id: int
    verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Internship Schemas -----------------
class InternshipBase(BaseModel):
    title: str
    description: str
    responsibilities: Optional[str] = None
    requirements: Optional[str] = None
    required_skills: str
    preferred_skills: Optional[str] = None
    qualifications: Optional[str] = None
    location: str
    work_mode: str = "Remote"
    duration: str
    stipend: str
    stipend_amount: Optional[int] = 0
    domain: str
    application_url: Optional[str] = None
    deadline: Optional[str] = None
    company_website: Optional[str] = None
    company_description: Optional[str] = None

class InternshipCreate(InternshipBase):
    pass

class InternshipUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    responsibilities: Optional[str] = None
    requirements: Optional[str] = None
    required_skills: Optional[str] = None
    preferred_skills: Optional[str] = None
    qualifications: Optional[str] = None
    location: Optional[str] = None
    work_mode: Optional[str] = None
    duration: Optional[str] = None
    stipend: Optional[str] = None
    stipend_amount: Optional[int] = None
    domain: Optional[str] = None
    application_url: Optional[str] = None
    deadline: Optional[str] = None
    verification_status: Optional[str] = None

class InternshipOut(InternshipBase):
    id: int
    company_id: int
    company_name: Optional[str] = None
    company_logo: Optional[str] = None
    company_verified: Optional[bool] = False
    verification_status: str
    trust_score: int
    created_at: datetime
    # Dynamic fields calculated per student if authenticated
    fit_score: Optional[int] = None
    is_saved: Optional[bool] = False
    application_status: Optional[str] = None

    class Config:
        from_attributes = True

# ----------------- AI Matching & Fit Schemas -----------------
class FitScoreBreakdown(BaseModel):
    overall_fit: int
    skill_match: int
    career_alignment: int
    qualification_match: int
    interest_match: int
    experience_match: int
    matched_skills: List[str]
    missing_skills: List[str]
    explanation: str

# ----------------- AI Trust Scanner Schemas -----------------
class TrustAnalysisResponse(BaseModel):
    trust_score: int
    trust_level: str  # 'High Trust', 'Moderate Trust', 'Needs Verification', 'High Risk'
    positive_indicators: List[str]
    risk_indicators: List[str]
    explanation: str
    verification_status: str

# ----------------- Application Tracking Schemas -----------------
class ApplicationCreate(BaseModel):
    internship_id: int
    notes: Optional[str] = None

class ApplicationUpdate(BaseModel):
    status: str
    notes: Optional[str] = None
    interview_date: Optional[str] = None

class ApplicationOut(BaseModel):
    id: int
    student_id: int
    internship_id: int
    status: str
    applied_at: datetime
    notes: Optional[str] = None
    interview_date: Optional[str] = None
    updated_at: Optional[datetime] = None
    internship: Optional[InternshipOut] = None

    class Config:
        from_attributes = True

# ----------------- Journey Schemas -----------------
class JourneyStepOut(BaseModel):
    id: int
    step_number: int
    title: str
    description: Optional[str] = None
    skills: Optional[str] = None
    is_completed: bool

    class Config:
        from_attributes = True

class JourneyStepUpdate(BaseModel):
    is_completed: bool

# ----------------- Assistant Schemas -----------------
class ChatQuery(BaseModel):
    message: str
    context_internship_id: Optional[int] = None

class ChatResponse(BaseModel):
    reply: str
    suggested_actions: Optional[List[str]] = []
    related_internship_ids: Optional[List[int]] = []

# ----------------- Report Schema -----------------
class ReportCreate(BaseModel):
    internship_id: int
    reason: str
    details: Optional[str] = None
