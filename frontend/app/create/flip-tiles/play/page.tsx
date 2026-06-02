'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FlipTiles from '@/components/games/FlipTiles';

export default function PlayFlipTilesPage() {
  const router = useRouter();
  const [tiles, setTiles] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('flip_tiles_data');
    if (saved) {
      setTiles(JSON.parse(saved));
    } else {
      setTiles([
        { id: '1', front: 'Hello', back: 'Привет', category: 'Greetings' },
        { id: '2', front: 'Goodbye', back: 'До свидания', category: 'Greetings' },
        { id: '3', front: 'Yes', back: 'Да', category: 'Basic' },
        { id: '4', front: 'No', back: 'Нет', category: 'Basic' }
      ]);
    }
  }, []);

  if (!tiles) return <div>Загрузка...</div>;

  return (
    <div className="min-h-screen">
      <div className="absolute top-4 left-4 z-10">
        <button onClick={() => router.push('/create/flip-tiles')}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
          ← Назад
        </button>
      </div>
      <FlipTiles tiles={tiles} />
    </div>
  );
}