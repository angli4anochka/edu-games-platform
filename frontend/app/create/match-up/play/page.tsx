'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MatchUp from '@/components/games/MatchUp';

export default function PlayMatchUpPage() {
  const router = useRouter();
  const [pairs, setPairs] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('match_up_pairs');
    if (saved) {
      setPairs(JSON.parse(saved));
    } else {
      setPairs([
        { id: '1', left: 'Cat', right: 'Meow' },
        { id: '2', left: 'Dog', right: 'Bark' },
        { id: '3', left: 'Cow', right: 'Moo' }
      ]);
    }
  }, []);

  if (!pairs) return <div>Загрузка...</div>;

  return (
    <div className="min-h-screen">
      <div className="absolute top-4 left-4 z-10">
        <button onClick={() => router.push('/create/match-up')}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
          ← Назад
        </button>
      </div>
      <MatchUp pairs={pairs} />
    </div>
  );
}