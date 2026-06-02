'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SpeakingCards from '@/components/games/SpeakingCards';

export default function PlaySpeakingCardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('speaking_cards_data');
    if (saved) {
      setCards(JSON.parse(saved));
    } else {
      setCards([
        { id: '1', content: 'Tell about your day', category: 'Daily' },
        { id: '2', content: 'Describe your hobby', category: 'Personal' },
        { id: '3', content: 'What makes you happy?', category: 'Emotions' }
      ]);
    }
  }, []);

  if (!cards) return <div>Загрузка...</div>;

  return (
    <div className="min-h-screen">
      <div className="absolute top-4 left-4 z-10">
        <button onClick={() => router.push('/create/speaking-cards')}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
          ← Назад
        </button>
      </div>
      <SpeakingCards cards={cards} />
    </div>
  );
}