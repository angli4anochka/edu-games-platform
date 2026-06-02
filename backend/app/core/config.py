from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Educational Games Platform"
    VERSION: str = "1.0.0"

    # Database
    DATABASE_URL: str = "sqlite:///./edu_games.db"

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
