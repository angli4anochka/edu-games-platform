# Быстрый старт EduGames Platform

## Структура проекта

```
edu-games-platform/
├── backend/          # FastAPI backend (Python)
├── frontend/         # Next.js frontend (TypeScript/React)
├── docker-compose.yml
├── start.sh          # Скрипт для быстрого запуска
└── README.md
```

## Вариант 1: Быстрый запуск (рекомендуется для разработки)

### Требования:
- Python 3.11+
- Node.js 18+
- pip и npm

### Запуск:

```bash
cd edu-games-platform

# Метод 1: Автоматический запуск
./start.sh

# Метод 2: Ручной запуск
```

#### Backend:

```bash
cd backend

# Создать виртуальное окружение
python3 -m venv venv
source venv/bin/activate  # На Windows: venv\Scripts\activate

# Установить зависимости
pip install -r requirements.txt

# Инициализировать базу данных
python -m app.core.init_db

# Запустить сервер
uvicorn app.main:app --reload --port 8000
```

Backend будет доступен:
- API: http://localhost:8000
- Документация: http://localhost:8000/docs

#### Frontend:

```bash
cd frontend

# Установить зависимости
npm install

# Запустить dev сервер
npm run dev
```

Frontend будет доступен: http://localhost:3000

## Вариант 2: Docker (готов, но требует Docker)

```bash
cd edu-games-platform

# Запустить все сервисы
docker-compose up

# Или в фоновом режиме
docker-compose up -d

# Остановить
docker-compose down
```

## Что включено в базовую версию

### Backend (FastAPI):
- ✅ RESTful API
- ✅ Модели данных (Users, Games, Activities, Assignments)
- ✅ Роутеры для всех сущностей
- ✅ SQLite база данных (легко переключается на PostgreSQL)
- ✅ Инициализация с 5 играми
- ✅ CORS настроен для работы с фронтендом

### Frontend (Next.js):
- ✅ Главная страница с описанием платформы
- ✅ Страница со списком игр
- ✅ Базовые UI компоненты (Card, Button, Badge)
- ✅ Layout с навигацией
- ✅ API клиент для взаимодействия с бэкендом
- ✅ TypeScript типы для всех сущностей
- ✅ Responsive дизайн с Tailwind CSS

### Игры (готовые записи в БД):
1. **Судоку** - логическая головоломка
2. **Math Runner** - аркадная игра с математикой
3. **Кроссворд** - словесная головоломка
4. **Экономический симулятор** - изучение финансов
5. **Tower Defense: Экология** - стратегия с экологией

## Что дальше?

### Следующие шаги разработки:

1. **Реализовать игры** (в frontend/components/games/):
   - Судоку с генерацией головоломок
   - Math Runner с HTML5 Canvas
   - Другие игры

2. **Добавить аутентификацию**:
   - JWT токены
   - Роли пользователей (студент/учитель)
   - Защищенные роуты

3. **Дашборд для учителей**:
   - Создание активностей
   - Назначение заданий студентам
   - Просмотр результатов и аналитики

4. **Профиль студента**:
   - Список назначенных заданий
   - История выполненных активностей
   - Статистика и достижения

5. **AI интеграция** (опционально):
   - Генерация контента для игр
   - Адаптивная сложность
   - Персонализированные рекомендации

## Полезные команды

### Backend:

```bash
# Создать новую миграцию (если используете Alembic)
alembic revision --autogenerate -m "description"

# Применить миграции
alembic upgrade head

# Запустить тесты (когда будут добавлены)
pytest

# Проверить типы
mypy app/
```

### Frontend:

```bash
# Собрать production версию
npm run build

# Запустить production сервер
npm start

# Линтинг
npm run lint

# Проверить типы
npx tsc --noEmit
```

## Проверка работоспособности

1. Откройте http://localhost:8000/docs - должна открыться документация API
2. Откройте http://localhost:3000 - должна открыться главная страница
3. Перейдите на страницу "Игры" - должен отобразиться список из 5 игр
4. В API docs попробуйте выполнить GET /api/games - должны вернуться игры

## Troubleshooting

### Backend не запускается:
- Проверьте, что Python 3.11+ установлен: `python3 --version`
- Активировали ли вы виртуальное окружение?
- Установлены ли все зависимости: `pip list`

### Frontend не запускается:
- Проверьте Node.js: `node --version` (должен быть 18+)
- Удалите node_modules и package-lock.json, затем `npm install` заново
- Проверьте, что .env.local создан с правильным API_URL

### Игры не загружаются на фронтенде:
- Проверьте, что backend запущен и доступен
- Откройте консоль браузера (F12) и проверьте ошибки
- Убедитесь, что CORS настроен правильно в backend

### База данных пустая:
- Запустите `python -m app.core.init_db` из директории backend
- Проверьте, что файл edu_games.db создан

## Контакты и поддержка

Если возникли проблемы или вопросы:
1. Проверьте README.md для детальной информации
2. Изучите код в backend/app/ и frontend/components/
3. Посмотрите логи в консоли backend и frontend

Удачи в разработке! 🚀
