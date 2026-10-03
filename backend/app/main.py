from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth_routes import router as auth_router
from app.api.routes import router
from app.core.config import settings
from app.db.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    lifespan=lifespan,
)


# CORS configuration for Vercel frontend and local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://resume-skill-analyzer1.vercel.app",
        "https://resume-skill-analyzer1-mdwuyt9gt-sahans-projects-a0fdd0db.vercel.app",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Main API routes
app.include_router(
    router,
    prefix="/api",
)


# Authentication routes
app.include_router(
    auth_router,
    prefix="/api",
)


@app.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "resume-skill-analyzer-api",
    }