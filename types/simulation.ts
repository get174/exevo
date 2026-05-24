// =====================================================
// TypeScript Types for Exetat Simulation Module
// =====================================================

// =====================================================
// Candidate Information
// =====================================================
export interface CandidateInfo {
  id?: string;
  userId?: string;
  name: string;
  firstname: string;
  code: string;
  sex: 'M' | 'F';
  option: string;
  province: string;
  school: string;
}

// =====================================================
// Exam Options (A-E)
// =====================================================
export type AnswerOption = 'A' | 'B' | 'C' | 'D' | 'E';

export interface QuestionOptions {
  A: string;
  B: string;
  C: string;
  D: string;
  E: string;
}

// =====================================================
// Simulation Question
// =====================================================
export interface SimulationQuestion {
  id: string;
  simulationId: string;
  questionNumber: number;
  questionText: string;
  options: QuestionOptions;
  correctAnswer: AnswerOption;
  explanation?: string;
}

// =====================================================
// Candidate's Answer
// =====================================================
export interface SimulationAnswer {
  id: string;
  simulationId: string;
  questionId: string;
  selectedAnswer: AnswerOption | null;
  answeredAt: Date | null;
}

// =====================================================
// Simulation Status
// =====================================================
export type SimulationStatus = 'pending' | 'in_progress' | 'completed';

// =====================================================
// Simulation Session
// =====================================================
export interface SimulationSession {
  id: string;
  userId: string;
  candidateInfo: CandidateInfo;
  status: SimulationStatus;
  startedAt: Date | null;
  endedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  questions: SimulationQuestion[];
  answers: Map<string, AnswerOption>;
}

// =====================================================
// Simulation Result
// =====================================================
export interface SimulationResult {
  id: string;
  simulationId: string;
  score: number;
  correctCount: number;
  wrongCount: number;
  blankCount: number;
  timeUsedSeconds: number;
  createdAt: Date;
}

// =====================================================
// Exam State (for UI management)
// =====================================================
export interface ExamState {
  currentQuestion: number;
  answers: Record<number, AnswerOption>;
  timeRemaining: number; // in seconds
  status: SimulationStatus;
  isTimerRunning: boolean;
  hasSubmittedInstructions: boolean;
}

// =====================================================
// Timer State
// =====================================================
export type TimerStatus = 'normal' | 'warning' | 'critical';

export interface TimerState {
  totalSeconds: number;
  remainingSeconds: number;
  status: TimerStatus;
  isRunning: boolean;
}

// =====================================================
// Question Navigation State
// =====================================================
export type QuestionState = 'current' | 'answered' | 'unanswered';

export interface QuestionNavigationState {
  questionNumber: number;
  state: QuestionState;
}

// =====================================================
// Step/Pages for Simulation Flow
// =====================================================
export type SimulationStep = 'identification' | 'instructions' | 'exam' | 'results';

// =====================================================
// Form Types for Candidate Registration
// =====================================================
export interface CandidateFormData {
  name: string;
  firstname: string;
  code: string;
  sex: 'M' | 'F';
  option: string;
  province: string;
  school: string;
}

// =====================================================
// Provinces in DRC
// =====================================================
export const DRC_PROVINCES = [
  'Kinshasa',
  'Kongo Central',
  'Haut-Katanga',
  'Haut-Lomani',
  'Ituri',
  'Kasaï',
  'Kasaï-Oriental',
  'Kasaï-Central',
  'Kwilu',
  'Lualaba',
  'Lukenie',
  'Maniema',
  'Mongala',
  'Nord-Kivu',
  'Nord-Ubangi',
  ' Sankuru',
  'Sud-Kivu',
  'Sud-Ubangi',
  'Tanganyika',
  ' Tshopo',
  'Tshuapa',
] as const;

// =====================================================
// Options for Exetat
// =====================================================
export const EXETAT_OPTIONS = [
  'Scientifique',
  ' Littéraire',
  'Commerciale',
  'Pédagogique',
  'Technologique',
  'Arts',
] as const;

// =====================================================
// Predefined Questions (for demo/offline mode)
// =====================================================
export const SAMPLE_QUESTIONS: Omit<SimulationQuestion, 'id' | 'simulationId'>[] = [
  {
    questionNumber: 1,
    questionText: 'Quelle est la racine carrée de 144 ?',
    options: {
      A: '10',
      B: '11',
      C: '12',
      D: '13',
      E: '14',
    },
    correctAnswer: 'C',
    explanation: '√144 = 12 car 12 × 12 = 144',
  },
  {
    questionNumber: 2,
    questionText: 'Quel est le symbole chimique de l\'or ?',
    options: {
      A: 'Ag',
      B: 'Au',
      C: 'Fe',
      D: 'Cu',
      E: 'Zn',
    },
    correctAnswer: 'B',
    explanation: 'L\'or est un élément chimique avec le symbole Au (du latin "aurum").',
  },
  {
    questionNumber: 3,
    questionText: 'Quelle est la capitale de la République Démocratique du Congo ?',
    options: {
      A: 'Lubumbashi',
      B: 'Kisangani',
      C: 'Kinshasa',
      D: 'Mbuji-Mayi',
      E: 'Kananga',
    },
    correctAnswer: 'C',
    explanation: 'Kinshasa est la capitale et la plus grande ville de la RDC.',
  },
  {
    questionNumber: 4,
    questionText: 'Résolvez : 2x + 5 = 15. Quelle est la valeur de x ?',
    options: {
      A: '3',
      B: '4',
      C: '5',
      D: '6',
      E: '7',
    },
    correctAnswer: 'C',
    explanation: '2x + 5 = 15 → 2x = 10 → x = 5',
  },
  {
    questionNumber: 5,
    questionText: 'Combien de provinces compte la RDC ?',
    options: {
      A: '20',
      B: '22',
      C: '26',
      D: '28',
      E: '30',
    },
    correctAnswer: 'C',
    explanation: 'La RDC compte 26 provinces depuis 2015.',
  },
  {
    questionNumber: 6,
    questionText: 'Quel est le plus grand lac d\'Afrique ?',
    options: {
      A: 'Lac Tanganyika',
      B: 'Lac Malawi',
      C: 'Lac Victoria',
      D: 'Lac Tchad',
      E: 'Lac Kivu',
    },
    correctAnswer: 'C',
    explanation: 'Le lac Victoria est le plus grand lac d\'Afrique et le deuxième lac d\'eau douce au monde.',
  },
  {
    questionNumber: 7,
    questionText: 'Quelle est la formule de l\'eau ?',
    options: {
      A: 'CO2',
      B: 'H2O',
      C: 'NaCl',
      D: 'O2',
      E: 'H2SO4',
    },
    correctAnswer: 'B',
    explanation: 'L\'eau est composée de deux atomes d\'hydrogène et un atome d\'oxygène.',
  },
  {
    questionNumber: 8,
    questionText: 'Qui a découvert la théorie de la relativité ?',
    options: {
      A: 'Isaac Newton',
      B: 'Albert Einstein',
      C: 'Stephen Hawking',
      D: 'Galilée',
      E: 'Nicolas Copernic',
    },
    correctAnswer: 'B',
    explanation: 'Albert Einstein a publié sa théorie de la relativité restreinte en 1905.',
  },
  {
    questionNumber: 9,
    questionText: 'Quel est le fleuve le plus long d\'Afrique ?',
    options: {
      A: 'Congo',
      B: 'Nil',
      C: 'Niger',
      D: 'Zambèze',
      E: 'Limpopo',
    },
    correctAnswer: 'B',
    explanation: 'Le Nil est le fleuve le plus long du monde avec environ 6 650 km.',
  },
  {
    questionNumber: 10,
    questionText: 'Quelle langue est officielle en RDC ?',
    options: {
      A: 'Français',
      B: 'Anglais',
      C: 'Portugais',
      D: 'Espagnol',
      E: 'Swahili',
    },
    correctAnswer: 'A',
    explanation: 'Le français est la langue officielle de la RDC.',
  },
  {
    questionNumber: 11,
    questionText: 'Calculez : 15 × 15 = ?',
    options: {
      A: '215',
      B: '225',
      C: '235',
      D: '245',
      E: '255',
    },
    correctAnswer: 'B',
    explanation: '15 × 15 = (10 + 5) × 15 = 150 + 75 = 225',
  },
  {
    questionNumber: 12,
    questionText: 'Quel est le plus haut montagne d\'Afrique ?',
    options: {
      A: 'Mont Kenya',
      B: 'Mont Kilimandjaro',
      C: 'Mont Stanley',
      D: 'Mont Elgon',
      E: 'Mont Cameroon',
    },
    correctAnswer: 'B',
    explanation: 'Le mont Kilimandjaro en Tanzanie mesure 5 895 mètres.',
  },
  {
    questionNumber: 13,
    questionText: 'Quelle est la vitesse de la lumière ?',
    options: {
      A: '300 000 km/s',
      B: '150 000 km/s',
      C: '450 000 km/s',
      D: '500 000 km/s',
      E: '200 000 km/s',
    },
    correctAnswer: 'A',
    explanation: 'La vitesse de la lumière dans le vide est d\'environ 299 792 km/s (environ 300 000 km/s).',
  },
  {
    questionNumber: 14,
    questionText: 'Combien de chromosomes possède l\'être humain ?',
    options: {
      A: '23',
      B: '44',
      C: '46',
      D: '48',
      E: '45',
    },
    correctAnswer: 'C',
    explanation: 'L\'être humain possède 46 chromosomes (23 paires).',
  },
  {
    questionNumber: 15,
    questionText: 'Quel est le PIB de la RDC (en milliards USD) ?',
    options: {
      A: 'environ 50 milliards',
      B: 'environ 70 milliards',
      C: 'environ 90 milliards',
      D: 'environ 120 milliards',
      E: 'environ 150 milliards',
    },
    correctAnswer: 'B',
    explanation: 'Le PIB de la RDC est d\'environ 70 milliards USD (données récentes).',
  },
  {
    questionNumber: 16,
    questionText: 'Résolvez : 3(x - 2) = 21. Quelle est la valeur de x ?',
    options: {
      A: '5',
      B: '7',
      C: '9',
      D: '11',
      E: '13',
    },
    correctAnswer: 'C',
    explanation: '3(x - 2) = 21 → x - 2 = 7 → x = 9',
  },
  {
    questionNumber: 17,
    questionText: 'Quand la RDC a-t-elle obtenu son indépendance ?',
    options: {
      A: '1960',
      B: '1958',
      C: '1962',
      D: '1959',
      E: '1961',
    },
    correctAnswer: 'A',
    explanation: 'La RDC a obtenu son independence le 30 juin 1960.',
  },
  {
    questionNumber: 18,
    questionText: 'Quelle est la capitale du Kasaï-Oriental ?',
    options: {
      A: 'Kananga',
      B: 'Mbuji-Mayi',
      C: 'Tshikapa',
      D: 'Luputa',
      E: 'Kabinda',
    },
    correctAnswer: 'B',
    explanation: 'Mbuji-Mayi est la capitale de la province du Kasaï-Oriental.',
  },
  {
    questionNumber: 19,
    questionText: 'Combien de znds equals 100 × 100 ?',
    options: {
      A: '10 000',
      B: '1 000',
      C: '100 000',
      D: '1 000 000',
      E: '100',
    },
    correctAnswer: 'A',
    explanation: '100 × 100 = 10 000',
  },
  {
    questionNumber: 20,
    questionText: 'Quel est le plus grand désert d\'Afrique ?',
    options: {
      A: 'Désert du Namib',
      B: 'Désert du Sahara',
      C: 'Désert du Kalahari',
      D: 'Désert du Libyen',
      E: 'Désert du Nubien',
    },
    correctAnswer: 'B',
    explanation: 'Le Sahara est le plus grand désert chaud du monde.',
  },
];

// =====================================================
// Exam Configuration
// =====================================================
export interface ExamConfig {
  totalQuestions: number;
  totalTimeMinutes: number;
  passingScore: number;
}

export const DEFAULT_EXAM_CONFIG: ExamConfig = {
  totalQuestions: 20,
  totalTimeMinutes: 150, // 2h30
  passingScore: 50, // 50%
};
