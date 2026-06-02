# Educational Games Platform

Образовательная игровая платформа для учителей и студентов. Альтернатива Wordwall с уникальными играми: логические головоломки, аркады, стратегии и симуляторы.

## Структура проекта

```
edu-games-platform/
├── backend/          # FastAPI backend
│   ├── app/
│   │   ├── api/      # API роутеры
│   │   ├── models/   # SQLAlchemy модели
│   │   ├── schemas/  # Pydantic схемы
│   │   ├── core/     # Конфигурация и database
│   │   ├── games/    # Логика игр
│   │   └── main.py   # Главный файл приложения
│   └── requirements.txt
│
└── frontend/         # Next.js frontend
    ├── app/          # App router
    ├── components/   # React компоненты
    └── public/       # Статичные файлы
```

## Технологический стек

### Backend
- **FastAPI** - современный, быстрый веб-фреймворк
- **SQLAlchemy** - ORM для работы с базой данных
- **Pydantic** - валидация данных
- **SQLite** (dev) / **PostgreSQL** (prod) - база данных

### Frontend
- **Next.js 15** - React фреймворк с App Router
- **TypeScript** - типизация
- **Tailwind CSS** - стилизация
- **React** - UI библиотека

## Типы игр

1. **Логические головоломки** (`LOGIC_PUZZLE`)
   - Судоку
   - Кроссворды
   - Логические цепочки

2. **Аркадные игры** (`ARCADE`)
   - Math Runner - бегай и решай примеры
   - Платформеры с образовательными элементами

3. **Стратегии** (`STRATEGY`)
   - Tower Defense: Экология
   - Пошаговые стратегические игры

4. **Симуляторы** (`SIMULATOR`)
   - Экономический симулятор
   - Научные эксперименты

## Быстрый старт

### Backend

1. Установите зависимости:
```bash
cd backend
pip install -r requirements.txt
```

2. Создайте файл `.env`:
```bash
cp .env.example .env
```

3. Инициализируйте базу данных:
```bash
python -m app.core.init_db
```

4. Запустите сервер:
```bash
uvicorn app.main:app --reload --port 8000
```

API будет доступен по адресу: http://localhost:8000
Документация API: http://localhost:8000/docs

### Frontend

1. Установите зависимости:
```bash
cd frontend
npm install
```

2. Создайте файл `.env.local`:
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

3. Запустите dev сервер:
```bash
npm run dev
```

Frontend будет доступен по адресу: http://localhost:3000

## Основные возможности

### Для учителей:
- Создание интерактивных активностей
- Назначение заданий студентам
- Отслеживание прогресса
- Дашборд с аналитикой
- Библиотека готовых активностей

### Для студентов:
- Выполнение заданий
- Игра в различные образовательные игры
- Отслеживание своего прогресса
- Получение немедленной обратной связи

## API Endpoints

### Игры
- `GET /api/games` - список всех игр
- `GET /api/games/{id}` - информация об игре
- `POST /api/games` - создать новую игру
- `PUT /api/games/{id}` - обновить игру

### Активности
- `GET /api/activities` - список активностей
- `GET /api/activities/{id}` - информация об активности
- `POST /api/activities` - создать активность
- `PUT /api/activities/{id}` - обновить активность
- `POST /api/activities/assignments` - назначить активность
- `GET /api/activities/assignments/user/{user_id}` - назначения пользователя

### Пользователи
- `GET /api/users` - список пользователей
- `GET /api/users/{id}` - информация о пользователе
- `POST /api/users` - создать пользователя

## Модель данных

### User (Пользователь)
- id, email, username, password
- role: student | teacher | admin
- Связи: activities (созданные), assignments (назначенные)

### Game (Игра)
- id, name, slug, description
- game_type: logic_puzzle | arcade | strategy | simulator
- config: JSON с конфигурацией игры
- tags, difficulty_levels

### Activity (Активность)
- id, title, description
- game_id: ссылка на игру
- creator_id: учитель, создавший активность
- config: специфичные настройки
- is_public: доступна всем или только автору

### ActivityAssignment (Назначение)
- id, activity_id, user_id
- score, completed, time_spent, attempts
- result_data: детальные результаты
- assigned_at, due_date, completed_at

## Разработка

### Добавление новой игры

1. Создайте компонент игры в `frontend/components/games/`
2. Добавьте логику игры в `backend/app/games/`
3. Обновите модель Game с нужными config параметрами
4. Добавьте запись в базу данных через init_db

### Структура компонента игры

```typescript
interface GameProps {
  config: GameConfig;
  onComplete: (result: GameResult) => void;
}

export default function GameComponent({ config, onComplete }: GameProps) {
  // Логика игры
  return (
    // UI игры
  );
}
```

## TODO

- [ ] Реализовать JWT аутентификацию
- [ ] Добавить первую игру (Судоку)
- [ ] Добавить вторую игру (Math Runner)
- [ ] Создать UI компоненты (Layout, Navigation)
- [ ] Реализовать дашборд для учителей
- [ ] Добавить систему рейтингов и достижений
- [ ] Интеграция AI для генерации контента (будущее)

## Лицензия

MIT
