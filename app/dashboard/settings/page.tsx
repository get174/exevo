'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Settings as SettingsIcon, User, Lock, Palette, Bell, Database } from 'lucide-react';

import {
  AccountSettings,
  SecuritySettings,
  PreferencesSettings,
  NotificationsSettings,
  DataPrivacy,
} from '@/components/settings';

import {
  SAMPLE_PROFILE,
  SAMPLE_USER_PREFERENCES,
  SAMPLE_ACTIVE_SESSIONS,
  type Profile,
  type UserPreferences,
  type NotificationSettings,
  type ActiveSession,
  type ProfileFormData,
  type PasswordChangeFormData,
  type ExamYear,
} from '@/types/profile';

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile>(SAMPLE_PROFILE);
  const [preferences, setPreferences] = useState<UserPreferences>(SAMPLE_USER_PREFERENCES);
  const [sessions] = useState<ActiveSession[]>(SAMPLE_ACTIVE_SESSIONS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleProfileUpdate = async (data: ProfileFormData) => {
    // In real app: await supabase.from('profiles').update(data).eq('user_id', userId);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setProfile((prev) => ({ ...prev, ...data, exam_year: data.exam_year as ExamYear }));
  };

  const handlePasswordChange = async (data: PasswordChangeFormData) => {
    // In real app: await supabase.auth.updateUser({ password: data.new_password });
    await new Promise((resolve) => setTimeout(resolve, 500));
    void data;
  };

  const handleLogoutSession = async (sessionId: string) => {
    // In real app: await supabase.auth.signOut({ scope: 'others' });
    await new Promise((resolve) => setTimeout(resolve, 300));
    void sessionId;
  };

  const handleLogoutAll = async () => {
    // In real app: await supabase.auth.signOut({ scope: 'global' });
    await new Promise((resolve) => setTimeout(resolve, 300));
  };

  const handlePreferencesUpdate = async (prefs: Partial<UserPreferences>) => {
    // In real app: await supabase.from('user_preferences').update(prefs).eq('user_id', userId);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setPreferences((prev) => ({ ...prev, ...prefs }));
  };

  const handleNotificationsUpdate = async (settings: Partial<NotificationSettings>) => {
    // In real app: await supabase.from('user_preferences').update(settings).eq('user_id', userId);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setPreferences((prev) => ({ ...prev, ...settings }));
  };

  const handleExportData = async () => {
    // In real app: generate and download user data
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleDeleteAccount = async (password: string) => {
    // In real app: verify password and delete account
    await new Promise((resolve) => setTimeout(resolve, 1000));
    void password;
    toast.success('Compte supprimé avec succès');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-exevo-blue to-exevo-blue/90 text-white">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
              <SettingsIcon className="h-6 w-6 text-exevo-orange" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">Paramètres</h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-200 text-sm sm:text-base"
          >
            Gérez votre compte et vos préférences.
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-4xl mx-auto">
        {/* Account Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-slate-500" />
            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
              Compte
            </h2>
          </div>
          <AccountSettings
            profile={profile}
            isLoading={isLoading}
            onSave={handleProfileUpdate}
          />
        </motion.div>

        {/* Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Lock className="h-5 w-5 text-slate-500" />
            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
              Sécurité
            </h2>
          </div>
          <SecuritySettings
            sessions={sessions}
            isLoading={isLoading}
            onChangePassword={handlePasswordChange}
            onLogoutSession={handleLogoutSession}
            onLogoutAll={handleLogoutAll}
          />
        </motion.div>

        {/* Preferences Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-5 w-5 text-slate-500" />
            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
              Préférences
            </h2>
          </div>
          <PreferencesSettings
            preferences={preferences}
            isLoading={isLoading}
            onUpdatePreferences={handlePreferencesUpdate}
          />
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-slate-500" />
            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
              Notifications
            </h2>
          </div>
          <NotificationsSettings
            settings={{
              notifications_enabled: preferences.notifications_enabled,
              email_notifications: preferences.email_notifications,
              push_notifications: preferences.push_notifications,
              new_exams_notifications: preferences.new_exams_notifications,
              new_quiz_notifications: preferences.new_quiz_notifications,
              results_notifications: preferences.results_notifications,
              premium_promo_notifications: preferences.premium_promo_notifications,
            }}
            isLoading={isLoading}
            onUpdateSettings={handleNotificationsUpdate}
          />
        </motion.div>

        {/* Data & Privacy Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Database className="h-5 w-5 text-slate-500" />
            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
              Données et confidentialité
            </h2>
          </div>
          <DataPrivacy
            isLoading={isLoading}
            onExportData={handleExportData}
            onDeleteAccount={handleDeleteAccount}
          />
        </motion.div>
      </div>
    </div>
  );
}
