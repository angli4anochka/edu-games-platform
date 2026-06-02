from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import games, users, activities
from app.api.v1 import leaderboard

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Educational Games Platform API"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(games.router, prefix="/api/games", tags=["games"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(activities.router, prefix="/api/activities", tags=["activities"])
app.include_router(leaderboard.router, prefix="/api/leaderboard", tags=["leaderboard"])

@app.get("/")
async def root():
    return {
        "message": "Educational Games Platform API",
        "version": settings.VERSION,
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
