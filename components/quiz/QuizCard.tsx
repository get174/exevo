'use client';

import { motion } from 'framer-motion';
import { 
  Clock, 
  HelpCircle, 
  TrendingUp,
  Play,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { Quiz } from '@/types/quiz';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuizCardProps {
  quiz: Quiz;
  index?: number;
}

const difficultyColors: Record<string, string> = {
  'Facile': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Moyen': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  'Difficile': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const subjectColors: Record<string, string> = {
  'Mathématiques': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Physique': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Chimie': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  'Français': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'Biologie': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Géographie': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
};

export function QuizCard({ quiz, index = 0 }: QuizCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/dashboard/quiz/${quiz.id}`}>
        <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-slate-900/50">
          {/* Header with gradient */}
          <div className="relative overflow-hidden bg-gradient-to-br from-exevo-blue to-slate-800 p-4 text-white">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10 transition-transform group-hover:scale-150" />
            <div className="absolute -bottom-2 -left-2 h-12 w-12 rounded-full bg-white/5" />
            
            {/* Badges */}
            <div className="relative flex flex-wrap gap-1.5">
              <Badge className={cn('text-xs font-medium', subjectColors[quiz.subject] || 'bg-slate-100 text-slate-700')}>
                {quiz.subject}
              </Badge>
              <Badge className={cn('text-xs font-medium', difficultyColors[quiz.difficulty as keyof typeof difficultyColors])}>
                {quiz.difficulty}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col p-4">
            <h3 className="mb-2 line-clamp-2 text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-exevo-blue dark:group-hover:text-exevo-orange transition-colors">
              {quiz.title}
            </h3>

            <div className="mb-4 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <HelpCircle className="h-3.5 w-3.5" />
                {quiz.questions_count} questions
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {quiz.duration_minutes} min
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" />
                {quiz.times_completed.toLocaleString('fr-FR')}
              </span>
            </div>

            {/* Average score bar */}
            <div className="mb-4">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <BarChart3 className="h-3 w-3" />
                  Score moyen
                </span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {quiz.average_score}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <motion.div 
                  className="h-full rounded-full bg-exevo-orange"
                  initial={{ width: 0 }}
                  animate={{ width: `${quiz.average_score}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto">
              <Button 
                className="w-full bg-exevo-blue text-white hover:bg-exevo-blue/90"
                onClick={(e) => e.preventDefault()}
              >
                <Play className="mr-1.5 h-4 w-4" />
                Commencer
              </Button>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

// Skeleton for loading state
export function QuizCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="h-20 animate-pulse bg-slate-100 dark:bg-slate-800" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-5 w-3/4 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
        <div className="flex gap-3">
          <div className="h-4 w-16 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-16 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="h-8 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
        <div className="h-9 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}
