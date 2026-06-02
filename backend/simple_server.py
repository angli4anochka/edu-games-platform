"""
Простой сервер без зависимостей от venv
Использует SQLite напрямую
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
from typing import List, Optional
from datetime import datetime
import uvicorn

app = FastAPI(title="EduGames Leaderboard API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Инициализация БД
def init_db():
    conn = sqlite3.connect('leaderboard.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS leaderboard_entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player_name TEXT NOT NULL,
            activity_type TEXT NOT NULL,
            activity_title TEXT NOT NULL,
            score INTEGER NOT NULL,
            time_seconds INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_activity_type ON leaderboard_entries(activity_type)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_time_score ON leaderboard_entries(time_seconds, score)')
    conn.commit()
    conn.close()

init_db()

# Pydantic модели
class LeaderboardEntryCreate(BaseModel):
    player_name: str
    activity_type: str
    activity_title: str
    score: int
    time_seconds: int

class LeaderboardEntryResponse(BaseModel):
    id: int
    player_name: str
    activity_type: str
    activity_title: str
    score: int
    time_seconds: int
    created_at: str

# Эндпоинты
@app.post("/api/leaderboard/", response_model=LeaderboardEntryResponse)
def create_entry(entry: LeaderboardEntryCreate):
    conn = sqlite3.connect('leaderboard.db')
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO leaderboard_entries
        (player_name, activity_type, activity_title, score, time_seconds, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        entry.player_name,
        entry.activity_type,
        entry.activity_title,
        entry.score,
        entry.time_seconds,
        datetime.utcnow().isoformat()
    ))

    entry_id = cursor.lastrowid
    conn.commit()

    # Получаем созданную запись
    cursor.execute('SELECT * FROM leaderboard_entries WHERE id = ?', (entry_id,))
    row = cursor.fetchone()
    conn.close()

    return {
        "id": row[0],
        "player_name": row[1],
        "activity_type": row[2],
        "activity_title": row[3],
        "score": row[4],
        "time_seconds": row[5],
        "created_at": row[6]
    }

@app.get("/api/leaderboard/", response_model=List[LeaderboardEntryResponse])
def get_leaderboard(activity_type: Optional[str] = None, limit: int = 10):
    conn = sqlite3.connect('leaderboard.db')
    cursor = conn.cursor()

    if activity_type:
        cursor.execute('''
            SELECT * FROM leaderboard_entries
            WHERE activity_type = ?
            ORDER BY time_seconds ASC, score DESC
            LIMIT ?
        ''', (activity_type, limit))
    else:
        cursor.execute('''
            SELECT * FROM leaderboard_entries
            ORDER BY time_seconds ASC, score DESC
            LIMIT ?
        ''', (limit,))

    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "id": row[0],
            "player_name": row[1],
            "activity_type": row[2],
            "activity_title": row[3],
            "score": row[4],
            "time_seconds": row[5],
            "created_at": row[6]
        }
        for row in rows
    ]

@app.get("/")
def root():
    return {"message": "EduGames Leaderboard API", "status": "running"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
