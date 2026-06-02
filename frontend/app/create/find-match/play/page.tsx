'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FindMatch from '@/components/games/FindMatch';

export default function PlayFindMatchPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('find_match_data');
    if (saved) {
      setQuestions(JSON.parse(saved));
    } else {
      setQuestions([
        {
          question: "Match the colors",
          answers: ["Red", "Blue", "Green", "Yellow"],
          correctAnswers: [0, 2]
        }
      ]);
    }
  }, []);

  if (!questions) return <div>Загрузка...</div>;

  return (
    <div className="min-h-screen">
      <div className="absolute top-4 left-4 z-10">
        <button onClick={() => router.push('/create/find-match')}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
          ← Назад
        </button>
      </div>
      <FindMatch questions={questions} />
    </div>
  );
}