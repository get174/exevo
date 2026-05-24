'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AnswerOption } from '@/types/simulation';

interface BubbleButtonProps {
  option: AnswerOption;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function BubbleButton({
  option,
  selected,
  onClick,
  disabled = false,
  className,
}: BubbleButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-300 transition-all',
        selected
          ? 'border-exevo-blue bg-transparent'
          : 'border-slate-300 hover:border-exevo-blue hover:bg-slate-50',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      aria-label={`Option ${option}`}
      aria-pressed={selected}
    >
      <span
        className={cn(
          'text-lg font-bold',
          selected ? 'text-exevo-blue' : 'text-slate-400'
        )}
      >
        {option}
      </span>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute inset-1 rounded-full bg-exevo-blue"
          />
        )}
      </AnimatePresence>

      {selected && (
        <span className="relative z-10 text-white"> {option}</span>
      )}
    </button>
  );
}

// =====================================================
// Compact Bubble for Item Sheet
// =====================================================
interface CompactBubbleProps {
  selected: boolean;
  option: AnswerOption;
  onClick: () => void;
}

export function CompactBubble({ selected, option, onClick }: CompactBubbleProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all',
        selected
          ? 'bg-exevo-blue text-white'
          : 'border border-slate-300 text-slate-400 hover:border-exevo-blue'
      )}
    >
      {option}
    </button>
  );
}

// =====================================================
// Answer Option Button (with text label)
// =====================================================
interface AnswerOptionButtonProps {
  option: AnswerOption;
  text: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function AnswerOptionButton({
  option,
  text,
  selected,
  onClick,
  disabled = false,
}: AnswerOptionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group relative flex w-full items-center gap-4 rounded-lg border-2 p-4 text-left transition-all',
        selected
          ? 'border-exevo-blue bg-blue-50 dark:bg-blue-950/30'
          : 'border-slate-200 hover:border-exevo-blue hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-bold transition-all',
          selected
            ? 'border-exevo-blue bg-exevo-blue text-white'
            : 'border-slate-300 text-slate-400 group-hover:border-exevo-blue group-hover:text-exevo-blue'
        )}
      >
        {selected ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="h-3 w-3 rounded-full bg-white"
          />
        ) : (
          option
        )}
      </div>

      <span
        className={cn(
          'flex-1 text-base',
          selected ? 'font-medium text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-300'
        )}
      >
        {text}
      </span>
    </button>
  );
}
