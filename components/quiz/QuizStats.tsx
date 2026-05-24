'use client';

import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  Award, 
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { QuizStats as QuizStatsType } from '@/types/quiz';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface QuizStatsProps {
  stats: QuizStatsType;
}

export function QuizStats({ stats }: QuizStatsProps) {
  return (
    <Card className="border border-slate-200 dark:border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-exevo-blue" />
          Mes statistiques
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Total completed */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  Quiz complétés
                </p>
                <p className="text-sm text-slate-500">Total cette semaine</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {stats.totalQuizzesCompleted}
            </Badge>
          </motion.div>

          {/* Average score */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  Score moyen
                </p>
                <p className="text-sm text-slate-500">Sur tous vos quiz</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {stats.averageScore}%
            </Badge>
          </motion.div>

          {/* Best subject */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  Meilleure matière
                </p>
                <p className="text-sm text-slate-500">Votre point fort</p>
              </div>
            </div>
            <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
              {stats.bestSubject}
            </Badge>
          </motion.div>

          {/* Weakest subject */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  À améliorer
                </p>
                <p className="text-sm text-slate-500">Matière à travailler</p>
              </div>
            </div>
            <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
              {stats.weakestSubject}
            </Badge>
          </motion.div>

          {/* Weekly progress chart */}
          <div className="pt-4">
            <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              Progression hebdomadaire
            </p>
            <div className="flex h-24 items-end gap-2">
              {stats.weeklyProgress.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ height: 0 }}
                  animate={{ height: `${day.score}%` }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex-1 rounded-t-md bg-exevo-orange"
                  title={`${day.day}: ${day.score}%`}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-slate-500">
              {stats.weeklyProgress.map((day) => (
                <span key={day.day}>{day.day}</span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
