from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import get_optional_current_user
from app.models.entities import User, StudentProfile
from app.schemas.schemas import ChatQuery, ChatResponse
from app.services.career_advisor import career_advisor

router = APIRouter(prefix="/assistant", tags=["AI Career Assistant"])

@router.post("/chat", response_model=ChatResponse)
def chat_with_advisor(
    query: ChatQuery,
    current_user: User = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    profile = None
    if current_user and current_user.role == "student":
        profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()

    result = career_advisor.answer_query(
        user_message=query.message,
        profile=profile,
        db=db,
        context_internship_id=query.context_internship_id
    )
    return result
