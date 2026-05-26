'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, History } from 'lucide-react';
import {
  Quiz,
  QuizFilters,
  DEFAULT_QUIZ_FILTERS,
  DEFAULT_PAGINATION,
  QuizStats,
  QuizHistoryResponse
} from '@/types/quiz';
import { QuizSearch } from '@/components/quiz/QuizSearch';
import { QuizFilters as QuizFiltersComponent } from '@/components/quiz/QuizFilters';
import { QuizList } from '@/components/quiz/QuizList';
import { QuizStats as QuizStatsComponent } from '@/components/quiz/QuizStats';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(DEFAULT_PAGINATION.page);
  const [showStats, setShowStats] = useState(false);

  const [filters, setFilters] = useState<QuizFilters>(DEFAULT_QUIZ_FILTERS);
  const [searchValue, setSearchValue] = useState('');
  const [userStats, setUserStats] = useState<{ quizzes_completed: number; average_score: number; best_subject: string; weakest_subject: string } | null>(null);
  const [completedQuizIds, setCompletedQuizIds] = useState<Set<string>>(new Set());

  const { toast } = useToast();

  // Fetch user stats from quiz history API
  const fetchUserStats = useCallback(async () => {
    if (!supabase) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.access_token) {
        const res = await fetch('/api/quiz/history', {
          headers: { authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const data: QuizHistoryResponse = await res.json();
          setUserStats(data.stats);
          // Track completed quiz IDs for visual indicators
          const ids = new Set(data.history.map((h: any) => h.quiz_id));
          setCompletedQuizIds(ids);
        }
      }
    } catch (err) {
      console.error('Error fetching user stats:', err);
    }
  }, []);

  // Fetch quizzes
  const fetchQuizzes = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', DEFAULT_PAGINATION.limit.toString());
      
      if (filters.search) params.set('search', filters.search);
      if (filters.subject) params.set('subject', filters.subject);
      if (filters.option) params.set('option', filters.option);
      if (filters.difficulty) params.set('difficulty', filters.difficulty);
      if (filters.duration) params.set('duration', filters.duration);

      const response = await fetch(`/api/quiz?${params.toString()}`);
      const data = await response.json();
      
      if (data.quizzes) {
        setQuizzes(data.quizzes);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les quizzes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [page, filters, toast]);

  // Initial fetch and refetch on filters/page change
  useEffect(() => {
    fetchQuizzes();
    fetchUserStats();
  }, [fetchQuizzes, fetchUserStats]);

  // Handle search
  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPage(1);
  };

  // Handle filter change
  const handleFilterChange = (newFilters: QuizFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  // Handle filter reset
  const handleFilterReset = () => {
    setFilters(DEFAULT_QUIZ_FILTERS);
    setSearchValue('');
    setPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 rounded-2xl bg-gradient-to-r from-exevo-blue to-slate-800 p-6 text-white shadow-lg"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-black md:text-3xl">Quiz Interactifs</h1>
            <p className="mt-1 text-sm text-white/80 md:text-base">
              Teste tes connaissances et améliore ton score.
            </p>
          </div>
          
          <div className="flex flex-col gap-3 sm:flex-row">
            <QuizSearch
              value={searchValue}
              onChange={setSearchValue}
              onSearch={handleSearch}
              className="w-full sm:w-72"
            />
            <Button 
              variant="secondary" 
              onClick={() => setShowStats(!showStats)}
              className={cn(
                'w-full sm:w-auto',
                showStats && 'bg-exevo-orange text-white hover:bg-exevo-orange/90'
              )}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              {showStats ? 'Masquer' : 'Statistiques'}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats panel */}
      {showStats && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6"
        >
          <QuizStatsComponent
            stats={{
              totalQuizzesCompleted: userStats?.total_completed ?? 0,
              averageScore: userStats?.average_score ?? 0,
              bestSubject: userStats?.best_subject ?? '-',
              weakestSubject: userStats?.weakest_subject ?? '-',
              weeklyProgress: [],
            }}
          />
        </motion.div>
      )}

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <QuizFiltersComponent
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleFilterReset}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main>
          {/* Mobile Filters */}
          <div className="mb-4 lg:hidden">
            <QuizFiltersComponent
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleFilterReset}
            />
          </div>

          {/* Results count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {!isLoading && (
                <>
                  <span className="font-medium">{total}</span> quiz{total !== 1 ? 'zes' : ''} trouvé{total !== 1 ? 's' : ''}
                </>
              )}
            </p>
          </div>

          {/* Quizzes List */}
          <QuizList
            quizzes={quizzes}
            isLoading={isLoading}
            total={total}
            page={page}
            limit={DEFAULT_PAGINATION.limit}
            onPageChange={handlePageChange}
            completedQuizIds={completedQuizIds}
          />
        </main>
      </div>

      <Toaster />
    </div>
  );
}
