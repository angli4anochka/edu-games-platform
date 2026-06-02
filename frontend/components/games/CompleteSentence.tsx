'use client';

import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { GameResult } from '@/lib/types';

interface Sentence {
  text: string;
  blanks: string[];
  options: string[];
}

interface CompleteSentenceProps {
  sentences?: Sentence[];
  title?: string;
  onComplete?: (result: GameResult) => void;
}

const DraggableWord = ({ id, word }: { id: string; word: string }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="px-3 py-2 bg-blue-500 text-white rounded-lg cursor-move hover:bg-blue-600 transition-colors"
    >
      {word}
    </div>
  );
};

const DroppableBlank = ({ id, word, isCorrect }: { id: string; word?: string; isCorrect?: boolean }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <span
      ref={setNodeRef}
      className={`
        inline-block min-w-[100px] mx-1 px-3 py-1 border-b-2 text-center
        ${word ? (isCorrect === true ? 'bg-green-100 border-green-400' :
                  isCorrect === false ? 'bg-red-100 border-red-400' :
                  'bg-blue-100 border-blue-400') :
                 isOver ? 'bg-yellow-100 border-yellow-400' : 'border-gray-400'}
      `}
    >
      {word || '______'}
    </span>
  );
};

const defaultSentences: Sentence[] = [
  {
    text: 'The cat is ___ on the ___.',
    blanks: ['sleeping', 'sofa'],
    options: ['sleeping', 'sofa', 'running', 'table', 'eating']
  },
  {
    text: 'I like to ___ books in the ___.',
    blanks: ['read', 'library'],
    options: ['read', 'library', 'write', 'park', 'play']
  }
];

export const CompleteSentence: React.FC<CompleteSentenceProps> = ({
  sentences = defaultSentences,
  title = "Дополни предложение",
  onComplete
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filledBlanks, setFilledBlanks] = useState<{ [key: string]: string }>({});
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [startTime] = useState(Date.now());

  const currentSentence = sentences[currentIndex];

  useEffect(() => {
    if (currentSentence) {
      setAvailableWords([...currentSentence.options].sort(() => Math.random() - 0.5));
      setFilledBlanks({});
      setShowResult(false);
    }
  }, [currentIndex]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && over.id.toString().startsWith('blank-')) {
      const blankId = over.id.toString();
      const word = active.id.toString().replace('word-', '');

      setFilledBlanks(prev => ({ ...prev, [blankId]: word }));
      setAvailableWords(prev => prev.filter(w => w !== word));
    }
  };

  const checkAnswer = () => {
    let correct = true;
    currentSentence.blanks.forEach((expectedWord, index) => {
      if (filledBlanks[`blank-${index}`] !== expectedWord) {
        correct = false;
        setMistakes(mistakes + 1);
      }
    });

    if (correct) {
      setScore(score + 10);
    }

    setShowResult(true);

    setTimeout(() => {
      if (currentIndex + 1 < sentences.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        finishGame();
      }
    }, 2000);
  };

  const finishGame = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    if (onComplete) {
      onComplete({
        score,
        completed: true,
        timeSpent,
        accuracy: (score / (sentences.length * 10)) * 100,
        mistakes,
        customData: {
          totalSentences: sentences.length,
          gameType: 'complete_sentence'
        }
      });
    }
  };

  const renderSentenceWithBlanks = () => {
    const parts = currentSentence.text.split('___');
    const result: React.ReactElement[] = [];

    parts.forEach((part, index) => {
      result.push(<span key={`text-${index}`}>{part}</span>);
      if (index < parts.length - 1) {
        const blankId = `blank-${index}`;
        const word = filledBlanks[blankId];
        const isCorrect = showResult ? word === currentSentence.blanks[index] : undefined;
        result.push(
          <DroppableBlank
            key={blankId}
            id={blankId}
            word={word}
            isCorrect={isCorrect}
          />
        );
      }
    });

    return result;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">📝 {title}</h1>
          <div className="flex gap-4">
            <span className="text-white">Предложение {currentIndex + 1}/{sentences.length}</span>
            <span className="text-white">Очки: {score}</span>
            <span className="text-white">Ошибки: {mistakes}</span>
          </div>
        </div>

        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
          <div className="bg-white rounded-2xl p-8 mb-6">
            <div className="text-2xl leading-relaxed mb-6">
              {renderSentenceWithBlanks()}
            </div>

            {showResult && (
              <div className={`p-4 rounded-lg ${
                Object.keys(filledBlanks).every((key, i) => filledBlanks[key] === currentSentence.blanks[i])
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {Object.keys(filledBlanks).every((key, i) => filledBlanks[key] === currentSentence.blanks[i])
                  ? '✅ Правильно!'
                  : '❌ Неправильно. Правильный ответ: ' + currentSentence.blanks.join(', ')}
              </div>
            )}
          </div>

          <div className="bg-white/90 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Доступные слова:</h3>
            <div className="flex flex-wrap gap-3">
              {availableWords.map((word) => (
                <DraggableWord key={word} id={`word-${word}`} word={word} />
              ))}
            </div>

            {!showResult && Object.keys(filledBlanks).length === currentSentence.blanks.length && (
              <button
                onClick={checkAnswer}
                className="mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all"
              >
                Проверить
              </button>
            )}
          </div>
        </DndContext>
      </div>
    </div>
  );
};

export default CompleteSentence;