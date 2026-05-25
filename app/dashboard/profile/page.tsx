'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  School,
  Phone,
  Mail,
  Calendar,
  Edit3,
  Camera,
  Crown,
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileText,
  Timer,
  Target,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/hooks/use-profile';
import {
  PROVINCES,
  SCHOOL_OPTIONS,
  EXAM_YEARS,
} from '@/types/profile';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Profile Section Component
function ProfileSection() {
  const { profile, loading, error } = useProfile();

  if (loading) {
    return (
      <motion.div {...fadeInUp}>
        <Card className="overflow-hidden rounded-2xl border-0 shadow-md shadow-slate-200/60 dark:bg-slate-900 dark:shadow-none">
          <div className="h-24 bg-gradient-to-r from-exevo-blue via-slate-800 to-exevo-orange animate-pulse" />
          <CardContent className="relative p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="relative -mt-16">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg dark:border-slate-900">
                    <AvatarFallback className="bg-exevo-blue text-3xl text-white">...</AvatarFallback>
                  </Avatar>
                </div>
                <div className="text-center sm:text-left">
                  <div className="h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!profile) {
    return (
      <motion.div {...fadeInUp}>
        <Card className="overflow-hidden rounded-2xl border-0 shadow-md dark:bg-slate-900">
          <CardContent className="p-6 text-center">
            <p className="mb-2 text-slate-500">
              {error || 'Profil non trouvé dans la base de données.'}
            </p>
            <p className="text-sm text-slate-400 mb-4">
              Il semble que vous n&apos;ayez pas encore de profil créé.
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => window.location.href = '/login'}>
                Connexion
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div {...fadeInUp}>
      <Card className="overflow-hidden rounded-2xl border-0 shadow-md shadow-slate-200/60 dark:bg-slate-900 dark:shadow-none">
        <div className="h-24 bg-gradient-to-r from-exevo-blue via-slate-800 to-exevo-orange" />
        <CardContent className="relative p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="relative -mt-16">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg dark:border-slate-900">
                  <AvatarFallback className="bg-exevo-blue text-3xl text-white">
                    {profile.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-exevo-orange text-white shadow-lg hover:bg-exevo-light-orange">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-black text-exevo-blue dark:text-white">
                  {profile.full_name}
                </h1>
                <div className="mt-1 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-300 sm:justify-start">
                  <Badge
                    variant={profile.subscription === 'premium' ? 'default' : 'secondary'}
                    className={
                      profile.subscription === 'premium'
                        ? 'bg-exevo-orange text-white'
                        : ''
                    }
                  >
                    <Crown className="mr-1 h-3 w-3" />
                    {profile.subscription === 'premium' ? 'Premium' : 'Gratuit'}
                  </Badge>
                  <span>•</span>
                  <span className="capitalize">{profile.option}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="bg-exevo-blue text-white hover:bg-slate-800">
                <Edit3 className="mr-2 h-4 w-4" />
                Modifier profil
              </Button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <div className="rounded-lg bg-exevo-blue/10 p-2 text-exevo-blue dark:bg-exevo-orange/10 dark:text-exevo-orange">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Téléphone</p>
                <p className="text-sm font-medium">{profile.phone || 'Non renseigné'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <div className="rounded-lg bg-exevo-blue/10 p-2 text-exevo-blue dark:bg-exevo-orange/10 dark:text-exevo-orange">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                <p className="text-sm font-medium truncate">{profile.email || 'Non renseigné'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <div className="rounded-lg bg-exevo-blue/10 p-2 text-exevo-blue dark:bg-exevo-orange/10 dark:text-exevo-orange">
                <School className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">École</p>
                <p className="text-sm font-medium truncate">{profile.school}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <div className="rounded-lg bg-exevo-blue/10 p-2 text-exevo-blue dark:bg-exevo-orange/10 dark:text-exevo-orange">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Province • Exetat
                </p>
                <p className="text-sm font-medium">
                  {profile.province} • {profile.exam_year}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Statistics Cards Component
function StatsCards() {
  const { stats, loading } = useProfile();

  const statsData = [
    {
      label: 'Examens consultés',
      value: stats?.exams_opened ?? 0,
      icon: BookOpen,
      color: 'text-exevo-blue',
      bgColor: 'bg-exevo-blue/10',
    },
    {
      label: 'Quiz terminés',
      value: stats?.quizzes_completed ?? 0,
      icon: ClipboardCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'Score moyen',
      value: stats?.average_score ? `${stats.average_score}%` : '0%',
      icon: TrendingUp,
      color: 'text-exevo-orange',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    },
    {
      label: 'Temps de révision',
      value: stats?.study_time_minutes ? `${Math.round(stats.study_time_minutes / 60)}h` : '0h',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {statsData.map((stat) => (
        <motion.div key={stat.label} variants={fadeInUp}>
          <Card className="rounded-2xl border-0 shadow-md shadow-slate-200/60 transition-all hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-900 dark:shadow-none">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className={`rounded-xl p-2 ${stat.bgColor} ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </div>
              {loading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              ) : (
                <p className="text-2xl font-black">{stat.value}</p>
              )}
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Recent Activity Component
function ActivitySection() {
  const { activities, loading } = useProfile();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'exam':
        return <FileText className="h-4 w-4" />;
      case 'simulation':
        return <Timer className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'quiz':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'exam':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'simulation':
        return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <motion.div {...fadeInUp}>
      <Card className="rounded-2xl border-0 shadow-md shadow-slate-200/60 dark:bg-slate-900 dark:shadow-none">
        <CardHeader>
          <CardTitle className="text-lg font-black">Activité récente</CardTitle>
          <CardDescription>Tes dernières actions sur Exevo</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-10 w-10 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <p className="text-sm text-slate-500">Aucune activité récente</p>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`mt-0.5 rounded-lg p-2 ${getActivityColor(activity.activity_type)}`}>
                    {getActivityIcon(activity.activity_type)}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(activity.date)}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Personal Goals Component
function GoalsSection() {
  const { goals, loading } = useProfile();

  return (
    <motion.div {...fadeInUp}>
      <Card className="rounded-2xl border-0 shadow-md shadow-slate-200/60 dark:bg-slate-900 dark:shadow-none">
        <CardHeader>
          <CardTitle className="text-lg font-black">Objectifs personnels</CardTitle>
          <CardDescription>
            Tes objectifs de préparation pour l&apos;Exetat
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <>
              {[1, 2].map((i) => (
                <div key={i} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="mb-2 h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              ))}
            </>
          ) : goals.length === 0 ? (
            <p className="text-sm text-slate-500">Aucun objectif défini</p>
          ) : (
            goals.map((goal) => (
              <div
                key={goal.id}
                className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Target
                    className={`h-4 w-4 ${
                      goal.goal_type === 'score'
                        ? 'text-exevo-orange'
                        : 'text-exevo-blue'
                    }`}
                  />
                  <span className="font-medium">{goal.target}</span>
                </div>
                <div className="space-y-1.5">
                  <Progress value={goal.current} className="h-2" />
                  <p className="text-right text-xs text-slate-500">
                    {goal.current}% aujourd&apos;hui
                  </p>
                </div>
              </div>
            ))
          )}
          <Button className="w-full" variant="outline">
            <Target className="mr-2 h-4 w-4" />
            Ajouter un objectif
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Main Profile Page
export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <ProfileSection />
      <section>
        <h2 className="mb-4 text-lg font-black text-exevo-blue dark:text-white">
          Statistiques
        </h2>
        <StatsCards />
      </section>
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Progression section - à ajouter avec les vraies données */}
        </div>
        <div className="space-y-6">
          <ActivitySection />
          <GoalsSection />
        </div>
      </section>
    </div>
  );
}
