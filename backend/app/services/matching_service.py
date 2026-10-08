import re
from typing import List, Dict, Any, Tuple
from app.models.entities import StudentProfile, Internship, StudentSkill

class MatchingService:
    """
    AI Internship Matching Engine.
    Implements multi-factor weighted scoring:
      - Skill Match: 35%
      - Career Alignment: 25%
      - Qualification Match: 15%
      - Interest / Domain Match: 15%
      - Experience / Work Mode Match: 10%
    """

    @staticmethod
    def _normalize_skill(skill: str) -> str:
        s = skill.lower().strip()
        # common aliases
        aliases = {
            "js": "javascript",
            "ts": "typescript",
            "py": "python",
            "react.js": "react",
            "reactjs": "react",
            "node.js": "node",
            "nodejs": "node",
            "vue.js": "vue",
            "vuejs": "vue",
            "ml": "machine learning",
            "ai": "artificial intelligence",
            "dl": "deep learning",
            "postgres": "postgresql",
            "k8s": "kubernetes",
            "aws cloud": "aws"
        }
        return aliases.get(s, s)

    @classmethod
    def _extract_skills(cls, skills_str: str) -> List[str]:
        if not skills_str:
            return []
        items = [s.strip() for s in re.split(r"[,;/|•\n]+", skills_str) if s.strip()]
        return [cls._normalize_skill(s) for s in items]

    @classmethod
    def calculate_skill_match(
        cls, student_skills: List[str], required_skills_str: str, preferred_skills_str: str = ""
    ) -> Tuple[int, List[str], List[str]]:
        student_set = set(cls._normalize_skill(s) for s in student_skills)
        required_list = cls._extract_skills(required_skills_str)
        preferred_list = cls._extract_skills(preferred_skills_str)

        if not required_list:
            return 80, list(student_set), []

        matched_skills = []
        missing_skills = []

        # Find direct or substring matches
        for req in required_list:
            matched = False
            for st in student_set:
                if req == st or req in st or st in req:
                    matched = True
                    matched_skills.append(req.title())
                    break
            if not matched:
                missing_skills.append(req.title())

        # Check preferred skills bonus
        preferred_matched_count = 0
        for pref in preferred_list:
            for st in student_set:
                if pref == st or pref in st or st in pref:
                    preferred_matched_count += 1
                    if pref.title() not in matched_skills:
                        matched_skills.append(pref.title())
                    break

        req_score = (len(matched_skills) / max(len(required_list), 1)) * 100
        pref_bonus = min(15, preferred_matched_count * 5)
        final_skill_score = min(100, int(req_score * 0.9 + pref_bonus))
        
        return final_skill_score, matched_skills, missing_skills

    @classmethod
    def calculate_career_alignment(cls, career_goal: str, internship: Internship) -> int:
        if not career_goal:
            return 60  # neutral baseline

        goal_clean = career_goal.lower()
        title_clean = internship.title.lower()
        domain_clean = internship.domain.lower()

        # Direct domain match
        if goal_clean in title_clean or title_clean in goal_clean:
            return 98
        if goal_clean in domain_clean or domain_clean in goal_clean:
            return 92

        # Check keyword overlaps
        goal_tokens = set(re.findall(r"\w+", goal_clean))
        target_tokens = set(re.findall(r"\w+", f"{title_clean} {domain_clean}"))
        common = goal_tokens.intersection(target_tokens)

        # Stopwords filter
        stopwords = {"engineer", "developer", "intern", "specialist", "junior", "lead", "in", "and", "the", "for"}
        meaningful_common = common - stopwords

        if meaningful_common:
            return min(95, 75 + len(meaningful_common) * 10)

        # Domain mapping
        domain_mapping = {
            "ai/ml": ["ai engineer", "machine learning", "data scientist", "deep learning", "nlp"],
            "data science": ["data scientist", "data analyst", "business analyst", "machine learning"],
            "software development": ["software engineer", "backend developer", "full stack developer", "python developer"],
            "web development": ["frontend developer", "web developer", "full stack", "ui engineer"],
            "cloud/devops": ["devops engineer", "cloud architect", "site reliability", "cloud engineer"]
        }

        for dom_key, goals in domain_mapping.items():
            if dom_key in domain_clean:
                for g in goals:
                    if g in goal_clean:
                        return 88

        return 45

    @classmethod
    def calculate_qualification_match(cls, profile: StudentProfile, internship: Internship) -> int:
        # Check degree / year alignment
        score = 85  # default baseline
        if not profile.degree and not profile.graduation_year:
            return 75

        # If student has a STEM or relevant branch
        branch = (profile.branch or "").lower()
        if any(stem in branch for stem in ["computer", "it", "information", "software", "data", "electronics", "ai"]):
            score += 10

        # Year readiness: 3rd and 4th year are top candidates, 2nd year also eligible
        if profile.graduation_year:
            # Assuming current year around 2026/2027
            score = min(100, score + 5)

        return min(100, score)

    @classmethod
    def calculate_interest_match(cls, profile: StudentProfile, internship: Internship) -> int:
        score = 65
        pref_domain = (profile.preferred_domain or "").lower()
        intern_domain = (internship.domain or "").lower()

        if pref_domain and (pref_domain in intern_domain or intern_domain in pref_domain):
            return 95

        return score

    @classmethod
    def calculate_experience_match(cls, profile: StudentProfile, internship: Internship) -> int:
        score = 75
        # Work mode preference alignment
        pref_mode = (profile.work_mode_preference or "Any").lower()
        intern_mode = (internship.work_mode or "").lower()

        if pref_mode == "any" or pref_mode in intern_mode:
            score += 15
        elif pref_mode != intern_mode:
            score -= 10

        # Location alignment
        if profile.preferred_location and profile.preferred_location.lower() in internship.location.lower():
            score += 10

        return max(40, min(100, score))

    @classmethod
    def calculate_fit(
        cls, profile: StudentProfile, student_skills: List[str], internship: Internship
    ) -> Dict[str, Any]:
        """
        Calculates complete weighted Fit Score and breakdown.
        Weights:
          - Skill Match: 35%
          - Career Alignment: 25%
          - Qualification: 15%
          - Interest Match: 15%
          - Experience Match: 10%
        """
        skill_score, matched_skills, missing_skills = cls.calculate_skill_match(
            student_skills, internship.required_skills, internship.preferred_skills
        )
        career_score = cls.calculate_career_alignment(profile.career_goal or "", internship)
        qual_score = cls.calculate_qualification_match(profile, internship)
        interest_score = cls.calculate_interest_match(profile, internship)
        exp_score = cls.calculate_experience_match(profile, internship)

        # Weighted calculation
        overall_fit = int(
            (skill_score * 0.35)
            + (career_score * 0.25)
            + (qual_score * 0.15)
            + (interest_score * 0.15)
            + (exp_score * 0.10)
        )
        overall_fit = max(10, min(99, overall_fit))

        # Generate contextual explanation
        matched_preview = ", ".join(matched_skills[:3]) if matched_skills else "foundational competencies"
        goal_text = profile.career_goal or "your career aspirations"
        
        if overall_fit >= 85:
            explanation = (
                f"Outstanding match! Your {matched_preview} skills strongly correspond to this "
                f"{internship.domain} position, closely supporting your ambition as an {goal_text}."
            )
        elif overall_fit >= 70:
            explanation = (
                f"Solid fit. You meet key core requirements including {matched_preview}. "
                f"Upskilling in {', '.join(missing_skills[:2]) if missing_skills else 'recommended technologies'} "
                f"will boost your selection probability."
            )
        else:
            explanation = (
                f"Moderate fit. While the role intersects with your profile, several prerequisites "
                f"({', '.join(missing_skills[:2]) if missing_skills else 'specialized skills'}) "
                f"need further preparation before applying."
            )

        return {
            "overall_fit": overall_fit,
            "skill_match": skill_score,
            "career_alignment": career_score,
            "qualification_match": qual_score,
            "interest_match": interest_score,
            "experience_match": exp_score,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "explanation": explanation
        }

matching_service = MatchingService()
