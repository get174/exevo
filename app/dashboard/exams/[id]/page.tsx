'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  Heart, 
  Play, 
  Calendar, 
  BookOpen, 
  TrendingUp,
  FileText,
} from 'lucide-react';
import { Exam } from '@/types/exam';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ExamDetailPageProps {
  params: { id: string };
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

// Skeleton component - must be defined before it's used
function ExamDetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl space-y-6">
        <Skeleton className="h-4 w-32" />
        
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />
          
          <div className="mb-4 flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          
          <Skeleton className="mb-4 h-8 w-3/4 rounded-lg" />
          
          <div className="mb-6 flex gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
          
          <div className="mb-6 h-16 w-full rounded-lg" />
          
          <div className="flex gap-3">
            <Skeleton className="h-10 w-40 rounded-lg" />
            <Skeleton className="h-10 w-40 rounded-lg" />
            <Skeleton className="h-10 w-40 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExamDetailPage({ params }: ExamDetailPageProps) {
  const { id } = params;
  const router = useRouter();
  const { toast } = useToast();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExam = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/exams/${id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Examen non trouvé');
        }
        
        setExam(data);
      } catch (err) {
        console.error('Error fetching exam:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExam();
  }, [id]);

  const handleDownload = () => {
    if (!exam) return;
    
    toast({
      title: 'Téléchargement',
      description: `Téléchargement de ${exam.title}...`,
    });
  };

  const handleFavorite = () => {
    if (!exam) return;
    
    setExam(prev => prev ? { ...prev, is_favorite: !prev.is_favorite } : null);
    
    toast({
      title: exam.is_favorite ? 'Retiré des favoris' : 'Ajouté aux favoris',
      description: exam.is_favorite 
        ? 'Examen retiré de vos favoris' 
        : 'Examen ajouté à vos favoris',
    });
  };

  const handleStartQuiz = () => {
    toast({
      title: 'Quiz',
      description: 'Quiz associé à venir',
    });
  };

  if (isLoading) {
    return <ExamDetailSkeleton />;
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <FileText className="h-10 w-10 text-red-500" />
            </div>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            Examen non trouvé
          </h1>
          <p className="mb-6 text-slate-500 dark:text-slate-400">
            {error || 'Cet examen n\'existe pas ou a été supprimé.'}
          </p>
          <Link href="/dashboard/exams">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux examens
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl">
        <Link 
          href="/dashboard/exams"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-exevo-blue dark:text-slate-400 dark:hover:text-exevo-orange"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux examens
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
              <div className="flex h-full items-center justify-center">
                <FileText className="h-24 w-24 text-slate-300 dark:text-slate-600" />
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              <Badge className={cn('text-xs font-medium', subjectColors[exam.subject] || 'bg-slate-100')}>
                {exam.subject}
              </Badge>
              <Badge className={cn('text-xs font-medium', difficultyColors[exam.difficulty as keyof typeof difficultyColors])}>
                {exam.difficulty}
              </Badge>
            </div>

            <h1 className="mb-4 text-2xl font-black text-slate-900 dark:text-slate-100">
              {exam.title}
            </h1>

            <div className="mb-6 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {exam.year}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                {exam.option}
              </span>
              <span className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4" />
                {exam.downloads_count.toLocaleString('fr-FR')} téléchargements
              </span>
            </div>

            {exam.description && (
              <p className="mb-6 text-slate-600 dark:text-slate-300">
                {exam.description}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <Button 
                className="flex-1 bg-exevo-blue text-white hover:bg-exevo-blue/90 sm:flex-none"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger PDF
              </Button>
              <Button 
                variant="outline"
                onClick={handleFavorite}
                className={cn(
                  'flex-1 sm:flex-none',
                  exam.is_favorite && 'border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400'
                )}
              >
                <Heart className={cn(
                  'mr-2 h-4 w-4',
                  exam.is_favorite && 'fill-current'
                )} />
                {exam.is_favorite ? 'Favori' : 'Ajouter favori'}
              </Button>
              <Button 
                variant="outline"
                onClick={handleStartQuiz}
                className="flex-1 sm:flex-none"
              >
                <Play className="mr-2 h-4 w-4" />
                Commencer quiz
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
              Examens similaires
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Examens similaires à venir...
            </p>
          </div>
        </motion.div>
      </div>

      <Toaster />
    </div>
  );
}
