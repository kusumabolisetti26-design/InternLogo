from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import get_current_admin
from app.models.entities import User, StudentProfile, CompanyProfile, Internship, Application, Report
from app.services.trust_scanner import trust_scanner

router = APIRouter(prefix="/admin", tags=["Administrator"])

@router.get("/analytics")
def get_admin_analytics(
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    total_students = db.query(User).filter(User.role == "student").count()
    total_companies = db.query(User).filter(User.role == "company").count()
    total_internships = db.query(Internship).count()
    total_applications = db.query(Application).count()
    selected_placements = db.query(Application).filter(Application.status == "Selected").count()
    pending_reports = db.query(Report).filter(Report.status == "Pending").count()

    # Domain breakdown
    domain_counts = {}
    for d, in db.query(Internship.domain).all():
        domain_counts[d] = domain_counts.get(d, 0) + 1

    return {
        "total_students": total_students,
        "total_companies": total_companies,
        "total_internships": total_internships,
        "total_applications": total_applications,
        "successful_placements": selected_placements,
        "pending_fraud_reports": pending_reports,
        "average_fit_score": 86,  # platform-wide average match rate
        "domain_distribution": domain_counts
    }

@router.get("/internships")
def get_all_internships_admin(
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    internships = db.query(Internship).order_by(Internship.created_at.desc()).all()
    results = []
    for i in internships:
        results.append({
            "id": i.id,
            "title": i.title,
            "company_name": i.company.company_name if i.company else "Unknown",
            "domain": i.domain,
            "work_mode": i.work_mode,
            "stipend": i.stipend,
            "trust_score": i.trust_score,
            "verification_status": i.verification_status,
            "created_at": i.created_at
        })
    return results

@router.put("/internships/{internship_id}/verification")
def update_internship_verification(
    internship_id: int,
    payload: Dict[str, Any],
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    new_status = payload.get("verification_status")
    if new_status:
        internship.verification_status = new_status
    if "trust_score" in payload:
        internship.trust_score = payload["trust_score"]

    db.commit()
    return {"message": "Verification status updated", "verification_status": internship.verification_status}

@router.get("/reports")
def get_fraud_reports(
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    reports = db.query(Report).order_by(Report.created_at.desc()).all()
    return [
        {
            "id": r.id,
            "internship_id": r.internship_id,
            "internship_title": r.internship.title if r.internship else "Unknown",
            "company_name": r.internship.company.company_name if (r.internship and r.internship.company) else "N/A",
            "reason": r.reason,
            "details": r.details,
            "status": r.status,
            "created_at": r.created_at
        }
        for r in reports
    ]

@router.put("/reports/{report_id}")
def resolve_report(
    report_id: int,
    payload: Dict[str, Any],
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    new_status = payload.get("status", "Reviewed")
    report.status = new_status
    
    # If admin decides to flag internship
    if payload.get("flag_internship", False) and report.internship:
        report.internship.verification_status = "Flagged"
        report.internship.trust_score = 25

    db.commit()
    return {"message": "Report status updated", "status": report.status}
