from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import get_current_student
from app.models.entities import User, StudentProfile, JourneyStep
from app.schemas.schemas import JourneyStepOut, JourneyStepUpdate

router = APIRouter(prefix="/journey", tags=["Journey Planner"])

@router.get("", response_model=List[JourneyStepOut])
def get_journey_milestones(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile not found")

    steps = db.query(JourneyStep).filter(
        JourneyStep.student_id == profile.id
    ).order_by(JourneyStep.step_number.asc()).all()

    # If student has no steps yet, initialize standard milestone track
    if not steps:
        goal = profile.career_goal or "AI Engineer"
        initial_milestones = [
            (1, "Strengthen Core Programming Foundations", f"Master clean OOP principles, algorithms, and modular design for {goal}.", "Python, Git", True),
            (2, "Master Data Manipulation & Analysis", "Work with real tabular and unstructured datasets; analyze statistical distributions.", "Pandas, NumPy, SQL", True),
            (3, "Implement Core Machine Learning Models", "Build regression, classification, and ensemble pipelines using Scikit-learn.", "Machine Learning, Scikit-learn", False),
            (4, "Build 2 Production-Grade Portfolio Projects", "Deploy full-stack projects featuring web services, database schemas, and live demo links.", "FastAPI, React, Docker", False),
            (5, "Bridge Top Identified Skill Gaps", "Complete targeted modular tutorials for tools frequently requested in your target domain.", "PyTorch, Deep Learning", False),
            (6, "Target High-Fit Verified Opportunities", "Submit tailored applications to InternLogo postings scoring above 85% Fit.", "Resume Tailoring, Communication", False),
            (7, "Ace Technical & Behavioral Interviews", "Complete mock interviews, review data structures, and rehearse system design problem walks.", "Problem Solving, Behavioral", False)
        ]
        created = []
        for num, title, desc, sks, comp in initial_milestones:
            step = JourneyStep(
                student_id=profile.id,
                step_number=num,
                title=title,
                description=desc,
                skills=sks,
                is_completed=comp
            )
            db.add(step)
            created.append(step)
        db.commit()
        return created

    return steps

@router.put("/{step_id}", response_model=JourneyStepOut)
def toggle_journey_step(
    step_id: int,
    step_update: JourneyStepUpdate,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile not found")

    step = db.query(JourneyStep).filter(
        JourneyStep.id == step_id,
        JourneyStep.student_id == profile.id
    ).first()

    if not step:
        raise HTTPException(status_code=404, detail="Journey step milestone not found")

    step.is_completed = step_update.is_completed
    db.commit()
    db.refresh(step)
    return step
