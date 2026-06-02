'use client';

import { useState, useRef, useEffect } from 'react';

interface Label {
  id: string;
  text: string;
  correctX: number;
  correctY: number;
}

interface LabelledDiagramProps {
  imageUrl: string;
  labels: Label[];
  title?: string;
}

export default function LabelledDiagram({ imageUrl, labels, title }: LabelledDiagramProps) {
  const [placedLabels, setPlacedLabels] = useState<Map<string, { x: number; y: number }>>(new Map());
  const [draggedLabel, setDraggedLabel] = useState<string | null>(null);
  const [correctLabels, setCorrectLabels] = useState<Set<string>>(new Set());
  const [showFeedback, setShowFeedback] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const imageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if all labels are correctly placed
  useEffect(() => {
    if (correctLabels.size === labels.length && labels.length > 0) {
      setIsComplete(true);
    }
  }, [correctLabels, labels.length]);

  // Update image size on load and resize
  useEffect(() => {
    const updateSize = () => {
      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        setImageSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleDragStart = (e: React.DragEvent, labelId: string) => {
    setDraggedLabel(labelId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    if (!draggedLabel || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Place the label
    const newPlaced = new Map(placedLabels);
    newPlaced.set(draggedLabel, { x, y });
    setPlacedLabels(newPlaced);

    // Check if placement is correct
    const label = labels.find(l => l.id === draggedLabel);
    if (label) {
      const distance = Math.sqrt(
        Math.pow(x - label.correctX, 2) + Math.pow(y - label.correctY, 2)
      );

      if (distance < 5) { // Within 5% tolerance
        setCorrectLabels(new Set([...correctLabels, draggedLabel]));
      } else {
        // Remove from correct if it was there
        const newCorrect = new Set(correctLabels);
        newCorrect.delete(draggedLabel);
        setCorrectLabels(newCorrect);
      }
    }

    setDraggedLabel(null);
  };

  const removeLabel = (labelId: string) => {
    const newPlaced = new Map(placedLabels);
    newPlaced.delete(labelId);
    setPlacedLabels(newPlaced);

    const newCorrect = new Set(correctLabels);
    newCorrect.delete(labelId);
    setCorrectLabels(newCorrect);
  };

  const checkAnswers = () => {
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 3000);
  };

  const reset = () => {
    setPlacedLabels(new Map());
    setCorrectLabels(new Set());
    setShowFeedback(false);
    setIsComplete(false);
  };

  const showHints = () => {
    const newPlaced = new Map<string, { x: number; y: number }>();
    labels.forEach(label => {
      // Place labels near their correct positions with some random offset
      const offsetX = (Math.random() - 0.5) * 10;
      const offsetY = (Math.random() - 0.5) * 10;
      newPlaced.set(label.id, {
        x: label.correctX + offsetX,
        y: label.correctY + offsetY
      });
    });
    setPlacedLabels(newPlaced);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-emerald-600 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">
            📍 {title || 'Подписанная диаграмма'}
          </h1>
          <div className="flex justify-between items-center">
            <span>
              Правильно размещено: {correctLabels.size}/{labels.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={showHints}
                className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30"
              >
                💡 Подсказка
              </button>
              <button
                onClick={checkAnswers}
                className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30"
              >
                ✓ Проверить
              </button>
              <button
                onClick={reset}
                className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30"
              >
                ↺ Сброс
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr,250px] gap-6">
          {/* Image Area */}
          <div className="bg-white rounded-2xl shadow-2xl p-4">
            <div
              ref={imageRef}
              className="relative bg-gray-100 rounded-lg overflow-hidden"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '500px'
              }}
            >
              {/* Placed Labels */}
              {Array.from(placedLabels.entries()).map(([labelId, position]) => {
                const label = labels.find(l => l.id === labelId);
                const isCorrect = correctLabels.has(labelId);

                return (
                  <div
                    key={labelId}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                      showFeedback
                        ? isCorrect
                          ? 'animate-pulse'
                          : 'animate-shake'
                        : ''
                    }`}
                    style={{
                      left: `${position.x}%`,
                      top: `${position.y}%`
                    }}
                  >
                    {/* Pin */}
                    <div className={`w-4 h-4 rounded-full ${
                      showFeedback
                        ? isCorrect
                          ? 'bg-green-500'
                          : 'bg-red-500'
                        : 'bg-blue-500'
                    } shadow-lg`} />

                    {/* Label */}
                    <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg ${
                      showFeedback
                        ? isCorrect
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-white text-gray-700 border border-gray-300'
                    }`}>
                      {label?.text}
                      <button
                        onClick={() => removeLabel(labelId)}
                        className="ml-2 text-xs hover:opacity-70"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Drop Zone Indicator */}
              {draggedLabel && (
                <div className="absolute inset-0 bg-blue-500/10 pointer-events-none flex items-center justify-center">
                  <p className="text-blue-600 font-medium">Отпустите здесь, чтобы разместить метку</p>
                </div>
              )}
            </div>
          </div>

          {/* Labels Panel */}
          <div className="bg-white rounded-2xl shadow-2xl p-4">
            <h3 className="font-bold text-lg mb-4">Перетащите метки:</h3>
            <div className="space-y-2">
              {labels.map(label => {
                const isPlaced = placedLabels.has(label.id);
                const isCorrect = correctLabels.has(label.id);

                return (
                  <div
                    key={label.id}
                    draggable={!isPlaced}
                    onDragStart={(e) => handleDragStart(e, label.id)}
                    className={`px-4 py-2 rounded-lg cursor-move transition-all ${
                      isPlaced
                        ? isCorrect
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{label.text}</span>
                      {isPlaced && (
                        <span className="text-xs">
                          {isCorrect ? '✓' : '📍'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Completion Message */}
        {isComplete && (
          <div className="mt-6 bg-white rounded-2xl shadow-2xl p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">🎉 Отлично!</h2>
            <p className="text-lg">Все метки размещены правильно!</p>
            <button
              onClick={reset}
              className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Попробовать снова
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translate(-50%, -50%) translateX(0); }
          25% { transform: translate(-50%, -50%) translateX(-5px); }
          75% { transform: translate(-50%, -50%) translateX(5px); }
        }
      `}</style>
    </div>
  );
}