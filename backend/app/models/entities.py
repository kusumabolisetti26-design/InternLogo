from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Float
)
from sqlalchemy.orm import relationship
from app.database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="student")  # 'student', 'company', 'admin'
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    company_profile = relationship("CompanyProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    college = Column(String(255), nullable=True)
    degree = Column(String(100), nullable=True)
    branch = Column(String(100), nullable=True)
    graduation_year = Column(Integer, nullable=True)
    career_goal = Column(String(255), nullable=True)
    preferred_domain = Column(String(100), nullable=True)
    preferred_location = Column(String(100), nullable=True)
    work_mode_preference = Column(String(50), default="Any")  # 'Remote', 'On-site', 'Hybrid', 'Any'
    min_stipend = Column(Integer, default=0)
    duration_preference = Column(String(50), default="3-6 months")
    experience_summary = Column(Text, nullable=True)
    certifications = Column(Text, nullable=True)  # Comma-separated or text
    completed_onboarding = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="student_profile")
    skills = relationship("StudentSkill", back_populates="student", cascade="all, delete-orphan")
    saved_internships = relationship("SavedInternship", back_populates="student", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="student", cascade="all, delete-orphan")
    journey_steps = relationship("JourneyStep", back_populates="student", cascade="all, delete-orphan")


class CompanyProfile(Base):
    __tablename__ = "company_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    company_name = Column(String(255), nullable=False)
    website = Column(String(255), nullable=True)
    industry = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    verified = Column(Boolean, default=False)
    contact_email = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    logo_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="company_profile")
    internships = relationship("Internship", back_populates="company", cascade="all, delete-orphan")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    category = Column(String(50), nullable=False)  # 'Frontend', 'Backend', 'AI/ML', 'Cloud', 'Data', 'General'


class StudentSkill(Base):
    __tablename__ = "student_skills"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String(100), nullable=False)
    proficiency = Column(String(50), default="Intermediate")  # 'Beginner', 'Intermediate', 'Advanced'

    student = relationship("StudentProfile", back_populates="skills")


class Internship(Base):
    __tablename__ = "internships"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("company_profiles.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=False)
    responsibilities = Column(Text, nullable=True)
    requirements = Column(Text, nullable=True)
    required_skills = Column(Text, nullable=False)  # Comma-separated: "Python, PyTorch, SQL"
    preferred_skills = Column(Text, nullable=True)  # Comma-separated: "Docker, AWS"
    qualifications = Column(String(255), nullable=True)
    location = Column(String(255), nullable=False)
    work_mode = Column(String(50), nullable=False, default="Remote")  # 'Remote', 'Hybrid', 'On-site'
    duration = Column(String(50), nullable=False)  # e.g., '3 Months', '6 Months'
    stipend = Column(String(100), nullable=False)  # e.g., '₹35,000 / month'
    stipend_amount = Column(Integer, default=0)
    domain = Column(String(100), nullable=False, index=True)  # 'AI/ML', 'Software Development', etc.
    application_url = Column(String(500), nullable=True)
    deadline = Column(String(100), nullable=True)
    company_website = Column(String(255), nullable=True)
    company_description = Column(Text, nullable=True)
    verification_status = Column(String(50), default="Verified")  # 'Verified', 'Under Review', 'Flagged'
    trust_score = Column(Integer, default=85)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    company = relationship("CompanyProfile", back_populates="internships")
    applications = relationship("Application", back_populates="internship", cascade="all, delete-orphan")
    saved_by = relationship("SavedInternship", back_populates="internship", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="internship", cascade="all, delete-orphan")


class SavedInternship(Base):
    __tablename__ = "saved_internships"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    internship_id = Column(Integer, ForeignKey("internships.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("StudentProfile", back_populates="saved_internships")
    internship = relationship("Internship", back_populates="saved_by")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    internship_id = Column(Integer, ForeignKey("internships.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), default="Applied")  # 'Saved', 'Applied', 'Assessment', 'Interview', 'Selected', 'Rejected'
    applied_at = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, nullable=True)
    interview_date = Column(String(100), nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    student = relationship("StudentProfile", back_populates="applications")
    internship = relationship("Internship", back_populates="applications")


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    internship_id = Column(Integer, ForeignKey("internships.id", ondelete="CASCADE"), nullable=False)
    reason = Column(String(255), nullable=False)
    details = Column(Text, nullable=True)
    status = Column(String(50), default="Pending")  # 'Pending', 'Reviewed', 'Action Taken'
    created_at = Column(DateTime, default=datetime.utcnow)

    internship = relationship("Internship", back_populates="reports")


class JourneyStep(Base):
    __tablename__ = "journey_steps"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    step_number = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    skills = Column(String(255), nullable=True)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("StudentProfile", back_populates="journey_steps")
