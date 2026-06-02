import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { Game, GameType } from '@/lib/types';

interface GameCardProps {
  game: Game;
}

const gameTypeLabels: Record<GameType, string> = {
  [GameType.QUIZ]: 'Викторина',
  [GameType.MATCH_PAIRS]: 'Сопоставление',
  [GameType.CATEGORIZE]: 'Категории',
  [GameType.FLASHCARDS]: 'Карточки',
  [GameType.RANDOM_WHEEL]: 'Колесо фортуны',
  [GameType.ANAGRAM]: 'Анаграммы',
  [GameType.MISSING_WORD]: 'Пропущенные слова',
  [GameType.TRUE_FALSE]: 'Правда/Ложь',
  [GameType.IMAGE_QUIZ]: 'Картинки',
  [GameType.WORD_SEARCH]: 'Поиск слов',
  [GameType.CROSSWORD]: 'Кроссворд',
  [GameType.MEMORY]: 'Мемори',
  [GameType.HANGMAN]: 'Виселица',
  [GameType.MAZE_CHASE]: 'Погоня',
  [GameType.WORD_SNAKE]: 'Змейка слов',
};

const gameTypeColors: Record<GameType, 'info' | 'success' | 'warning' | 'danger' | 'default'> = {
  [GameType.QUIZ]: 'info',
  [GameType.MATCH_PAIRS]: 'success',
  [GameType.CATEGORIZE]: 'warning',
  [GameType.FLASHCARDS]: 'info',
  [GameType.RANDOM_WHEEL]: 'danger',
  [GameType.ANAGRAM]: 'success',
  [GameType.MISSING_WORD]: 'warning',
  [GameType.TRUE_FALSE]: 'info',
  [GameType.IMAGE_QUIZ]: 'success',
  [GameType.WORD_SEARCH]: 'warning',
  [GameType.CROSSWORD]: 'info',
  [GameType.MEMORY]: 'success',
  [GameType.HANGMAN]: 'danger',
  [GameType.MAZE_CHASE]: 'warning',
  [GameType.WORD_SNAKE]: 'success',
};

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  return (
    <Link href={`/games/${game.slug}`}>
      <Card hover className="h-full">
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <CardTitle>{game.name}</CardTitle>
            <Badge variant={gameTypeColors[game.game_type]}>
              {gameTypeLabels[game.game_type]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4 line-clamp-2">
            {game.description || 'Описание отсутствует'}
          </p>
          <div className="flex flex-wrap gap-2">
            {game.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="default">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
