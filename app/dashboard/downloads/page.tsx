'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Download as DownloadIcon, RefreshCw, FolderArchive } from 'lucide-react';

import {
  DownloadsTabs,
} from '@/components/downloads';

import {
  SAMPLE_DOWNLOADS,
  SAMPLE_FAVORITES,
  SAMPLE_ACTIVITY_LOGS,
  type DownloadedExam as Download,
  type Favorite,
  type ActivityLog,
  type Exam,
} from '@/types/downloads';

export default function DownloadsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  // Simulate data fetching
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      // In real app, this would be Supabase queries
      // const { data: downloadsData } = await supabase
      //   .from('downloads')
      //   .select('*, exam:exam_id(*)')
      //   .order('downloaded_at', { ascending: false });

      setDownloads(SAMPLE_DOWNLOADS);
      setFavorites(SAMPLE_FAVORITES);
      setActivities(SAMPLE_ACTIVITY_LOGS);

      toast.success('Données actualisées');
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handlers
  const handleOpenExam = (exam: Exam) => {
    toast.success(`Ouverture de "${exam.title}"`);
    // In real app: window.open(exam.pdf_url, '_blank');
  };

  const handleDownloadExam = (exam: Exam) => {
    toast.success(`Téléchargement de "${exam.title}"`);
    // In real app: trigger download
  };

  const handleDeleteDownload = (downloadId: string) => {
    setDownloads((prev) => prev.filter((d) => d.id !== downloadId));
    toast.success('Téléchargement supprimé');
  };

  const handleToggleFavorite = (examId: string) => {
    const isFavorite = favorites.some((f) => f.exam_id === examId);

    if (isFavorite) {
      setFavorites((prev) => prev.filter((f) => f.exam_id !== examId));
      toast.success('Retiré des favoris');
    } else {
      const newFavorite: Favorite = {
        id: `f${Date.now()}`,
        user_id: 'u1',
        exam_id: examId,
        created_at: new Date().toISOString(),
        exam: downloads.find((d) => d.exam_id === examId)?.exam,
      };
      setFavorites((prev) => [newFavorite, ...prev]);
      toast.success('Ajouté aux favoris');
    }
  };

  const handleRemoveFavorite = (favoriteId: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
    toast.success('Retiré des favoris');
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
              <FolderArchive className="h-6 w-6 text-exevo-orange" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">Téléchargements</h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-200 text-sm sm:text-base"
          >
            Retrouve tous tes examens et fichiers enregistrés.
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <DownloadsTabs
            downloads={downloads}
            favorites={favorites}
            activities={activities}
            isLoading={isLoading}
            onOpenExam={handleOpenExam}
            onDownloadExam={handleDownloadExam}
            onDeleteDownload={handleDeleteDownload}
            onToggleFavorite={handleToggleFavorite}
            onRemoveFavorite={handleRemoveFavorite}
          />
        </motion.div>
      </div>
    </div>
  );
}
