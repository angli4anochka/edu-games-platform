from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List

from app.core.database import get_db
from app.models.leaderboard import LeaderboardEntry, ActivityType
from app.schemas.leaderboard import (
    LeaderboardEntryCreate,
    LeaderboardEntryResponse,
    LeaderboardQuery
)

router = APIRouter()


@router.post("/", response_model=LeaderboardEntryResponse, status_code=201)
def create_leaderboard_entry(
    entry: LeaderboardEntryCreate,
    db: Session = Depends(get_db)
):
    """
    Создать новую запись в книге рекордов
    """
    db_entry = LeaderboardEntry(
        player_name=entry.player_name,
        activity_type=entry.activity_type,
        activity_title=entry.activity_title,
        score=entry.score,
        time_seconds=entry.time_seconds
    )

    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)

    return db_entry


@router.get("/", response_model=List[LeaderboardEntryResponse])
def get_leaderboard(
    activity_type: ActivityType = None,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Получить таблицу лидеров

    Сортировка:
    1. Сначала по времени (меньше = лучше)
    2. Затем по баллам (больше = лучше)
    """
    query = db.query(LeaderboardEntry)

    # Фильтр по типу активности
    if activity_type:
        query = query.filter(LeaderboardEntry.activity_type == activity_type)

    # Сортировка: меньше времени = лучше, больше баллов = лучше
    query = query.order_by(
        LeaderboardEntry.time_seconds.asc(),
        desc(LeaderboardEntry.score)
    )

    # Лимит
    entries = query.limit(limit).all()

    return entries


@router.get("/top-by-score/", response_model=List[LeaderboardEntryResponse])
def get_top_by_score(
    activity_type: ActivityType = None,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Получить топ по баллам (для игр, где важны баллы, а не время)
    """
    query = db.query(LeaderboardEntry)

    if activity_type:
        query = query.filter(LeaderboardEntry.activity_type == activity_type)

    # Сортировка: больше баллов = лучше, меньше времени = лучше
    query = query.order_by(
        desc(LeaderboardEntry.score),
        LeaderboardEntry.time_seconds.asc()
    )

    entries = query.limit(limit).all()

    return entries


@router.get("/recent/", response_model=List[LeaderboardEntryResponse])
def get_recent_entries(
    activity_type: ActivityType = None,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Получить последние записи
    """
    query = db.query(LeaderboardEntry)

    if activity_type:
        query = query.filter(LeaderboardEntry.activity_type == activity_type)

    query = query.order_by(desc(LeaderboardEntry.created_at))

    entries = query.limit(limit).all()

    return entries
