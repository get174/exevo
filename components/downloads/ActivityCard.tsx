'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Eye, Play, Heart, HeartOff, FileText } from 'lucide-react';
import type { ActivityLog } from '@/types/downloads';
import { formatDate, formatTime, getActivityLabel } from '@/types/downloads';

interface ActivityCardProps {
  activity: ActivityLog;
  isLoading?: boolean;
}

const activityIcons = {
  download: Download,
  open: Eye,
  quiz_start: Play,
  favorite_add: Heart,
  favorite_remove: HeartOff,
};

const activityColors = {
  download: 'bg-green-500/10 text-green-600 border-green-500/30',
  open: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
  quiz_start: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
  favorite_add: 'bg-exevo-orange/10 text-exevo-orange border-exevo-orange/30',
  favorite_remove: 'bg-slate-500/10 text-slate-600 border-slate-500/30',
};

const activityBgColors = {
  download: 'bg-green-50 dark:bg-green-950/30',
  open: 'bg-blue-50 dark:bg-blue-950/30',
  quiz_start: 'bg-purple-50 dark:bg-purple-950/30',
  favorite_add: 'bg-orange-50 dark:bg-orange-950/30',
  favorite_remove: 'bg-slate-50 dark:bg-slate-950/30',
};

export function ActivityCard({ activity, isLoading }: ActivityCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const Icon = activityIcons[activity.action] || FileText;
  const colorClass = activityColors[activity.action];
  const bgClass = activityBgColors[activity.action];

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <Card className={`${bgClass} border-slate-200 dark:border-slate-700`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className={`p-2 rounded-full border ${colorClass}`}>
              <Icon className="h-5 w-5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-700 dark:text-slate-200 truncate">
                {activity.title}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {getActivityLabel(activity.action)}
              </p>
            </div>

            {/* Date/Time */}
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {formatTime(activity.created_at)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatDate(activity.created_at)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Skeleton loader
export function ActivityCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}