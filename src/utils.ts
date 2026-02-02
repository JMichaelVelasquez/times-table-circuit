import type { Question } from './types';

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateWrongAnswers(correct: number, table: number): number[] {
  const wrongs = new Set<number>();

  // Nearby multiples of the table
  const nearby = [
    table * (Math.floor(correct / table) - 1),
    table * (Math.floor(correct / table) + 1),
    table * (Math.floor(correct / table) + 2),
    table * (Math.floor(correct / table) - 2),
  ].filter(n => n > 0 && n !== correct);

  // Off-by-one and off-by-table
  const offBy = [
    correct + 1,
    correct - 1,
    correct + table,
    correct - table,
    correct + 10,
    correct - 10,
  ].filter(n => n > 0 && n !== correct);

  // Random multiples of the table
  const randomMultiples = Array.from({ length: 12 }, (_, i) => table * (i + 1))
    .filter(n => n !== correct);

  const candidates = shuffle([...nearby, ...offBy, ...randomMultiples]);

  for (const c of candidates) {
    if (c > 0 && c !== correct && !wrongs.has(c)) {
      wrongs.add(c);
    }
    if (wrongs.size >= 3) break;
  }

  // Fallback if not enough unique wrongs
  let fallback = 2;
  while (wrongs.size < 3) {
    if (fallback !== correct && !wrongs.has(fallback)) {
      wrongs.add(fallback);
    }
    fallback++;
  }

  return Array.from(wrongs);
}

export function generateQuestions(tables: number[], count: number): Question[] {
  // Generate all possible questions for ALL selected tables
  const allQuestions: Question[] = [];
  for (const table of tables) {
    for (let i = 1; i <= 12; i++) {
      const answer = table * i;
      const wrongs = generateWrongAnswers(answer, table);
      allQuestions.push({
        a: table,
        b: i,
        answer,
        options: shuffle([answer, ...wrongs]),
      });
    }
  }

  // Shuffle and repeat to fill count
  let questions: Question[] = [];
  while (questions.length < count) {
    const shuffled = shuffle(allQuestions);
    questions = [...questions, ...shuffled];
  }

  return questions.slice(0, count);
}

export function getEncouragement(score: number, total: number): {
  message: string;
  emoji: string;
  subMessage: string;
} {
  const pct = (score / total) * 100;
  if (pct === 100) return { message: 'PERFECT CIRCUIT!', emoji: '⚡🏆⚡', subMessage: 'Every connection was spot on! You\'re an electrical genius!' };
  if (pct >= 80) return { message: 'SUPER CHARGED!', emoji: '🌟⚡🌟', subMessage: 'Almost perfect! Your circuits are blazing!' };
  if (pct >= 60) return { message: 'POWERED UP!', emoji: '💡✨', subMessage: 'Great work! Keep practising to power up even more!' };
  if (pct >= 40) return { message: 'GETTING BRIGHTER!', emoji: '💡', subMessage: 'Nice try! A few more goes and you\'ll light up every bulb!' };
  return { message: 'KEEP SPARKING!', emoji: '✨', subMessage: 'Every wrong answer teaches you something! Try again!' };
}
