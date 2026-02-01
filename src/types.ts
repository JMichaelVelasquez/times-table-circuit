export type Screen = 'home' | 'game' | 'results';

export interface Question {
  a: number;
  b: number;
  answer: number;
  options: number[];
}

export interface GameState {
  table: number;
  totalQuestions: number;
  currentIndex: number;
  questions: Question[];
  score: number;
  answered: boolean;
  selectedAnswer: number | null;
  isCorrect: boolean | null;
}
