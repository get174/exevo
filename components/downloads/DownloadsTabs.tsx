'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DownloadCard, DownloadCardSkeleton } from './DownloadCard';
import { ActivityCard } from './ActivityCard';
import { EmptyState } from './EmptyState';
import type { Download, Favorite, ActivityLog, Exam } from '@/types/downloads';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, ArrowUpDown, Download as DownloadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DownloadsTabsProps {
  downloads: Download[];
  favorites: Favorite[];
  activities: ActivityLog[];
  isLoading?: boolean;
  onOpenExam?: (exam: Exam) => void;
  onDownloadExam?: (exam: Exam) => void;
  onDeleteDownload?: (downloadId: string) => void;
  onToggleFavorite?: (examId: string) => void;
  onRemoveFavorite?: (favoriteId: string) => void;
}

export function DownloadsTabs({
  downloads,
  favorites,
  activities,
  isLoading = false,
  onOpenExam,
  onDownloadExam,
  onDeleteDownload,
  onToggleFavorite,
  onRemoveFavorite,
}: DownloadsTabsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');

  // Filter and sort downloads
  const filteredDownloads = downloads
    .filter((d) =>
      d.exam?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.exam?.subject.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.downloaded_at).getTime();
      const dateB = new Date(b.downloaded_at).getTime();
      return sortOrder === 'recent' ? dateB - dateA : dateA - dateB;
    });

  // Filter and sort favorites
  const filteredFavorites = favorites
    .filter((f) =>
      f.exam?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.exam?.subject.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'recent' ? dateB - dateA : dateA - dateB;
    });

  // Filter and sort activities
  const filteredActivities = activities
    .filter((a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'recent' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="space-y-6">
      {/* Search and Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Rechercher un examen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          />
        </div>

        <Button
          variant="outline"
          onClick={() => setSortOrder(sortOrder === 'recent' ? 'oldest' : 'recent')}
          className="h-11 rounded-xl"
        >
          <ArrowUpDown className="h-4 w-4 mr-2" />
          {sortOrder === 'recent' ? 'Plus récents' : 'Plus anciens'}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="downloads" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          <TabsTrigger
            value="downloads"
            className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm"
          >
            <DownloadIcon className="h-4 w-4 mr-2" />
            Téléchargés
            {filteredDownloads.length > 0 && (
              <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-exevo-orange text-white text-xs">
                {filteredDownloads.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="favorites"
            className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm"
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            Favoris
            {filteredFavorites.length > 0 && (
              <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-exevo-orange text-white text-xs">
                {filteredFavorites.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm"
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Historique
          </TabsTrigger>
        </TabsList>

        {/* Downloads Tab */}
        <TabsContent value="downloads" className="mt-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {[1, 2, 3].map((i) => (
                  <DownloadCardSkeleton key={i} />
                ))}
              </motion.div>
            ) : filteredDownloads.length === 0 ? (
              <EmptyState
                type="downloads"
                message="Aucun téléchargement disponible"
              />
            ) : (
              <motion.div
                key="downloads"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {filteredDownloads.map((download, index) => (
                  <motion.div
                    key={download.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <DownloadCard
                      exam={download.exam!}
                      downloadedAt={download.downloaded_at}
                      onOpen={() => onOpenExam?.(download.exam!)}
                      onDownload={() => onDownloadExam?.(download.exam!)}
                      onDelete={() => onDeleteDownload?.(download.id)}
                      showFavoriteButton
                      onToggleFavorite={() => onToggleFavorite?.(download.exam_id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        {/* Favorites Tab */}
        <TabsContent value="favorites" className="mt-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {[1, 2].map((i) => (
                  <DownloadCardSkeleton key={i} />
                ))}
              </motion.div>
            ) : filteredFavorites.length === 0 ? (
              <EmptyState
                type="favorites"
                message="Aucun favori disponible"
              />
            ) : (
              <motion.div
                key="favorites"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {filteredFavorites.map((favorite, index) => (
                  <motion.div
                    key={favorite.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <DownloadCard
                      exam={favorite.exam!}
                      downloadedAt={favorite.created_at}
                      isFavorite
                      onOpen={() => onOpenExam?.(favorite.exam!)}
                      onToggleFavorite={() => onToggleFavorite?.(favorite.exam_id)}
                      onDelete={() => onRemoveFavorite?.(favorite.id)}
                      showFavoriteButton
                      showDeleteButton
                      showDownloadButton={false}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
                ))}
              </motion.div>
            ) : filteredActivities.length === 0 ? (
              <EmptyState
                type="history"
                message="Aucune activité récente"
              />
            ) : (
              <motion.div
                key="history"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {filteredActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ActivityCard activity={activity} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
}
