'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Hangman from '@/components/games/Hangman';

export default function PlayHangmanPage() {
  const router = useRouter();
  const [words, setWords] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('hangman_data');
    if (saved) {
      setWords(JSON.parse(saved));
    } else {
      setWords([
        { word: 'ПРОГРАММИРОВАНИЕ', hint: 'Процесс создания кода', category: 'IT' },
        { word: 'КОМПЬЮТЕР', hint: 'Электронное устройство', category: 'Техника' }
      ]);
    }
  }, []);

  if (!words) return <div>Загрузка...</div>;

  return (
    <div className="min-h-screen">
      <div className="absolute top-4 left-4 z-10">
        <button onClick={() => router.push('/create/hangman')}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
          ← Назад
        </button>
      </div>
      <Hangman words={words} />
    </div>
  );
}