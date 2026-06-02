'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export interface WheelSegment {
  id: number;
  label: string;
  color?: string;
}

interface RandomWheelProps {
  segments: WheelSegment[];
  onSelect?: (segment: WheelSegment) => void;
  animationDuration?: number;
}

const DEFAULT_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

export const RandomWheel: React.FC<RandomWheelProps> = ({
  segments,
  onSelect,
  animationDuration = 5000,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedSegment, setSelectedSegment] = useState<WheelSegment | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const segmentAngle = 360 / segments.length;

  useEffect(() => {
    drawWheel();
  }, [segments, rotation]);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Очистка
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Поворот
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    // Рисуем сегменты
    segments.forEach((segment, index) => {
      const startAngle = (index * segmentAngle * Math.PI) / 180;
      const endAngle = ((index + 1) * segmentAngle * Math.PI) / 180;
      const color = segment.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];

      // Сегмент
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Граница
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Текст
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + (endAngle - startAngle) / 2);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.fillText(segment.label, radius / 2, 5);
      ctx.restore();
    });

    ctx.restore();

    // Центральный круг
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();

    // Стрелка (указатель вверху)
    ctx.beginPath();
    ctx.moveTo(centerX - 15, 20);
    ctx.lineTo(centerX + 15, 20);
    ctx.lineTo(centerX, 50);
    ctx.closePath();
    ctx.fillStyle = '#FF0000';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedSegment(null);

    // Случайное количество оборотов + случайный угол
    const minRotation = 360 * 5; // минимум 5 оборотов
    const randomRotation = Math.random() * 360;
    const totalRotation = rotation + minRotation + randomRotation;

    // Анимация
    const startTime = Date.now();
    const initialRotation = rotation;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      // Easing функция (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = initialRotation + (totalRotation - initialRotation) * easeOut;

      setRotation(currentRotation % 360);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const finalRotation = currentRotation % 360;
        const selectedIndex = Math.floor(((360 - finalRotation) % 360) / segmentAngle);
        const selected = segments[selectedIndex];
        setSelectedSegment(selected);
        onSelect?.(selected);
      }
    };

    animate();
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Колесо фортуны
          </h2>
          <p className="text-gray-600">
            Нажмите кнопку, чтобы крутить колесо!
          </p>
        </div>

        {/* Canvas с колесом */}
        <div className="flex justify-center mb-6">
          <canvas
            ref={canvasRef}
            width={500}
            height={500}
            className="max-w-full"
          />
        </div>

        {/* Кнопка вращения */}
        <div className="text-center mb-6">
          <Button
            size="lg"
            onClick={spinWheel}
            disabled={isSpinning}
            className="px-8 py-4 text-xl"
          >
            {isSpinning ? 'Вращается...' : 'Крутить!'}
          </Button>
        </div>

        {/* Результат */}
        {selectedSegment && !isSpinning && (
          <div className="bg-green-100 border-2 border-green-500 rounded-lg p-6 text-center animate-bounce">
            <div className="text-2xl font-bold text-green-800 mb-2">
              Выпало:
            </div>
            <div className="text-4xl font-black text-green-900">
              {selectedSegment.label}
            </div>
          </div>
        )}

        {/* Список сегментов */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Варианты на колесе:
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {segments.map((segment, index) => (
              <div
                key={segment.id}
                className="flex items-center gap-2 p-2 rounded bg-gray-50"
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: segment.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
                  }}
                />
                <span className="text-sm">{segment.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
