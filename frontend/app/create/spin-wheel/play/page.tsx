'use client';

import { useState, useEffect, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';
import { Leaderboard } from '@/components/Leaderboard';

interface WheelItem {
  id: number;
  text: string;
}

interface ActivityData {
  title: string;
  instructions: string;
  items: WheelItem[];
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

export default function PlaySpinWheelPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [activeItems, setActiveItems] = useState<WheelItem[]>([]);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WheelItem | null>(null);
  const [showButtons, setShowButtons] = useState(false);

  // Статистика
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [totalSpins, setTotalSpins] = useState(0);

  // Завершение
  const [completed, setCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [endTime, setEndTime] = useState<number | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('spin_wheel_activity');
    if (data) {
      const parsed = JSON.parse(data) as ActivityData;
      setActivityData(parsed);
      setActiveItems(parsed.items);
    } else {
      router.push('/create/spin-wheel');
    }
  }, []);

  useEffect(() => {
    if (activeItems.length > 0) {
      drawWheel();
    }
  }, [activeItems, rotation]);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas || activeItems.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const segmentAngle = 360 / activeItems.length;

    // Поворот
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    // Рисуем сегменты
    activeItems.forEach((item, index) => {
      const startAngle = (index * segmentAngle * Math.PI) / 180;
      const endAngle = ((index + 1) * segmentAngle * Math.PI) / 180;
      const color = COLORS[index % COLORS.length];

      // Сегмент
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Граница
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Текст
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + (endAngle - startAngle) / 2);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.fillText(item.text, radius / 2, 5);
      ctx.restore();
    });

    ctx.restore();

    // Центральный круг
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();

    // Стрелка вверху
    ctx.beginPath();
    ctx.moveTo(centerX - 15, 20);
    ctx.lineTo(centerX + 15, 20);
    ctx.lineTo(centerX, 50);
    ctx.closePath();
    ctx.fillStyle = '#FF0000';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const spinWheel = () => {
    if (isSpinning || activeItems.length === 0) return;

    setIsSpinning(true);
    setSelectedItem(null);
    setShowButtons(false);

    const minRotation = 360 * 5;
    const randomRotation = Math.random() * 360;
    const totalRotation = rotation + minRotation + randomRotation;

    const duration = 5000;
    const startTime = Date.now();
    const initialRotation = rotation;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = initialRotation + (totalRotation - initialRotation) * easeOut;

      setRotation(currentRotation % 360);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const finalRotation = currentRotation % 360;
        const segmentAngle = 360 / activeItems.length;
        const selectedIndex = Math.floor(((360 - finalRotation) % 360) / segmentAngle);
        const selected = activeItems[selectedIndex];

        setSelectedItem(selected);
        setShowButtons(true);
        setTotalSpins(totalSpins + 1);
      }
    };

    animate();
  };

  const handleDelete = () => {
    if (!selectedItem) return;

    // Удаляем выбранный элемент из активных
    const newActiveItems = activeItems.filter(item => item.id !== selectedItem.id);
    setActiveItems(newActiveItems);

    setShowButtons(false);
    setSelectedItem(null);

    // Если все элементы удалены - завершаем игру
    if (newActiveItems.length === 0) {
      const finalTime = Date.now();
      setEndTime(finalTime);
      setCompleted(true);
      setShowNameInput(true);
    }
  };

  const handleContinue = () => {
    setShowButtons(false);
    setSelectedItem(null);
  };

  const handleSaveScore = async () => {
    if (!playerName.trim() || !endTime || !activityData) {
      alert('Пожалуйста, введите ваше имя!');
      return;
    }

    const timeSeconds = Math.floor((endTime - startTime) / 1000);

    try {
      const response = await fetch('http://localhost:8000/api/leaderboard/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_name: playerName.trim(),
          activity_type: 'random_wheel',
          activity_title: activityData.title,
          score: score,
          time_seconds: timeSeconds,
        }),
      });

      if (response.ok) {
        setSaved(true);
        setShowNameInput(false);
      } else {
        alert('Ошибка сохранения результата');
      }
    } catch (error) {
      setSaved(true);
      setShowNameInput(false);
      alert('Результат сохранён локально!');
    }
  };

  const handleRestart = () => {
    if (activityData) {
      setActiveItems(activityData.items);
    }
    setScore(0);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setTotalSpins(0);
    setCompleted(false);
    setShowNameInput(false);
    setSaved(false);
    setPlayerName('');
    setSelectedItem(null);
    setShowButtons(false);
  };

  if (!activityData) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (completed) {
    const timeSeconds = endTime ? Math.floor((endTime - startTime) / 1000) : 0;
    const minutes = Math.floor(timeSeconds / 60);
    const seconds = timeSeconds % 60;

    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Все элементы удалены!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Вы удалили все элементы с колеса
            </p>

            {/* Результаты */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="text-sm text-gray-600 mb-1">Всего вращений</div>
                <div className="text-4xl font-bold text-blue-600">{totalSpins}</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-6">
                <div className="text-sm text-gray-600 mb-1">Время</div>
                <div className="text-4xl font-bold text-purple-600">
                  {minutes}:{seconds.toString().padStart(2, '0')}
                </div>
              </div>
            </div>

            {/* Форма ввода имени */}
            {showNameInput && !saved && (
              <div className="mb-8 p-6 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📝 Сохраните свой результат в таблице лидеров!
                </h3>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Введите ваше имя"
                  maxLength={100}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveScore()}
                />
                <button
                  onClick={handleSaveScore}
                  disabled={!playerName.trim()}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Сохранить результат
                </button>
              </div>
            )}

            {saved && (
              <div className="mb-8 p-6 bg-green-50 rounded-xl border-2 border-green-200">
                <div className="text-2xl mb-2">✅</div>
                <h3 className="text-lg font-semibold text-green-800">
                  Результат сохранён!
                </h3>
                <p className="text-green-700 mt-2">
                  {playerName}, ваш результат добавлен в таблицу лидеров
                </p>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRestart}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Играть снова
              </button>
              <button
                onClick={() => router.push('/create')}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Выбрать другой шаблон
              </button>
            </div>
          </div>

          <div className="mt-8">
            <Leaderboard activityType="random_wheel" limit={10} />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button onClick={() => router.push('/create')} className="hover:text-gray-900">
            Выберите шаблон
          </button>
          <span>›</span>
          <button onClick={() => router.push('/create/spin-wheel')} className="hover:text-gray-900">
            Ввести контент
          </button>
          <span>›</span>
          <span className="font-semibold text-gray-900">Играть</span>
        </div>

        {/* Заголовок */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{activityData.title}</h1>
          {activityData.instructions && (
            <p className="text-gray-600">{activityData.instructions}</p>
          )}
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-sm text-gray-600">Всего элементов</div>
            <div className="text-2xl font-bold text-blue-600">{activityData.items.length}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-sm text-gray-600">Осталось</div>
            <div className="text-2xl font-bold text-green-600">{activeItems.length}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-sm text-gray-600">Вращений</div>
            <div className="text-2xl font-bold text-purple-600">{totalSpins}</div>
          </div>
        </div>

        {/* Колесо */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <canvas
              ref={canvasRef}
              width={500}
              height={500}
              className="max-w-full"
            />
          </div>

          {/* Кнопка вращения */}
          {!showButtons && (
            <div className="text-center mb-6">
              {activeItems.length === 0 ? (
                <div className="text-gray-500 text-lg">
                  Все элементы удалены! 🎉
                </div>
              ) : (
                <button
                  onClick={spinWheel}
                  disabled={isSpinning}
                  className="px-8 py-4 text-xl bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSpinning ? 'Вращается...' : '🎡 Крутить колесо!'}
                </button>
              )}
            </div>
          )}

          {/* Результат и кнопки */}
          {selectedItem && showButtons && (
            <div className="animate-bounce">
              <div className="bg-yellow-100 border-2 border-yellow-500 rounded-lg p-6 text-center mb-6">
                <div className="text-lg text-gray-700 mb-2">Выпало:</div>
                <div className="text-3xl font-black text-gray-900 mb-4">
                  {selectedItem.text}
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleDelete}
                    className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white text-xl font-bold rounded-lg transition-colors"
                  >
                    🗑️ Удалить
                  </button>
                  <button
                    onClick={handleContinue}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-lg transition-colors"
                  >
                    ➡️ Продолжить
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
