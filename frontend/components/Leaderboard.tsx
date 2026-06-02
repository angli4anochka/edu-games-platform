'use client';

import { useEffect, useState } from 'react';

interface LeaderboardEntry {
  id: number;
  player_name: string;
  score: number;
  time_seconds: number;
  created_at: string;
}

interface LeaderboardProps {
  activityType: string;
  limit?: number;
}

export function Leaderboard({ activityType, limit = 10 }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, [activityType]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await fetch(
        `http://localhost:8000/api/leaderboard/?activity_type=${activityType}&limit=${limit}`
      );

      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Error loading leaderboard:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMedalEmoji = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          🏆 Таблица лидеров
        </h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          🏆 Таблица лидеров
        </h2>
        <div className="text-center py-8 text-gray-500">
          <p>Не удалось загрузить таблицу лидеров</p>
          <button
            onClick={loadLeaderboard}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          🏆 Таблица лидеров
        </h2>
        <div className="text-center py-8 text-gray-500">
          <p>Пока нет результатов</p>
          <p className="text-sm mt-2">Будьте первым!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        🏆 Таблица лидеров
      </h2>

      <div className="space-y-2">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className={`flex items-center justify-between p-4 rounded-lg transition-all ${
              index < 3
                ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            {/* Позиция и имя */}
            <div className="flex items-center gap-4 flex-1">
              <div className={`text-2xl font-bold ${index < 3 ? 'w-12' : 'w-8 text-gray-500'}`}>
                {getMedalEmoji(index)}
              </div>
              <div className="flex-1">
                <div className={`font-semibold ${index < 3 ? 'text-lg' : ''}`}>
                  {entry.player_name}
                </div>
              </div>
            </div>

            {/* Результаты */}
            <div className="flex items-center gap-6">
              {/* Время */}
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Время</div>
                <div className="font-bold text-green-600">
                  {formatTime(entry.time_seconds)}
                </div>
              </div>

              {/* Баллы */}
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Баллы</div>
                <div className="font-bold text-blue-600">{entry.score}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Легенда */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Сортировка: сначала по времени (меньше = лучше), затем по баллам
        </p>
      </div>
    </div>
  );
}
