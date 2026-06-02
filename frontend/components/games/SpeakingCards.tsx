'use client';

import React, { useState, useEffect } from 'react';
import { GameResult } from '@/lib/types';

interface Card {
  id: string;
  content: string;
  category?: string;
  image?: string;
}

interface SpeakingCardsProps {
  cards?: Card[];
  title?: string;
  onComplete?: (result: GameResult) => void;
}

const defaultCards: Card[] = [
  { id: '1', content: 'Tell about your favorite food', category: 'Food', image: '🍕' },
  { id: '2', content: 'Describe your best friend', category: 'People', image: '👥' },
  { id: '3', content: 'What did you do yesterday?', category: 'Time', image: '📅' },
  { id: '4', content: 'Describe your dream house', category: 'Home', image: '🏠' },
  { id: '5', content: 'Talk about your hobby', category: 'Activities', image: '🎨' },
  { id: '6', content: 'What makes you happy?', category: 'Emotions', image: '😊' },
];

export const SpeakingCards: React.FC<SpeakingCardsProps> = ({
  cards = defaultCards,
  title = "Разговорные карточки",
  onComplete
}) => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [usedCards, setUsedCards] = useState<Set<string>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    setDeck([...cards].sort(() => Math.random() - 0.5));
  }, [cards]);

  const drawCard = () => {
    if (deck.length === 0) {
      // Reshuffle
      setDeck([...cards].sort(() => Math.random() - 0.5));
      setUsedCards(new Set());
      return;
    }

    setIsAnimating(true);
    setTimeout(() => {
      const newCard = deck[0];
      setCurrentCard(newCard);
      setDeck(deck.slice(1));
      setUsedCards(new Set([...usedCards, newCard.id]));
      setIsAnimating(false);
    }, 300);
  };

  const skipCard = () => {
    drawCard();
  };

  const finishSession = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    if (onComplete) {
      onComplete({
        score: usedCards.size * 10,
        completed: true,
        timeSpent,
        accuracy: 100,
        mistakes: 0,
        customData: {
          cardsUsed: usedCards.size,
          totalCards: cards.length,
          gameType: 'speaking_cards'
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">🗣️ {title}</h1>
          <div className="flex gap-4">
            <span className="text-white">Карт в колоде: {deck.length}</span>
            <span className="text-white">Использовано: {usedCards.size}/{cards.length}</span>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          {currentCard ? (
            <div
              className={`
                bg-white rounded-2xl shadow-2xl p-8 w-96 h-64
                flex flex-col items-center justify-center transition-all
                ${isAnimating ? 'scale-0 rotate-180' : 'scale-100 rotate-0'}
              `}
            >
              {currentCard.image && (
                <div className="text-6xl mb-4">{currentCard.image}</div>
              )}
              <p className="text-2xl font-bold text-center mb-2">
                {currentCard.content}
              </p>
              {currentCard.category && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {currentCard.category}
                </span>
              )}
            </div>
          ) : (
            <div className="bg-gray-200 rounded-2xl p-8 w-96 h-64 flex items-center justify-center">
              <p className="text-gray-500 text-xl">Нажмите чтобы вытянуть карту</p>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={drawCard}
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all transform hover:scale-105"
          >
            🎴 Вытянуть карту
          </button>

          {currentCard && (
            <>
              <button
                onClick={skipCard}
                className="px-8 py-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-all"
              >
                ⏭️ Следующая
              </button>
              <button
                onClick={finishSession}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
              >
                ✅ Завершить
              </button>
            </>
          )}
        </div>

        {/* Deck visualization */}
        <div className="mt-8 flex justify-center gap-1">
          {[...Array(Math.min(deck.length, 10))].map((_, i) => (
            <div
              key={i}
              className="w-8 h-12 bg-white/30 rounded border-2 border-white/50"
              style={{ marginLeft: i > 0 ? '-20px' : '0', zIndex: 10 - i }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpeakingCards;