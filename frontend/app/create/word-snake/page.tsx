'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';

export default function CreateWordSnakePage() {
  const router = useRouter();
  const [words, setWords] = useState<string[]>(['APPLE']);
  const [currentInput, setCurrentInput] = useState('');
  const maxWords = 5;

  const handleAddWord = () => {
    const cleanedWord = currentInput.toUpperCase().replace(/[^A-ZА-ЯЁ]/g, '').slice(0, 10);

    if (!cleanedWord) {
      alert('Введите слово (только буквы)!');
      return;
    }

    if (words.includes(cleanedWord)) {
      alert('Это слово уже добавлено!');
      return;
    }

    if (words.length >= maxWords) {
      alert(`Максимум ${maxWords} слов!`);
      return;
    }

    setWords([...words, cleanedWord]);
    setCurrentInput('');
  };

  const handleRemoveWord = (index: number) => {
    setWords(words.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (words.length === 0) {
      alert('Добавьте хотя бы одно слово!');
      return;
    }

    const activityData = {
      words: words
    };

    localStorage.setItem('word_snake_activity', JSON.stringify(activityData));
    router.push('/create/word-snake/play');
  };

  const handleWordChange = (value: string) => {
    const cleaned = value.toUpperCase().replace(/[^A-ZА-ЯЁ]/g, '').slice(0, 10);
    setCurrentInput(cleaned);
  };

  const detectAlphabet = (word: string): 'russian' | 'english' | 'mixed' => {
    const hasRussian = /[А-ЯЁ]/i.test(word);
    const hasEnglish = /[A-Z]/i.test(word);

    if (hasRussian && hasEnglish) return 'mixed';
    if (hasRussian) return 'russian';
    return 'english';
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8">
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

        {/* Заголовок */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-2xl">
            🐍
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Word Snake - Мультислова</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Как играть
            </h2>
            <ul className="space-y-2 text-gray-600">
              <li>• Змейка должна собрать буквы каждого слова по порядку</li>
              <li>• После завершения одного слова, начинается следующее</li>
              <li>• Используйте стрелки на клавиатуре для управления</li>
              <li>• Жёлтые буквы - правильные, белые - ловушки</li>
              <li>• Игра автоматически определяет язык (русский/английский)</li>
              <li>• Можно добавить до {maxWords} слов</li>
            </ul>
          </div>

          {/* Список добавленных слов */}
          {words.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Добавленные слова ({words.length}/{maxWords})
              </label>
              <div className="space-y-2">
                {words.map((word, index) => {
                  const alphabet = detectAlphabet(word);
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-green-700">
                          {index + 1}. {word}
                        </span>
                        <span className="text-xs px-2 py-1 bg-white rounded-full text-gray-600">
                          {alphabet === 'russian' ? 'РУС' : alphabet === 'english' ? 'ENG' : 'СМЕШАН'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveWord(index)}
                        className="text-red-600 hover:text-red-800 font-bold text-xl"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ввод нового слова */}
          {words.length < maxWords && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Добавить слово
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentInput}
                  onChange={(e) => handleWordChange(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && currentInput) {
                      handleAddWord();
                    }
                  }}
                  placeholder={words.length === 0 ? "APPLE" : "Введите слово"}
                  maxLength={10}
                  className="flex-1 px-4 py-3 text-xl font-bold border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent uppercase"
                />
                <button
                  onClick={handleAddWord}
                  disabled={!currentInput}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Добавить
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Только буквы (русские или английские), максимум 10 символов
              </p>
            </div>
          )}

          {/* Предпросмотр */}
          {words.length > 0 && (
            <div className="mb-6 p-6 bg-green-50 rounded-xl">
              <div className="text-sm text-gray-600 mb-3 text-center">
                Змейка будет собирать по порядку:
              </div>
              {words.map((word, wordIdx) => (
                <div key={wordIdx} className="mb-3">
                  <div className="text-xs text-gray-500 mb-1">Слово {wordIdx + 1}:</div>
                  <div className="flex justify-center gap-1">
                    {word.split('').map((letter, index) => (
                      <div
                        key={index}
                        className="w-10 h-10 bg-green-600 text-white rounded-lg flex items-center justify-center text-lg font-bold shadow-md"
                      >
                        {letter}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Кнопка запуска */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="text-sm text-gray-600">
              {words.length === 0
                ? 'Добавьте хотя бы одно слово'
                : `Добавлено слов: ${words.length}/${maxWords}`}
            </div>
            <button
              onClick={handleSubmit}
              disabled={words.length === 0}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Начать игру 🐍
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}