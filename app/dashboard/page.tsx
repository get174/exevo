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

const stats = [
  {
    label: 'Examens disponibles',
    value: '10 240',
    progress: 78,
    icon: BookOpen,
  },
  {
    label: 'Quiz complétés',
    value: '128',
    progress: 62,
    icon: ClipboardCheck,
  },
  {
    label: 'Score moyen',
    value: '84%',
    progress: 84,
    icon: TrendingUp,
  },
  {
    label: 'Classement national',
    value: '#42',
    progress: 68,
    icon: Trophy,
  },
];

const recentRevisions = [
  { subject: 'Mathématiques', year: '2023', progress: 70 },
  { subject: 'Physique', year: '2022', progress: 45 },
  { subject: 'Chimie', year: '2021', progress: 58 },
];

const popularExams = [
  { title: 'Mathématiques', year: '2023', downloads: 3200, difficulty: 'Moyen' },
  { title: 'Physique', year: '2022', downloads: 2850, difficulty: 'Difficile' },
  { title: 'Chimie', year: '2021', downloads: 2410, difficulty: 'Moyen' },
  { title: 'Français', year: '2020', downloads: 1980, difficulty: 'Facile' },
];

const leaderboard = [
  { name: 'Amina Kabeya', province: 'Kinshasa', score: 96, rank: '🥇' },
  { name: 'Joel Mutombo', province: 'Haut-Katanga', score: 93, rank: '🥈' },
  { name: 'Sarah Banza', province: 'Nord-Kivu', score: 91, rank: '🥉' },
  { name: 'Grâce Mbayo', province: 'Kongo Central', score: 89, rank: '4' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
          >
            <Card className="rounded-2xl border-0 shadow-md shadow-slate-200/60 transition-all hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-900 dark:shadow-none">
              <CardContent className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="rounded-xl bg-exevo-blue/10 p-2 text-exevo-blue dark:bg-exevo-orange/10 dark:text-exevo-orange">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-500">+12%</span>
                </div>
                <p className="text-2xl font-black">{item.value}</p>
                <p className="mb-2 text-sm text-slate-600 dark:text-slate-300">{item.label}</p>
                <Progress value={item.progress} className="h-2" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl border-0 shadow-md shadow-slate-200/60 lg:col-span-2 dark:bg-slate-900 dark:shadow-none">
          <CardHeader>
            <CardTitle>Continuer la révision</CardTitle>
            <CardDescription>Reprends là où tu t&apos;es arrêté.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentRevisions.map((item) => (
              <div
                key={`${item.subject}-${item.year}`}
                className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{item.subject}</p>
                    <p className="text-xs text-slate-500">Exetat {item.year}</p>
                  </div>
                  <Button size="sm" className="bg-exevo-blue text-white hover:bg-slate-800">
                    Continuer
                  </Button>
                </div>
                <Progress value={item.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-md shadow-slate-200/60 dark:bg-slate-900 dark:shadow-none">
          <CardHeader>
            <CardTitle>Classement</CardTitle>
            <CardDescription>Top élèves cette semaine</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {leaderboard.map((student) => (
              <div key={student.name} className="flex items-center gap-3 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-exevo-blue text-white">
                    {student.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{student.name}</p>
                  <p className="text-xs text-slate-500">{student.province}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{student.rank}</p>
                  <p className="text-xs text-slate-500">{student.score}%</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl border-0 shadow-md shadow-slate-200/60 lg:col-span-2 dark:bg-slate-900 dark:shadow-none">
          <CardHeader>
            <CardTitle>Examens populaires</CardTitle>
            <CardDescription>Les plus téléchargés par les élèves Exevo.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {popularExams.map((exam) => (
              <div
                key={`${exam.title}-${exam.year}`}
                className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
              >
                <p className="font-semibold">
                  {exam.title} {exam.year}
                </p>
                <div className="mt-2 space-y-1 text-xs text-slate-500">
                  <p className="inline-flex items-center gap-1">
                    <Download className="h-3.5 w-3.5" /> {exam.downloads} téléchargements
                  </p>
                  <p>Difficulté : {exam.difficulty}</p>
                </div>
                <Button size="sm" className="mt-3 bg-exevo-orange text-white hover:bg-exevo-light-orange">
                  Ouvrir
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

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
