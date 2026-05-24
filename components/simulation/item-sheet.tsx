'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AnswerOption, SimulationQuestion } from '@/types/simulation';
import { CompactBubble } from './bubble-button';

interface ItemSheetProps {
  questions: SimulationQuestion[];
  answers: Record<number, AnswerOption>;
  currentQuestion: number;
  onQuestionClick: (questionNumber: number) => void;
}

export function ItemSheet({ questions, answers, currentQuestion, onQuestionClick }: ItemSheetProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-700">
        <h3 className="font-bold text-slate-700 dark:text-slate-200">Grille des réponses</h3>
        <span className="text-sm text-slate-500">{Object.keys(answers).length}/{questions.length}</span>
      </div>
      <div className="space-y-1">
        {questions.map((q) => {
          const selected = answers[q.questionNumber];
          const isCurrent = q.questionNumber === currentQuestion;
          return (
            <motion.button
              key={q.id}
              onClick={() => onQuestionClick(q.questionNumber)}
              className={cn('flex w-full items-center gap-2 rounded p-1 text-left transition-all', isCurrent ? 'bg-exevo-blue/10 ring-1 ring-exevo-blue' : 'hover:bg-slate-50 dark:hover:bg-slate-800')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className={cn('flex h-5 w-5 items-center justify-center rounded bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400', isCurrent && 'bg-exevo-blue text-white')}>
                {q.questionNumber}
              </span>
              <div className="flex gap-0.5">
                {(['A', 'B', 'C', 'D', 'E'] as AnswerOption[]).map((option) => (
                  <CompactBubble key={option} option={option} selected={selected === option} onClick={() => onQuestionClick(q.questionNumber)} />
                ))}
              </div>
              {selected && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto text-xs font-bold text-exevo-orange">{selected}</motion.div>}
            </motion.button>
          );
        })}
      </div>
      <div className="mt-2 border-t border-slate-200 pt-2 dark:border-slate-700">
        <div className="flex justify-between text-xs"><span className="text-slate-500">Répondues</span><span className="font-medium text-slate-700 dark:text-slate-200">{Object.keys(answers).length}</span></div>
        <div className="flex justify-between text-xs"><span className="text-slate-500">Non répondues</span><span className="font-medium text-slate-700 dark:text-slate-200">{questions.length - Object.keys(answers).length}</span></div>
      </div>
    </div>
  );
}

interface MobileSummaryProps {
  answers: Record<number, AnswerOption>;
  totalQuestions: number;
}

export function MobileAnswerSummary({ answers, totalQuestions }: MobileSummaryProps) {
  const unanswered = totalQuestions - Object.keys(answers).length;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-slate-500">Réponses:</span>
      <span className="font-bold text-exevo-orange">{Object.keys(answers).length}</span>
      <span className="text-slate-400">/</span>
      <span className="font-bold text-slate-700">{totalQuestions}</span>
      <span className="text-slate-400">-</span>
      <span className="text-slate-500">({unanswered} restantes)</span>
    </div>
  );
}
