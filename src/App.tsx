import { useState, useCallback } from 'react';
import type { Screen } from './types';
import { HomeScreen } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';
import { ResultsScreen } from './components/ResultsScreen';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedTable, setSelectedTable] = useState(1);
  const [questionCount, setQuestionCount] = useState(10);
  const [timerSeconds, setTimerSeconds] = useState(8);
  const [finalScore, setFinalScore] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);

  const handleStart = useCallback((table: number, count: number, timer: number) => {
    setSelectedTable(table);
    setQuestionCount(count);
    setTimerSeconds(timer);
    setScreen('game');
  }, []);

  const handleFinish = useCallback((score: number, total: number) => {
    setFinalScore(score);
    setFinalTotal(total);
    setScreen('results');
  }, []);

  const handlePlayAgain = useCallback(() => {
    setScreen('game');
  }, []);

  const handleHome = useCallback(() => {
    setScreen('home');
  }, []);

  return (
    <div className="min-h-screen">
      {screen === 'home' && (
        <HomeScreen onStart={handleStart} />
      )}
      {screen === 'game' && (
        <GameScreen
          key={`game-${selectedTable}-${Date.now()}`}
          table={selectedTable}
          totalQuestions={questionCount}
          timerSeconds={timerSeconds}
          onFinish={handleFinish}
          onHome={handleHome}
        />
      )}
      {screen === 'results' && (
        <ResultsScreen
          score={finalScore}
          total={finalTotal}
          table={selectedTable}
          onPlayAgain={handlePlayAgain}
          onHome={handleHome}
        />
      )}
    </div>
  );
}

export default App;
