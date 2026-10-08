from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from app.database.session import get_db
from app.core.dependencies import get_current_user, get_optional_current_user, get_current_company, get_current_student
from app.models.entities import (
    Internship, User, StudentProfile, CompanyProfile, SavedInternship, Application, Report
)
from app.schemas.schemas import InternshipOut, InternshipCreate, InternshipUpdate, ReportCreate
from app.services.matching_service import matching_service
from app.services.trust_scanner import trust_scanner

router = APIRouter(prefix="/internships", tags=["Internships"])

def _enrich_internship_response(internship: Internship, current_user: Optional[User], db: Session) -> dict:
    data = {
        "id": internship.id,
        "company_id": internship.company_id,
        "company_name": internship.company.company_name if internship.company else "Independent Tech",
        "company_logo": internship.company.logo_url if internship.company else None,
        "company_verified": internship.company.verified if internship.company else False,
        "title": internship.title,
        "description": internship.description,
        "responsibilities": internship.responsibilities,
        "requirements": internship.requirements,
        "required_skills": internship.required_skills,
        "preferred_skills": internship.preferred_skills,
        "qualifications": internship.qualifications,
        "location": internship.location,
        "work_mode": internship.work_mode,
        "duration": internship.duration,
        "stipend": internship.stipend,
        "stipend_amount": internship.stipend_amount,
        "domain": internship.domain,
        "application_url": internship.application_url,
        "deadline": internship.deadline,
        "company_website": internship.company_website,
        "company_description": internship.company_description,
        "verification_status": internship.verification_status,
        "trust_score": internship.trust_score,
        "created_at": internship.created_at,
        "fit_score": None,
        "is_saved": False,
        "application_status": None
    }

    if current_user and current_user.role == "student":
        student_profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
        if student_profile:
            student_skills = [s.skill_name for s in student_profile.skills]
            fit_result = matching_service.calculate_fit(student_profile, student_skills, internship)
            data["fit_score"] = fit_result["overall_fit"]

            # Check if saved
            saved = db.query(SavedInternship).filter(
                SavedInternship.student_id == student_profile.id,
                SavedInternship.internship_id == internship.id
            ).first()
            data["is_saved"] = bool(saved)

            # Check if applied
            application = db.query(Application).filter(
                Application.student_id == student_profile.id,
                Application.internship_id == internship.id
            ).first()
            if application:
                data["application_status"] = application.status

    return data

@router.get("", response_model=List[InternshipOut])
def list_internships(
    query: Optional[str] = None,
    domain: Optional[str] = None,
    work_mode: Optional[str] = None,
    location: Optional[str] = None,
    min_stipend: Optional[int] = None,
    sort_by: Optional[str] = "date",  # 'date', 'fit', 'trust', 'stipend'
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    q = db.query(Internship)

    if query:
        search_pattern = f"%{query}%"
        q = q.filter(
            or_(
                Internship.title.ilike(search_pattern),
                Internship.description.ilike(search_pattern),
                Internship.required_skills.ilike(search_pattern),
                Internship.location.ilike(search_pattern),
                Internship.domain.ilike(search_pattern)
            )
        )

    if domain and domain.lower() != "all":
        q = q.filter(Internship.domain.ilike(f"%{domain}%"))

    if work_mode and work_mode.lower() != "all":
        q = q.filter(Internship.work_mode.ilike(f"%{work_mode}%"))

    if location and location.lower() != "all":
        q = q.filter(Internship.location.ilike(f"%{location}%"))

    if min_stipend:
        q = q.filter(Internship.stipend_amount >= min_stipend)

    internships = q.all()
    enriched = [_enrich_internship_response(i, current_user, db) for i in internships]

    # Sort
    if sort_by == "fit" and current_user and current_user.role == "student":
        enriched.sort(key=lambda x: (x["fit_score"] or 0), reverse=True)
    elif sort_by == "trust":
        enriched.sort(key=lambda x: x["trust_score"], reverse=True)
    elif sort_by == "stipend":
        enriched.sort(key=lambda x: (x["stipend_amount"] or 0), reverse=True)
    else:
        enriched.sort(key=lambda x: x["created_at"], reverse=True)

    return enriched[offset : offset + limit]

@router.get("/{id}", response_model=InternshipOut)
def get_internship_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    internship = db.query(Internship).filter(Internship.id == id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship opportunity not found")
    return _enrich_internship_response(internship, current_user, db)

@router.post("", response_model=InternshipOut)
def create_internship(
    item_in: InternshipCreate,
    current_user: User = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    company_profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not company_profile:
        raise HTTPException(status_code=400, detail="Company profile not initialized")

    internship = Internship(
        company_id=company_profile.id,
        **item_in.model_dump()
    )
    db.add(internship)
    db.commit()
    db.refresh(internship)

    # Automatically scan trust score upon listing creation
    trust_res = trust_scanner.scan_internship(internship)
    internship.trust_score = trust_res["trust_score"]
    internship.verification_status = trust_res["verification_status"]
    db.commit()
    db.refresh(internship)

    return _enrich_internship_response(internship, current_user, db)

@router.put("/{id}", response_model=InternshipOut)
def update_internship(
    id: int,
    item_in: InternshipUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    internship = db.query(Internship).filter(Internship.id == id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    # Only company owner or admin can edit
    if current_user.role != "admin":
        company_profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
        if not company_profile or internship.company_id != company_profile.id:
            raise HTTPException(status_code=403, detail="Unauthorized to edit this internship")

    update_dict = item_in.model_dump(exclude_unset=True)
    for k, v in update_dict.items():
        setattr(internship, k, v)

    # Recalculate trust
    trust_res = trust_scanner.scan_internship(internship)
    internship.trust_score = trust_res["trust_score"]
    db.commit()
    db.refresh(internship)

    return _enrich_internship_response(internship, current_user, db)

@router.post("/{id}/report")
def report_internship(
    id: int,
    report_in: ReportCreate,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    internship = db.query(Internship).filter(Internship.id == id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile required")

    report = Report(
        student_id=profile.id,
        internship_id=id,
        reason=report_in.reason,
        details=report_in.details,
        status="Pending"
    )
    db.add(report)
    db.commit()

    return {"message": "Thank you for helping keep InternLogo secure. Report received for audit review.", "success": True}
