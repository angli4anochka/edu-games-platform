'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SpellWord from '@/components/games/SpellWord';

export default function PlaySpellWordPage() {
  const router = useRouter();
  const [words, setWords] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('spell_word_data');
    if (saved) {
      setWords(JSON.parse(saved));
    } else {
      setWords([
        { word: 'computer', hint: 'Electronic device', category: 'Technology' },
        { word: 'education', hint: 'Process of learning', category: 'School' },
        { word: 'javascript', hint: 'Programming language', category: 'Technology' }
      ]);
    }
  }, []);

  if (!words) return <div>Загрузка...</div>;

  return (
    <div className="min-h-screen">
      <div className="absolute top-4 left-4 z-10">
        <button onClick={() => router.push('/create/spell-word')}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
          ← Назад
        </button>
      </div>
      <SpellWord words={words} />
    </div>
  );
}