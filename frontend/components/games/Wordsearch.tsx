'use client';

import { useState, useEffect, useRef } from 'react';

interface WordsearchProps {
  words: string[];
  gridSize?: number;
}

interface Cell {
  letter: string;
  wordIds: Set<number>;
  selected: boolean;
}

export default function Wordsearch({ words, gridSize = 15 }: WordsearchProps) {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startCell, setStartCell] = useState<[number, number] | null>(null);
  const [currentCell, setCurrentCell] = useState<[number, number] | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);

  // Timer
  useEffect(() => {
    if (!isComplete) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isComplete]);

  // Initialize grid
  useEffect(() => {
    const normalizedWords = words.map(w => w.toUpperCase().replace(/[^A-ZА-Я]/g, ''));
    generateGrid(normalizedWords);
  }, [words, gridSize]);

  // Check completion
  useEffect(() => {
    if (foundWords.size === words.length && words.length > 0) {
      setIsComplete(true);
    }
  }, [foundWords, words.length]);

  const generateGrid = (normalizedWords: string[]) => {
    // Create empty grid
    const newGrid: Cell[][] = Array(gridSize).fill(null).map(() =>
      Array(gridSize).fill(null).map(() => ({
        letter: '',
        wordIds: new Set(),
        selected: false
      }))
    );

    // Directions for word placement
    const directions = [
      [0, 1],   // horizontal
      [1, 0],   // vertical
      [1, 1],   // diagonal down-right
      [-1, 1],  // diagonal up-right
      [0, -1],  // horizontal backwards
      [-1, 0],  // vertical backwards
      [-1, -1], // diagonal up-left
      [1, -1]   // diagonal down-left
    ];

    // Place words
    const placedWords: { word: string; start: [number, number]; dir: [number, number] }[] = [];

    normalizedWords.forEach((word, wordId) => {
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 100) {
        const dir = directions[Math.floor(Math.random() * directions.length)];
        const startRow = Math.floor(Math.random() * gridSize);
        const startCol = Math.floor(Math.random() * gridSize);

        if (canPlaceWord(newGrid, word, startRow, startCol, dir)) {
          placeWord(newGrid, word, startRow, startCol, dir, wordId);
          placedWords.push({ word, start: [startRow, startCol], dir: [dir[0], dir[1]] });
          placed = true;
        }
        attempts++;
      }
    });

    // Fill empty cells with random letters
    const alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (!newGrid[i][j].letter) {
          newGrid[i][j].letter = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      }
    }

    setGrid(newGrid);
  };

  const canPlaceWord = (grid: Cell[][], word: string, row: number, col: number, dir: [number, number]): boolean => {
    for (let i = 0; i < word.length; i++) {
      const newRow = row + dir[0] * i;
      const newCol = col + dir[1] * i;

      if (newRow < 0 || newRow >= gridSize || newCol < 0 || newCol >= gridSize) {
        return false;
      }

      if (grid[newRow][newCol].letter && grid[newRow][newCol].letter !== word[i]) {
        return false;
      }
    }
    return true;
  };

  const placeWord = (grid: Cell[][], word: string, row: number, col: number, dir: [number, number], wordId: number) => {
    for (let i = 0; i < word.length; i++) {
      const newRow = row + dir[0] * i;
      const newCol = col + dir[1] * i;
      grid[newRow][newCol].letter = word[i];
      grid[newRow][newCol].wordIds.add(wordId);
    }
  };

  const handleMouseDown = (row: number, col: number) => {
    setIsSelecting(true);
    setStartCell([row, col]);
    setCurrentCell([row, col]);
    setSelectedCells([[row, col]]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isSelecting || !startCell) return;

    // Calculate cells in straight line from start to current
    const cells = getCellsInLine(startCell, [row, col]);
    setSelectedCells(cells);
    setCurrentCell([row, col]);
  };

  const handleMouseUp = () => {
    if (!isSelecting) return;

    // Check if selected cells form a word
    const selectedWord = selectedCells.map(([r, c]) => grid[r][c].letter).join('');
    const reversedWord = selectedCells.map(([r, c]) => grid[r][c].letter).reverse().join('');

    const normalizedWords = words.map(w => w.toUpperCase().replace(/[^A-ZА-Я]/g, ''));

    normalizedWords.forEach((word, index) => {
      if ((selectedWord === word || reversedWord === word) && !foundWords.has(words[index])) {
        setFoundWords(new Set([...foundWords, words[index]]));
        highlightWord(selectedCells);
      }
    });

    setIsSelecting(false);
    setStartCell(null);
    setCurrentCell(null);
    setSelectedCells([]);
  };

  const getCellsInLine = (start: [number, number], end: [number, number]): [number, number][] => {
    const cells: [number, number][] = [];
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;

    const rowDiff = endRow - startRow;
    const colDiff = endCol - startCol;

    // Normalize to unit direction
    const rowDir = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
    const colDir = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);

    // Only allow straight lines (horizontal, vertical, diagonal)
    if (rowDiff !== 0 && colDiff !== 0 && Math.abs(rowDiff) !== Math.abs(colDiff)) {
      return [[startRow, startCol]];
    }

    const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));

    for (let i = 0; i <= steps; i++) {
      cells.push([startRow + rowDir * i, startCol + colDir * i]);
    }

    return cells;
  };

  const highlightWord = (cells: [number, number][]) => {
    const newGrid = [...grid];
    cells.forEach(([row, col]) => {
      newGrid[row][col].selected = true;
    });
    setGrid(newGrid);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const restart = () => {
    setFoundWords(new Set());
    setSelectedCells([]);
    setTimeElapsed(0);
    setIsComplete(false);
    const normalizedWords = words.map(w => w.toUpperCase().replace(/[^A-ZА-Я]/g, ''));
    generateGrid(normalizedWords);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-teal-600 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-white mb-6">
          <h1 className="text-3xl font-bold mb-4">🔍 Поиск слов</h1>
          <div className="flex justify-between items-center">
            <div>
              Найдено: {foundWords.size}/{words.length}
            </div>
            <div>
              Время: {formatTime(timeElapsed)}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr,300px] gap-8">
          {/* Grid */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <div
              ref={gridRef}
              className="inline-block select-none"
              onMouseLeave={() => {
                if (isSelecting) {
                  setCurrentCell(startCell);
                  setSelectedCells(startCell ? [[...startCell]] : []);
                }
              }}
              onMouseUp={handleMouseUp}
            >
              {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {row.map((cell, colIndex) => {
                    const isSelected = selectedCells.some(([r, c]) => r === rowIndex && c === colIndex);
                    const isFound = cell.selected;

                    return (
                      <div
                        key={colIndex}
                        className={`w-10 h-10 border border-gray-300 flex items-center justify-center cursor-pointer transition-colors ${
                          isFound
                            ? 'bg-green-200'
                            : isSelected
                            ? 'bg-yellow-200'
                            : 'bg-white hover:bg-gray-100'
                        }`}
                        onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                        onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                      >
                        <span className="font-bold text-lg">{cell.letter}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Words List */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <h3 className="font-bold text-lg mb-4">Найдите слова:</h3>
            <div className="space-y-2">
              {words.map((word, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg transition-colors ${
                    foundWords.has(word)
                      ? 'bg-green-100 text-green-700 line-through'
                      : 'bg-gray-50 text-gray-700'
                  }`}
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Completion Message */}
        {isComplete && (
          <div className="mt-6 bg-white rounded-2xl shadow-2xl p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">🎉 Поздравляем!</h2>
            <p className="text-lg mb-4">
              Все слова найдены за {formatTime(timeElapsed)}!
            </p>
            <button
              onClick={restart}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Играть снова
            </button>
          </div>
        )}
      </div>
    </div>
  );
}