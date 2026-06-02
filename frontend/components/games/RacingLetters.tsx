'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameResult } from '@/lib/types';

interface RacingLettersProps {
  targetLetters?: string[];
  goalCount?: number;
  onComplete?: (result: GameResult) => void;
}

interface Letter {
  el: HTMLDivElement;
  x: number;
  y: number;
  letter: string;
  hit: boolean;
  wobble: number;
}

export const RacingLetters: React.FC<RacingLettersProps> = ({
  targetLetters = ['b', 'd'],
  goalCount = 10,
  onComplete
}) => {
  const roadRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const musicTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lettersRef = useRef<Letter[]>([]);
  const keysRef = useRef<Set<string>>(new Set());

  const [targetLetter, setTargetLetter] = useState(targetLetters[0]);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [running, setRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showWinOverlay, setShowWinOverlay] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastBad, setToastBad] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const gameStateRef = useRef({
    lastTime: 0,
    spawnTimer: 0,
    speed: 210,
    carX: 0.5,
    carY: 0.79,
    vx: 0,
    vy: 0,
    musicStep: 0,
    startTime: Date.now()
  });

  // Initialize audio context
  const unlockAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  // Sound effects
  const beep = useCallback((freq = 440, duration = 0.08, type: OscillatorType = 'sine', volume = 0.05) => {
    if (!soundEnabled || !audioCtxRef.current) return;

    try {
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
      gain.gain.linearRampToValueAtTime(volume, audioCtxRef.current.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      osc.stop(audioCtxRef.current.currentTime + duration + 0.02);
    } catch (e) {
      console.log('Audio not supported');
    }
  }, [soundEnabled]);

  const correctSound = useCallback(() => {
    beep(660, 0.08, 'triangle', 0.055);
    setTimeout(() => beep(880, 0.09, 'triangle', 0.05), 75);
  }, [beep]);

  const wrongSound = useCallback(() => {
    beep(190, 0.13, 'sawtooth', 0.04);
    setTimeout(() => beep(130, 0.13, 'sawtooth', 0.035), 80);
  }, [beep]);

  const winSound = useCallback(() => {
    const notes = [523, 659, 784, 1046];
    notes.forEach((n, i) => setTimeout(() => beep(n, 0.16, 'triangle', 0.06), i * 115));
  }, [beep]);

  // Background music
  const startMusic = useCallback(() => {
    if (!soundEnabled || musicTimerRef.current) return;
    unlockAudio();

    const notes = [262, 330, 392, 330, 294, 349, 440, 349];
    musicTimerRef.current = setInterval(() => {
      if (!soundEnabled || gameOver) return;
      const note = notes[gameStateRef.current.musicStep % notes.length];
      beep(note, 0.07, 'square', 0.018);
      if (gameStateRef.current.musicStep % 2 === 0) {
        beep(note / 2, 0.06, 'triangle', 0.012);
      }
      gameStateRef.current.musicStep++;
    }, 230);
  }, [soundEnabled, gameOver, beep, unlockAudio]);

  const stopMusic = useCallback(() => {
    if (musicTimerRef.current) {
      clearInterval(musicTimerRef.current);
      musicTimerRef.current = null;
    }
  }, []);

  // Show toast notification
  const showToastMessage = useCallback((text: string, bad = false) => {
    setToastMessage(text);
    setToastBad(bad);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 750);
  }, []);

  // Initialize grass dots
  const initGrass = useCallback(() => {
    if (!roadRef.current) return;

    for (let i = 0; i < 24; i++) {
      const dot = document.createElement('div');
      dot.className = 'grass-dot';
      const side = Math.random() < 0.5 ? Math.random() * 8 + 1 : Math.random() * 8 + 91;
      dot.style.setProperty('--x', side + '%');
      dot.style.setProperty('--y', (Math.random() * 100) + '%');
      dot.style.setProperty('--speed', (1.8 + Math.random() * 2.4) + 's');
      roadRef.current.appendChild(dot);
    }
  }, []);

  // Update car position
  const updateCarPosition = useCallback(() => {
    if (!carRef.current || !roadRef.current) return;

    const rect = roadRef.current.getBoundingClientRect();
    const laneMin = rect.width * 0.16;
    const laneMax = rect.width * 0.84;
    const x = laneMin + (laneMax - laneMin) * gameStateRef.current.carX;
    const y = rect.height * gameStateRef.current.carY;
    carRef.current.style.left = x + 'px';
    carRef.current.style.top = y + 'px';
  }, []);

  // Spawn a new letter
  const spawnLetter = useCallback(() => {
    if (gameOver || !running || !roadRef.current) return;

    const rect = roadRef.current.getBoundingClientRect();
    const safeLeft = rect.width * 0.18;
    const safeRight = rect.width * 0.82;
    const letter = Math.random() < 0.55 ? targetLetter : (targetLetter === 'b' ? 'd' : 'b');

    const el = document.createElement('div');
    el.className = 'letter ' + (letter === targetLetter ? 'good' : 'bad');
    el.textContent = letter;
    const x = safeLeft + Math.random() * (safeRight - safeLeft - 58);
    const y = -70;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    roadRef.current.appendChild(el);

    lettersRef.current.push({ el, x, y, letter, hit: false, wobble: Math.random() * Math.PI * 2 });
  }, [gameOver, running, targetLetter]);

  // Create sparkle effect
  const sparkle = useCallback((x: number, y: number) => {
    if (!roadRef.current) return;

    for (let i = 0; i < 10; i++) {
      const s = document.createElement('div');
      s.className = 'spark';
      s.style.left = x + 'px';
      s.style.top = y + 'px';
      const angle = Math.random() * Math.PI * 2;
      const dist = 28 + Math.random() * 54;
      s.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
      s.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
      roadRef.current.appendChild(s);
      setTimeout(() => s.remove(), 650);
    }
  }, []);

  // Create smoke effect
  const smoke = useCallback((x: number, y: number) => {
    if (!roadRef.current) return;

    const cloud = document.createElement('div');
    cloud.className = 'wrong-cloud';
    cloud.style.left = x + 'px';
    cloud.style.top = y + 'px';
    roadRef.current.appendChild(cloud);
    setTimeout(() => cloud.remove(), 700);
  }, []);

  // Check collision
  const intersects = useCallback((a: DOMRect, b: DOMRect) => {
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
  }, []);

  // Handle letter hit
  const handleHit = useCallback((item: Letter) => {
    if (!roadRef.current || !carRef.current) return;

    item.hit = true;
    const rect = roadRef.current.getBoundingClientRect();
    const itemRect = item.el.getBoundingClientRect();
    const localX = itemRect.left - rect.left + itemRect.width / 2;
    const localY = itemRect.top - rect.top + itemRect.height / 2;

    item.el.classList.add('pop');
    setTimeout(() => item.el.remove(), 230);

    if (item.letter === targetLetter) {
      const newScore = Math.min(goalCount, score + 1);
      setScore(newScore);
      showToastMessage('+1 правильная буква!');
      sparkle(localX, localY);
      correctSound();
      gameStateRef.current.speed = Math.min(290, gameStateRef.current.speed + 7);

      if (newScore >= goalCount) {
        finishGame();
      }
    } else {
      const newMistakes = mistakes + 1;
      const newScore = Math.max(0, score - 1);
      setMistakes(newMistakes);
      setScore(newScore);
      showToastMessage('−1 балл! Не та буква', true);
      smoke(localX, localY);
      wrongSound();
      carRef.current.classList.remove('bump');
      void carRef.current.offsetWidth;
      carRef.current.classList.add('bump');
      gameStateRef.current.carX = Math.min(0.98, Math.max(0.02, gameStateRef.current.carX + (Math.random() < 0.5 ? -0.08 : 0.08)));
    }
  }, [targetLetter, score, mistakes, goalCount, showToastMessage, sparkle, smoke, correctSound, wrongSound]);

  // Finish game
  const finishGame = useCallback(() => {
    setGameOver(true);
    setRunning(false);
    setShowWinOverlay(true);
    stopMusic();
    winSound();

    // Create celebration sparkles
    if (roadRef.current) {
      for (let i = 0; i < 40; i++) {
        setTimeout(() => {
          const rect = roadRef.current!.getBoundingClientRect();
          sparkle(Math.random() * rect.width, Math.random() * rect.height * 0.65);
        }, i * 32);
      }
    }

    // Report game completion
    if (onComplete) {
      const timeSpent = Math.floor((Date.now() - gameStateRef.current.startTime) / 1000);
      onComplete({
        score,
        completed: true,
        timeSpent,
        accuracy: score > 0 ? ((score / (score + mistakes)) * 100) : 0,
        mistakes,
        customData: {
          targetLetter,
          totalCollected: score,
          gameType: 'racing_letters'
        }
      });
    }
  }, [score, mistakes, targetLetter, onComplete, sparkle, stopMusic, winSound]);

  // Game loop
  const gameLoop = useCallback((now: number) => {
    const dt = Math.min(0.033, (now - gameStateRef.current.lastTime) / 1000 || 0);
    gameStateRef.current.lastTime = now;

    if (running && !gameOver && carRef.current && roadRef.current) {
      // Handle input
      const left = keysRef.current.has('ArrowLeft') || keysRef.current.has('a') || keysRef.current.has('A');
      const right = keysRef.current.has('ArrowRight') || keysRef.current.has('d') || keysRef.current.has('D');
      const up = keysRef.current.has('ArrowUp') || keysRef.current.has('w') || keysRef.current.has('W');
      const down = keysRef.current.has('ArrowDown') || keysRef.current.has('s') || keysRef.current.has('S');

      gameStateRef.current.vx = 0;
      gameStateRef.current.vy = 0;
      if (left) gameStateRef.current.vx -= 1;
      if (right) gameStateRef.current.vx += 1;
      if (up) gameStateRef.current.vy -= 1;
      if (down) gameStateRef.current.vy += 1;

      gameStateRef.current.carX = Math.min(1, Math.max(0, gameStateRef.current.carX + gameStateRef.current.vx * dt * 1.55));
      gameStateRef.current.carY = Math.min(0.88, Math.max(0.58, gameStateRef.current.carY + gameStateRef.current.vy * dt * 0.75));
      updateCarPosition();

      // Spawn letters
      gameStateRef.current.spawnTimer -= dt;
      if (gameStateRef.current.spawnTimer <= 0) {
        spawnLetter();
        gameStateRef.current.spawnTimer = Math.max(0.62, 1.12 - score * 0.035);
      }

      // Update letters
      const carRect = carRef.current.getBoundingClientRect();
      const roadRect = roadRef.current.getBoundingClientRect();

      lettersRef.current = lettersRef.current.filter(item => {
        if (item.hit) return false;

        item.y += gameStateRef.current.speed * dt;
        item.wobble += dt * 3.2;
        const wobbleX = Math.sin(item.wobble) * 6;
        item.el.style.transform = `translateX(${wobbleX}px)`;
        item.el.style.top = item.y + 'px';

        const itemRect = item.el.getBoundingClientRect();
        if (intersects(carRect, itemRect)) {
          handleHit(item);
          return false;
        }
        if (itemRect.top > roadRect.bottom + 80) {
          item.el.remove();
          return false;
        }
        return true;
      });
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [running, gameOver, score, updateCarPosition, spawnLetter, intersects, handleHit]);

  // Start/restart game
  const restartGame = useCallback((keepTarget = true) => {
    setScore(0);
    setMistakes(0);
    setGameOver(false);
    setRunning(true);
    setShowWinOverlay(false);

    gameStateRef.current = {
      lastTime: performance.now(),
      spawnTimer: 0,
      speed: 210,
      carX: 0.5,
      carY: 0.79,
      vx: 0,
      vy: 0,
      musicStep: 0,
      startTime: Date.now()
    };

    // Clear existing letters
    lettersRef.current.forEach(item => item.el.remove());
    lettersRef.current = [];

    if (carRef.current) {
      carRef.current.classList.remove('bump');
    }

    updateCarPosition();

    if (soundEnabled) {
      startMusic();
    }
  }, [soundEnabled, startMusic, updateCarPosition]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if ((e.key === 'b' || e.key === 'B') && targetLetters.includes('b')) {
        setTargetLetter('b');
      }
      if ((e.key === 'd' || e.key === 'D') && targetLetters.includes('d')) {
        setTargetLetter('d');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [targetLetters]);

  // Initialize game and start loop - runs only once on mount
  useEffect(() => {
    initGrass();

    // Start game immediately
    setRunning(true);
    setScore(0);
    setMistakes(0);
    setGameOver(false);
    setShowWinOverlay(false);

    gameStateRef.current = {
      lastTime: performance.now(),
      spawnTimer: 0,
      speed: 210,
      carX: 0.5,
      carY: 0.79,
      vx: 0,
      vy: 0,
      musicStep: 0,
      startTime: Date.now()
    };

    updateCarPosition();

    // Start game loop
    const loop = (now: number) => {
      const dt = Math.min(0.033, (now - gameStateRef.current.lastTime) / 1000 || 0);
      gameStateRef.current.lastTime = now;

      if (running && !gameOver && carRef.current && roadRef.current) {
        // Handle input
        const left = keysRef.current.has('ArrowLeft') || keysRef.current.has('a') || keysRef.current.has('A');
        const right = keysRef.current.has('ArrowRight') || keysRef.current.has('d') || keysRef.current.has('D');
        const up = keysRef.current.has('ArrowUp') || keysRef.current.has('w') || keysRef.current.has('W');
        const down = keysRef.current.has('ArrowDown') || keysRef.current.has('s') || keysRef.current.has('S');

        gameStateRef.current.vx = 0;
        gameStateRef.current.vy = 0;
        if (left) gameStateRef.current.vx -= 1;
        if (right) gameStateRef.current.vx += 1;
        if (up) gameStateRef.current.vy -= 1;
        if (down) gameStateRef.current.vy += 1;

        gameStateRef.current.carX = Math.min(1, Math.max(0, gameStateRef.current.carX + gameStateRef.current.vx * dt * 1.55));
        gameStateRef.current.carY = Math.min(0.88, Math.max(0.58, gameStateRef.current.carY + gameStateRef.current.vy * dt * 0.75));
        updateCarPosition();

        // Spawn letters
        gameStateRef.current.spawnTimer -= dt;
        if (gameStateRef.current.spawnTimer <= 0) {
          spawnLetter();
          gameStateRef.current.spawnTimer = Math.max(0.62, 1.12 - score * 0.035);
        }

        // Update letters
        const carRect = carRef.current.getBoundingClientRect();
        const roadRect = roadRef.current.getBoundingClientRect();

        lettersRef.current = lettersRef.current.filter(item => {
          if (item.hit) return false;

          item.y += gameStateRef.current.speed * dt;
          item.wobble += dt * 3.2;
          const wobbleX = Math.sin(item.wobble) * 6;
          item.el.style.transform = `translateX(${wobbleX}px)`;
          item.el.style.top = item.y + 'px';

          const itemRect = item.el.getBoundingClientRect();
          if (intersects(carRect, itemRect)) {
            handleHit(item);
            return false;
          }
          if (itemRect.top > roadRect.bottom + 80) {
            item.el.remove();
            return false;
          }
          return true;
        });
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      stopMusic();
      lettersRef.current.forEach(item => item.el.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => updateCarPosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateCarPosition]);

  // Mobile controls
  const handleMobileControl = (direction: 'left' | 'right', pressed: boolean) => {
    if (pressed) {
      keysRef.current.add(direction === 'left' ? 'ArrowLeft' : 'ArrowRight');
      setRunning(true);
    } else {
      keysRef.current.delete(direction === 'left' ? 'ArrowLeft' : 'ArrowRight');
    }
  };

  return (
    <div className="racing-letters-game">
      <style jsx>{`
        .racing-letters-game {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .app {
          width: 100%;
          max-width: 1200px;
          height: 90vh;
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 20px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 32px;
          padding: 20px;
        }

        .panel {
          background: white;
          border-radius: 24px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .game-wrap {
          position: relative;
          height: 100%;
        }

        .road {
          position: relative;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, #374151, #1f2937);
          border-radius: 32px;
          overflow: hidden;
          border: 4px solid #111827;
        }

        .road::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 6px;
          background: repeating-linear-gradient(
            to bottom,
            #fbbf24 0,
            #fbbf24 40px,
            transparent 40px,
            transparent 80px
          );
          transform: translateX(-50%);
          animation: roadScroll 1s linear infinite;
        }

        @keyframes roadScroll {
          from { transform: translateX(-50%) translateY(0); }
          to { transform: translateX(-50%) translateY(80px); }
        }

        .grass-dot {
          position: absolute;
          width: 3px;
          height: 3px;
          background: #86efac;
          border-radius: 50%;
          left: var(--x);
          top: var(--y);
          animation: grassMove var(--speed) linear infinite;
        }

        @keyframes grassMove {
          from { transform: translateY(0); }
          to { transform: translateY(calc(100vh + 10px)); }
        }

        .car {
          position: absolute;
          width: 90px;
          height: 140px;
          z-index: 20;
          transition: left 0.08s ease-out, top 0.08s ease-out;
        }

        .car.bump {
          animation: carBump 0.3s ease-out;
        }

        @keyframes carBump {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }

        .car-body {
          position: absolute;
          left: 11px;
          top: 10px;
          width: 68px;
          height: 120px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border-radius: 22px 22px 18px 18px;
          border: 3px solid #991b1b;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
        }

        .car-body::before {
          content: "";
          position: absolute;
          left: 6px;
          right: 6px;
          top: 18px;
          height: 32px;
          background: linear-gradient(to bottom, #60a5fa, #3b82f6);
          border-radius: 12px 12px 6px 6px;
          border: 2px solid #1e40af;
        }

        .car-body::after {
          content: "";
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: 12px;
          height: 22px;
          background: linear-gradient(to bottom, #60a5fa, #3b82f6);
          border-radius: 6px;
          border: 2px solid #1e40af;
        }

        .headlight {
          position: absolute;
          width: 18px;
          height: 18px;
          bottom: -16px;
          background: radial-gradient(circle, #fef3c7, #fbbf24);
          border-radius: 50%;
          border: 2px solid #92400e;
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.6);
        }

        .headlight.left { left: 12px; }
        .headlight.right { right: 12px; }

        .wheel {
          position: absolute;
          width: 22px;
          height: 32px;
          background: #1f2937;
          border-radius: 50%;
          border: 2px solid #111827;
          animation: wheelSpin 0.1s linear infinite;
        }

        .wheel.fl { left: 0; top: 20px; }
        .wheel.fr { right: 0; top: 20px; }
        .wheel.bl { left: 0; bottom: 16px; }
        .wheel.br { right: 0; bottom: 16px; }

        @keyframes wheelSpin {
          from { transform: translateY(-1px); }
          to { transform: translateY(1px); }
        }

        .letter {
          position: absolute;
          width: 64px;
          height: 64px;
          background: white;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          font-weight: bold;
          font-family: cursive;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          z-index: 15;
        }

        .letter.good {
          background: linear-gradient(135deg, #86efac, #22c55e);
          color: #14532d;
          border: 3px solid #16a34a;
        }

        .letter.bad {
          background: linear-gradient(135deg, #fca5a5, #ef4444);
          color: #7f1d1d;
          border: 3px solid #dc2626;
        }

        .letter.pop {
          animation: letterPop 0.3s ease-out forwards;
        }

        @keyframes letterPop {
          to {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .spark {
          position: absolute;
          z-index: 30;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          pointer-events: none;
          animation: sparkle 0.6s ease-out forwards;
          background: radial-gradient(circle, #fff 0 20%, #fde047 22% 45%, rgba(253, 224, 71, 0) 50%);
        }

        @keyframes sparkle {
          from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.4);
          }
          to {
            opacity: 0;
            transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1.8);
          }
        }

        .wrong-cloud {
          position: absolute;
          z-index: 30;
          width: 52px;
          height: 34px;
          border-radius: 50%;
          pointer-events: none;
          background: rgba(15, 23, 42, 0.35);
          filter: blur(0.2px);
          animation: smoke 0.65s ease-out forwards;
        }

        @keyframes smoke {
          from {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(0.5);
          }
          to {
            opacity: 0;
            transform: translate(-50%, -95%) scale(1.7);
          }
        }

        .toast {
          position: absolute;
          z-index: 45;
          left: 50%;
          top: 88px;
          transform: translateX(-50%);
          padding: 9px 14px;
          border-radius: 999px;
          font-weight: 950;
          color: white;
          background: rgba(34, 197, 94, 0.95);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);
          opacity: 0;
          pointer-events: none;
        }

        .toast.show {
          animation: toastAnim 0.75s ease forwards;
        }

        .toast.bad-msg {
          background: rgba(239, 68, 68, 0.96);
        }

        @keyframes toastAnim {
          0% {
            opacity: 0;
            transform: translate(-50%, 12px) scale(0.92);
          }
          15%, 78% {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -12px) scale(0.96);
          }
        }

        .win-overlay {
          position: absolute;
          inset: 0;
          z-index: 50;
          display: none;
          align-items: center;
          justify-content: center;
          padding: 26px;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(4px);
        }

        .win-overlay.show {
          display: flex;
        }

        .win-card {
          width: min(88%, 390px);
          border-radius: 32px;
          background: white;
          padding: 26px;
          text-align: center;
          border: 5px solid #fbbf24;
          box-shadow: 0 20px 55px rgba(0, 0, 0, 0.35);
          animation: winPop 0.38s cubic-bezier(0.22, 1.35, 0.36, 1) forwards;
        }

        @keyframes winPop {
          from {
            opacity: 0;
            transform: scale(0.72) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .mobile-controls {
          display: none;
          position: fixed;
          left: 50%;
          bottom: 16px;
          transform: translateX(-50%);
          z-index: 70;
          gap: 14px;
        }

        @media (max-width: 840px) {
          .app {
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr;
            height: 100vh;
            padding: 10px;
            gap: 10px;
          }

          .panel {
            padding: 11px;
            display: grid;
            grid-template-columns: 1fr 132px;
            gap: 8px;
          }

          .mobile-controls {
            display: flex;
          }
        }
      `}</style>

      <div className="app">
        <aside className="panel">
          <div>
            <h1 className="text-2xl font-bold mb-2">Гонки {targetLetters.join(' / ')}</h1>
            <p className="text-sm text-gray-600 mb-4">
              Рули машинкой и собирай только правильную букву. Цель — {goalCount} букв.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-purple-500 text-white p-4 rounded-xl">
            <div className="text-xs uppercase tracking-wide opacity-80 mb-1">Собираем букву</div>
            <div className="text-5xl font-bold">{targetLetter}</div>
          </div>

          <div className="flex gap-2">
            {targetLetters.map(letter => (
              <button
                key={letter}
                onClick={() => setTargetLetter(letter)}
                className={`flex-1 px-4 py-2 rounded-lg font-bold transition-all ${
                  targetLetter === letter
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Буква {letter}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-green-100 p-3 rounded-lg text-center">
              <span className="text-xs text-gray-600">Собрано</span>
              <strong className="block text-2xl">{score}</strong>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg text-center">
              <span className="text-xs text-gray-600">Цель</span>
              <strong className="block text-2xl">{goalCount}</strong>
            </div>
            <div className="bg-red-100 p-3 rounded-lg text-center">
              <span className="text-xs text-gray-600">Ошибки</span>
              <strong className="block text-2xl">{mistakes}</strong>
            </div>
          </div>

          <button
            onClick={() => {
              setRunning(true);
              unlockAudio();
              if (soundEnabled) {
                startMusic();
                beep(440, 0.08, 'triangle', 0.04);
              }
            }}
            className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
          >
            ▶ Старт / музыка
          </button>

          <button
            onClick={() => restartGame()}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
          >
            ↻ Начать заново
          </button>

          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) {
                unlockAudio();
                startMusic();
                beep(520, 0.08, 'triangle', 0.04);
              } else {
                stopMusic();
              }
            }}
            className="w-full px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors"
          >
            {soundEnabled ? '🔊' : '🔇'} Звук: {soundEnabled ? 'вкл' : 'выкл'}
          </button>

          <div className="text-xs text-gray-600">
            <b>Управление:</b><br/>
            ← / → или A / D — рулить<br/>
            ↑ / ↓ или W / S — скорость<br/>
            На телефоне — кнопки внизу
          </div>
        </aside>

        <main className="game-wrap">
          <section className="road" ref={roadRef}>
            <div className="finish-banner absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 px-6 py-3 rounded-full font-bold text-gray-800 z-10">
              Собери {goalCount} букв <span className="text-blue-600 text-xl ml-2">{targetLetter}</span>
            </div>

            <div className={`toast ${showToast ? 'show' : ''} ${toastBad ? 'bad-msg' : ''}`}>
              {toastMessage}
            </div>

            <div className="car" ref={carRef} aria-label="Машинка игрока">
              <div className="wheel fl"></div>
              <div className="wheel fr"></div>
              <div className="wheel bl"></div>
              <div className="wheel br"></div>
              <div className="car-body">
                <div className="headlight left"></div>
                <div className="headlight right"></div>
              </div>
            </div>

            <div className={`win-overlay ${showWinOverlay ? 'show' : ''}`}>
              <div className="win-card">
                <h2 className="text-3xl font-bold mb-4">Финиш! 🏁</h2>
                <p className="text-gray-600 mb-6">
                  Ты собрал(а) {goalCount} правильных букв!<br/>
                  Ошибок: {mistakes}
                </p>
                <button
                  onClick={() => restartGame()}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all"
                >
                  Играть ещё раз
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      <div className="mobile-controls">
        <button
          className="w-20 h-16 bg-gray-800/90 text-white text-3xl font-bold rounded-2xl shadow-lg"
          onPointerDown={() => handleMobileControl('left', true)}
          onPointerUp={() => handleMobileControl('left', false)}
          onPointerCancel={() => handleMobileControl('left', false)}
          onPointerLeave={() => handleMobileControl('left', false)}
        >
          ←
        </button>
        <button
          className="w-20 h-16 bg-gray-800/90 text-white text-3xl font-bold rounded-2xl shadow-lg"
          onPointerDown={() => handleMobileControl('right', true)}
          onPointerUp={() => handleMobileControl('right', false)}
          onPointerCancel={() => handleMobileControl('right', false)}
          onPointerLeave={() => handleMobileControl('right', false)}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default RacingLetters;