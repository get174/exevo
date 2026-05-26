'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const FAVORITES_STORAGE_KEY = 'exevo_favorites';

// Local storage helpers for favorites persistence
function getStoredFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    console.error('Failed to save favorites to localStorage');
  }
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(DEFAULT_PAGINATION.page);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionLoaded, setSessionLoaded] = useState(false);

  const [filters, setFilters] = useState<ExamFilters>(DEFAULT_EXAM_FILTERS);
  const [searchInput, setSearchInput] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  const { toast } = useToast();

  // Load session and favorites on mount
  useEffect(() => {
    async function loadFavorites() {
      if (!isSupabaseConfigured() || !supabase) {
        // Demo mode - use localStorage only
        const stored = getStoredFavorites();
        setFavoriteIds(stored);
        setSessionLoaded(true);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setIsAuthenticated(true);

          // Fetch favorites from API
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const token = session.access_token;
            const response = await fetch('/api/exams/favorites', {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
              const data = await response.json();
              if (data.favorites && data.favorites.length > 0) {
                setFavoriteIds(data.favorites);
                saveFavorites(data.favorites);
                return;
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading session:', error);
      }

      // Fallback to localStorage
      const stored = getStoredFavorites();
      setFavoriteIds(stored);
      setSessionLoaded(true);
    }

    loadFavorites();
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters(prev => ({ ...prev, search: searchInput }));
        setPage(1);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset search when clearing input
  useEffect(() => {
    if (searchInput === '' && filters.search !== '') {
      setFilters(prev => ({ ...prev, search: '' }));
      setPage(1);
    }
  }, [searchInput]);

  // Fetch exams
  const fetchExams = useCallback(async () => {
    setIsLoading(true);
    setError(null);
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
      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();

      if (data.exams) {
        // Merge with stored favorites (localStorage takes precedence for persistence)
        const mergedExams = data.exams.map((exam: Exam) => ({
          ...exam,
          is_favorite: favoriteIds.includes(exam.id) || exam.is_favorite
        }));

        // Filter favorites locally if needed
        let filteredExams = mergedExams;
        if (showFavorites) {
          filteredExams = mergedExams.filter((exam: Exam) => exam.is_favorite);
          setTotal(showFavorites ? filteredExams.length : data.total);
        } else {
          setTotal(data.total);
        }
        setExams(filteredExams);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
      setError('Impossible de charger les examens. Veuillez réessayer.');
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les examens',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [page, filters, showFavorites, favoriteIds, toast]);

  // Initial fetch and refetch on filters/page change
  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  // Handle filter change
  const handleFilterChange = (newFilters: ExamFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  // Handle filter reset
  const handleFilterReset = () => {
    setFilters(DEFAULT_EXAM_FILTERS);
    setSearchInput('');
    setPage(1);
  };

  // Handle favorite toggle
  const handleFavorite = useCallback(async (id: string) => {
    const exam = exams.find(e => e.id === id);
    if (!exam) return;

    const wasFavorite = favoriteIds.includes(id);
    const newFavoriteIds = wasFavorite
      ? favoriteIds.filter(fId => fId !== id)
      : [...favoriteIds, id];

    // Optimistic update - both local state and localStorage
    setFavoriteIds(newFavoriteIds);
    saveFavorites(newFavoriteIds);

    setExams(prev => prev.map(e =>
      e.id === id ? { ...e, is_favorite: !wasFavorite } : e
    ));

    // If we're showing favorites, remove the unfavorited exam from view
    if (showFavorites && wasFavorite) {
      setExams(prev => prev.filter(e => e.id !== id));
      setTotal(prev => prev - 1);
    }

    try {
      // Build auth headers
      const headers: HeadersInit = { 'Content-Type': 'application/json' };

      if (isAuthenticated && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          headers.Authorization = `Bearer ${session.access_token}`;
        }
      }

      const response = await fetch('/api/exams/favorites', {
        method: 'POST',
        headers,
        body: JSON.stringify({ exam_id: id }),
      });

      if (response.status === 401) {
        toast({
          title: 'Connexion requise',
          description: 'Connectez-vous pour synchroniser vos favoris sur tous vos appareils.',
          variant: 'destructive',
        });
      } else if (!response.ok) {
        throw new Error('Failed to save favorite');
      }

      toast({
        title: wasFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris',
        description: isAuthenticated
          ? 'Favori synchronisé avec votre compte'
          : 'Favori sauvegardé localement',
      });
    } catch (error) {
      // Revert on error
      setFavoriteIds(favoriteIds);
      saveFavorites(favoriteIds);
      setExams(prev => prev.map(e =>
        e.id === id ? { ...e, is_favorite: wasFavorite } : e
      ));
      console.error('Error toggling favorite:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier les favoris',
        variant: 'destructive',
      });
    }
  }, [exams, showFavorites, favoriteIds, toast, isAuthenticated, supabase]);

  // Handle page change
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(
      (value) => value !== null && value !== '' && value !== undefined
    ).length;
  }, [filters]);

  // Toggle favorites filter
  const toggleFavorites = useCallback(() => {
    setShowFavorites(prev => !prev);
    setPage(1);
  }, []);

  // Favorites count for badge (from persistent storage)
  const favoritesCount = favoriteIds.length;

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
              value={searchInput}
              onChange={setSearchInput}
              onSearch={(v) => setSearchInput(v)}
              className="w-full sm:w-72"
            />
            <Button
              variant={showFavorites ? 'default' : 'secondary'}
              className={`w-full sm:w-auto ${showFavorites ? 'bg-exevo-orange hover:bg-exevo-orange/90' : ''}`}
              onClick={toggleFavorites}
            >
              <Heart className={`mr-2 h-4 w-4 ${showFavorites ? 'fill-white' : ''}`} />
              Favoris
              {favoritesCount > 0 && (
                <span className="ml-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-xs">
                  {favoritesCount}
                </span>
              )}
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

          {/* Results count and active filters */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {!isLoading && !error && (
                showFavorites ? (
                  <>
                    <span className="font-medium">{total}</span> examen{total !== 1 ? 's' : ''} dans vos favoris
                  </>
                ) : (
                  <>
                    <span className="font-medium">{total}</span> examen{total !== 1 ? 's' : ''} trouvé{total !== 1 ? 's' : ''}
                    {activeFiltersCount > 0 && <span className="text-exevo-blue"> (filtres actifs: {activeFiltersCount})</span>}
                  </>
                )
              )}
            </p>
            {error && (
              <Button variant="outline" size="sm" onClick={fetchExams}>
                Réessayer
              </Button>
            )}
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
