from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.models.base import Base


class ActivityType(str, enum.Enum):
    ANAGRAM = "anagram"
    QUIZ = "quiz"
    MATCH_PAIRS = "match_pairs"
    RANDOM_WHEEL = "random_wheel"
    # Добавляйте другие типы по мере необходимости


class LeaderboardEntry(Base):
    """Запись в книге рекордов"""
    __tablename__ = "leaderboard_entries"

    id = Column(Integer, primary_key=True, index=True)

    # Информация об игроке
    player_name = Column(String(100), nullable=False)

    # Информация об активности
    activity_type = Column(SQLEnum(ActivityType), nullable=False, index=True)
    activity_title = Column(String(200), nullable=False)  # Название активности

    # Результаты
    score = Column(Integer, nullable=False)  # Баллы
    time_seconds = Column(Integer, nullable=False)  # Время в секундах

    # Метаданные
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Дополнительные данные (JSON)
    # Например: количество правильных ответов, попыток и т.д.

    def __repr__(self):
        return f"<LeaderboardEntry {self.player_name} - {self.activity_type} - {self.score}pts in {self.time_seconds}s>"
