import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEncouragement } from '../utils';
import { VersionTag } from './VersionTag';

interface ResultsScreenProps {
  score: number;
  total: number;
  tables: number[];
}

interface Confetto {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
}

export function ResultsScreen({ score, total, tables }: ResultsScreenProps) {
  const navigate = useNavigate();
  const [confetti, setConfetti] = useState<Confetto[]>([]);
  const { message, emoji, subMessage } = getEncouragement(score, total);
  const pct = Math.round((score / total) * 100);

  const tableLabel = tables.length === 1
    ? `${tables[0]}× Table`
    : tables.length <= 3
      ? `${tables.join(', ')}× Tables`
      : `${tables.length} Tables Mixed`;

  useEffect(() => {
    if (pct >= 60) {
      const pieces: Confetto[] = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#8b5cf6', '#ec4899'][
          Math.floor(Math.random() * 7)
        ],
        delay: Math.random() * 2,
        size: 6 + Math.random() * 10,
      }));
      setConfetti(pieces);
    }
  }, [pct]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      <VersionTag />

      {/* Confetti */}
      {confetti.map((c) => (
        <div
          key={c.id}
          className="absolute top-0 animate-confetti rounded-sm pointer-events-none"
          style={{
            left: `${c.x}%`,
            width: `${c.size}px`,
            height: `${c.size}px`,
            backgroundColor: c.color,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}

      {/* Emoji */}
      <div className="relative z-10 text-5xl md:text-7xl mb-4 animate-float">
        {emoji}
      </div>

      {/* Title */}
      <h1 className="relative z-10 text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-green-400 to-cyan-400 text-center mb-2 animate-celebrate">
        {message}
      </h1>

      <p className="relative z-10 text-cyan-200/70 text-center text-lg mb-8 max-w-sm">
        {subMessage}
      </p>

      {/* Score card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10 mb-8 text-center w-full max-w-sm">
        <div className="text-cyan-300/60 text-sm font-medium mb-2">{tableLabel}</div>

        <div className="text-6xl md:text-7xl font-extrabold text-white mb-2">
          {score}<span className="text-3xl text-cyan-300/50">/{total}</span>
        </div>

        <div className="text-2xl font-bold text-yellow-400 mb-4">
          {pct}%
        </div>

        {/* Score bar */}
        <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              pct >= 80
                ? 'bg-gradient-to-r from-green-400 to-emerald-400'
                : pct >= 60
                  ? 'bg-gradient-to-r from-yellow-400 to-green-400'
                  : pct >= 40
                    ? 'bg-gradient-to-r from-orange-400 to-yellow-400'
                    : 'bg-gradient-to-r from-red-400 to-orange-400'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-2 mt-4">
          {[20, 40, 60, 80, 100].map((threshold) => (
            <span
              key={threshold}
              className={`text-3xl transition-all duration-300 ${
                pct >= threshold ? 'opacity-100 scale-100' : 'opacity-20 scale-75'
              }`}
            >
              ⭐
            </span>
          ))}
        </div>
      </div>

      {/* Bulb visualization */}
      <svg viewBox="0 0 80 100" className="relative z-10 w-16 mb-6 mx-auto">
        <circle
          cx="40"
          cy="36"
          r="28"
          fill={pct >= 60 ? '#fbbf24' : '#374151'}
          stroke={pct >= 60 ? '#f59e0b' : '#6b7280'}
          strokeWidth="3"
          className={pct >= 60 ? 'animate-glow-pulse' : ''}
        />
        <path
          d="M 32 36 Q 36 20 40 36 Q 44 52 48 36"
          fill="none"
          stroke={pct >= 60 ? '#fff' : '#6b7280'}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect x="32" y="62" width="16" height="14" rx="3" fill="#6b7280" />
        <rect x="34" y="58" width="12" height="6" rx="2" fill="#9ca3af" />
        {pct >= 60 && (
          <>
            <line x1="8" y1="36" x2="14" y2="36" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
            <line x1="66" y1="36" x2="72" y2="36" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
            <line x1="40" y1="4" x2="40" y2="10" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
            <line x1="16" y1="14" x2="20" y2="18" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
            <line x1="64" y1="14" x2="60" y2="18" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          </>
        )}
      </svg>

      {/* Action buttons */}
      <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <button
          onClick={() => navigate('/play')}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg py-4 px-6 rounded-2xl
            hover:from-green-400 hover:to-emerald-500 transform hover:scale-105 active:scale-95 transition-all shadow-lg border-2 border-white/20"
        >
          🔄 Play Again
        </button>
        <button
          onClick={() => navigate('/setup')}
          className="flex-1 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-bold text-lg py-4 px-6 rounded-2xl
            hover:from-purple-400 hover:to-violet-500 transform hover:scale-105 active:scale-95 transition-all shadow-lg border-2 border-white/20"
        >
          ⚙️ New Setup
        </button>
      </div>
    </div>
  );
}
