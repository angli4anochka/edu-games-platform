from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

from app.models.leaderboard import ActivityType


class LeaderboardEntryCreate(BaseModel):
    """Схема для создания записи в книге рекордов"""
    player_name: str = Field(..., min_length=1, max_length=100, description="Имя игрока")
    activity_type: ActivityType = Field(..., description="Тип активности")
    activity_title: str = Field(..., min_length=1, max_length=200, description="Название активности")
    score: int = Field(..., ge=0, description="Количество баллов")
    time_seconds: int = Field(..., gt=0, description="Время выполнения в секундах")


class LeaderboardEntryResponse(BaseModel):
    """Схема ответа с записью из книги рекордов"""
    id: int
    player_name: str
    activity_type: ActivityType
    activity_title: str
    score: int
    time_seconds: int
    created_at: datetime

    class Config:
        from_attributes = True


class LeaderboardQuery(BaseModel):
    """Параметры запроса к таблице лидеров"""
    activity_type: Optional[ActivityType] = None
    limit: int = Field(default=10, ge=1, le=100, description="Количество записей")
