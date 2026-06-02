'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Wordsearch from '@/components/games/Wordsearch';

export default function PlayWordsearchPage() {
  const router = useRouter();
  const [gameData, setGameData] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('wordsearch_data');
    if (saved) {
      const data = JSON.parse(saved);
      setGameData(data);
    } else {
      setGameData({
        words: ['ПРОГРАММА', 'КОМПЬЮТЕР', 'МОНИТОР', 'КЛАВИАТУРА', 'МЫШЬ'],
        gridSize: 15
      });
    }
  }, []);

  if (!gameData) return <div>Загрузка...</div>;

  return (
    <div className="min-h-screen">
      <div className="absolute top-4 left-4 z-10">
        <button onClick={() => router.push('/create/wordsearch')}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
          ← Назад
        </button>
      </div>
      <Wordsearch words={gameData.words} gridSize={gameData.gridSize} />
    </div>
  );
}