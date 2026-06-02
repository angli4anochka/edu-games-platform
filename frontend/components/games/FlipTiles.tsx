'use client';

import { useState } from 'react';

interface Tile {
  id: string;
  front: string;
  back: string;
  category?: string;
}

interface FlipTilesProps {
  tiles: Tile[];
}

export default function FlipTiles({ tiles }: FlipTilesProps) {
  const [flippedTiles, setFlippedTiles] = useState<Set<string>>(new Set());
  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  const [viewedTiles, setViewedTiles] = useState<Set<string>>(new Set());

  const toggleFlip = (id: string) => {
    const newFlipped = new Set(flippedTiles);
    if (newFlipped.has(id)) {
      newFlipped.delete(id);
    } else {
      newFlipped.add(id);
      setViewedTiles(prev => new Set(prev).add(id));
    }
    setFlippedTiles(newFlipped);
  };

  const handleTileClick = (id: string) => {
    if (selectedTile === id) {
      setSelectedTile(null);
    } else {
      setSelectedTile(id);
    }
  };

  const progress = (viewedTiles.size / tiles.length) * 100;

  // Group tiles by category if categories exist
  const tilesByCategory = tiles.reduce((acc, tile) => {
    const category = tile.category || 'Без категории';
    if (!acc[category]) acc[category] = [];
    acc[category].push(tile);
    return acc;
  }, {} as Record<string, typeof tiles>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-600 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-white mb-8">
          <h1 className="text-3xl font-bold mb-4">🔄 Переворот плиток</h1>
          <div className="flex items-center gap-4">
            <span>Изучено: {viewedTiles.size}/{tiles.length}</span>
            <div className="flex-1 bg-white/20 rounded-full h-3">
              <div
                className="bg-white h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tiles Grid */}
        <div className="space-y-8">
          {Object.entries(tilesByCategory).map(([category, categoryTiles]) => (
            <div key={category}>
              {Object.keys(tilesByCategory).length > 1 && (
                <h2 className="text-white text-xl font-semibold mb-4">{category}</h2>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categoryTiles.map((tile) => (
                  <div
                    key={tile.id}
                    className={`relative h-40 cursor-pointer transform transition-all duration-300 ${
                      selectedTile === tile.id ? 'scale-105 z-10' : 'hover:scale-102'
                    }`}
                    onClick={() => handleTileClick(tile.id)}
                  >
                    <div
                      className={`absolute inset-0 w-full h-full transition-transform duration-700 transform-style-3d ${
                        flippedTiles.has(tile.id) ? 'rotate-y-180' : ''
                      }`}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* Front */}
                      <div
                        className="absolute inset-0 w-full h-full backface-hidden rounded-xl shadow-lg flex items-center justify-center p-4 text-center"
                        style={{
                          backfaceVisibility: 'hidden',
                          backgroundColor: viewedTiles.has(tile.id) ? '#e0f2fe' : '#f3f4f6'
                        }}
                      >
                        <div>
                          <p className="text-lg font-medium text-gray-800">{tile.front}</p>
                          {viewedTiles.has(tile.id) && (
                            <span className="text-xs text-blue-600 mt-2 block">✓ Просмотрено</span>
                          )}
                        </div>
                      </div>

                      {/* Back */}
                      <div
                        className="absolute inset-0 w-full h-full backface-hidden rounded-xl shadow-lg flex items-center justify-center p-4 text-center rotate-y-180 bg-gradient-to-br from-purple-600 to-pink-600 text-white"
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)'
                        }}
                      >
                        <p className="text-lg">{tile.back}</p>
                      </div>
                    </div>

                    {/* Flip Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFlip(tile.id);
                      }}
                      className="absolute bottom-2 right-2 z-20 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Tile Enlarged View */}
        {selectedTile && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8"
            onClick={() => setSelectedTile(null)}
          >
            <div
              className="relative max-w-lg w-full h-64"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`absolute inset-0 w-full h-full transition-transform duration-700 transform-style-3d ${
                  flippedTiles.has(selectedTile) ? 'rotate-y-180' : ''
                }`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front - Enlarged */}
                <div
                  className="absolute inset-0 w-full h-full backface-hidden rounded-2xl shadow-2xl flex items-center justify-center p-8 text-center bg-white"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <p className="text-2xl font-medium text-gray-800">
                    {tiles.find(t => t.id === selectedTile)?.front}
                  </p>
                </div>

                {/* Back - Enlarged */}
                <div
                  className="absolute inset-0 w-full h-full backface-hidden rounded-2xl shadow-2xl flex items-center justify-center p-8 text-center rotate-y-180 bg-gradient-to-br from-purple-600 to-pink-600 text-white"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <p className="text-2xl">
                    {tiles.find(t => t.id === selectedTile)?.back}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="absolute -bottom-16 left-0 right-0 flex justify-center gap-4">
                <button
                  onClick={() => toggleFlip(selectedTile)}
                  className="px-6 py-2 bg-white text-gray-700 rounded-lg shadow-lg hover:bg-gray-100"
                >
                  Перевернуть
                </button>
                <button
                  onClick={() => setSelectedTile(null)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg shadow-lg hover:bg-gray-700"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}