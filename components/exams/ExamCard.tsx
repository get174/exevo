'use client';

import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Heart, 
  Calendar, 
  BookOpen, 
  TrendingUp,
  ChevronRight,
  Play
} from 'lucide-react';
import Link from 'next/link';
import { Exam } from '@/types/exam';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExamCardProps {
  exam: Exam;
  onFavorite?: (id: string) => void;
  index?: number;
}

const difficultyColors = {
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

export function ExamCard({ exam, onFavorite, index = 0 }: ExamCardProps) {
  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavorite?.(exam.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/dashboard/exams/${exam.id}`}>
        <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-slate-900/50">
          {/* Thumbnail */}
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-exevo-blue/5 to-exevo-orange/5">
              <FileText className="h-16 w-16 text-slate-300 dark:text-slate-600" />
            </div>
            
            {/* Badges overlay */}
            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
              <Badge className={cn('text-xs font-medium', subjectColors[exam.subject] || 'bg-slate-100 text-slate-700')}>
                {exam.subject}
              </Badge>
              <Badge className={cn('text-xs font-medium', difficultyColors[exam.difficulty as keyof typeof difficultyColors])}>
                {exam.difficulty}
              </Badge>
            </div>

            {/* Favorite button */}
            <button
              onClick={handleFavorite}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-all hover:scale-110 dark:bg-slate-800/90"
              aria-label={exam.is_favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <Heart 
                className={cn(
                  'h-4 w-4', 
                  exam.is_favorite 
                    ? 'fill-red-500 text-red-500' 
                    : 'text-slate-400'
                )} 
              />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col p-4">
            <h3 className="mb-2 line-clamp-2 text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-exevo-blue dark:group-hover:text-exevo-orange transition-colors">
              {exam.title}
            </h3>

            <div className="mb-4 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {exam.year}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                {exam.option}
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" />
                {exam.downloads_count.toLocaleString('fr-FR')}
              </span>
            </div>

            {/* Actions */}
            <div className="mt-auto flex gap-2">
              <Button
                size="sm"
                className="flex-1 bg-exevo-blue text-white hover:bg-exevo-blue/90"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Navigate to exam detail
                  window.location.href = `/dashboard/exams/${exam.id}`;
                }}
              >
                <Play className="mr-1.5 h-3.5 w-3.5" />
                Ouvrir
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="px-3"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Download PDF
                  if (exam.pdf_url) {
                    window.open(exam.pdf_url, '_blank');
                  }
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

// Skeleton for loading state
export function ExamCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="aspect-[4/3] animate-pulse bg-slate-100 dark:bg-slate-800" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-5 w-3/4 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-1/2 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
        <div className="mt-auto flex gap-2">
          <div className="h-9 flex-1 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
          <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  );
}
