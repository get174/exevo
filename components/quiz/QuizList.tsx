'use client';

import { motion } from 'framer-motion';
import { FileX } from 'lucide-react';
import { Quiz, DEFAULT_PAGINATION } from '@/types/quiz';
import { QuizCard, QuizCardSkeleton } from '@/components/quiz/QuizCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuizListProps {
  quizzes: Quiz[];
  isLoading?: boolean;
  total?: number;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function QuizList({
  quizzes,
  isLoading = false,
  total = 0,
  page = DEFAULT_PAGINATION.page,
  limit = DEFAULT_PAGINATION.limit,
  onPageChange,
  className,
}: QuizListProps) {
  const totalPages = Math.ceil(total / limit);
  const hasQuizzes = quizzes.length > 0;
  const isPaginationVisible = totalPages > 1;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Grid of quizzes */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          // Skeleton loading state
          Array.from({ length: limit }).map((_, i) => (
            <QuizCardSkeleton key={i} />
          ))
        ) : hasQuizzes ? (
          // Quizzes list
          quizzes.map((quiz, index) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              index={index}
            />
          ))
        ) : null}
      </div>

      {/* Empty state */}
      {!isLoading && !hasQuizzes && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
            <FileX className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Aucun quiz trouvé
          </h3>
          <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
            Aucun résultat ne correspond à ta recherche. Essaye de modifier tes
            filtres ou ta requête.
          </p>
        </motion.div>
      )}

      {/* Pagination */}
      {isPaginationVisible && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange?.(page - 1)}
          >
            Précédent
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                // Show first, last, and around current page
                return (
                  p === 1 ||
                  p === totalPages ||
                  Math.abs(p - page) <= 1
                );
              })
              .map((p, i, arr) => (
                <span key={p}>
                  {i > 0 && arr[i - 1] !== p - 1 && (
                    <span className="px-2 text-slate-400">...</span>
                  )}
                  <Button
                    variant={p === page ? 'default' : 'ghost'}
                    size="sm"
                    className={cn(
                      'h-8 w-8 p-0',
                      p !== page && 'text-slate-600'
                    )}
                    onClick={() => onPageChange?.(p)}
                  >
                    {p}
                  </Button>
                </span>
              ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange?.(page + 1)}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
}
