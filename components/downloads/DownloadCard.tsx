'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, Trash2, Heart, Calendar, HardDrive } from 'lucide-react';
import type { Exam } from '@/types/downloads';
import { formatFileSize, formatDate } from '@/types/downloads';

interface DownloadCardProps {
  exam: Exam;
  downloadedAt?: string;
  isFavorite?: boolean;
  onOpen?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
  onToggleFavorite?: () => void;
  showFavoriteButton?: boolean;
  showDeleteButton?: boolean;
  showDownloadButton?: boolean;
  isLoading?: boolean;
}

const difficultyColors = {
  Facile: 'bg-green-500/10 text-green-600 border-green-500/30',
  Moyen: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30',
  Difficile: 'bg-red-500/10 text-red-600 border-red-500/30',
};

export function DownloadCard({
  exam,
  downloadedAt,
  isFavorite = false,
  onOpen,
  onDownload,
  onDelete,
  onToggleFavorite,
  showFavoriteButton = false,
  showDeleteButton = true,
  showDownloadButton = true,
  isLoading = false,
}: DownloadCardProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="h-20 w-16 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="overflow-hidden border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* PDF Thumbnail */}
            <div className="relative flex-shrink-0">
              <div className="h-20 w-16 rounded-lg bg-gradient-to-br from-exevo-blue to-exevo-blue/80 flex items-center justify-center shadow-md">
                <FileText className="h-8 w-8 text-white/90" />
              </div>
              {/* Favorite indicator */}
              {isFavorite && (
                <div className="absolute -top-1 -right-1 h-5 w-5 bg-exevo-orange rounded-full flex items-center justify-center">
                  <Heart className="h-3 w-3 text-white fill-white" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-700 dark:text-slate-200 truncate">
                    {exam.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {exam.subject}
                  </p>
                </div>
                <Badge
                  className={`${difficultyColors[exam.difficulty]} flex-shrink-0 text-xs`}
                >
                  {exam.difficulty}
                </Badge>
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {exam.year}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {exam.option}
                </Badge>
                {exam.file_size && (
                  <span className="flex items-center gap-1">
                    <HardDrive className="h-3 w-3" />
                    {formatFileSize(exam.file_size)}
                  </span>
                )}
                {downloadedAt && (
                  <span className="text-exevo-orange">
                    Téléchargé le {formatDate(downloadedAt)}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-3">
                <Button
                  size="sm"
                  onClick={onOpen}
                  className="bg-exevo-blue hover:bg-exevo-blue/90 text-white"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ouvrir
                </Button>

                {showDownloadButton && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onDownload}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Télécharger
                  </Button>
                )}

                {showFavoriteButton && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onToggleFavorite}
                    className={isFavorite ? 'text-exevo-orange' : 'text-slate-500'}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${isFavorite ? 'fill-exevo-orange' : ''}`} />
                    {isFavorite ? 'Retirer' : 'Favori'}
                  </Button>
                )}

                {showDeleteButton && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onDelete}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Skeleton loader
export function DownloadCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="h-20 w-16 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
