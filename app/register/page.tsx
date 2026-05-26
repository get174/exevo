'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  UserPlus,
  User,
  Phone,
  Mail,
  GraduationCap,
  Building2,
  MapPin,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';

const provinces = [
  'Kinshasa',
  'Kongo Central',
  'Haut-Katanga',
  'Lualaba',
  'Nord-Kivu',
  'Sud-Kivu',
  'Équateur',
  'Kasaï',
  'Tanganyika',
  'Maniema',
  'Tshuapa',
  'Kwilu',
  'Kwango',
  'Mai-Ndombe',
  'Mongala',
  'Bas-Uele',
  'Haut-Uele',
  'Ituri',
  'Tshopo',
  'Sankuru',
  'Kasaï-Central',
  'Kasaï-Oriental',
  'Lomami',
];

const sections = [
  'Scientifique',
  'Commerciale',
  'Littéraire',
  'Pédagogie',
  'Nutrition',
  'Électricité',
  'Mécanique',
  'Biologie-Chimie',
  'Math-Physique',
  'Coupe et Couture',
  'Technique sociale',
  'Autre',
];

const examYears = ['2026', '2027', '2028'] as const;

const registerSchema = z
  .object({
    fullName: z.string().min(3, 'Le nom complet doit contenir au moins 3 caractères.'),
    phone: z
      .string()
      .regex(/^\+243\d{9}$/, 'Numéro invalide. Format attendu: +243XXXXXXXXX'),
    email: z.string().email('Email invalide.').optional().or(z.literal('')),
    province: z.string().min(1, 'Veuillez sélectionner une province.'),
    school: z.string().min(2, "Veuillez renseigner le nom de l'école."),
    section: z.string().min(1, 'Veuillez sélectionner une section.'),
    examYear: z.enum(examYears, { required_error: "Veuillez sélectionner l'année de passage." }),
    password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
      .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule.')
      .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule.')
      .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre.'),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((v) => v, {
      message: "Vous devez accepter les conditions d'utilisation.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas.',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const stepFields: Array<Array<keyof RegisterFormValues>> = [
  ['fullName', 'phone', 'email'],
  ['province', 'school', 'section', 'examYear'],
  ['password', 'confirmPassword', 'acceptTerms'],
];

function getPasswordStrength(password: string) {
  if (!password) return { score: 0, label: 'Faible', color: 'bg-red-500' };

  let score = 0;
  if (password.length >= 8) score += 25;
  if (/[A-Z]/.test(password)) score += 25;
  if (/[a-z]/.test(password)) score += 20;
  if (/[0-9]/.test(password)) score += 20;
  if (/[^A-Za-z0-9]/.test(password)) score += 10;

  if (score < 40) return { score, label: 'Faible', color: 'bg-red-500' };
  if (score < 70) return { score, label: 'Moyen', color: 'bg-yellow-500' };
  return { score, label: 'Fort', color: 'bg-emerald-500' };
}

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      phone: '+243',
      email: '',
      province: '',
      school: '',
      section: '',
      examYear: undefined,
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const password = watch('password');
  const phone = watch('phone');
  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const progress = ((currentStep + 1) / 3) * 100;

  const nextStep = async () => {
    const valid = await trigger(stepFields[currentStep], { shouldFocus: true });
    if (!valid) return;
    setCurrentStep((s) => Math.min(s + 1, 2));
  };

  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (values: RegisterFormValues) => {
    setGlobalError(null);

    if (!isSupabaseConfigured() || !supabase) {
      setGlobalError(
        'Configuration Supabase manquante. Ajoute NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY.'
      );
      return;
    }

    const emailToUse = values.email?.trim() || `${values.phone.replace('+', '')}@exevo.local`;

    const { error } = await supabase.auth.signUp({
      email: emailToUse,
      password: values.password,
      options: {
        data: {
          full_name: values.fullName,
          phone: values.phone,
          province: values.province,
          school: values.school,
          section: values.section,
          exam_year: values.examYear,
          profile: {
            subscription_plan: 'free',
            quiz_score: 0,
            downloaded_exams: 0,
            ranking_points: 0,
            is_premium: false,
            notifications_enabled: true,
          },
        },
      },
    });

    if (error) {
      setGlobalError(error.message);
      return;
    }

    setWelcomeMessage("Bienvenue sur ExetatApp 🎓 Commence dès maintenant ta préparation à l’Exetat.");
    setTimeout(() => {
      router.push('/dashboard');
    }, 1400);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-orange-50 px-3 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:px-4 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-2xl"
      >
        <Card className="overflow-hidden rounded-2xl border-0 shadow-2xl shadow-slate-300/40 dark:bg-slate-900 dark:shadow-none">
          <CardHeader className="space-y-4 bg-gradient-to-r from-exevo-blue to-slate-800 p-5 text-white sm:p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/15 p-2.5">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-black sm:text-2xl">Créer mon compte ExetatApp</CardTitle>
                <CardDescription className="text-slate-200">
                  Plateforme éducative moderne pour réussir l&apos;Exetat
                </CardDescription>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-200">
                <span>Étape {currentStep + 1} / 3</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-white/20" />
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <AnimatePresence mode="wait">
                {currentStep === 0 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="grid gap-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-semibold">
                        Nom complet
                      </Label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="fullName"
                          placeholder="Ex : Grâce Mbayo"
                          className="h-12 rounded-xl pl-10 text-base"
                          {...register('fullName')}
                        />
                      </div>
                      {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold">
                        Téléphone
                      </Label>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+243 xxx xxx xxx"
                          className="h-12 rounded-xl pl-10 text-base"
                          {...register('phone')}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/[^\d+]/g, '');
                            const normalized = digits.startsWith('+243')
                              ? digits
                              : `+243${digits.replace(/^\+?243?/, '')}`;
                            setValue('phone', normalized, { shouldValidate: true });
                          }}
                          value={phone || '+243'}
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        Indicatif RDC +243 appliqué automatiquement. Prêt pour Mobile Money futur.
                      </p>
                      {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold">
                        Email <span className="text-slate-500">(optionnel)</span>
                      </Label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="exemple@gmail.com"
                          className="h-12 rounded-xl pl-10 text-base"
                          {...register('email')}
                        />
                      </div>
                      <p className="text-xs text-slate-500">Utilisé pour récupérer votre compte.</p>
                      {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                    </div>
                  </motion.div>
                )}

                {currentStep === 1 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="grid gap-4"
                  >
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Province</Label>
                      <Select onValueChange={(v) => setValue('province', v, { shouldValidate: true })}>
                        <SelectTrigger className="h-12 rounded-xl text-base">
                          <SelectValue placeholder="Sélectionnez votre province" />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map((province) => (
                            <SelectItem key={province} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.province && <p className="text-xs text-red-500">{errors.province.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="school" className="text-sm font-semibold">
                        École
                      </Label>
                      <div className="relative">
                        <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="school"
                          placeholder="Nom de votre école"
                          className="h-12 rounded-xl pl-10 text-base"
                          {...register('school')}
                        />
                      </div>
                      {errors.school && <p className="text-xs text-red-500">{errors.school.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Option / Section</Label>
                      <Select onValueChange={(v) => setValue('section', v, { shouldValidate: true })}>
                        <SelectTrigger className="h-12 rounded-xl text-base">
                          <SelectValue placeholder="Choisissez votre section" />
                        </SelectTrigger>
                        <SelectContent>
                          {sections.map((section) => (
                            <SelectItem key={section} value={section}>
                              {section}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.section && <p className="text-xs text-red-500">{errors.section.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Année de passage Exetat</Label>
                      <Select onValueChange={(v) => setValue('examYear', v as (typeof examYears)[number], { shouldValidate: true })}>
                        <SelectTrigger className="h-12 rounded-xl text-base">
                          <SelectValue placeholder="Choisissez l'année" />
                        </SelectTrigger>
                        <SelectContent>
                          {examYears.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.examYear && <p className="text-xs text-red-500">{errors.examYear.message}</p>}
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="grid gap-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-semibold">
                        Mot de passe
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="********"
                          className="h-12 rounded-xl pr-10 text-base"
                          {...register('password')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                          aria-label="Afficher ou masquer le mot de passe"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      <div className="space-y-1">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                          <div className={`h-full ${strength.color} transition-all`} style={{ width: `${strength.score}%` }} />
                        </div>
                        <p className="text-xs text-slate-500">Force du mot de passe : {strength.label}</p>
                      </div>

                      {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-semibold">
                        Confirmation mot de passe
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPasswordConfirm ? 'text' : 'password'}
                          placeholder="********"
                          className="h-12 rounded-xl pr-10 text-base"
                          {...register('confirmPassword')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswordConfirm((p) => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                          aria-label="Afficher ou masquer la confirmation"
                        >
                          {showPasswordConfirm ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
                      )}
                    </div>

                    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="acceptTerms"
                          onCheckedChange={(checked) => setValue('acceptTerms', Boolean(checked), { shouldValidate: true })}
                        />
                        <div>
                          <Label htmlFor="acceptTerms" className="cursor-pointer text-sm leading-relaxed">
                            J&apos;accepte les conditions d&apos;utilisation et la politique de confidentialité.
                          </Label>
                          {errors.acceptTerms && (
                            <p className="mt-1 text-xs text-red-500">{errors.acceptTerms.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {globalError && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {globalError}
                </p>
              )}

              {welcomeMessage && (
                <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {welcomeMessage}
                </p>
              )}

              <div className="flex items-center justify-between gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-xl"
                  onClick={prevStep}
                  disabled={currentStep === 0 || isSubmitting}
                >
                  Retour
                </Button>

                {currentStep < 2 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="h-11 rounded-xl bg-exevo-blue text-white hover:bg-slate-800"
                  >
                    Continuer
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 rounded-xl bg-exevo-orange text-white hover:bg-exevo-light-orange"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center">
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Inscription...
                      </span>
                    ) : (
                      <span className="inline-flex items-center">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Créer mon compte
                      </span>
                    )}
                  </Button>
                )}
              </div>
            </form>

            <div className="mt-6 space-y-3">
              <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <p className="mb-1 inline-flex items-center gap-2 font-semibold">
                  <ShieldCheck className="h-4 w-4 text-exevo-orange" />
                  Prévu pour les évolutions futures
                </p>
                <p>
                  Abonnement, score quiz, examens téléchargés, classement national, système premium et notifications.
                </p>
              </div>

              <p className="text-center text-sm text-slate-600 dark:text-slate-300">
                Déjà inscrit ?{' '}
                <Link href="/login" className="font-semibold text-exevo-orange hover:underline">
                  Se connecter
                </Link>
              </p>

              <p className="text-center text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> Conçu pour les élèves de RDC
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Interface moderne, fluide et optimisée mobile Android
          </span>
        </div>
      </motion.div>
    </main>
  );
}
