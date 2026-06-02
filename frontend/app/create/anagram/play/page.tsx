'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';
import { Leaderboard } from '@/components/Leaderboard';

interface AnagramWord {
  id: number;
  word: string;
  hint?: string;
}

interface ActivityData {
  title: string;
  instructions: string;
  words: AnagramWord[];
  withHints: boolean;
}

export default function PlayAnagramPage() {
  const router = useRouter();
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [endTime, setEndTime] = useState<number | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Загружаем данные из localStorage
    const data = localStorage.getItem('anagram_activity');
    if (data) {
      const parsed = JSON.parse(data) as ActivityData;
      setActivityData(parsed);
      if (parsed.words.length > 0) {
        initializeWord(parsed.words[0].word);
      }
    } else {
      // Если данных нет, возвращаемся на страницу создания
      router.push('/create/anagram');
    }
  }, []);

  const initializeWord = (word: string) => {
    const letters = word.split('');
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    setShuffledLetters(shuffled);
    setUserAnswer([]);
    setIsCorrect(null);
  };

  const handleLetterClick = (letter: string, index: number) => {
    // Добавляем букву в ответ пользователя
    setUserAnswer([...userAnswer, letter]);
    // Удаляем букву из доступных
    setShuffledLetters(shuffledLetters.filter((_, i) => i !== index));
  };

  const handleAnswerLetterClick = (index: number) => {
    // Возвращаем букву обратно в доступные
    const letter = userAnswer[index];
    setShuffledLetters([...shuffledLetters, letter]);
    setUserAnswer(userAnswer.filter((_, i) => i !== index));
  };

  const checkAnswer = () => {
    if (!activityData) return;

    const currentWord = activityData.words[currentWordIndex];
    const answer = userAnswer.join('').toLowerCase();
    const correct = answer === currentWord.word.toLowerCase();

    setIsCorrect(correct);

    if (correct) {
      setScore(score + 10);

      // Переход к следующему слову через 1.5 секунды
      setTimeout(() => {
        if (currentWordIndex < activityData.words.length - 1) {
          const nextIndex = currentWordIndex + 1;
          setCurrentWordIndex(nextIndex);
          initializeWord(activityData.words[nextIndex].word);
        } else {
          // Все слова завершены
          const finalTime = Date.now();
          setEndTime(finalTime);
          setCompleted(true);
          setShowNameInput(true);
        }
      }, 1500);
    }
  };

  const resetWord = () => {
    if (activityData) {
      initializeWord(activityData.words[currentWordIndex].word);
    }
  };

  const handleRestart = () => {
    if (activityData) {
      setCurrentWordIndex(0);
      setScore(0);
      setCompleted(false);
      setShowNameInput(false);
      setSaved(false);
      setPlayerName('');
      initializeWord(activityData.words[0].word);
    }
  };

  const handleSaveScore = async () => {
    if (!playerName.trim() || !endTime || !activityData) {
      alert('Пожалуйста, введите ваше имя!');
      return;
    }

    const timeSeconds = Math.floor((endTime - startTime) / 1000);

    try {
      const response = await fetch('http://localhost:8000/api/leaderboard/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player_name: playerName.trim(),
          activity_type: 'anagram',
          activity_title: activityData.title,
          score: score,
          time_seconds: timeSeconds,
        }),
      });

      if (response.ok) {
        setSaved(true);
        setShowNameInput(false);
      } else {
        alert('Ошибка сохранения результата. Попробуйте ещё раз.');
      }
    } catch (error) {
      console.error('Error saving score:', error);
      // Сохраняем локально если нет подключения к серверу
      setSaved(true);
      setShowNameInput(false);
      alert('Результат сохранён локально!');
    }
  };

  if (!activityData) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const currentWord = activityData.words[currentWordIndex];
  const progress = ((currentWordIndex + 1) / activityData.words.length) * 100;

  if (completed) {
    const timeSeconds = endTime ? Math.floor((endTime - startTime) / 1000) : 0;
    const minutes = Math.floor(timeSeconds / 60);
    const seconds = timeSeconds % 60;

    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Поздравляем!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Вы завершили все анаграммы!
            </p>

            {/* Результаты */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="text-sm text-gray-600 mb-1">Ваш счёт</div>
                <div className="text-4xl font-bold text-blue-600">{score}</div>
                <div className="text-xs text-gray-600 mt-1">баллов</div>
              </div>
              <div className="bg-green-50 rounded-xl p-6">
                <div className="text-sm text-gray-600 mb-1">Время</div>
                <div className="text-4xl font-bold text-green-600">
                  {minutes}:{seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {timeSeconds} секунд
                </div>
              </div>
            </div>

            {/* Форма ввода имени */}
            {showNameInput && !saved && (
              <div className="mb-8 p-6 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📝 Сохраните свой результат в таблице лидеров!
                </h3>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Введите ваше имя"
                  maxLength={100}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveScore()}
                />
                <button
                  onClick={handleSaveScore}
                  disabled={!playerName.trim()}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Сохранить результат
                </button>
              </div>
            )}

            {/* Сообщение после сохранения */}
            {saved && (
              <div className="mb-8 p-6 bg-green-50 rounded-xl border-2 border-green-200">
                <div className="text-2xl mb-2">✅</div>
                <h3 className="text-lg font-semibold text-green-800">
                  Результат сохранён!
                </h3>
                <p className="text-green-700 mt-2">
                  {playerName}, ваш результат добавлен в таблицу лидеров
                </p>
              </div>
            )}

            {/* Кнопки действий */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRestart}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Играть снова
              </button>
              <button
                onClick={() => router.push('/create')}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Выбрать другой шаблон
              </button>
            </div>
          </div>

          {/* Таблица лидеров */}
          <div className="mt-8">
            <Leaderboard activityType="anagram" limit={10} />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
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
            onClick={() => router.push('/create/anagram')}
            className="hover:text-gray-900"
          >
            Ввести контент
          </button>
          <span>›</span>
          <span className="font-semibold text-gray-900">Играть</span>
        </div>

        {/* Заголовок */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {activityData.title}
          </h1>
          {activityData.instructions && (
            <p className="text-gray-600">{activityData.instructions}</p>
          )}
        </div>

        {/* Прогресс */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Слово {currentWordIndex + 1} из {activityData.words.length}
            </span>
            <span className="text-sm font-medium text-blue-600">
              Счёт: {score}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Игровое поле */}
        <div
          className="rounded-2xl shadow-lg p-8"
          style={{
            backgroundImage: 'url(/anagram_background.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Подсказка */}
          {activityData.withHints && currentWord.hint && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">💡 Подсказка:</div>
              <div className="text-gray-900">{currentWord.hint}</div>
            </div>
          )}

          {/* Область ответа */}
          <div className="mb-8">
            <div className="text-sm text-gray-900 font-semibold mb-3">Ваш ответ:</div>
            <div className="min-h-[80px] p-4 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-dashed border-gray-300 flex flex-wrap gap-2 items-center justify-center">
              {userAnswer.length === 0 ? (
                <span className="text-gray-400">Выберите буквы ниже</span>
              ) : (
                userAnswer.map((letter, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerLetterClick(index)}
                    className="w-14 h-14 bg-blue-600 text-white text-2xl font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                  >
                    {letter}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Доступные буквы */}
          <div className="mb-6">
            <div className="text-sm text-gray-900 font-semibold mb-3">Доступные буквы:</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {shuffledLetters.map((letter, index) => (
                <button
                  key={index}
                  onClick={() => handleLetterClick(letter, index)}
                  disabled={isCorrect !== null}
                  className="w-14 h-14 bg-white/90 backdrop-blur-sm border-2 border-gray-300 text-2xl font-bold rounded-lg hover:border-blue-500 hover:bg-blue-50/90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={resetWord}
              disabled={isCorrect !== null}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Сбросить
            </button>
            <button
              onClick={checkAnswer}
              disabled={userAnswer.length !== currentWord.word.length || isCorrect !== null}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Проверить
            </button>
          </div>

          {/* Результат проверки */}
          {isCorrect !== null && (
            <div
              className={`mt-6 p-4 rounded-lg text-center animate-bounce ${
                isCorrect
                  ? 'bg-green-100 border-2 border-green-500'
                  : 'bg-red-100 border-2 border-red-500'
              }`}
            >
              <div className={`text-xl font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? '✅ Правильно!' : '❌ Неправильно, попробуйте ещё раз'}
              </div>
              {isCorrect && (
                <div className="text-green-700 mt-1">+10 баллов</div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
