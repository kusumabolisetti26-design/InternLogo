from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import get_current_student
from app.models.entities import User, StudentProfile, Internship, Application
from app.schemas.schemas import ApplicationCreate, ApplicationUpdate, ApplicationOut
from app.api.internships import _enrich_internship_response

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.get("", response_model=List[ApplicationOut])
def get_student_applications(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile not found")

    apps = db.query(Application).filter(Application.student_id == profile.id).order_by(Application.applied_at.desc()).all()
    results = []
    for app in apps:
        app_out = {
            "id": app.id,
            "student_id": app.student_id,
            "internship_id": app.internship_id,
            "status": app.status,
            "applied_at": app.applied_at,
            "notes": app.notes,
            "interview_date": app.interview_date,
            "updated_at": app.updated_at,
            "internship": _enrich_internship_response(app.internship, current_user, db) if app.internship else None
        }
        results.append(app_out)
    return results

@router.post("", response_model=ApplicationOut)
def apply_to_internship(
    payload: ApplicationCreate,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile not found")

    internship = db.query(Internship).filter(Internship.id == payload.internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    # Check if already applied
    existing = db.query(Application).filter(
        Application.student_id == profile.id,
        Application.internship_id == payload.internship_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="You have already submitted an application for this opportunity")

    new_app = Application(
        student_id=profile.id,
        internship_id=payload.internship_id,
        status="Applied",
        notes=payload.notes or "Application submitted via InternLogo",
        applied_at=datetime.utcnow()
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)

    return {
        "id": new_app.id,
        "student_id": new_app.student_id,
        "internship_id": new_app.internship_id,
        "status": new_app.status,
        "applied_at": new_app.applied_at,
        "notes": new_app.notes,
        "interview_date": new_app.interview_date,
        "updated_at": new_app.updated_at,
        "internship": _enrich_internship_response(internship, current_user, db)
    }

@router.put("/{id}", response_model=ApplicationOut)
def update_application(
    id: int,
    payload: ApplicationUpdate,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile not found")

    app = db.query(Application).filter(
        Application.id == id,
        Application.student_id == profile.id
    ).first()

    if not app:
        raise HTTPException(status_code=404, detail="Application record not found")

    valid_statuses = ["Saved", "Applied", "Assessment", "Interview", "Selected", "Rejected"]
    if payload.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")

    app.status = payload.status
    if payload.notes is not None:
        app.notes = payload.notes
    if payload.interview_date is not None:
        app.interview_date = payload.interview_date
    app.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(app)

    return {
        "id": app.id,
        "student_id": app.student_id,
        "internship_id": app.internship_id,
        "status": app.status,
        "applied_at": app.applied_at,
        "notes": app.notes,
        "interview_date": app.interview_date,
        "updated_at": app.updated_at,
        "internship": _enrich_internship_response(app.internship, current_user, db) if app.internship else None
    }

@router.delete("/{id}")
def delete_application(
    id: int,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile not found")

    app = db.query(Application).filter(
        Application.id == id,
        Application.student_id == profile.id
    ).first()

    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    db.delete(app)
    db.commit()
    return {"message": "Application deleted from tracker", "success": True}
