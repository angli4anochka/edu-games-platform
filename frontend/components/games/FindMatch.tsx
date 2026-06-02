'use client';

import React, { useState, useEffect } from 'react';
import { GameResult } from '@/lib/types';

interface Question {
  question: string;
  answers: string[];
  correctAnswers: number[]; // indices of correct answers
}

interface FindMatchProps {
  questions?: Question[];
  title?: string;
  onComplete?: (result: GameResult) => void;
}

const defaultQuestions: Question[] = [
  {
    question: 'Which are fruits?',
    answers: ['Apple', 'Car', 'Banana', 'Dog', 'Orange', 'House'],
    correctAnswers: [0, 2, 4]
  },
  {
    question: 'Which are animals?',
    answers: ['Table', 'Cat', 'Tree', 'Dog', 'Elephant', 'Book'],
    correctAnswers: [1, 3, 4]
  }
];

export const FindMatch: React.FC<FindMatchProps> = ({
  questions = defaultQuestions,
  title = "Найди соответствие",
  onComplete
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Set<number>>(new Set());
  const [removedAnswers, setRemovedAnswers] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime] = useState(Date.now());

  const currentQuestion = questions[currentIndex];

  const handleAnswerClick = (index: number) => {
    if (removedAnswers.has(index)) return;

    if (currentQuestion.correctAnswers.includes(index)) {
      // Correct answer
      setRemovedAnswers(new Set([...removedAnswers, index]));
      setScore(score + 10);

      // Check if all correct answers found
      if (removedAnswers.size + 1 === currentQuestion.correctAnswers.length) {
        setTimeout(() => nextQuestion(), 1000);
      }
    } else {
      // Wrong answer
      setMistakes(mistakes + 1);
      setSelectedAnswers(new Set([...selectedAnswers, index]));
      setTimeout(() => {
        setSelectedAnswers(prev => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
      }, 1000);
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswers(new Set());
      setRemovedAnswers(new Set());
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    if (onComplete) {
      onComplete({
        score,
        completed: true,
        timeSpent,
        accuracy: (score / (questions.reduce((acc, q) => acc + q.correctAnswers.length, 0) * 10)) * 100,
        mistakes,
        customData: {
          totalQuestions: questions.length,
          gameType: 'find_match'
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 to-blue-600 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">🎯 {title}</h1>
          <div className="flex gap-4">
            <span className="text-white">Вопрос {currentIndex + 1}/{questions.length}</span>
            <span className="text-white">Очки: {score}</span>
            <span className="text-white">Ошибки: {mistakes}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">{currentQuestion.question}</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {currentQuestion.answers.map((answer, index) => {
              const isRemoved = removedAnswers.has(index);
              const isWrong = selectedAnswers.has(index);
              const isCorrect = currentQuestion.correctAnswers.includes(index);

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  disabled={isRemoved}
                  className={`
                    p-6 rounded-lg font-medium text-lg transition-all transform
                    ${isRemoved ? 'opacity-0 scale-0' :
                      isWrong ? 'bg-red-500 text-white shake animate-shake' :
                      'bg-gray-100 hover:bg-gray-200 hover:scale-105'}
                  `}
                >
                  {answer}
                </button>
              );
            })}
          </div>

          <div className="mt-6 text-center text-gray-600">
            Найдено: {removedAnswers.size}/{currentQuestion.correctAnswers.length}
          </div>
        </div>

        <style jsx>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }

          .animate-shake {
            animation: shake 0.5s;
          }
        `}</style>
      </div>
    </div>
  );
};

export default FindMatch;