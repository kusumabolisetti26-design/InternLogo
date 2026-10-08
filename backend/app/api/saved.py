from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import get_current_student
from app.models.entities import User, StudentProfile, Internship, SavedInternship
from app.schemas.schemas import InternshipOut
from app.api.internships import _enrich_internship_response

router = APIRouter(prefix="/saved", tags=["Saved Internships"])

@router.get("", response_model=List[InternshipOut])
def get_saved_internships(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile not found")

    saved_items = db.query(SavedInternship).filter(SavedInternship.student_id == profile.id).all()
    results = []
    for item in saved_items:
        internship = item.internship
        if internship:
            results.append(_enrich_internship_response(internship, current_user, db))
    return results

@router.post("/{internship_id}")
def save_internship(
    internship_id: int,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile not found")

    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    existing = db.query(SavedInternship).filter(
        SavedInternship.student_id == profile.id,
        SavedInternship.internship_id == internship_id
    ).first()

    if not existing:
        saved = SavedInternship(student_id=profile.id, internship_id=internship_id)
        db.add(saved)
        db.commit()

    return {"message": "Internship bookmarked successfully", "is_saved": True}

@router.delete("/{internship_id}")
def remove_saved_internship(
    internship_id: int,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile not found")

    saved = db.query(SavedInternship).filter(
        SavedInternship.student_id == profile.id,
        SavedInternship.internship_id == internship_id
    ).first()

    if saved:
        db.delete(saved)
        db.commit()

    return {"message": "Internship bookmark removed", "is_saved": False}
