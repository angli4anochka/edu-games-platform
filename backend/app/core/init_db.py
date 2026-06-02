from sqlalchemy.orm import Session
from app.core.database import engine, Base
from app.models import User, Game, GameType, Activity

def init_db():
    """Инициализация базы данных и создание тестовых данных"""
    # Создание таблиц
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

def seed_games(db: Session):
    """Добавление начальных игр в базу данных"""

    games_data = [
        # Тесты и викторины
        {
            "name": "Викторина",
            "slug": "quiz",
            "description": "Классический тест с вариантами ответа. Создавайте вопросы с множественным выбором",
            "game_type": GameType.QUIZ,
            "config": {
                "max_questions": 50,
                "time_per_question": 30,
                "show_score": True,
                "randomize_answers": True
            },
            "tags": ["тест", "викторина", "вопросы"]
        },
        {
            "name": "Правда или Ложь",
            "slug": "true-false",
            "description": "Быстрая проверка знаний с утверждениями правда/ложь",
            "game_type": GameType.TRUE_FALSE,
            "config": {
                "max_statements": 30,
                "time_per_statement": 15
            },
            "tags": ["правда", "ложь", "быстро"]
        },

        # Сопоставление
        {
            "name": "Сопоставление пар",
            "slug": "match-pairs",
            "description": "Найди соответствия между элементами из двух колонок",
            "game_type": GameType.MATCH_PAIRS,
            "config": {
                "max_pairs": 20,
                "show_images": True,
                "shuffle": True
            },
            "tags": ["сопоставление", "пары", "память"]
        },
        {
            "name": "Сортировка по категориям",
            "slug": "categorize",
            "description": "Распредели элементы по правильным категориям",
            "game_type": GameType.CATEGORIZE,
            "config": {
                "max_categories": 5,
                "max_items": 30,
                "drag_and_drop": True
            },
            "tags": ["категории", "сортировка", "группировка"]
        },

        # Слова
        {
            "name": "Анаграммы",
            "slug": "anagram",
            "description": "Составь слово из перемешанных букв",
            "game_type": GameType.ANAGRAM,
            "config": {
                "difficulty_levels": ["easy", "medium", "hard"],
                "hints_available": True,
                "time_limit": 60
            },
            "tags": ["слова", "буквы", "анаграмма"]
        },
        {
            "name": "Пропущенные слова",
            "slug": "missing-word",
            "description": "Заполни пропуски в тексте правильными словами",
            "game_type": GameType.MISSING_WORD,
            "config": {
                "max_blanks": 20,
                "show_word_bank": True,
                "case_sensitive": False
            },
            "tags": ["текст", "слова", "заполнение"]
        },
        {
            "name": "Поиск слов",
            "slug": "word-search",
            "description": "Найди все спрятанные слова в сетке букв",
            "game_type": GameType.WORD_SEARCH,
            "config": {
                "grid_size": [15, 15],
                "directions": ["horizontal", "vertical", "diagonal"],
                "max_words": 20
            },
            "tags": ["поиск", "слова", "головоломка"]
        },
        {
            "name": "Кроссворд",
            "slug": "crossword",
            "description": "Решай кроссворды на разные темы",
            "game_type": GameType.CROSSWORD,
            "config": {
                "max_grid_size": [15, 15],
                "show_hints": True
            },
            "tags": ["кроссворд", "слова", "логика"]
        },

        # Карточки и случайность
        {
            "name": "Карточки",
            "slug": "flashcards",
            "description": "Учи материал с помощью интерактивных карточек",
            "game_type": GameType.FLASHCARDS,
            "config": {
                "show_images": True,
                "auto_flip": False,
                "shuffle": True,
                "study_mode": True
            },
            "tags": ["карточки", "запоминание", "обучение"]
        },
        {
            "name": "Колесо фортуны",
            "slug": "random-wheel",
            "description": "Крути колесо для случайного выбора элемента",
            "game_type": GameType.RANDOM_WHEEL,
            "config": {
                "max_segments": 20,
                "colors": ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"],
                "animation_duration": 5
            },
            "tags": ["колесо", "случайность", "выбор"]
        },

        # Визуальные игры
        {
            "name": "Викторина с картинками",
            "slug": "image-quiz",
            "description": "Выбери правильную картинку в ответ на вопрос",
            "game_type": GameType.IMAGE_QUIZ,
            "config": {
                "images_per_question": 4,
                "image_size": "medium",
                "time_per_question": 30
            },
            "tags": ["картинки", "визуал", "тест"]
        },
        {
            "name": "Мемори",
            "slug": "memory",
            "description": "Найди все пары одинаковых карточек",
            "game_type": GameType.MEMORY,
            "config": {
                "grid_size": [4, 4],
                "max_pairs": 8,
                "show_moves": True,
                "time_limit": 180
            },
            "tags": ["память", "пары", "концентрация"]
        },

        # Игры со словами
        {
            "name": "Виселица",
            "slug": "hangman",
            "description": "Отгадай слово, называя буквы по одной",
            "game_type": GameType.HANGMAN,
            "config": {
                "max_attempts": 6,
                "show_category": True,
                "hints_available": True
            },
            "tags": ["слова", "угадывание", "буквы"]
        },
        {
            "name": "Погоня в лабиринте",
            "slug": "maze-chase",
            "description": "Отвечай на вопросы правильно, чтобы убежать от монстра!",
            "game_type": GameType.MAZE_CHASE,
            "config": {
                "maze_size": "medium",
                "questions_to_win": 10,
                "monster_speed": 1.0
            },
            "tags": ["аркада", "погоня", "вопросы"]
        },
        {
            "name": "Змейка слов",
            "slug": "word-snake",
            "description": "Собирай буквы в правильном порядке, управляя змейкой. Змейка растёт с каждой правильной буквой!",
            "game_type": GameType.WORD_SNAKE,
            "config": {
                "default_word": "APPLE",
                "speed_levels": ["slow", "medium", "fast"],
                "default_speed": "medium",
                "max_word_length": 10,
                "lives": 3,
                "points_per_letter": 10,
                "penalty_wrong_letter": 5
            },
            "tags": ["слова", "аркада", "змейка", "буквы", "реакция"]
        }
    ]

    for game_data in games_data:
        game = Game(**game_data)
        db.add(game)

    db.commit()
    print(f"Added {len(games_data)} games to database!")

if __name__ == "__main__":
    from app.core.database import SessionLocal

    # Инициализация базы данных
    init_db()

    # Добавление тестовых игр
    db = SessionLocal()
    try:
        seed_games(db)
    finally:
        db.close()

    print("Database initialization complete!")
