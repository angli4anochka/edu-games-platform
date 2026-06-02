'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Quiz, { QuizQuestion } from '@/components/games/Quiz';
import { GameResult } from '@/lib/types';

interface QuizConfig {
  questions: QuizQuestion[];
  title: string;
  timePerQuestion: number;
}

export default function PlayQuizPage() {
  const router = useRouter();
  const [config, setConfig] = useState<QuizConfig | null>(null);

  useEffect(() => {
    // Load configuration from localStorage
    const savedConfig = localStorage.getItem('quiz_config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    } else {
      // Use default config if none saved
      setConfig({
        title: 'Викторина',
        timePerQuestion: 30,
        questions: [
          {
            question: "Какая столица России?",
            answers: ["Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург"],
            correctAnswer: 0,
            explanation: "Москва является столицей Российской Федерации.",
            image: "🏛️"
          },
          {
            question: "Сколько планет в Солнечной системе?",
            answers: ["7", "8", "9", "10"],
            correctAnswer: 1,
            explanation: "В Солнечной системе 8 планет.",
            image: "🪐"
          },
          {
            question: "Какой океан самый большой?",
            answers: ["Атлантический", "Индийский", "Северный Ледовитый", "Тихий"],
            correctAnswer: 3,
            explanation: "Тихий океан - самый большой океан на Земле.",
            image: "🌊"
          }
        ]
      });
    }
  }, []);

  const handleGameComplete = (result: GameResult) => {
    console.log('Game completed:', result);

    const message = `
      Викторина завершена!
      Очки: ${result.score}
      Точность: ${Math.round(result.accuracy || 0)}%
      Правильных ответов: ${result.customData?.correctAnswers}
      Время: ${result.timeSpent}с
    `;

    alert(message);
  };

  const handleRestart = () => {
    router.push('/create/quiz');
  };

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
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
            onClick={() => router.push('/create/quiz')}
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
          Изменить вопросы
        </button>
      </div>

      {/* Game */}
      <Quiz
        questions={config.questions}
        title={config.title}
        timePerQuestion={config.timePerQuestion}
        onComplete={handleGameComplete}
      />
    </div>
  );
}