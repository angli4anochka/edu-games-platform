'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GameResult } from '@/lib/types';
import RacingLetters from '@/components/games/RacingLetters';

interface GameConfig {
  targetLetters: string[];
  goalCount: number;
}

export default function PlayRacingLettersPage() {
  const router = useRouter();
  const [config, setConfig] = useState<GameConfig | null>(null);

  useEffect(() => {
    // Load configuration from localStorage
    const savedConfig = localStorage.getItem('racing_letters_config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    } else {
      // Use default config if none saved
      setConfig({
        targetLetters: ['b', 'd'],
        goalCount: 10
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
    router.push('/create/racing-letters');
  };

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-2xl mb-4">Загрузка...</div>
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
            onClick={() => router.push('/create/racing-letters')}
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
      <RacingLetters
        targetLetters={config.targetLetters}
        goalCount={config.goalCount}
        onComplete={handleGameComplete}
      />
    </div>
  );
}