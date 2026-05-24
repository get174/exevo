'use client';

import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Bell, Mail, Smartphone } from 'lucide-react';
import type { NotificationSettings } from '@/types/profile';

interface NotificationsSettingsProps {
  settings: NotificationSettings;
  isLoading?: boolean;
  onUpdateSettings?: (settings: Partial<NotificationSettings>) => Promise<void>;
}

export function NotificationsSettings({
  settings,
  isLoading,
  onUpdateSettings,
}: NotificationsSettingsProps) {
  const handleToggle = async (key: keyof NotificationSettings, value: boolean) => {
    try {
      await onUpdateSettings?.({ [key]: value });
      toast.success('Paramètre mis à jour');
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          ))}
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
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <Bell className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Choisissez ce que vous souhaitez recevoir</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                <Smartphone className="h-4 w-4 text-slate-500" />
              </div>
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-200">Notifications push</p>
                <p className="text-xs text-slate-500">Alertes sur votre appareil</p>
              </div>
            </div>
            <Switch
              checked={settings.push_notifications}
              onCheckedChange={(checked) => handleToggle('push_notifications', checked)}
              disabled
              className="opacity-50"
            />
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                <Mail className="h-4 w-4 text-slate-500" />
              </div>
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-200">Notifications email</p>
                <p className="text-xs text-slate-500">Recevoir les notifications par email</p>
              </div>
            </div>
            <Switch
              checked={settings.email_notifications}
              onCheckedChange={(checked) => handleToggle('email_notifications', checked)}
            />
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-6 space-y-4">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Autoriser les notifications pour :
            </p>

            {/* New Exams */}
            <div className="flex items-center justify-between">
              <p className="text-slate-700 dark:text-slate-200">Nouveaux examens disponibles</p>
              <Switch
                checked={settings.new_exams_notifications}
                onCheckedChange={(checked) => handleToggle('new_exams_notifications', checked)}
              />
            </div>

            {/* New Quizzes */}
            <div className="flex items-center justify-between">
              <p className="text-slate-700 dark:text-slate-200">Nouveaux quiz</p>
              <Switch
                checked={settings.new_quiz_notifications}
                onCheckedChange={(checked) => handleToggle('new_quiz_notifications', checked)}
              />
            </div>

            {/* Results & Progress */}
            <div className="flex items-center justify-between">
              <p className="text-slate-700 dark:text-slate-200">Résultats et progression</p>
              <Switch
                checked={settings.results_notifications}
                onCheckedChange={(checked) => handleToggle('results_notifications', checked)}
              />
            </div>

            {/* Premium Promotions */}
            <div className="flex items-center justify-between">
              <p className="text-slate-700 dark:text-slate-200">Promotions premium</p>
              <Switch
                checked={settings.premium_promo_notifications}
                onCheckedChange={(checked) => handleToggle('premium_promo_notifications', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
