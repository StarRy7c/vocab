import { useState } from 'react';
import { motion } from 'motion/react';
import { Difficulty } from '../data/vocab';
import Button from '../components/Button';
import Card from '../components/Card';

export type QuestionType = 'meaning' | 'synonym';

interface StartScreenProps {
  onStart: (difficulty: Difficulty, count: number, timeLimit: number, type: QuestionType) => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('Hard');
  const [count, setCount] = useState<number>(10);
  const [timeLimit, setTimeLimit] = useState<number>(20);
  const [type, setType] = useState<QuestionType>('meaning');

  const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard'];
  const counts = [10, 20, 30];
  const times = [10, 20, 30, 0]; // 0 for No Limit
  const types: { value: QuestionType; label: string }[] = [
    { value: 'meaning', label: 'Phrase (Meaning)' },
    { value: 'synonym', label: 'One Word (Synonym)' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 pb-2">
          Vocab Master
        </h1>
        <p className="text-gray-400 mt-2 text-lg">Elevate your lexicon.</p>
      </motion.div>

      <Card className="w-full max-w-md space-y-6">
        {/* Difficulty */}
        <div className="space-y-2">
          <label className="block text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
            Difficulty
          </label>
          <div className="grid grid-cols-3 gap-2">
            {difficulties.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  difficulty === d
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Question Count */}
        <div className="space-y-2">
          <label className="block text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
            Questions
          </label>
          <div className="grid grid-cols-3 gap-2">
            {counts.map((c) => (
              <button
                key={c}
                onClick={() => setCount(c)}
                className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  count === c
                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Time Limit */}
        <div className="space-y-2">
          <label className="block text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
            Time per Question
          </label>
          <div className="grid grid-cols-4 gap-2">
            {times.map((t) => (
              <button
                key={t}
                onClick={() => setTimeLimit(t)}
                className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  timeLimit === t
                    ? 'bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-500/25'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                {t === 0 ? '∞' : `${t}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Question Type */}
        <div className="space-y-2">
          <label className="block text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
            Answer Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {types.map((t) => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  type === t.value
                    ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={() => onStart(difficulty, count, timeLimit, type)}
          className="w-full py-4 text-lg mt-4"
        >
          Start Challenge
        </Button>
      </Card>
    </div>
  );
}
