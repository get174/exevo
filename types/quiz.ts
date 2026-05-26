// Types for the Quiz module

export type QuizDifficulty = 'Facile' | 'Moyen' | 'Difficile';

export type QuizSubject = 
  | 'Mathématiques'
  | 'Physique'
  | 'Chimie'
  | 'Français'
  | 'Biologie'
  | 'Géographie';

export type QuizOption = 
  | 'Scientifique'
  | 'Commerciale'
  | 'Littéraire'
  | 'Pédagogie'
  | 'Technique';

export type AnswerOption = 'A' | 'B' | 'C' | 'D';

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  option: string;
  difficulty: QuizDifficulty;
  duration_minutes: number;
  questions_count: number;
  average_score: number;
  times_completed: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_number: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: AnswerOption;
  explanation: string | null;
  created_at: string;
}

export interface QuizResult {
  id: string;
  user_id: string | null;
  quiz_id: string;
  score: number;
  correct_count: number;
  wrong_count: number;
  time_spent_seconds: number;
  created_at: string;
}

export interface UserQuizProgress {
  id: string;
  user_id: string | null;
  quiz_id: string;
  current_question: number;
  answers: Record<number, AnswerOption>;
  started_at: string;
  updated_at: string;
}

export interface QuizFilters {
  search: string;
  subject: string | null;
  option: string | null;
  difficulty: string | null;
  duration: string | null;
}

export interface QuizListResponse {
  quizzes: Quiz[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter options constants
export const QUIZ_SUBJECTS = [
  'Mathématiques',
  'Physique', 
  'Chimie',
  'Français',
  'Biologie',
  'Géographie',
] as const;

export const QUIZ_OPTIONS = [
  'Scientifique',
  'Commerciale',
  'Littéraire',
  'Pédagogie',
  'Technique',
] as const;

export const QUIZ_DIFFICULTIES = ['Facile', 'Moyen', 'Difficile'] as const;

export const DURATION_FILTERS = [
  { label: '< 5 min', value: 'short', min: 0, max: 5 },
  { label: '5-10 min', value: 'medium', min: 5, max: 10 },
  { label: '> 10 min', value: 'long', min: 10, max: Infinity },
] as const;

// Default filter values
export const DEFAULT_QUIZ_FILTERS: QuizFilters = {
  search: '',
  subject: null,
  option: null,
  difficulty: null,
  duration: null,
};

// Pagination defaults
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 12,
};

// Sample quizzes for demo (when Supabase is not configured)
export const SAMPLE_QUIZZES: Quiz[] = [
  {
    id: '1',
    title: 'Mathématiques Exetat 2023',
    subject: 'Mathématiques',
    option: 'Scientifique',
    difficulty: 'Difficile',
    duration_minutes: 10,
    questions_count: 10,
    average_score: 65.5,
    times_completed: 234,
    is_active: true,
    created_at: '2023-06-15T00:00:00Z',
    updated_at: '2023-06-15T00:00:00Z',
  },
  {
    id: '2',
    title: 'Physique Scientifique',
    subject: 'Physique',
    option: 'Scientifique',
    difficulty: 'Moyen',
    duration_minutes: 8,
    questions_count: 10,
    average_score: 72.3,
    times_completed: 189,
    is_active: true,
    created_at: '2023-06-15T00:00:00Z',
    updated_at: '2023-06-15T00:00:00Z',
  },
  {
    id: '3',
    title: 'Chimie Exetat',
    subject: 'Chimie',
    option: 'Scientifique',
    difficulty: 'Difficile',
    duration_minutes: 10,
    questions_count: 10,
    average_score: 58.7,
    times_completed: 156,
    is_active: true,
    created_at: '2022-06-15T00:00:00Z',
    updated_at: '2022-06-15T00:00:00Z',
  },
  {
    id: '4',
    title: 'Français Littéraire',
    subject: 'Français',
    option: 'Littéraire',
    difficulty: 'Facile',
    duration_minutes: 8,
    questions_count: 10,
    average_score: 78.2,
    times_completed: 267,
    is_active: true,
    created_at: '2023-06-15T00:00:00Z',
    updated_at: '2023-06-15T00:00:00Z',
  },
  {
    id: '5',
    title: 'Géographie Exetat',
    subject: 'Géographie',
    option: 'Littéraire',
    difficulty: 'Facile',
    duration_minutes: 6,
    questions_count: 10,
    average_score: 82.1,
    times_completed: 145,
    is_active: true,
    created_at: '2023-06-15T00:00:00Z',
    updated_at: '2023-06-15T00:00:00Z',
  },
  {
    id: '6',
    title: 'Biologie Scientifique',
    subject: 'Biologie',
    option: 'Scientifique',
    difficulty: 'Moyen',
    duration_minutes: 8,
    questions_count: 10,
    average_score: 70.4,
    times_completed: 178,
    is_active: true,
    created_at: '2022-06-15T00:00:00Z',
    updated_at: '2022-06-15T00:00:00Z',
  },
  {
    id: '7',
    title: 'Mathématiques Commerciale',
    subject: 'Mathématiques',
    option: 'Commerciale',
    difficulty: 'Moyen',
    duration_minutes: 8,
    questions_count: 10,
    average_score: 74.6,
    times_completed: 123,
    is_active: true,
    created_at: '2023-06-15T00:00:00Z',
    updated_at: '2023-06-15T00:00:00Z',
  },
  {
    id: '8',
    title: 'Français Pédagogie',
    subject: 'Français',
    option: 'Pédagogie',
    difficulty: 'Facile',
    duration_minutes: 6,
    questions_count: 10,
    average_score: 85.3,
    times_completed: 98,
    is_active: true,
    created_at: '2022-06-15T00:00:00Z',
    updated_at: '2022-06-15T00:00:00Z',
  },
];

// Sample questions for Mathématiques quiz
export const SAMPLE_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    quiz_id: '1',
    question_number: 1,
    question_text: 'Combien vaut √144 ?',
    option_a: '10',
    option_b: '12',
    option_c: '14',
    option_d: '16',
    correct_answer: 'B',
    explanation: '144 est le carré de 12, donc √144 = 12',
    created_at: '2023-06-15T00:00:00Z',
  },
  {
    id: 'q2',
    quiz_id: '1',
    question_number: 2,
    question_text: 'Simplifiez : 2⁴ × 2³',
    option_a: '2⁷',
    option_b: '2¹²',
    option_c: '4⁷',
    option_d: '4¹²',
    correct_answer: 'A',
    explanation: 'Pour multiplier les puissances de même base, on additionne les exposants : 4 + 3 = 7',
    created_at: '2023-06-15T00:00:00Z',
  },
  {
    id: 'q3',
    quiz_id: '1',
    question_number: 3,
    question_text: "La solution de l'équation 2x + 5 = 13 est :",
    option_a: 'x = 4',
    option_b: 'x = 5',
    option_c: 'x = 6',
    option_d: 'x = 7',
    correct_answer: 'A',
    explanation: '2x = 13 - 5 = 8, donc x = 8/2 = 4',
    created_at: '2023-06-15T00:00:00Z',
  },
  {
    id: 'q4',
    quiz_id: '1',
    question_number: 4,
    question_text: 'Quel est le PGCD de 36 et 48 ?',
    option_a: '6',
    option_b: '12',
    option_c: '18',
    option_d: '24',
    correct_answer: 'B',
    explanation: '36 = 2² × 3², 48 = 2⁴ × 3, PGCD = 2² × 3 = 12',
    created_at: '2023-06-15T00:00:00Z',
  },
  {
    id: 'q5',
    quiz_id: '1',
    question_number: 5,
    question_text: "Le périmètre d'un cercle de rayon 7 cm est : (π ≈ 22/7)",
    option_a: '22 cm',
    option_b: '44 cm',
    option_c: '77 cm',
    option_d: '154 cm',
    correct_answer: 'B',
    explanation: 'P = 2πr = 2 × 22/7 × 7 = 44 cm',
    created_at: '2023-06-15T00:00:00Z',
  },
  {
    id: 'q6',
    quiz_id: '1',
    question_number: 6,
    question_text: "Résolvez : |x - 3| = 7",
    option_a: 'x = 10',
    option_b: 'x = -4',
    option_c: 'x = 10 ou x = -4',
    option_d: 'x = 4',
    correct_answer: 'C',
    explanation: '|x - 3| = 7 donne x - 3 = 7 ou x - 3 = -7, donc x = 10 ou x = -4',
    created_at: '2023-06-15T00:00:00Z',
  },
  {
    id: 'q7',
    quiz_id: '1',
    question_number: 7,
    question_text: 'Combien de mots de 3 lettres peut-on former avec les lettres A, B, C, D, E ?',
    option_a: '60',
    option_b: '125',
    option_c: '100',
    option_d: '90',
    correct_answer: 'A',
    explanation: 'Pour les permutations de 5 lettres prises 3 : P(5,3) = 5 × 4 × 3 = 60',
    created_at: '2023-06-15T00:00:00Z',
  },
  {
    id: 'q8',
    quiz_id: '1',
    question_number: 8,
    question_text: 'La fonction dérivée de f(x) = x³ est :',
    option_a: "f'(x) = x²",
    option_b: "f'(x) = 3x²",
    option_c: "f'(x) = 3x",
    option_d: "f'(x) = x³/3",
    correct_answer: 'B',
    explanation: "La dérivée de xⁿ est n×xⁿ⁻¹, donc dérivée de x³ = 3x²",
    created_at: '2023-06-15T00:00:00Z',
  },
  {
    id: 'q9',
    quiz_id: '1',
    question_number: 9,
    question_text: "Quel est le centre du cercle d'équation (x-2)² + (y+1)² = 25 ?",
    option_a: '(2, 1)',
    option_b: '(-2, 1)',
    option_c: '(2, -1)',
    option_d: '(-2, -1)',
    correct_answer: 'C',
    explanation: "L'équation est de la forme (x-a)² + (y-b)² = r², donc centre (a, b) = (2, -1)",
    created_at: '2023-06-15T00:00:00Z',
  },
  {
    id: 'q10',
    quiz_id: '1',
    question_number: 10,
    question_text: "Simplifiez : (a³)² × a⁴",
    option_a: 'a⁹',
    option_b: 'a¹⁰',
    option_c: 'a¹⁴',
    option_d: 'a²⁴',
    correct_answer: 'B',
    explanation: "(a³)² = a⁶, donc a⁶ × a⁴ = a¹⁰",
    created_at: '2023-06-15T00:00:00Z',
  },
];

// Personal stats interface
export interface QuizStats {
  totalQuizzesCompleted: number;
  averageScore: number;
  bestSubject: string;
  weakestSubject: string;
  weeklyProgress: { day: string; score: number }[];
}

// Quiz history entry
export interface QuizHistoryEntry {
  id: string;
  quiz_id: string;
  score: number;
  correct_count: number;
  wrong_count: number;
  time_spent_seconds: number;
  created_at: string;
  quiz: {
    id: string;
    title: string;
    subject: string;
    option: string;
    difficulty: string;
  };
}

export interface QuizHistoryResponse {
  history: QuizHistoryEntry[];
  stats: {
    total_completed: number;
    average_score: number;
    best_subject: string | null;
    weakest_subject: string | null;
  };
}

// Result message helpers
export function getResultMessage(score: number): {
  emoji: string;
  message: string;
} {
  if (score >= 90) return { emoji: '🎉', message: 'Excellent travail' };
  if (score >= 70) return { emoji: '👏', message: 'Très bon résultat' };
  if (score >= 50) return { emoji: '💪', message: 'Continue à t\'entraîner' };
  return { emoji: '📚', message: 'Reprends les notions importantes' };
}
