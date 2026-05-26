'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, GraduationCap, TrendingUp, Users, Star, Medal } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { LeaderboardEntry } from '@/types/leaderboard';

interface SchoolRank {
  rank: number;
  school: string;
  province: string;
  totalScore: number;
  studentCount: number;
  averageScore: number;
  topStudent: LeaderboardEntry;
  trend: 'up' | 'down' | 'same';
  previousRank?: number;
}

interface SchoolLeaderboardProps {
  entries: LeaderboardEntry[];
  isLoading?: boolean;
}

const podiumColors = {
  gold: { bg: 'bg-yellow-400', text: 'text-yellow-600', glow: 'shadow-yellow-400/50' },
  silver: { bg: 'bg-slate-300', text: 'text-slate-500', glow: 'shadow-slate-300/50' },
  bronze: { bg: 'bg-orange-400', text: 'text-orange-600', glow: 'shadow-orange-400/50' },
};

function SchoolCard({ school, index }: { school: SchoolRank; index: number }) {
  const isPodium = school.rank <= 3;
  const podiumConfig = isPodium ? Object.values(podiumColors)[school.rank - 1] : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className={`relative ${isPodium ? '' : 'opacity-90 hover:opacity-100'} transition-opacity`}
    >
      <Card className={`overflow-hidden ${isPodium ? `border-2 ${podiumConfig?.glow?.replace('shadow-', 'border-').replace('/50', '/30')}` : 'border-slate-200 dark:border-slate-700'}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Rank */}
            <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${isPodium ? `${podiumConfig?.bg} shadow-lg` : 'bg-slate-100 dark:bg-slate-800'}`}>
              {school.rank === 1 ? (
                <Trophy className={`h-6 w-6 ${podiumConfig?.text}`} />
              ) : school.rank === 2 ? (
                <Medal className={`h-6 w-6 ${podiumConfig?.text}`} />
              ) : school.rank === 3 ? (
                <Medal className={`h-6 w-6 ${podiumConfig?.text}`} />
              ) : (
                <span className="text-lg font-bold text-slate-500">#{school.rank}</span>
              )}
            </div>

            {/* School Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-slate-700 dark:text-slate-200 truncate">
                  {school.school}
                </h4>
                {school.trend === 'up' && (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {school.province} • {school.studentCount} élèves
              </p>
            </div>

            {/* Score */}
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <span className="text-xl font-black text-exevo-blue dark:text-white">
                  {school.totalScore.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400">pts</span>
              </div>
              <p className="text-xs text-slate-400">
                Moyenne: {Math.round(school.averageScore)}
              </p>
            </div>

            {/* Top Student Avatar */}
            <Avatar className="h-10 w-10 border-2 border-slate-200 dark:border-slate-700">
              <AvatarFallback className="bg-exevo-orange text-white text-xs font-medium">
                {school.topStudent.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??'}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Mini progress bar */}
          <div className="mt-3">
            <Progress value={(school.totalScore / 5000) * 100} className="h-1.5 rounded-full [&>div]:bg-exevo-orange" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TopSchoolPodium({ topSchools }: { topSchools: SchoolRank[] }) {
  if (topSchools.length < 3) return null;

  const positions = ['second', 'first', 'third'] as const;

  return (
    <div className="flex items-end justify-center gap-4 py-6">
      {positions.map((position, idx) => {
        const school = topSchools[idx];
        const config = Object.values(podiumColors)[idx];
        const isFirst = position === 'first';

        return (
          <motion.div
            key={school.school}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 }}
            className="flex flex-col items-center"
          >
            {/* School name */}
            <p className={`text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 text-center max-w-[80px] truncate`}>
              {school.school}
            </p>

            {/* Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.15 + 0.2, type: 'spring' }}
              className={`relative ${isFirst ? 'scale-110' : ''}`}
            >
              <Avatar className={`h-16 w-16 sm:h-20 sm:w-20 border-4 ${isFirst ? 'border-yellow-400 shadow-lg shadow-yellow-400/30' : 'border-white dark:border-slate-700'} shadow-lg`}>
                <AvatarFallback className={`${config.bg} text-lg font-bold text-white`}>
                  {school.school.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-2 -right-2 z-10">
                <Badge className={`h-6 w-6 p-0 flex items-center justify-center rounded-full ${config.bg} text-white text-xs`}>
                  {idx + 1}
                </Badge>
              </div>
            </motion.div>

            {/* Score */}
            <p className="text-sm sm:text-base font-black text-exevo-orange mt-2">
              {school.totalScore.toLocaleString()} pts
            </p>

            {/* Stand */}
            <div className={`${config.bg} ${isFirst ? 'h-20 w-24' : idx === 1 ? 'h-14 w-20' : 'h-10 w-16'} rounded-t-xl flex items-center justify-center mt-2 shadow-xl`}>
              <span className="text-white/90 font-bold text-xs sm:text-sm">
                {school.studentCount} élèves
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function SchoolLeaderboard({ entries, isLoading }: SchoolLeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'global' | 'province'>('global');

  // Aggregate data by school
  const schoolData = useMemo(() => {
    const schoolsMap = new Map<string, {
      school: string;
      province: string;
      totalScore: number;
      students: LeaderboardEntry[];
      topStudent: LeaderboardEntry;
    }>();

    entries.forEach((entry) => {
      const key = entry.school || 'Unknown';
      const existing = schoolsMap.get(key);

      if (existing) {
        existing.totalScore += entry.score;
        existing.students.push(entry);
        if (entry.score > existing.topStudent.score) {
          existing.topStudent = entry;
        }
      } else {
        schoolsMap.set(key, {
          school: entry.school,
          province: entry.province,
          totalScore: entry.score,
          students: [entry],
          topStudent: entry,
        });
      }
    });

    return Array.from(schoolsMap.values())
      .map((school) => ({
        school: school.school,
        province: school.province,
        totalScore: school.totalScore,
        studentCount: school.students.length,
        averageScore: school.totalScore / school.students.length,
        topStudent: school.topStudent,
        trend: 'same' as const,
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 20)
      .map((school, index) => ({
        ...school,
        rank: index + 1,
      }));
  }, [entries]);

  const topThree = schoolData.slice(0, 3);
  const rest = schoolData.slice(3);

  // Group by province for province tab
  const provinceGroups = useMemo(() => {
    const groups = new Map<string, SchoolRank[]>();
    schoolData.forEach((school) => {
      const existing = groups.get(school.province) || [];
      existing.push(school);
      groups.set(school.province, existing);
    });
    return groups;
  }, [schoolData]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-exevo-orange" />
            Classement des Écoles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-exevo-orange" />
            Classement des Écoles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <GraduationCap className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">
              Aucune donnée d&apos;école disponible
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
              <GraduationCap className="h-5 w-5 text-exevo-orange" />
              Classement des Écoles
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              {schoolData.length} écoles
            </Badge>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'global' | 'province')} className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="global" className="text-xs">
                <Trophy className="h-3 w-3 mr-1" />
                Classement Global
              </TabsTrigger>
              <TabsTrigger value="province" className="text-xs">
                <Star className="h-3 w-3 mr-1" />
                Par Province
              </TabsTrigger>
            </TabsList>

            <TabsContent value="global" className="space-y-4">
              {/* Top 3 Podium */}
              <TopSchoolPodium topSchools={topThree} />

              {/* School List */}
              <div className="space-y-3">
                {rest.map((school, index) => (
                  <SchoolCard key={school.school} school={school} index={index} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="province" className="space-y-4">
              {Array.from(provinceGroups.entries()).slice(0, 5).map(([province, schools]) => (
                <div key={province} className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    {province}
                  </h4>
                  <div className="space-y-2">
                    {schools.slice(0, 5).map((school, index) => (
                      <SchoolCard key={school.school} school={school} index={index} />
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </motion.div>
  );
}

// Skeleton loader
export function SchoolLeaderboardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-exevo-orange" />
          Classement des Écoles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
