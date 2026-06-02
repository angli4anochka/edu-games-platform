from pydantic import BaseModel
from typing import Optional, Dict, List, Any
from datetime import datetime
from app.models.game import GameType

class GameBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    game_type: GameType
    config: Dict[str, Any] = {}
    thumbnail_url: Optional[str] = None
    difficulty_levels: List[str] = ["easy", "medium", "hard"]
    tags: List[str] = []

class GameCreate(GameBase):
    pass

class GameUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    config: Optional[Dict[str, Any]] = None
    thumbnail_url: Optional[str] = None
    difficulty_levels: Optional[List[str]] = None
    tags: Optional[List[str]] = None

class Game(GameBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
