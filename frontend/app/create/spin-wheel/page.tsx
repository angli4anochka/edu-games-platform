'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';

interface WheelItem {
  id: number;
  text: string;
}

export default function CreateSpinWheelPage() {
  const router = useRouter();
  const [title, setTitle] = useState('Безымянный32');
  const [instructions, setInstructions] = useState('Вращайте колесо, чтобы выбрать случайный элемент.');
  const [items, setItems] = useState<WheelItem[]>([
    { id: 1, text: '' }
  ]);

  const addItem = () => {
    if (items.length < 20) {
      setItems([...items, { id: Date.now(), text: '' }]);
    }
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(w => w.id !== id));
    }
  };

  const updateItem = (id: number, value: string) => {
    setItems(items.map(w => w.id === id ? { ...w, text: value } : w));
  };

  const handleSubmit = () => {
    const validItems = items.filter(w => w.text.trim() !== '');

    if (validItems.length < 2) {
      alert('Добавьте хотя бы 2 элемента!');
      return;
    }

    const activityData = {
      title,
      instructions,
      items: validItems
    };

    localStorage.setItem('spin_wheel_activity', JSON.stringify(activityData));
    router.push('/create/spin-wheel/play');
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8">
        {/* Хлебные крошки */}
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

        {/* Заголовок с иконкой */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl">
              🎡
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Колесо фортуны</h1>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <span>✨</span>
            <span className="text-sm">Генерируйте с помощью искусственного интеллекта</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Заголовок занятия */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заголовок занятия
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Инструкция */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Инструкция
              </label>
              <span className="text-xs text-gray-500">Необязательно</span>
            </div>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Список элементов */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                Элементы на колесе
              </label>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3">
                  <span className="text-gray-500 w-6 text-right">{index + 1}.</span>

                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => updateItem(item.id, e.target.value)}
                    placeholder="Введите текст"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                    className="text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Удалить"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Кнопка добавить элемент */}
            <button
              onClick={addItem}
              disabled={items.length >= 20}
              className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-xl">+</span>
              <span className="font-medium">Добавить элемент</span>
            </button>
            <p className="text-xs text-gray-500 mt-1 ml-7">
              мин. 2 &nbsp; макс. 20
            </p>
          </div>

          {/* Кнопка завершения */}
          <div className="flex justify-end pt-6 border-t">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Выполнено
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
