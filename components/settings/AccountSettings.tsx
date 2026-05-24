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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Save, Edit2 } from 'lucide-react';
import type { Profile, ProfileFormData } from '@/types/profile';
import { PROVINCES, SCHOOL_OPTIONS, EXAM_YEARS } from '@/types/profile';

const accountSchema = z.object({
  full_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  phone: z.string().regex(/^\+243[0-9]{9}$/, 'Numéro invalide (format: +243XXXXXXXXX)'),
  email: z.string().email('Email invalide'),
  school: z.string().min(2, 'Le nom de l\'école est requis'),
  province: z.string().min(1, 'La province est requise'),
  option: z.string().min(1, 'L\'option est requise'),
  exam_year: z.coerce.number().min(2020).max(2025),
});

interface AccountSettingsProps {
  profile: Profile;
  isLoading?: boolean;
  onSave?: (data: ProfileFormData) => Promise<void>;
}

export function AccountSettings({ profile, isLoading, onSave }: AccountSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      full_name: profile.full_name,
      phone: profile.phone,
      email: profile.email,
      school: profile.school,
      province: profile.province,
      option: profile.option,
      exam_year: profile.exam_year,
    },
  });

  const handleSubmit = async (data: ProfileFormData) => {
    try {
      await onSave?.(data);
      toast.success('Profil mis à jour avec succès');
      setIsEditing(false);
    } catch {
      toast.error('Erreur lors de la mise à jour du profil');
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-exevo-blue/10">
                <User className="h-5 w-5 text-exevo-blue" />
              </div>
              <div>
                <CardTitle>Informations du compte</CardTitle>
                <CardDescription>Gérez vos informations personnelles</CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="text-exevo-blue"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              {isEditing ? 'Annuler' : 'Modifier'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing}
                          className="h-11 rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing}
                          placeholder="+243XXXXXXXXX"
                          className="h-11 rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          disabled={!isEditing}
                          className="h-11 rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>École</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing}
                          className="h-11 rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Province</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!isEditing}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-lg">
                            <SelectValue placeholder="Sélectionner une province" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PROVINCES.map((province) => (
                            <SelectItem key={province} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="option"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Option scolaire</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!isEditing}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-lg">
                            <SelectValue placeholder="Sélectionner une option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SCHOOL_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="exam_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Année Exetat</FormLabel>
                      <Select
                        value={field.value.toString()}
                        onValueChange={(val) => field.onChange(parseInt(val))}
                        disabled={!isEditing}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-lg">
                            <SelectValue placeholder="Sélectionner une année" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {EXAM_YEARS.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {isEditing && (
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    className="bg-exevo-blue hover:bg-exevo-blue/90 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
