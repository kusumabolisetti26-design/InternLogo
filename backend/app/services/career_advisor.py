import os
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.entities import StudentProfile, Internship, StudentSkill
from app.services.matching_service import matching_service

class CareerAdvisorService:
    """
    Context-aware AI Career Assistant Engine.
    Abstracts AI reasoning providers (Local Rule-Reasoning / Gemini / OpenAI).
    Uses the student's live profile, skills, and internship catalog to answer questions.
    """

    @classmethod
    def answer_query(
        cls,
        user_message: str,
        profile: Optional[StudentProfile],
        db: Session,
        context_internship_id: Optional[int] = None
    ) -> Dict[str, Any]:
        msg_lower = user_message.lower().strip()
        
        # Gather student context
        student_name = profile.user.full_name if (profile and profile.user) else "Student"
        career_goal = profile.career_goal if profile and profile.career_goal else "Software Engineering"
        current_skills = [s.skill_name for s in profile.skills] if profile and profile.skills else ["Python", "Problem Solving"]
        preferred_domain = profile.preferred_domain if profile and profile.preferred_domain else "Technology"

        # Context internship if requested
        context_internship = None
        if context_internship_id:
            context_internship = db.query(Internship).filter(Internship.id == context_internship_id).first()

        # Check question intent
        # 1. Best internship for me?
        if any(w in msg_lower for w in ["best", "recommend", "which internship", "top match"]):
            internships = db.query(Internship).limit(10).all()
            scored = []
            if profile:
                for intern in internships:
                    fit = matching_service.calculate_fit(profile, current_skills, intern)
                    scored.append((intern, fit))
                scored.sort(key=lambda x: x[1]["overall_fit"], reverse=True)
            
            if scored:
                top_match, fit_res = scored[0]
                reply = (
                    f"Hi {student_name}! Based on your current profile and interest in **{career_goal}**, "
                    f"your highest match right now is **{top_match.title}** at **{top_match.company.company_name if top_match.company else 'Innovate Corp'}** "
                    f"with a **{fit_res['overall_fit']}% Fit Score**.\n\n"
                    f"• **Why it fits:** Matches your skills in {', '.join(fit_res['matched_skills'][:3])}.\n"
                    f"• **Recommended action:** Review the role requirements and bridge any missing gaps in {', '.join(fit_res['missing_skills'][:2]) or 'portfolio projects'}."
                )
                return {
                    "reply": reply,
                    "suggested_actions": ["View Recommended Internships", "Explore Skill Gap Analysis", "Check Trust Score"],
                    "related_internship_ids": [top_match.id]
                }

        # 2. What skills am I missing?
        if any(w in msg_lower for w in ["missing", "what skill", "skill gap", "need to learn"]):
            internships = db.query(Internship).filter(Internship.domain.ilike(f"%{preferred_domain}%")).all()
            if not internships:
                internships = db.query(Internship).limit(5).all()
            
            all_missing = []
            for intern in internships:
                _, _, missing = matching_service.calculate_skill_match(
                    current_skills, intern.required_skills, intern.preferred_skills
                )
                all_missing.extend(missing)
            
            # frequency count
            freq = {}
            for s in all_missing:
                freq[s] = freq.get(s, 0) + 1
            top_missing = sorted(freq.keys(), key=lambda k: freq[k], reverse=True)[:4]

            reply = (
                f"For your target track (**{career_goal}**), your current skill toolkit includes: "
                f"**{', '.join(current_skills)}**.\n\n"
                f"To qualify for the most competitive openings, your primary skill gaps are:\n"
                + "\n".join([f"• **{skill}**: Found in high demand across {freq[skill]} nearby listings" for skill in top_missing])
                + f"\n\nWe recommend dedicating 2-3 weeks to hands-on projects featuring {top_missing[0] if top_missing else 'modern frameworks'} to immediately lift your fit score."
            )
            return {
                "reply": reply,
                "suggested_actions": ["Open Journey Planner", "Explore Tutorials", "Update Profile Skills"],
                "related_internship_ids": [internships[0].id] if internships else []
            }

        # 3. Why did I receive X% fit score?
        if any(w in msg_lower for w in ["why", "fit score", "calculate", "how fit"]):
            if context_internship:
                fit_data = matching_service.calculate_fit(profile, current_skills, context_internship)
                reply = (
                    f"Here is why you received a **{fit_data['overall_fit']}% Fit Score** for **{context_internship.title}**:\n\n"
                    f"• **Skill Match (35% weight):** {fit_data['skill_match']}%\n"
                    f"  Matched: {', '.join(fit_data['matched_skills']) or 'None'}\n"
                    f"  Missing: {', '.join(fit_data['missing_skills']) or 'None'}\n"
                    f"• **Career Alignment (25% weight):** {fit_data['career_alignment']}%\n"
                    f"• **Qualification & Eligibility (15% weight):** {fit_data['qualification_match']}%\n"
                    f"• **Domain & Interest (15% weight):** {fit_data['interest_match']}%\n"
                    f"• **Work Mode & Experience (10% weight):** {fit_data['experience_match']}%\n\n"
                    f"💡 *Summary:* {fit_data['explanation']}"
                )
            else:
                reply = (
                    "InternLogo calculates your Fit Score using a multi-factor weighted formula:\n\n"
                    "1. **Skills Match (35%)**: Direct and semantic overlap of your technical toolkit with required and preferred requirements.\n"
                    "2. **Career Alignment (25%)**: Proximity between your stated Career Goal and the internship domain.\n"
                    "3. **Qualification & Graduation Year (15%)**: Academic department and eligibility year.\n"
                    "4. **Interest & Domain Match (15%)**: Alignment with your preferred domain.\n"
                    "5. **Experience & Work Mode (10%)**: Remote/Hybrid/On-site compatibility.\n\n"
                    "You can increase your score by adding verified skills and certifications to your profile!"
                )
            return {
                "reply": reply,
                "suggested_actions": ["Compare Skills", "Explore Career Roadmap", "Check Trust Score"],
                "related_internship_ids": [context_internship.id] if context_internship else []
            }

        # 4. How can I become an AI Engineer / Role?
        if any(w in msg_lower for w in ["become", "roadmap", "journey", "how can i", "step"]):
            target = career_goal or "AI Engineer"
            reply = (
                f"### Strategic Career Roadmap to become an {target}:\n\n"
                f"1. **Strengthen Foundations**: Master Python, Data Structures, and linear algebra/calculus basics.\n"
                f"2. **Data Science Core**: Get hands-on with NumPy, Pandas, Scikit-Learn, and SQL.\n"
                f"3. **Deep Learning & Frameworks**: Train models with PyTorch or TensorFlow, implement HuggingFace transformers.\n"
                f"4. **Build Production Projects**: Build end-to-end APIs (e.g. FastAPI), containerize with Docker, and publish GitHub repositories.\n"
                f"5. **Apply via InternLogo**: Apply to verified internships matching 80%+ fit score.\n"
                f"6. **Interview Preparation**: Practice system design, coding rounds, and behavioral questions.\n\n"
                f"Check your **Smart Journey Planner** tab to track your checklist progress!"
            )
            return {
                "reply": reply,
                "suggested_actions": ["Open Journey Planner", "View Top AI Internships", "Analyze Skill Gap"],
                "related_internship_ids": []
            }

        # General helpful fallback
        reply = (
            f"Hello {student_name}! I am your InternLogo AI Career Advisor.\n\n"
            f"I have live access to your profile (**{career_goal}**, {len(current_skills)} skills) "
            f"and our verified internship database.\n\n"
            f"You can ask me questions like:\n"
            f"• *Which internship is the best fit for me right now?*\n"
            f"• *What skills am I missing to reach a 95% Fit Score?*\n"
            f"• *Why did I get this specific Fit Score?*\n"
            f"• *How can I become an {career_goal}?*"
        )
        return {
            "reply": reply,
            "suggested_actions": ["Which internship is best for me?", "What skills am I missing?", "How to become an AI Engineer?"],
            "related_internship_ids": []
        }

career_advisor = CareerAdvisorService()
