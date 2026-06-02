from sqlalchemy import Column, Integer, String, Text, JSON, Enum, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.core.database import Base

class GameType(str, enum.Enum):
    # Интерактивные механики (как в Wordwall)
    QUIZ = "quiz"                          # Тест с вариантами ответа
    MATCH_PAIRS = "match_pairs"            # Сопоставление пар
    CATEGORIZE = "categorize"              # Сортировка по категориям
    FLASHCARDS = "flashcards"              # Карточки для запоминания
    RANDOM_WHEEL = "random_wheel"          # Колесо случайного выбора
    ANAGRAM = "anagram"                    # Анаграммы
    MISSING_WORD = "missing_word"          # Пропущенные слова
    TRUE_FALSE = "true_false"              # Правда/Ложь
    IMAGE_QUIZ = "image_quiz"              # Выбери картинку
    WORD_SEARCH = "word_search"            # Поиск слов
    CROSSWORD = "crossword"                # Кроссворд

    # Более сложные игры
    MEMORY = "memory"                      # Игра на память
    HANGMAN = "hangman"                    # Виселица
    MAZE_CHASE = "maze_chase"              # Погоня в лабиринте
    WORD_SNAKE = "word_snake"              # Змейка слов

class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    slug = Column(String, unique=True, nullable=False, index=True)
    description = Column(Text)
    game_type = Column(Enum(GameType), nullable=False)

    # JSON для хранения конфигурации игры
    config = Column(JSON, default={})

    # Метаданные
    thumbnail_url = Column(String)
    difficulty_levels = Column(JSON, default=["easy", "medium", "hard"])
    tags = Column(JSON, default=[])

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    activities = relationship("Activity", back_populates="game")
