// Types for the Anciens Examens module

export type ExamDifficulty = 'Facile' | 'Moyen' | 'Difficile';

export type ExamSubject = 
  | 'Mathématiques'
  | 'Physique'
  | 'Chimie'
  | 'Français'
  | 'Biologie'
  | 'Géographie';

export type ExamOption = 
  | 'Scientifique'
  | 'Commerciale'
  | 'Littéraire'
  | 'Pédagogie'
  | 'Nutrition'
  | 'Technique';

export interface Exam {
  id: string;
  title: string;
  subject: string;
  year: number;
  option: string;
  difficulty: ExamDifficulty;
  description: string | null;
  pdf_url: string;
  thumbnail_url: string | null;
  downloads_count: number;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExamFilters {
  search: string;
  year: number | null;
  subject: string | null;
  option: string | null;
  difficulty: string | null;
}

export interface ExamListResponse {
  exams: Exam[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter options constants
export const YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025] as const;

export const SUBJECTS = [
  'Mathématiques',
  'Physique', 
  'Chimie',
  'Français',
  'Biologie',
  'Géographie',
] as const;

export const EXAM_OPTIONS = [
  'Scientifique',
  'Commerciale',
  'Littéraire',
  'Pédagogie',
  'Nutrition',
  'Technique',
] as const;

export const DIFFICULTIES = ['Facile', 'Moyen', 'Difficile'] as const;

// Default filter values
export const DEFAULT_EXAM_FILTERS: ExamFilters = {
  search: '',
  year: null,
  subject: null,
  option: null,
  difficulty: null,
};

// Pagination defaults
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 12,
};

// Sample exams for demo (when Supabase is not configured)
export const SAMPLE_EXAMS: Exam[] = [
  {
    id: '1',
    title: 'Examen Exetat Mathématiques 2023',
    subject: 'Mathématiques',
    year: 2023,
    option: 'Scientifique',
    difficulty: 'Difficile',
    description: 'Session ordinaire 2023 - Option Scientifique',
    pdf_url: '/docs/exetat-math-2023.pdf',
    thumbnail_url: null,
    downloads_count: 1250,
    is_favorite: false,
    created_at: '2023-06-15T00:00:00Z',
    updated_at: '2023-06-15T00:00:00Z',
  },
  {
    id: '2',
    title: 'Examen Exetat Physique 2023',
    subject: 'Physique',
    year: 2023,
    option: 'Scientifique',
    difficulty: 'Moyen',
    description: 'Session ordinaire 2023 - Option Scientifique',
    pdf_url: '/docs/exetat-phys-2023.pdf',
    thumbnail_url: null,
    downloads_count: 890,
    is_favorite: true,
    created_at: '2023-06-15T00:00:00Z',
    updated_at: '2023-06-15T00:00:00Z',
  },
  {
    id: '3',
    title: 'Examen Exetat Chimie 2022',
    subject: 'Chimie',
    year: 2022,
    option: 'Scientifique',
    difficulty: 'Difficile',
    description: 'Session ordinaire 2022 - Option Scientifique',
    pdf_url: '/docs/exetat-chim-2022.pdf',
    thumbnail_url: null,
    downloads_count: 756,
    is_favorite: false,
    created_at: '2022-06-15T00:00:00Z',
    updated_at: '2022-06-15T00:00:00Z',
  },
  {
    id: '4',
    title: 'Examen Exetat Français 2023',
    subject: 'Français',
    year: 2023,
    option: 'Littéraire',
    difficulty: 'Facile',
    description: 'Session ordinaire 2023 - Option Littéraire',
    pdf_url: '/docs/exetat-fr-2023.pdf',
    thumbnail_url: null,
    downloads_count: 1100,
    is_favorite: false,
    created_at: '2023-06-15T00:00:00Z',
    updated_at: '2023-06-15T00:00:00Z',
  },
  {
    id: '5',
    title: 'Examen Exetat Biologie 2022',
    subject: 'Biologie',
    year: 2022,
    option: 'Scientifique',
    difficulty: 'Moyen',
    description: 'Session ordinaire 2022 - Option Scientifique',
    pdf_url: '/docs/exetat-bio-2022.pdf',
    thumbnail_url: null,
    downloads_count: 650,
    is_favorite: false,
    created_at: '2022-06-15T00:00:00Z',
    updated_at: '2022-06-15T00:00:00Z',
  },
  {
    id: '6',
    title: 'Examen Exetat Géographie 2023',
    subject: 'Géographie',
    year: 2023,
    option: 'Littéraire',
    difficulty: 'Facile',
    description: 'Session ordinaire 2023 - Option Littéraire',
    pdf_url: '/docs/exetat-geo-2023.pdf',
    thumbnail_url: null,
    downloads_count: 420,
    is_favorite: false,
    created_at: '2023-06-15T00:00:00Z',
    updated_at: '2023-06-15T00:00:00Z',
  },
  {
    id: '7',
    title: 'Examen Exetat Mathématiques 2022',
    subject: 'Mathématiques',
    year: 2022,
    option: 'Scientifique',
    difficulty: 'Difficile',
    description: 'Session ordinaire 2022 - Option Scientifique',
    pdf_url: '/docs/exetat-math-2022.pdf',
    thumbnail_url: null,
    downloads_count: 980,
    is_favorite: true,
    created_at: '2022-06-15T00:00:00Z',
    updated_at: '2022-06-15T00:00:00Z',
  },
  {
    id: '8',
    title: 'Examen Exetat Physique 2021',
    subject: 'Physique',
    year: 2021,
    option: 'Scientifique',
    difficulty: 'Moyen',
    description: 'Session ordinaire 2021 - Option Scientifique',
    pdf_url: '/docs/exetat-phys-2021.pdf',
    thumbnail_url: null,
    downloads_count: 720,
    is_favorite: false,
    created_at: '2021-06-15T00:00:00Z',
    updated_at: '2021-06-15T00:00:00Z',
  },
  {
    id: '9',
    title: 'Examen Exetat Commerciale 2023',
    subject: 'Français',
    year: 2023,
    option: 'Commerciale',
    difficulty: 'Facile',
    description: 'Session ordinaire 2023 - Option Commerciale',
    pdf_url: '/docs/exetat-com-2023.pdf',
    thumbnail_url: null,
    downloads_count: 540,
    is_favorite: false,
    created_at: '2023-06-15T00:00:00Z',
    updated_at: '2023-06-15T00:00:00Z',
  },
  {
    id: '10',
    title: 'Examen Exetat Pédagogie 2022',
    subject: 'Français',
    year: 2022,
    option: 'Pédagogie',
    difficulty: 'Moyen',
    description: 'Session ordinaire 2022 - Option Pédagogie',
    pdf_url: '/docs/exetat-ped-2022.pdf',
    thumbnail_url: null,
    downloads_count: 310,
    is_favorite: false,
    created_at: '2022-06-15T00:00:00Z',
    updated_at: '2022-06-15T00:00:00Z',
  },
];
