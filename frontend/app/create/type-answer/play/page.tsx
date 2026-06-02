'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TypeAnswer from '@/components/games/TypeAnswer';

export default function PlayTypeAnswerPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('type_answer_data');
    if (saved) {
      setQuestions(JSON.parse(saved));
    } else {
      setQuestions([
        { question: "What is 2 + 2?", answer: "4", hint: "Basic math" },
        { question: "Capital of France?", answer: "Paris", hint: "City of lights" }
      ]);
    }
  }, []);

  if (!questions) return <div>Загрузка...</div>;

  return (
    <div className="min-h-screen">
      <div className="absolute top-4 left-4 z-10">
        <button onClick={() => router.push('/create/type-answer')}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
          ← Назад
        </button>
      </div>
      <TypeAnswer questions={questions} />
    </div>
  );
}