import { motion } from 'motion/react';
import { QuestionHistory } from './QuizScreen';
import Button from '../components/Button';
import Card from '../components/Card';
import { CheckCircle2, XCircle, RefreshCcw, Home } from 'lucide-react';

interface ResultScreenProps {
  score: number;
  total: number;
  history: QuestionHistory[];
  onRestart: () => void;
  onHome: () => void;
}

export default function ResultScreen({ score, total, history, onRestart, onHome }: ResultScreenProps) {
  const percentage = Math.round((score / total) * 100);
  
  let message = "Keep practicing!";
  let color = "text-red-400";
  
  if (percentage >= 90) {
    message = "Vocabulary Master!";
    color = "text-emerald-400";
  } else if (percentage >= 70) {
    message = "Great Job!";
    color = "text-cyan-400";
  } else if (percentage >= 50) {
    message = "Good Effort!";
    color = "text-yellow-400";
  }

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center max-w-4xl mx-auto">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Quiz Complete</h1>
        <p className={`text-2xl font-medium ${color}`}>{message}</p>
      </motion.div>

      <Card className="w-full mb-8 text-center py-12">
        <div className="flex justify-center items-center gap-8 mb-8">
          <div className="text-center">
            <p className="text-sm text-gray-400 uppercase tracking-widest">Score</p>
            <p className="text-6xl font-black text-white">{score}</p>
          </div>
          <div className="h-16 w-px bg-white/10" />
          <div className="text-center">
            <p className="text-sm text-gray-400 uppercase tracking-widest">Total</p>
            <p className="text-6xl font-black text-gray-400">{total}</p>
          </div>
        </div>
        
        <div className="w-full max-w-md mx-auto bg-white/5 rounded-full h-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className={`h-full ${
              percentage >= 70 ? 'bg-emerald-500' : percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
          />
        </div>
        <p className="mt-2 text-gray-400">{percentage}% Accuracy</p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8">
        <Button onClick={onRestart} variant="primary" className="w-full">
          <RefreshCcw className="w-4 h-4" />
          Play Again
        </Button>
        <Button onClick={onHome} variant="secondary" className="w-full">
          <Home className="w-4 h-4" />
          Back to Home
        </Button>
      </div>

      <div className="w-full space-y-4">
        <h3 className="text-xl font-bold text-white mb-4">Review</h3>
        {history.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-xl border ${
              item.correct ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="font-bold text-white text-lg">{item.word}</h4>
                <p className="text-gray-400 text-sm mt-1">
                  Correct: <span className="text-emerald-300">{item.correctAnswer}</span>
                </p>
                {!item.correct && (
                  <p className="text-gray-400 text-sm">
                    You chose: <span className="text-red-300">{item.userAnswer}</span>
                  </p>
                )}
              </div>
              {item.correct ? (
                <CheckCircle2 className="text-emerald-400 w-6 h-6 shrink-0" />
              ) : (
                <XCircle className="text-red-400 w-6 h-6 shrink-0" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
