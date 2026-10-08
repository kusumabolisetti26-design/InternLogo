from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import get_current_student
from app.models.entities import User, StudentProfile, Internship, SavedInternship, Application
from app.schemas.schemas import FitScoreBreakdown, InternshipOut
from app.services.matching_service import matching_service
from app.api.internships import _enrich_internship_response

router = APIRouter(prefix="/matching", tags=["AI Matching"])

@router.get("/recommendations")
def get_recommendations(
    limit: int = 10,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile not found")

    student_skills = [s.skill_name for s in profile.skills]
    internships = db.query(Internship).filter(Internship.verification_status != "Flagged").all()

    scored = []
    for intern in internships:
        fit = matching_service.calculate_fit(profile, student_skills, intern)
        enriched = _enrich_internship_response(intern, current_user, db)
        enriched["fit_score"] = fit["overall_fit"]
        scored.append({
            "internship": enriched,
            "fit_score": fit["overall_fit"],
            "breakdown": fit
        })

    # Sort descending by overall_fit
    scored.sort(key=lambda x: x["fit_score"], reverse=True)
    return scored[:limit]

@router.get("/{internship_id}/fit", response_model=FitScoreBreakdown)
def get_internship_fit(
    internship_id: int,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile not found")

    student_skills = [s.skill_name for s in profile.skills]
    fit_result = matching_service.calculate_fit(profile, student_skills, internship)
    return fit_result
