'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';

export default function CreateFlipTilesPage() {
  const router = useRouter();
  const [tiles, setTiles] = useState<any[]>([]);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const addTile = () => {
    if (!newFront.trim() || !newBack.trim()) {
      alert('Заполните обе стороны плитки!');
      return;
    }

    setTiles([...tiles, {
      id: Date.now().toString(),
      front: newFront.trim(),
      back: newBack.trim(),
      category: newCategory.trim() || undefined
    }]);

    setNewFront('');
    setNewBack('');
    setNewCategory('');
  };

  const removeTile = (id: string) => {
    setTiles(tiles.filter(t => t.id !== id));
  };

  const handleSubmit = () => {
    if (tiles.length < 4) {
      alert('Добавьте минимум 4 плитки!');
      return;
    }

    localStorage.setItem('flip_tiles_data', JSON.stringify(tiles));
    router.push('/create/flip-tiles/play');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">🔄 Переворот плиток</h1>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {tiles.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Плитки ({tiles.length})</h3>
              <div className="grid grid-cols-2 gap-3">
                {tiles.map((tile) => (
                  <div key={tile.id} className="relative p-3 bg-gray-50 rounded-lg">
                    <button
                      onClick={() => removeTile(tile.id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                    <div className="pr-6">
                      <p className="font-medium text-sm">{tile.front}</p>
                      <p className="text-sm text-gray-600">↔ {tile.back}</p>
                      {tile.category && (
                        <span className="text-xs text-gray-500">📁 {tile.category}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 p-6 bg-purple-50 rounded-xl">
            <input
              type="text"
              value={newFront}
              onChange={(e) => setNewFront(e.target.value)}
              placeholder="Лицевая сторона"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              value={newBack}
              onChange={(e) => setNewBack(e.target.value)}
              placeholder="Обратная сторона"
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
              onClick={addTile}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Добавить плитку
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={tiles.length < 4}
            className="mt-6 px-8 py-3 bg-purple-600 text-white rounded-lg disabled:opacity-50 hover:bg-purple-700"
          >
            Начать изучение
          </button>
        </div>
      </div>
    </Layout>
  );
}