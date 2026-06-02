from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.activity import Activity, ActivityAssignment
from app.schemas.activity import (
    Activity as ActivitySchema,
    ActivityCreate,
    ActivityUpdate,
    ActivityAssignment as AssignmentSchema,
    ActivityAssignmentCreate
)

router = APIRouter()

@router.get("/", response_model=List[ActivitySchema])
def get_activities(
    skip: int = 0,
    limit: int = 100,
    is_public: bool = None,
    db: Session = Depends(get_db)
):
    """Получить список активностей"""
    query = db.query(Activity)
    if is_public is not None:
        query = query.filter(Activity.is_public == is_public)
    activities = query.offset(skip).limit(limit).all()
    return activities

@router.get("/{activity_id}", response_model=ActivitySchema)
def get_activity(activity_id: int, db: Session = Depends(get_db)):
    """Получить информацию об активности"""
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    return activity

@router.post("/", response_model=ActivitySchema)
def create_activity(activity: ActivityCreate, db: Session = Depends(get_db)):
    """Создать новую активность"""
    # TODO: добавить проверку creator_id из токена авторизации
    db_activity = Activity(**activity.model_dump(), creator_id=1)  # Временно
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

@router.put("/{activity_id}", response_model=ActivitySchema)
def update_activity(
    activity_id: int,
    activity: ActivityUpdate,
    db: Session = Depends(get_db)
):
    """Обновить активность"""
    db_activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not db_activity:
        raise HTTPException(status_code=404, detail="Activity not found")

    update_data = activity.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_activity, field, value)

    db.commit()
    db.refresh(db_activity)
    return db_activity

@router.post("/assignments", response_model=AssignmentSchema)
def assign_activity(assignment: ActivityAssignmentCreate, db: Session = Depends(get_db)):
    """Назначить активность студенту"""
    db_assignment = ActivityAssignment(**assignment.model_dump())
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment

@router.get("/assignments/user/{user_id}", response_model=List[AssignmentSchema])
def get_user_assignments(user_id: int, db: Session = Depends(get_db)):
    """Получить все назначения для пользователя"""
    assignments = db.query(ActivityAssignment).filter(
        ActivityAssignment.user_id == user_id
    ).all()
    return assignments
