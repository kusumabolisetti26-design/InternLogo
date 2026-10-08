export type UserRole = 'student' | 'company' | 'admin';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface StudentSkill {
  id: number;
  skill_name: string;
  proficiency: string;
}

export interface StudentProfile {
  id: number;
  user_id: number;
  college?: string;
  degree?: string;
  branch?: string;
  graduation_year?: number;
  career_goal?: string;
  preferred_domain?: string;
  preferred_location?: string;
  work_mode_preference?: string;
  min_stipend?: number;
  duration_preference?: string;
  experience_summary?: string;
  certifications?: string;
  completed_onboarding: boolean;
  skills: StudentSkill[];
}

export interface CompanyProfile {
  id: number;
  user_id: number;
  company_name: string;
  website?: string;
  industry?: string;
  description?: string;
  verified: boolean;
  contact_email?: string;
  location?: string;
  logo_url?: string;
  created_at: string;
}

export interface Internship {
  id: number;
  company_id: number;
  company_name?: string;
  company_logo?: string;
  company_verified?: boolean;
  title: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  required_skills: string;
  preferred_skills?: string;
  qualifications?: string;
  location: string;
  work_mode: string;
  duration: string;
  stipend: string;
  stipend_amount?: number;
  domain: string;
  application_url?: string;
  deadline?: string;
  company_website?: string;
  company_description?: string;
  verification_status: 'Verified' | 'Under Review' | 'Flagged' | 'Standard';
  trust_score: number;
  created_at: string;
  fit_score?: number;
  is_saved?: boolean;
  application_status?: string;
}

export interface FitScoreBreakdown {
  overall_fit: number;
  skill_match: number;
  career_alignment: number;
  qualification_match: number;
  interest_match: number;
  experience_match: number;
  matched_skills: string[];
  missing_skills: string[];
  explanation: string;
}

export interface TrustAnalysis {
  trust_score: number;
  trust_level: 'High Trust' | 'Moderate Trust' | 'Needs Verification' | 'High Risk';
  positive_indicators: string[];
  risk_indicators: string[];
  explanation: string;
  verification_status: string;
}

export type ApplicationStatus = 'Saved' | 'Applied' | 'Assessment' | 'Interview' | 'Selected' | 'Rejected';

export interface Application {
  id: number;
  student_id: number;
  internship_id: number;
  status: ApplicationStatus;
  applied_at: string;
  notes?: string;
  interview_date?: string;
  updated_at?: string;
  internship?: Internship;
}

export interface JourneyStep {
  id: number;
  step_number: number;
  title: string;
  description?: string;
  skills?: string;
  is_completed: boolean;
}

export interface SkillGapAnalysisData {
  career_goal: string;
  preferred_domain: string;
  current_skills: string[];
  matched_skills: string[];
  top_missing_skills: Array<{ skill: string; frequency: number; impact: string }>;
  learning_recommendations: Array<{
    skill: string;
    demand_count: number;
    title: string;
    provider: string;
    duration: string;
    difficulty: string;
    focus: string;
  }>;
  total_analyzed_opportunities: number;
}
