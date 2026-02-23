import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { vocabData, WordItem, Difficulty } from '../data/vocab';
import Button from '../components/Button';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { CheckCircle2, XCircle, ArrowRight, Timer } from 'lucide-react';
import { QuestionType } from './StartScreen';

interface QuizScreenProps {
  difficulty: Difficulty;
  count: number;
  timeLimit: number;
  type: QuestionType;
  onFinish: (score: number, total: number, history: QuestionHistory[]) => void;
}

export interface QuestionHistory {
  word: string;
  correct: boolean;
  userAnswer: string;
  correctAnswer: string;
  synonyms: string[];
}

interface Question {
  wordItem: WordItem;
  options: string[];
  correctOptionIndex: number;
  correctAnswerText: string;
}

export default function QuizScreen({ difficulty, count, timeLimit, type, onFinish }: QuizScreenProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [history, setHistory] = useState<QuestionHistory[]>([]);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Game
  useEffect(() => {
    // Filter by difficulty, but if not enough, take from all
    let filtered = vocabData.filter((item) => item.difficulty === difficulty);
    if (filtered.length < count) {
      filtered = vocabData; // Fallback to all words if not enough in category
    }
    
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, Math.min(count, shuffled.length));

    const newQuestions: Question[] = selectedWords.map((wordItem) => {
      let options: string[] = [];
      let correctAnswerText = '';

      if (type === 'synonym') {
        // Correct answer is one of the synonyms
        const correctSynonym = wordItem.synonyms[Math.floor(Math.random() * wordItem.synonyms.length)];
        correctAnswerText = correctSynonym;

        // Distractors: Pick synonyms from OTHER words
        const otherWords = vocabData.filter((w) => w.id !== wordItem.id);
        const shuffledOthers = [...otherWords].sort(() => 0.5 - Math.random());
        const distractors = shuffledOthers.slice(0, 3).map((w) => {
           // Pick a random synonym from the other word
           return w.synonyms[Math.floor(Math.random() * w.synonyms.length)];
        });

        options = [...distractors, correctSynonym];
      } else {
        // Meaning mode
        correctAnswerText = wordItem.meaning;
        
        const otherWords = vocabData.filter((w) => w.id !== wordItem.id);
        const shuffledOthers = [...otherWords].sort(() => 0.5 - Math.random());
        const distractors = shuffledOthers.slice(0, 3).map((w) => w.meaning);
        
        options = [...distractors, wordItem.meaning];
      }

      // Shuffle options
      const shuffledOptions = options
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

      return {
        wordItem,
        options: shuffledOptions,
        correctOptionIndex: shuffledOptions.indexOf(correctAnswerText),
        correctAnswerText
      };
    });

    setQuestions(newQuestions);
  }, [difficulty, count, type]);

  // Timer Logic
  useEffect(() => {
    if (timeLimit > 0 && !isAnswered && questions.length > 0) {
      setTimeLeft(timeLimit);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isAnswered, questions.length, timeLimit]);

  const handleTimeUp = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsAnswered(true);
    setSelectedOption(-1); // -1 indicates time up/no selection
    
    const currentQ = questions[currentIndex];
    setHistory((prev) => [
      ...prev,
      {
        word: currentQ.wordItem.word,
        correct: false,
        userAnswer: "Time Up",
        correctAnswer: currentQ.correctAnswerText,
        synonyms: currentQ.wordItem.synonyms
      },
    ]);
  };

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedOption(index);
    setIsAnswered(true);

    const currentQ = questions[currentIndex];
    const isCorrect = index === currentQ.correctOptionIndex;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setHistory((prev) => [
      ...prev,
      {
        word: currentQ.wordItem.word,
        correct: isCorrect,
        userAnswer: currentQ.options[index],
        correctAnswer: currentQ.correctAnswerText,
        synonyms: currentQ.wordItem.synonyms
      },
    ]);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(timeLimit);
    } else {
      onFinish(score, questions.length, history);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 min-h-screen flex flex-col justify-center">
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-2">
            Question {currentIndex + 1} / {questions.length}
          </h2>
          <div className="w-64">
            <ProgressBar current={currentIndex + 1} total={questions.length} />
          </div>
        </div>
        
        {timeLimit > 0 && (
           <div className={`flex items-center gap-2 text-2xl font-mono font-bold ${
             timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-cyan-400'
           }`}>
             <Timer className="w-6 h-6" />
             {timeLeft}s
           </div>
        )}

        <div className="text-right">
          <span className="text-sm text-gray-400 uppercase tracking-widest">Score</span>
          <div className="text-2xl font-bold text-white">{score}</div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="text-center py-8">
              <h1 className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tight">
                {currentQ.wordItem.word}
              </h1>
              <p className="text-indigo-300 text-sm font-medium uppercase tracking-widest">
                {type === 'synonym' ? 'Select the Synonym' : 'Select the Meaning'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {currentQ.options.map((option, index) => {
                let stateStyles = "bg-white/5 border-white/10 hover:bg-white/10 text-gray-200";
                
                if (isAnswered) {
                  if (index === currentQ.correctOptionIndex) {
                    stateStyles = "bg-emerald-500/20 border-emerald-500 text-emerald-200";
                  } else if (index === selectedOption) {
                    stateStyles = "bg-red-500/20 border-red-500 text-red-200";
                  } else {
                    stateStyles = "opacity-50";
                  }
                }

                return (
                  <motion.button
                    key={index}
                    whileHover={!isAnswered ? { scale: 1.02 } : {}}
                    whileTap={!isAnswered ? { scale: 0.98 } : {}}
                    onClick={() => handleOptionClick(index)}
                    disabled={isAnswered}
                    className={`p-6 rounded-2xl text-left transition-all duration-200 border ${stateStyles} flex items-start gap-3`}
                  >
                    <div className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isAnswered && index === currentQ.correctOptionIndex ? 'border-emerald-400 bg-emerald-400/20' : 
                      isAnswered && index === selectedOption ? 'border-red-400 bg-red-400/20' : 
                      'border-white/20'
                    }`}>
                      {isAnswered && index === currentQ.correctOptionIndex && <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />}
                      {isAnswered && index === selectedOption && index !== currentQ.correctOptionIndex && <div className="w-2.5 h-2.5 rounded-full bg-red-400" />}
                    </div>
                    <span className="text-lg leading-snug">{option}</span>
                  </motion.button>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Feedback / Next Section */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4"
          >
            <Card className={`border-l-4 ${
              selectedOption === currentQ.correctOptionIndex ? 'border-l-emerald-500' : 'border-l-red-500'
            }`}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2 mb-2">
                    {selectedOption === currentQ.correctOptionIndex ? (
                      <CheckCircle2 className="text-emerald-400 w-6 h-6" />
                    ) : (
                      <XCircle className="text-red-400 w-6 h-6" />
                    )}
                    <h3 className={`text-xl font-bold ${
                      selectedOption === currentQ.correctOptionIndex ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {selectedOption === currentQ.correctOptionIndex ? 'Correct!' : selectedOption === -1 ? 'Time Up!' : 'Incorrect'}
                    </h3>
                  </div>
                  
                  <div className="bg-black/30 rounded-lg p-4 mt-2 mb-2">
                    <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Synonyms</p>
                    <div className="flex flex-wrap gap-2">
                      {currentQ.wordItem.synonyms.map((syn, i) => (
                        <span key={i} className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded text-sm border border-indigo-500/30">
                          {syn}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-4 mt-2">
                    <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Example Usage</p>
                    <p className="text-white text-lg italic font-serif">"{currentQ.wordItem.example}"</p>
                  </div>
                </div>

                <Button onClick={handleNext} className="w-full md:w-auto shrink-0 self-end md:self-center">
                  {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
