from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.game import Game, GameType
from app.schemas.game import Game as GameSchema, GameCreate, GameUpdate

router = APIRouter()

@router.get("/", response_model=List[GameSchema])
def get_games(
    skip: int = 0,
    limit: int = 100,
    game_type: GameType = None,
    db: Session = Depends(get_db)
):
    """Получить список всех игр"""
    query = db.query(Game)
    if game_type:
        query = query.filter(Game.game_type == game_type)
    games = query.offset(skip).limit(limit).all()
    return games

@router.get("/{game_id}", response_model=GameSchema)
def get_game(game_id: int, db: Session = Depends(get_db)):
    """Получить информацию об игре"""
    game = db.query(Game).filter(Game.id == game_id).first()
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return game

@router.post("/", response_model=GameSchema)
def create_game(game: GameCreate, db: Session = Depends(get_db)):
    """Создать новую игру"""
    db_game = Game(**game.model_dump())
    db.add(db_game)
    db.commit()
    db.refresh(db_game)
    return db_game

@router.put("/{game_id}", response_model=GameSchema)
def update_game(game_id: int, game: GameUpdate, db: Session = Depends(get_db)):
    """Обновить информацию об игре"""
    db_game = db.query(Game).filter(Game.id == game_id).first()
    if not db_game:
        raise HTTPException(status_code=404, detail="Game not found")

    update_data = game.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_game, field, value)

    db.commit()
    db.refresh(db_game)
    return db_game
