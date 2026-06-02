'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';

interface MatchPair {
  id: string;
  left: string;
  right: string;
}

export default function CreateMatchUpPage() {
  const router = useRouter();
  const [pairs, setPairs] = useState<MatchPair[]>([]);
  const [newLeft, setNewLeft] = useState('');
  const [newRight, setNewRight] = useState('');

  const addPair = () => {
    if (!newLeft.trim() || !newRight.trim()) {
      alert('Заполните оба поля!');
      return;
    }

    setPairs([...pairs, {
      id: Date.now().toString(),
      left: newLeft.trim(),
      right: newRight.trim()
    }]);

    setNewLeft('');
    setNewRight('');
  };

  const removePair = (id: string) => {
    setPairs(pairs.filter(p => p.id !== id));
  };

  const handleSubmit = () => {
    if (pairs.length < 3) {
      alert('Добавьте минимум 3 пары!');
      return;
    }

    localStorage.setItem('match_up_pairs', JSON.stringify(pairs));
    router.push('/create/match-up/play');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button onClick={() => router.push('/create')} className="hover:text-gray-900">
            Выберите шаблон
          </button>
          <span>›</span>
          <span className="font-semibold text-gray-900">Ввести контент</span>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-2xl">
            🔗
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Сопоставление</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {pairs.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Добавленные пары ({pairs.length})</h3>
              <div className="space-y-2">
                {pairs.map((pair) => (
                  <div key={pair.id} className="p-3 bg-gray-50 rounded-lg flex justify-between">
                    <div>
                      <span className="font-medium">{pair.left}</span>
                      <span className="mx-3">↔️</span>
                      <span className="text-gray-600">{pair.right}</span>
                    </div>
                    <button onClick={() => removePair(pair.id)} className="text-red-600">×</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 p-6 bg-green-50 rounded-xl">
            <h3 className="text-lg font-semibold">Добавить пару</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={newLeft}
                onChange={(e) => setNewLeft(e.target.value)}
                placeholder="Левая часть (например: Cat)"
                className="px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                value={newRight}
                onChange={(e) => setNewRight(e.target.value)}
                placeholder="Правая часть (например: Meow)"
                className="px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={addPair}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
            >
              Добавить пару
            </button>
          </div>

          <div className="flex justify-between items-center pt-6 mt-6 border-t">
            <span className="text-sm text-gray-600">
              {pairs.length < 3 ? 'Добавьте минимум 3 пары' : `Пар: ${pairs.length}`}
            </span>
            <button
              onClick={handleSubmit}
              disabled={pairs.length < 3}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium rounded-lg disabled:opacity-50"
            >
              Начать 🔗
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}