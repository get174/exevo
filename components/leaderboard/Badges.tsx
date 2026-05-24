'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Flame, BookOpen, Star, Target, Crown, Zap, FlaskConical, GraduationCap, Award } from 'lucide-react';
import type { Badge as BadgeType, UserBadge } from '@/types/leaderboard';

interface BadgesProps {
  earnedBadges: UserBadge[];
  allBadges: BadgeType[];
  isLoading?: boolean;
}

const iconMap: Record<string, typeof Trophy> = {
  trophy: Trophy,
  flame: Flame,
  'book-open': BookOpen,
  star: Star,
  target: Target,
  crown: Crown,
  zap: Zap,
  'flask-conical': FlaskConical,
  'graduation-cap': GraduationCap,
  award: Award,
};

type BadgeIconType = 'trophy' | 'flame' | 'book-open' | 'star' | 'target' | 'crown' | 'zap' | 'flask-conical' | 'graduation-cap' | 'award';

const badgeColors: Record<BadgeIconType, { bg: string; icon: string; border: string }> = {
  trophy: { bg: 'bg-yellow-500/10', icon: 'text-yellow-500', border: 'border-yellow-500/30' },
  flame: { bg: 'bg-orange-500/10', icon: 'text-orange-500', border: 'border-orange-500/30' },
  'book-open': { bg: 'bg-blue-500/10', icon: 'text-blue-500', border: 'border-blue-500/30' },
  star: { bg: 'bg-purple-500/10', icon: 'text-purple-500', border: 'border-purple-500/30' },
  target: { bg: 'bg-green-500/10', icon: 'text-green-500', border: 'border-green-500/30' },
  crown: { bg: 'bg-amber-500/10', icon: 'text-amber-500', border: 'border-amber-500/30' },
  zap: { bg: 'bg-cyan-500/10', icon: 'text-cyan-500', border: 'border-cyan-500/30' },
  'flask-conical': { bg: 'bg-pink-500/10', icon: 'text-pink-500', border: 'border-pink-500/30' },
  'graduation-cap': { bg: 'bg-indigo-500/10', icon: 'text-indigo-500', border: 'border-indigo-500/30' },
  award: { bg: 'bg-teal-500/10', icon: 'text-teal-500', border: 'border-teal-500/30' },
};

function BadgeCard({ badge, earned, earnedAt }: { badge: BadgeType; earned?: boolean; earnedAt?: string }) {
  const iconType = badge.icon as BadgeIconType;
  const Icon = iconMap[iconType] || Award;
  const colors = badgeColors[iconType] || badgeColors.award;

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      <Card className={`${earned ? colors.border : 'border-slate-200 dark:border-slate-700 opacity-50'} ${colors.bg} transition-all`}>
        <CardContent className="pt-4 pb-4 flex flex-col items-center text-center gap-2">
          {/* Badge Icon */}
          <div className={`relative ${earned ? '' : 'grayscale'}`}>
            <motion.div
              animate={earned ? { rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 0.5, repeat: earned ? Infinity : 0, repeatDelay: 3 }}
            >
              <div className={`p-3 rounded-full ${colors.bg} border-2 ${colors.border}`}>
                <Icon className={`h-6 w-6 ${colors.icon}`} />
              </div>
            </motion.div>

            {/* Earned indicator */}
            {earned && (
              <div className="absolute -bottom-1 -right-1">
                <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Star className="h-3 w-3 text-white fill-white" />
                </div>
              </div>
            )}
          </div>

          {/* Badge Name */}
          <div className="space-y-1">
            <p className={`text-sm font-bold ${earned ? 'text-slate-700 dark:text-slate-200' : 'text-slate-500'}`}>
              {badge.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
              {badge.description}
            </p>
          </div>

          {/* Earned Date */}
          {earned && earnedAt && (
            <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-600">
              {new Date(earnedAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
              })}
            </Badge>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function Badges({ earnedBadges, allBadges, isLoading }: BadgesProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-exevo-orange" />
            Badges & Récompenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const earnedBadgeIds = new Set(earnedBadges.map((b) => b.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-exevo-orange" />
              Badges & Récompenses
            </CardTitle>
            <Badge className="bg-exevo-orange/10 text-exevo-orange">
              {earnedBadges.length}/{allBadges.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {earnedBadges.length === 0 && allBadges.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Award className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-500 dark:text-slate-400">
                Aucun badge disponible pour le moment
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {/* Earned Badges */}
              {earnedBadges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BadgeCard
                    badge={badge}
                    earned
                    earnedAt={badge.earned_at}
                  />
                </motion.div>
              ))}

              {/* Locked Badges */}
              {allBadges
                .filter((badge) => !earnedBadgeIds.has(badge.id))
                .map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (earnedBadges.length + index) * 0.1 }}
                  >
                    <BadgeCard badge={badge} earned={false} />
                  </motion.div>
                ))}
            </div>
          )}

          {/* Progress Message */}
          {earnedBadges.length > 0 && earnedBadges.length < allBadges.length && (
            <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-exevo-orange/10">
                  <Trophy className="h-5 w-5 text-exevo-orange" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Continue tes efforts !
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Tu as encore {allBadges.length - earnedBadges.length} badge(s) à gagner
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Skeleton loader
export function BadgesSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
