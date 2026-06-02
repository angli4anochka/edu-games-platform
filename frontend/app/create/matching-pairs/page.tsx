'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';

interface Pair {
  id: string;
  content: string;
  image?: string;
}

export default function CreateMatchingPairsPage() {
  const router = useRouter();
  const [pairs, setPairs] = useState<Pair[]>([
    { id: '1', content: 'Cat', image: '🐱' },
    { id: '2', content: 'Dog', image: '🐕' }
  ]);

  const [newContent, setNewContent] = useState('');
  const [newImage, setNewImage] = useState('');
  const [gridSize, setGridSize] = useState<'small' | 'medium' | 'large'>('medium');

  const emojiSuggestions = [
    '🐱', '🐕', '🦊', '🐻', '🐼', '🦁', '🐸', '🐵',
    '🍎', '🍌', '🍊', '🍓', '🍉', '🍇', '🥕', '🌽',
    '🚗', '🚕', '✈️', '🚀', '🚲', '🏠', '🏢', '🏫',
    '☀️', '🌙', '⭐', '🌈', '☁️', '❄️', '🔥', '💧'
  ];

  const addPair = () => {
    if (!newContent.trim()) {
      alert('Введите текст для пары!');
      return;
    }

    if (pairs.length >= 12) {
      alert('Максимум 12 пар!');
      return;
    }

    setPairs([...pairs, {
      id: Date.now().toString(),
      content: newContent.trim(),
      image: newImage || undefined
    }]);

    setNewContent('');
    setNewImage('');
  };

  const removePair = (id: string) => {
    setPairs(pairs.filter(p => p.id !== id));
  };

  const handleSubmit = () => {
    if (pairs.length < 2) {
      alert('Добавьте минимум 2 пары!');
      return;
    }

    localStorage.setItem('matching_pairs_config', JSON.stringify({
      pairs,
      gridSize
    }));
    router.push('/create/matching-pairs/play');
  };

  const addPresetPairs = () => {
    const presets: Pair[] = [
      { id: '1', content: 'Apple', image: '🍎' },
      { id: '2', content: 'Banana', image: '🍌' },
      { id: '3', content: 'Car', image: '🚗' },
      { id: '4', content: 'House', image: '🏠' },
      { id: '5', content: 'Sun', image: '☀️' },
      { id: '6', content: 'Moon', image: '🌙' },
      { id: '7', content: 'Tree', image: '🌳' },
      { id: '8', content: 'Flower', image: '🌸' }
    ];
    setPairs(presets);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button
            onClick={() => router.push('/create')}
            className="hover:text-gray-900"
          >
            Выберите шаблон
          </button>
          <span>›</span>
          <span className="font-semibold text-gray-900">Ввести контент</span>
          <span>›</span>
          <span className="text-gray-400">Играть</span>
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-2xl">
            🎴
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Найди пары</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Instructions */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Как играть
            </h2>
            <ul className="space-y-2 text-gray-600">
              <li>• Переворачивайте карты, чтобы найти совпадающие пары</li>
              <li>• За один ход можно открыть только 2 карты</li>
              <li>• Запоминайте расположение карт</li>
              <li>• Цель - найти все пары за минимальное количество ходов</li>
            </ul>
          </div>

          {/* Grid Size Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Размер сетки</h3>
            <div className="flex gap-3">
              <button
                onClick={() => setGridSize('small')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  gridSize === 'small'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Маленькая (3x4)
              </button>
              <button
                onClick={() => setGridSize('medium')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  gridSize === 'medium'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Средняя (4x4)
              </button>
              <button
                onClick={() => setGridSize('large')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  gridSize === 'large'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Большая (4x6)
              </button>
            </div>
          </div>

          {/* Pairs List */}
          {pairs.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">
                Добавленные пары ({pairs.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {pairs.map((pair) => (
                  <div key={pair.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {pair.image && <span className="text-2xl">{pair.image}</span>}
                      <span className="font-medium">{pair.content}</span>
                    </div>
                    <button
                      onClick={() => removePair(pair.id)}
                      className="text-red-600 hover:text-red-800 text-xl font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Pair Form */}
          <div className="space-y-4 p-6 bg-blue-50 rounded-xl">
            <h3 className="text-lg font-semibold">Добавить пару</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Текст
              </label>
              <input
                type="text"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Например: Apple"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Эмодзи или символ (необязательно)
              </label>
              <input
                type="text"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="Например: 🍎"
                maxLength={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Emoji Suggestions */}
              <div className="mt-2">
                <p className="text-xs text-gray-600 mb-1">Быстрый выбор:</p>
                <div className="flex flex-wrap gap-1">
                  {emojiSuggestions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setNewImage(emoji)}
                      className="w-8 h-8 text-xl hover:bg-gray-200 rounded transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={addPair}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Добавить пару
              </button>
              <button
                onClick={addPresetPairs}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Использовать пример
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-between items-center pt-6 mt-6 border-t">
            <div className="text-sm text-gray-600">
              {pairs.length < 2
                ? 'Добавьте минимум 2 пары'
                : `Добавлено пар: ${pairs.length} (карт будет ${pairs.length * 2})`}
            </div>
            <button
              onClick={handleSubmit}
              disabled={pairs.length < 2}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Начать игру 🎴
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}