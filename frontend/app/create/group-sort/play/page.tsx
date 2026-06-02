'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GroupSort from '@/components/games/GroupSort';
import { GameResult } from '@/lib/types';

interface Item {
  id: string;
  content: string;
  groupId: string;
  image?: string;
}

interface Group {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

interface GameConfig {
  title: string;
  groups: Group[];
  items: Item[];
}

export default function PlayGroupSortPage() {
  const router = useRouter();
  const [config, setConfig] = useState<GameConfig | null>(null);

  useEffect(() => {
    // Load configuration from localStorage
    const savedConfig = localStorage.getItem('group_sort_config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    } else {
      // Use default config if none saved
      setConfig({
        title: 'Сортировка по группам',
        groups: [
          { id: 'fruits', name: 'Фрукты', color: '#10b981', icon: '🍎' },
          { id: 'animals', name: 'Животные', color: '#3b82f6', icon: '🐾' },
          { id: 'transport', name: 'Транспорт', color: '#f59e0b', icon: '🚗' },
        ],
        items: [
          { id: '1', content: 'Яблоко', groupId: 'fruits', image: '🍎' },
          { id: '2', content: 'Банан', groupId: 'fruits', image: '🍌' },
          { id: '3', content: 'Апельсин', groupId: 'fruits', image: '🍊' },
          { id: '4', content: 'Собака', groupId: 'animals', image: '🐕' },
          { id: '5', content: 'Кошка', groupId: 'animals', image: '🐱' },
          { id: '6', content: 'Слон', groupId: 'animals', image: '🐘' },
          { id: '7', content: 'Машина', groupId: 'transport', image: '🚗' },
          { id: '8', content: 'Самолет', groupId: 'transport', image: '✈️' },
          { id: '9', content: 'Велосипед', groupId: 'transport', image: '🚲' },
        ]
      });
    }
  }, []);

  const handleGameComplete = (result: GameResult) => {
    console.log('Game completed:', result);

    const message = `
      Игра завершена!
      Очки: ${result.score}
      Точность: ${Math.round(result.accuracy || 0)}%
      Ошибки: ${result.mistakes}
      Время: ${result.timeSpent}с
    `;

    alert(message);
  };

  const handleRestart = () => {
    router.push('/create/group-sort');
  };

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-orange-500">
        <div className="text-center">
          <div className="text-2xl text-white mb-4">Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumbs */}
      <div className="absolute top-4 left-4 z-50">
        <div className="flex items-center gap-2 text-sm text-white/70 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
          <button
            onClick={() => router.push('/create')}
            className="hover:text-white"
          >
            Выберите шаблон
          </button>
          <span>›</span>
          <button
            onClick={() => router.push('/create/group-sort')}
            className="hover:text-white"
          >
            Ввести контент
          </button>
          <span>›</span>
          <span className="font-semibold text-white">Играть</span>
        </div>
      </div>

      {/* Edit button */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={handleRestart}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium rounded-full backdrop-blur-sm transition-colors"
        >
          Изменить настройки
        </button>
      </div>

      {/* Game */}
      <GroupSort
        title={config.title}
        groups={config.groups}
        items={config.items}
        onComplete={handleGameComplete}
      />
    </div>
  );
}