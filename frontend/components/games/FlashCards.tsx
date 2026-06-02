'use client';

import React, { useState, useEffect } from 'react';
import { GameResult } from '@/lib/types';

interface Card {
  id: string;
  front: string;
  back: string;
  image?: string;
  learned?: boolean;
}

interface FlashCardsProps {
  cards?: Card[];
  title?: string;
  shuffleCards?: boolean;
  onComplete?: (result: GameResult) => void;
}

const defaultCards: Card[] = [
  { id: '1', front: 'Hello', back: 'Привет', image: '👋' },
  { id: '2', front: 'Cat', back: 'Кошка', image: '🐱' },
  { id: '3', front: 'Apple', back: 'Яблоко', image: '🍎' },
  { id: '4', front: 'Book', back: 'Книга', image: '📚' },
  { id: '5', front: 'Sun', back: 'Солнце', image: '☀️' },
];

export const FlashCards: React.FC<FlashCardsProps> = ({
  cards = defaultCards,
  title = "Карточки",
  shuffleCards = true,
  onComplete
}) => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learnedCards, setLearnedCards] = useState<Set<string>>(new Set());
  const [knewCount, setKnewCount] = useState(0);
  const [didntKnowCount, setDidntKnowCount] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [startTime] = useState(Date.now());
  const [sessionComplete, setSessionComplete] = useState(false);

  // Initialize deck
  useEffect(() => {
    const initialDeck = shuffleCards
      ? [...cards].sort(() => Math.random() - 0.5)
      : [...cards];
    setDeck(initialDeck);
  }, [cards, shuffleCards]);

  const currentCard = deck[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKnew = () => {
    setKnewCount(knewCount + 1);
    setLearnedCards(new Set([...learnedCards, currentCard.id]));
    nextCard();
  };

  const handleDidntKnow = () => {
    setDidntKnowCount(didntKnowCount + 1);
    nextCard();
  };

  const nextCard = () => {
    if (currentIndex + 1 >= deck.length) {
      // End of deck
      finishSession();
    } else {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const previousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const finishSession = () => {
    setShowResults(true);
    setSessionComplete(true);

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const accuracy = (knewCount / deck.length) * 100;

    if (onComplete) {
      onComplete({
        score: knewCount * 10,
        completed: true,
        timeSpent,
        accuracy,
        mistakes: didntKnowCount,
        customData: {
          totalCards: deck.length,
          knewCards: knewCount,
          didntKnowCards: didntKnowCount,
          gameType: 'flash_cards'
        }
      });
    }
  };

  const restartSession = () => {
    const newDeck = shuffleCards
      ? [...cards].sort(() => Math.random() - 0.5)
      : [...cards];
    setDeck(newDeck);
    setCurrentIndex(0);
    setIsFlipped(false);
    setLearnedCards(new Set());
    setKnewCount(0);
    setDidntKnowCount(0);
    setShowResults(false);
    setSessionComplete(false);
  };

  const shuffleDeck = () => {
    const remainingCards = deck.slice(currentIndex);
    const shuffled = [...remainingCards].sort(() => Math.random() - 0.5);
    const newDeck = [...deck.slice(0, currentIndex), ...shuffled];
    setDeck(newDeck);
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-blue-600 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">
            {knewCount > didntKnowCount ? '🎉' : '📚'}
          </div>
          <h2 className="text-3xl font-bold mb-4">Сессия завершена!</h2>

          <div className="space-y-4 mb-6">
            <div className="bg-green-100 p-4 rounded-lg">
              <p className="text-2xl font-bold text-green-700">{knewCount}</p>
              <p className="text-green-600">Знал(а)</p>
            </div>

            <div className="bg-orange-100 p-4 rounded-lg">
              <p className="text-2xl font-bold text-orange-700">{didntKnowCount}</p>
              <p className="text-orange-600">Нужно повторить</p>
            </div>

            <div className="text-gray-600">
              <p>Процент знания: {Math.round((knewCount / deck.length) * 100)}%</p>
            </div>
          </div>

          <button
            onClick={restartSession}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
          >
            Начать заново
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-blue-600 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">📇 {title}</h1>
              <p className="text-white/80">Нажмите на карточку, чтобы перевернуть</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/30 px-4 py-2 rounded-lg">
                <span className="text-white font-bold">
                  Карточка {currentIndex + 1} / {deck.length}
                </span>
              </div>
              <div className="bg-green-500/30 px-4 py-2 rounded-lg">
                <span className="text-white font-bold">Знаю: {knewCount}</span>
              </div>
              <div className="bg-orange-500/30 px-4 py-2 rounded-lg">
                <span className="text-white font-bold">Учу: {didntKnowCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Container */}
        <div className="flex justify-center mb-8">
          <div className="relative w-96 h-64 perspective-1000">
            <div
              onClick={handleFlip}
              className={`
                absolute inset-0 w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer
                ${isFlipped ? 'rotate-y-180' : ''}
              `}
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Front of card */}
              <div
                className="absolute inset-0 w-full h-full backface-hidden rounded-2xl shadow-2xl"
                style={{
                  backfaceVisibility: 'hidden',
                }}
              >
                <div className="h-full bg-white rounded-2xl p-8 flex flex-col items-center justify-center">
                  {currentCard?.image && (
                    <div className="text-6xl mb-4">{currentCard.image}</div>
                  )}
                  <h2 className="text-3xl font-bold text-gray-800 text-center">
                    {currentCard?.front}
                  </h2>
                  <p className="text-sm text-gray-500 mt-4">
                    Нажмите для перевода
                  </p>
                </div>
              </div>

              {/* Back of card */}
              <div
                className="absolute inset-0 w-full h-full backface-hidden rounded-2xl shadow-2xl rotate-y-180"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <div className="h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 flex flex-col items-center justify-center text-white">
                  <h2 className="text-3xl font-bold text-center">
                    {currentCard?.back}
                  </h2>
                  <p className="text-sm mt-4 opacity-80">
                    Перевод
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Navigation */}
          <div className="flex justify-center gap-4">
            <button
              onClick={previousCard}
              disabled={currentIndex === 0}
              className="px-6 py-3 bg-white/20 backdrop-blur text-white font-medium rounded-lg hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              ← Предыдущая
            </button>

            <button
              onClick={shuffleDeck}
              className="px-6 py-3 bg-white/20 backdrop-blur text-white font-medium rounded-lg hover:bg-white/30 transition-all"
            >
              🔀 Перемешать
            </button>

            <button
              onClick={() => setCurrentIndex(Math.min(currentIndex + 1, deck.length - 1))}
              disabled={currentIndex === deck.length - 1}
              className="px-6 py-3 bg-white/20 backdrop-blur text-white font-medium rounded-lg hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Следующая →
            </button>
          </div>

          {/* Knowledge buttons */}
          {isFlipped && (
            <div className="flex justify-center gap-4 animate-fade-in">
              <button
                onClick={handleDidntKnow}
                className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-105"
              >
                ❌ Не знаю
              </button>
              <button
                onClick={handleKnew}
                className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-105"
              >
                ✅ Знаю
              </button>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-8">
          <div className="bg-white/20 backdrop-blur rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-400 h-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
            />
          </div>
          <p className="text-center text-white/60 text-sm mt-2">
            Прогресс: {Math.round(((currentIndex + 1) / deck.length) * 100)}%
          </p>
        </div>

        {/* Learned indicators */}
        <div className="mt-6 flex justify-center gap-2">
          {deck.map((card, index) => (
            <div
              key={card.id}
              className={`
                w-3 h-3 rounded-full transition-all
                ${index === currentIndex ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent' : ''}
                ${learnedCards.has(card.id) ? 'bg-green-400' :
                  index <= currentIndex ? 'bg-orange-400' : 'bg-white/30'}
              `}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }

        .transform-style-3d {
          transform-style: preserve-3d;
        }

        .backface-hidden {
          backface-visibility: hidden;
        }

        .rotate-y-180 {
          transform: rotateY(180deg);
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FlashCards;