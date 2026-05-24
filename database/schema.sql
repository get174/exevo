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
-- SEED DATA: Sample Questions
-- (Insert these after creating a simulation)
-- =====================================================
-- Note: Questions will be seeded when user starts a simulation
-- This allows for different exam sessions
