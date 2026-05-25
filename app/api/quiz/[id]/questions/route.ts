import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SAMPLE_QUESTIONS } from '@/types/quiz';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      // Fallback to sample data
      const questions = SAMPLE_QUESTIONS.filter(q => q.quiz_id === id);
      return NextResponse.json({ questions });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: questions, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', id)
      .order('question_number', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ questions: questions || [] });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Erreur lors du chargement des questions' }, { status: 500 });
  }
}