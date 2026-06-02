'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';

interface Card {
  id: string;
  front: string;
  back: string;
  image?: string;
}

export default function CreateFlashCardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newImage, setNewImage] = useState('');

  const addCard = () => {
    if (!newFront.trim() || !newBack.trim()) {
      alert('Заполните обе стороны карточки!');
      return;
    }

    setCards([...cards, {
      id: Date.now().toString(),
      front: newFront.trim(),
      back: newBack.trim(),
      image: newImage || undefined
    }]);

    setNewFront('');
    setNewBack('');
    setNewImage('');
  };

  const removeCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
  };

  const handleSubmit = () => {
    if (cards.length < 2) {
      alert('Добавьте минимум 2 карточки!');
      return;
    }

    localStorage.setItem('flash_cards_data', JSON.stringify(cards));
    router.push('/create/flash-cards/play');
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
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center text-2xl">
            📇
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Карточки</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {cards.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Добавленные карточки ({cards.length})</h3>
              <div className="space-y-2">
                {cards.map((card) => (
                  <div key={card.id} className="p-3 bg-gray-50 rounded-lg flex justify-between">
                    <div>
                      {card.image && <span className="text-2xl mr-2">{card.image}</span>}
                      <span className="font-medium">{card.front}</span>
                      <span className="mx-2">→</span>
                      <span className="text-gray-600">{card.back}</span>
                    </div>
                    <button onClick={() => removeCard(card.id)} className="text-red-600 hover:text-red-800">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 p-6 bg-indigo-50 rounded-xl">
            <h3 className="text-lg font-semibold">Добавить карточку</h3>
            <input
              type="text"
              value={newFront}
              onChange={(e) => setNewFront(e.target.value)}
              placeholder="Лицевая сторона (например: Hello)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              value={newBack}
              onChange={(e) => setNewBack(e.target.value)}
              placeholder="Обратная сторона (например: Привет)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              placeholder="Эмодзи (необязательно)"
              maxLength={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={addCard}
              className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg"
            >
              Добавить карточку
            </button>
          </div>

          <div className="flex justify-between items-center pt-6 mt-6 border-t">
            <span className="text-sm text-gray-600">
              {cards.length < 2 ? 'Добавьте минимум 2 карточки' : `Карточек: ${cards.length}`}
            </span>
            <button
              onClick={handleSubmit}
              disabled={cards.length < 2}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-lg disabled:opacity-50"
            >
              Начать 📇
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}