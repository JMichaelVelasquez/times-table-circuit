import { useNavigate } from 'react-router-dom';
import type { Mode } from '../types';
import { VersionTag } from './VersionTag';
import { SparkBackground } from './SparkBackground';

interface ModeSelectProps {
  onSelectMode: (mode: Mode) => void;
}

export function ModeSelect({ onSelectMode }: ModeSelectProps) {
  const navigate = useNavigate();

  const handleSelect = (mode: Mode) => {
    onSelectMode(mode);
    navigate('/signin');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative">
      <SparkBackground />
      <VersionTag />

      <div className="relative z-10 flex flex-col items-center w-full max-w-lg">
        {/* Animated lightning bolt */}
        <div className="text-7xl md:text-8xl mb-4 animate-float select-none">⚡</div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-cyan-400 to-blue-500">
            Times Table
          </span>
        </h1>
        <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400">
            Circuit
          </span>
        </h2>

        {/* Decorative circuit line */}
        <svg className="w-48 h-8 mb-8 mx-auto" viewBox="0 0 200 30">
          <path
            d="M 0 15 L 40 15 L 50 5 L 60 25 L 70 5 L 80 25 L 90 5 L 100 25 L 110 15 L 200 15"
            fill="none"
            stroke="#4ade80"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="animate-wire-flow"
            strokeDasharray="10 10"
          />
          <circle cx="0" cy="15" r="4" fill="#facc15" className="animate-glow-pulse" />
          <circle cx="200" cy="15" r="4" fill="#facc15" className="animate-glow-pulse" />
        </svg>

        <p className="text-cyan-200/70 text-lg md:text-xl text-center mb-10 font-medium">
          Where are you playing from? 🎮
        </p>

        {/* Mode buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button
            onClick={() => handleSelect('home')}
            className="flex-1 group relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700
              text-white font-extrabold text-2xl md:text-3xl
              py-8 px-6 rounded-3xl
              shadow-xl shadow-blue-500/30
              transform hover:scale-105 active:scale-95
              transition-all duration-200
              border-2 border-blue-400/30"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex flex-col items-center gap-2">
              <span className="text-5xl">🏠</span>
              <span>Home</span>
              <span className="text-sm font-normal text-blue-200/80">Play at home!</span>
            </div>
          </button>

          <button
            onClick={() => handleSelect('school')}
            className="flex-1 group relative overflow-hidden bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700
              text-white font-extrabold text-2xl md:text-3xl
              py-8 px-6 rounded-3xl
              shadow-xl shadow-green-500/30
              transform hover:scale-105 active:scale-95
              transition-all duration-200
              border-2 border-green-400/30"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-green-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex flex-col items-center gap-2">
              <span className="text-5xl">🏫</span>
              <span>School</span>
              <span className="text-sm font-normal text-green-200/80">Classroom mode!</span>
            </div>
          </button>
        </div>

        {/* Bottom decoration */}
        <div className="mt-12 text-center">
          <p className="text-cyan-300/30 text-sm">
            ⚡ Power up your maths skills! ⚡
          </p>
          <p className="text-cyan-300/20 text-xs mt-1">
            Designed by Caleb 🧠
          </p>
        </div>
      </div>
    </div>
  );
}
