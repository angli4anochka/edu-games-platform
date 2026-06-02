'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CompleteSentence from '@/components/games/CompleteSentence';

export default function PlayCompleteSentencePage() {
  const router = useRouter();
  const [sentences, setSentences] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('complete_sentence_data');
    if (saved) {
      setSentences(JSON.parse(saved));
    } else {
      setSentences([
        {
          text: 'The cat is ___ on the ___.',
          blanks: ['sleeping', 'sofa'],
          options: ['sleeping', 'sofa', 'running', 'table']
        }
      ]);
    }
  }, []);

  if (!sentences) return <div>Загрузка...</div>;

  return (
    <div className="min-h-screen">
      <div className="absolute top-4 left-4 z-10">
        <button onClick={() => router.push('/create/complete-sentence')}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
          ← Назад
        </button>
      </div>
      <CompleteSentence sentences={sentences} />
    </div>
  );
}