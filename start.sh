#!/bin/bash

# Скрипт для запуска проекта

echo "🚀 Запуск EduGames Platform..."

# Проверка Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 не найден. Установите Python 3.11 или выше."
    exit 1
fi

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не найден. Установите Node.js 18 или выше."
    exit 1
fi

echo ""
echo "📦 Проверка зависимостей..."

# Backend dependencies
if [ ! -d "backend/venv" ]; then
    echo "Создание виртуального окружения Python..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
fi

# Frontend dependencies
if [ ! -d "frontend/node_modules" ]; then
    echo "Установка зависимостей Node.js..."
    cd frontend
    npm install
    cd ..
fi

echo ""
echo "🗄️  Инициализация базы данных..."
cd backend
source venv/bin/activate
python -m app.core.init_db
cd ..

echo ""
echo "✅ Запуск серверов..."
echo ""
echo "Backend API: http://localhost:8000"
echo "Backend Docs: http://localhost:8000/docs"
echo "Frontend: http://localhost:3000"
echo ""

# Запуск в отдельных терминалах
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎮 Платформа запущена!"
echo ""
echo "Для остановки нажмите Ctrl+C"
echo ""

# Ожидание завершения
wait $BACKEND_PID $FRONTEND_PID
