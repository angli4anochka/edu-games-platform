'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LabelledDiagram from '@/components/games/LabelledDiagram';

export default function PlayLabelledDiagramPage() {
  const router = useRouter();
  const [gameData, setGameData] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('labelled_diagram_data');
    if (saved) {
      setGameData(JSON.parse(saved));
    } else {
      // Default example - human body diagram
      setGameData({
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Gray_-_Anatomy_of_the_Human_Body.png/200px-Gray_-_Anatomy_of_the_Human_Body.png',
        title: 'Анатомия человека',
        labels: [
          { id: '1', text: 'Голова', correctX: 50, correctY: 15 },
          { id: '2', text: 'Плечо', correctX: 35, correctY: 30 },
          { id: '3', text: 'Рука', correctX: 25, correctY: 45 },
          { id: '4', text: 'Грудь', correctX: 50, correctY: 35 },
          { id: '5', text: 'Живот', correctX: 50, correctY: 50 },
          { id: '6', text: 'Нога', correctX: 40, correctY: 75 }
        ]
      });
    }
  }, []);

  if (!gameData) return <div>Загрузка...</div>;

  return (
    <div className="min-h-screen">
      <div className="absolute top-4 left-4 z-10">
        <button onClick={() => router.push('/create/labelled-diagram')}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
          ← Назад
        </button>
      </div>
      <LabelledDiagram
        imageUrl={gameData.imageUrl}
        labels={gameData.labels}
        title={gameData.title}
      />
    </div>
  );
}