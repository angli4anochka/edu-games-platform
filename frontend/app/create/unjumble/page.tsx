'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';

interface Sentence {
  text: string;
  correctOrder: string[];
  hint?: string;
}

export default function CreateUnjumblePage() {
  const router = useRouter();
  const [sentences, setSentences] = useState<Sentence[]>([
    {
      text: 'The cat is sleeping',
      correctOrder: ['The', 'cat', 'is', 'sleeping'],
      hint: 'Кошка спит'
    }
  ]);

  const [newSentence, setNewSentence] = useState('');
  const [newHint, setNewHint] = useState('');

  const addSentence = () => {
    if (!newSentence.trim()) {
      alert('Введите предложение!');
      return;
    }

    const words = newSentence.trim().split(/\s+/);
    if (words.length < 3) {
      alert('Предложение должно содержать минимум 3 слова!');
      return;
    }

    if (words.length > 10) {
      alert('Предложение не должно содержать больше 10 слов!');
      return;
    }

    setSentences([...sentences, {
      text: newSentence.trim(),
      correctOrder: words,
      hint: newHint.trim() || undefined
    }]);

    setNewSentence('');
    setNewHint('');
  };

  const removeSentence = (index: number) => {
    setSentences(sentences.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (sentences.length === 0) {
      alert('Добавьте хотя бы одно предложение!');
      return;
    }

    localStorage.setItem('unjumble_sentences', JSON.stringify(sentences));
    router.push('/create/unjumble/play');
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
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-2xl">
            🔀
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Составь предложение</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Instructions */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Как играть
            </h2>
            <ul className="space-y-2 text-gray-600">
              <li>• Слова в предложении будут перемешаны</li>
              <li>• Игроки должны перетащить слова в правильном порядке</li>
              <li>• Можно добавить подсказку (перевод или описание)</li>
              <li>• Отлично подходит для изучения структуры предложений</li>
            </ul>
          </div>

          {/* Sentences List */}
          {sentences.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">
                Добавленные предложения ({sentences.length})
              </h3>
              <div className="space-y-2">
                {sentences.map((sentence, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{sentence.text}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Слов: {sentence.correctOrder.length}
                        </p>
                        {sentence.hint && (
                          <p className="text-sm text-blue-600 mt-1">
                            💡 {sentence.hint}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeSentence(index)}
                        className="text-red-600 hover:text-red-800 text-xl font-bold ml-4"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Sentence Form */}
          <div className="space-y-4 p-6 bg-purple-50 rounded-xl">
            <h3 className="text-lg font-semibold">Добавить предложение</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Предложение на английском
              </label>
              <input
                type="text"
                value={newSentence}
                onChange={(e) => setNewSentence(e.target.value)}
                placeholder="The cat is sleeping on the sofa"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                От 3 до 10 слов. Используйте простые предложения.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Подсказка (необязательно)
              </label>
              <input
                type="text"
                value={newHint}
                onChange={(e) => setNewHint(e.target.value)}
                placeholder="Кошка спит на диване"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Перевод или описание предложения
              </p>
            </div>

            <button
              onClick={addSentence}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              Добавить предложение
            </button>
          </div>

          {/* Examples */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Примеры предложений:</h4>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• I like to read books (Я люблю читать книги)</li>
              <li>• She plays piano very well (Она очень хорошо играет на пианино)</li>
              <li>• They are going to school (Они идут в школу)</li>
              <li>• The weather is nice today (Сегодня хорошая погода)</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-between items-center pt-6 mt-6 border-t">
            <div className="text-sm text-gray-600">
              {sentences.length === 0
                ? 'Добавьте хотя бы одно предложение'
                : `Добавлено предложений: ${sentences.length}`}
            </div>
            <button
              onClick={handleSubmit}
              disabled={sentences.length === 0}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Начать игру 🔀
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}