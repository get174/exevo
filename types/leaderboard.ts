// Types for the Leaderboard module

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  score: number;
  province: string;
  school: string;
  option: string;
  level: number;
  rank?: number;
  created_at: string;
  updated_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned_at?: string;
}

export interface UserBadge extends Badge {
  earned_at: string;
}

export interface LeaderboardFilters {
  province: string | null;
  school: string | null;
  option: string | null;
  period: 'today' | 'week' | 'month' | 'all';
  search: string;
}

export interface MyPosition {
  rank: number;
  score: number;
  pointsToNextRank: number;
  nextPlayerName: string | null;
  provinceRank: number;
  optionRank: number;
  weeklyProgress: number;
  dailyProgress: number;
}

export interface LeaderboardStats {
  totalUsers: number;
  totalPoints: number;
  averageScore: number;
  topProvince: string;
  topOption: string;
}

// Sample data for demo
export const SAMPLE_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: '1',
    user_id: 'u1',
    full_name: 'Grâce Mbayo',
    avatar_url: null,
    score: 1250,
    province: 'Kinshasa',
    school: 'Institut Mpumwire',
    option: 'Scientifique',
    level: 15,
    rank: 1,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-03-20T00:00:00Z',
  },
  {
    id: '2',
    user_id: 'u2',
    full_name: 'Aimé Kabongo',
    avatar_url: null,
    score: 1180,
    province: 'Kongo Central',
    school: 'Complexe Scolaire Lumière',
    option: 'Scientifique',
    level: 12,
    rank: 2,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-03-19T00:00:00Z',
  },
  {
    id: '3',
    user_id: 'u3',
    full_name: 'Sophie Ndimbo',
    avatar_url: null,
    score: 1105,
    province: 'Haut-Katanga',
    school: 'École Primaire Sainte-Marie',
    option: 'Commerciale',
    level: 10,
    rank: 3,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-03-18T00:00:00Z',
  },
  {
    id: '4',
    user_id: 'u4',
    full_name: 'Jean-Pierre Mbuyi',
    avatar_url: null,
    score: 985,
    province: 'Kinshasa',
    school: 'College Christ-Roi',
    option: 'Littéraire',
    level: 8,
    rank: 4,
    created_at: '2024-02-10T00:00:00Z',
    updated_at: '2024-03-17T00:00:00Z',
  },
  {
    id: '5',
    user_id: 'u5',
    full_name: 'Marie Kambemba',
    avatar_url: null,
    score: 920,
    province: 'Kongo Central',
    school: 'Institut Mandeleine',
    option: 'Pédagogie',
    level: 7,
    rank: 5,
    created_at: '2024-02-15T00:00:00Z',
    updated_at: '2024-03-16T00:00:00Z',
  },
  {
    id: '6',
    user_id: 'u6',
    full_name: 'Patrick Nkosi',
    avatar_url: null,
    score: 870,
    province: 'Haut-Katanga',
    school: 'Complexe Scolaire Bel Berg',
    option: 'Technique',
    level: 6,
    rank: 6,
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-15T00:00:00Z',
  },
  {
    id: '7',
    user_id: 'u7',
    full_name: 'Claire Musu',
    avatar_url: null,
    score: 810,
    province: 'Kinshasa',
    school: 'Institut Bilingue de Kinshasa',
    option: 'Scientifique',
    level: 5,
    rank: 7,
    created_at: '2024-03-05T00:00:00Z',
    updated_at: '2024-03-14T00:00:00Z',
  },
  {
    id: '8',
    user_id: 'u8',
    full_name: 'David Lunda',
    avatar_url: null,
    score: 760,
    province: 'Kongo Central',
    school: 'École de Référence',
    option: 'Commerciale',
    level: 4,
    rank: 8,
    created_at: '2024-03-08T00:00:00Z',
    updated_at: '2024-03-13T00:00:00Z',
  },
  {
    id: '9',
    user_id: 'u9',
    full_name: 'Annie Manda',
    avatar_url: null,
    score: 710,
    province: 'Haut-Katanga',
    school: 'Institut Notre-Dame',
    option: 'Littéraire',
    level: 3,
    rank: 9,
    created_at: '2024-03-10T00:00:00Z',
    updated_at: '2024-03-12T00:00:00Z',
  },
  {
    id: '10',
    user_id: 'u10',
    full_name: 'Robert Kalamba',
    avatar_url: null,
    score: 680,
    province: 'Kinshasa',
    school: 'College Saint-Joseph',
    option: 'Pédagogie',
    level: 2,
    rank: 10,
    created_at: '2024-03-12T00:00:00Z',
    updated_at: '2024-03-11T00:00:00Z',
  },
];

export const SAMPLE_BADGES: Badge[] = [
  {
    id: 'b1',
    name: 'Champion Quiz',
    description: 'Termine premier sur un quiz',
    icon: 'trophy',
  },
  {
    id: 'b2',
    name: 'Série 7 jours',
    description: '7 jours de suite sur Exevo',
    icon: 'flame',
  },
  {
    id: 'b3',
    name: 'Expert Mathématiques',
    description: 'Score parfait en mathématiques',
    icon: 'book-open',
  },
  {
    id: 'b4',
    name: 'Top 10 National',
    description: 'Rejoins le top 10 national',
    icon: 'star',
  },
  {
    id: 'b5',
    name: 'Score parfait',
    description: 'Obtiens 100% sur un quiz',
    icon: 'target',
  },
];

export const EARNED_BADGES: UserBadge[] = [
  {
    id: 'b1',
    name: 'Champion Quiz',
    description: 'Termine premier sur un quiz',
    icon: 'trophy',
    earned_at: '2024-03-15T00:00:00Z',
  },
  {
    id: 'b2',
    name: 'Série 7 jours',
    description: '7 jours de suite sur Exevo',
    icon: 'flame',
    earned_at: '2024-03-10T00:00:00Z',
  },
  {
    id: 'b5',
    name: 'Score parfait',
    description: 'Obtiens 100% sur un quiz',
    icon: 'target',
    earned_at: '2024-03-05T00:00:00Z',
  },
];

export const SAMPLE_MY_POSITION: MyPosition = {
  rank: 25,
  score: 680,
  pointsToNextRank: 20,
  nextPlayerName: '#24',
  provinceRank: 8,
  optionRank: 12,
  weeklyProgress: 5,
  dailyProgress: 2,
};

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

export const PERIODS = [
  { value: 'today', label: 'Aujourd\'hui' },
  { value: 'week', label: 'Cette semaine' },
  { value: 'month', label: 'Ce mois' },
  { value: 'all', label: 'Tout le temps' },
] as const;

export const DEFAULT_FILTERS: LeaderboardFilters = {
  province: null,
  school: null,
  option: null,
  period: 'all',
  search: '',
};
