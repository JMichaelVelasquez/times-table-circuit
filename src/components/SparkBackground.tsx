import { useEffect, useState } from 'react';

interface Spark {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export function SparkBackground() {
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    const generated: Spark[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      delay: Math.random() * 5,
      duration: 2 + Math.random() * 4,
    }));
    setSparks(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {sparks.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-yellow-400/30"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animation: `spark-float ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
      {/* Circuit trace lines in background */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 0 50 L 30 50 L 40 30 L 60 70 L 70 50 L 100 50" fill="none" stroke="#4ade80" strokeWidth="1" />
          <path d="M 50 0 L 50 30 L 30 40 L 70 60 L 50 70 L 50 100" fill="none" stroke="#22d3ee" strokeWidth="1" />
          <circle cx="30" cy="50" r="2" fill="#facc15" />
          <circle cx="70" cy="50" r="2" fill="#facc15" />
          <circle cx="50" cy="30" r="2" fill="#facc15" />
          <circle cx="50" cy="70" r="2" fill="#facc15" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
      </svg>
    </div>
  );
}
