'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MatchingPairs from '@/components/games/MatchingPairs';
import { GameResult } from '@/lib/types';

interface Pair {
  id: string;
  content: string;
  image?: string;
}

interface GameConfig {
  pairs: Pair[];
  gridSize: 'small' | 'medium' | 'large';
}

export default function PlayMatchingPairsPage() {
  const router = useRouter();
  const [config, setConfig] = useState<GameConfig | null>(null);

  useEffect(() => {
    // Load configuration from localStorage
    const savedConfig = localStorage.getItem('matching_pairs_config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    } else {
      // Use default config if none saved
      setConfig({
        pairs: [
          { id: '1', content: 'Cat', image: '🐱' },
          { id: '2', content: 'Dog', image: '🐕' },
          { id: '3', content: 'Apple', image: '🍎' },
          { id: '4', content: 'Banana', image: '🍌' },
          { id: '5', content: 'Car', image: '🚗' },
          { id: '6', content: 'House', image: '🏠' }
        ],
        gridSize: 'medium'
      });
    }
  }, []);

  const handleGameComplete = (result: GameResult) => {
    console.log('Game completed:', result);

    const message = `
      Игра завершена!
      Очки: ${result.score}
      Точность: ${Math.round(result.accuracy || 0)}%
      Ходов: ${result.customData?.totalMoves}
      Время: ${result.timeSpent}с
    `;

    alert(message);
  };

  const handleRestart = () => {
    router.push('/create/matching-pairs');
  };

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-center">
          <div className="text-2xl text-white mb-4">Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumbs */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-2 text-sm text-white/70 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
          <button
            onClick={() => router.push('/create')}
            className="hover:text-white"
          >
            Выберите шаблон
          </button>
          <span>›</span>
          <button
            onClick={() => router.push('/create/matching-pairs')}
            className="hover:text-white"
          >
            Ввести контент
          </button>
          <span>›</span>
          <span className="font-semibold text-white">Играть</span>
        </div>
      </div>

      {/* Edit button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleRestart}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium rounded-full backdrop-blur-sm transition-colors"
        >
          Изменить пары
        </button>
      </div>

      {/* Game */}
      <MatchingPairs
        pairs={config.pairs}
        gridSize={config.gridSize}
        onComplete={handleGameComplete}
      />
    </div>
  );
}