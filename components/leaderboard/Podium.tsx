'use client';

import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Crown, Medal, Trophy } from 'lucide-react';
import type { LeaderboardEntry } from '@/types/leaderboard';

interface PodiumProps {
  topThree: LeaderboardEntry[];
}

const podiumColors = {
  first: {
    bg: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600',
    glow: 'shadow-yellow-500/50 shadow-2xl',
    icon: Crown,
    label: '1ère',
    emoji: '🥇',
  },
  second: {
    bg: 'bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500',
    glow: 'shadow-slate-400/50 shadow-xl',
    icon: Medal,
    label: '2ème',
    emoji: '🥈',
  },
  third: {
    bg: 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600',
    glow: 'shadow-orange-500/50 shadow-xl',
    icon: Medal,
    label: '3ème',
    emoji: '🥉',
  },
};

const podiumHeights = {
  first: 'h-48',
  second: 'h-36',
  third: 'h-28',
};

const positions = ['second', 'first', 'third'] as const;

export function Podium({ topThree }: PodiumProps) {
  if (topThree.length < 3) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500">
        Pas assez de participants pour le podium
      </div>
    );
  }

  return (
    <div className="flex items-end justify-center gap-3 sm:gap-4 lg:gap-6 px-4 py-8">
      {positions.map((position, index) => {
        const player = topThree[index];
        const config = podiumColors[position];
        const Icon = config.icon;
        const height = podiumHeights[position];

        return (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="flex flex-col items-center"
          >
            {/* Avatar Section */}
            <div className="relative mb-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.15 + 0.2 }}
                className={`relative`}
              >
                {/* Badge */}
                <div className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg dark:bg-slate-800">
                  <span className="text-lg">{config.emoji}</span>
                </div>

                {/* Avatar */}
                <Avatar
                  className={`h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 border-4 border-white shadow-lg dark:border-slate-700 ${config.glow}`}
                >
                  <AvatarFallback
                    className={`${config.bg} text-lg sm:text-xl font-bold text-white`}
                  >
                    {player.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Animated ring for first place */}
                {position === 'first' && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-yellow-400"
                    animate={{ scale: [1, 1.1, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>

              {/* Name and score */}
              <div className="mt-2 text-center">
                <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[80px] sm:max-w-[100px]">
                  {player.full_name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block truncate max-w-[100px]">
                  {player.school}
                </p>
                <p className="text-sm sm:text-base font-black text-exevo-orange">
                  {player.score.toLocaleString()} pts
                </p>
              </div>
            </div>

            {/* Podium Stand */}
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.4, delay: index * 0.15 + 0.3 }}
              className={`${height} ${config.bg} w-20 sm:w-28 lg:w-36 rounded-t-2xl flex flex-col items-center justify-end pb-3 shadow-xl`}
            >
              <div className="flex flex-col items-center mb-2">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white/90 mb-1" />
                <span className="text-xs sm:text-sm font-bold text-white/90">
                  {config.label}
                </span>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

// Skeleton loader for Podium
export function PodiumSkeleton() {
  return (
    <div className="flex items-end justify-center gap-3 sm:gap-4 lg:gap-6 px-4 py-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="mb-2 flex flex-col items-center">
            <div className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="mt-2 h-12 w-20 sm:w-28 lg:w-36 rounded-t-2xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}