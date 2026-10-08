import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.session import engine, Base, SessionLocal
from app.database.seed import seed_database

# API Routers
from app.api.auth import router as auth_router
from app.api.students import router as students_router
from app.api.internships import router as internships_router
from app.api.matching import router as matching_router
from app.api.trust import router as trust_router
from app.api.skill_gap import router as skill_gap_router
from app.api.journey import router as journey_router
from app.api.saved import router as saved_router
from app.api.applications import router as applications_router
from app.api.company import router as company_router
from app.api.admin import router as admin_router
from app.api.assistant import router as assistant_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create DB tables if they don't exist
    Base.metadata.create_all(bind=engine)
    # Seed default data
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Powered Internship Discovery & Career Guidance Platform API",
    lifespan=lifespan
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(students_router, prefix=settings.API_V1_STR)
app.include_router(internships_router, prefix=settings.API_V1_STR)
app.include_router(matching_router, prefix=settings.API_V1_STR)
app.include_router(trust_router, prefix=settings.API_V1_STR)
app.include_router(skill_gap_router, prefix=settings.API_V1_STR)
app.include_router(journey_router, prefix=settings.API_V1_STR)
app.include_router(saved_router, prefix=settings.API_V1_STR)
app.include_router(applications_router, prefix=settings.API_V1_STR)
app.include_router(company_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_V1_STR)
app.include_router(assistant_router, prefix=settings.API_V1_STR)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "platform": "InternLogo",
        "version": settings.VERSION,
        "message": "AI-Powered Internship Discovery & Career Guidance Platform online."
    }
