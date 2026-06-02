'use client';

import React, { useState, useEffect } from 'react';
import { GameResult } from '@/lib/types';

interface Pair {
  id: string;
  content: string;
  image?: string;
}

interface MatchingPairsProps {
  pairs?: Pair[];
  gridSize?: 'small' | 'medium' | 'large';
  onComplete?: (result: GameResult) => void;
}

interface Card {
  id: string;
  pairId: string;
  content: string;
  image?: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const defaultPairs: Pair[] = [
  { id: '1', content: 'Cat', image: '🐱' },
  { id: '2', content: 'Dog', image: '🐕' },
  { id: '3', content: 'Apple', image: '🍎' },
  { id: '4', content: 'Banana', image: '🍌' },
  { id: '5', content: 'Car', image: '🚗' },
  { id: '6', content: 'House', image: '🏠' },
  { id: '7', content: 'Tree', image: '🌳' },
  { id: '8', content: 'Sun', image: '☀️' },
];

export const MatchingPairs: React.FC<MatchingPairsProps> = ({
  pairs = defaultPairs,
  gridSize = 'medium',
  onComplete
}) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [startTime] = useState(Date.now());

  // Initialize cards
  useEffect(() => {
    const gameCards: Card[] = [];
    pairs.forEach((pair) => {
      // Add two cards for each pair
      gameCards.push({
        id: `${pair.id}-1`,
        pairId: pair.id,
        content: pair.content,
        image: pair.image,
        isFlipped: false,
        isMatched: false
      });
      gameCards.push({
        id: `${pair.id}-2`,
        pairId: pair.id,
        content: pair.content,
        image: pair.image,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle cards
    const shuffled = [...gameCards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, [pairs]);

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsChecking(true);
      setMoves(moves + 1);

      const [first, second] = flippedCards;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(card =>
            card.id === first || card.id === second
              ? { ...card, isMatched: true }
              : card
          ));
          setMatches(matches + 1);
          setFlippedCards([]);
          setIsChecking(false);

          // Check if game is complete
          if (matches + 1 === pairs.length) {
            finishGame();
          }
        }, 600);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(card =>
            card.id === first || card.id === second
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  }, [flippedCards]);

  const handleCardClick = (cardId: string) => {
    if (isChecking) return;

    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    if (flippedCards.length < 2) {
      setCards(prev => prev.map(c =>
        c.id === cardId ? { ...c, isFlipped: true } : c
      ));
      setFlippedCards([...flippedCards, cardId]);
    }
  };

  const finishGame = () => {
    setGameComplete(true);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    if (onComplete) {
      const score = Math.max(100 - (moves - pairs.length) * 5, 10);
      onComplete({
        score: score * 10,
        completed: true,
        timeSpent,
        accuracy: (pairs.length / moves) * 100,
        mistakes: moves - pairs.length,
        customData: {
          totalPairs: pairs.length,
          totalMoves: moves,
          gameType: 'matching_pairs'
        }
      });
    }
  };

  const restartGame = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled.map(card => ({ ...card, isFlipped: false, isMatched: false })));
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameComplete(false);
    setIsChecking(false);
  };

  const gridClass = {
    small: 'grid-cols-3 sm:grid-cols-4',
    medium: 'grid-cols-4 sm:grid-cols-4 lg:grid-cols-6',
    large: 'grid-cols-4 sm:grid-cols-5 lg:grid-cols-8'
  }[gridSize];

  const cardSize = {
    small: 'h-24 text-3xl',
    medium: 'h-28 text-4xl',
    large: 'h-32 text-5xl'
  }[gridSize];

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold mb-4">Отлично! 🎉</h2>
          <div className="space-y-2 mb-6">
            <p className="text-lg">Все пары найдены!</p>
            <p className="text-lg">Ходов: {moves}</p>
            <p className="text-lg">Минимум ходов: {pairs.length}</p>
            <p className="text-lg">Эффективность: {Math.round((pairs.length / moves) * 100)}%</p>
          </div>
          <button
            onClick={restartGame}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
          >
            Играть снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">🎴 Найди пары</h1>
              <p className="text-white/80">Найдите все совпадающие пары карт</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/30 px-4 py-2 rounded-lg">
                <span className="text-white font-bold">Ходов: {moves}</span>
              </div>
              <div className="bg-green-500/30 px-4 py-2 rounded-lg">
                <span className="text-white font-bold">Пары: {matches}/{pairs.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Game Grid */}
        <div className={`grid ${gridClass} gap-3`}>
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`
                relative ${cardSize} cursor-pointer transform transition-all duration-500
                ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}
                ${card.isMatched ? 'scale-95 opacity-80' : 'hover:scale-105'}
              `}
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              {/* Card Back */}
              <div
                className={`
                  absolute inset-0 rounded-xl flex items-center justify-center
                  bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg
                  ${card.isFlipped || card.isMatched ? 'opacity-0' : 'opacity-100'}
                  transition-opacity duration-300
                `}
                style={{ backfaceVisibility: 'hidden' }}
              >
                <span className="text-white text-5xl">?</span>
              </div>

              {/* Card Front */}
              <div
                className={`
                  absolute inset-0 rounded-xl flex flex-col items-center justify-center
                  bg-white shadow-lg
                  ${card.isFlipped || card.isMatched ? 'opacity-100' : 'opacity-0'}
                  ${card.isMatched ? 'bg-green-100 border-2 border-green-400' : ''}
                  transition-all duration-300
                `}
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                {card.image && (
                  <div className="text-5xl mb-2">{card.image}</div>
                )}
                <div className="text-sm font-medium text-gray-700">{card.content}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={restartGame}
            className="px-6 py-3 bg-white/20 backdrop-blur text-white font-medium rounded-lg hover:bg-white/30 transition-colors"
          >
            ↻ Начать заново
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes flip {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(180deg); }
        }

        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default MatchingPairs;