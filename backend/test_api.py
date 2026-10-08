import requests
import json
from app.database.session import SessionLocal, Base, engine
from app.database.seed import seed_database
from app.models.entities import User, Internship, StudentProfile

# Ensure seeded
Base.metadata.create_all(bind=engine)
db = SessionLocal()
seed_database(db)

# Verify direct DB entities
student = db.query(User).filter(User.email == "student@internlogo.com").first()
assert student is not None, "Student user missing"
assert student.student_profile is not None, "Student profile missing"
assert len(student.student_profile.skills) >= 5, "Student skills missing"

internships = db.query(Internship).all()
assert len(internships) >= 20, f"Expected 20+ internships, found {len(internships)}"

# Test matching service directly
from app.services.matching_service import matching_service
student_skills = [s.skill_name for s in student.student_profile.skills]
first_internship = internships[0]
fit = matching_service.calculate_fit(student.student_profile, student_skills, first_internship)
print("Fit calculation test:", fit["overall_fit"], "Matched:", fit["matched_skills"])
assert fit["overall_fit"] > 50, "Fit score should be calculated"

# Test trust scanner directly
from app.services.trust_scanner import trust_scanner
trust = trust_scanner.scan_internship(first_internship)
print("Trust scan test:", trust["trust_score"], trust["trust_level"])
assert trust["trust_score"] > 50, "Trust score should be calculated"

# Test career advisor directly
from app.services.career_advisor import career_advisor
adv = career_advisor.answer_query("Which internship is best for me?", student.student_profile, db)
print("Advisor response test preview:", adv["reply"][:80])
assert "Fit Score" in adv["reply"] or "match" in adv["reply"].lower()

db.close()
print("All backend core services verified with 100% success!")
