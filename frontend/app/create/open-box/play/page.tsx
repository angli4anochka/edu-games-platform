'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';

interface BoxItem {
  id: number;
  content: string;
}

interface ActivityData {
  title: string;
  instructions: string;
  items: BoxItem[];
}

const BOX_COLORS = [
  'from-orange-400 to-orange-600',
  'from-yellow-400 to-yellow-600',
  'from-green-400 to-green-600',
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
  'from-pink-400 to-pink-600',
  'from-red-400 to-red-600',
  'from-indigo-400 to-indigo-600',
];

export default function PlayOpenBoxPage() {
  const router = useRouter();
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [openedBoxes, setOpenedBoxes] = useState<number[]>([]);
  const [currentBoxIndex, setCurrentBoxIndex] = useState(0);
  const [shakeBox, setShakeBox] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [endTime, setEndTime] = useState<number | null>(null);
  const [expandedBox, setExpandedBox] = useState<{ index: number; content: string } | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('open_box_activity');
    if (data) {
      const parsed = JSON.parse(data) as ActivityData;
      setActivityData(parsed);
    } else {
      router.push('/create/open-box');
    }
  }, []);

  const handleBoxClick = (index: number) => {
    if (!activityData) return;

    // Если коробка уже открыта, игнорируем клик
    if (openedBoxes.includes(index)) {
      return;
    }

    // Если пытаются открыть не ту коробку по порядку
    if (index !== currentBoxIndex) {
      setShakeBox(index);
      setTimeout(() => setShakeBox(null), 500);
      return;
    }

    // Открываем коробку на весь экран
    setExpandedBox({ index, content: activityData.items[index].content });

    // Автоматически закрываем через 3 секунды
    setTimeout(() => {
      setExpandedBox(null);
      setOpenedBoxes([...openedBoxes, index]);
      setCurrentBoxIndex(currentBoxIndex + 1);

      // Проверяем, все ли коробки открыты
      if (currentBoxIndex === activityData.items.length - 1) {
        const finalTime = Date.now();
        setEndTime(finalTime);
        setTimeout(() => setCompleted(true), 500);
      }
    }, 3000);
  };

  const handleRestart = () => {
    setOpenedBoxes([]);
    setCurrentBoxIndex(0);
    setCompleted(false);
    setEndTime(null);
  };

  if (!activityData) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
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
              Все коробки открыты!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Вы успешно открыли все {activityData.items.length} коробок
            </p>

            <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-6 mb-8">
              <div className="text-sm text-gray-600 mb-1">Время</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {timeSeconds} секунд
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRestart}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
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
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-8">
        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button
            onClick={() => router.push('/create')}
            className="hover:text-gray-900"
          >
            Выберите шаблон
          </button>
          <span>›</span>
          <button
            onClick={() => router.push('/create/open-box')}
            className="hover:text-gray-900"
          >
            Ввести контент
          </button>
          <span>›</span>
          <span className="font-semibold text-gray-900">Играть</span>
        </div>

        {/* Заголовок */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {activityData.title}
          </h1>
          {activityData.instructions && (
            <p className="text-gray-600">{activityData.instructions}</p>
          )}
        </div>

        {/* Прогресс */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Открыто {openedBoxes.length} из {activityData.items.length}
            </span>
            <span className="text-sm font-medium text-orange-600">
              Следующая: {currentBoxIndex + 1}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-orange-500 to-pink-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(openedBoxes.length / activityData.items.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Сетка коробок */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {activityData.items.map((item, index) => {
              const isOpened = openedBoxes.includes(index);
              const isNext = index === currentBoxIndex;
              const shouldShake = shakeBox === index;
              const colorClass = BOX_COLORS[index % BOX_COLORS.length];

              return (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => handleBoxClick(index)}
                    disabled={isOpened}
                    className={`
                      w-full aspect-square rounded-2xl transition-all duration-300 relative overflow-hidden
                      ${isOpened
                        ? 'bg-white border-4 border-green-400 shadow-lg'
                        : `bg-gradient-to-br ${colorClass} shadow-md hover:shadow-xl hover:scale-105`
                      }
                      ${isNext && !isOpened ? 'ring-4 ring-yellow-400 ring-offset-2 animate-pulse' : ''}
                      ${shouldShake ? 'animate-shake' : ''}
                      ${!isOpened ? 'cursor-pointer' : 'cursor-default'}
                      disabled:opacity-100
                    `}
                  >
                    {/* Закрытая коробка */}
                    {!isOpened && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <div className="text-5xl mb-2">📦</div>
                        <div className="text-3xl font-bold">{index + 1}</div>
                      </div>
                    )}

                    {/* Открытая коробка */}
                    {isOpened && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-3 animate-fadeIn">
                        <div className="text-3xl mb-2">✅</div>
                        <div className="text-sm font-medium text-gray-900 text-center line-clamp-3">
                          {item.content}
                        </div>
                      </div>
                    )}

                    {/* Уголок */}
                    {!isOpened && (
                      <div className="absolute bottom-0 right-0 w-6 h-6 bg-white/30 rounded-tl-lg"></div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Подсказка */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-sm text-blue-800">
              💡 <strong>Подсказка:</strong> Нажимайте на коробки по порядку от 1 до {activityData.items.length}
            </p>
          </div>
        </div>
      </div>

      {/* Полноэкранная модалка открытой коробки */}
      {expandedBox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full h-full flex items-center justify-center p-8">
            {/* Анимированная коробка */}
            <div className="relative animate-boxOpen">
              {/* Крышка коробки */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-96 h-32 bg-gradient-to-br from-orange-400 to-pink-600 rounded-t-3xl shadow-2xl animate-lidOpen">
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Содержимое */}
              <div className="bg-white rounded-3xl shadow-2xl p-16 max-w-2xl min-h-[400px] flex flex-col items-center justify-center animate-contentPop">
                <div className="text-8xl mb-8 animate-bounce">🎁</div>
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 mb-4">
                  Коробка #{expandedBox.index + 1}
                </div>
                <div className="text-3xl text-gray-800 text-center font-medium leading-relaxed">
                  {expandedBox.content}
                </div>

                {/* Конфетти эффект */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(30)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute animate-confetti"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: '-10%',
                        animationDelay: `${Math.random() * 0.5}s`,
                        animationDuration: `${2 + Math.random() * 2}s`
                      }}
                    >
                      {['🎉', '✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 5)]}
                    </div>
                  ))}
                </div>
              </div>

              {/* Низ коробки */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-16 bg-gradient-to-br from-orange-500 to-pink-600 rounded-b-3xl shadow-2xl">
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes boxOpen {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes lidOpen {
          0% { transform: translateX(-50%) translateY(0) rotateX(0deg); }
          100% { transform: translateX(-50%) translateY(-50px) rotateX(-45deg); }
        }

        @keyframes contentPop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-boxOpen {
          animation: boxOpen 0.5s ease-out;
        }

        .animate-lidOpen {
          animation: lidOpen 0.5s ease-out forwards;
          transform-origin: bottom center;
        }

        .animate-contentPop {
          animation: contentPop 0.6s ease-out 0.3s both;
        }

        .animate-confetti {
          animation: confetti linear infinite;
          font-size: 2rem;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </Layout>
  );
}
