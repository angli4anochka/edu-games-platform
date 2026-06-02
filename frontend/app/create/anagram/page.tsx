'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';
import { canCreateActivity, incrementActivitiesCount, getSubscriptionStatus } from '@/lib/subscription';

interface AnagramWord {
  id: number;
  word: string;
  hint?: string;
}

export default function CreateAnagramPage() {
  const router = useRouter();
  const [title, setTitle] = useState('Безымянный32');
  const [instructions, setInstructions] = useState('Перетащите буквы в их правильные позиции, чтобы расшифровать слово или фразу.');
  const [withHints, setWithHints] = useState(false);
  const [words, setWords] = useState<AnagramWord[]>([
    { id: 1, word: '' }
  ]);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const addWord = () => {
    if (words.length < 100) {
      setWords([...words, { id: Date.now(), word: '' }]);
    }
  };

  const removeWord = (id: number) => {
    if (words.length > 1) {
      setWords(words.filter(w => w.id !== id));
    }
  };

  const updateWord = (id: number, field: 'word' | 'hint', value: string) => {
    setWords(words.map(w => w.id === id ? { ...w, [field]: value } : w));
  };

  const handleSubmit = () => {
    // Проверка лимита подписки
    if (!canCreateActivity()) {
      setShowLimitModal(true);
      return;
    }

    // Фильтруем пустые слова
    const validWords = words.filter(w => w.word.trim() !== '');

    if (validWords.length === 0) {
      alert('Добавьте хотя бы одно слово!');
      return;
    }

    // Увеличиваем счетчик созданных активностей
    incrementActivitiesCount();

    // Сохраняем данные и переходим к игре
    const activityData = {
      title,
      instructions,
      words: validWords,
      withHints
    };

    // TODO: Сохранить в localStorage или отправить на сервер
    localStorage.setItem('anagram_activity', JSON.stringify(activityData));

    // Переход к игре
    router.push('/create/anagram/play');
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: 'url(/anagram_background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <Layout>
      <div className="max-w-4xl mx-auto pb-24 pt-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-700 mb-6 px-2">
          <button
            onClick={() => router.push('/create')}
            className="hover:text-blue-600 transition-colors font-medium"
          >
            Шаблоны
          </button>
          <span>›</span>
          <span className="text-gray-900 font-semibold">Создание задания</span>
        </div>

        {/* Floating Form Container */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-900/10 border border-white/20 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border-b border-gray-100/50 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 ring-4 ring-white/50">
                  <img
                    src="/images/anagram-icon.webp"
                    alt="Анаграмма"
                    className="w-9 h-9 object-contain brightness-0 invert"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Анаграмма</h1>
                  <p className="text-sm text-gray-600 mt-0.5">Перетащите буквы в правильные позиции</p>
                </div>
              </div>

              <button className="flex items-center gap-2 px-5 py-2.5 bg-white/80 hover:bg-white text-gray-700 rounded-xl transition-all border border-gray-200/50 shadow-sm hover:shadow">
                <span>✨</span>
                <span className="text-sm font-medium">AI генератор</span>
              </button>
            </div>
          </div>

          {/* Main Form */}
          <div className="overflow-hidden">
          {/* Section: Основная информация */}
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Основная информация</h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Заголовок занятия
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Например: Словарный запас - уровень 1"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Инструкция
                  </label>
                  <span className="text-xs text-gray-400">Необязательно</span>
                </div>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  placeholder="Добавьте инструкцию для учеников..."
                />
              </div>
            </div>
          </div>

          {/* Section: Настройки */}
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Настройки</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Режим подсказок
              </label>
              <div className="inline-flex rounded-xl bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => setWithHints(false)}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    !withHints
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Без подсказок
                </button>
                <button
                  type="button"
                  onClick={() => setWithHints(true)}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    withHints
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  С подсказками
                </button>
              </div>
            </div>
          </div>

          {/* Section: Слова */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Список слов</h2>
                <p className="text-sm text-gray-500 mt-1">От 1 до 100 слов</p>
              </div>
            </div>

            <div className="space-y-3">
              {words.map((word, index) => (
                <div key={word.id} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-sm font-medium text-gray-600">
                    {index + 1}
                  </div>

                  <div className="flex-1 flex gap-3">
                    <input
                      type="text"
                      value={word.word}
                      onChange={(e) => updateWord(word.id, 'word', e.target.value)}
                      placeholder="Введите слово"
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />

                    {withHints && (
                      <input
                        type="text"
                        value={word.hint || ''}
                        onChange={(e) => updateWord(word.id, 'hint', e.target.value)}
                        placeholder="Подсказка (необязательно)"
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    )}
                  </div>

                  <button
                    onClick={() => removeWord(word.id)}
                    disabled={words.length === 1}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    title="Удалить слово"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Кнопка добавить слово */}
            <button
              onClick={addWord}
              disabled={words.length >= 100}
              className="mt-4 flex items-center gap-2 px-4 py-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Добавить слово</span>
            </button>
          </div>
          </div>

          {/* Action Bar inside floating container */}
          <div className="bg-gray-50/50 border-t border-gray-100 px-8 py-5">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push('/create')}
                className="px-6 py-2.5 text-gray-700 hover:bg-white/80 rounded-xl transition-all font-medium border border-gray-200"
              >
                Отмена
              </button>
              <button
                onClick={handleSubmit}
                className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40"
              >
                Создать задание
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Limit Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Достигнут лимит бесплатного плана
              </h2>

              <p className="text-gray-600 mb-6">
                Вы создали максимальное количество бесплатных активностей (5 шаблонов).
                Оформите подписку Премиум для безлимитного создания!
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => router.push('/subscription')}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                >
                  Посмотреть тарифы
                </button>

                <button
                  onClick={() => setShowLimitModal(false)}
                  className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      </Layout>
    </div>
  );
}
