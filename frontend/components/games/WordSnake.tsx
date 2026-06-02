'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { GameResult } from '@/lib/types';

interface WordSnakeProps {
  targetWord?: string;
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

export const WordSnake: React.FC<WordSnakeProps> = ({
  targetWord = 'APPLE',
  speed = 'medium',
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const [word, setWord] = useState(targetWord.toUpperCase());
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wordIndex, setWordIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

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

  // Helper functions
  const randomCell = (): Position => ({
    x: Math.floor(Math.random() * grid),
    y: Math.floor(Math.random() * grid)
  });

  const sameCell = (a: Position, b: Position): boolean =>
    a.x === b.x && a.y === b.y;

  // Initialize game
  const resetGame = useCallback(() => {
    snakeRef.current = [
      { x: 9, y: 11 },
      { x: 8, y: 11 },
      { x: 7, y: 11 }
    ];
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    lettersRef.current = [];
    setWordIndex(0);
    setScore(0);
    setLives(3);
    setRunning(false);
    setGameOver(false);
    setGameWon(false);

    // Spawn letters for first letter of word
    const correct = word[0];
    if (correct) {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      const decoys = alphabet
        .filter(l => l !== correct)
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);

      const allLetters = [correct, ...decoys].sort(() => Math.random() - 0.5);

      const getSafeCell = (): Position => {
        let pos = randomCell();
        let attempts = 0;
        while ((snakeRef.current.some(part => sameCell(part, pos)) ||
                lettersRef.current.some(item => sameCell(item, pos))) && attempts < 300) {
          pos = randomCell();
          attempts++;
        }
        return pos;
      };

      allLetters.forEach(letter => {
        const pos = getSafeCell();
        lettersRef.current.push({
          letter,
          correct: letter === correct,
          x: pos.x,
          y: pos.y
        });
      });
    }

    // Force immediate draw
    requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

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
      ctx.font = `900 ${canvasSize / 8}px system-ui`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(word, canvasSize / 2, canvasSize / 2);

      // Draw letters
      lettersRef.current.forEach(item => {
        const cx = item.x * cellSize + cellSize / 2;
        const cy = item.y * cellSize + cellSize / 2;

        ctx.save();
        ctx.translate(cx, cy);

        ctx.fillStyle = item.correct ? '#ffd166' : '#ffffff';
        ctx.strokeStyle = item.correct ? '#d99900' : 'rgba(43,33,24,0.18)';
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.arc(0, 0, cellSize * 0.43, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

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

        ctx.fillStyle = index === 0 ? '#2d7b46' : '#51b36d';
        ctx.beginPath();
        ctx.roundRect(x, y, size, size, 9);
        ctx.fill();

        if (index === 0) {
          const dir = dirRef.current;
          const eyeOffsetX = dir.x !== 0 ? dir.x * 5 : 6;
          const eyeOffsetY = dir.y !== 0 ? dir.y * 5 : 6;

          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(x + size/2 + eyeOffsetX - 5, y + size/2 + eyeOffsetY - 5, 3.5, 0, Math.PI * 2);
          ctx.arc(x + size/2 + eyeOffsetX + 5, y + size/2 + eyeOffsetY - 5, 3.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#2b2118';
          ctx.beginPath();
          ctx.arc(x + size/2 + eyeOffsetX - 5, y + size/2 + eyeOffsetY - 5, 1.6, 0, Math.PI * 2);
          ctx.arc(x + size/2 + eyeOffsetX + 5, y + size/2 + eyeOffsetY - 5, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    });
  }, [word, canvasSize, cellSize, grid]);

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

  const spawnLetters = (currentWordIndex: number) => {
    lettersRef.current = [];
    const correct = word[currentWordIndex];
    if (!correct) return;

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
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
  };

  const spawnOneDecoy = (currentWordIndex: number) => {
    const correct = word[currentWordIndex];
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(l => l !== correct);
    const letter = alphabet[Math.floor(Math.random() * alphabet.length)];
    const pos = getSafeRandomCell();
    lettersRef.current.push({
      letter,
      correct: false,
      x: pos.x,
      y: pos.y
    });
  };

  // Drawing functions
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
    ctx.font = `900 ${canvasSize / 8}px system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(word, canvasSize / 2, canvasSize / 2);

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
  }, [word, canvasSize, cellSize, grid]);

  // Game loop
  const step = useCallback(() => {
    dirRef.current = nextDirRef.current;
    const snake = snakeRef.current;
    const dir = dirRef.current;

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
        score,
        completed: false,
        timeSpent: Math.floor((Date.now() - startTimeRef.current) / 1000),
        accuracy: score / ((wordIndex + 1) * 10) * 100,
        mistakes: 3 - lives,
        customData: {
          word,
          lettersCollected: wordIndex,
          gameType: 'word_snake'
        }
      });
      return;
    }

    snake.unshift(head);

    // Check letter collection
    const hitIndex = lettersRef.current.findIndex(item => sameCell(item, head));

    if (hitIndex >= 0) {
      const item = lettersRef.current[hitIndex];

      if (item.letter === word[wordIndex]) {
        // Correct letter
        setScore(prev => prev + 10);
        const newIndex = wordIndex + 1;
        setWordIndex(newIndex);

        if (newIndex >= word.length) {
          // Game won!
          setRunning(false);
          setGameWon(true);
          if (gameLoopRef.current) {
            clearInterval(gameLoopRef.current);
            gameLoopRef.current = null;
          }

          onComplete({
            score: score + 10,
            completed: true,
            timeSpent: Math.floor((Date.now() - startTimeRef.current) / 1000),
            accuracy: 100,
            mistakes: 3 - lives,
            customData: {
              word,
              lettersCollected: word.length,
              gameType: 'word_snake'
            }
          });
          return;
        }

        spawnLetters(newIndex);
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
            score,
            completed: false,
            timeSpent: Math.floor((Date.now() - startTimeRef.current) / 1000),
            accuracy: score / ((wordIndex + 1) * 10) * 100,
            mistakes: 3,
            customData: {
              word,
              lettersCollected: wordIndex,
              gameType: 'word_snake'
            }
          });
          return;
        }

        lettersRef.current.splice(hitIndex, 1);
        spawnOneDecoy(wordIndex);
        snake.pop();
      }
    } else {
      snake.pop();
    }

    draw();
  }, [wordIndex, score, lives, word, onComplete, draw, grid]);

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

  // Initialize game on mount
  useEffect(() => {
    resetGame();
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [resetGame]);

  // Change word
  const changeWord = () => {
    const input = prompt('Введите слово (только буквы):', word);
    if (!input) return;

    const cleaned = input.toUpperCase().replace(/[^A-ZА-Я]/g, '').slice(0, 10);
    if (!cleaned) return;

    setWord(cleaned);
    resetGame();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Control Panel */}
      <Card className="lg:w-80">
        <CardContent className="p-6 space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Змейка слов</h2>
            <p className="text-sm text-gray-600">
              Собирайте буквы в правильном порядке. Змейка растёт с каждой правильной буквой.
            </p>
          </div>

          {/* Word Progress */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
              Собираемое слово
            </div>
            <div className="flex gap-2">
              {word.split('').map((letter, index) => (
                <div
                  key={index}
                  className={`
                    w-10 h-12 flex items-center justify-center rounded-lg
                    font-bold text-lg transition-all duration-200
                    ${index < wordIndex
                      ? 'bg-green-500 text-white transform -translate-y-1 rotate-[-2deg] shadow-lg'
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
            <div className="text-5xl font-black text-green-700">
              {wordIndex < word.length ? word[wordIndex] : '✓'}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3 border">
              <div className="text-2xl font-bold">{score}</div>
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

          <Button
            onClick={changeWord}
            className="w-full"
            variant="secondary"
          >
            Изменить слово
          </Button>

          {/* Rules */}
          <div className="text-xs text-gray-600 space-y-1">
            <p>• Используйте стрелки для управления</p>
            <p>• Собирайте: <strong>{word.split('').join(' → ')}</strong></p>
            <p>• Неправильная буква = -1 жизнь</p>
            <p>• Столкновение = конец игры</p>
          </div>
        </CardContent>
      </Card>

      {/* Game Area */}
      <Card className="flex-1">
        <CardContent className="p-6">
          <div className="mb-4 flex justify-between items-center">
            <div className="px-4 py-2 bg-white rounded-full text-sm font-semibold">
              Слово: <span className="text-primary">{word}</span>
            </div>
            <div className="px-4 py-2 bg-white rounded-full text-sm font-semibold">
              Скорость: <span className="text-primary">{speed === 'slow' ? 'медленная' : speed === 'medium' ? 'средняя' : 'быстрая'}</span>
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
                  <p className="text-gray-600 mb-6">
                    Соберите буквы {word.split('').join(', ')} по порядку.
                    Избегайте неправильных букв, стен и собственного хвоста.
                  </p>
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
                    Вы набрали {score} очков и собрали {wordIndex} из {word.length} букв.
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
                  <p className="text-gray-600 mb-6">
                    Вы собрали слово {word}! Набрано очков: {score}
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

export default WordSnake;