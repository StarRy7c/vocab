/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import StartScreen, { QuestionType } from './screens/StartScreen';
import QuizScreen, { QuestionHistory } from './screens/QuizScreen';
import ResultScreen from './screens/ResultScreen';
import { Difficulty } from './data/vocab';

type Screen = 'start' | 'quiz' | 'result';

export default function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [count, setCount] = useState<number>(10);
  const [timeLimit, setTimeLimit] = useState<number>(20);
  const [type, setType] = useState<QuestionType>('meaning');
  const [score, setScore] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [history, setHistory] = useState<QuestionHistory[]>([]);

  const handleStart = (selectedDifficulty: Difficulty, selectedCount: number, selectedTime: number, selectedType: QuestionType) => {
    setDifficulty(selectedDifficulty);
    setCount(selectedCount);
    setTimeLimit(selectedTime);
    setType(selectedType);
    setScreen('quiz');
  };

  const handleFinish = (finalScore: number, totalQuestions: number, gameHistory: QuestionHistory[]) => {
    setScore(finalScore);
    setTotal(totalQuestions);
    setHistory(gameHistory);
    setScreen('result');
  };

  const handleRestart = () => {
    setScreen('quiz');
    setScore(0);
    setHistory([]);
  };

  const handleHome = () => {
    setScreen('start');
    setScore(0);
    setHistory([]);
  };

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px]" />
      </div>

      <AnimatePresence mode="wait">
        {screen === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full h-full"
          >
            <StartScreen onStart={handleStart} />
          </motion.div>
        )}

        {screen === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full h-full overflow-y-auto"
          >
            <QuizScreen 
              difficulty={difficulty} 
              count={count} 
              timeLimit={timeLimit}
              type={type}
              onFinish={handleFinish} 
            />
          </motion.div>
        )}

        {screen === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full h-full overflow-y-auto"
          >
            <ResultScreen
              score={score}
              total={total}
              history={history}
              onRestart={handleRestart}
              onHome={handleHome}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
