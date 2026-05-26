'use client';

import { motion } from 'framer-motion';
import {
  BookOpen,
  ClipboardCheck,
  Download,
  Trophy,
  TrendingUp,
  Clock3,
  Crown,
  Medal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface Exam {
  id: string;
  title: string;
  subject: string;
  year: number;
  option: string;
  difficulty: string;
  downloads_count: number;
}

interface SubjectProgress {
  id: string;
  user_id: string;
  subject: string;
  progress: number;
  updated_at: string;
}

interface LeaderboardEntry {
  id: string;
  user_id: string;
  score: number;
  province: string;
  school: string;
  option: string;
  profiles?: { full_name: string };
}

interface DashboardData {
  stats: {
    examsCount: number;
    quizzesCompleted: number;
    averageScore: number;
    userPosition: number;
  };
  leaderboard: LeaderboardEntry[];
  popularExams: Exam[];
  recentRevisions: SubjectProgress[];
}

const statsIcons = [BookOpen, ClipboardCheck, TrendingUp, Trophy];
const statsLabels = ['Examens disponibles', 'Quiz complétés', 'Score moyen', 'Classement national'];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      let token: string | undefined;
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        token = session?.access_token;
      }

      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/dashboard', { headers });

      if (!res.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Impossible de charger les données');
      toast.error('Erreur lors du chargement du dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="rounded-2xl border-0 shadow-md">
              <CardContent className="p-4">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-slate-500">{error || 'Aucune donnée disponible'}</p>
      </div>
    );
  }

  const statsValues = [
    { value: data.stats.examsCount.toLocaleString(), progress: 78 },
    { value: data.stats.quizzesCompleted.toString(), progress: 62 },
    { value: `${data.stats.averageScore}%`, progress: data.stats.averageScore },
    { value: `#${data.stats.userPosition || '—'}`, progress: 68 },
  ];

  const leaderboardRanks = ['🥇', '🥈', '🥉', '4'];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsValues.map((item, idx) => (
          <motion.div
            key={statsLabels[idx]}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
          >
            <Card className="rounded-2xl border-0 shadow-md shadow-slate-200/60 transition-all hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-900 dark:shadow-none">
              <CardContent className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="rounded-xl bg-exevo-blue/10 p-2 text-exevo-blue dark:bg-exevo-orange/10 dark:text-exevo-orange">
                    {(() => {
                      const Icon = statsIcons[idx];
                      return <Icon className="h-4 w-4" />;
                    })()}
                  </div>
                </div>
                <p className="text-2xl font-black">{item.value}</p>
                <p className="mb-2 text-sm text-slate-600 dark:text-slate-300">{statsLabels[idx]}</p>
                <Progress value={item.progress} className="h-2" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {/* Continue Revision */}
        <Card className="rounded-2xl border-0 shadow-md shadow-slate-200/60 lg:col-span-2 dark:bg-slate-900 dark:shadow-none">
          <CardHeader>
            <CardTitle>Continuer la révision</CardTitle>
            <CardDescription>Reprends là où tu t&apos;es arrêté.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentRevisions && data.recentRevisions.length > 0 ? (
              data.recentRevisions.slice(0, 3).map((revision) => (
                <Link
                  key={revision.id}
                  href={`/dashboard/quiz?subject=${encodeURIComponent(revision.subject)}`}
                >
                  <div className="group cursor-pointer rounded-xl border border-slate-200 p-4 transition-all hover:border-exevo-blue hover:shadow-md dark:border-slate-700 dark:hover:border-exevo-orange">
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <p className="font-semibold group-hover:text-exevo-blue dark:group-hover:text-exevo-orange">
                          {revision.subject}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-exevo-blue text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-slate-800 dark:bg-exevo-orange dark:hover:bg-exevo-light-orange"
                      >
                        Continuer
                      </Button>
                    </div>
                    <Progress value={revision.progress} className="h-2" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-xl border border-slate-200 p-4 text-center dark:border-slate-700">
                <p className="text-sm text-slate-500">Aucune progression récente</p>
                <Link href="/dashboard/quiz">
                  <Button size="sm" className="mt-2 bg-exevo-blue text-white hover:bg-slate-800">
                    Commencer un quiz
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="rounded-2xl border-0 shadow-md shadow-slate-200/60 dark:bg-slate-900 dark:shadow-none">
          <CardHeader>
            <CardTitle>Classement</CardTitle>
            <CardDescription>Top élèves cette semaine</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.leaderboard && data.leaderboard.length > 0 ? (
              data.leaderboard.slice(0, 4).map((student, idx) => (
                <div
                  key={student.id}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-exevo-blue text-white">
                      {(student.profiles?.full_name || 'U')
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {student.profiles?.full_name || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-slate-500">{student.province}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{leaderboardRanks[idx]}</p>
                    <p className="text-xs text-slate-500">{student.score}%</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-sm text-slate-500">
                <p>Aucun classement disponible</p>
              </div>
            )}
            <Link
              href="/dashboard/leaderboard"
              className="block text-center text-sm font-medium text-exevo-blue hover:underline"
            >
              Voir tout le classement
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {/* Popular Exams */}
        <Card className="rounded-2xl border-0 shadow-md shadow-slate-200/60 lg:col-span-2 dark:bg-slate-900 dark:shadow-none">
          <CardHeader>
            <CardTitle>Examens populaires</CardTitle>
            <CardDescription>Les plus téléchargés par les élèves Exevo.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {data.popularExams && data.popularExams.length > 0 ? (
              data.popularExams.map((exam) => (
                <Link
                  key={exam.id}
                  href={`/dashboard/exams/${exam.id}`}
                >
                  <div className="group cursor-pointer rounded-xl border border-slate-200 p-4 transition-all hover:border-exevo-blue hover:shadow-md dark:border-slate-700">
                    <p className="font-semibold group-hover:text-exevo-blue">
                      {exam.subject} {exam.year}
                    </p>
                    <div className="mt-2 space-y-1 text-xs text-slate-500">
                      <p className="inline-flex items-center gap-1">
                        <Download className="h-3.5 w-3.5" />{' '}
                        {exam.downloads_count?.toLocaleString() || 0} téléchargements
                      </p>
                      <p>Difficulté : {exam.difficulty}</p>
                    </div>
                    <Button
                      size="sm"
                      className="mt-3 bg-exevo-orange text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-exevo-light-orange"
                    >
                      Ouvrir
                    </Button>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-2 text-center text-sm text-slate-500">
                <p>Aucun examen disponible</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Premium CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-gradient-to-br from-exevo-orange to-exevo-light-orange p-5 text-white shadow-xl shadow-orange-500/30"
        >
          <div className="mb-3 inline-flex rounded-xl bg-white/20 p-2">
            <Crown className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-black">Passe Premium</h3>
          <p className="mt-2 text-sm text-orange-50">
            Débloque tous les examens et corrigés premium.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="inline-flex items-center gap-2">
              <Medal className="h-4 w-4" /> Corrigés complets
            </li>
            <li className="inline-flex items-center gap-2">
              <Download className="h-4 w-4" /> Téléchargements illimités
            </li>
            <li className="inline-flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" /> Quiz avancés
            </li>
            <li className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4" /> Simulations complètes
            </li>
          </ul>
          <Button className="mt-5 w-full bg-white font-bold text-exevo-orange hover:bg-orange-50">
            Passer Premium
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
