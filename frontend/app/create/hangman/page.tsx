'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';

export default function CreateHangmanPage() {
  const router = useRouter();
  const [words, setWords] = useState<any[]>([]);
  const [newWord, setNewWord] = useState('');
  const [newHint, setNewHint] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const addWord = () => {
    if (!newWord.trim()) {
      alert('Введите слово!');
      return;
    }

    // Check if word contains only letters and allowed characters
    if (!/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(newWord)) {
      alert('Слово может содержать только буквы, пробелы и дефисы!');
      return;
    }

    setWords([...words, {
      word: newWord.trim().toUpperCase(),
      hint: newHint.trim() || undefined,
      category: newCategory.trim() || undefined
    }]);

    setNewWord('');
    setNewHint('');
    setNewCategory('');
  };

  const removeWord = (index: number) => {
    setWords(words.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (words.length < 1) {
      alert('Добавьте хотя бы одно слово!');
      return;
    }

    localStorage.setItem('hangman_data', JSON.stringify(words));
    router.push('/create/hangman/play');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">🎯 Виселица</h1>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {words.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Слова ({words.length})</h3>
              <div className="space-y-2">
                {words.map((w, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{w.word}</span>
                      {w.category && <span className="ml-2 text-sm text-gray-600">({w.category})</span>}
                      {w.hint && <p className="text-sm text-gray-500">💡 {w.hint}</p>}
                    </div>
                    <button
                      onClick={() => removeWord(i)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 p-6 bg-red-50 rounded-xl">
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              placeholder="Слово для угадывания"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              value={newHint}
              onChange={(e) => setNewHint(e.target.value)}
              placeholder="Подсказка (необязательно)"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Категория (необязательно)"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <button
              onClick={addWord}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Добавить слово
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={words.length < 1}
            className="mt-6 px-8 py-3 bg-red-600 text-white rounded-lg disabled:opacity-50 hover:bg-red-700"
          >
            Начать игру
          </button>
        </div>
      </div>
    </Layout>
  );
}