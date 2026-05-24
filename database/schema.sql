-- Simulation Exetat Database Schema
-- Creates tables for the realistic Exetat simulation module

-- =====================================================
-- TABLE: simulations
-- Stores candidate identification and session info
-- =====================================================
CREATE TABLE IF NOT EXISTS simulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    candidate_name TEXT NOT NULL,
    candidate_firstname TEXT NOT NULL,
    candidate_code TEXT NOT NULL UNIQUE,
    sex TEXT CHECK (sex IN ('M', 'F')),
    option TEXT NOT NULL,
    province TEXT NOT NULL,
    school TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- TABLE: simulation_questions
-- Stores exam questions with options
-- =====================================================
CREATE TABLE IF NOT EXISTS simulation_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    simulation_id UUID REFERENCES simulations(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- { "A": "option1", "B": "option2", "C": "option3", "D": "option4", "E": "option5" }
    correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D', 'E')),
    explanation TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- TABLE: simulation_answers
-- Stores candidate's answers during exam
-- =====================================================
CREATE TABLE IF NOT EXISTS simulation_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    simulation_id UUID REFERENCES simulations(id) ON DELETE CASCADE,
    question_id UUID REFERENCES simulation_questions(id) ON DELETE CASCADE,
    selected_answer TEXT CHECK (selected_answer IN ('A', 'B', 'C', 'D', 'E')),
    answered_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- TABLE: simulation_results
-- Stores exam results after completion
-- =====================================================
CREATE TABLE IF NOT EXISTS simulation_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    simulation_id UUID REFERENCES simulations(id) ON DELETE CASCADE UNIQUE,
    score NUMERIC(5,2) NOT NULL,
    correct_count INTEGER NOT NULL,
    wrong_count INTEGER NOT NULL,
    blank_count INTEGER NOT NULL,
    time_used_seconds INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_simulation_questions_number 
ON simulation_questions(simulation_id, question_number);

CREATE INDEX IF NOT EXISTS idx_simulation_answers_question 
ON simulation_answers(simulation_id, question_id);

CREATE INDEX IF NOT EXISTS idx_simulation_results_simulation 
ON simulation_results(simulation_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_results ENABLE ROW LEVEL SECURITY;

-- Users can only see their own simulations
CREATE POLICY "Users can view own simulations" 
ON simulations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own simulations" 
ON simulations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own simulations" 
ON simulations FOR UPDATE 
USING (auth.uid() = user_id);

-- Questions are viewable by simulation owner
CREATE POLICY "Owner can view questions" 
ON simulation_questions FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM simulations 
        WHERE simulations.id = simulation_questions.simulation_id 
        AND simulations.user_id = auth.uid()
    )
);

-- Answers are viewable/manageable by simulation owner
CREATE POLICY "Owner can manage answers" 
ON simulation_answers FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM simulations 
        WHERE simulations.id = simulation_answers.simulation_id 
        AND simulations.user_id = auth.uid()
    )
);

-- Results viewable by simulation owner
CREATE POLICY "Owner can view results" 
ON simulation_results FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM simulations 
        WHERE simulations.id = simulation_results.simulation_id 
        AND simulations.user_id = auth.uid()
    )
);

-- =====================================================
-- TABLE: exams
-- Stores ancient Exetat exams for revision
-- =====================================================
CREATE TABLE IF NOT EXISTS exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    year INTEGER NOT NULL,
    option TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('Facile', 'Moyen', 'Difficile')) NOT NULL,
    description TEXT,
    pdf_url TEXT NOT NULL,
    thumbnail_url TEXT,
    downloads_count INTEGER DEFAULT 0,
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- TABLE: exam_favorites
-- Stores user favorites for exams
-- =====================================================
CREATE TABLE IF NOT EXISTS exam_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, exam_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_exams_subject ON exams(subject);
CREATE INDEX IF NOT EXISTS idx_exams_year ON exams(year);
CREATE INDEX IF NOT EXISTS idx_exams_option ON exams(option);
CREATE INDEX IF NOT EXISTS idx_exam_favorites_user ON exam_favorites(user_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_favorites ENABLE ROW LEVEL SECURITY;

-- Exams are publicly readable
CREATE POLICY "Exams are publicly readable" 
ON exams FOR SELECT 
USING (true);

-- Admins can manage exams
CREATE POLICY "Admins can manage exams" 
ON exams FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
);

-- Users can manage their favorites
CREATE POLICY "Users can manage own favorites" 
ON exam_favorites FOR ALL 
USING (auth.uid() = user_id);

-- =====================================================
-- SEED DATA: Sample Exams
-- =====================================================
INSERT INTO exams (title, subject, year, option, difficulty, description, pdf_url, downloads_count) VALUES
('Examen Exetat Mathématiques 2023', 'Mathématiques', 2023, 'Scientifique', 'Difficile', 'Session ordinaire 2023 - Option Scientifique', 'https://example.com/exams/exetat-math-2023.pdf', 1250),
('Examen Exetat Physique 2023', 'Physique', 2023, 'Scientifique', 'Moyen', 'Session ordinaire 2023 - Option Scientifique', 'https://example.com/exams/exetat-phys-2023.pdf', 890),
('Examen Exetat Chimie 2022', 'Chimie', 2022, 'Scientifique', 'Difficile', 'Session ordinaire 2022 - Option Scientifique', 'https://example.com/exams/exetat-chim-2022.pdf', 756),
('Examen Exetat Français 2023', 'Français', 2023, 'Littéraire', 'Facile', 'Session ordinaire 2023 - Option Littéraire', 'https://example.com/exams/exetat-fr-2023.pdf', 1100),
('Examen Exetat Biologie 2022', 'Biologie', 2022, 'Scientifique', 'Moyen', 'Session ordinaire 2022 - Option Scientifique', 'https://example.com/exams/exetat-bio-2022.pdf', 650),
('Examen Exetat Géographie 2023', 'Géographie', 2023, 'Littéraire', 'Facile', 'Session ordinaire 2023 - Option Littéraire', 'https://example.com/exams/exetat-geo-2023.pdf', 420),
('Examen Exetat Mathématiques 2022', 'Mathématiques', 2022, 'Scientifique', 'Difficile', 'Session ordinaire 2022 - Option Scientifique', 'https://example.com/exams/exetat-math-2022.pdf', 980),
('Examen Exetat Physique 2021', 'Physique', 2021, 'Scientifique', 'Moyen', 'Session ordinaire 2021 - Option Scientifique', 'https://example.com/exams/exetat-phys-2021.pdf', 720),
('Examen Exetat Commerciale 2023', 'Français', 2023, 'Commerciale', 'Facile', 'Sessionordinaire 2023 - Option Commerciale', 'https://example.com/exams/exetat-com-2023.pdf', 540),
('Examen Exetat Pédagogie 2022', 'Français', 2022, 'Pédagogie', 'Moyen', 'Session ordinaire 2022 - Option Pédagogie', 'https://example.com/exams/exetat-ped-2022.pdf', 310);

-- =====================================================
-- TABLE: quizzes
-- Stores interactive quizzes for revision
-- =====================================================
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    option TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('Facile', 'Moyen', 'Difficile')) NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 10,
    questions_count INTEGER NOT NULL DEFAULT 10,
    average_score NUMERIC(5,2) DEFAULT 0,
    times_completed INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- TABLE: quiz_questions
-- Stores quiz questions with options and explanations
-- =====================================================
CREATE TABLE IF NOT EXISTS quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
    explanation TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- TABLE: quiz_results
-- Stores user quiz results
-- =====================================================
CREATE TABLE IF NOT EXISTS quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    score NUMERIC(5,2) NOT NULL,
    correct_count INTEGER NOT NULL,
    wrong_count INTEGER NOT NULL,
    time_spent_seconds INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- TABLE: user_quiz_progress
-- Stores in-progress quiz state for resumption
-- =====================================================
CREATE TABLE IF NOT EXISTS user_quiz_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    current_question INTEGER DEFAULT 0,
    answers JSONB DEFAULT '{}'::jsonb,
    started_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, quiz_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_quizzes_subject ON quizzes(subject);
CREATE INDEX IF NOT EXISTS idx_quizzes_option ON quizzes(option);
CREATE INDEX IF NOT EXISTS idx_quizzes_difficulty ON quizzes(difficulty);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_quiz ON quiz_results(quiz_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_progress_user ON user_quiz_progress(user_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_progress ENABLE ROW LEVEL SECURITY;

-- Quizzes are publicly readable
CREATE POLICY "Quizzes are publicly readable" 
ON quizzes FOR SELECT 
USING (true);

-- Questions are publicly readable
CREATE POLICY "Questions are publicly readable" 
ON quiz_questions FOR SELECT 
USING (true);

-- Users can manage their results
CREATE POLICY "Users can manage own results" 
ON quiz_results FOR ALL 
USING (auth.uid() = user_id);

-- Users can manage their progress
CREATE POLICY "Users can manage own progress" 
ON user_quiz_progress FOR ALL 
USING (auth.uid() = user_id);

-- =====================================================
-- SEED DATA: Sample Quizzes
-- =====================================================
INSERT INTO quizzes (title, subject, option, difficulty, duration_minutes, questions_count, average_score, times_completed) VALUES
('Mathématiques Exetat 2023', 'Mathématiques', 'Scientifique', 'Difficile', 10, 10, 65.5, 234),
('Physique Scientifique', 'Physique', 'Scientifique', 'Moyen', 8, 10, 72.3, 189),
('Chimie Exetat', 'Chimie', 'Scientifique', 'Difficile', 10, 10, 58.7, 156),
('Français Littéraire', 'Français', 'Littéraire', 'Facile', 8, 10, 78.2, 267),
('Géographie Exetat', 'Géographie', 'Littéraire', 'Facile', 6, 10, 82.1, 145),
('Biologie Scientifique', 'Biologie', 'Scientifique', 'Moyen', 8, 10, 70.4, 178),
('Mathématiques Commerciale', 'Mathématiques', 'Commerciale', 'Moyen', 8, 10, 74.6, 123),
('Français Pédagogie', 'Français', 'Pédagogie', 'Facile', 6, 10, 85.3, 98);

-- =====================================================
-- SEED DATA: Sample Quiz Questions
-- (Mathématiques Exetat 2023 - Quiz 1)
-- =====================================================
INSERT INTO quiz_questions (quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
((SELECT id FROM quizzes WHERE title = 'Mathématiques Exetat 2023'), 1, 'Combien vaut √144 ?', '10', '12', '14', '16', 'B', '144 est le carré de 12, donc √144 = 12'),
((SELECT id FROM quizzes WHERE title = 'Mathématiques Exetat 2023'), 2, 'Simplifiez : 2⁴ × 2³', '2⁷', '2¹²', '4⁷', '4¹²', 'A', 'Pour multiplier les puissances de même base, on additionne les exposants : 4 + 3 = 7'),
((SELECT id FROM quizzes WHERE title = 'Mathématiques Exetat 2023'), 3, 'La solution de l''équation 2x + 5 = 13 est :', 'x = 4', 'x = 5', 'x = 6', 'x = 7', 'A', '2x = 13 - 5 = 8, donc x = 8/2 = 4'),
((SELECT id FROM quizzes WHERE title = 'Mathématiques Exetat 2023'), 4, 'Quel est le PGCD de 36 et 48 ?', '6', '12', '18', '24', 'B', '36 = 2² × 3², 48 = 2⁴ × 3, PGCD = 2² × 3 = 12'),
((SELECT id FROM quizzes WHERE title = 'Mathématiques Exetat 2023'), 5, 'Le périmètre d''un cercle de rayon 7 cm est : (π ≈ 22/7)', '22 cm', '44 cm', '77 cm', '154 cm', 'B', 'P = 2πr = 2 × 22/7 × 7 = 44 cm'),
((SELECT id FROM quizzes WHERE title = 'Mathématiques Exetat 2023'), 6, 'Résolvez : |x - 3| = 7', 'x = 10', 'x = -4', 'x = 10 ou x = -4', 'x = 4', 'C', '|x - 3| = 7 donne x - 3 = 7 ou x - 3 = -7, donc x = 10 ou x = -4'),
((SELECT id FROM quizzes WHERE title = 'Mathématiques Exetat 2023'), 7, 'Combien de mots de 3 lettres peut-on former avec les lettres A, B, C, D, E ?', '60', '125', '100', '90', 'A', 'Pour les permutations de 5 lettres prises 3 : P(5,3) = 5 × 4 × 3 = 60'),
((SELECT id FROM quizzes WHERE title = 'Mathématiques Exetat 2023'), 8, 'La fonction dérivée de f(x) = x³ est :', 'f''(x) = x²', 'f''(x) = 3x²', 'f''(x) = 3x', 'f''(x) = x³/3', 'B', 'La dérivée de xⁿ est n×xⁿ⁻¹, donc dérivée de x³ = 3x²'),
((SELECT id FROM quizzes WHERE title = 'Mathématiques Exetat 2023'), 9, 'Quel est le centre du cercle d''équation (x-2)² + (y+1)² = 25 ?', '(2, 1)', '(-2, 1)', '(2, -1)', '(-2, -1)', 'C', 'L''équation est de la forme (x-a)² + (y-b)² = r², donc centre (a, b) = (2, -1)'),
((SELECT id FROM quizzes WHERE title = 'Mathématiques Exetat 2023'), 10, 'Simplifiez : (a³)² × a⁴', 'a⁹', 'a¹⁰', 'a¹⁴', 'a²⁴', 'B', '(a³)² = a⁶, donc a⁶ × a⁴ = a¹⁰');

-- =====================================================
-- SEED DATA: Sample Quiz Questions
-- (Physique Scientifique - Quiz 2)
-- =====================================================
INSERT INTO quiz_questions (quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
((SELECT id FROM quizzes WHERE title = 'Physique Scientifique'), 1, 'La vitesse de la lumière dans le vide est :', '3×10⁶ m/s', '3×10⁷ m/s', '3×10⁸ m/s', '3×10⁹ m/s', 'C', 'La vitesse de la lumière dans le vide est exactement 299 792 458 m/s, soit environ 3×10⁸ m/s'),
((SELECT id FROM quizzes WHERE title = 'Physique Scientifique'), 2, 'L''unité de la force dans le SI est :', 'Newton', 'Joule', 'Watt', 'Pascal', 'A', 'La force s''exprime en Newton (N), soit kg·m/s²'),
((SELECT id FROM quizzes WHERE title = 'Physique Scientifique'), 3, 'La quantité de mouvement d''un objet de masse m et de vitesse v est :', 'mv', 'mv²/2', 'mgh', 'k/x', 'A', 'La quantité de mouvement p = mv (en kg·m/s)'),
((SELECT id FROM quizzes WHERE title = 'Physique Scientifique'), 4, 'La capacité thermique de l''eau est :', '4180 J/kg·K', '418 J/kg·K', '41,8 J/kg·K', '4,18 J/kg·K', 'A', 'La capacité thermique massique de l''eau est 4180 J/(kg·K)'),
((SELECT id FROM quizzes WHERE title = 'Physique Scientifique'), 5, 'Un corps lancé vers le haut sur Terre retombe是因为 :', 'son poids', 'son inertie', 'la résistance de l''air', 'aucune force', 'A', 'Un corps lancé vers le haut est ramené vers le bas par son poids (force de gravité)'),
((SELECT id FROM quizzes WHERE title = 'Physique Scientifique'), 6, 'La fréquence de la lumière visible vary entre :', '10¹² - 10¹⁴ Hz', '10¹⁴ - 10¹⁵ Hz', '10¹⁵ - 10¹⁶ Hz', '10⁸ - 10¹⁰ Hz', 'B', 'Le spectre visible va de 400 à 790 THz, soit 10¹⁴ - 10¹⁵ Hz'),
((SELECT id FROM quizzes WHERE title = 'Physique Scientifique'), 7, 'La tension efficace du secteur en RDC est :', '110V', '220V', '380V', '500V', 'B', 'La tension du secteur en RDC est 220V efficaces'),
((SELECT id FROM quizzes WHERE title = 'Physique Scientifique'), 8, 'Un objet placedDans un fluide subit une force d''archimède направ 위로 quand :', 'il est plus dense', 'il est moins dense', 'sa forme est ronde', 'aucune condition', 'B', 'La poussée d''Archimède направ向上 si la densité de l''objet < densité du fluide'),
((SELECT id FROM quizzes WHERE title = 'Physique Scientifique'), 9, 'La longueur d''onde de Broglie d''une particule est :', 'λ = h/p', 'λ = hp', 'λ = p/h', 'λ = h/p²', 'A', 'La longueur d''onde de Broglie λ = h/p où h est la constante de Planck'),
((SELECT id FROM quizzes WHERE title = 'Physique Scientifique'), 10, 'L''oeil normal voit clearly à l''infini quand il est :', 'au repos', 'en accommodation', 'contracté', 'dilaté', 'A', 'L''oeil au repos focalise l''infini sur la rétine (emmétropie)');

-- =====================================================
-- SEED DATA: Sample Questions
-- (Insert these after creating a simulation)
-- =====================================================
-- Note: Questions will be seeded when user starts a simulation
-- This allows for different exam sessions

-- =====================================================
-- TABLE: profiles
-- Stores user profile information
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    school TEXT NOT NULL,
    province TEXT NOT NULL,
    option TEXT NOT NULL,
    exam_year INTEGER NOT NULL,
    avatar_url TEXT,
    subscription TEXT DEFAULT 'gratuit' CHECK (subscription IN ('gratuit', 'premium')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- TABLE: user_stats
-- Stores user learning statistics
-- =====================================================
CREATE TABLE IF NOT EXISTS user_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) UNIQUE,
    exams_opened INTEGER DEFAULT 0,
    quizzes_completed INTEGER DEFAULT 0,
    average_score NUMERIC(5,2) DEFAULT 0,
    study_time_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- TABLE: subject_progress
-- Stores per-subject progress for Exetat preparation
-- =====================================================
CREATE TABLE IF NOT EXISTS subject_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    subject TEXT NOT NULL,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, subject)
);

-- =====================================================
-- TABLE: user_activities
-- Stores recent user activities
-- =====================================================
CREATE TABLE IF NOT EXISTS user_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    activity_type TEXT NOT NULL CHECK (activity_type IN ('quiz', 'exam', 'simulation')),
    title TEXT NOT NULL,
    date TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- TABLE: personal_goals
-- Stores user personal goals
-- =====================================================
CREATE TABLE IF NOT EXISTS personal_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    goal_type TEXT NOT NULL CHECK (goal_type IN ('score', 'daily')),
    target TEXT NOT NULL,
    current INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_profiles_user ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_user ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_subject_progress_user ON subject_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_user ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_date ON user_activities(date DESC);
CREATE INDEX IF NOT EXISTS idx_personal_goals_user ON personal_goals(user_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_goals ENABLE ROW LEVEL SECURITY;

-- Users can manage their own profile data
CREATE POLICY "Users can manage own profile" 
ON profiles FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own stats" 
ON user_stats FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own progress" 
ON subject_progress FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own activities" 
ON user_activities FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own goals" 
ON personal_goals FOR ALL 
USING (auth.uid() = user_id);

-- =====================================================
-- TABLE: user_preferences
-- Stores user settings and preferences
-- =====================================================
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) UNIQUE,
    theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    language TEXT DEFAULT 'fr' CHECK (language IN ('fr', 'en', 'ln', 'sw')),
    notifications_enabled BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT false,
    new_exams_notifications BOOLEAN DEFAULT true,
    new_quiz_notifications BOOLEAN DEFAULT true,
    results_notifications BOOLEAN DEFAULT true,
    premium_promo_notifications BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_user_preferences_user ON user_preferences(user_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Users can manage their own preferences
CREATE POLICY "Users can manage own preferences"
ON user_preferences FOR ALL
USING (auth.uid() = user_id);

-- =====================================================
-- TABLE: leaderboard
-- Stores user scores for the leaderboard system
-- =====================================================
CREATE TABLE IF NOT EXISTS leaderboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    score INTEGER DEFAULT 0,
    province TEXT NOT NULL,
    school TEXT NOT NULL,
    option TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- TABLE: badges
-- Stores available badges
-- =====================================================
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- TABLE: user_badges
-- Stores badges earned by users
-- =====================================================
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    badge_id UUID REFERENCES badges(id),
    earned_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, badge_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_province ON leaderboard(province);
CREATE INDEX IF NOT EXISTS idx_leaderboard_option ON leaderboard(option);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user ON leaderboard(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_badges_id ON badges(id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Leaderboard is publicly readable
CREATE POLICY "Leaderboard is publicly readable"
ON leaderboard FOR SELECT
USING (true);

-- Users can manage their own leaderboard entry
CREATE POLICY "Users can manage own leaderboard"
ON leaderboard FOR ALL
USING (auth.uid() = user_id);

-- Badges are publicly readable
CREATE POLICY "Badges are publicly readable"
ON badges FOR SELECT
USING (true);

-- Users can manage their own badges
CREATE POLICY "Users can manage own badges"
ON user_badges FOR ALL
USING (auth.uid() = user_id);

-- =====================================================
-- SEED DATA: Badges
-- =====================================================
INSERT INTO badges (name, description, icon) VALUES
('Champion Quiz', 'Termine premier sur un quiz', 'trophy'),
('Série 7 jours', '7 jours de suite sur Exevo', 'flame'),
('Expert Mathématiques', 'Score parfait en mathématiques', 'book-open'),
('Top 10 National', 'Rejoins le top 10 national', 'star'),
('Score parfait', 'Obtiens 100% sur un quiz', 'target'),
('Premier de la classe', 'Première place dans ta classe', 'crown'),
('Série 30 jours', '30 jours de suite sur Exevo', 'fire'),
('Maître Physique', 'Expert en Physique', 'atom'),
('Maître Chimie', 'Expert en Chimie', 'flask-conical'),
('Lecteur assidu', 'Complète 50 quiz', 'graduation-cap');

-- =====================================================
-- TABLE: downloads
-- Stores user download history
-- =====================================================
CREATE TABLE IF NOT EXISTS downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    downloaded_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, exam_id)
);

-- =====================================================
-- TABLE: favorites
-- Stores user favorite exams
-- =====================================================
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, exam_id)
);

-- =====================================================
-- TABLE: activity_logs
-- Stores user activity history
-- =====================================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL CHECK (action IN ('download', 'open', 'quiz_start', 'favorite_add', 'favorite_remove')),
    reference_id TEXT NOT NULL,
    title TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_downloads_user ON downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_exam ON downloads(exam_id);
CREATE INDEX IF NOT EXISTS idx_downloads_date ON downloads(downloaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_exam ON favorites(exam_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_date ON activity_logs(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Users can manage their own downloads
CREATE POLICY "Users can manage own downloads"
ON downloads FOR ALL
USING (auth.uid() = user_id);

-- Users can manage their own favorites
CREATE POLICY "Users can manage own favorites"
ON favorites FOR ALL
USING (auth.uid() = user_id);

-- Users can manage their own activity logs
CREATE POLICY "Users can manage own activity logs"
ON activity_logs FOR ALL
USING (auth.uid() = user_id);
