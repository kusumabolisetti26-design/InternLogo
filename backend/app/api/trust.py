from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.entities import Internship
from app.schemas.schemas import TrustAnalysisResponse
from app.services.trust_scanner import trust_scanner

router = APIRouter(prefix="/trust", tags=["Trust Scanner"])

@router.get("/{internship_id}", response_model=TrustAnalysisResponse)
def get_internship_trust_scan(
    internship_id: int,
    db: Session = Depends(get_db)
):
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    result = trust_scanner.scan_internship(internship)
    return result
