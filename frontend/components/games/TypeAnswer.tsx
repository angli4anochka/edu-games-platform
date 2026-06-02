'use client';

import { useState, useEffect } from 'react';

interface Question {
  question: string;
  answer: string;
  hint?: string;
  caseSensitive?: boolean;
}

interface TypeAnswerProps {
  questions: Question[];
}

export default function TypeAnswer({ questions }: TypeAnswerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const currentQuestion = questions[currentIndex];

  const checkAnswer = () => {
    const userAnswerTrimmed = userAnswer.trim();
    const correctAnswer = currentQuestion.answer.trim();

    const isCorrect = currentQuestion.caseSensitive
      ? userAnswerTrimmed === correctAnswer
      : userAnswerTrimmed.toLowerCase() === correctAnswer.toLowerCase();

    if (isCorrect) {
      setFeedback('correct');
      setScore(score + 1);
      setTimeout(() => {
        nextQuestion();
      }, 1500);
    } else {
      setFeedback('incorrect');
      setAttempts(attempts + 1);
      setTimeout(() => {
        setFeedback(null);
      }, 1500);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      setFeedback(null);
      setShowHint(false);
      setAttempts(0);
    } else {
      setIsComplete(true);
    }
  };

  const skipQuestion = () => {
    nextQuestion();
  };

  const restart = () => {
    setCurrentIndex(0);
    setUserAnswer('');
    setFeedback(null);
    setScore(0);
    setShowHint(false);
    setIsComplete(false);
    setAttempts(0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer.trim() && !feedback) {
      checkAnswer();
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold mb-4">Игра завершена!</h2>
          <p className="text-xl mb-6">
            Ваш счет: <span className="font-bold text-indigo-600">{score}/{questions.length}</span>
          </p>
          <button
            onClick={restart}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Играть снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-white mb-2">
            <span>Вопрос {currentIndex + 1} из {questions.length}</span>
            <span>Счет: {score}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className="bg-white h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {currentQuestion.question}
          </h2>

          {/* Hint Section */}
          {currentQuestion.hint && (
            <div className="mb-6">
              {!showHint ? (
                <button
                  onClick={() => setShowHint(true)}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                  disabled={attempts < 2}
                >
                  💡 {attempts < 2 ? `Подсказка доступна после ${2 - attempts} попыток` : 'Показать подсказку'}
                </button>
              ) : (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                  💡 {currentQuestion.hint}
                </div>
              )}
            </div>
          )}

          {/* Answer Input */}
          <div className="mb-6">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Введите ваш ответ..."
              disabled={feedback !== null}
              className={`w-full px-4 py-3 border-2 rounded-lg text-lg transition-colors ${
                feedback === 'correct'
                  ? 'border-green-500 bg-green-50'
                  : feedback === 'incorrect'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 focus:border-indigo-500 focus:outline-none'
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
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✅</span>
                  <span className="font-semibold">Правильно!</span>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">❌</span>
                    <span className="font-semibold">Неправильно!</span>
                  </div>
                  <p className="text-sm">Попробуйте еще раз</p>
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={checkAnswer}
              disabled={!userAnswer.trim() || feedback !== null}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Проверить
            </button>
            <button
              onClick={skipQuestion}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Пропустить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}