'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { GameResult } from '@/lib/types';

interface Task {
  topic: string;
  sentence: string;
  answer: string;
  options: string[];
  feedback: string;
}

interface BubbleGrammarProps {
  tasks?: Task[];
  onComplete?: (result: GameResult) => void;
}

const defaultTasks: Task[] = [
  {
    topic: "Present Simple",
    sentence: 'He ______ his teeth in the morning.',
    answer: "brushes",
    options: ["brushing", "are brushing", "brushes", "is brush"],
    feedback: "Да. He brushes. После he/she/it добавляем -s или -es."
  },
  {
    topic: "Present Continuous",
    sentence: 'Look! She ______ now.',
    answer: "is reading",
    options: ["reads", "is reading", "read", "reading"],
    feedback: "Верно: she is reading now. Now любит Continuous."
  },
  {
    topic: "Present Simple",
    sentence: 'They ______ football every Sunday.',
    answer: "play",
    options: ["plays", "are play", "play", "playing"],
    feedback: "Верно: they play. Для they без -s."
  },
  {
    topic: "Present Continuous",
    sentence: 'The cat ______ on the sofa right now.',
    answer: "is sleeping",
    options: ["sleeps", "sleep", "is sleeping", "are sleeping"],
    feedback: "Точно: the cat is sleeping."
  },
  {
    topic: "Present Simple",
    sentence: 'My sister ______ coffee every morning.',
    answer: "drinks",
    options: ["drink", "drinks", "is drinking", "drinking"],
    feedback: "Верно: my sister drinks. Sister = she, значит глагол получает -s."
  }
];

const bubblePositions = [
  {x: 18, y: 48}, {x: 37, y: 42}, {x: 61, y: 47}, {x: 82, y: 42},
  {x: 24, y: 72}, {x: 49, y: 69}, {x: 73, y: 73}, {x: 12, y: 82}
];

export const BubbleGrammar: React.FC<BubbleGrammarProps> = ({
  tasks = defaultTasks,
  onComplete
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [startTime] = useState(Date.now());

  const currentTask = tasks[currentIndex];

  // Shuffle function
  const shuffle = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  // Initialize shuffled options when task changes
  useEffect(() => {
    if (currentTask) {
      setShuffledOptions(shuffle(currentTask.options));
    }
  }, [currentIndex]);

  // Play sound effect
  const playPopSound = (isCorrect: boolean) => {
    try {
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(isCorrect ? 660 : 180, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(isCorrect ? 980 : 120, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.045, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.17);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const handleBubbleClick = (answer: string) => {
    if (isLocked) return;

    if (answer === currentTask.answer) {
      // Correct answer
      setIsLocked(true);
      setSelectedAnswer(answer);
      setScore(prev => prev + 10);
      setFeedback(currentTask.feedback);
      setShowFeedback(true);
      playPopSound(true);

      // Move to next task after delay
      setTimeout(() => {
        if (currentIndex + 1 >= tasks.length) {
          // Game over
          handleGameComplete();
        } else {
          // Next task
          setCurrentIndex(prev => prev + 1);
          setIsLocked(false);
          setSelectedAnswer(null);
          setShowFeedback(false);
        }
      }, 2000);
    } else {
      // Wrong answer
      setMistakes(prev => prev + 1);
      setScore(prev => Math.max(0, prev - 2));
      setFeedback('Неправильно! Попробуй ещё раз.');
      setShowFeedback(true);
      playPopSound(false);

      // Hide wrong feedback after a moment
      setTimeout(() => {
        setShowFeedback(false);
      }, 1500);
    }
  };

  const handleGameComplete = () => {
    setGameOver(true);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    if (onComplete) {
      onComplete({
        score,
        completed: true,
        timeSpent,
        accuracy: ((tasks.length - mistakes) / tasks.length) * 100,
        mistakes,
        customData: {
          totalTasks: tasks.length,
          correctAnswers: tasks.length,
          gameType: 'bubble_grammar'
        }
      });
    }
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setMistakes(0);
    setIsLocked(false);
    setSelectedAnswer(null);
    setFeedback('');
    setShowFeedback(false);
    setGameOver(false);
  };

  const getSentenceWithBlank = () => {
    if (!currentTask) return '';

    if (selectedAnswer) {
      return currentTask.sentence.replace('______', selectedAnswer);
    }
    return currentTask.sentence;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-4">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(2deg); }
          66% { transform: translateY(5px) rotate(-2deg); }
        }

        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(0); opacity: 0; }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px) rotate(-5deg); }
          75% { transform: translateX(10px) rotate(5deg); }
        }

        .bubble-float {
          animation: float 4s ease-in-out infinite;
        }

        .bubble-pop {
          animation: pop 0.5s ease-out forwards;
        }

        .bubble-shake {
          animation: shake 0.5s ease-out;
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="mb-6 bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  🫧 Bubble Grammar Pop
                </h1>
                <p className="text-white/70 mt-1">
                  Лопни пузырёк с правильным ответом
                </p>
              </div>
              <div className="flex gap-3">
                <div className="px-4 py-2 bg-white/20 rounded-full text-white">
                  Очки: {score}
                </div>
                <div className="px-4 py-2 bg-white/20 rounded-full text-white">
                  {currentIndex + 1} / {tasks.length}
                </div>
                <div className="px-4 py-2 bg-white/20 rounded-full text-white">
                  Ошибки: {mistakes}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Game Area */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Task Card */}
          <Card className="lg:col-span-2 bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-8">
              {!gameOver ? (
                <>
                  <div className="mb-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-white/80 text-sm mb-4">
                      🧠 {currentTask?.topic} · Задание {currentIndex + 1}
                    </span>

                    <h2 className="text-4xl font-bold text-white leading-tight">
                      {getSentenceWithBlank().split(' ').map((word, idx) => (
                        <span key={idx}>
                          {word === '______' || word === selectedAnswer ? (
                            <span className="inline-block min-w-[160px] border-b-4 border-yellow-400 text-yellow-400 px-2">
                              {word === '______' ? '______' : word}
                            </span>
                          ) : (
                            word
                          )}{' '}
                        </span>
                      ))}
                    </h2>
                  </div>

                  {/* Feedback */}
                  {showFeedback && (
                    <div className={`p-4 rounded-lg mb-6 ${
                      feedback.includes('Неправильно')
                        ? 'bg-red-500/20 border border-red-400'
                        : 'bg-green-500/20 border border-green-400'
                    }`}>
                      <p className="text-white">{feedback}</p>
                    </div>
                  )}

                  {/* Bubbles */}
                  <div className="relative h-96 bg-white/5 rounded-xl overflow-hidden">
                    {shuffledOptions.map((option, index) => {
                      const position = bubblePositions[index % bubblePositions.length];
                      const isSelected = selectedAnswer === option;
                      const isCorrect = option === currentTask.answer;

                      return (
                        <button
                          key={`${currentIndex}-${index}`}
                          onClick={() => handleBubbleClick(option)}
                          disabled={isLocked}
                          className={`
                            absolute w-32 h-32 rounded-full
                            flex items-center justify-center text-white font-bold text-lg
                            transition-all duration-300 cursor-pointer
                            bg-gradient-to-br from-blue-400/60 via-purple-400/60 to-pink-400/60
                            backdrop-blur-sm border-2 border-white/40
                            hover:scale-110 hover:border-white/60
                            ${isSelected && isCorrect ? 'bubble-pop' : ''}
                            ${isSelected && !isCorrect ? 'bubble-shake' : ''}
                            ${!isSelected && !isLocked ? 'bubble-float' : ''}
                          `}
                          style={{
                            left: `${position.x}%`,
                            top: `${position.y}%`,
                            transform: 'translate(-50%, -50%)',
                            animationDelay: `${index * -0.55}s`
                          }}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-white/60 text-center mt-4">
                    Нажми на пузырёк с правильным ответом
                  </p>
                </>
              ) : (
                /* Game Over Screen */
                <div className="text-center py-12">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Урок завершён! 🎉
                  </h2>
                  <p className="text-xl text-white/80 mb-8">
                    Ты набрал(а) {score} очков.<br/>
                    Ошибок: {mistakes}<br/>
                    Точность: {Math.round(((tasks.length - mistakes) / tasks.length) * 100)}%
                  </p>
                  <Button
                    onClick={restartGame}
                    variant="primary"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  >
                    Играть снова
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Side Panel */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">
                  {gameOver ? '🏆' : '🐳'}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Прогресс
                </h3>
              </div>

              <div className="space-y-4">
                {tasks.map((task, index) => (
                  <div
                    key={index}
                    className={`
                      p-3 rounded-lg transition-all
                      ${index === currentIndex
                        ? 'bg-yellow-400/30 border border-yellow-400'
                        : index < currentIndex
                        ? 'bg-green-400/20 border border-green-400/50'
                        : 'bg-white/10 border border-white/20'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">
                        Задание {index + 1}
                      </span>
                      {index < currentIndex && (
                        <span className="text-green-400">✓</span>
                      )}
                      {index === currentIndex && (
                        <span className="text-yellow-400">●</span>
                      )}
                    </div>
                    <span className="text-white/60 text-sm">{task.topic}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-white/20">
                <Button
                  onClick={restartGame}
                  variant="secondary"
                  className="w-full bg-white/20 text-white hover:bg-white/30"
                >
                  Начать заново
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BubbleGrammar;