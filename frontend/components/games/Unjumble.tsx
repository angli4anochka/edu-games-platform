'use client';

import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GameResult } from '@/lib/types';

interface Sentence {
  text: string;
  correctOrder: string[];
  hint?: string;
}

interface UnjumbleProps {
  sentences?: Sentence[];
  onComplete?: (result: GameResult) => void;
}

// Sortable Word Component
function SortableWord({ id, word }: { id: string; word: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        px-4 py-3 bg-white rounded-lg shadow-md cursor-move select-none
        hover:shadow-lg transition-shadow border-2 border-gray-200
        ${isDragging ? 'z-50 shadow-xl border-blue-400' : ''}
      `}
    >
      <span className="text-lg font-medium text-gray-800">{word}</span>
    </div>
  );
}

const defaultSentences: Sentence[] = [
  {
    text: 'The cat is sleeping on the sofa',
    correctOrder: ['The', 'cat', 'is', 'sleeping', 'on', 'the', 'sofa'],
    hint: 'Кошка спит на диване'
  },
  {
    text: 'I like to read books every day',
    correctOrder: ['I', 'like', 'to', 'read', 'books', 'every', 'day'],
    hint: 'Я люблю читать книги каждый день'
  },
  {
    text: 'She plays piano very well',
    correctOrder: ['She', 'plays', 'piano', 'very', 'well'],
    hint: 'Она очень хорошо играет на пианино'
  }
];

export const Unjumble: React.FC<UnjumbleProps> = ({
  sentences = defaultSentences,
  onComplete
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [startTime] = useState(Date.now());

  const currentSentence = sentences[currentIndex];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Shuffle words when sentence changes
  useEffect(() => {
    if (currentSentence) {
      const shuffled = [...currentSentence.correctOrder].sort(() => Math.random() - 0.5);
      setWords(shuffled);
      setIsCorrect(false);
      setShowHint(false);
      setAttempts(0);
    }
  }, [currentIndex]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = words.indexOf(active.id as string);
      const newIndex = words.indexOf(over.id as string);

      const newWords = arrayMove(words, oldIndex, newIndex);
      setWords(newWords);
      setAttempts(attempts + 1);

      // Check if correct
      const isCorrectOrder = newWords.join(' ') === currentSentence.correctOrder.join(' ');
      if (isCorrectOrder) {
        setIsCorrect(true);
        setCorrectCount(correctCount + 1);

        // Move to next after delay
        setTimeout(() => {
          if (currentIndex + 1 < sentences.length) {
            setCurrentIndex(currentIndex + 1);
          } else {
            finishGame();
          }
        }, 1500);
      }
    }
  };

  const handleReset = () => {
    const shuffled = [...currentSentence.correctOrder].sort(() => Math.random() - 0.5);
    setWords(shuffled);
    setIsCorrect(false);
    setMistakes(mistakes + 1);
  };

  const handleSkip = () => {
    setMistakes(mistakes + 1);
    if (currentIndex + 1 < sentences.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    setGameComplete(true);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    if (onComplete) {
      onComplete({
        score: correctCount * 10,
        completed: true,
        timeSpent,
        accuracy: (correctCount / sentences.length) * 100,
        mistakes,
        customData: {
          totalSentences: sentences.length,
          correctSentences: correctCount,
          totalAttempts: attempts
        }
      });
    }
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setCorrectCount(0);
    setMistakes(0);
    setAttempts(0);
    setGameComplete(false);
    setIsCorrect(false);
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold mb-4">Игра завершена! 🎉</h2>
          <div className="space-y-2 mb-6">
            <p className="text-lg">Правильно: {correctCount} из {sentences.length}</p>
            <p className="text-lg">Точность: {Math.round((correctCount / sentences.length) * 100)}%</p>
            <p className="text-lg">Попыток: {attempts}</p>
          </div>
          <button
            onClick={restartGame}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
          >
            Играть снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">🔀 Составь предложение</h1>
              <p className="text-white/80">Перетащите слова в правильном порядке</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/30 px-4 py-2 rounded-lg">
                <span className="text-white font-bold">{currentIndex + 1} / {sentences.length}</span>
              </div>
              <div className="bg-green-500/30 px-4 py-2 rounded-lg">
                <span className="text-white font-bold">✓ {correctCount}</span>
              </div>
              <div className="bg-red-500/30 px-4 py-2 rounded-lg">
                <span className="text-white font-bold">✗ {mistakes}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hint Section */}
        {currentSentence.hint && (
          <div className="bg-white/90 backdrop-blur rounded-xl p-4 mb-6">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 text-purple-600 font-medium hover:text-purple-700"
            >
              <span>💡</span>
              {showHint ? 'Скрыть подсказку' : 'Показать подсказку'}
            </button>
            {showHint && (
              <p className="mt-2 text-gray-700 italic">{currentSentence.hint}</p>
            )}
          </div>
        )}

        {/* Words Area */}
        <div className="bg-white/90 backdrop-blur rounded-2xl p-8 mb-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Расставьте слова в правильном порядке:
            </h3>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={words}
                strategy={horizontalListSortingStrategy}
              >
                <div className="flex flex-wrap gap-3 justify-center p-6 bg-gray-50 rounded-lg min-h-[100px]">
                  {words.map((word) => (
                    <SortableWord key={word} id={word} word={word} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* Result Display */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Ваше предложение:</p>
            <p className={`text-xl font-medium ${isCorrect ? 'text-green-600' : 'text-gray-800'}`}>
              {words.join(' ')}
            </p>
          </div>

          {/* Feedback */}
          {isCorrect && (
            <div className="mt-4 p-4 bg-green-100 border-2 border-green-400 rounded-lg">
              <p className="text-green-800 font-bold text-center">
                ✅ Отлично! Предложение составлено правильно!
              </p>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
            >
              ↻ Перемешать
            </button>
            <button
              onClick={handleSkip}
              className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors"
            >
              Пропустить →
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/20 backdrop-blur rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-400 to-blue-400 h-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / sentences.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Unjumble;