'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Medal, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import {
  Podium,
  PodiumSkeleton,
  LeaderboardTable,
  LeaderboardTableEmpty,
  LeaderboardFiltersComponent,
  MyPosition,
  MyPositionSkeleton,
  Badges,
  BadgesSkeleton,
} from '@/components/leaderboard';

import {
  SAMPLE_LEADERBOARD,
  SAMPLE_BADGES,
  EARNED_BADGES,
  SAMPLE_MY_POSITION,
  DEFAULT_FILTERS,
  type LeaderboardFilters,
  type LeaderboardEntry,
} from '@/types/leaderboard';

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

export default function LeaderboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [filters, setFilters] = useState<LeaderboardFilters>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Simulate data fetching
  const fetchLeaderboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // In real app, this would be a Supabase query:
      // const { data, error } = await supabase
      //   .from('leaderboard')
      //   .select(`
      //     id,
      //     user_id,
      //     score,
      //     province,
      //     school,
      //     option,
      //     level,
      //     profiles:user_id(full_name, avatar_url)
      //   `)
      //   .order('score', { ascending: false })
      //   .range((page - 1) * itemsPerPage, page * itemsPerPage);

      // Filter data based on filters
      let filteredData = [...SAMPLE_LEADERBOARD];

      if (filters.province) {
        filteredData = filteredData.filter((entry) => entry.province === filters.province);
      }
      if (filters.option) {
        filteredData = filteredData.filter((entry) => entry.option === filters.option);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(
          (entry) =>
            entry.full_name.toLowerCase().includes(searchLower) ||
            entry.school.toLowerCase().includes(searchLower)
        );
      }

      // Apply period filter (in real app, this would be done server-side with date filtering)
      // For demo, all data is shown
      void filters.period;

      setLeaderboardData(filteredData);
      toast.success('Classement mis à jour', {
        icon: <RefreshCw className="h-4 w-4" />,
      });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast.error('Erreur lors du chargement du classement');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLeaderboardData();
  }, [fetchLeaderboardData]);

  // Get top 3 for podium
  const topThree = leaderboardData.slice(0, 3);

  // Get remaining entries for table (from rank 4)
  const tableEntries = leaderboardData.slice(3);

  // Pagination for table entries
  const totalTableEntries = tableEntries.length;
  const totalPages = Math.ceil(totalTableEntries / itemsPerPage);
  const paginatedEntries = tableEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Add rank to entries (starting from 4)
  const entriesWithRank = paginatedEntries.map((entry, index) => ({
    ...entry,
    rank: (currentPage - 1) * itemsPerPage + index + 4,
  }));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-exevo-blue to-exevo-blue/90 text-white">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
              <Medal className="h-6 w-6 text-exevo-orange" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">Classement</h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-200 text-sm sm:text-base"
          >
            Compare tes performances avec d&apos;autres élèves.
          </motion.p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <LeaderboardFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            onRefresh={fetchLeaderboardData}
            isLoading={isLoading}
          />
        </motion.div>

        {/* My Position Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {isLoading ? (
            <MyPositionSkeleton />
          ) : (
            <MyPosition data={SAMPLE_MY_POSITION} />
          )}
        </motion.div>

        {/* Podium Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 overflow-hidden">
            <div className="bg-gradient-to-r from-exevo-blue to-exevo-blue/90 px-6 py-4">
              <h2 className="text-lg font-bold text-white">Top 3 Podium</h2>
            </div>
            <div className="py-4">
              {isLoading ? (
                <PodiumSkeleton />
              ) : topThree.length >= 3 ? (
                <Podium topThree={topThree} />
              ) : (
                <div className="flex items-center justify-center h-48 text-slate-500">
                  Pas assez de participants pour le podium
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Full Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
              Classement Complet
            </h2>
            {isLoading ? (
              <LeaderboardTable entries={[]} isLoading />
            ) : entriesWithRank.length > 0 ? (
              <>
                <LeaderboardTable entries={entriesWithRank} />
                {totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent className="flex-wrap justify-center">
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                          const page = index + 1;
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => handlePageChange(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <LeaderboardTableEmpty />
            )}
          </div>
        </motion.div>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {isLoading ? (
            <BadgesSkeleton />
          ) : (
            <Badges earnedBadges={EARNED_BADGES} allBadges={SAMPLE_BADGES} />
          )}
        </motion.div>
      </div>
    </div>
  );
}
