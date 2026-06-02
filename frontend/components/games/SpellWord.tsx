'use client';

import { useState, useEffect, useRef } from 'react';

interface Word {
  word: string;
  audio?: string;
  hint?: string;
  category?: string;
}

interface SpellWordProps {
  words: Word[];
}

export default function SpellWord({ words }: SpellWordProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showWord, setShowWord] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [playCount, setPlayCount] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const currentWord = words[currentIndex];

  // Play word audio
  const playAudio = () => {
    if (audioRef.current) {
      // If there's a custom audio URL, use it
      if (currentWord.audio) {
        audioRef.current.src = currentWord.audio;
        audioRef.current.play();
      } else {
        // Use speech synthesis as fallback
        const utterance = new SpeechSynthesisUtterance(currentWord.word);
        utterance.lang = /[а-яА-ЯёЁ]/.test(currentWord.word) ? 'ru-RU' : 'en-US';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
      }
    } else {
      // Use speech synthesis if no audio element
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.lang = /[а-яА-ЯёЁ]/.test(currentWord.word) ? 'ru-RU' : 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
    setPlayCount(playCount + 1);
  };

  // Auto-play on new word
  useEffect(() => {
    if (!isComplete) {
      setTimeout(() => {
        playAudio();
      }, 500);
    }
    return () => {
      speechSynthesis.cancel();
    };
  }, [currentIndex]);

  const checkSpelling = () => {
    const isCorrect = userInput.trim().toLowerCase() === currentWord.word.toLowerCase();

    if (isCorrect) {
      setFeedback('correct');
      setScore(score + 1);
      setTimeout(() => {
        nextWord();
      }, 1500);
    } else {
      setFeedback('incorrect');
      setAttempts(attempts + 1);

      // Show word after 3 attempts
      if (attempts >= 2) {
        setShowWord(true);
      }

      setTimeout(() => {
        setFeedback(null);
      }, 2000);
    }
  };

  const nextWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserInput('');
      setFeedback(null);
      setShowWord(false);
      setAttempts(0);
      setPlayCount(0);
    } else {
      setIsComplete(true);
    }
  };

  const skipWord = () => {
    setShowWord(true);
    setTimeout(() => {
      nextWord();
    }, 2000);
  };

  const restart = () => {
    setCurrentIndex(0);
    setUserInput('');
    setFeedback(null);
    setScore(0);
    setAttempts(0);
    setShowWord(false);
    setIsComplete(false);
    setPlayCount(0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userInput.trim() && !feedback) {
      checkSpelling();
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold mb-4">Отлично!</h2>
          <p className="text-xl mb-6">
            Ваш счет: <span className="font-bold text-blue-600">{score}/{words.length}</span>
          </p>
          <button
            onClick={restart}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Играть снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-cyan-600 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-white mb-2">
            <span>Слово {currentIndex + 1} из {words.length}</span>
            <span>Счет: {score}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className="bg-white h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Audio Player Section */}
          <div className="text-center mb-8">
            <button
              onClick={playAudio}
              className="group relative inline-flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
              </div>
            </button>
            <p className="text-sm text-gray-600 mt-3">
              Нажмите, чтобы прослушать слово{playCount > 0 && ` (${playCount})`}
            </p>
          </div>

          {/* Hints Section */}
          {currentWord.category && (
            <p className="text-center text-sm text-gray-600 mb-2">
              Категория: {currentWord.category}
            </p>
          )}

          {currentWord.hint && attempts >= 1 && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                💡 Подсказка: {currentWord.hint}
              </p>
            </div>
          )}

          {/* Show Word (after 3 attempts or skip) */}
          {showWord && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <p className="text-lg font-bold text-blue-800">
                Правильное написание: {currentWord.word}
              </p>
            </div>
          )}

          {/* Input Field */}
          <div className="mb-6">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Введите слово..."
              disabled={feedback !== null || showWord}
              className={`w-full px-4 py-3 border-2 rounded-lg text-lg text-center font-medium transition-colors ${
                feedback === 'correct'
                  ? 'border-green-500 bg-green-50'
                  : feedback === 'incorrect'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 focus:border-blue-500 focus:outline-none'
              }`}
            />
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`mb-6 p-4 rounded-lg ${
              feedback === 'correct'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {feedback === 'correct' ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">✅</span>
                  <span className="font-semibold">Правильно!</span>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-2xl">❌</span>
                    <span className="font-semibold">Неправильно!</span>
                  </div>
                  {attempts < 3 && (
                    <p className="text-sm text-center">Попробуйте еще раз</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={playAudio}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              🔊 Повторить
            </button>
            <button
              onClick={checkSpelling}
              disabled={!userInput.trim() || feedback !== null || showWord}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Проверить
            </button>
            <button
              onClick={skipWord}
              disabled={showWord}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Пропустить
            </button>
          </div>

          {/* Attempts indicator */}
          {attempts > 0 && !showWord && (
            <p className="text-center text-sm text-gray-500 mt-4">
              Попытка {attempts + 1} из 3
            </p>
          )}
        </div>
      </div>

      {/* Hidden audio element for custom audio files */}
      <audio ref={audioRef} />
    </div>
  );
}