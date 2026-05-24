'use client';

import { motion } from 'framer-motion';
import { Check, X, Clock, Trophy, Target, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnswerOption, SimulationQuestion } from '@/types/simulation';

interface CorrectionViewProps {
  questions: SimulationQuestion[];
  answers: Record<number, AnswerOption>;
  timeUsedSeconds: number;
}

export function CorrectionView({ questions, answers, timeUsedSeconds }: CorrectionViewProps) {
  const correctCount = questions.filter((q) => answers[q.questionNumber] === q.correctAnswer).length;
  const wrongCount = questions.filter((q) => answers[q.questionNumber] && answers[q.questionNumber] !== q.correctAnswer).length;
  const blankCount = questions.filter((q) => !answers[q.questionNumber]).length;
  const score = Math.round((correctCount / questions.length) * 100);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}min ${secs}s`;
  };

  return (
    <div className="space-y-6">
      {/* Score Summary */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="rounded-lg bg-exevo-blue p-4 text-center text-white">
          <Trophy className="mx-auto mb-2 h-8 w-8" />
          <div className="text-3xl font-black">{score}%</div>
          <div className="text-sm opacity-80">Score</div>
        </motion.div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} className="rounded-lg bg-green-500 p-4 text-center text-white">
          <Check className="mx-auto mb-2 h-8 w-8" />
          <div className="text-3xl font-black">{correctCount}</div>
          <div className="text-sm opacity-80">Bonnes</div>
        </motion.div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="rounded-lg bg-red-500 p-4 text-center text-white">
          <X className="mx-auto mb-2 h-8 w-8" />
          <div className="text-3xl font-black">{wrongCount}</div>
          <div className="text-sm opacity-80">Mauvaises</div>
        </motion.div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="rounded-lg bg-slate-500 p-4 text-center text-white">
          <Clock className="mx-auto mb-2 h-8 w-8" />
          <div className="text-3xl font-black">{formatTime(timeUsedSeconds)}</div>
          <div className="text-sm opacity-80">Temps</div>
        </motion.div>
      </div>

      {/* Question Results */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Correction détaillée</h3>
        {questions.map((q, index) => {
          const userAnswer = answers[q.questionNumber];
          const isCorrect = userAnswer === q.correctAnswer;
          const isBlank = !userAnswer;

          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn('rounded-lg border-2 p-4', isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-950/30' : isBlank ? 'border-slate-300 bg-slate-50 dark:bg-slate-800' : 'border-red-500 bg-red-50 dark:bg-red-950/30')}
            >
              <div className="mb-2 flex items-start justify-between">
                <span className={cn('flex h-6 w-6 items-center justify-center rounded text-sm font-bold', isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white')}>
                  {q.questionNumber}
                </span>
                {isCorrect ? <Check className="h-5 w-5 text-green-500" /> : isBlank ? <AlertCircle className="h-5 w-5 text-slate-400" /> : <X className="h-5 w-5 text-red-500" />}
              </div>
              <p className="mb-3 text-sm font-medium text-slate-900 dark:text-slate-100">{q.questionText}</p>
              <div className="flex flex-wrap gap-2">
                {(['A', 'B', 'C', 'D', 'E'] as AnswerOption[]).map((option) => {
                  const isUserChoice = userAnswer === option;
                  const isCorrectChoice = q.correctAnswer === option;
                  return (
                    <span key={option} className={cn('flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold', isCorrectChoice ? 'bg-green-500 text-white' : isUserChoice ? 'bg-red-500 text-white' : 'border border-slate-300 text-slate-400')}>
                      {option}
                    </span>
                  );
                })}
              </div>
              {isBlank && <p className="mt-2 text-sm text-slate-500">Non répondue</p>}
              {!isBlank && !isCorrect && <p className="mt-2 text-sm text-red-600">Votre réponse: {userAnswer}</p>}
              {!isBlank && q.explanation && <p className="mt-2 text-sm text-green-700 dark:text-green-400">{q.explanation}</p>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
