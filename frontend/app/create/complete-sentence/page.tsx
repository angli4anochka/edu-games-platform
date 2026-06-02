'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';

export default function CreateCompleteSentencePage() {
  const router = useRouter();
  const [sentences, setSentences] = useState<any[]>([]);
  const [newText, setNewText] = useState('');
  const [newBlanks, setNewBlanks] = useState('');

  const addSentence = () => {
    if (!newText.includes('___')) {
      alert('Используйте ___ для обозначения пропусков!');
      return;
    }

    const blanks = newBlanks.split(',').map(b => b.trim()).filter(b => b);
    if (blanks.length === 0) {
      alert('Введите слова для пропусков!');
      return;
    }

    setSentences([...sentences, {
      text: newText,
      blanks,
      options: [...blanks, ...blanks.map(() => 'extra')].sort(() => Math.random() - 0.5)
    }]);

    setNewText('');
    setNewBlanks('');
  };

  const handleSubmit = () => {
    if (sentences.length < 1) {
      alert('Добавьте хотя бы одно предложение!');
      return;
    }

    localStorage.setItem('complete_sentence_data', JSON.stringify(sentences));
    router.push('/create/complete-sentence/play');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">📝 Дополни предложение</h1>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {sentences.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Предложения ({sentences.length})</h3>
              {sentences.map((s, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg mb-2">
                  {s.text}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4 p-6 bg-blue-50 rounded-xl">
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Предложение с ___ для пропусков"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              value={newBlanks}
              onChange={(e) => setNewBlanks(e.target.value)}
              placeholder="Слова через запятую"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <button onClick={addSentence} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg">
              Добавить предложение
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={sentences.length < 1}
            className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            Начать игру
          </button>
        </div>
      </div>
    </Layout>
  );
}