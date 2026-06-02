'use client';

import React, { useState, useEffect } from 'react';

// Таймер
interface TimerProps {
  initialTime: number; // в секундах
  onTimeUp?: () => void;
  running?: boolean;
}

export const Timer: React.FC<TimerProps> = ({ initialTime, onTimeUp, running = true }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (!running || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running, timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const getTimerColor = () => {
    if (timeLeft <= 10) return 'text-red-600';
    if (timeLeft <= 30) return 'text-yellow-600';
    return 'text-blue-600';
  };

  return (
    <div className={`text-2xl font-bold ${getTimerColor()}`}>
      {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  );
};

// Счетчик баллов
interface ScoreDisplayProps {
  score: number;
  maxScore?: number;
  animated?: boolean;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  maxScore,
  animated = true
}) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      return;
    }

    const diff = score - displayScore;
    const step = diff / 10;
    const timer = setInterval(() => {
      setDisplayScore((prev) => {
        const next = prev + step;
        if (Math.abs(next - score) < Math.abs(step)) {
          return score;
        }
        return next;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [score, animated, displayScore]);

  return (
    <div className="text-center">
      <div className="text-sm text-gray-600 mb-1">Баллы</div>
      <div className="text-3xl font-bold text-blue-600">
        {Math.round(displayScore)}
        {maxScore && <span className="text-xl text-gray-400">/{maxScore}</span>}
      </div>
    </div>
  );
};

// Прогресс бар
interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, label }) => {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-2 text-sm text-gray-600">
          <span>{label}</span>
          <span>{current}/{total}</span>
        </div>
      )}
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Уровень сложности
interface LevelDisplayProps {
  level: number;
  label?: string;
}

export const LevelDisplay: React.FC<LevelDisplayProps> = ({ level, label = 'Уровень' }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-bold">
        {level}
      </div>
    </div>
  );
};

// Счетчик попыток
interface AttemptsProps {
  current: number;
  max: number;
}

export const AttemptsDisplay: React.FC<AttemptsProps> = ({ current, max }) => {
  return (
    <div className="text-center">
      <div className="text-sm text-gray-600 mb-1">Попытки</div>
      <div className="flex gap-1 justify-center">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i < current ? 'bg-green-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Streak (серия правильных ответов)
interface StreakProps {
  count: number;
}

export const StreakDisplay: React.FC<StreakProps> = ({ count }) => {
  if (count < 2) return null;

  return (
    <div className="bg-orange-100 border-2 border-orange-400 rounded-lg px-4 py-2 flex items-center gap-2">
      <span className="text-2xl">🔥</span>
      <div>
        <div className="text-sm text-orange-800 font-semibold">Серия!</div>
        <div className="text-lg font-bold text-orange-600">{count} подряд</div>
      </div>
    </div>
  );
};
