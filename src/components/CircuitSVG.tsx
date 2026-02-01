import { useEffect, useState } from 'react';

interface CircuitSVGProps {
  isConnected: boolean;
  isWrong: boolean;
}

export function CircuitSVG({ isConnected, isWrong }: CircuitSVGProps) {
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (isWrong) {
      const newSparks = Array.from({ length: 6 }, (_, i) => ({
        id: Date.now() + i,
        x: 180 + (Math.random() - 0.5) * 60,
        y: 120 + (Math.random() - 0.5) * 40,
      }));
      setSparks(newSparks);
      const timer = setTimeout(() => setSparks([]), 600);
      return () => clearTimeout(timer);
    }
  }, [isWrong]);

  return (
    <svg viewBox="0 0 360 200" className="w-full max-w-md mx-auto" style={{ filter: isConnected ? 'drop-shadow(0 0 10px #4ade80)' : 'none' }}>
      {/* Background circuit board traces */}
      <defs>
        <linearGradient id="wireGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={isConnected ? '#4ade80' : '#374151'} />
          <stop offset="50%" stopColor={isConnected ? '#22d3ee' : '#374151'} />
          <stop offset="100%" stopColor={isConnected ? '#4ade80' : '#374151'} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="bulbGlow">
          <feGaussianBlur stdDeviation="6" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Battery (left side) */}
      <rect x="15" y="80" width="30" height="40" rx="4" fill="#374151" stroke="#6b7280" strokeWidth="2" />
      <rect x="20" y="75" width="8" height="8" rx="1" fill="#ef4444" />
      <rect x="32" y="75" width="8" height="8" rx="1" fill="#4ade80" />
      <text x="30" y="105" textAnchor="middle" fill="#9ca3af" fontSize="8" fontWeight="bold">BAT</text>

      {/* Left wire — battery to gap */}
      <path
        d="M 45 100 L 80 100 L 80 60 L 150 60"
        fill="none"
        stroke="url(#wireGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        filter={isConnected ? 'url(#glow)' : 'none'}
        className={isConnected ? 'animate-wire-flow' : ''}
        strokeDasharray={isConnected ? '10 10' : 'none'}
      />

      {/* Gap area */}
      {!isConnected && (
        <>
          {/* Broken wire ends */}
          <line x1="150" y1="60" x2="158" y2="55" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          <line x1="150" y1="60" x2="156" y2="65" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          <line x1="210" y1="60" x2="202" y2="55" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          <line x1="210" y1="60" x2="204" y2="65" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />

          {/* Gap indicator */}
          <rect x="158" y="48" width="52" height="24" rx="4" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
          <text x="184" y="64" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">?</text>
        </>
      )}

      {/* Connected bridge */}
      {isConnected && (
        <path
          d="M 150 60 L 210 60"
          fill="none"
          stroke="url(#wireGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#glow)"
          className="animate-wire-flow"
          strokeDasharray="10 10"
        />
      )}

      {/* Right wire — gap to bulb */}
      <path
        d="M 210 60 L 280 60 L 280 100 L 320 100"
        fill="none"
        stroke="url(#wireGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        filter={isConnected ? 'url(#glow)' : 'none'}
        className={isConnected ? 'animate-wire-flow' : ''}
        strokeDasharray={isConnected ? '10 10' : 'none'}
      />

      {/* Bottom wire — return path */}
      <path
        d="M 45 100 L 80 100 L 80 160 L 280 160 L 280 100 L 320 100"
        fill="none"
        stroke="url(#wireGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        filter={isConnected ? 'url(#glow)' : 'none'}
        className={isConnected ? 'animate-wire-flow' : ''}
        strokeDasharray={isConnected ? '10 10' : 'none'}
        opacity="0.5"
      />

      {/* Light bulb */}
      <g transform="translate(320, 85)">
        {/* Bulb base */}
        <rect x="-6" y="8" width="12" height="12" rx="2" fill="#6b7280" />
        <rect x="-4" y="6" width="8" height="4" rx="1" fill="#9ca3af" />

        {/* Bulb glass */}
        <circle
          cx="0"
          cy="-4"
          r="14"
          fill={isConnected ? '#fbbf24' : '#374151'}
          stroke={isConnected ? '#f59e0b' : '#6b7280'}
          strokeWidth="2"
          filter={isConnected ? 'url(#bulbGlow)' : 'none'}
          className={isConnected ? 'animate-glow-pulse' : ''}
        />

        {/* Filament */}
        <path
          d="M -4 -4 Q -2 -10 0 -4 Q 2 2 4 -4"
          fill="none"
          stroke={isConnected ? '#fff' : '#6b7280'}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Light rays when on */}
        {isConnected && (
          <>
            <line x1="-22" y1="-4" x2="-18" y2="-4" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            <line x1="18" y1="-4" x2="22" y2="-4" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            <line x1="0" y1="-24" x2="0" y2="-20" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            <line x1="-14" y1="-18" x2="-11" y2="-15" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            <line x1="14" y1="-18" x2="11" y2="-15" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          </>
        )}
      </g>

      {/* Spark effects on wrong answer */}
      {sparks.map((s) => (
        <g key={s.id} className="animate-spark">
          <circle cx={s.x} cy={s.y} r="3" fill="#facc15" />
          <line
            x1={s.x - 5} y1={s.y - 5}
            x2={s.x + 5} y2={s.y + 5}
            stroke="#facc15" strokeWidth="2" strokeLinecap="round"
          />
          <line
            x1={s.x + 5} y1={s.y - 5}
            x2={s.x - 5} y2={s.y + 5}
            stroke="#f97316" strokeWidth="2" strokeLinecap="round"
          />
        </g>
      ))}

      {/* Zap text on wrong */}
      {isWrong && (
        <text x="180" y="110" textAnchor="middle" fill="#ef4444" fontSize="16" fontWeight="bold" className="animate-zap">
          ZAP! ⚡
        </text>
      )}
    </svg>
  );
}
