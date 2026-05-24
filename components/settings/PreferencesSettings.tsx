'use client';

import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Globe } from 'lucide-react';
import type { ThemeMode, LanguageCode, UserPreferences } from '@/types/profile';
import { THEMES, LANGUAGES } from '@/types/profile';

interface PreferencesSettingsProps {
  preferences: UserPreferences;
  isLoading?: boolean;
  onUpdatePreferences?: (prefs: Partial<UserPreferences>) => Promise<void>;
}

export function PreferencesSettings({
  preferences,
  isLoading,
  onUpdatePreferences,
}: PreferencesSettingsProps) {
  const handleThemeChange = async (theme: ThemeMode) => {
    try {
      await onUpdatePreferences?.({ theme });
      toast.success('Thème mis à jour');
    } catch {
      toast.error('Erreur lors de la mise à jour du thème');
    }
  };

  const handleLanguageChange = async (language: LanguageCode) => {
    try {
      await onUpdatePreferences?.({ language });
      toast.success('Langue mise à jour');
    } catch {
      toast.error('Erreur lors de la mise à jour de la langue');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
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
            <div className="p-2 rounded-lg bg-exevo-orange/10">
              <Palette className="h-5 w-5 text-exevo-orange" />
            </div>
            <div>
              <CardTitle>Préférences</CardTitle>
              <CardDescription>Personnalisez votre expérience</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-slate-500" />
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Mode interface
              </label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {THEMES.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => handleThemeChange(theme.value)}
                  className={`
                    p-3 rounded-lg border-2 transition-all text-sm font-medium
                    ${preferences.theme === theme.value
                      ? 'border-exevo-blue bg-exevo-blue/10 text-exevo-blue'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }
                  `}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-slate-500" />
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Langue
              </label>
            </div>
            <Select
              value={preferences.language}
              onValueChange={(value) => handleLanguageChange(value as LanguageCode)}
            >
              <SelectTrigger className="h-11 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}