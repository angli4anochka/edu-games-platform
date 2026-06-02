'use client';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import WordSnakeMulti from '@/components/games/WordSnakeMulti';
import WordSnakeSimple from '@/components/games/WordSnakeSimple';
import { useRouter } from 'next/navigation';
import { GameResult } from '@/lib/types';

export default function PlayWordSnakePage() {
  const router = useRouter();
  const [activityData, setActivityData] = useState<{ words: string[] } | null>(null);

  useEffect(() => {
    // Загружаем данные активности из localStorage
    const savedData = localStorage.getItem('word_snake_activity');
    console.log('PlayPage - loaded from localStorage:', savedData);

    if (savedData) {
      const parsed = JSON.parse(savedData);
      console.log('PlayPage - parsed data:', parsed);

      // Поддержка старого формата с одним словом
      if (parsed.word && !parsed.words) {
        const data = { words: [parsed.word] };
        console.log('PlayPage - using old format, converted to:', data);
        setActivityData(data);
      } else if (parsed.words && Array.isArray(parsed.words)) {
        const data = { words: parsed.words };
        console.log('PlayPage - using new format:', data);
        setActivityData(data);
      } else {
        console.log('PlayPage - invalid data, using default');
        setActivityData({ words: ['APPLE'] });
      }
    } else {
      // Если нет данных, используем слово по умолчанию
      console.log('PlayPage - no saved data, using default');
      setActivityData({ words: ['APPLE'] });
    }
  }, []);

  const handleGameComplete = (result: GameResult) => {
    // Сохраняем результат игры
    console.log('Game completed:', result);

    const wordsCompleted = result.customData?.wordsCompleted || 0;
    const totalWords = activityData?.words.length || 1;

    // Показываем результат
    const message = result.completed
      ? `Отлично! Вы собрали все ${totalWords} слов! Счёт: ${result.score}`
      : `Игра окончена. Собрано слов: ${wordsCompleted}/${totalWords}. Счёт: ${result.score}`;

    alert(message);

    // Можно перенаправить на страницу результатов или создания новой игры
    // router.push('/create/word-snake');
  };

  const handleRestart = () => {
    router.push('/create/word-snake');
  };

  if (!activityData) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-2xl mb-4">Загрузка...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6">
        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button
            onClick={() => router.push('/create')}
            className="hover:text-gray-900"
          >
            Выберите шаблон
          </button>
          <span>›</span>
          <button
            onClick={() => router.push('/create/word-snake')}
            className="hover:text-gray-900"
          >
            Ввести контент
          </button>
          <span>›</span>
          <span className="font-semibold text-gray-900">Играть</span>
        </div>

        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-2xl">
              🐍
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Word Snake</h1>
              <p className="text-gray-600">
                {activityData.words.length === 1
                  ? `Соберите слово: ${activityData.words[0]}`
                  : `Соберите ${activityData.words.length} слов`}
              </p>
            </div>
          </div>
          <button
            onClick={handleRestart}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Изменить слова
          </button>
        </div>

        {/* Игра */}
        {(() => {
          console.log('PlayPage - passing to WordSnakeMulti:', activityData.words);
          return null;
        })()}

        {/* Временно используем простую версию для отладки */}
        <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded">
          <p className="text-sm font-bold mb-2">🔧 Debug Mode - Simple Version</p>
          <WordSnakeSimple targetWords={activityData.words} />
        </div>

        {/* Оригинальная версия
        <WordSnakeMulti
          targetWords={activityData.words}
          speed="medium"
          onComplete={handleGameComplete}
        />
        */}
      </div>
    </Layout>
  );
}