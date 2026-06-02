'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Timer, ScoreDisplay, ProgressBar } from '../ui/GameUI';
import { GameResult } from '@/lib/types';

export interface Pair {
  id: number;
  left: string;
  right: string;
}

interface MatchPairsProps {
  pairs: Pair[];
  timeLimit?: number;
  showImages?: boolean;
  onComplete: (result: GameResult) => void;
}

export const MatchPairs: React.FC<MatchPairsProps> = ({
  pairs,
  timeLimit = 180,
  onComplete,
}) => {
  const [leftItems, setLeftItems] = useState<{ id: number; value: string; matched: boolean }[]>([]);
  const [rightItems, setRightItems] = useState<{ id: number; value: string; matched: boolean }[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [startTime] = useState(Date.now());

  // Инициализация и перемешивание элементов
  useEffect(() => {
    const left = pairs.map((p) => ({ id: p.id, value: p.left, matched: false }));
    const right = pairs.map((p) => ({ id: p.id, value: p.right, matched: false }));

    // Перемешиваем правую колонку
    const shuffledRight = [...right].sort(() => Math.random() - 0.5);

    setLeftItems(left);
    setRightItems(shuffledRight);
  }, [pairs]);

  useEffect(() => {
    if (selectedLeft !== null && selectedRight !== null) {
      setAttempts(attempts + 1);

      // Проверяем совпадение
      if (selectedLeft === selectedRight) {
        // Правильно!
        setScore(score + 10);
        setMatchedPairs(matchedPairs + 1);

        // Помечаем как совпавшие
        setLeftItems(leftItems.map((item) =>
          item.id === selectedLeft ? { ...item, matched: true } : item
        ));
        setRightItems(rightItems.map((item) =>
          item.id === selectedRight ? { ...item, matched: true } : item
        ));

        // Проверяем завершение
        if (matchedPairs + 1 === pairs.length) {
          const timeSpent = Math.floor((Date.now() - startTime) / 1000);
          setTimeout(() => {
            onComplete({
              score,
              completed: true,
              timeSpent: timeSpent,
              details: {
                totalPairs: pairs.length,
                attempts: attempts + 1,
                accuracy: ((matchedPairs + 1) / (attempts + 1)) * 100,
              },
            });
          }, 500);
        }
      }

      // Сбрасываем выбор
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 1000);
    }
  }, [selectedLeft, selectedRight]);

  const handleLeftClick = (id: number, matched: boolean) => {
    if (matched || selectedLeft !== null) return;
    setSelectedLeft(id);
  };

  const handleRightClick = (id: number, matched: boolean) => {
    if (matched || selectedRight !== null) return;
    setSelectedRight(id);
  };

  const handleTimeUp = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    onComplete({
      score,
      completed: matchedPairs === pairs.length,
      timeSpent: timeSpent,
      details: {
        totalPairs: pairs.length,
        matchedPairs,
        attempts,
        accuracy: attempts > 0 ? (matchedPairs / attempts) * 100 : 0,
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <ScoreDisplay score={score} />
          <div className="text-center">
            <div className="text-sm text-gray-600">Попытки</div>
            <div className="text-2xl font-bold text-gray-900">{attempts}</div>
          </div>
          <Timer initialTime={timeLimit} onTimeUp={handleTimeUp} />
        </div>
        <ProgressBar
          current={matchedPairs}
          total={pairs.length}
          label="Пары найдены"
        />
      </div>

      {/* Grid с парами */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Левая колонка */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-center mb-4 text-gray-700">
            Колонка А
          </h3>
          {leftItems.map((item) => (
            <Card
              key={item.id}
              onClick={() => handleLeftClick(item.id, item.matched)}
              className={`p-4 cursor-pointer transition-all ${
                item.matched
                  ? 'bg-green-100 border-green-500 opacity-50'
                  : selectedLeft === item.id
                  ? 'bg-blue-100 border-blue-500 scale-105'
                  : 'hover:bg-blue-50'
              }`}
            >
              <div className="text-center font-medium">{item.value}</div>
            </Card>
          ))}
        </div>

        {/* Правая колонка */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-center mb-4 text-gray-700">
            Колонка Б
          </h3>
          {rightItems.map((item) => (
            <Card
              key={item.id}
              onClick={() => handleRightClick(item.id, item.matched)}
              className={`p-4 cursor-pointer transition-all ${
                item.matched
                  ? 'bg-green-100 border-green-500 opacity-50'
                  : selectedRight === item.id
                  ? 'bg-blue-100 border-blue-500 scale-105'
                  : 'hover:bg-blue-50'
              }`}
            >
              <div className="text-center font-medium">{item.value}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Подсказка */}
      <div className="mt-6 text-center text-gray-600">
        Выберите элемент из колонки А и соответствующий ему элемент из колонки Б
      </div>
    </div>
  );
};
