export type Screen = 'mode' | 'signin' | 'home' | 'game' | 'results';

export type Mode = 'home' | 'school';

export interface UserAccount {
  username: string;
  passwordHash: string;
  mode: Mode;
  createdAt: number;
}

export interface Question {
  a: number;
  b: number;
  answer: number;
  options: number[];
}

export interface GameConfig {
  tables: number[];
  timerSeconds: number;
  questionCount: number;
}

export interface GameState {
  tables: number[];
  totalQuestions: number;
  currentIndex: number;
  questions: Question[];
  score: number;
  answered: boolean;
  selectedAnswer: number | null;
  isCorrect: boolean | null;
}
