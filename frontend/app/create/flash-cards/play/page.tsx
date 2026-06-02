'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FlashCards from '@/components/games/FlashCards';
import { GameResult } from '@/lib/types';

export default function PlayFlashCardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<any>(null);

  useEffect(() => {
    const savedCards = localStorage.getItem('flash_cards_data');
    if (savedCards) {
      setCards(JSON.parse(savedCards));
    } else {
      setCards([
        { id: '1', front: 'Hello', back: 'Привет', image: '👋' },
        { id: '2', front: 'Cat', back: 'Кошка', image: '🐱' },
        { id: '3', front: 'Book', back: 'Книга', image: '📚' }
      ]);
    }
  }, []);

  const handleComplete = (result: GameResult) => {
    alert(`Завершено! Очки: ${result.score}`);
  };

  if (!cards) return <div>Загрузка...</div>;

  return (
    <div className="min-h-screen">
      <div className="absolute top-4 left-4 z-10">
        <button onClick={() => router.push('/create/flash-cards')}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
          ← Назад
        </button>
      </div>
      <FlashCards cards={cards} onComplete={handleComplete} />
    </div>
  );
}