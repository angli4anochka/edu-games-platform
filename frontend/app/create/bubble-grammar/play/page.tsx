'use client';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import BubbleGrammar from '@/components/games/BubbleGrammar';
import { useRouter } from 'next/navigation';
import { GameResult } from '@/lib/types';

interface Task {
  topic: string;
  sentence: string;
  answer: string;
  options: string[];
  feedback: string;
}

export default function PlayBubbleGrammarPage() {
  const router = useRouter();
  const [activityData, setActivityData] = useState<{ tasks: Task[] } | null>(null);

  useEffect(() => {
    // Load activity data from localStorage
    const savedData = localStorage.getItem('bubble_grammar_activity');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setActivityData(parsed);
    } else {
      // Use default tasks if no data
      setActivityData({
        tasks: [
          {
            topic: "Present Simple",
            sentence: 'He ______ his teeth in the morning.',
            answer: "brushes",
            options: ["brushing", "are brushing", "brushes", "is brush"],
            feedback: "Да. He brushes. После he/she/it добавляем -s или -es."
          },
          {
            topic: "Present Continuous",
            sentence: 'Look! She ______ now.',
            answer: "is reading",
            options: ["reads", "is reading", "read", "reading"],
            feedback: "Верно: she is reading now. Now любит Continuous."
          },
          {
            topic: "Present Simple",
            sentence: 'They ______ football every Sunday.',
            answer: "play",
            options: ["plays", "are play", "play", "playing"],
            feedback: "Верно: they play. Для they без -s."
          }
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
    `;

    alert(message);

    // Optionally redirect back to create page
    // router.push('/create/bubble-grammar');
  };

  const handleRestart = () => {
    router.push('/create/bubble-grammar');
  };

  if (!activityData) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-2xl mb-4">Загрузка...</div>
          </div>
        </div>
      </Layout>
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
            onClick={() => router.push('/create/bubble-grammar')}
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
          Изменить задания
        </button>
      </div>

      {/* Game */}
      <BubbleGrammar
        tasks={activityData.tasks}
        onComplete={handleGameComplete}
      />
    </div>
  );
}