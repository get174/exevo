'use client';

import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Crown, TrendingUp, Flame } from 'lucide-react';
import type { LeaderboardEntry } from '@/types/leaderboard';
import { useState } from 'react';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  isLoading?: boolean;
}

const levelColors: Record<number, string> = {
  1: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  2: 'bg-green-500/10 text-green-600 dark:text-green-400',
  3: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  4: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  5: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

function getLevelBadgeColor(level: number): string {
  if (level >= 10) return levelColors[1];
  if (level >= 7) return levelColors[2];
  if (level >= 5) return levelColors[3];
  if (level >= 3) return levelColors[4];
  return levelColors[5];
}

function getPositionIcon(position: number) {
  if (position === 1) return <Crown className="h-4 w-4 text-yellow-500" />;
  if (position <= 3) return <Crown className="h-4 w-4 text-orange-400" />;
  return null;
}

function getTrendIcon(score: number, previousScore?: number) {
  if (previousScore && score > previousScore) {
    return <TrendingUp className="h-3 w-3 text-green-500" />;
  }
  if (score >= 1000) {
    return <Flame className="h-3 w-3 text-orange-500" />;
  }
  return null;
}

export function LeaderboardTable({ entries, currentUserId, isLoading }: LeaderboardTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800/50">
              <TableHead className="w-14 text-center">#</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead className="hidden sm:table-cell">Province</TableHead>
              <TableHead className="hidden md:table-cell">École</TableHead>
              <TableHead className="hidden lg:table-cell">Option</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="text-center">Niveau</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="text-center">
                  <div className="h-5 w-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                      <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse ml-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-5 w-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-4 mb-4">
          <Crown className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">
          Aucun classement disponible
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Les données du classement apparaîtront ici
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 overflow-hidden"
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 dark:bg-slate-800/50">
            <TableHead className="w-14 text-center">#</TableHead>
            <TableHead>Utilisateur</TableHead>
            <TableHead className="hidden sm:table-cell">Province</TableHead>
            <TableHead className="hidden md:table-cell">École</TableHead>
            <TableHead className="hidden lg:table-cell">Option</TableHead>
            <TableHead className="text-right">Score</TableHead>
            <TableHead className="text-center">Niveau</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, index) => {
            const isCurrentUser = entry.user_id === currentUserId;
            const isHovered = hoveredRow === entry.id;
            const positionIcon = getPositionIcon(entry.rank || index + 1);
            const trendIcon = getTrendIcon(entry.score);

            return (
              <motion.div
                key={entry.id}
                whileHover={{ scale: 1 }}
                onHoverStart={() => setHoveredRow(entry.id)}
                onHoverEnd={() => setHoveredRow(null)}
              >
                <TableRow
                  className={`
                    ${isCurrentUser ? 'bg-exevo-orange/5 border-exevo-orange/30' : ''}
                    ${isHovered ? 'bg-slate-50 dark:bg-slate-800/50' : ''}
                    transition-colors cursor-pointer
                  `}
                >
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className={`font-bold ${(entry.rank || index + 1) <= 3 ? 'text-exevo-orange' : 'text-slate-600 dark:text-slate-300'}`}>
                        {entry.rank || index + 4}
                      </span>
                      {positionIcon}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700">
                        <AvatarFallback className="bg-exevo-blue text-white text-sm font-medium">
                          {entry.full_name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${isCurrentUser ? 'text-exevo-orange font-bold' : 'text-slate-700 dark:text-slate-200'}`}>
                            {entry.full_name}
                          </span>
                          {trendIcon}
                          {isCurrentUser && (
                            <Badge variant="outline" className="text-xs border-exevo-orange text-exevo-orange">
                              Vous
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 sm:hidden">
                          {entry.province} • {entry.option}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-slate-600 dark:text-slate-300">
                    {entry.province}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-slate-600 dark:text-slate-300 text-sm truncate max-w-[150px] block">
                      {entry.school}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant="secondary" className="bg-exevo-blue/10 text-exevo-blue dark:bg-exevo-blue/20">
                      {entry.option}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-bold text-exevo-blue dark:text-white">
                      {entry.score.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">pts</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={`${getLevelBadgeColor(entry.level)} font-medium`}>
                      {entry.level}
                    </Badge>
                  </TableCell>
                </TableRow>
              </motion.div>
            );
          })}
        </TableBody>
      </Table>
    </motion.div>
  );
}

// Empty state component
export function LeaderboardTableEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
      <Crown className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">
        Aucun élève dans le classement
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
        Soyez le premier à rejoindre le classement !
      </p>
    </div>
  );
}
