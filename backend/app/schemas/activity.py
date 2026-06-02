from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class ActivityBase(BaseModel):
    title: str
    description: Optional[str] = None
    game_id: int
    config: Dict[str, Any] = {}
    is_public: bool = False

class ActivityCreate(ActivityBase):
    pass

class ActivityUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    config: Optional[Dict[str, Any]] = None
    is_public: Optional[bool] = None

class Activity(ActivityBase):
    id: int
    creator_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ActivityAssignmentBase(BaseModel):
    activity_id: int
    user_id: int
    due_date: Optional[datetime] = None

class ActivityAssignmentCreate(ActivityAssignmentBase):
    pass

class ActivityAssignment(ActivityAssignmentBase):
    id: int
    score: Optional[float] = None
    completed: bool
    time_spent: Optional[int] = None
    attempts: int
    result_data: Dict[str, Any] = {}
    assigned_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
