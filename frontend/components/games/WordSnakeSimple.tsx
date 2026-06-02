'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

interface WordSnakeSimpleProps {
  targetWords?: string[];
}

export const WordSnakeSimple: React.FC<WordSnakeSimpleProps> = ({
  targetWords = ['APPLE']
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);
  const [debugInfo, setDebugInfo] = useState('');

  // Convert words to uppercase
  const words = targetWords.map(w => w.toUpperCase());
  const currentWord = words[currentWordIndex] || '';
  const currentLetter = currentWord[letterIndex] || '';

  // Store letters on field
  const lettersOnField = useRef<Array<{letter: string, x: number, y: number, correct: boolean}>>([]);

  // Detect alphabet
  const getAlphabet = (word: string) => {
    if (/[А-ЯЁ]/.test(word)) {
      return 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');
    }
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  };

  // Generate random letters
  const generateLetters = () => {
    lettersOnField.current = [];

    if (!currentWord || !currentLetter) {
      setDebugInfo('No word or letter to generate');
      return;
    }

    const alphabet = getAlphabet(currentWord);
    const correctLetter = currentLetter;

    // Add the correct letter
    lettersOnField.current.push({
      letter: correctLetter,
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20),
      correct: true
    });

    // Add 5 random wrong letters
    for (let i = 0; i < 5; i++) {
      const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
      if (randomLetter !== correctLetter) {
        lettersOnField.current.push({
          letter: randomLetter,
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * 20),
          correct: false
        });
      }
    }

    setDebugInfo(`Generated ${lettersOnField.current.length} letters: ${lettersOnField.current.map(l => l.letter).join(', ')}`);
  };

  // Draw on canvas
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = 30;

    // Clear canvas
    ctx.fillStyle = '#e8f5e8';
    ctx.fillRect(0, 0, 600, 600);

    // Draw grid
    ctx.strokeStyle = '#d0d0d0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 20; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, 600);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(600, i * cellSize);
      ctx.stroke();
    }

    // Draw current word in background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(currentWord, 300, 300);

    // Draw letters
    lettersOnField.current.forEach(item => {
      const x = item.x * cellSize + cellSize / 2;
      const y = item.y * cellSize + cellSize / 2;

      // Draw circle
      ctx.fillStyle = item.correct ? '#ffd700' : '#ffffff';
      ctx.strokeStyle = item.correct ? '#ff8800' : '#666666';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.arc(x, y, cellSize * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw letter
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.letter, x, y);
    });

    // Draw debug info on canvas
    ctx.fillStyle = '#ff0000';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`Word: ${currentWord}, Letter: ${currentLetter}, Letters on field: ${lettersOnField.current.length}`, 10, 10);
  };

  // Initialize and draw
  useEffect(() => {
    generateLetters();
  }, [currentWord, letterIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      draw();
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">Word Snake Simple Test</h2>

          <div className="mb-4 p-4 bg-gray-100 rounded">
            <div className="text-sm">
              <p><strong>Words:</strong> {words.join(', ')}</p>
              <p><strong>Current Word:</strong> {currentWord} (index: {currentWordIndex})</p>
              <p><strong>Current Letter:</strong> {currentLetter} (index: {letterIndex})</p>
              <p><strong>Alphabet:</strong> {getAlphabet(currentWord).slice(0, 10).join('')}...</p>
              <p><strong>Debug:</strong> {debugInfo}</p>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            className="border-2 border-gray-300 rounded mb-4"
            style={{ maxWidth: '100%', height: 'auto' }}
          />

          <div className="flex gap-2">
            <Button
              onClick={() => {
                generateLetters();
                draw();
              }}
            >
              Regenerate Letters
            </Button>

            <Button
              onClick={() => {
                if (letterIndex < currentWord.length - 1) {
                  setLetterIndex(letterIndex + 1);
                } else if (currentWordIndex < words.length - 1) {
                  setCurrentWordIndex(currentWordIndex + 1);
                  setLetterIndex(0);
                }
              }}
            >
              Next Letter
            </Button>

            <Button
              onClick={() => {
                setCurrentWordIndex(0);
                setLetterIndex(0);
              }}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WordSnakeSimple;