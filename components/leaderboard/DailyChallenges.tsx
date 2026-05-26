'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Flame, Target, Zap, Clock, CheckCircle2, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'streak' | 'score' | 'rank';
  target: number;
  progress: number;
  reward: {
    points: number;
    badge?: string;
  };
  expiresAt: string;
  completed: boolean;
}

interface DailyChallengesProps {
  challenges: Challenge[];
  isLoading?: boolean;
  onChallengeClick?: (challenge: Challenge) => void;
}

const challengeIcons = {
  quiz: Target,
  streak: Flame,
  score: Trophy,
  rank: TrendingUp,
};

const challengeColors = {
  quiz: { bg: 'bg-blue-500/10', icon: 'text-blue-500', border: 'border-blue-500/30' },
  streak: { bg: 'bg-orange-500/10', icon: 'text-orange-500', border: 'border-orange-500/30' },
  score: { bg: 'bg-yellow-500/10', icon: 'text-yellow-500', border: 'border-yellow-500/30' },
  rank: { bg: 'bg-purple-500/10', icon: 'text-purple-500', border: 'border-purple-500/30' },
};

function ChallengeCard({ challenge, index, onClick }: { challenge: Challenge; index: number; onClick?: () => void }) {
  const Icon = challengeIcons[challenge.type];
  const colors = challengeColors[challenge.type];
  const progressPercent = Math.min((challenge.progress / challenge.target) * 100, 100);
  const isComplete = challenge.completed || progressPercent >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className={`${colors.border} border-2 ${isComplete ? 'bg-green-500/5' : ''} overflow-hidden relative`}>
        {/* Completed overlay */}
        {isComplete && (
          <div className="absolute top-2 right-2 z-10">
            <CheckCircle2 className="h-6 w-6 text-green-500 fill-green-500/20" />
          </div>
        )}

        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`p-3 rounded-xl ${colors.bg} border ${colors.border}`}>
              <Icon className={`h-6 w-6 ${colors.icon}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                  {challenge.title}
                </h4>
                {isComplete && (
                  <Badge className="bg-green-500/10 text-green-600 text-xs">Complété</Badge>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                {challenge.description}
              </p>

              {/* Progress bar */}
              <div className="space-y-1 mb-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    {challenge.progress}/{challenge.target}
                  </span>
                  <span className={`font-medium ${isComplete ? 'text-green-500' : 'text-exevo-orange'}`}>
                    +{challenge.reward.points} pts
                  </span>
                </div>
                <Progress
                  value={progressPercent}
                  className={`h-2 rounded-full [&>div]:${isComplete ? 'bg-green-500' : 'bg-gradient-to-r from-exevo-orange to-exevo-light-orange'}`}
                />
              </div>

              {/* Expires and badge */}
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(challenge.expiresAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
                {challenge.reward.badge && (
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    {challenge.reward.badge}
                  </span>
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
export function DailyChallengesSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-exevo-orange" />
          Défis du Jour
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function DailyChallenges({ challenges, isLoading, onChallengeClick }: DailyChallengesProps) {
  if (isLoading) {
    return <DailyChallengesSkeleton />;
  }

  const completedCount = challenges.filter((c) => c.completed || c.progress >= c.target).length;
  const totalPoints = challenges
    .filter((c) => c.completed || c.progress >= c.target)
    .reduce((sum, c) => sum + c.reward.points, 0);

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
              <Zap className="h-5 w-5 text-exevo-orange" />
              Défis du Jour
            </CardTitle>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs">
                {completedCount}/{challenges.length} complétés
              </Badge>
              <Badge className="bg-exevo-orange/10 text-exevo-orange">
                +{totalPoints} pts disponibles
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {challenges.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Trophy className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-500 dark:text-slate-400">
                Aucun défi disponible pour le moment
              </p>
              <Button variant="link" className="text-exevo-blue mt-2">
                Réessayer plus tard
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {challenges.map((challenge, index) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  index={index}
                  onClick={() => onChallengeClick?.(challenge)}
                />
              ))}
            </div>
          )}

          {/* Progress Message */}
          {completedCount > 0 && completedCount < challenges.length && (
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-exevo-blue/10 to-exevo-orange/10 border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-exevo-orange/10">
                  <Flame className="h-5 w-5 text-exevo-orange" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Continue tes efforts !
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {challenges.length - completedCount} défi(s) restant(s) - Gagne {challenges.filter((c) => !c.completed).reduce((sum, c) => sum + c.reward.points, 0)} points supplémentaires
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

// Sample data generator for demo
export const SAMPLE_CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    title: 'Quiz Flash',
    description: 'Complete 3 quiz aujourd\'hui',
    type: 'quiz',
    target: 3,
    progress: 2,
    reward: { points: 50, badge: 'Quiz Master' },
    expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    completed: false,
  },
  {
    id: 'c2',
    title: 'Série de 7 jours',
    description: 'Connecte-toi 7 jours de suite',
    type: 'streak',
    target: 7,
    progress: 5,
    reward: { points: 100, badge: 'Série de Fer' },
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    completed: false,
  },
  {
    id: 'c3',
    title: 'Score Collector',
    description: 'Atteins 500 points aujourd\'hui',
    type: 'score',
    target: 500,
    progress: 500,
    reward: { points: 75 },
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    completed: true,
  },
  {
    id: 'c4',
    title: 'Top 10 Provincial',
    description: 'Remonte dans le Top 10 de ta province',
    type: 'rank',
    target: 1,
    progress: 0,
    reward: { points: 150, badge: 'Champion Provincial' },
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    completed: false,
  },
];
