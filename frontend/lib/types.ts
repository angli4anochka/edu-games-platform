// Типы для всего приложения

export enum GameType {
  // Интерактивные механики (как в Wordwall)
  QUIZ = "quiz",
  MATCH_PAIRS = "match_pairs",
  CATEGORIZE = "categorize",
  FLASHCARDS = "flashcards",
  RANDOM_WHEEL = "random_wheel",
  ANAGRAM = "anagram",
  MISSING_WORD = "missing_word",
  TRUE_FALSE = "true_false",
  IMAGE_QUIZ = "image_quiz",
  WORD_SEARCH = "word_search",
  CROSSWORD = "crossword",
  MEMORY = "memory",
  HANGMAN = "hangman",
  MAZE_CHASE = "maze_chase",
  WORD_SNAKE = "word_snake",
}

export enum UserRole {
  STUDENT = "student",
  TEACHER = "teacher",
  ADMIN = "admin",
}

export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Game {
  id: number;
  name: string;
  slug: string;
  description?: string;
  game_type: GameType;
  config: Record<string, any>;
  thumbnail_url?: string;
  difficulty_levels: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: number;
  title: string;
  description?: string;
  game_id: number;
  creator_id: number;
  config: Record<string, any>;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface ActivityAssignment {
  id: number;
  activity_id: number;
  user_id: number;
  score?: number;
  completed: boolean;
  time_spent?: number;
  attempts: number;
  result_data: Record<string, any>;
  assigned_at: string;
  due_date?: string;
  completed_at?: string;
}

export interface GameResult {
  score: number;
  completed: boolean;
  timeSpent: number;
  accuracy?: number;
  mistakes?: number;
  details?: Record<string, any>;
  customData?: Record<string, any>;
}
