// Types for the Profile module

export type SubscriptionType = 'gratuit' | 'premium';

export type ExamYear = 2020 | 2021 | 2022 | 2023 | 2024 | 2025;

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  school: string;
  province: string;
  option: string;
  exam_year: ExamYear;
  avatar_url: string | null;
  subscription: SubscriptionType;
  created_at: string;
}

export interface UserStats {
  id: string;
  user_id: string;
  exams_opened: number;
  quizzes_completed: number;
  average_score: number;
  study_time_minutes: number;
}

export interface SubjectProgress {
  subject: string;
  progress: number;
  color: string;
}

export type ActivityType = 'quiz' | 'exam' | 'simulation';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  date: string;
  time: string;
}

export interface PersonalGoal {
  id: string;
  type: 'score' | 'daily';
  target: string;
  current: number;
  created_at: string;
}

// Default/empty state interfaces
export interface ProfileFormData {
  full_name: string;
  phone: string;
  email: string;
  school: string;
  province: string;
  option: string;
  exam_year: ExamYear;
}

// Sample data for demo
export const SAMPLE_PROFILE: Profile = {
  id: '1',
  full_name: 'Grâce Mbayo',
  phone: '+243 812 345 678',
  email: 'grace.mbayo@email.com',
  school: 'Institut Mpumwire',
  province: 'Kongo Central',
  option: 'Scientifique',
  exam_year: 2024,
  avatar_url: null,
  subscription: 'gratuit',
  created_at: '2023-06-15T00:00:00Z',
};

export const SAMPLE_USER_STATS: UserStats = {
  id: '1',
  user_id: '1',
  exams_opened: 45,
  quizzes_completed: 128,
  average_score: 72,
  study_time_minutes: 1850,
};

export const SAMPLE_SUBJECT_PROGRESS: SubjectProgress[] = [
  { subject: 'Mathématiques', progress: 80, color: '#F97316' },
  { subject: 'Physique', progress: 50, color: '#0F172A' },
  { subject: 'Chimie', progress: 70, color: '#22C55E' },
  { subject: 'Français', progress: 90, color: '#3B82F6' },
];

export const SAMPLE_ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'quiz',
    title: 'Quiz Mathématiques terminé',
    date: '15 Mars 2024',
    time: '14:30',
  },
  {
    id: '2',
    type: 'exam',
    title: 'Examen Physique téléchargé',
    date: '14 Mars 2024',
    time: '10:15',
  },
  {
    id: '3',
    type: 'simulation',
    title: 'Simulation commencée',
    date: '13 Mars 2024',
    time: '16:45',
  },
];

export const SAMPLE_GOALS: PersonalGoal[] = [
  {
    id: '1',
    type: 'score',
    target: 'Obtenir 75%',
    current: 65,
    created_at: '2024-03-01T00:00:00Z',
  },
  {
    id: '2',
    type: 'daily',
    target: '30 minutes de révision',
    current: 20,
    created_at: '2024-03-01T00:00:00Z',
  },
];

// Constants for options
export const PROVINCES = [
  'Kinshasa',
  'Kongo Central',
  'Haut-Katanga',
  'Nord-Kivu',
  'Sud-Kivu',
  'Ituri',
  'Tshopo',
  'Oriental',
  'Kasai Oriental',
  'Kasai Central',
  'Lualaba',
  'Haut-Lomani',
  'Maniema',
  'Kasaï',
  'Kwilu',
  'Kwilu',
  'Bas-Uele',
  'Mongala',
  'Tshuapa',
  'Equateur',
  'Nord-Ubangi',
  'Sud-Ubangi',
  'Mai-Ndombe',
  'Popokabaka',
] as const;

export const SCHOOL_OPTIONS = [
  'Scientifique',
  'Commerciale',
  'Littéraire',
  'Pédagogie',
  'Technique',
] as const;

export const EXAM_YEARS = [2020, 2021, 2022, 2023, 2024, 2025] as const;

// Activity icon helpers
export function getActivityIcon(type: ActivityType): string {
  switch (type) {
    case 'quiz':
      return '✓';
    case 'exam':
      return '📄';
    case 'simulation':
      return '⏱';
    default:
      return '•';
  }
}

export function getActivityColor(type: ActivityType): string {
  switch (type) {
    case 'quiz':
      return 'text-green-500 bg-green-100 dark:bg-green-900/30';
    case 'exam':
      return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
    case 'simulation':
      return 'text-orange-500 bg-orange-100 dark:bg-orange-900/30';
    default:
      return 'text-slate-500 bg-slate-100 dark:bg-slate-800';
  }
}

// =====================================================
// Settings Types
// =====================================================

export type ThemeMode = 'light' | 'dark' | 'system';
export type LanguageCode = 'fr' | 'en' | 'ln' | 'sw';

export interface UserPreferences {
  id: string;
  user_id: string;
  theme: ThemeMode;
  language: LanguageCode;
  notifications_enabled: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  new_exams_notifications: boolean;
  new_quiz_notifications: boolean;
  results_notifications: boolean;
  premium_promo_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationSettings {
  notifications_enabled: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  new_exams_notifications: boolean;
  new_quiz_notifications: boolean;
  results_notifications: boolean;
  premium_promo_notifications: boolean;
}

export interface PasswordChangeFormData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface AccountDeleteFormData {
  password: string;
  confirmation: string;
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  last_activity: string;
  current: boolean;
}

// Password strength levels
export type PasswordStrength = 'weak' | 'medium' | 'strong' | 'very_strong';

export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) return 'weak';
  
  let score = 0;
  
  // Length checks
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // Character type checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  
  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  if (score <= 5) return 'strong';
  return 'very_strong';
}

export function getPasswordStrengthLabel(strength: PasswordStrength): string {
  switch (strength) {
    case 'weak':
      return 'Faible';
    case 'medium':
      return 'Moyen';
    case 'strong':
      return 'Fort';
    case 'very_strong':
      return 'Très fort';
  }
}

export function getPasswordStrengthColor(strength: PasswordStrength): string {
  switch (strength) {
    case 'weak':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'strong':
      return 'bg-green-500';
    case 'very_strong':
      return 'bg-green-600';
  }
}

// Sample data for settings
export const SAMPLE_USER_PREFERENCES: UserPreferences = {
  id: '1',
  user_id: '1',
  theme: 'system',
  language: 'fr',
  notifications_enabled: true,
  email_notifications: true,
  push_notifications: false,
  new_exams_notifications: true,
  new_quiz_notifications: true,
  results_notifications: true,
  premium_promo_notifications: true,
  created_at: '2023-06-15T00:00:00Z',
  updated_at: '2024-03-15T00:00:00Z',
};

export const SAMPLE_ACTIVE_SESSIONS: ActiveSession[] = [
  {
    id: '1',
    device: 'Android',
    browser: 'Chrome',
    last_activity: 'Il y a 5 minutes',
    current: true,
  },
  {
    id: '2',
    device: 'Windows',
    browser: 'Firefox',
    last_activity: 'Il y a 2 jours',
    current: false,
  },
  {
    id: '3',
    device: 'iPhone',
    browser: 'Safari',
    last_activity: 'Il y a 1 semaine',
    current: false,
  },
];

export const THEMES: { value: ThemeMode; label: string }[] = [
  { value: 'light', label: 'Clair' },
  { value: 'dark', label: 'Sombre' },
  { value: 'system', label: 'Système automatique' },
];

export const LANGUAGES: { value: LanguageCode; label: string }[] = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'Anglais' },
  { value: 'ln', label: 'Lingala' },
  { value: 'sw', label: 'Swahili' },
];
