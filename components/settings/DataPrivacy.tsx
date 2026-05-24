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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Download, Trash2, FileText, Database, BarChart3, AlertTriangle } from 'lucide-react';

const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Le mot de passe est requis'),
  confirmation: z.string(),
}).refine((data) => data.confirmation === 'SUPPRIMER', {
  message: 'Tapez SUPPRIMER pour confirmer',
  path: ['confirmation'],
});

interface DataPrivacyProps {
  isLoading?: boolean;
  onExportData?: () => Promise<void>;
  onDeleteAccount?: (password: string) => Promise<void>;
}

export function DataPrivacy({ isLoading, onExportData, onDeleteAccount }: DataPrivacyProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<z.infer<typeof deleteAccountSchema>>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      password: '',
      confirmation: '',
    },
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExportData?.();
      toast.success('Données exportées avec succès');
    } catch {
      toast.error('Erreur lors de l\'exportation');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteSubmit = async (data: z.infer<typeof deleteAccountSchema>) => {
    setIsDeleting(true);
    try {
      await onDeleteAccount?.(data.password);
      toast.success('Compte supprimé');
    } catch {
      toast.error('Erreur lors de la suppression du compte');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Export Data Card */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Download className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle>Télécharger mes données</CardTitle>
              <CardDescription>Exportez une copie de vos données</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <FileText className="h-4 w-4 text-slate-500" />
                <span className="text-xs">Profil</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Database className="h-4 w-4 text-slate-500" />
                <span className="text-xs">Historique quiz</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Download className="h-4 w-4 text-slate-500" />
                <span className="text-xs">Téléchargements</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <BarChart3 className="h-4 w-4 text-slate-500" />
                <span className="text-xs">Statistiques</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleExport}
              disabled={isExporting}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exportation...' : 'Télécharger mes données'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account Card */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-red-600">Supprimer mon compte</CardTitle>
              <CardDescription>Cette action est irréversible</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full bg-red-500 hover:bg-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer mon compte
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Attention - Action irréversible
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-4">
                  <p>
                    La suppression de votre compte entrainera la perte définitive de :
                  </p>
                  <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Votre profil et informations personnelles</li>
                    <li>Votre historique de quiz et résultats</li>
                    <li>Vos examens téléchargés</li>
                    <li>Vos statistiques de progression</li>
                    <li>Tous vos badges et récompenses</li>
                  </ul>
                  <p className="font-medium text-slate-700 dark:text-slate-200">
                    Cette action ne peut pas être annulée.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleDeleteSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Entrez votre mot de passe"
                            className="h-11 rounded-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tapez SUPPRIMER pour confirmer</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="SUPPRIMER"
                            className="h-11 rounded-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <Button
                      type="submit"
                      disabled={isDeleting}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      {isDeleting ? 'Suppression...' : 'Confirmer la suppression'}
                    </Button>
                  </AlertDialogFooter>
                </form>
              </Form>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </motion.div>
  );
}
