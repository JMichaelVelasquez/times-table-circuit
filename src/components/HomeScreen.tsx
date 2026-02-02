import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { GameConfig } from '../types';
import { getSession, signOut } from '../store';
import { VersionTag } from './VersionTag';
import { SparkBackground } from './SparkBackground';

interface HomeScreenProps {
  onStart: (config: GameConfig) => void;
}

const ALL_TABLES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const TABLE_COLOURS: Record<number, string> = {
  2: 'from-red-500 to-red-600',
  3: 'from-orange-500 to-orange-600',
  4: 'from-amber-500 to-amber-600',
  5: 'from-yellow-500 to-yellow-600',
  6: 'from-lime-500 to-lime-600',
  7: 'from-green-500 to-green-600',
  8: 'from-emerald-500 to-emerald-600',
  9: 'from-cyan-500 to-cyan-600',
  10: 'from-blue-500 to-blue-600',
  11: 'from-violet-500 to-violet-600',
  12: 'from-purple-500 to-purple-600',
};

const TABLE_SELECTED_GLOW: Record<number, string> = {
  2: 'shadow-red-500/50 ring-red-400',
  3: 'shadow-orange-500/50 ring-orange-400',
  4: 'shadow-amber-500/50 ring-amber-400',
  5: 'shadow-yellow-500/50 ring-yellow-400',
  6: 'shadow-lime-500/50 ring-lime-400',
  7: 'shadow-green-500/50 ring-green-400',
  8: 'shadow-emerald-500/50 ring-emerald-400',
  9: 'shadow-cyan-500/50 ring-cyan-400',
  10: 'shadow-blue-500/50 ring-blue-400',
  11: 'shadow-violet-500/50 ring-violet-400',
  12: 'shadow-purple-500/50 ring-purple-400',
};

export function HomeScreen({ onStart }: HomeScreenProps) {
  const navigate = useNavigate();
  const session = getSession();
  const [selectedTables, setSelectedTables] = useState<number[]>([2, 5, 10]);
  const [questionCount, setQuestionCount] = useState(10);
  const [timerSeconds, setTimerSeconds] = useState(8);

  const allSelected = ALL_TABLES.every(t => selectedTables.includes(t));

  const toggleTable = (num: number) => {
    setSelectedTables(prev =>
      prev.includes(num) ? prev.filter(t => t !== num) : [...prev, num]
    );
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedTables([]);
    } else {
      setSelectedTables([...ALL_TABLES]);
    }
  };

  const handleStart = () => {
    if (selectedTables.length === 0) return;
    onStart({
      tables: selectedTables.sort((a, b) => a - b),
      timerSeconds,
      questionCount,
    });
    navigate('/play');
  };

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6 relative">
      <SparkBackground />
      <VersionTag />

      <div className="relative z-10 flex flex-col items-center w-full max-w-lg">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="text-white font-bold text-sm leading-tight">{session?.username}</p>
              <p className="text-cyan-300/40 text-xs">{session?.mode === 'home' ? '🏠 Home' : '🏫 School'}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="text-cyan-300/40 hover:text-cyan-300/70 text-xs font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            Sign Out
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-green-400 to-cyan-400 mb-1">
            ⚡ Game Setup ⚡
          </h1>
          <p className="text-cyan-200/50 text-sm font-medium">
            Configure your circuit challenge!
          </p>
        </div>

        {/* Timer Speed Selector */}
        <div className="bg-white/[0.07] backdrop-blur-sm rounded-2xl p-5 mb-4 w-full border border-white/[0.08]">
          <label className="block text-center text-cyan-200 font-bold mb-3 text-base">
            ⏱️ Timer Speed
          </label>
          <div className="flex justify-center gap-3">
            {[5, 6, 7, 8].map((s) => (
              <button
                key={s}
                onClick={() => setTimerSeconds(s)}
                className={`
                  w-16 h-16 rounded-2xl font-extrabold text-xl transition-all duration-200
                  ${timerSeconds === s
                    ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-gray-900 shadow-lg shadow-yellow-500/40 scale-110 ring-2 ring-yellow-300/50'
                    : 'bg-white/10 text-cyan-200/70 hover:bg-white/15 hover:scale-105 border border-white/10'}
                `}
              >
                {s}s
              </button>
            ))}
          </div>
          <p className="text-center text-cyan-300/30 text-xs mt-2">
            {timerSeconds <= 5 ? '🔥 Lightning fast!' : timerSeconds <= 6 ? '⚡ Quick!' : timerSeconds <= 7 ? '💨 Speedy!' : '🙂 Chill pace'}
          </p>
        </div>

        {/* Times Tables Selector */}
        <div className="bg-white/[0.07] backdrop-blur-sm rounded-2xl p-5 mb-4 w-full border border-white/[0.08]">
          <div className="flex items-center justify-between mb-3">
            <label className="text-cyan-200 font-bold text-base">
              🔢 Times Tables
            </label>
            <button
              onClick={toggleAll}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200
                ${allSelected
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-gray-900 shadow-lg shadow-green-500/30'
                  : 'bg-white/10 text-cyan-200/60 hover:bg-white/15 border border-white/10'
                }
              `}
            >
              {allSelected ? '✓ ALL' : 'Select All'}
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {ALL_TABLES.map((num) => {
              const isSelected = selectedTables.includes(num);
              return (
                <button
                  key={num}
                  onClick={() => toggleTable(num)}
                  className={`
                    relative py-3 px-2 rounded-xl font-extrabold text-lg
                    transition-all duration-200 transform
                    ${isSelected
                      ? `bg-gradient-to-br ${TABLE_COLOURS[num]} text-white shadow-lg ${TABLE_SELECTED_GLOW[num]} ring-2 scale-105`
                      : 'bg-white/10 text-white/40 hover:bg-white/15 hover:text-white/60 border border-white/5'
                    }
                  `}
                >
                  {num}×
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center text-[8px] text-gray-900 font-bold shadow-sm">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-center text-cyan-300/30 text-xs mt-3">
            {selectedTables.length === 0
              ? '⚠️ Pick at least one table!'
              : `${selectedTables.length} table${selectedTables.length > 1 ? 's' : ''} selected`
            }
          </p>
        </div>

        {/* Number of Questions */}
        <div className="bg-white/[0.07] backdrop-blur-sm rounded-2xl p-5 mb-6 w-full border border-white/[0.08]">
          <label className="block text-center text-cyan-200 font-bold mb-3 text-base">
            📝 Questions: <span className="text-yellow-400 text-2xl font-extrabold">{questionCount}</span>
          </label>
          <div className="flex items-center gap-3">
            <span className="text-cyan-300/40 text-xs font-bold">5</span>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="flex-1 h-3 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-runnable-track]:rounded-full
                [&::-webkit-slider-runnable-track]:h-3
                [&::-webkit-slider-runnable-track]:bg-gradient-to-r
                [&::-webkit-slider-runnable-track]:from-cyan-600
                [&::-webkit-slider-runnable-track]:to-green-500
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:h-7
                [&::-webkit-slider-thumb]:w-7
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-yellow-400
                [&::-webkit-slider-thumb]:shadow-lg
                [&::-webkit-slider-thumb]:shadow-yellow-400/50
                [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-white
                [&::-webkit-slider-thumb]:mt-[-8px]"
            />
            <span className="text-cyan-300/40 text-xs font-bold">50</span>
          </div>

          {/* Quick select chips */}
          <div className="flex justify-center gap-2 mt-3 flex-wrap">
            {[5, 10, 15, 20, 30, 50].map((n) => (
              <button
                key={n}
                onClick={() => setQuestionCount(n)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all
                  ${questionCount === n
                    ? 'bg-yellow-400 text-gray-900'
                    : 'bg-white/10 text-cyan-300/50 hover:bg-white/15'
                  }
                `}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* START button */}
        <button
          onClick={handleStart}
          disabled={selectedTables.length === 0}
          className={`w-full py-6 rounded-3xl font-extrabold text-2xl md:text-3xl
            transition-all duration-300 transform relative overflow-hidden group
            ${selectedTables.length === 0
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : `bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500
                 text-gray-900 shadow-2xl shadow-yellow-500/40
                 hover:scale-[1.03] active:scale-95
                 hover:shadow-yellow-500/60
                 border-2 border-yellow-300/40`
            }
          `}
        >
          {/* Electric pulse effect */}
          {selectedTables.length > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
              translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          )}
          <span className="relative">
            ⚡ START ⚡
          </span>
        </button>

        {selectedTables.length === 0 && (
          <p className="text-red-400/70 text-sm mt-2 font-medium animate-pulse">
            Select at least one times table above!
          </p>
        )}

        {/* Decorative bottom */}
        <div className="mt-8 text-center">
          <svg className="w-32 h-6 mx-auto opacity-30" viewBox="0 0 120 20">
            <path d="M 0 10 L 30 10 L 38 3 L 46 17 L 54 3 L 62 17 L 70 10 L 120 10"
              fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
