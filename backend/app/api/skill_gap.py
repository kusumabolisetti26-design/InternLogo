from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import get_current_student
from app.models.entities import User, StudentProfile, Internship, StudentSkill
from app.services.matching_service import matching_service

router = APIRouter(prefix="/skill-gap", tags=["Skill Gap Analysis"])

@router.get("")
def get_skill_gap_analysis(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile not found")

    student_skills = [s.skill_name for s in profile.skills]
    career_goal = profile.career_goal or "AI & Software Engineer"
    preferred_domain = profile.preferred_domain or "Technology"

    # Query internships related to student's goal or domain
    internships = db.query(Internship).filter(
        Internship.domain.ilike(f"%{preferred_domain}%")
    ).all()
    if not internships:
        internships = db.query(Internship).limit(10).all()

    # Aggregate required skills and calculate frequencies
    required_freq: Dict[str, int] = {}
    missing_freq: Dict[str, int] = {}
    matched_freq: Dict[str, int] = {}

    student_skills_normalized = [matching_service._normalize_skill(s) for s in student_skills]

    for intern in internships:
        score, matched, missing = matching_service.calculate_skill_match(
            student_skills, intern.required_skills, intern.preferred_skills
        )
        for m in matched:
            matched_freq[m] = matched_freq.get(m, 0) + 1
        for miss in missing:
            missing_freq[miss] = missing_freq.get(miss, 0) + 1

    sorted_missing = sorted(missing_freq.items(), key=lambda x: x[1], reverse=True)
    sorted_matched = sorted(matched_freq.items(), key=lambda x: x[1], reverse=True)

    # Learning recommendations based on top missing skills
    learning_recommendations = []
    course_directory = {
        "PyTorch": {
            "title": "Deep Learning with PyTorch",
            "provider": "DeepLearning.AI / Coursera",
            "duration": "4 Weeks",
            "difficulty": "Intermediate",
            "focus": "Neural network architectures, tensor computations, GPU training"
        },
        "TensorFlow": {
            "title": "TensorFlow Developer Certificate Program",
            "provider": "Google Career Certificates",
            "duration": "6 Weeks",
            "difficulty": "Intermediate",
            "focus": "Convolutional networks, transfer learning, production inference"
        },
        "Deep Learning": {
            "title": "Neural Networks and Deep Learning",
            "provider": "Coursera / Andrew Ng",
            "duration": "4 Weeks",
            "difficulty": "Intermediate",
            "focus": "Backpropagation, gradient descent, hyperparameters tuning"
        },
        "Docker": {
            "title": "Docker for Developers & Microservices",
            "provider": "Linux Foundation / Udemy",
            "duration": "2 Weeks",
            "difficulty": "Beginner-Friendly",
            "focus": "Containerization, multi-stage builds, Docker Compose orchestration"
        },
        "Kubernetes": {
            "title": "Kubernetes Architecture & Core Concepts",
            "provider": "Cloud Native Computing Foundation",
            "duration": "3 Weeks",
            "difficulty": "Advanced",
            "focus": "Pods, deployments, ingress controllers, horizontal auto-scaling"
        },
        "AWS": {
            "title": "AWS Cloud Practitioner & Solution Architecture",
            "provider": "Amazon Web Services",
            "duration": "5 Weeks",
            "difficulty": "Intermediate",
            "focus": "EC2, S3, RDS, IAM security best practices, serverless Lambda"
        },
        "TypeScript": {
            "title": "Production TypeScript for Modern React",
            "provider": "Frontend Masters",
            "duration": "2 Weeks",
            "difficulty": "Intermediate",
            "focus": "Generics, strict typing, interfaces, state management"
        },
        "Next.js": {
            "title": "Full-Stack Web Development with Next.js",
            "provider": "Vercel Academy",
            "duration": "3 Weeks",
            "difficulty": "Intermediate",
            "focus": "Server components, server actions, caching strategies, SEO"
        }
    }

    for skill, count in sorted_missing[:5]:
        course = course_directory.get(skill, {
            "title": f"Complete Mastery of {skill}",
            "provider": "Official Industry Documentation & Tutorials",
            "duration": "2-3 Weeks",
            "difficulty": "Intermediate",
            "focus": f"Core concepts, hands-on portfolio projects with {skill}"
        })
        learning_recommendations.append({
            "skill": skill,
            "demand_count": count,
            **course
        })

    return {
        "career_goal": career_goal,
        "preferred_domain": preferred_domain,
        "current_skills": student_skills,
        "matched_skills": [k for k, _ in sorted_matched],
        "top_missing_skills": [
            {"skill": k, "frequency": v, "impact": "High Priority" if v > 2 else "Recommended"}
            for k, v in sorted_missing[:8]
        ],
        "learning_recommendations": learning_recommendations,
        "total_analyzed_opportunities": len(internships)
    }
