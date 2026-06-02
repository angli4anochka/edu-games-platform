'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';

export default function CreateLabelledDiagramPage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [labels, setLabels] = useState<any[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [newX, setNewX] = useState('50');
  const [newY, setNewY] = useState('50');

  const addLabel = () => {
    if (!newLabel.trim()) {
      alert('Введите текст метки!');
      return;
    }

    const x = parseFloat(newX);
    const y = parseFloat(newY);

    if (isNaN(x) || isNaN(y) || x < 0 || x > 100 || y < 0 || y > 100) {
      alert('Координаты должны быть от 0 до 100!');
      return;
    }

    setLabels([...labels, {
      id: Date.now().toString(),
      text: newLabel.trim(),
      correctX: x,
      correctY: y
    }]);

    setNewLabel('');
    setNewX('50');
    setNewY('50');
  };

  const removeLabel = (id: string) => {
    setLabels(labels.filter(l => l.id !== id));
  };

  const handleSubmit = () => {
    if (!imageUrl.trim()) {
      alert('Введите URL изображения!');
      return;
    }

    if (labels.length < 3) {
      alert('Добавьте минимум 3 метки!');
      return;
    }

    localStorage.setItem('labelled_diagram_data', JSON.stringify({
      imageUrl: imageUrl.trim(),
      title: title.trim() || undefined,
      labels
    }));

    router.push('/create/labelled-diagram/play');
  };

  // Preview helpers
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setNewX(x.toFixed(1));
    setNewY(y.toFixed(1));
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">📍 Подписанная диаграмма</h1>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Basic Info */}
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">URL изображения *</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Название (необязательно)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Название диаграммы"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Image Preview */}
          {imageUrl && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Предпросмотр (кликните для выбора позиции)</h3>
              <div
                className="relative bg-gray-100 rounded-lg overflow-hidden cursor-crosshair"
                onClick={handleImageClick}
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  minHeight: '400px'
                }}
              >
                {/* Show existing labels */}
                {labels.map(label => (
                  <div
                    key={label.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${label.correctX}%`,
                      top: `${label.correctY}%`
                    }}
                  >
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <div className="absolute top-3 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-white text-xs rounded shadow whitespace-nowrap">
                      {label.text}
                    </div>
                  </div>
                ))}

                {/* Current position indicator */}
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    left: `${newX}%`,
                    top: `${newY}%`
                  }}
                >
                  <div className="w-4 h-4 border-2 border-red-500 rounded-full" />
                </div>
              </div>
            </div>
          )}

          {/* Labels List */}
          {labels.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Метки ({labels.length})</h3>
              <div className="space-y-2">
                {labels.map((label) => (
                  <div key={label.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{label.text}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        (X: {label.correctX.toFixed(1)}%, Y: {label.correctY.toFixed(1)}%)
                      </span>
                    </div>
                    <button
                      onClick={() => removeLabel(label.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Label Form */}
          <div className="space-y-4 p-6 bg-emerald-50 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Текст метки"
                className="px-3 py-2 border rounded-lg"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newX}
                  onChange={(e) => setNewX(e.target.value)}
                  placeholder="X %"
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-24 px-3 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  value={newY}
                  onChange={(e) => setNewY(e.target.value)}
                  placeholder="Y %"
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-24 px-3 py-2 border rounded-lg"
                />
                <button
                  onClick={addLabel}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Добавить метку
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              💡 Кликните на изображении, чтобы выбрать позицию для метки
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!imageUrl || labels.length < 3}
            className="mt-6 px-8 py-3 bg-emerald-600 text-white rounded-lg disabled:opacity-50 hover:bg-emerald-700"
          >
            Создать игру
          </button>
        </div>
      </div>
    </Layout>
  );
}