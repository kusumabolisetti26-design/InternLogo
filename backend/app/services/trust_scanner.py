from typing import Dict, Any, List
from app.models.entities import Internship

class TrustScannerService:
    """
    Analyzes internship and company credibility signals to compute a trust index.
    Detects red flags such as upfront fee solicitations, generic free email domains,
    and missing corporate verifications while highlighting positive safety indicators.
    """

    SUSPICIOUS_PAYMENT_TERMS = [
        "registration fee", "processing fee", "training fee", "security deposit",
        "pay upfront", "bank transfer before", "application charge", "refundable deposit"
    ]

    GENERIC_DOMAINS = ["@gmail.com", "@yahoo.com", "@outlook.com", "@hotmail.com"]

    @classmethod
    def scan_internship(cls, internship: Internship) -> Dict[str, Any]:
        score = 80  # Base standard score
        positive_indicators: List[str] = []
        risk_indicators: List[str] = []

        combined_text = (
            f"{internship.title} {internship.description} "
            f"{internship.responsibilities or ''} {internship.requirements or ''}"
        ).lower()

        # 1. Check for suspicious payment requirements
        found_payment_red_flag = False
        for term in cls.SUSPICIOUS_PAYMENT_TERMS:
            if term in combined_text:
                found_payment_red_flag = True
                risk_indicators.append(f"Potential financial risk: Mentions '{term}'")
                score -= 40
                break

        # 2. Company profile verification
        company = internship.company
        if company:
            if company.verified:
                positive_indicators.append("Verified enterprise organization on InternLogo")
                score += 15
            else:
                positive_indicators.append("Company profile active and documented")

            if company.website and (company.website.startswith("http://") or company.website.startswith("https://")):
                positive_indicators.append("Official company web presence available")
                score += 5
            else:
                risk_indicators.append("Company website not provided or unverified")
                score -= 10

            if company.contact_email:
                if any(dom in company.contact_email.lower() for dom in cls.GENERIC_DOMAINS):
                    risk_indicators.append("Uses generic email provider instead of corporate domain")
                    score -= 10
                else:
                    positive_indicators.append("Corporate domain contact address confirmed")
                    score += 5
        else:
            risk_indicators.append("Company details minimally populated")
            score -= 15

        # 3. Transparent eligibility and requirements
        if internship.requirements and len(internship.requirements) > 60:
            positive_indicators.append("Explicit eligibility and candidate prerequisites defined")
            score += 5
        else:
            risk_indicators.append("Vague or brief eligibility guidelines")
            score -= 5

        # 4. Responsibilities transparency
        if internship.responsibilities and len(internship.responsibilities) > 60:
            positive_indicators.append("Detailed scope of day-to-day responsibilities outlined")
            score += 5
        else:
            risk_indicators.append("Brief work scope description")

        # 5. Compensation transparency
        if internship.stipend and "unpaid" not in internship.stipend.lower():
            positive_indicators.append("Disclosed stipend compensation structure")
        else:
            risk_indicators.append("Unpaid role or undisclosed financial compensation")

        # 6. Formal application link
        if internship.application_url and ("internlogo.com" in internship.application_url or internship.application_url.startswith("http")):
            positive_indicators.append("Direct authenticated application route")

        # Clamp score
        final_score = max(15, min(98, score))

        # Categorize trust level
        if found_payment_red_flag or final_score < 40:
            trust_level = "High Risk"
            verif_status = "Flagged"
            explanation = (
                "Caution advised: Significant risk signals detected, including potential payment or unverified claims. "
                "InternLogo recommends thorough independent verification before submitting private data."
            )
        elif final_score >= 85:
            trust_level = "High Trust"
            verif_status = "Verified"
            explanation = (
                "Strong trust signals found: Company has verified identity, transparent role scope, "
                "corporate communication channels, and clear eligibility prerequisites."
            )
        elif final_score >= 65:
            trust_level = "Moderate Trust"
            verif_status = "Standard"
            explanation = (
                "Standard opportunity: Core details are present. We recommend reviewing company website "
                "and job description requirements before submitting."
            )
        else:
            trust_level = "Verification Recommended"
            verif_status = "Under Review"
            explanation = (
                "Information partially missing: Some company credentials or detailed responsibilities "
                "remain unverified. Exercise standard caution."
            )

        return {
            "trust_score": final_score,
            "trust_level": trust_level,
            "positive_indicators": positive_indicators,
            "risk_indicators": risk_indicators,
            "explanation": explanation,
            "verification_status": verif_status
        }

trust_scanner = TrustScannerService()
