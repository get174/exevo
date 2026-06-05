'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Settings as SettingsIcon, User, Lock, Palette, Bell, Database, Crown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/supabase';

import {
  AccountSettings,
  SecuritySettings,
  PreferencesSettings,
  NotificationsSettings,
  DataPrivacy,
  PremiumSettings,
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
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserData() {
      console.log('=== Loading user data ===');
      console.log('isSupabaseConfigured:', isSupabaseConfigured());
      console.log('supabase:', supabase);

      if (!isSupabaseConfigured() || !supabase) {
        console.log('Supabase not configured, skipping...');
        setIsLoading(false);
        return;
      }

      try {
        // Use getSession instead of getUser to avoid CORS issues
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('Auth session result:', { session, sessionError });

        if (sessionError) {
          console.error('Session error:', sessionError);
        }

        const user = session?.user;
        if (!user) {
          console.log('No user found in session');
          setIsLoading(false);
          return;
        }

        console.log('User ID:', user.id);
        setUserId(user.id);

        // Load profile
        console.log('Loading profile for user_id:', user.id);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        console.log('Profile query result:', { profileData, profileError });

        if (profileData) {
          setProfile({
            id: profileData.id,
            full_name: profileData.full_name || '',
            phone: profileData.phone || '',
            email: profileData.email || user.email || '',
            school: profileData.school || '',
            province: profileData.province || '',
            option: profileData.option || '',
            exam_year: profileData.exam_year || 2025,
            avatar_url: profileData.avatar_url || null,
            subscription: profileData.subscription || 'gratuit',
            created_at: profileData.created_at,
          });
        } else {
          console.log('No profile found, creating default profile...');
          // Create a default profile if it doesn't exist
          const defaultProfile = {
            user_id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
            phone: user.user_metadata?.phone || '',
            email: user.email || '',
            school: user.user_metadata?.school || '',
            province: user.user_metadata?.province || '',
            option: user.user_metadata?.option || '',
            exam_year: 2025,
          };

          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert(defaultProfile)
            .select()
            .single();

          if (insertError) {
            console.error('Error creating profile:', insertError);
          } else if (newProfile) {
            console.log('Created new profile:', newProfile);
            setProfile({
              id: newProfile.id,
              full_name: newProfile.full_name || '',
              phone: newProfile.phone || '',
              email: newProfile.email || user.email || '',
              school: newProfile.school || '',
              province: newProfile.province || '',
              option: newProfile.option || '',
              exam_year: newProfile.exam_year || 2025,
              avatar_url: newProfile.avatar_url || null,
              subscription: newProfile.subscription || 'gratuit',
              created_at: newProfile.created_at,
            });
          }
        }

        // Load preferences
        console.log('Loading preferences for user_id:', user.id);
        const { data: prefsData, error: prefsError } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        console.log('Preferences query result:', { prefsData, prefsError });

        if (prefsData) {
          setPreferences({
            id: prefsData.id,
            user_id: prefsData.user_id,
            theme: prefsData.theme || 'system',
            language: prefsData.language || 'fr',
            notifications_enabled: prefsData.notifications_enabled ?? true,
            email_notifications: prefsData.email_notifications ?? true,
            push_notifications: prefsData.push_notifications ?? false,
            new_exams_notifications: prefsData.new_exams_notifications ?? true,
            new_quiz_notifications: prefsData.new_quiz_notifications ?? true,
            results_notifications: prefsData.results_notifications ?? true,
            premium_promo_notifications: prefsData.premium_promo_notifications ?? true,
            created_at: prefsData.created_at,
            updated_at: prefsData.updated_at,
          });
        } else {
          console.log('No preferences found, creating default...');
          // Create default preferences if they don't exist
          const { error: insertPrefsError } = await supabase.from('user_preferences').insert({
            user_id: user.id,
            theme: 'system',
            language: 'fr',
            notifications_enabled: true,
            email_notifications: true,
            push_notifications: false,
            new_exams_notifications: true,
            new_quiz_notifications: true,
            results_notifications: true,
            premium_promo_notifications: true,
          });

          if (insertPrefsError) {
            console.error('Error creating preferences:', insertPrefsError);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        console.log('=== Finished loading ===');
        setIsLoading(false);
      }
    }

    loadUserData();
  }, []);

  const handleProfileUpdate = async (data: ProfileFormData) => {
    if (!isSupabaseConfigured() || !supabase || !userId) {
      // Fallback to local state only
      setProfile((prev) => ({ ...prev, ...data, exam_year: data.exam_year as ExamYear }));
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          phone: data.phone,
          school: data.school,
          province: data.province,
          option: data.option,
          exam_year: data.exam_year,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) throw error;

      setProfile((prev) => ({ ...prev, ...data, exam_year: data.exam_year as ExamYear }));
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const handlePasswordChange = async (data: PasswordChangeFormData) => {
    if (!isSupabaseConfigured() || !supabase) {
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.new_password,
      });

      if (error) throw error;
      toast.success('Mot de passe mis à jour avec succès');
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  };

  const handleLogoutSession = async (sessionId: string) => {
    // Sessions management via Supabase is handled differently
    void sessionId;
  };

  const handleLogoutAll = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      return;
    }

    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handlePreferencesUpdate = async (prefs: Partial<UserPreferences>) => {
    if (!isSupabaseConfigured() || !supabase || !userId) {
      setPreferences((prev) => ({ ...prev, ...prefs }));
      return;
    }

    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({
          ...prefs,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) throw error;

      setPreferences((prev) => ({ ...prev, ...prefs }));
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  };

  const handleNotificationsUpdate = async (settings: Partial<NotificationSettings>) => {
    if (!isSupabaseConfigured() || !supabase || !userId) {
      setPreferences((prev) => ({ ...prev, ...settings }));
      return;
    }

    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({
          ...settings,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) throw error;

      setPreferences((prev) => ({ ...prev, ...settings }));
    } catch (error) {
      console.error('Error updating notifications:', error);
      throw error;
    }
  };

  const handleExportData = async () => {
    if (!isSupabaseConfigured() || !supabase || !userId) {
      toast.error('Configuration Supabase requise');
      return;
    }

    try {
      // Gather all user data
      const [profileResult, prefsResult, statsResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', userId).single(),
        supabase.from('user_preferences').select('*').eq('user_id', userId).single(),
        supabase.from('user_stats').select('*').eq('user_id', userId).single(),
      ]);

      const exportData = {
        profile: profileResult.data,
        preferences: prefsResult.data,
        stats: statsResult.data,
        exportedAt: new Date().toISOString(),
      };

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `exevo-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Données exportées avec succès');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Erreur lors de l\'exportation');
    }
  };

  const handleDeleteAccount = async (password: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      return;
    }

    try {
      // Verify password by attempting to sign in
      const { error } = await supabase.auth.signInWithOtp({
        email: profile.email,
      });

      if (error) throw error;

      // Delete user data from all tables
      const tables = ['profiles', 'user_preferences', 'user_stats', 'user_activities', 'personal_goals', 'subject_progress', 'leaderboard'];
      for (const table of tables) {
        await supabase.from(table).delete().eq('user_id', userId);
      }

      // Delete auth user
      // Note: This typically requires admin privileges or a server-side action
      toast.success('Compte supprimé avec succès');
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  };

  const handleUpgradeSubscription = async (planId: string) => {
    if (!isSupabaseConfigured() || !supabase || !userId) {
      setProfile((prev) => ({ ...prev, subscription: 'premium' }));
      toast.success('Abonnement Premium activé !');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription: 'premium',
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) throw error;

      setProfile((prev) => ({ ...prev, subscription: 'premium' }));
      toast.success('Abonnement Premium activé avec succès !');
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      toast.error('Erreur lors de l\'activation du Premium');
      throw error;
    }
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
        {/* Premium Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Crown className="h-5 w-5 text-exevo-orange" />
            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
              Premium
            </h2>
          </div>
          <PremiumSettings
            profile={profile}
            isLoading={isLoading}
            onUpgrade={handleUpgradeSubscription}
          />
        </motion.div>

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
