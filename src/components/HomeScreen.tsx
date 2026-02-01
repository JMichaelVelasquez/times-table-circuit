import { useState } from 'react';

interface HomeScreenProps {
  onStart: (table: number, questionCount: number, timerSeconds: number) => void;
}

const TABLE_COLOURS = [
  'from-red-500 to-red-600',
  'from-orange-500 to-orange-600',
  'from-amber-500 to-amber-600',
  'from-yellow-500 to-yellow-600',
  'from-lime-500 to-lime-600',
  'from-green-500 to-green-600',
  'from-emerald-500 to-emerald-600',
  'from-cyan-500 to-cyan-600',
  'from-blue-500 to-blue-600',
  'from-violet-500 to-violet-600',
  'from-purple-500 to-purple-600',
  'from-pink-500 to-pink-600',
];

export function HomeScreen({ onStart }: HomeScreenProps) {
  const [questionCount, setQuestionCount] = useState(10);
  const [timerSeconds, setTimerSeconds] = useState(8);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Title */}
      <div className="text-center mb-8 animate-float">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-green-400 to-cyan-400 mb-2">
          ⚡ Times Table Circuit ⚡
        </h1>
        <p className="text-lg md:text-xl text-cyan-200/80 font-medium">
          Fix the broken circuit with your maths power!
        </p>
      </div>

      {/* Decorative circuit lines */}
      <svg className="w-32 h-8 mb-6 mx-auto" viewBox="0 0 120 30">
        <path d="M 0 15 L 30 15 L 40 5 L 50 25 L 60 5 L 70 25 L 80 15 L 120 15" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
        <circle cx="0" cy="15" r="3" fill="#4ade80" />
        <circle cx="120" cy="15" r="3" fill="#4ade80" />
      </svg>

      {/* Question count selector */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 mb-8 w-full max-w-md border border-white/10">
        <label className="block text-center text-cyan-200 font-semibold mb-3 text-lg">
          How many questions? <span className="text-yellow-400 font-bold text-2xl">{questionCount}</span>
        </label>
        <input
          type="range"
          min="5"
          max="50"
          step="5"
          value={questionCount}
          onChange={(e) => setQuestionCount(Number(e.target.value))}
          className="w-full h-3 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-runnable-track]:rounded-full
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
        <div className="flex justify-between text-xs text-cyan-300/60 mt-1 px-1">
          <span>5</span>
          <span>50</span>
        </div>
      </div>

      {/* Timer selector */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 mb-8 w-full max-w-md border border-white/10">
        <label className="block text-center text-cyan-200 font-semibold mb-3 text-lg">
          Seconds per question: <span className="text-yellow-400 font-bold text-2xl">{timerSeconds}s</span>
        </label>
        <div className="flex justify-center gap-3">
          {[5, 6, 7, 8].map((s) => (
            <button
              key={s}
              onClick={() => setTimerSeconds(s)}
              className={`
                w-14 h-14 rounded-xl font-extrabold text-xl transition-all duration-150
                ${timerSeconds === s
                  ? 'bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/40 scale-110'
                  : 'bg-white/10 text-cyan-200 hover:bg-white/20 hover:scale-105'}
                border-2 ${timerSeconds === s ? 'border-yellow-300' : 'border-white/10'}
              `}
            >
              {s}s
            </button>
          ))}
        </div>
      </div>

      {/* Choose a table */}
      <h2 className="text-2xl font-bold text-white mb-4">Pick a Times Table!</h2>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-md mb-8">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => onStart(num, questionCount, timerSeconds)}
            className={`
              bg-gradient-to-br ${TABLE_COLOURS[num - 1]}
              text-white font-extrabold text-2xl md:text-3xl
              py-5 px-4 rounded-2xl
              shadow-lg hover:shadow-xl
              transform hover:scale-105 active:scale-95
              transition-all duration-150
              border-2 border-white/20
              min-h-[72px]
            `}
          >
            {num}×
          </button>
        ))}
      </div>

      {/* Fun bottom decoration */}
      <div className="text-center text-cyan-300/40 text-sm">
        <p>💡 Answer correctly to light up the bulb!</p>
      </div>
    </div>
  );
}
