from sqlalchemy import Column, Integer, String, Text, JSON, ForeignKey, DateTime, Boolean, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)

    # Связь с игрой
    game_id = Column(Integer, ForeignKey("games.id"), nullable=False)
    game = relationship("Game", back_populates="activities")

    # Создатель (учитель)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    creator = relationship("User", back_populates="activities")

    # Конфигурация активности (уровень сложности, параметры игры и т.д.)
    config = Column(JSON, default={})

    # Публичная или приватная активность
    is_public = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    assignments = relationship("ActivityAssignment", back_populates="activity")

class ActivityAssignment(Base):
    __tablename__ = "activity_assignments"

    id = Column(Integer, primary_key=True, index=True)

    # Связь с активностью
    activity_id = Column(Integer, ForeignKey("activities.id"), nullable=False)
    activity = relationship("Activity", back_populates="assignments")

    # Студент
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="assignments")

    # Результаты
    score = Column(Float, nullable=True)
    completed = Column(Boolean, default=False)
    time_spent = Column(Integer, nullable=True)  # в секундах
    attempts = Column(Integer, default=0)
    result_data = Column(JSON, default={})  # Детальные результаты

    # Сроки
    assigned_at = Column(DateTime, default=datetime.utcnow)
    due_date = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
