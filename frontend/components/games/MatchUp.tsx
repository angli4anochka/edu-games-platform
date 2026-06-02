'use client';

import React, { useState, useEffect } from 'react';
import { GameResult } from '@/lib/types';

interface MatchPair {
  id: string;
  left: string;
  right: string;
}

interface MatchUpProps {
  pairs?: MatchPair[];
  title?: string;
  onComplete?: (result: GameResult) => void;
}

const defaultPairs: MatchPair[] = [
  { id: '1', left: 'Cat', right: 'Meow' },
  { id: '2', left: 'Dog', right: 'Bark' },
  { id: '3', left: 'Cow', right: 'Moo' },
  { id: '4', left: 'Duck', right: 'Quack' },
  { id: '5', left: 'Sheep', right: 'Baa' },
];

export const MatchUp: React.FC<MatchUpProps> = ({
  pairs = defaultPairs,
  title = "Сопоставление",
  onComplete
}) => {
  const [leftItems, setLeftItems] = useState<{id: string, text: string}[]>([]);
  const [rightItems, setRightItems] = useState<{id: string, text: string}[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matches, setMatches] = useState<Set<string>>(new Set());
  const [attempts, setAttempts] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    // Shuffle items
    const left = pairs.map(p => ({ id: p.id, text: p.left }));
    const right = pairs.map(p => ({ id: p.id, text: p.right }));

    setLeftItems(left.sort(() => Math.random() - 0.5));
    setRightItems(right.sort(() => Math.random() - 0.5));
  }, [pairs]);

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      setAttempts(attempts + 1);

      if (selectedLeft === selectedRight) {
        setMatches(new Set([...matches, selectedLeft]));
        setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 500);

        if (matches.size + 1 === pairs.length) {
          finishGame();
        }
      } else {
        setMistakes(mistakes + 1);
        setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 1000);
      }
    }
  }, [selectedLeft, selectedRight]);

  const finishGame = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    if (onComplete) {
      onComplete({
        score: (pairs.length - mistakes) * 10,
        completed: true,
        timeSpent,
        accuracy: ((pairs.length - mistakes) / attempts) * 100,
        mistakes,
        customData: {
          totalPairs: pairs.length,
          attempts,
          gameType: 'match_up'
        }
      });
    }
  };

  const isMatched = (id: string) => matches.has(id);
  const isWrong = selectedLeft && selectedRight && selectedLeft !== selectedRight;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-600 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">🔗 {title}</h1>
          <div className="flex gap-4">
            <span className="text-white">Соединено: {matches.size}/{pairs.length}</span>
            <span className="text-white">Попытки: {attempts}</span>
            <span className="text-white">Ошибки: {mistakes}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-3">
            {leftItems.map((item) => (
              <button
                key={item.id}
                onClick={() => !isMatched(item.id) && setSelectedLeft(item.id)}
                disabled={isMatched(item.id)}
                className={`
                  w-full p-4 rounded-lg font-medium text-lg transition-all
                  ${isMatched(item.id) ? 'bg-green-400 text-white opacity-50' :
                    selectedLeft === item.id ?
                      (isWrong ? 'bg-red-400 text-white' : 'bg-yellow-400 text-black') :
                      'bg-white hover:bg-gray-100'}
                `}
              >
                {item.text}
              </button>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            {rightItems.map((item) => (
              <button
                key={item.id}
                onClick={() => !isMatched(item.id) && setSelectedRight(item.id)}
                disabled={isMatched(item.id)}
                className={`
                  w-full p-4 rounded-lg font-medium text-lg transition-all
                  ${isMatched(item.id) ? 'bg-green-400 text-white opacity-50' :
                    selectedRight === item.id ?
                      (isWrong ? 'bg-red-400 text-white' : 'bg-yellow-400 text-black') :
                      'bg-white hover:bg-gray-100'}
                `}
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>

        {matches.size === pairs.length && (
          <div className="mt-8 bg-white rounded-2xl p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">🎉 Отлично!</h2>
            <p>Все пары соединены!</p>
            <p>Ошибок: {mistakes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchUp;