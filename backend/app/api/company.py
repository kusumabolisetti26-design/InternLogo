from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import get_current_company
from app.models.entities import User, CompanyProfile, Internship, Application, StudentProfile
from app.schemas.schemas import CompanyProfileOut, CompanyProfileUpdate, InternshipOut
from app.services.matching_service import matching_service

router = APIRouter(prefix="/company", tags=["Company Recruiter"])

@router.get("/profile", response_model=CompanyProfileOut)
def get_company_profile(
    current_user: User = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        profile = CompanyProfile(user_id=current_user.id, company_name=current_user.full_name)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.put("/profile", response_model=CompanyProfileOut)
def update_company_profile(
    payload: CompanyProfileUpdate,
    current_user: User = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        profile = CompanyProfile(user_id=current_user.id, company_name=current_user.full_name)
        db.add(profile)

    update_dict = payload.model_dump(exclude_unset=True)
    for k, v in update_dict.items():
        setattr(profile, k, v)

    db.commit()
    db.refresh(profile)
    return profile

@router.get("/dashboard")
def get_company_dashboard(
    current_user: User = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        return {"total_postings": 0, "total_applicants": 0, "active_postings": 0, "internships": []}

    internships = db.query(Internship).filter(Internship.company_id == profile.id).all()
    internship_ids = [i.id for i in internships]

    applications = db.query(Application).filter(Application.internship_id.in_(internship_ids)).all() if internship_ids else []

    postings_data = []
    for intern in internships:
        intern_apps = [a for a in applications if a.internship_id == intern.id]
        postings_data.append({
            "id": intern.id,
            "title": intern.title,
            "domain": intern.domain,
            "location": intern.location,
            "work_mode": intern.work_mode,
            "stipend": intern.stipend,
            "verification_status": intern.verification_status,
            "applicants_count": len(intern_apps),
            "created_at": intern.created_at
        })

    return {
        "company_name": profile.company_name,
        "verified": profile.verified,
        "total_postings": len(internships),
        "total_applicants": len(applications),
        "postings": postings_data
    }

@router.get("/internships/{internship_id}/candidates")
def get_internship_candidates(
    internship_id: int,
    current_user: User = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=400, detail="Company profile not found")

    internship = db.query(Internship).filter(
        Internship.id == internship_id,
        Internship.company_id == profile.id
    ).first()

    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found or unauthorized")

    applications = db.query(Application).filter(Application.internship_id == internship_id).all()

    candidates = []
    for app in applications:
        student = app.student
        student_user = student.user if student else None
        student_skills = [s.skill_name for s in student.skills] if student else []

        fit = matching_service.calculate_fit(student, student_skills, internship)

        candidates.append({
            "application_id": app.id,
            "student_id": student.id if student else None,
            "student_name": student_user.full_name if student_user else "Student Applicant",
            "student_email": student_user.email if student_user else "",
            "college": student.college if student else "N/A",
            "degree": student.degree if student else "N/A",
            "branch": student.branch if student else "N/A",
            "graduation_year": student.graduation_year if student else None,
            "career_goal": student.career_goal if student else "N/A",
            "skills": student_skills,
            "fit_score": fit["overall_fit"],
            "matched_skills": fit["matched_skills"],
            "missing_skills": fit["missing_skills"],
            "status": app.status,
            "applied_at": app.applied_at,
            "notes": app.notes,
            "interview_date": app.interview_date
        })

    # Sort descending by AI fit score
    candidates.sort(key=lambda x: x["fit_score"], reverse=True)

    return {
        "internship_title": internship.title,
        "internship_id": internship.id,
        "total_candidates": len(candidates),
        "candidates": candidates
    }

@router.put("/applications/{application_id}/status")
def update_candidate_status(
    application_id: int,
    payload: Dict[str, Any],
    current_user: User = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=400, detail="Company profile required")

    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if app.internship.company_id != profile.id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    new_status = payload.get("status")
    if new_status:
        app.status = new_status
    if "notes" in payload:
        app.notes = payload["notes"]
    if "interview_date" in payload:
        app.interview_date = payload["interview_date"]

    db.commit()
    return {"message": "Candidate application status updated", "status": app.status}
