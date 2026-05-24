'use client';

import { motion } from 'framer-motion';
import { 
  Trophy, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RotateCcw,
  FileText,
  Home
} from 'lucide-react';
import { getResultMessage } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface QuizResultsProps {
  quiz: {
    id: string;
    title: string;
  };
  results: {
    score: number;
    correct_count: number;
    wrong_count: number;
    time_spent_seconds: number;
  };
  onRetry: () => void;
  onHome: () => void;
}

export function QuizResults({ quiz, results, onRetry, onHome }: QuizResultsProps) {
  const { emoji, message } = getResultMessage(results.score);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-md"
    >
      <Card className="overflow-hidden border-0 shadow-xl">
        {/* Header with gradient */}
        <div className="relative overflow-hidden bg-gradient-to-br from-exevo-blue to-slate-800 p-8 text-center text-white">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
          <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/5" />
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
            className="relative mb-4"
          >
            <Trophy className="mx-auto h-16 w-16 text-exevo-orange" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="mb-2 text-5xl font-black">{results.score}%</p>
            <p className="text-xl font-semibold">{emoji} {message}</p>
          </motion.div>
        </div>

        <CardContent className="p-6">
          {/* Stats */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 rounded-lg bg-green-50 p-3 dark:bg-green-900/20"
            >
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {results.correct_count}
                </p>
                <p className="text-xs text-green-600 dark:text-green-500">Bonnes réponses</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3 rounded-lg bg-red-50 p-3 dark:bg-red-900/20"
            >
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                  {results.wrong_count}
                </p>
                <p className="text-xs text-red-600 dark:text-red-500">Mauvaises réponses</p>
              </div>
            </motion.div>
          </div>

          {/* Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-6 flex items-center justify-center gap-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-800"
          >
            <Clock className="h-5 w-5 text-slate-500" />
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Temps utilisé: {formatTime(results.time_spent_seconds)}
            </span>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-3"
          >
            <Button
              onClick={onRetry}
              className="w-full bg-exevo-blue text-white hover:bg-exevo-blue/90"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Recommencer
            </Button>
            <Button
              variant="outline"
              onClick={onHome}
              className="w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Retour aux quizzes
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
