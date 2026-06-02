'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { GameCard } from '@/components/GameCard';
import { Game, GameType } from '@/lib/types';
import { Button } from '@/components/ui/Button';

// Демо-данные игр (статичные)
const allGames: Game[] = [
  {
    id: 1,
    name: 'Викторина',
    slug: 'quiz',
    description: 'Классический тест с множественным выбором ответов',
    game_type: GameType.QUIZ,
    config: {},
    difficulty_levels: ['easy', 'medium', 'hard'],
    tags: ['тест', 'обучение'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Сопоставление пар',
    slug: 'match-pairs',
    description: 'Найди соответствия между элементами',
    game_type: GameType.MATCH_PAIRS,
    config: {},
    difficulty_levels: ['easy', 'medium', 'hard'],
    tags: ['сопоставление', 'память'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Колесо фортуны',
    slug: 'random-wheel',
    description: 'Случайный выбор с помощью колеса',
    game_type: GameType.RANDOM_WHEEL,
    config: {},
    difficulty_levels: ['easy'],
    tags: ['случайность', 'выбор'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Змейка слов',
    slug: 'word-snake',
    description: 'Собирай буквы в правильном порядке, управляя змейкой. Змейка растёт с каждой правильной буквой!',
    game_type: GameType.WORD_SNAKE,
    config: {
      default_word: 'APPLE',
      speed: 'medium',
      lives: 3,
    },
    difficulty_levels: ['easy', 'medium', 'hard'],
    tags: ['слова', 'аркада', 'змейка', 'буквы', 'реакция'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function GamesPage() {
  const [filter, setFilter] = useState<GameType | 'all'>('all');

  // Фильтрация игр
  const filteredGames = filter === 'all'
    ? allGames
    : allGames.filter(game => game.game_type === filter);

  const filterButtons = [
    { value: 'all' as const, label: 'Все игры' },
    { value: GameType.QUIZ, label: 'Викторины' },
    { value: GameType.MATCH_PAIRS, label: 'Сопоставление' },
    { value: GameType.RANDOM_WHEEL, label: 'Случайность' },
    { value: GameType.WORD_SNAKE, label: 'Аркады' },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Библиотека игр</h1>
        <p className="text-lg text-gray-600 mb-6">
          Выберите игру для создания образовательной активности
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((btn) => (
            <Button
              key={btn.value}
              variant={filter === btn.value ? 'primary' : 'outline'}
              onClick={() => setFilter(btn.value)}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </Layout>
  );
}
