'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';

export default function CreateSpeakingCardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<any[]>([]);
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const addCard = () => {
    if (!newContent.trim()) {
      alert('Введите текст карточки!');
      return;
    }

    setCards([...cards, {
      id: Date.now().toString(),
      content: newContent.trim(),
      category: newCategory.trim() || undefined
    }]);

    setNewContent('');
    setNewCategory('');
  };

  const handleSubmit = () => {
    if (cards.length < 3) {
      alert('Добавьте минимум 3 карточки!');
      return;
    }

    localStorage.setItem('speaking_cards_data', JSON.stringify(cards));
    router.push('/create/speaking-cards/play');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">🗣️ Разговорные карточки</h1>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {cards.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Карточки ({cards.length})</h3>
              {cards.map((card) => (
                <div key={card.id} className="p-3 bg-gray-50 rounded-lg mb-2">
                  {card.content} {card.category && `(${card.category})`}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4 p-6 bg-purple-50 rounded-xl">
            <input
              type="text"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Текст карточки"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Категория (необязательно)"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <button onClick={addCard} className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg">
              Добавить карточку
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={cards.length < 3}
            className="mt-6 px-8 py-3 bg-purple-600 text-white rounded-lg disabled:opacity-50"
          >
            Начать игру
          </button>
        </div>
      </div>
    </Layout>
  );
}