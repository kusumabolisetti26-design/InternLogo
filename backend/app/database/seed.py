from sqlalchemy.orm import Session
from app.core.security import get_password_hash
from app.models.entities import (
    User, StudentProfile, CompanyProfile, Skill, StudentSkill,
    Internship, SavedInternship, Application, JourneyStep
)

def seed_database(db: Session):
    # Check if already seeded
    if db.query(User).first():
        return

    print("Seeding InternLogo Database...")

    # 1. Create Core Skills
    skills_data = [
        ("Python", "AI/ML"),
        ("Machine Learning", "AI/ML"),
        ("TensorFlow", "AI/ML"),
        ("PyTorch", "AI/ML"),
        ("Scikit-learn", "AI/ML"),
        ("Deep Learning", "AI/ML"),
        ("NLP", "AI/ML"),
        ("Computer Vision", "AI/ML"),
        ("SQL", "Data"),
        ("Pandas", "Data"),
        ("NumPy", "Data"),
        ("Power BI", "Data"),
        ("Tableau", "Data"),
        ("Data Visualization", "Data"),
        ("JavaScript", "Frontend"),
        ("TypeScript", "Frontend"),
        ("React", "Frontend"),
        ("Next.js", "Frontend"),
        ("Tailwind CSS", "Frontend"),
        ("HTML/CSS", "Frontend"),
        ("Node.js", "Backend"),
        ("FastAPI", "Backend"),
        ("Express.js", "Backend"),
        ("Django", "Backend"),
        ("PostgreSQL", "Backend"),
        ("MongoDB", "Backend"),
        ("REST APIs", "Backend"),
        ("Docker", "Cloud"),
        ("Kubernetes", "Cloud"),
        ("AWS", "Cloud"),
        ("CI/CD", "Cloud"),
        ("Git", "General"),
        ("Linux", "General"),
        ("Problem Solving", "General"),
        ("Communication", "Soft")
    ]

    for name, cat in skills_data:
        db.add(Skill(name=name, category=cat))
    db.commit()

    # 2. Create Users (Student, Companies, Admin)
    student_user = User(
        email="student@internlogo.com",
        hashed_password=get_password_hash("password123"),
        full_name="Alex Rivera",
        role="student",
        is_active=True
    )
    db.add(student_user)

    company_user1 = User(
        email="recruiter@techpulse.io",
        hashed_password=get_password_hash("password123"),
        full_name="Elena Vance",
        role="company",
        is_active=True
    )
    db.add(company_user1)

    company_user2 = User(
        email="careers@neuralgrid.ai",
        hashed_password=get_password_hash("password123"),
        full_name="Marcus Thorne",
        role="company",
        is_active=True
    )
    db.add(company_user2)

    company_user3 = User(
        email="hr@cloudscale.net",
        hashed_password=get_password_hash("password123"),
        full_name="Sarah Jenkins",
        role="company",
        is_active=True
    )
    db.add(company_user3)

    admin_user = User(
        email="admin@internlogo.com",
        hashed_password=get_password_hash("admin123"),
        full_name="InternLogo Administrator",
        role="admin",
        is_active=True
    )
    db.add(admin_user)
    db.commit()

    # 3. Create Student Profile
    student_profile = StudentProfile(
        user_id=student_user.id,
        college="National Institute of Technology",
        degree="B.Tech",
        branch="Computer Science & Engineering",
        graduation_year=2027,
        career_goal="AI Engineer",
        preferred_domain="AI/ML",
        preferred_location="Bengaluru / Remote",
        work_mode_preference="Remote",
        min_stipend=20000,
        duration_preference="3-6 months",
        experience_summary="Completed academic projects in predictive machine learning models and built full-stack web applications with FastAPI and React.",
        certifications="Deep Learning Specialization (Coursera), AWS Cloud Practitioner",
        completed_onboarding=True
    )
    db.add(student_profile)
    db.commit()

    # Add Student Skills
    student_initial_skills = [
        ("Python", "Advanced"),
        ("SQL", "Intermediate"),
        ("Machine Learning", "Intermediate"),
        ("Scikit-learn", "Intermediate"),
        ("Pandas", "Advanced"),
        ("NumPy", "Advanced"),
        ("React", "Intermediate"),
        ("FastAPI", "Intermediate"),
        ("Git", "Advanced")
    ]
    for skill_name, prof in student_initial_skills:
        db.add(StudentSkill(student_id=student_profile.id, skill_name=skill_name, proficiency=prof))
    db.commit()

    # 4. Create Company Profiles
    company_profile1 = CompanyProfile(
        user_id=company_user1.id,
        company_name="TechPulse Labs",
        website="https://techpulse.io",
        industry="Software Engineering & Cloud",
        description="Pioneering enterprise data workflows and intelligent backend infrastructure for modern scale-ups.",
        verified=True,
        contact_email="careers@techpulse.io",
        location="Bengaluru, Karnataka",
        logo_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80"
    )
    db.add(company_profile1)

    company_profile2 = CompanyProfile(
        user_id=company_user2.id,
        company_name="NeuralGrid AI",
        website="https://neuralgrid.ai",
        industry="Artificial Intelligence & Deep Learning",
        description="Building next-generation generative AI foundation models and automated visual inspection systems.",
        verified=True,
        contact_email="team@neuralgrid.ai",
        location="Hyderabad, Telangana",
        logo_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80"
    )
    db.add(company_profile2)

    company_profile3 = CompanyProfile(
        user_id=company_user3.id,
        company_name="CloudScale Systems",
        website="https://cloudscale.net",
        industry="DevOps & Infrastructure",
        description="Delivering multi-cloud orchestration and high-availability Kubernetes operations across global nodes.",
        verified=True,
        contact_email="talent@cloudscale.net",
        location="Pune, Maharashtra",
        logo_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80"
    )
    db.add(company_profile3)
    db.commit()

    # 5. Create 25+ Realistic Internships across 5 primary domains
    internships_catalog = [
        # Domain 1: AI/ML
        {
            "company_id": company_profile2.id,
            "title": "AI/ML Research Intern",
            "domain": "AI/ML",
            "description": "Collaborate with our machine learning research team to prototype and evaluate fine-tuned transformer architectures and tabular prediction pipelines.",
            "responsibilities": "Design ML experiments, preprocess benchmark datasets, implement model evaluation pipelines, document research ablation results.",
            "requirements": "Strong proficiency in Python, experience with Scikit-learn or PyTorch, familiarity with linear algebra and ML evaluation metrics.",
            "required_skills": "Python, Machine Learning, Scikit-learn, SQL, PyTorch",
            "preferred_skills": "Deep Learning, HuggingFace, Docker",
            "qualifications": "B.Tech/M.Tech in CS, IT, or related fields (2nd, 3rd, or Final year)",
            "location": "Bengaluru / Remote",
            "work_mode": "Remote",
            "duration": "6 Months",
            "stipend": "₹35,000 / month",
            "stipend_amount": 35000,
            "application_url": "https://internlogo.com/apply/aiml-research-101",
            "deadline": "2026-11-15",
            "company_website": "https://neuralgrid.ai",
            "company_description": "AI research lab specializing in open-weights neural systems.",
            "verification_status": "Verified",
            "trust_score": 95
        },
        {
            "company_id": company_profile2.id,
            "title": "Computer Vision & Deep Learning Intern",
            "domain": "AI/ML",
            "description": "Develop and optimize object detection and segmentation algorithms deployed onto edge devices and cloud inference containers.",
            "responsibilities": "Implement OpenCV image augmentations, train YOLO/ResNet backbones, evaluate inference latency and memory footprints.",
            "requirements": "Proficiency in Python and PyTorch or TensorFlow; experience with OpenCV and convolutional architectures.",
            "required_skills": "Python, Computer Vision, PyTorch, Deep Learning, OpenCV",
            "preferred_skills": "TensorRT, Docker, Git",
            "qualifications": "Undergraduate or Graduate student in Computer Science or Electrical Engineering.",
            "location": "Hyderabad, Telangana",
            "work_mode": "Hybrid",
            "duration": "3 Months",
            "stipend": "₹30,000 / month",
            "stipend_amount": 30000,
            "application_url": "https://internlogo.com/apply/cv-intern-102",
            "deadline": "2026-11-20",
            "company_website": "https://neuralgrid.ai",
            "company_description": "AI research lab specializing in open-weights neural systems.",
            "verification_status": "Verified",
            "trust_score": 93
        },
        {
            "company_id": company_profile2.id,
            "title": "NLP & Large Language Models Intern",
            "domain": "AI/ML",
            "description": "Assist in building enterprise RAG (Retrieval-Augmented Generation) systems and domain-specific knowledge embedding databases.",
            "responsibilities": "Benchmark vector stores, evaluate prompt strategies, fine-tune LoRA adapters, calculate perplexity and BLEU/ROUGE benchmarks.",
            "requirements": "Strong Python fundamentals, familiarity with NLP, tokenization, vector databases (Pinecone/Chroma), and transformer models.",
            "required_skills": "Python, NLP, Machine Learning, PyTorch, REST APIs",
            "preferred_skills": "LangChain, Transformers, Docker",
            "qualifications": "Pre-final or Final year Computer Science student.",
            "location": "Remote",
            "work_mode": "Remote",
            "duration": "4 Months",
            "stipend": "₹40,000 / month",
            "stipend_amount": 40000,
            "application_url": "https://internlogo.com/apply/nlp-llm-103",
            "deadline": "2026-11-30",
            "company_website": "https://neuralgrid.ai",
            "company_description": "AI research lab specializing in open-weights neural systems.",
            "verification_status": "Verified",
            "trust_score": 96
        },
        {
            "company_id": company_profile1.id,
            "title": "Applied Machine Learning Intern",
            "domain": "AI/ML",
            "description": "Build predictive churn, anomaly detection, and customer recommendation models for high-throughput enterprise SaaS applications.",
            "responsibilities": "Perform exploratory data analysis on SQL warehouses, build gradient boosting models (XGBoost/LightGBM), deploy FastAPI endpoints.",
            "requirements": "Solid Python, Pandas, SQL, Scikit-learn skills. Understanding of statistical hypothesis testing and feature selection.",
            "required_skills": "Python, Machine Learning, Scikit-learn, SQL, Pandas",
            "preferred_skills": "FastAPI, Git, CI/CD",
            "qualifications": "B.Tech / B.S. in Computer Science or Mathematics.",
            "location": "Bengaluru, Karnataka",
            "work_mode": "Hybrid",
            "duration": "6 Months",
            "stipend": "₹32,000 / month",
            "stipend_amount": 32000,
            "application_url": "https://internlogo.com/apply/applied-ml-104",
            "deadline": "2026-11-25",
            "company_website": "https://techpulse.io",
            "company_description": "Enterprise cloud workflows and infrastructure.",
            "verification_status": "Verified",
            "trust_score": 91
        },
        {
            "company_id": company_profile1.id,
            "title": "Generative AI Systems Intern",
            "domain": "AI/ML",
            "description": "Design evaluation harnesses for multi-modal generation agents and automated code synthesis benchmarks.",
            "responsibilities": "Automate model test suites, log inference metrics, build interactive demonstration UI dashboards.",
            "requirements": "Python, REST APIs, Git, basic understanding of LLM architectures and prompt orchestration.",
            "required_skills": "Python, REST APIs, Git, Machine Learning",
            "preferred_skills": "PyTorch, Docker, FastAPI",
            "qualifications": "Engineering undergraduate student.",
            "location": "Remote",
            "work_mode": "Remote",
            "duration": "3 Months",
            "stipend": "₹28,000 / month",
            "stipend_amount": 28000,
            "application_url": "https://internlogo.com/apply/genai-systems-105",
            "deadline": "2026-12-05",
            "company_website": "https://techpulse.io",
            "company_description": "Enterprise cloud workflows and infrastructure.",
            "verification_status": "Verified",
            "trust_score": 89
        },

        # Domain 2: Software Development
        {
            "company_id": company_profile1.id,
            "title": "Backend Engineering Intern (Python/FastAPI)",
            "domain": "Software Development",
            "description": "Contribute to core microservices handling telemetry ingestion, database indexing, and asynchronous queue workers.",
            "responsibilities": "Write clean, async Python code, create unit tests with pytest, optimize PostgreSQL queries, document OpenAPI endpoints.",
            "requirements": "Strong Python knowledge, relational database knowledge (SQL/PostgreSQL), understanding of REST architecture.",
            "required_skills": "Python, FastAPI, SQL, PostgreSQL, REST APIs",
            "preferred_skills": "Docker, Redis, Git",
            "qualifications": "B.Tech / MCA in Computer Science / IT (Graduating 2026 or 2027)",
            "location": "Bengaluru, Karnataka",
            "work_mode": "Remote",
            "duration": "6 Months",
            "stipend": "₹30,000 / month",
            "stipend_amount": 30000,
            "application_url": "https://internlogo.com/apply/backend-python-201",
            "deadline": "2026-11-18",
            "company_website": "https://techpulse.io",
            "company_description": "Enterprise cloud workflows and infrastructure.",
            "verification_status": "Verified",
            "trust_score": 94
        },
        {
            "company_id": company_profile1.id,
            "title": "Full Stack Developer Intern",
            "domain": "Software Development",
            "description": "Work across both React frontends and Node.js/Python backend microservices to deliver end-to-end features.",
            "responsibilities": "Implement responsive UI components, connect REST APIs, manage database schemas, handle Git feature branches.",
            "requirements": "JavaScript/TypeScript, React, Python or Node.js, and basic SQL.",
            "required_skills": "React, JavaScript, Python, SQL, REST APIs",
            "preferred_skills": "TypeScript, Tailwind CSS, Docker",
            "qualifications": "Computer Science or related engineering degree.",
            "location": "Pune / Remote",
            "work_mode": "Hybrid",
            "duration": "4 Months",
            "stipend": "₹28,000 / month",
            "stipend_amount": 28000,
            "application_url": "https://internlogo.com/apply/fullstack-202",
            "deadline": "2026-11-22",
            "company_website": "https://techpulse.io",
            "company_description": "Enterprise cloud workflows and infrastructure.",
            "verification_status": "Verified",
            "trust_score": 90
        },
        {
            "company_id": company_profile3.id,
            "title": "Systems Software Intern (Go & Linux)",
            "domain": "Software Development",
            "description": "Work on distributed system daemons, network proxying, and Linux system telemetry collectors.",
            "responsibilities": "Develop concurrent services in Go, profile CPU and memory consumption, write bash automation scripts.",
            "requirements": "Solid understanding of OS fundamentals, concurrency, memory management, and Linux command line.",
            "required_skills": "Linux, Git, Problem Solving, REST APIs",
            "preferred_skills": "Docker, Kubernetes, CI/CD",
            "qualifications": "2nd, 3rd, or Final Year CS/ECE student.",
            "location": "Pune, Maharashtra",
            "work_mode": "On-site",
            "duration": "6 Months",
            "stipend": "₹35,000 / month",
            "stipend_amount": 35000,
            "application_url": "https://internlogo.com/apply/systems-software-203",
            "deadline": "2026-12-01",
            "company_website": "https://cloudscale.net",
            "company_description": "Multi-cloud infrastructure and DevOps.",
            "verification_status": "Verified",
            "trust_score": 92
        },
        {
            "company_id": company_profile1.id,
            "title": "Software Development Engineer Intern (Java/Spring)",
            "domain": "Software Development",
            "description": "Join our financial services backend squad building resilient transaction processing microservices.",
            "responsibilities": "Design OOP domain models, implement Spring Boot controllers, configure database migrations, participate in code reviews.",
            "requirements": "Core Java, OOP principles, relational databases, data structures & algorithms.",
            "required_skills": "SQL, REST APIs, Git, Problem Solving",
            "preferred_skills": "Docker, PostgreSQL, CI/CD",
            "qualifications": "B.Tech/BE in Computer Science or Information Technology.",
            "location": "Bengaluru, Karnataka",
            "work_mode": "Hybrid",
            "duration": "6 Months",
            "stipend": "₹32,000 / month",
            "stipend_amount": 32000,
            "application_url": "https://internlogo.com/apply/sde-java-204",
            "deadline": "2026-11-28",
            "company_website": "https://techpulse.io",
            "company_description": "Enterprise cloud workflows and infrastructure.",
            "verification_status": "Verified",
            "trust_score": 91
        },
        {
            "company_id": company_profile1.id,
            "title": "QA Automation Engineering Intern",
            "domain": "Software Development",
            "description": "Design test automation suites and integration verification runners for web applications and backend APIs.",
            "responsibilities": "Write automated Selenium/Playwright tests, build API smoke test runners in Python, integrate tests into CI/CD pipelines.",
            "requirements": "Python or JavaScript, understanding of testing principles, HTTP protocols, and browser DOM.",
            "required_skills": "Python, JavaScript, REST APIs, Git",
            "preferred_skills": "Docker, CI/CD",
            "qualifications": "B.Tech / BCA / MCA student.",
            "location": "Remote",
            "work_mode": "Remote",
            "duration": "3 Months",
            "stipend": "₹22,000 / month",
            "stipend_amount": 22000,
            "application_url": "https://internlogo.com/apply/qa-auto-205",
            "deadline": "2026-12-10",
            "company_website": "https://techpulse.io",
            "company_description": "Enterprise cloud workflows and infrastructure.",
            "verification_status": "Verified",
            "trust_score": 88
        },

        # Domain 3: Data Science & Analytics
        {
            "company_id": company_profile1.id,
            "title": "Data Science & Insights Intern",
            "domain": "Data Science",
            "description": "Turn raw web and product telemetry into actionable business metrics and predictive growth drivers.",
            "responsibilities": "Write complex SQL joins and aggregations, build cohort retention models in Python, create executive BI dashboards.",
            "requirements": "Strong SQL, Python, Pandas, statistical analysis, and data storytelling.",
            "required_skills": "Python, SQL, Pandas, NumPy, Data Visualization",
            "preferred_skills": "Power BI, Tableau, Machine Learning",
            "qualifications": "Major in Data Science, Computer Science, Statistics, or Mathematics.",
            "location": "Remote",
            "work_mode": "Remote",
            "duration": "4 Months",
            "stipend": "₹26,000 / month",
            "stipend_amount": 26000,
            "application_url": "https://internlogo.com/apply/datascience-301",
            "deadline": "2026-11-19",
            "company_website": "https://techpulse.io",
            "company_description": "Enterprise cloud workflows and infrastructure.",
            "verification_status": "Verified",
            "trust_score": 93
        },
        {
            "company_id": company_profile2.id,
            "title": "Data Engineering Intern (ETL & Warehousing)",
            "domain": "Data Science",
            "description": "Construct high-throughput data extraction and transformation pipelines using Python, SQL, and distributed batch processors.",
            "responsibilities": "Maintain pipeline DAGs, monitor data quality checks, optimize analytical database schemas, build automated aggregators.",
            "requirements": "Python, strong SQL query optimization skills, familiarity with PostgreSQL and data modeling.",
            "required_skills": "Python, SQL, PostgreSQL, REST APIs, Git",
            "preferred_skills": "Docker, AWS, Linux",
            "qualifications": "Engineering undergraduate student.",
            "location": "Hyderabad, Telangana",
            "work_mode": "Hybrid",
            "duration": "6 Months",
            "stipend": "₹30,000 / month",
            "stipend_amount": 30000,
            "application_url": "https://internlogo.com/apply/data-eng-302",
            "deadline": "2026-11-26",
            "company_website": "https://neuralgrid.ai",
            "company_description": "AI research lab specializing in open-weights neural systems.",
            "verification_status": "Verified",
            "trust_score": 92
        },
        {
            "company_id": company_profile1.id,
            "title": "Business Intelligence & Analytics Intern",
            "domain": "Data Science",
            "description": "Partner with finance and marketing stakeholders to build live KPI reporting boards in Tableau and Power BI.",
            "responsibilities": "Create clean data models, build interactive dashboard views, automate weekly performance emails.",
            "requirements": "Experience with Power BI or Tableau, strong SQL query capability, Excel/spreadsheet fluency.",
            "required_skills": "SQL, Power BI, Data Visualization, Communication",
            "preferred_skills": "Python, Pandas, Tableau",
            "qualifications": "Degree in Business Analytics, CS, or Information Systems.",
            "location": "Bengaluru, Karnataka",
            "work_mode": "Remote",
            "duration": "3 Months",
            "stipend": "₹24,000 / month",
            "stipend_amount": 24000,
            "application_url": "https://internlogo.com/apply/bi-analytics-303",
            "deadline": "2026-12-05",
            "company_website": "https://techpulse.io",
            "company_description": "Enterprise cloud workflows and infrastructure.",
            "verification_status": "Verified",
            "trust_score": 87
        },
        {
            "company_id": company_profile2.id,
            "title": "Quantitative Data Analyst Intern",
            "domain": "Data Science",
            "description": "Analyze multi-variable financial timeseries and user conversion funnels using statistical modeling.",
            "responsibilities": "Implement timeseries decomposition, test regression models, prepare clean summary reports.",
            "requirements": "Python, NumPy, Pandas, Scikit-learn, statistical methods, probability theory.",
            "required_skills": "Python, NumPy, Pandas, Scikit-learn, SQL",
            "preferred_skills": "Data Visualization, Git",
            "qualifications": "Statistics, Economics, Mathematics or CS background.",
            "location": "Remote",
            "work_mode": "Remote",
            "duration": "6 Months",
            "stipend": "₹32,000 / month",
            "stipend_amount": 32000,
            "application_url": "https://internlogo.com/apply/quant-analyst-304",
            "deadline": "2026-12-12",
            "company_website": "https://neuralgrid.ai",
            "company_description": "AI research lab specializing in open-weights neural systems.",
            "verification_status": "Verified",
            "trust_score": 90
        },
        {
            "company_id": company_profile1.id,
            "title": "Clinical & Health Data Intern",
            "domain": "Data Science",
            "description": "Process anonymized medical imaging metadata and longitudinal health registry tables.",
            "responsibilities": "Data cleaning, demographic statistical summaries, feature extraction pipelines.",
            "requirements": "Python, Pandas, SQL, strong attention to data privacy and accuracy.",
            "required_skills": "Python, Pandas, SQL, Data Visualization",
            "preferred_skills": "Machine Learning, Scikit-learn",
            "qualifications": "Biomedical, Data Science, or Computer Science students.",
            "location": "Bengaluru, Karnataka",
            "work_mode": "Hybrid",
            "duration": "4 Months",
            "stipend": "₹25,000 / month",
            "stipend_amount": 25000,
            "application_url": "https://internlogo.com/apply/health-data-305",
            "deadline": "2026-12-15",
            "company_website": "https://techpulse.io",
            "company_description": "Enterprise cloud workflows and infrastructure.",
            "verification_status": "Verified",
            "trust_score": 89
        },

        # Domain 4: Web Development & Frontend
        {
            "company_id": company_profile1.id,
            "title": "Frontend Engineer Intern (React / TypeScript)",
            "domain": "Web Development",
            "description": "Build modern, accessible, pixel-perfect user interfaces for our analytics dashboard and SaaS customer portals.",
            "responsibilities": "Develop interactive modular React components, integrate REST APIs, ensure responsive mobile styling with Tailwind CSS.",
            "requirements": "Strong foundation in React, TypeScript/JavaScript, CSS, HTML5, and Git workflows.",
            "required_skills": "React, TypeScript, JavaScript, Tailwind CSS, HTML/CSS",
            "preferred_skills": "Next.js, REST APIs, Git",
            "qualifications": "Engineering or computer applications students (2nd, 3rd, or 4th year).",
            "location": "Remote",
            "work_mode": "Remote",
            "duration": "3 Months",
            "stipend": "₹25,000 / month",
            "stipend_amount": 25000,
            "application_url": "https://internlogo.com/apply/frontend-react-401",
            "deadline": "2026-11-24",
            "company_website": "https://techpulse.io",
            "company_description": "Enterprise cloud workflows and infrastructure.",
            "verification_status": "Verified",
            "trust_score": 92
        },
        {
            "company_id": company_profile1.id,
            "title": "Full Stack Web Developer Intern (MERN)",
            "domain": "Web Development",
            "description": "Build high-traffic consumer web pages from client UI down to MongoDB storage and Express routing.",
            "responsibilities": "Implement authentication flows, develop reusable components, optimize web performance and SEO.",
            "requirements": "React, Node.js, Express, MongoDB, JavaScript, CSS.",
            "required_skills": "React, Node.js, Express.js, MongoDB, JavaScript",
            "preferred_skills": "TypeScript, Tailwind CSS, REST APIs",
            "qualifications": "College students with personal web development projects.",
            "location": "Bengaluru / Remote",
            "work_mode": "Remote",
            "duration": "4 Months",
            "stipend": "₹24,000 / month",
            "stipend_amount": 24000,
            "application_url": "https://internlogo.com/apply/fullstack-mern-402",
            "deadline": "2026-11-29",
            "company_website": "https://techpulse.io",
            "company_description": "Enterprise cloud workflows and infrastructure.",
            "verification_status": "Verified",
            "trust_score": 90
        },
        {
            "company_id": company_profile1.id,
            "title": "UI/UX & Design Systems Intern",
            "domain": "Web Development",
            "description": "Bridge the gap between product Figma mockups and reusable Tailwind/React component libraries.",
            "responsibilities": "Build atomic design tokens, audit accessibility contrast ratios, create storybook component catalogs.",
            "requirements": "Figma, React, Tailwind CSS, HTML/CSS, basic JavaScript.",
            "required_skills": "Tailwind CSS, HTML/CSS, React, JavaScript",
            "preferred_skills": "TypeScript, Communication",
            "qualifications": "Design or CS students passionate about clean typography and user experience.",
            "location": "Bengaluru, Karnataka",
            "work_mode": "Hybrid",
            "duration": "3 Months",
            "stipend": "₹22,000 / month",
            "stipend_amount": 22000,
            "application_url": "https://internlogo.com/apply/design-systems-403",
            "deadline": "2026-12-08",
            "company_website": "https://techpulse.io",
            "company_description": "Enterprise cloud workflows and infrastructure.",
            "verification_status": "Verified",
            "trust_score": 88
        },
        {
            "company_id": company_profile1.id,
            "title": "Next.js & Modern Web Intern",
            "domain": "Web Development",
            "description": "Build high-performance server-rendered web portals with Next.js App Router and Edge APIs.",
            "responsibilities": "Implement server actions, optimize Core Web Vitals, connect headless CMS APIs.",
            "requirements": "Next.js, React, TypeScript, Tailwind CSS, REST APIs.",
            "required_skills": "Next.js, React, TypeScript, Tailwind CSS, REST APIs",
            "preferred_skills": "PostgreSQL, Git",
            "qualifications": "Enrolled in bachelor's degree program.",
            "location": "Remote",
            "work_mode": "Remote",
            "duration": "6 Months",
            "stipend": "₹28,000 / month",
            "stipend_amount": 28000,
            "application_url": "https://internlogo.com/apply/nextjs-intern-404",
            "deadline": "2026-12-14",
            "company_website": "https://techpulse.io",
            "company_description": "Enterprise cloud workflows and infrastructure.",
            "verification_status": "Verified",
            "trust_score": 93
        },
        {
            "company_id": company_profile1.id,
            "title": "Mobile Web & Progressive Web Apps Intern",
            "domain": "Web Development",
            "description": "Optimize web applications for low-bandwidth mobile environments with service workers and offline caching.",
            "responsibilities": "Implement IndexedDB storage layers, responsive CSS grid layouts, lighthouse audits.",
            "requirements": "HTML5, CSS3, JavaScript, React or Vue, REST APIs.",
            "required_skills": "JavaScript, HTML/CSS, React, REST APIs",
            "preferred_skills": "TypeScript, Git",
            "qualifications": "Undergraduate engineering students.",
            "location": "Bengaluru, Karnataka",
            "work_mode": "On-site",
            "duration": "3 Months",
            "stipend": "₹20,000 / month",
            "stipend_amount": 20000,
            "application_url": "https://internlogo.com/apply/mobile-web-405",
            "deadline": "2026-12-18",
            "company_website": "https://techpulse.io",
            "company_description": "Enterprise cloud workflows and infrastructure.",
            "verification_status": "Verified",
            "trust_score": 86
        },

        # Domain 5: Cloud & DevOps
        {
            "company_id": company_profile3.id,
            "title": "Cloud Platform & DevOps Intern",
            "domain": "Cloud/DevOps",
            "description": "Assist in deploying, automating, and monitoring cloud native Kubernetes microservices on AWS.",
            "responsibilities": "Write Terraform modules, configure GitHub Actions CI/CD workflows, manage Prometheus and Grafana alerting.",
            "requirements": "Familiarity with Linux command line, Docker containers, AWS basics, and Git version control.",
            "required_skills": "Docker, AWS, Linux, Git, CI/CD",
            "preferred_skills": "Kubernetes, Python, REST APIs",
            "qualifications": "B.Tech/BE in Computer Science, IT, or Electronics.",
            "location": "Pune / Remote",
            "work_mode": "Remote",
            "duration": "6 Months",
            "stipend": "₹30,000 / month",
            "stipend_amount": 30000,
            "application_url": "https://internlogo.com/apply/cloud-devops-501",
            "deadline": "2026-11-27",
            "company_website": "https://cloudscale.net",
            "company_description": "Multi-cloud infrastructure and DevOps.",
            "verification_status": "Verified",
            "trust_score": 94
        },
        {
            "company_id": company_profile3.id,
            "title": "Site Reliability Engineering (SRE) Intern",
            "domain": "Cloud/DevOps",
            "description": "Learn to manage system resilience, automate incident drills, and profile distributed network throughput.",
            "responsibilities": "Create bash and Python maintenance automation, monitor uptime SLOs, analyze log aggregations.",
            "requirements": "Linux administration fundamentals, Python or Bash scripting, understanding of TCP/IP and DNS.",
            "required_skills": "Linux, Python, Docker, Git, Problem Solving",
            "preferred_skills": "AWS, CI/CD, Kubernetes",
            "qualifications": "Computer Science or IT students.",
            "location": "Pune, Maharashtra",
            "work_mode": "Hybrid",
            "duration": "4 Months",
            "stipend": "₹28,000 / month",
            "stipend_amount": 28000,
            "application_url": "https://internlogo.com/apply/sre-intern-502",
            "deadline": "2026-12-02",
            "company_website": "https://cloudscale.net",
            "company_description": "Multi-cloud infrastructure and DevOps.",
            "verification_status": "Verified",
            "trust_score": 91
        },
        {
            "company_id": company_profile3.id,
            "title": "Kubernetes & Container Operations Intern",
            "domain": "Cloud/DevOps",
            "description": "Work on Helm chart packaging, ingress controller configurations, and container image security vulnerability scans.",
            "responsibilities": "Maintain Helm templates, inspect vulnerability reports with Trivy, test auto-scaling rules.",
            "requirements": "Docker, basic Kubernetes understanding, Linux, Git.",
            "required_skills": "Docker, Kubernetes, Linux, Git",
            "preferred_skills": "AWS, CI/CD",
            "qualifications": "Pre-final or Final year students.",
            "location": "Remote",
            "work_mode": "Remote",
            "duration": "3 Months",
            "stipend": "₹27,000 / month",
            "stipend_amount": 27000,
            "application_url": "https://internlogo.com/apply/k8s-ops-503",
            "deadline": "2026-12-09",
            "company_website": "https://cloudscale.net",
            "company_description": "Multi-cloud infrastructure and DevOps.",
            "verification_status": "Verified",
            "trust_score": 93
        },
        {
            "company_id": company_profile3.id,
            "title": "Cloud Security & Compliance Intern",
            "domain": "Cloud/DevOps",
            "description": "Audit cloud IAM permission policies, configure VPC security groups, and automate compliance check scripts.",
            "responsibilities": "Review least-privilege IAM roles, write Python compliance audit scripts, document security hardening guides.",
            "requirements": "Basic understanding of cloud concepts (AWS/Azure), Python, Linux, networking fundamentals.",
            "required_skills": "AWS, Python, Linux, Problem Solving",
            "preferred_skills": "Docker, Git",
            "qualifications": "Cybersecurity or CS students.",
            "location": "Pune, Maharashtra",
            "work_mode": "On-site",
            "duration": "6 Months",
            "stipend": "₹32,000 / month",
            "stipend_amount": 32000,
            "application_url": "https://internlogo.com/apply/cloud-sec-504",
            "deadline": "2026-12-16",
            "company_website": "https://cloudscale.net",
            "company_description": "Multi-cloud infrastructure and DevOps.",
            "verification_status": "Verified",
            "trust_score": 90
        },
        {
            "company_id": company_profile3.id,
            "title": "CI/CD Pipeline Automation Intern",
            "domain": "Cloud/DevOps",
            "description": "Accelerate software delivery by building standardized GitHub Actions and GitLab CI reusable pipeline templates.",
            "responsibilities": "Create matrix test runners, build Docker caching steps, automate deployment artifacts releases.",
            "requirements": "Git, Docker, CI/CD basics, Linux shell scripting.",
            "required_skills": "CI/CD, Docker, Git, Linux",
            "preferred_skills": "Python, AWS",
            "qualifications": "College students with hands-on GitHub experience.",
            "location": "Remote",
            "work_mode": "Remote",
            "duration": "3 Months",
            "stipend": "₹25,000 / month",
            "stipend_amount": 25000,
            "application_url": "https://internlogo.com/apply/cicd-pipeline-505",
            "deadline": "2026-12-20",
            "company_website": "https://cloudscale.net",
            "company_description": "Multi-cloud infrastructure and DevOps.",
            "verification_status": "Verified",
            "trust_score": 91
        }
    ]

    internship_instances = []
    for item in internships_catalog:
        inst = Internship(**item)
        db.add(inst)
        internship_instances.append(inst)
    db.commit()

    # 6. Pre-populate Smart Journey Steps for the Student (Alex Rivera)
    journey_data = [
        (1, "Strengthen Core Python & Data Structures", "Master clean OOP, list comprehensions, time complexity, and recursion.", "Python, Problem Solving", True),
        (2, "Master Data Analysis with NumPy & Pandas", "Perform exploratory data analysis on real datasets, handle missing data, and create visualizations.", "NumPy, Pandas, SQL", True),
        (3, "Learn Foundational Machine Learning", "Implement linear models, decision trees, random forests, and cross-validation pipelines with Scikit-learn.", "Machine Learning, Scikit-learn", True),
        (4, "Deep Learning & Neural Architectures", "Understand backpropagation, CNNs, Transformers, and build models using PyTorch or TensorFlow.", "PyTorch, Deep Learning", False),
        (5, "Build and Deploy an End-to-End AI Web App", "Wrap your trained model in a FastAPI backend with a React UI and containerize it via Docker.", "FastAPI, React, Docker", False),
        (6, "Apply to AI & ML Internships via InternLogo", "Target verified internships with Fit Scores >= 85% and track status on your Kanban board.", "Communication, Git", False),
        (7, "Prepare for Technical & System Design Interviews", "Practice live coding rounds, behavioral scenarios, and explain architectural tradeoffs.", "Problem Solving", False)
    ]

    for step_num, title, desc, sks, comp in journey_data:
        db.add(JourneyStep(
            student_id=student_profile.id,
            step_number=step_num,
            title=title,
            description=desc,
            skills=sks,
            is_completed=comp
        ))

    # 7. Pre-populate a saved internship and an initial application for immediate demo interactivity
    if internship_instances:
        # Save first internship
        db.add(SavedInternship(
            student_id=student_profile.id,
            internship_id=internship_instances[0].id
        ))
        # Add an active application for second internship
        db.add(Application(
            student_id=student_profile.id,
            internship_id=internship_instances[1].id,
            status="Assessment",
            notes="Completed initial screening questionnaire. Scheduled for online coding challenge.",
            interview_date="2026-10-18"
        ))
        # Add a second application in Applied status
        db.add(Application(
            student_id=student_profile.id,
            internship_id=internship_instances[3].id,
            status="Applied",
            notes="Submitted resume tailored with machine learning and Scikit-learn highlights."
        ))

    db.commit()
    print("Database seeding completed successfully with 25 internships, 5 domains, and demo profiles!")
