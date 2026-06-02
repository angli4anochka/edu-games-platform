'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Unjumble from '@/components/games/Unjumble';
import { GameResult } from '@/lib/types';

interface Sentence {
  text: string;
  correctOrder: string[];
  hint?: string;
}

export default function PlayUnjumblePage() {
  const router = useRouter();
  const [sentences, setSentences] = useState<Sentence[] | null>(null);

  useEffect(() => {
    // Load sentences from localStorage
    const savedSentences = localStorage.getItem('unjumble_sentences');
    if (savedSentences) {
      setSentences(JSON.parse(savedSentences));
    } else {
      // Use default sentences if none saved
      setSentences([
        {
          text: 'The cat is sleeping on the sofa',
          correctOrder: ['The', 'cat', 'is', 'sleeping', 'on', 'the', 'sofa'],
          hint: 'Кошка спит на диване'
        },
        {
          text: 'I like to read books',
          correctOrder: ['I', 'like', 'to', 'read', 'books'],
          hint: 'Я люблю читать книги'
        },
        {
          text: 'She plays piano very well',
          correctOrder: ['She', 'plays', 'piano', 'very', 'well'],
          hint: 'Она очень хорошо играет на пианино'
        }
      ]);
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
    router.push('/create/unjumble');
  };

  if (!sentences) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
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
            onClick={() => router.push('/create/unjumble')}
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
          Изменить предложения
        </button>
      </div>

      {/* Game */}
      <Unjumble
        sentences={sentences}
        onComplete={handleGameComplete}
      />
    </div>
  );
}