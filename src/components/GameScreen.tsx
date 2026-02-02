import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { GameState } from '../types';
import { generateQuestions } from '../utils';
import { CircuitSVG } from './CircuitSVG';
import { VersionTag } from './VersionTag';

interface GameScreenProps {
  tables: number[];
  totalQuestions: number;
  timerSeconds: number;
  onFinish: (score: number, total: number) => void;
}

const OPTION_COLOURS = [
  'from-purple-500 to-purple-700 hover:from-purple-400 hover:to-purple-600',
  'from-cyan-500 to-cyan-700 hover:from-cyan-400 hover:to-cyan-600',
  'from-orange-500 to-orange-700 hover:from-orange-400 hover:to-orange-600',
  'from-pink-500 to-pink-700 hover:from-pink-400 hover:to-pink-600',
];

export function GameScreen({ tables, totalQuestions, timerSeconds, onFinish }: GameScreenProps) {
  const navigate = useNavigate();
  const [game, setGame] = useState<GameState>(() => ({
    tables,
    totalQuestions,
    currentIndex: 0,
    questions: generateQuestions(tables, totalQuestions),
    score: 0,
    answered: false,
    selectedAnswer: null,
    isCorrect: null,
  }));

  const [wrongKey, setWrongKey] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const answeredRef = useRef(false);

  const currentQuestion = game.questions[game.currentIndex];
  const progress = ((game.currentIndex) / game.totalQuestions) * 100;

  const handleAnswer = useCallback((answer: number) => {
    if (answeredRef.current) return;
    answeredRef.current = true;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const correct = answer === currentQuestion.answer;

    setGame(prev => ({
      ...prev,
      answered: true,
      selectedAnswer: answer,
      isCorrect: correct,
      score: correct ? prev.score + 1 : prev.score,
    }));

    if (!correct) {
      setWrongKey(k => k + 1);
    }
  }, [currentQuestion.answer]);

  const handleTimeUp = useCallback(() => {
    if (answeredRef.current) return;
    answeredRef.current = true;

    setGame(prev => ({
      ...prev,
      answered: true,
      selectedAnswer: null,
      isCorrect: false,
    }));
    setWrongKey(k => k + 1);
  }, []);

  const handleNext = useCallback(() => {
    const nextIndex = game.currentIndex + 1;

    if (nextIndex >= game.totalQuestions) {
      onFinish(game.score, game.totalQuestions);
      navigate('/results');
      return;
    }

    answeredRef.current = false;
    setGame(prev => ({
      ...prev,
      currentIndex: nextIndex,
      answered: false,
      selectedAnswer: null,
      isCorrect: null,
    }));
    setTimeLeft(timerSeconds);
  }, [game.currentIndex, game.totalQuestions, game.score, onFinish, navigate, timerSeconds]);

  // Countdown timer
  useEffect(() => {
    if (game.answered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [game.answered, game.currentIndex]);

  // Trigger time-up when timer hits 0
  useEffect(() => {
    if (timeLeft === 0 && !game.answered) {
      handleTimeUp();
    }
  }, [timeLeft, game.answered, handleTimeUp]);

  // Keyboard shortcuts: 1-4 to pick answer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = parseInt(e.key);
      if (key >= 1 && key <= 4 && !game.answered) {
        handleAnswer(currentQuestion.options[key - 1]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [game.answered, currentQuestion.options, handleAnswer]);

  // Auto-advance after correct answer
  useEffect(() => {
    if (game.isCorrect === true) {
      const timer = setTimeout(handleNext, 1500);
      return () => clearTimeout(timer);
    }
  }, [game.isCorrect, handleNext]);

  const getOptionStyle = (option: number, idx: number) => {
    if (!game.answered) {
      return `bg-gradient-to-br ${OPTION_COLOURS[idx]} border-white/20`;
    }

    if (option === currentQuestion.answer) {
      return 'bg-gradient-to-br from-green-400 to-green-600 border-green-300 shadow-green-400/50 shadow-lg';
    }

    if (option === game.selectedAnswer && !game.isCorrect) {
      return 'bg-gradient-to-br from-red-500 to-red-700 border-red-400 animate-zap';
    }

    return `bg-gradient-to-br ${OPTION_COLOURS[idx]} opacity-50 border-white/10`;
  };

  const tableLabel = tables.length === 1
    ? `${tables[0]}× Table`
    : tables.length <= 3
      ? `${tables.join(', ')}× Tables`
      : `${tables.length} Tables`;

  return (
    <div className="min-h-screen flex flex-col px-4 py-4 md:py-6 relative">
      <VersionTag />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/setup')}
          className="text-cyan-300/70 hover:text-cyan-200 text-sm font-medium flex items-center gap-1 transition-colors"
        >
          ← Back
        </button>

        {/* Countdown Timer */}
        <div className="relative flex items-center justify-center w-14 h-14">
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
            <circle
              cx="28" cy="28" r="24"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="4"
            />
            <circle
              cx="28" cy="28" r="24"
              fill="none"
              stroke={timeLeft <= 3 ? '#ef4444' : timeLeft <= 5 ? '#f59e0b' : '#22d3ee'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 24}
              strokeDashoffset={2 * Math.PI * 24 * (1 - timeLeft / timerSeconds)}
              className="transition-all duration-1000 linear"
            />
          </svg>
          <span className={`absolute text-lg font-extrabold ${
            timeLeft <= 3 ? 'text-red-400 animate-pulse' : timeLeft <= 5 ? 'text-amber-400' : 'text-cyan-200'
          }`}>
            {game.answered ? '—' : timeLeft}
          </span>
        </div>

        <div className="text-right">
          <div className="text-cyan-200/80 font-bold text-sm md:text-base">
            {tableLabel}
          </div>
          <div className="text-cyan-200/50 text-xs font-medium">
            {game.currentIndex + 1}/{game.totalQuestions}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 w-full bg-white/10 rounded-full h-3 mb-6 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-green-400 to-cyan-400 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Circuit visualization */}
      <div className="relative z-10 mb-4">
        <CircuitSVG
          isConnected={game.isCorrect === true}
          isWrong={game.isCorrect === false}
          key={`circuit-${game.currentIndex}-${wrongKey}`}
        />
      </div>

      {/* Question */}
      <div className="relative z-10 text-center mb-6">
        <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/10">
          <span className="text-3xl md:text-5xl font-extrabold text-white">
            {currentQuestion.a} × {currentQuestion.b} = <span className="text-yellow-400">?</span>
          </span>
        </div>
      </div>

      {/* Answer options */}
      <div className="relative z-10 grid grid-cols-2 gap-3 md:gap-4 max-w-md mx-auto w-full mb-6">
        {currentQuestion.options.map((option, idx) => (
          <button
            key={`${game.currentIndex}-${option}`}
            onPointerDown={() => handleAnswer(option)}
            disabled={game.answered}
            className={`
              ${getOptionStyle(option, idx)}
              text-white font-extrabold text-2xl md:text-3xl
              py-6 px-6 rounded-2xl
              border-2
              transform transition-all duration-150 touch-manipulation
              ${!game.answered ? 'hover:scale-105 active:scale-95 cursor-pointer' : 'cursor-default'}
              min-h-[80px] flex items-center justify-center select-none relative
            `}
          >
            <span className="absolute top-1 left-2 text-white/40 font-bold text-xs">{idx + 1}</span>
            {option}
            {game.answered && option === currentQuestion.answer && (
              <span className="ml-2">✓</span>
            )}
            {option === game.selectedAnswer && !game.isCorrect && (
              <span className="ml-2">✗</span>
            )}
          </button>
        ))}
      </div>

      {/* Feedback & next button */}
      <div className="relative z-10 text-center">
        {game.isCorrect === true && (
          <div className="animate-celebrate">
            <p className="text-green-400 font-extrabold text-2xl mb-2">⚡ Circuit Complete! ⚡</p>
            <p className="text-green-300/60 text-sm">Moving to next question...</p>
          </div>
        )}
        {game.isCorrect === false && (
          <div>
            <p className="text-red-400 font-bold text-xl mb-3">
              {game.selectedAnswer === null ? '⏰ Time\u2019s up!' : '💥 ZAP! That\u2019s not right!'}
            </p>
            <p className="text-cyan-200/60 text-sm mb-3">
              {currentQuestion.a} × {currentQuestion.b} = <span className="text-yellow-400 font-bold">{currentQuestion.answer}</span>
            </p>
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg py-3 px-8 rounded-xl
                hover:from-cyan-400 hover:to-blue-500 transform hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              Next Question →
            </button>
          </div>
        )}
      </div>

      {/* Score ticker */}
      <div className="relative z-10 mt-auto pt-4 text-center">
        <span className="text-cyan-300/50 text-sm">
          Score: <span className="text-yellow-400 font-bold">{game.score}</span> / {game.currentIndex + (game.answered ? 1 : 0)}
        </span>
      </div>
    </div>
  );
}
