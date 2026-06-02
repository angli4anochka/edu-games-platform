'use client';

import { useState, useEffect } from 'react';

interface HangmanWord {
  word: string;
  hint?: string;
  category?: string;
}

interface HangmanProps {
  words: HangmanWord[];
}

export default function Hangman({ words }: HangmanProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const maxWrongGuesses = 6;
  const currentWordData = words[currentWordIndex];
  const word = currentWordData.word.toUpperCase();

  // Get alphabet based on word
  const getAlphabet = () => {
    const hasRussian = /[А-Я]/i.test(word);
    return hasRussian
      ? 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('')
      : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  };

  const alphabet = getAlphabet();

  // Check if word is complete
  useEffect(() => {
    const isComplete = word.split('').every(letter =>
      letter === ' ' || letter === '-' || guessedLetters.has(letter)
    );

    if (isComplete && gameStatus === 'playing') {
      setGameStatus('won');
      setScore(score + 1);
    }
  }, [guessedLetters, word, gameStatus, score]);

  const handleLetterClick = (letter: string) => {
    if (guessedLetters.has(letter) || gameStatus !== 'playing') return;

    const newGuessed = new Set(guessedLetters);
    newGuessed.add(letter);
    setGuessedLetters(newGuessed);

    if (!word.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);

      if (newWrongGuesses >= maxWrongGuesses) {
        setGameStatus('lost');
      }
    }
  };

  const nextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setGuessedLetters(new Set());
      setWrongGuesses(0);
      setGameStatus('playing');
    }
  };

  const restart = () => {
    setCurrentWordIndex(0);
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setScore(0);
    setGameStatus('playing');
  };

  // Draw hangman
  const HangmanDrawing = () => {
    return (
      <svg width="200" height="250" className="mx-auto">
        {/* Gallows */}
        <line x1="10" y1="230" x2="150" y2="230" stroke="black" strokeWidth="4" />
        <line x1="50" y1="230" x2="50" y2="20" stroke="black" strokeWidth="4" />
        <line x1="50" y1="20" x2="130" y2="20" stroke="black" strokeWidth="4" />
        <line x1="130" y1="20" x2="130" y2="50" stroke="black" strokeWidth="4" />

        {/* Head */}
        {wrongGuesses > 0 && (
          <circle cx="130" cy="70" r="20" stroke="black" strokeWidth="3" fill="none" />
        )}

        {/* Body */}
        {wrongGuesses > 1 && (
          <line x1="130" y1="90" x2="130" y2="150" stroke="black" strokeWidth="3" />
        )}

        {/* Left arm */}
        {wrongGuesses > 2 && (
          <line x1="130" y1="110" x2="100" y2="130" stroke="black" strokeWidth="3" />
        )}

        {/* Right arm */}
        {wrongGuesses > 3 && (
          <line x1="130" y1="110" x2="160" y2="130" stroke="black" strokeWidth="3" />
        )}

        {/* Left leg */}
        {wrongGuesses > 4 && (
          <line x1="130" y1="150" x2="110" y2="190" stroke="black" strokeWidth="3" />
        )}

        {/* Right leg */}
        {wrongGuesses > 5 && (
          <line x1="130" y1="150" x2="150" y2="190" stroke="black" strokeWidth="3" />
        )}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-orange-600 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-white mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">🎯 Виселица</h1>
            <div className="text-xl">
              Счет: {score} | Слово {currentWordIndex + 1}/{words.length}
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left side - Hangman Drawing */}
            <div className="flex flex-col items-center">
              <HangmanDrawing />
              <div className="mt-4 text-center">
                <p className="text-lg font-medium">
                  Осталось попыток: {maxWrongGuesses - wrongGuesses}
                </p>
                {currentWordData.category && (
                  <p className="text-sm text-gray-600 mt-1">
                    Категория: {currentWordData.category}
                  </p>
                )}
                {currentWordData.hint && (
                  <p className="text-sm text-blue-600 mt-2">
                    💡 Подсказка: {currentWordData.hint}
                  </p>
                )}
              </div>
            </div>

            {/* Right side - Word and Letters */}
            <div className="flex flex-col justify-center">
              {/* Word Display */}
              <div className="mb-8">
                <div className="flex justify-center gap-2 flex-wrap">
                  {word.split('').map((letter, index) => (
                    <div
                      key={index}
                      className="w-12 h-12 border-b-2 border-gray-400 flex items-center justify-center"
                    >
                      <span className="text-2xl font-bold">
                        {letter === ' ' ? ' ' :
                         letter === '-' ? '-' :
                         guessedLetters.has(letter) ? letter : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Game Status */}
              {gameStatus !== 'playing' && (
                <div className={`mb-6 p-4 rounded-lg text-center ${
                  gameStatus === 'won'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {gameStatus === 'won' ? (
                    <>
                      <p className="text-xl font-bold mb-2">🎉 Отлично!</p>
                      <p>Вы угадали слово!</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xl font-bold mb-2">😔 Игра окончена!</p>
                      <p>Слово было: <strong>{word}</strong></p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Alphabet Keyboard */}
          {gameStatus === 'playing' && (
            <div className="mt-8">
              <div className="flex flex-wrap justify-center gap-2">
                {alphabet.map((letter) => {
                  const isGuessed = guessedLetters.has(letter);
                  const isCorrect = isGuessed && word.includes(letter);
                  const isWrong = isGuessed && !word.includes(letter);

                  return (
                    <button
                      key={letter}
                      onClick={() => handleLetterClick(letter)}
                      disabled={isGuessed}
                      className={`w-10 h-10 rounded-lg font-bold transition-colors ${
                        isCorrect
                          ? 'bg-green-500 text-white'
                          : isWrong
                          ? 'bg-red-500 text-white'
                          : isGuessed
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            {gameStatus !== 'playing' && currentWordIndex < words.length - 1 && (
              <button
                onClick={nextWord}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Следующее слово →
              </button>
            )}
            {(gameStatus !== 'playing' && currentWordIndex >= words.length - 1) && (
              <button
                onClick={restart}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Начать заново
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}