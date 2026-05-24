'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, Target, Flame, ArrowUp, Zap } from 'lucide-react';
import type { MyPosition as MyPositionType } from '@/types/leaderboard';

interface MyPositionProps {
  data: MyPositionType;
  isLoading?: boolean;
}

export function MyPosition({ data, isLoading }: MyPositionProps) {
  if (isLoading) {
    return (
      <Card className="border-exevo-orange/30 bg-gradient-to-br from-exevo-orange/5 to-transparent">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-3 flex-1">
              <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              <div className="h-10 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            </div>
            <div className="h-20 w-20 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const progressToNextRank = data.pointsToNextRank > 0
    ? Math.min((data.score / (data.score + data.pointsToNextRank)) * 100, 100)
    : 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-exevo-orange/30 bg-gradient-to-br from-exevo-orange/5 to-transparent overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-exevo-orange/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-exevo-blue/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <CardContent className="pt-6 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Left: Position Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-exevo-orange" />
                <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200">
                  Votre Classement
                </h3>
              </div>

              {/* Main Position Display */}
              <div className="flex items-baseline gap-3">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-5xl font-black text-exevo-blue dark:text-white"
                >
                  #{data.rank}
                </motion.span>
                <Badge className="bg-exevo-blue/10 text-exevo-blue text-lg px-3 py-1">
                  {data.score.toLocaleString()} pts
                </Badge>
              </div>

              {/* Next Player Info */}
              {data.nextPlayerName && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
                >
                  <ArrowUp className="h-4 w-4 text-green-500" />
                  <span>
                    Encore{' '}
                    <span className="font-bold text-exevo-orange">
                      {data.pointsToNextRank} points
                    </span>{' '}
                    pour dépasser {data.nextPlayerName}
                  </span>
                </motion.div>
              )}

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Progression vers le suivant</span>
                  <span>{Math.round(progressToNextRank)}%</span>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <Progress
                    value={progressToNextRank}
                    className="h-2 rounded-full [&>div]:bg-gradient-to-r [&>div]:from-exevo-orange [&>div]:to-exevo-light-orange"
                  />
                </motion.div>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-500 dark:text-slate-400">Rang province:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">#{data.provinceRank}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-500 dark:text-slate-400">Rang option:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">#{data.optionRank}</span>
                </div>
              </div>
            </div>

            {/* Right: Progress Avatars */}
            <div className="flex flex-col items-center gap-4">
              {/* Weekly Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center p-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700"
              >
                <Flame className="h-6 w-6 text-orange-500 mb-2" />
                <span className="text-2xl font-black text-exevo-blue dark:text-white">
                  +{data.weeklyProgress}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">cette semaine</span>
              </motion.div>

              {/* Daily Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center p-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700"
              >
                <TrendingUp className="h-6 w-6 text-green-500 mb-2" />
                <span className="text-2xl font-black text-exevo-blue dark:text-white">
                  +{data.dailyProgress}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">aujourd&apos;hui</span>
              </motion.div>

              {/* User Avatar */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <Avatar className="h-16 w-16 border-2 border-exevo-orange shadow-lg shadow-orange-500/20">
                  <AvatarFallback className="bg-exevo-blue text-white text-lg font-bold">
                    GM
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Skeleton loader
export function MyPositionSkeleton() {
  return (
    <Card className="border-exevo-orange/30 bg-gradient-to-br from-exevo-orange/5 to-transparent">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-12 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-4 w-56 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
          <div className="h-20 w-20 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}