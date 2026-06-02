'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';

export default function CreateRacingLettersPage() {
  const router = useRouter();
  const [selectedPair, setSelectedPair] = useState<'bd' | 'pq' | 'mn' | 'custom'>('bd');
  const [customLetters, setCustomLetters] = useState(['', '']);
  const [goalCount, setGoalCount] = useState(10);

  const letterPairs = {
    bd: { letters: ['b', 'd'], description: 'Классическая путаница: b и d' },
    pq: { letters: ['p', 'q'], description: 'Зеркальные буквы: p и q' },
    mn: { letters: ['m', 'n'], description: 'Похожие буквы: m и n' },
    custom: { letters: customLetters, description: 'Свои буквы' }
  };

  const handleSubmit = () => {
    let letters = letterPairs[selectedPair].letters;

    if (selectedPair === 'custom') {
      if (!customLetters[0] || !customLetters[1]) {
        alert('Введите обе буквы для тренировки!');
        return;
      }
      letters = customLetters;
    }

    // Save configuration to localStorage
    localStorage.setItem('racing_letters_config', JSON.stringify({
      targetLetters: letters,
      goalCount
    }));

    router.push('/create/racing-letters/play');
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
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-purple-500 rounded-lg flex items-center justify-center text-2xl">
            🏎️
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Гонки букв</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Instructions */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Как играть
            </h2>
            <ul className="space-y-2 text-gray-600">
              <li>• Управляйте машинкой стрелками или клавишами WASD</li>
              <li>• Собирайте только правильную букву</li>
              <li>• Избегайте неправильных букв (−1 балл)</li>
              <li>• Цель — собрать нужное количество правильных букв</li>
              <li>• Скорость увеличивается с каждой правильной буквой</li>
            </ul>
          </div>

          {/* Letter pair selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Выберите пару букв для тренировки</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedPair('bd')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedPair === 'bd'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-3xl font-bold mb-2">b / d</div>
                <div className="text-sm text-gray-600">Классическая путаница</div>
              </button>

              <button
                onClick={() => setSelectedPair('pq')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedPair === 'pq'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-3xl font-bold mb-2">p / q</div>
                <div className="text-sm text-gray-600">Зеркальные буквы</div>
              </button>

              <button
                onClick={() => setSelectedPair('mn')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedPair === 'mn'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-3xl font-bold mb-2">m / n</div>
                <div className="text-sm text-gray-600">Похожие буквы</div>
              </button>

              <button
                onClick={() => setSelectedPair('custom')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedPair === 'custom'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-3xl font-bold mb-2">? / ?</div>
                <div className="text-sm text-gray-600">Свои буквы</div>
              </button>
            </div>
          </div>

          {/* Custom letters input */}
          {selectedPair === 'custom' && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <h4 className="font-medium mb-3">Введите свои буквы</h4>
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  value={customLetters[0]}
                  onChange={(e) => {
                    const value = e.target.value.slice(0, 1).toLowerCase();
                    setCustomLetters([value, customLetters[1]]);
                  }}
                  placeholder="Буква 1"
                  className="w-24 px-4 py-2 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={1}
                />
                <span className="text-2xl font-bold text-gray-600">/</span>
                <input
                  type="text"
                  value={customLetters[1]}
                  onChange={(e) => {
                    const value = e.target.value.slice(0, 1).toLowerCase();
                    setCustomLetters([customLetters[0], value]);
                  }}
                  placeholder="Буква 2"
                  className="w-24 px-4 py-2 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={1}
                />
              </div>
            </div>
          )}

          {/* Goal count */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Цель игры</h3>
            <div className="flex items-center gap-3">
              <label className="text-gray-700">Собрать букв:</label>
              <select
                value={goalCount}
                onChange={(e) => setGoalCount(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5 букв (легко)</option>
                <option value={10}>10 букв (средне)</option>
                <option value={15}>15 букв (сложно)</option>
                <option value={20}>20 букв (эксперт)</option>
              </select>
            </div>
          </div>

          {/* Preview */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-medium mb-2">Настройки игры:</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div>• Буквы для тренировки: <span className="font-bold text-gray-900">
                {selectedPair === 'custom' && customLetters[0] && customLetters[1]
                  ? `${customLetters[0]} / ${customLetters[1]}`
                  : letterPairs[selectedPair].letters.join(' / ')}
              </span></div>
              <div>• Цель: <span className="font-bold text-gray-900">{goalCount} букв</span></div>
              <div>• Управление: стрелки или WASD</div>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="text-sm text-gray-600">
              Настройте параметры игры и нажмите "Начать гонку"
            </div>
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all"
            >
              Начать гонку 🏎️
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}