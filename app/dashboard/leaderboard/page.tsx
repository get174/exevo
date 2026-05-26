'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Medal, RefreshCw, Share2, Trophy, TrendingUp, TrendingDown } from 'lucide-react';
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
  DailyChallenges,
  DailyChallengesSkeleton,
  SchoolLeaderboard,
  SchoolLeaderboardSkeleton,
} from '@/components/leaderboard';

import { DEFAULT_FILTERS, type LeaderboardFilters, type LeaderboardEntry, type MyPosition as MyPositionType, type Badge as BadgeType, type UserBadge } from '@/types/leaderboard';

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function LeaderboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [myPosition, setMyPosition] = useState<MyPositionType | null>(null);
  const [filters, setFilters] = useState<LeaderboardFilters>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState<'global' | 'province' | 'option'>('global');
  const [allBadges, setAllBadges] = useState<BadgeType[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<UserBadge[]>([]);
  const itemsPerPage = 10;

  // Fetch leaderboard data from API
  const fetchLeaderboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.province) params.set('province', filters.province);
      if (filters.option) params.set('option', filters.option);
      if (filters.period) params.set('period', filters.period);
      params.set('limit', '50');
      params.set('offset', '0');

      const response = await fetch(`/api/leaderboard?${params.toString()}`);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setLeaderboardData(data.leaderboard || []);
      setTotalCount(data.total || data.leaderboard?.length || 0);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLeaderboardData([]);
      setTotalCount(0);
      toast.error('Erreur lors du chargement du classement');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Fetch my position from API
  const fetchMyPosition = useCallback(async () => {
    try {
      const response = await fetch('/api/leaderboard', { method: 'PUT' });
      const data = await response.json();

      if (!data.error && data.rank) {
        setMyPosition({
          rank: data.rank,
          score: data.score,
          pointsToNextRank: data.pointsToNextRank,
          nextPlayerName: data.nextPlayerName,
          provinceRank: data.provinceRank,
          optionRank: data.optionRank,
          weeklyProgress: data.weeklyProgress,
          dailyProgress: data.dailyProgress,
        });
      } else {
        setMyPosition(null);
      }
    } catch (error) {
      console.error('Error fetching my position:', error);
      setMyPosition(null);
    }
  }, []);

  // Fetch badges from API
  const fetchBadges = useCallback(async () => {
    try {
      const response = await fetch('/api/leaderboard/badges');
      const data = await response.json();

      if (!data.error) {
        setAllBadges(data.allBadges || []);
        setEarnedBadges(data.earnedBadges || []);
      }
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboardData();
    fetchMyPosition();
    fetchBadges();
  }, [fetchLeaderboardData, fetchMyPosition, fetchBadges]);

  // Client-side filtering for search
  const filteredData = useMemo(() => {
    let data = [...leaderboardData];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      data = data.filter(
        (entry) =>
          entry.full_name?.toLowerCase().includes(searchLower) ||
          entry.school?.toLowerCase().includes(searchLower)
      );
    }

    return data;
  }, [leaderboardData, filters.search]);

  // Get top 3 for podium
  const topThree = filteredData.slice(0, 3);

  // Get remaining entries for table (from rank 4)
  const tableEntries = filteredData.slice(3);

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

  // Share functionality
  const handleShare = async () => {
    const shareText = `Je suis classé(e) #${myPosition?.rank || '?'} sur ExetatApp ! 🎯\n\nRejoins-moi sur exetatapp.app pour améliorer ton classement!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mon classement ExetatApp',
          text: shareText,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success('Classement copié dans le presse-papier !');
    }
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

          {/* View Mode Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-2 mt-4"
          >
            <Button
              size="sm"
              variant={viewMode === 'global' ? 'secondary' : 'outline'}
              onClick={() => setViewMode('global')}
              className={`text-xs ${viewMode === 'global' ? 'bg-white text-exevo-blue' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
            >
              Global
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'province' ? 'secondary' : 'outline'}
              onClick={() => setViewMode('province')}
              className={`text-xs ${viewMode === 'province' ? 'bg-white text-exevo-blue' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
            >
              Par Province
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'option' ? 'secondary' : 'outline'}
              onClick={() => setViewMode('option')}
              className={`text-xs ${viewMode === 'option' ? 'bg-white text-exevo-blue' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
            >
              Par Option
            </Button>
          </motion.div>
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

        {/* My Position Card with Share */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex gap-4"
        >
          <div className="flex-1">
            {isLoading ? (
              <MyPositionSkeleton />
            ) : myPosition ? (
              <MyPosition data={myPosition} />
            ) : (
              <MyPosition
                data={{
                  rank: totalCount + 1,
                  score: 0,
                  pointsToNextRank: 0,
                  nextPlayerName: null,
                  provinceRank: 1,
                  optionRank: 1,
                  weeklyProgress: 0,
                  dailyProgress: 0,
                }}
              />
            )}
          </div>

          {/* Share Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="hidden sm:flex flex-col gap-2"
          >
            <Button
              onClick={handleShare}
              variant="outline"
              className="h-full px-4 rounded-xl border-exevo-orange/30 hover:bg-exevo-orange/10"
            >
              <Share2 className="h-4 w-4 mr-2 text-exevo-orange" />
              <span className="text-exevo-orange font-medium">Partager</span>
            </Button>

            {/* Quick Stats */}
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <Badge variant="outline" className="text-xs">
                {totalCount} participants
              </Badge>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span>+{myPosition?.weeklyProgress || 0} cette semaine</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Daily Challenges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <DailyChallengesSkeleton />
        </motion.div>

        {/* Podium Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 overflow-hidden">
            <div className="bg-gradient-to-r from-exevo-blue to-exevo-blue/90 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Top 3 Podium</h2>
              <Badge className="bg-white/20 text-white border-0">
                {viewMode === 'global' ? 'Classement Global' : viewMode === 'province' ? `Top ${filters.province || 'Province'}` : `Top ${filters.option || 'Option'}`}
              </Badge>
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

        {/* School Leaderboard Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          {isLoading ? (
            <SchoolLeaderboardSkeleton />
          ) : (
            <SchoolLeaderboard entries={leaderboardData} />
          )}
        </motion.div>

        {/* Full Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
                Classement Complet
              </h2>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Trophy className="h-3 w-3 text-yellow-500" /> Top 10
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" /> En hausse
                </span>
                <span className="flex items-center gap-1">
                  <TrendingDown className="h-3 w-3 text-red-500" /> En baisse
                </span>
              </div>
            </div>
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
            <Badges earnedBadges={earnedBadges} allBadges={allBadges} />
          )}
        </motion.div>
      </div>
    </div>
  );
}
