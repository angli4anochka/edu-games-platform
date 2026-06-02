'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';

export default function CreateWordsearchPage() {
  const router = useRouter();
  const [words, setWords] = useState<string[]>([]);
  const [newWord, setNewWord] = useState('');
  const [gridSize, setGridSize] = useState(15);

  const addWord = () => {
    const trimmedWord = newWord.trim().toUpperCase();

    if (!trimmedWord) {
      alert('Введите слово!');
      return;
    }

    if (!/^[A-ZА-ЯЁ]+$/.test(trimmedWord)) {
      alert('Слово должно содержать только буквы!');
      return;
    }

    if (trimmedWord.length > gridSize) {
      alert(`Слово слишком длинное для сетки ${gridSize}x${gridSize}!`);
      return;
    }

    if (words.includes(trimmedWord)) {
      alert('Это слово уже добавлено!');
      return;
    }

    setWords([...words, trimmedWord]);
    setNewWord('');
  };

  const removeWord = (index: number) => {
    setWords(words.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (words.length < 3) {
      alert('Добавьте минимум 3 слова!');
      return;
    }

    if (words.length > gridSize * 2) {
      alert(`Слишком много слов для сетки ${gridSize}x${gridSize}!`);
      return;
    }

    localStorage.setItem('wordsearch_data', JSON.stringify({ words, gridSize }));
    router.push('/create/wordsearch/play');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">🔍 Поиск слов</h1>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Grid Size Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Размер сетки</label>
            <div className="flex gap-2">
              {[10, 12, 15, 18, 20].map(size => (
                <button
                  key={size}
                  onClick={() => setGridSize(size)}
                  className={`px-4 py-2 rounded-lg ${
                    gridSize === size
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {size}x{size}
                </button>
              ))}
            </div>
          </div>

          {/* Words List */}
          {words.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Слова ({words.length})</h3>
              <div className="flex flex-wrap gap-2">
                {words.map((word, i) => (
                  <div
                    key={i}
                    className="px-3 py-2 bg-gray-100 rounded-lg flex items-center gap-2"
                  >
                    <span className="font-medium">{word}</span>
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

          {/* Add Word Form */}
          <div className="space-y-4 p-6 bg-green-50 rounded-xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addWord()}
                placeholder="Введите слово"
                className="flex-1 px-3 py-2 border rounded-lg uppercase"
              />
              <button
                onClick={addWord}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Добавить
              </button>
            </div>
            <p className="text-sm text-gray-600">
              • Используйте только буквы (без пробелов и знаков)<br />
              • Максимальная длина слова: {gridSize} букв<br />
              • Рекомендуется {Math.floor(gridSize * 0.8)} слов для сетки {gridSize}x{gridSize}
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={words.length < 3}
            className="mt-6 px-8 py-3 bg-green-600 text-white rounded-lg disabled:opacity-50 hover:bg-green-700"
          >
            Создать игру
          </button>
        </div>
      </div>
    </Layout>
  );
}