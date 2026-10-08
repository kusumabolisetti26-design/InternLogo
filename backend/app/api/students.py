from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import get_current_student
from app.models.entities import User, StudentProfile, StudentSkill, JourneyStep
from app.schemas.schemas import StudentProfileOut, StudentProfileUpdate

router = APIRouter(prefix="/students", tags=["Students"])

@router.get("/profile", response_model=StudentProfileOut)
def get_student_profile(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.put("/profile", response_model=StudentProfileOut)
def update_student_profile(
    profile_data: StudentProfileUpdate,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    update_dict = profile_data.model_dump(exclude_unset=True, exclude={"skills"})
    for key, value in update_dict.items():
        setattr(profile, key, value)

    # If skills are provided, synchronize them
    if profile_data.skills is not None:
        db.query(StudentSkill).filter(StudentSkill.student_id == profile.id).delete()
        for skill_name in profile_data.skills:
            clean_name = skill_name.strip()
            if clean_name:
                db.add(StudentSkill(
                    student_id=profile.id,
                    skill_name=clean_name,
                    proficiency="Intermediate"
                ))

    db.commit()
    db.refresh(profile)
    return profile

@router.post("/onboarding")
def complete_onboarding(
    payload: Dict[str, Any],
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    # Populate all wizard fields
    profile.college = payload.get("college", profile.college)
    profile.degree = payload.get("degree", profile.degree)
    profile.branch = payload.get("branch", profile.branch)
    profile.graduation_year = payload.get("graduation_year", profile.graduation_year)
    profile.career_goal = payload.get("career_goal", profile.career_goal)
    profile.preferred_domain = payload.get("preferred_domain", profile.preferred_domain)
    profile.preferred_location = payload.get("preferred_location", profile.preferred_location)
    profile.work_mode_preference = payload.get("work_mode_preference", profile.work_mode_preference)
    profile.min_stipend = payload.get("min_stipend", profile.min_stipend)
    profile.duration_preference = payload.get("duration_preference", profile.duration_preference)
    profile.experience_summary = payload.get("experience_summary", profile.experience_summary)
    profile.certifications = payload.get("certifications", profile.certifications)
    profile.completed_onboarding = True

    # Save skills
    skills_list = payload.get("skills", [])
    if isinstance(skills_list, list):
        db.query(StudentSkill).filter(StudentSkill.student_id == profile.id).delete()
        for s in skills_list:
            if isinstance(s, str) and s.strip():
                db.add(StudentSkill(student_id=profile.id, skill_name=s.strip(), proficiency="Intermediate"))

    # Generate custom journey milestones if none exist
    existing_steps = db.query(JourneyStep).filter(JourneyStep.student_id == profile.id).count()
    if existing_steps == 0:
        goal = profile.career_goal or "Software Engineer"
        domain = profile.preferred_domain or "Technology"
        default_steps = [
            (1, f"Foundational {domain} Skills", f"Master core syntax, data structures, and algorithmic fundamentals for {goal}.", f"{skills_list[0] if skills_list else 'Python'}", True),
            (2, "Intermediate Frameworks & Project Architecture", "Build 2 structured full-stack or domain-specific repository projects.", "Git, REST APIs", False),
            (3, "Skill Gap Bridging & Certifications", "Address identified missing skills to elevate candidate fit scores above 85%.", "Documentation, Testing", False),
            (4, "Portfolio & Resume Optimization", "Deploy live demonstrations and polish GitHub/LinkedIn profiles for recruiters.", "Communication", False),
            (5, "Targeted InternLogo Applications", "Apply to verified openings matching your career goal and track stages on Kanban.", "Interview Readiness", False)
        ]
        for num, title, desc, sks, comp in default_steps:
            db.add(JourneyStep(
                student_id=profile.id,
                step_number=num,
                title=title,
                description=desc,
                skills=sks,
                is_completed=comp
            ))

    db.commit()
    return {"message": "Onboarding completed successfully!", "success": True}
