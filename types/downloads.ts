// Types for the Downloads module

export interface Exam {
  id: string;
  title: string;
  subject: string;
  year: number;
  option: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  description: string;
  pdf_url: string;
  thumbnail_url: string | null;
  downloads_count: number;
  file_size?: number;
}

export interface DownloadedExam {
  id: string;
  user_id: string;
  exam_id: string;
  downloaded_at: string;
  exam?: Exam;
}

// Alias for backwards compatibility
export type Download = DownloadedExam;

export interface Favorite {
  id: string;
  user_id: string;
  exam_id: string;
  created_at: string;
  exam?: Exam;
}

export type ActivityType = 'download' | 'open' | 'quiz_start' | 'favorite_add' | 'favorite_remove';
export type ActivityAction = 'downloaded' | 'opened' | 'started_quiz' | 'added_favorite' | 'removed_favorite';

export interface ActivityLog {
  id: string;
  user_id: string;
  action: ActivityType;
  reference_id: string;
  title: string;
  created_at: string;
}

export interface DownloadsFilters {
  search: string;
  subject: string | null;
  option: string | null;
  year: number | null;
  sortOrder: 'recent' | 'oldest';
}

export interface DownloadStats {
  totalDownloads: number;
  totalFavorites: number;
  recentActivity: number;
  totalSize: number;
}

// Sample data for demo
export const SAMPLE_EXAMS: Exam[] = [
  {
    id: 'e1',
    title: 'Examen Exetat Mathématiques 2023',
    subject: 'Mathématiques',
    year: 2023,
    option: 'Scientifique',
    difficulty: 'Difficile',
    description: 'Session ordinaire 2023 - Option Scientifique',
    pdf_url: 'https://example.com/exams/exetat-math-2023.pdf',
    thumbnail_url: null,
    downloads_count: 1250,
    file_size: 2500000,
  },
  {
    id: 'e2',
    title: 'Examen Exetat Physique 2023',
    subject: 'Physique',
    year: 2023,
    option: 'Scientifique',
    difficulty: 'Moyen',
    description: 'Session ordinaire 2023 - Option Scientifique',
    pdf_url: 'https://example.com/exams/exetat-phys-2023.pdf',
    thumbnail_url: null,
    downloads_count: 890,
    file_size: 1800000,
  },
  {
    id: 'e3',
    title: 'Examen Exetat Chimie 2022',
    subject: 'Chimie',
    year: 2022,
    option: 'Scientifique',
    difficulty: 'Difficile',
    description: 'Session ordinaire 2022 - Option Scientifique',
    pdf_url: 'https://example.com/exams/exetat-chim-2022.pdf',
    thumbnail_url: null,
    downloads_count: 756,
    file_size: 2100000,
  },
  {
    id: 'e4',
    title: 'Examen Exetat Français 2023',
    subject: 'Français',
    year: 2023,
    option: 'Littéraire',
    difficulty: 'Facile',
    description: 'Session ordinaire 2023 - Option Littéraire',
    pdf_url: 'https://example.com/exams/exetat-fr-2023.pdf',
    thumbnail_url: null,
    downloads_count: 1100,
    file_size: 1500000,
  },
  {
    id: 'e5',
    title: 'Examen Exetat Biologie 2022',
    subject: 'Biologie',
    year: 2022,
    option: 'Scientifique',
    difficulty: 'Moyen',
    description: 'Session ordinaire 2022 - Option Scientifique',
    pdf_url: 'https://example.com/exams/exetat-bio-2022.pdf',
    thumbnail_url: null,
    downloads_count: 650,
    file_size: 1900000,
  },
  {
    id: 'e6',
    title: 'Examen Exetat Géographie 2023',
    subject: 'Géographie',
    year: 2023,
    option: 'Littéraire',
    difficulty: 'Facile',
    description: 'Session ordinaire 2023 - Option Littéraire',
    pdf_url: 'https://example.com/exams/exetat-geo-2023.pdf',
    thumbnail_url: null,
    downloads_count: 420,
    file_size: 1200000,
  },
];

export const SAMPLE_DOWNLOADS: DownloadedExam[] = [
  {
    id: 'd1',
    user_id: 'u1',
    exam_id: 'e1',
    downloaded_at: '2024-03-20T14:30:00Z',
    exam: SAMPLE_EXAMS[0],
  },
  {
    id: 'd2',
    user_id: 'u1',
    exam_id: 'e2',
    downloaded_at: '2024-03-19T10:15:00Z',
    exam: SAMPLE_EXAMS[1],
  },
  {
    id: 'd3',
    user_id: 'u1',
    exam_id: 'e3',
    downloaded_at: '2024-03-18T16:45:00Z',
    exam: SAMPLE_EXAMS[2],
  },
  {
    id: 'd4',
    user_id: 'u1',
    exam_id: 'e4',
    downloaded_at: '2024-03-15T09:00:00Z',
    exam: SAMPLE_EXAMS[3],
  },
];

export const SAMPLE_FAVORITES: Favorite[] = [
  {
    id: 'f1',
    user_id: 'u1',
    exam_id: 'e1',
    created_at: '2024-03-20T14:30:00Z',
    exam: SAMPLE_EXAMS[0],
  },
  {
    id: 'f2',
    user_id: 'u1',
    exam_id: 'e2',
    created_at: '2024-03-19T10:15:00Z',
    exam: SAMPLE_EXAMS[1],
  },
  {
    id: 'f3',
    user_id: 'u1',
    exam_id: 'e5',
    created_at: '2024-03-10T11:00:00Z',
    exam: SAMPLE_EXAMS[4],
  },
];

export const SAMPLE_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'a1',
    user_id: 'u1',
    action: 'download',
    reference_id: 'e1',
    title: 'Examen Exetat Mathématiques 2023',
    created_at: '2024-03-20T14:30:00Z',
  },
  {
    id: 'a2',
    user_id: 'u1',
    action: 'open',
    reference_id: 'e2',
    title: 'Examen Exetat Physique 2023',
    created_at: '2024-03-19T15:00:00Z',
  },
  {
    id: 'a3',
    user_id: 'u1',
    action: 'download',
    reference_id: 'e2',
    title: 'Examen Exetat Physique 2023',
    created_at: '2024-03-19T10:15:00Z',
  },
  {
    id: 'a4',
    user_id: 'u1',
    action: 'quiz_start',
    reference_id: 'q1',
    title: 'Quiz Mathématiques Exetat 2023',
    created_at: '2024-03-18T09:00:00Z',
  },
  {
    id: 'a5',
    user_id: 'u1',
    action: 'favorite_add',
    reference_id: 'e1',
    title: 'Examen Exetat Mathématiques 2023',
    created_at: '2024-03-20T14:25:00Z',
  },
  {
    id: 'a6',
    user_id: 'u1',
    action: 'open',
    reference_id: 'e3',
    title: 'Examen Exetat Chimie 2022',
    created_at: '2024-03-17T14:00:00Z',
  },
];

export const SUBJECTS = [
  'Mathématiques',
  'Physique',
  'Chimie',
  'Biologie',
  'Français',
  'Géographie',
  'Histoire',
  'Anglais',
  'Économie',
  'Informatique',
] as const;

export const OPTIONS = [
  'Scientifique',
  'Commerciale',
  'Littéraire',
  'Pédagogie',
  'Technique',
] as const;

export const YEARS = [2020, 2021, 2022, 2023, 2024, 2025] as const;

export const DEFAULT_FILTERS: DownloadsFilters = {
  search: '',
  subject: null,
  option: null,
  year: null,
  sortOrder: 'recent',
};

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getActivityIcon(action: ActivityType): string {
  switch (action) {
    case 'download':
      return 'download';
    case 'open':
      return 'eye';
    case 'quiz_start':
      return 'play';
    case 'favorite_add':
      return 'heart';
    case 'favorite_remove':
      return 'heart-off';
    default:
      return 'file';
  }
}

export function getActivityLabel(action: ActivityType): string {
  switch (action) {
    case 'download':
      return 'Téléchargé';
    case 'open':
      return 'Ouvert';
    case 'quiz_start':
      return 'Quiz lancé';
    case 'favorite_add':
      return 'Ajouté aux favoris';
    case 'favorite_remove':
      return 'Retiré des favoris';
    default:
      return 'Activité';
  }
}
