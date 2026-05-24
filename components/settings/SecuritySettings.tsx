'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Shield, Eye, EyeOff, Lock, Smartphone, Monitor, LogOut, RefreshCw } from 'lucide-react';
import type { PasswordChangeFormData, ActiveSession } from '@/types/profile';
import { calculatePasswordStrength, getPasswordStrengthLabel, getPasswordStrengthColor } from '@/types/profile';

const passwordSchema = z.object({
  current_password: z.string().min(1, 'Le mot de passe actuel est requis'),
  new_password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[a-z]/, 'Au moins une lettre minuscule')
    .regex(/[A-Z]/, 'Au moins une lettre majuscule')
    .regex(/[0-9]/, 'Au moins un chiffre'),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirm_password'],
});

interface SecuritySettingsProps {
  sessions: ActiveSession[];
  isLoading?: boolean;
  onChangePassword?: (data: PasswordChangeFormData) => Promise<void>;
  onLogoutSession?: (sessionId: string) => Promise<void>;
  onLogoutAll?: () => Promise<void>;
}

export function SecuritySettings({
  sessions,
  isLoading,
  onChangePassword,
  onLogoutSession,
  onLogoutAll,
}: SecuritySettingsProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const form = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const newPassword = form.watch('new_password', '');
  const passwordStrength = calculatePasswordStrength(newPassword);
  const passwordStrengthPercent = {
    weak: 25,
    medium: 50,
    strong: 75,
    very_strong: 100,
  }[passwordStrength];

  const handlePasswordSubmit = async (data: PasswordChangeFormData) => {
    setIsChangingPassword(true);
    try {
      await onChangePassword?.(data);
      toast.success('Mot de passe changé avec succès');
      form.reset();
    } catch {
      toast.error('Erreur lors du changement de mot de passe');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogoutSession = async (sessionId: string) => {
    try {
      await onLogoutSession?.(sessionId);
      toast.success('Session déconnectée');
    } catch {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const handleLogoutAll = async () => {
    try {
      await onLogoutAll?.();
      toast.success('Toutes les sessions ont été déconnectées');
    } catch {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Password Change Card */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Lock className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle>Mot de passe et sécurité</CardTitle>
              <CardDescription>Changez votre mot de passe</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handlePasswordSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="current_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe actuel</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showCurrentPassword ? 'text' : 'password'}
                          className="h-11 rounded-lg pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nouveau mot de passe</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showNewPassword ? 'text' : 'password'}
                          className="h-11 rounded-lg pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {newPassword && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Force du mot de passe</span>
                    <span className={getPasswordStrengthColor(passwordStrength)}>
                      {getPasswordStrengthLabel(passwordStrength)}
                    </span>
                  </div>
                  <Progress
                    value={passwordStrengthPercent}
                    className={`h-2 rounded-full ${getPasswordStrengthColor(passwordStrength)}`}
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="h-11 rounded-lg pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isChangingPassword}
                className="bg-exevo-blue hover:bg-exevo-blue/90 text-white"
              >
                <Lock className="h-4 w-4 mr-2" />
                Changer le mot de passe
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Active Sessions Card */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle>Sessions actives</CardTitle>
                <CardDescription>Gérez vos appareils connectés</CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogoutAll}
              className="text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnecter tous
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            [1, 2].map((i) => (
              <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
            ))
          ) : sessions.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">Aucune session active</p>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
              >
                <div className="flex items-center gap-3">
                  {session.device === 'Mobile' ? (
                    <Smartphone className="h-5 w-5 text-slate-400" />
                  ) : (
                    <Monitor className="h-5 w-5 text-slate-400" />
                  )}
                  <div>
                    <p className="font-medium text-slate-700 dark:text-slate-200">
                      {session.browser} sur {session.device}
                    </p>
                    <p className="text-xs text-slate-500">
                      {session.last_activity}
                      {session.current && (
                        <span className="ml-2 text-exevo-orange">Actuelle</span>
                      )}
                    </p>
                  </div>
                </div>
                {!session.current && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-500">
                        <LogOut className="h-4 w-4 mr-2" />
                        Déconnecter
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Déconnecter cet appareil?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette session sera fermée.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleLogoutSession(session.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Déconnecter
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
