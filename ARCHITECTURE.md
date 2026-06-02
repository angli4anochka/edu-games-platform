# Архитектура EduGames Platform

## Обзор системы

EduGames Platform - это full-stack веб-приложение для создания и управления образовательными играми. Платформа состоит из двух основных частей:

1. **Backend** (FastAPI + Python) - RESTful API
2. **Frontend** (Next.js + TypeScript) - Single Page Application

## Backend Architecture

### Технологический стек
- **Framework**: FastAPI 0.115.0
- **ORM**: SQLAlchemy 2.0.36
- **Validation**: Pydantic 2.9.2
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Server**: Uvicorn

### Структура проекта

```
backend/
├── app/
│   ├── api/              # API endpoints (роутеры)
│   │   ├── games.py      # CRUD для игр
│   │   ├── activities.py # CRUD для активностей
│   │   └── users.py      # CRUD для пользователей
│   ├── core/             # Конфигурация и утилиты
│   │   ├── config.py     # Настройки приложения
│   │   ├── database.py   # Подключение к БД
│   │   └── init_db.py    # Инициализация БД
│   ├── models/           # SQLAlchemy модели
│   │   ├── user.py       # User, UserRole
│   │   ├── game.py       # Game, GameType
│   │   └── activity.py   # Activity, ActivityAssignment
│   ├── schemas/          # Pydantic схемы
│   │   ├── user.py       # User validation schemas
│   │   ├── game.py       # Game validation schemas
│   │   └── activity.py   # Activity validation schemas
│   ├── games/            # Логика игр (будущее)
│   ├── services/         # Бизнес-логика (будущее)
│   └── main.py           # Главный файл приложения
├── requirements.txt      # Python зависимости
└── Dockerfile           # Docker образ
```

### Модели данных

#### User (Пользователь)
```python
- id: int
- email: str (unique)
- username: str (unique)
- hashed_password: str
- full_name: str
- role: enum (student, teacher, admin)
- is_active: bool
- created_at: datetime
- updated_at: datetime
```

#### Game (Игра)
```python
- id: int
- name: str
- slug: str (unique)
- description: text
- game_type: enum (logic_puzzle, arcade, strategy, simulator)
- config: JSON  # Конфигурация игры
- thumbnail_url: str
- difficulty_levels: JSON
- tags: JSON
- created_at: datetime
- updated_at: datetime
```

#### Activity (Активность)
```python
- id: int
- title: str
- description: text
- game_id: int (FK)
- creator_id: int (FK)
- config: JSON  # Настройки активности
- is_public: bool
- created_at: datetime
- updated_at: datetime
```

#### ActivityAssignment (Назначение)
```python
- id: int
- activity_id: int (FK)
- user_id: int (FK)
- score: float
- completed: bool
- time_spent: int (секунды)
- attempts: int
- result_data: JSON
- assigned_at: datetime
- due_date: datetime
- completed_at: datetime
```

### API Endpoints

#### Games
- `GET /api/games` - список всех игр (с фильтром по типу)
- `GET /api/games/{id}` - получить игру по ID
- `POST /api/games` - создать игру
- `PUT /api/games/{id}` - обновить игру

#### Activities
- `GET /api/activities` - список активностей (с фильтром is_public)
- `GET /api/activities/{id}` - получить активность по ID
- `POST /api/activities` - создать активность
- `PUT /api/activities/{id}` - обновить активность
- `POST /api/activities/assignments` - назначить активность студенту
- `GET /api/activities/assignments/user/{user_id}` - получить назначения пользователя

#### Users
- `GET /api/users` - список пользователей
- `GET /api/users/{id}` - получить пользователя по ID
- `POST /api/users` - создать пользователя

## Frontend Architecture

### Технологический стек
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **State Management**: React hooks (useState, useEffect)
- **HTTP Client**: Fetch API

### Структура проекта

```
frontend/
├── app/                  # Next.js App Router
│   ├── page.tsx         # Главная страница
│   ├── layout.tsx       # Root layout
│   ├── globals.css      # Глобальные стили
│   └── games/
│       └── page.tsx     # Страница со списком игр
├── components/
│   ├── layout/          # Layout компоненты
│   │   ├── Layout.tsx   # Главный layout
│   │   └── Navigation.tsx # Навигация
│   ├── ui/              # UI компоненты
│   │   ├── Card.tsx     # Карточки
│   │   ├── Button.tsx   # Кнопки
│   │   └── Badge.tsx    # Бейджи
│   ├── games/           # Игровые компоненты (будущее)
│   └── GameCard.tsx     # Карточка игры
├── lib/
│   ├── types.ts         # TypeScript типы
│   └── api.ts           # API клиент
└── public/              # Статичные файлы
```

### Типы данных

Все типы синхронизированы с backend моделями:
- `User`, `UserRole`
- `Game`, `GameType`
- `Activity`, `ActivityAssignment`
- `GameResult`

### Компонентная архитектура

#### UI Components (ui/)
Переиспользуемые компоненты:
- `Card`, `CardHeader`, `CardTitle`, `CardContent`
- `Button` - с вариантами (primary, secondary, outline, danger)
- `Badge` - с вариантами (default, success, warning, danger, info)

#### Layout Components (layout/)
- `Layout` - основной layout с навигацией и футером
- `Navigation` - навигационное меню с активными ссылками

#### Feature Components
- `GameCard` - отображение игры в виде карточки
- Больше компонентов будет добавлено

### API Client

Централизованный клиент для взаимодействия с backend:

```typescript
class ApiClient {
  // Games
  getGames(gameType?: string)
  getGame(id: number)

  // Activities
  getActivities(isPublic?: boolean)
  getActivity(id: number)
  createActivity(data)

  // Assignments
  getUserAssignments(userId: number)
  createAssignment(data)

  // Users
  getUsers()
  getUser(id: number)
}
```

## Взаимодействие Frontend ↔ Backend

### Поток данных

```
User Action → React Component → API Client →
→ FastAPI Endpoint → Service Layer → Database →
→ Response → API Client → Component State → UI Update
```

### CORS Configuration

Backend настроен на прием запросов от:
- `http://localhost:3000` (dev frontend)
- `http://localhost:3001` (альтернативный порт)

## Типы игр

### 1. Logic Puzzles (Логические головоломки)
- Судоку - классическая числовая головоломка
- Кроссворды - словесные головоломки
- Логические цепочки

**Config структура:**
```json
{
  "grid_size": 9,
  "difficulty_levels": {
    "easy": {"clues": 40},
    "medium": {"clues": 30},
    "hard": {"clues": 25}
  }
}
```

### 2. Arcade (Аркадные игры)
- Math Runner - беги и решай примеры
- Платформеры с образовательными элементами

**Config структура:**
```json
{
  "operations": ["addition", "subtraction", "multiplication"],
  "speed_levels": [1, 1.5, 2]
}
```

### 3. Strategy (Стратегии)
- Tower Defense: Экология
- Пошаговые стратегии

**Config структура:**
```json
{
  "tower_types": ["wind_energy", "solar_panel", "recycling_center"],
  "levels": 15
}
```

### 4. Simulator (Симуляторы)
- Экономический симулятор
- Научные эксперименты

**Config структура:**
```json
{
  "starting_capital": 10000,
  "game_duration": 10
}
```

## Безопасность (TODO)

### Планируется добавить:
1. **JWT Authentication**
   - Access и Refresh токены
   - Хранение токенов в httpOnly cookies

2. **Authorization**
   - Role-based access control (RBAC)
   - Учителя могут создавать и назначать активности
   - Студенты могут только выполнять назначенные задания

3. **Data Validation**
   - Pydantic схемы на backend
   - Zod схемы на frontend (опционально)

4. **Rate Limiting**
   - Ограничение количества запросов
   - Защита от DDoS

## Масштабирование

### Горизонтальное масштабирование
- Backend: несколько инстансов за load balancer
- Frontend: статические файлы на CDN
- Database: read replicas для чтения

### Кэширование
- Redis для сессий и временных данных
- API response caching
- Static asset caching

### Оптимизация производительности
- Database indexing на часто запрашиваемые поля
- Lazy loading для игр
- Code splitting на frontend

## Deployment

### Development
```bash
# Backend
uvicorn app.main:app --reload --port 8000

# Frontend
npm run dev
```

### Production

#### Docker
```bash
docker-compose up -d
```

#### Manual
```bash
# Backend
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker

# Frontend
npm run build
npm start
```

## Roadmap

### Phase 1: MVP ✅
- [x] Backend API
- [x] Frontend UI
- [x] Базовые модели данных
- [x] CRUD операции

### Phase 2: Core Features
- [ ] JWT Authentication
- [ ] Реализация игр (Судоку, Math Runner)
- [ ] Система назначения заданий
- [ ] Дашборд учителя

### Phase 3: Advanced Features
- [ ] Реал-тайм обновления (WebSockets)
- [ ] Система достижений
- [ ] Аналитика и статистика
- [ ] Экспорт результатов

### Phase 4: AI Integration
- [ ] AI генерация контента
- [ ] Адаптивная сложность
- [ ] Персонализированные рекомендации

## Мониторинг и логирование

### Планируется:
- Application logs (uvicorn logs)
- Error tracking (Sentry)
- Performance monitoring (New Relic / DataDog)
- Analytics (Google Analytics / Mixpanel)

## Тестирование

### Backend
```bash
# Unit tests
pytest tests/

# Coverage
pytest --cov=app tests/
```

### Frontend
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## Документация

- **API Docs**: http://localhost:8000/docs (Swagger UI)
- **README.md**: Общая информация
- **QUICKSTART.md**: Быстрый старт
- **ARCHITECTURE.md**: Этот документ
