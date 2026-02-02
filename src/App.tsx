import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { Mode, GameConfig } from './types';
import { getSession } from './store';
import { ModeSelect } from './components/ModeSelect';
import { SignIn } from './components/SignIn';
import { HomeScreen } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';
import { ResultsScreen } from './components/ResultsScreen';

function App() {
  const [mode, setMode] = useState<Mode>('home');
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    tables: [2, 5, 10],
    timerSeconds: 8,
    questionCount: 10,
  });
  const [finalScore, setFinalScore] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [gameKey, setGameKey] = useState(0);

  const handleStart = useCallback((config: GameConfig) => {
    setGameConfig(config);
    setGameKey(k => k + 1);
  }, []);

  const handleFinish = useCallback((score: number, total: number) => {
    setFinalScore(score);
    setFinalTotal(total);
  }, []);

  const isAuthenticated = () => getSession() !== null;

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<ModeSelect onSelectMode={setMode} />} />
          <Route path="/signin" element={<SignIn mode={mode} />} />
          <Route
            path="/setup"
            element={
              isAuthenticated() ? (
                <HomeScreen onStart={handleStart} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/play"
            element={
              isAuthenticated() ? (
                <GameScreen
                  key={`game-${gameKey}`}
                  tables={gameConfig.tables}
                  totalQuestions={gameConfig.questionCount}
                  timerSeconds={gameConfig.timerSeconds}
                  onFinish={handleFinish}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/results"
            element={
              isAuthenticated() ? (
                <ResultsScreen
                  score={finalScore}
                  total={finalTotal}
                  tables={gameConfig.tables}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
