'use client';

import React, { useState, useEffect } from 'react';
import { GameResult } from '@/lib/types';

export interface QuizQuestion {
  id?: number;
  question: string;
  answers: string[];
  correctAnswer: number; // Index of correct answer
  explanation?: string;
  image?: string;
}

interface QuizProps {
  questions?: QuizQuestion[];
  title?: string;
  timePerQuestion?: number; // Time limit per question in seconds
  onComplete?: (result: GameResult) => void;
}

const defaultQuestions: QuizQuestion[] = [
  {
    question: "What is the capital of France?",
    answers: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    explanation: "Paris is the capital and largest city of France."
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    explanation: "Mars is often called the Red Planet due to its reddish appearance."
  },
  {
    question: "What is 2 + 2?",
    answers: ["3", "4", "5", "6"],
    correctAnswer: 1,
    explanation: "2 + 2 equals 4."
  }
];

export const Quiz: React.FC<QuizProps> = ({
  questions = defaultQuestions,
  title = "Викторина",
  timePerQuestion = 30,
  onComplete
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [gameComplete, setGameComplete] = useState(false);
  const [startTime] = useState(Date.now());

  const currentQuestion = questions[currentQuestionIndex];

  // Timer
  useEffect(() => {
    if (showResult || gameComplete) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return timePerQuestion;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, showResult, gameComplete]);

  const handleTimeout = () => {
    setWrongAnswers(wrongAnswers + 1);
    setShowResult(true);
    setAnsweredQuestions([...answeredQuestions, false]);

    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const handleAnswerClick = (answerIndex: number) => {
    if (showResult) return;

    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const isCorrect = answerIndex === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore(score + 10);
      setCorrectAnswers(correctAnswers + 1);
      setAnsweredQuestions([...answeredQuestions, true]);
    } else {
      setWrongAnswers(wrongAnswers + 1);
      setAnsweredQuestions([...answeredQuestions, false]);
    }

    setTimeout(() => {
      nextQuestion();
    }, 2500);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 >= questions.length) {
      finishQuiz();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(timePerQuestion);
    }
  };

  const finishQuiz = () => {
    setGameComplete(true);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    if (onComplete) {
      onComplete({
        score: score,
        completed: true,
        timeSpent,
        accuracy: (correctAnswers / questions.length) * 100,
        mistakes: wrongAnswers,
        customData: {
          totalQuestions: questions.length,
          correctAnswers,
          wrongAnswers,
          gameType: 'quiz'
        }
      });
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setAnsweredQuestions([]);
    setTimeLeft(timePerQuestion);
    setGameComplete(false);
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + (showResult ? 1 : 0)) / questions.length) * 100;
  };

  const getTimePercentage = () => {
    return (timeLeft / timePerQuestion) * 100;
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">
            {correctAnswers > questions.length / 2 ? '🏆' : '📚'}
          </div>
          <h2 className="text-3xl font-bold mb-4">Викторина завершена!</h2>
          <div className="space-y-2 mb-6 text-lg">
            <p>Правильных ответов: {correctAnswers} из {questions.length}</p>
            <p>Набрано баллов: {score}</p>
            <p>Точность: {Math.round((correctAnswers / questions.length) * 100)}%</p>
          </div>

          {/* Results breakdown */}
          <div className="mb-6">
            <div className="flex justify-center gap-2 mb-2">
              {answeredQuestions.map((correct, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    correct ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              <span className="text-green-600">● Правильно</span> •
              <span className="text-red-600 ml-2">● Неправильно</span>
            </p>
          </div>

          <button
            onClick={restartQuiz}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
          >
            Начать заново
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">❓ {title}</h1>
              <p className="text-white/80">Выберите правильный ответ</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/30 px-4 py-2 rounded-lg">
                <span className="text-white font-bold">
                  Вопрос {currentQuestionIndex + 1} / {questions.length}
                </span>
              </div>
              <div className="bg-green-500/30 px-4 py-2 rounded-lg">
                <span className="text-white font-bold">Очки: {score}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="mb-6">
          <div className="bg-white/20 backdrop-blur rounded-full h-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft <= 5 ? 'bg-red-500' : 'bg-green-400'
              }`}
              style={{ width: `${getTimePercentage()}%` }}
            />
          </div>
          <p className="text-center text-white/80 text-sm mt-2">
            Времени осталось: {timeLeft} сек
          </p>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Question */}
          <div className="mb-8">
            {currentQuestion.image && (
              <div className="text-6xl text-center mb-4">{currentQuestion.image}</div>
            )}
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.answers.map((answer, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const showCorrect = showResult && isCorrect;
              const showWrong = showResult && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  disabled={showResult}
                  className={`
                    p-4 rounded-xl font-medium text-lg transition-all transform
                    ${!showResult ? 'hover:scale-105 hover:shadow-lg' : ''}
                    ${showCorrect ? 'bg-green-500 text-white scale-105 shadow-lg' : ''}
                    ${showWrong ? 'bg-red-500 text-white shake' : ''}
                    ${!showResult && !isSelected ? 'bg-gray-100 hover:bg-gray-200' : ''}
                    ${!showResult && isSelected ? 'bg-indigo-100 border-2 border-indigo-400' : ''}
                    ${showResult && !showCorrect && !showWrong ? 'bg-gray-100 opacity-50' : ''}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{answer}</span>
                    {showCorrect && <span className="ml-auto">✅</span>}
                    {showWrong && <span className="ml-auto">❌</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showResult && currentQuestion.explanation && (
            <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <p className="text-blue-800">
                <strong>Пояснение:</strong> {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="bg-white/20 backdrop-blur rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full transition-all duration-500"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          <p className="text-center text-white/60 text-sm mt-2">
            Прогресс: {Math.round(getProgressPercentage())}%
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }

        .shake {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
  );
};

export default Quiz;