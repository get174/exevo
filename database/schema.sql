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
-- SEED DATA: Sample Questions
-- (Insert these after creating a simulation)
-- =====================================================
-- Note: Questions will be seeded when user starts a simulation
-- This allows for different exam sessions
