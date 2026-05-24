'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { 
  Exam, 
  ExamFilters, 
  DEFAULT_EXAM_FILTERS, 
  DEFAULT_PAGINATION 
} from '@/types/exam';
import { ExamSearch } from '@/components/exams/ExamSearch';
import { ExamFilters as ExamFiltersComponent } from '@/components/exams/ExamFilters';
import { ExamList } from '@/components/exams/ExamList';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(DEFAULT_PAGINATION.page);
  
  const [filters, setFilters] = useState<ExamFilters>(DEFAULT_EXAM_FILTERS);
  const [searchValue, setSearchValue] = useState('');
  
  const { toast } = useToast();

  // Fetch exams
  const fetchExams = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', DEFAULT_PAGINATION.limit.toString());
      
      if (filters.search) params.set('search', filters.search);
      if (filters.year) params.set('year', filters.year.toString());
      if (filters.subject) params.set('subject', filters.subject);
      if (filters.option) params.set('option', filters.option);
      if (filters.difficulty) params.set('difficulty', filters.difficulty);

      const response = await fetch(`/api/exams?${params.toString()}`);
      const data = await response.json();
      
      if (data.exams) {
        setExams(data.exams);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les examens',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [page, filters, toast]);

  // Initial fetch and refetch on filters/page change
  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  // Handle search
  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPage(1);
  };

  // Handle filter change
  const handleFilterChange = (newFilters: ExamFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  // Handle filter reset
  const handleFilterReset = () => {
    setFilters(DEFAULT_EXAM_FILTERS);
    setSearchValue('');
    setPage(1);
  };

  // Handle favorite
  const handleFavorite = async (id: string) => {
    const exam = exams.find(e => e.id === id);
    if (!exam) return;

    try {
      // Toggle favorite (local state for demo)
      setExams(prev => prev.map(e => 
        e.id === id ? { ...e, is_favorite: !e.is_favorite } : e
      ));

      toast({
        title: exam.is_favorite ? 'Retiré des favoris' : 'Ajouté aux favoris',
        description: exam.is_favorite 
          ? 'Examen retiré de vos favoris' 
          : 'Examen ajouté à vos favoris',
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier les favoris',
        variant: 'destructive',
      });
    }
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
            <h1 className="text-2xl font-black md:text-3xl">Anciens Examens</h1>
            <p className="mt-1 text-sm text-white/80 md:text-base">
              Retrouve tous les anciens examens Exetat et révise plus efficacement.
            </p>
          </div>
          
          <div className="flex flex-col gap-3 sm:flex-row">
            <ExamSearch
              value={searchValue}
              onChange={setSearchValue}
              onSearch={handleSearch}
              className="w-full sm:w-72"
            />
            <Button variant="secondary" className="w-full sm:w-auto">
              <Heart className="mr-2 h-4 w-4" />
              Favoris
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <ExamFiltersComponent
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
            <ExamFiltersComponent
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
                  <span className="font-medium">{total}</span> examen{total !== 1 ? 's' : ''} trouvé{total !== 1 ? 's' : ''}
                </>
              )}
            </p>
          </div>

          {/* Exams List */}
          <ExamList
            exams={exams}
            isLoading={isLoading}
            total={total}
            page={page}
            limit={DEFAULT_PAGINATION.limit}
            onPageChange={handlePageChange}
            onFavorite={handleFavorite}
          />
        </main>
      </div>

      <Toaster />
    </div>
  );
}
