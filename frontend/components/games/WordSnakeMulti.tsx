'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { GameResult } from '@/lib/types';

interface WordSnakeMultiProps {
  targetWords?: string[];
  speed?: 'slow' | 'medium' | 'fast';
  onComplete: (result: GameResult) => void;
}

interface Position {
  x: number;
  y: number;
}

interface Letter {
  letter: string;
  correct: boolean;
  x: number;
  y: number;
}

export const WordSnakeMulti: React.FC<WordSnakeMultiProps> = ({
  targetWords = ['APPLE'],
  speed = 'medium',
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  // Use targetWords directly instead of copying to state
  const words = targetWords.map(w => w.toUpperCase());

  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wordIndex, setWordIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [totalScore, setTotalScore] = useState(0);
  const [completedWords, setCompletedWords] = useState<string[]>([]);

  // Get current word
  const currentWord = words[currentWordIdx] || '';

  console.log('WordSnakeMulti - words:', words, 'currentWordIdx:', currentWordIdx, 'currentWord:', currentWord);

  // Game state refs for animation loop
  const snakeRef = useRef<Position[]>([]);
  const dirRef = useRef<Position>({ x: 1, y: 0 });
  const nextDirRef = useRef<Position>({ x: 1, y: 0 });
  const lettersRef = useRef<Letter[]>([]);

  const grid = 20;
  const cellSize = 30;
  const canvasSize = grid * cellSize;

  // Speed settings
  const speedMap = {
    slow: 390,
    medium: 250,
    fast: 150
  };
  const tickMs = speedMap[speed];

  // Detect alphabet type (Russian or English)
  const detectAlphabet = (word: string): 'russian' | 'english' => {
    const hasRussian = /[А-ЯЁ]/i.test(word);
    return hasRussian ? 'russian' : 'english';
  };

  // Get alphabet for specific word
  const getAlphabetForWord = (word: string): string[] => {
    const alphabetType = detectAlphabet(word);
    if (alphabetType === 'russian') {
      return 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');
    } else {
      return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    }
  };

  // Initialize game - don't use useCallback to avoid stale closures
  const resetGame = () => {
    console.log('resetGame called with words:', words);

    snakeRef.current = [
      { x: 9, y: 11 },
      { x: 8, y: 11 },
      { x: 7, y: 11 }
    ];
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    lettersRef.current = [];
    setCurrentWordIdx(0);
    setWordIndex(0);
    setScore(0);
    setTotalScore(0);
    setLives(3);
    setRunning(false);
    setGameOver(false);
    setGameWon(false);
    setCompletedWords([]);

    if (words && words[0]) {
      console.log('Spawning initial letters for word:', words[0]);
      spawnLetters(0, words[0]);
    } else {
      draw();
    }
  };

  // Helper functions
  const randomCell = (): Position => ({
    x: Math.floor(Math.random() * grid),
    y: Math.floor(Math.random() * grid)
  });

  const sameCell = (a: Position, b: Position): boolean =>
    a.x === b.x && a.y === b.y;

  const occupied = (pos: Position): boolean =>
    snakeRef.current.some(part => sameCell(part, pos)) ||
    lettersRef.current.some(item => sameCell(item, pos));

  const getSafeRandomCell = (): Position => {
    let pos = randomCell();
    let attempts = 0;
    while (occupied(pos) && attempts < 300) {
      pos = randomCell();
      attempts++;
    }
    return pos;
  };

  const spawnLetters = (letterIndex: number, word: string) => {
    lettersRef.current = [];
    const correct = word[letterIndex];
    if (!correct) {
      console.log('No letter found at index', letterIndex, 'for word', word);
      return;
    }

    console.log('Spawning letters for word:', word, 'letter:', correct, 'at index:', letterIndex);

    const alphabet = getAlphabetForWord(word);
    const decoys = alphabet
      .filter(l => l !== correct)
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    const allLetters = [correct, ...decoys].sort(() => Math.random() - 0.5);

    allLetters.forEach(letter => {
      const pos = getSafeRandomCell();
      lettersRef.current.push({
        letter,
        correct: letter === correct,
        x: pos.x,
        y: pos.y
      });
    });

    console.log('Spawned letters:', lettersRef.current.map(l => l.letter));
    console.log('Letters positions:', lettersRef.current.map(l => ({letter: l.letter, x: l.x, y: l.y})));

    // Force redraw after spawning letters
    setTimeout(() => {
      draw();
    }, 0);
  };

  const spawnOneDecoy = (letterIndex: number, word: string) => {
    const correct = word[letterIndex];
    const alphabet = getAlphabetForWord(word).filter(l => l !== correct);
    const letter = alphabet[Math.floor(Math.random() * alphabet.length)];
    const pos = getSafeRandomCell();
    lettersRef.current.push({
      letter,
      correct: false,
      x: pos.x,
      y: pos.y
    });
  };

  // Next word logic
  const moveToNextWord = () => {
    const nextIdx = currentWordIdx + 1;
    if (nextIdx < words.length) {
      // Move to next word
      const nextWord = words[nextIdx];
      setCompletedWords(prev => [...prev, currentWord]);
      setCurrentWordIdx(nextIdx);
      setWordIndex(0);

      // Reset snake position for new word
      snakeRef.current = [
        { x: 9, y: 11 },
        { x: 8, y: 11 },
        { x: 7, y: 11 }
      ];
      dirRef.current = { x: 1, y: 0 };
      nextDirRef.current = { x: 1, y: 0 };

      // Clear old letters and spawn new ones for the next word
      lettersRef.current = [];
      spawnLetters(0, nextWord);
    } else {
      // All words completed - game won!
      setRunning(false);
      setGameWon(true);
      setCompletedWords([...completedWords, currentWord]);
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }

      onComplete({
        score: totalScore + score,
        completed: true,
        timeSpent: Math.floor((Date.now() - startTimeRef.current) / 1000),
        accuracy: 100,
        mistakes: 3 - lives,
        customData: {
          words: words,
          wordsCompleted: words.length,
          gameType: 'word_snake_multi'
        }
      });
    }
  };

  // Drawing functions - no useCallback to avoid stale closures
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    console.log('Drawing - letters on field:', lettersRef.current.length, 'letters:', lettersRef.current.map(l => l.letter));

    // Clear canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw background
    ctx.fillStyle = '#dff3d8';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Draw grid pattern
    for (let x = 0; x < grid; x++) {
      for (let y = 0; y < grid; y++) {
        if ((x + y) % 2 === 0) {
          ctx.fillStyle = 'rgba(255,255,255,0.22)';
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }

    // Draw background word
    ctx.fillStyle = 'rgba(45,123,70,0.16)';
    ctx.font = `900 ${canvasSize / 10}px system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(currentWord, canvasSize / 2, canvasSize / 2);

    // Draw letters
    lettersRef.current.forEach(item => {
      const cx = item.x * cellSize + cellSize / 2;
      const cy = item.y * cellSize + cellSize / 2;

      ctx.save();
      ctx.translate(cx, cy);

      // Letter circle
      ctx.fillStyle = item.correct ? '#ffd166' : '#ffffff';
      ctx.strokeStyle = item.correct ? '#d99900' : 'rgba(43,33,24,0.18)';
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.arc(0, 0, cellSize * 0.43, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Letter text
      ctx.fillStyle = item.correct ? '#2b2118' : '#77685d';
      ctx.font = '900 19px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.letter, 0, 2);

      ctx.restore();
    });

    // Draw snake
    snakeRef.current.forEach((part, index) => {
      const x = part.x * cellSize + 2;
      const y = part.y * cellSize + 2;
      const size = cellSize - 4;

      // Snake body
      ctx.fillStyle = index === 0 ? '#2d7b46' : '#51b36d';
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, 9);
      ctx.fill();

      // Draw eyes on head
      if (index === 0) {
        const dir = dirRef.current;
        const eyeOffsetX = dir.x !== 0 ? dir.x * 5 : 6;
        const eyeOffsetY = dir.y !== 0 ? dir.y * 5 : 6;

        // Eye whites
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x + size/2 + eyeOffsetX - 5, y + size/2 + eyeOffsetY - 5, 3.5, 0, Math.PI * 2);
        ctx.arc(x + size/2 + eyeOffsetX + 5, y + size/2 + eyeOffsetY - 5, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Eye pupils
        ctx.fillStyle = '#2b2118';
        ctx.beginPath();
        ctx.arc(x + size/2 + eyeOffsetX - 5, y + size/2 + eyeOffsetY - 5, 1.6, 0, Math.PI * 2);
        ctx.arc(x + size/2 + eyeOffsetX + 5, y + size/2 + eyeOffsetY - 5, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  // Store current word in ref to avoid stale closures
  const currentWordRef = useRef(currentWord);
  useEffect(() => {
    currentWordRef.current = currentWord;
    // Redraw when current word changes
    draw();
  }, [currentWord]);

  // Game loop
  const step = useCallback(() => {
    dirRef.current = nextDirRef.current;
    const snake = snakeRef.current;
    const dir = dirRef.current;
    const activeWord = currentWordRef.current;

    const head = {
      x: snake[0].x + dir.x,
      y: snake[0].y + dir.y
    };

    // Check collision with walls or self
    if (
      head.x < 0 || head.x >= grid ||
      head.y < 0 || head.y >= grid ||
      snake.some(part => sameCell(part, head))
    ) {
      setRunning(false);
      setGameOver(true);
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }

      // Send game result
      onComplete({
        score: totalScore + score,
        completed: false,
        timeSpent: Math.floor((Date.now() - startTimeRef.current) / 1000),
        accuracy: (totalScore + score) / ((currentWordIdx * 10 + wordIndex + 1) * 10) * 100,
        mistakes: 3 - lives,
        customData: {
          words: words,
          wordsCompleted: completedWords.length,
          gameType: 'word_snake_multi'
        }
      });
      return;
    }

    snake.unshift(head);

    // Check letter collection
    const hitIndex = lettersRef.current.findIndex(item => sameCell(item, head));

    if (hitIndex >= 0) {
      const item = lettersRef.current[hitIndex];

      if (item.letter === activeWord[wordIndex]) {
        // Correct letter
        setScore(prev => prev + 10);
        const newIndex = wordIndex + 1;
        setWordIndex(newIndex);

        if (newIndex >= activeWord.length) {
          // Word completed!
          setTotalScore(prev => prev + score + 10);
          moveToNextWord();
          return;
        }

        spawnLetters(newIndex, activeWord);
      } else {
        // Wrong letter
        setLives(prev => prev - 1);
        setScore(prev => Math.max(0, prev - 5));

        if (lives <= 1) {
          setRunning(false);
          setGameOver(true);
          if (gameLoopRef.current) {
            clearInterval(gameLoopRef.current);
            gameLoopRef.current = null;
          }

          onComplete({
            score: totalScore + score,
            completed: false,
            timeSpent: Math.floor((Date.now() - startTimeRef.current) / 1000),
            accuracy: (totalScore + score) / ((currentWordIdx * 10 + wordIndex + 1) * 10) * 100,
            mistakes: 3,
            customData: {
              words: words,
              wordsCompleted: completedWords.length,
              gameType: 'word_snake_multi'
            }
          });
          return;
        }

        lettersRef.current.splice(hitIndex, 1);
        spawnOneDecoy(wordIndex, activeWord);
        snake.pop();
      }
    } else {
      snake.pop();
    }

    draw();
  }, [wordIndex, score, totalScore, lives, currentWord, currentWordIdx, words, completedWords, onComplete, draw, grid]);

  const startTimeRef = useRef<number>(Date.now());

  // Start game
  const startGame = useCallback(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    setShowInstructions(false);
    setRunning(true);
    setGameOver(false);
    setGameWon(false);
    startTimeRef.current = Date.now();
    gameLoopRef.current = setInterval(step, tickMs);
  }, [step, tickMs]);

  // Handle keyboard input
  const setDirection = useCallback((name: string) => {
    const map: { [key: string]: Position } = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 }
    };

    const proposed = map[name];
    if (!proposed) return;

    const dir = dirRef.current;
    const reversing = proposed.x + dir.x === 0 && proposed.y + dir.y === 0;

    if (!reversing) {
      nextDirRef.current = proposed;
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const keys: { [key: string]: string } = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right'
      };

      if (keys[event.key]) {
        event.preventDefault();
        setDirection(keys[event.key]);
        if (!running && !showInstructions && !gameOver && !gameWon) {
          startGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [running, showInstructions, gameOver, gameWon, setDirection, startGame]);

  // Initialize game on mount and when words change
  useEffect(() => {
    console.log('useEffect triggered - targetWords:', targetWords);
    resetGame();

    // Add a draw interval to ensure canvas updates
    const drawInterval = setInterval(() => {
      if (!running) {
        draw();
      }
    }, 100);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
      clearInterval(drawInterval);
    };
  }, [targetWords]); // Re-run when targetWords change, resetGame will be recreated anyway

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Control Panel */}
      <Card className="lg:w-80">
        <CardContent className="p-6 space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Змейка слов</h2>
            <p className="text-sm text-gray-600">
              Собирайте буквы в правильном порядке для всех слов.
            </p>
          </div>

          {/* Words List */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
              Слова для сбора ({currentWordIdx + 1}/{words.length})
            </div>
            <div className="space-y-2">
              {words.map((word, idx) => (
                <div
                  key={idx}
                  className={`
                    p-2 rounded-lg font-bold transition-all
                    ${completedWords.includes(word)
                      ? 'bg-green-500 text-white'
                      : idx === currentWordIdx
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-200 text-gray-400'}
                  `}
                >
                  {idx + 1}. {word} {completedWords.includes(word) && '✓'}
                </div>
              ))}
            </div>
          </div>

          {/* Current Word Progress */}
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
              Текущее слово
            </div>
            <div className="flex gap-1 flex-wrap">
              {currentWord.split('').map((letter, index) => (
                <div
                  key={index}
                  className={`
                    w-8 h-10 flex items-center justify-center rounded
                    font-bold text-sm transition-all duration-200
                    ${index < wordIndex
                      ? 'bg-green-500 text-white transform -translate-y-1 rotate-[-2deg]'
                      : 'bg-gray-200 text-gray-400'}
                  `}
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>

          {/* Next Letter */}
          <div className="bg-gradient-to-br from-white to-yellow-50 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
              Следующая буква
            </div>
            <div className="text-4xl font-black text-green-700">
              {wordIndex < currentWord.length ? currentWord[wordIndex] : '✓'}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3 border">
              <div className="text-2xl font-bold">{totalScore + score}</div>
              <div className="text-xs text-gray-500">очки</div>
            </div>
            <div className="bg-white rounded-lg p-3 border">
              <div className="text-2xl font-bold">{lives}</div>
              <div className="text-xs text-gray-500">жизни</div>
            </div>
          </div>

          {/* Buttons */}
          <Button
            onClick={() => {
              resetGame();
              startGame();
            }}
            className="w-full"
            variant="primary"
          >
            {running ? 'Перезапустить' : 'Начать игру'}
          </Button>

          {/* Rules */}
          <div className="text-xs text-gray-600 space-y-1">
            <p>• Используйте стрелки для управления</p>
            <p>• Собирайте все слова по порядку</p>
            <p>• Неправильная буква = -1 жизнь</p>
            <p>• {detectAlphabet(currentWord) === 'russian' ? 'Русский' : 'Английский'} алфавит</p>
          </div>
        </CardContent>
      </Card>

      {/* Game Area */}
      <Card className="flex-1">
        <CardContent className="p-6">
          <div className="mb-4 flex justify-between items-center flex-wrap gap-2">
            <div className="px-4 py-2 bg-white rounded-full text-sm font-semibold">
              Слово {currentWordIdx + 1}: <span className="text-primary">{currentWord}</span>
            </div>
            <div className="px-4 py-2 bg-white rounded-full text-sm font-semibold">
              Завершено: <span className="text-primary">{completedWords.length}/{words.length}</span>
            </div>
          </div>

          <div className="relative">
            <canvas
              ref={canvasRef}
              width={canvasSize}
              height={canvasSize}
              className="w-full max-w-[600px] mx-auto rounded-2xl shadow-inner"
              style={{
                background: 'linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), #dff3d8',
                backgroundSize: '30px 30px'
              }}
            />

            {/* Mobile controls */}
            <div className="grid grid-cols-3 gap-2 mt-4 lg:hidden">
              <div />
              <Button onClick={() => setDirection('up')} variant="secondary">▲</Button>
              <div />
              <Button onClick={() => setDirection('left')} variant="secondary">◀</Button>
              <Button onClick={() => setDirection('down')} variant="secondary">▼</Button>
              <Button onClick={() => setDirection('right')} variant="secondary">▶</Button>
            </div>

            {/* Overlays */}
            {showInstructions && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-xl">
                  <h3 className="text-2xl font-bold mb-4">Готовы?</h3>
                  <p className="text-gray-600 mb-4">
                    Соберите {words.length} слов{words.length === 1 ? 'о' : 'а'} по порядку:
                  </p>
                  <div className="mb-6 space-y-1">
                    {words.map((word, idx) => (
                      <div key={idx} className="font-bold">
                        {idx + 1}. {word}
                      </div>
                    ))}
                  </div>
                  <Button onClick={startGame} variant="primary">
                    Играть
                  </Button>
                </div>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-xl">
                  <h3 className="text-2xl font-bold mb-4 text-red-600">Игра окончена</h3>
                  <p className="text-gray-600 mb-6">
                    Вы набрали {totalScore + score} очков и собрали {completedWords.length} из {words.length} слов.
                  </p>
                  <Button
                    onClick={() => {
                      resetGame();
                      startGame();
                    }}
                    variant="primary"
                  >
                    Играть снова
                  </Button>
                </div>
              </div>
            )}

            {gameWon && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-xl">
                  <h3 className="text-2xl font-bold mb-4 text-green-600">Победа!</h3>
                  <p className="text-gray-600 mb-4">
                    Вы собрали все слова!
                  </p>
                  <div className="mb-4 space-y-1">
                    {words.map((word, idx) => (
                      <div key={idx} className="font-bold text-green-600">
                        ✓ {word}
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6">
                    Итоговый счёт: {totalScore + score}
                  </p>
                  <Button
                    onClick={() => {
                      resetGame();
                      startGame();
                    }}
                    variant="primary"
                  >
                    Играть снова
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WordSnakeMulti;