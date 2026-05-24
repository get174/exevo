'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { QuestionState, AnswerOption } from '@/types/simulation';

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentQuestion: number;
  answers: Record<number, AnswerOption>;
  onQuestionClick: (questionNumber: number) => void;
  disabled?: boolean;
}

export function QuestionNavigator({
  totalQuestions,
  currentQuestion,
  answers,
  onQuestionClick,
  disabled = false,
}: QuestionNavigatorProps) {
  const getQuestionState = (questionNumber: number): QuestionState => {
    if (questionNumber === currentQuestion) return 'current';
    if (answers[questionNumber]) return 'answered';
    return 'unanswered';
  };

  const getStateStyles = (state: QuestionState) => {
    switch (state) {
      case 'current':
        return 'bg-exevo-blue text-white ring-2 ring-exevo-blue ring-offset-2';
      case 'answered':
        return 'bg-exevo-orange text-white';
      case 'unanswered':
        return 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500 dark:text-slate-400">Questions</span>
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-exevo-blue" />
            <span className="text-xs text-slate-500">Actuelle</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-exevo-orange" />
            <span className="text-xs text-slate-500">Répondue</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => {
          const state = getQuestionState(num);
          return (
            <button
              key={num}
              onClick={() => onQuestionClick(num)}
              disabled={disabled}
              className={cn(
                'relative flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold transition-all',
                getStateStyles(state),
                !disabled && 'hover:scale-105 active:scale-95',
                disabled && 'cursor-not-allowed'
              )}
            >
              {num}
              {state === 'answered' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[8px] text-exevo-orange"
                >
                  {answers[num]}
                </motion.div>
              )}
            </button>
          );
        })}
      </div>

      {/* Progress Summary */}
      <div className="space-y-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Répondues</span>
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {Object.keys(answers).length} / {totalQuestions}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <motion.div
            className="h-full bg-exevo-orange"
            initial={{ width: 0 }}
            animate={{
              width: `${(Object.keys(answers).length / totalQuestions) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

// =====================================================
// Compact Navigator for Sidebar
// =====================================================
interface CompactNavigatorProps {
  totalQuestions: number;
  currentQuestion: number;
  answers: Record<number, AnswerOption>;
}

export function CompactNavigator({
  totalQuestions,
  currentQuestion,
  answers,
}: CompactNavigatorProps) {
  const getStateStyles = (num: number) => {
    if (num === currentQuestion)
      return 'bg-exevo-blue text-white';
    if (answers[num])
      return 'bg-exevo-orange text-white';
    return 'bg-slate-100 text-slate-400';
  };

  return (
    <div className="grid grid-cols-5 gap-1">
      {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => (
        <div
          key={num}
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded text-xs font-bold',
            getStateStyles(num)
          )}
        >
          {num}
        </div>
      ))}
    </div>
  );
}
