from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import User as UserSchema, UserCreate

router = APIRouter()

@router.get("/", response_model=List[UserSchema])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Получить список пользователей"""
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.get("/{user_id}", response_model=UserSchema)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Получить информацию о пользователе"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=UserSchema)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """Создать нового пользователя"""
    # Проверка на существующего пользователя
    existing_user = db.query(User).filter(
        (User.email == user.email) | (User.username == user.username)
    ).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    # В реальном приложении здесь должно быть хеширование пароля
    db_user = User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        role=user.role,
        hashed_password=f"hashed_{user.password}"  # TODO: implement proper hashing
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
