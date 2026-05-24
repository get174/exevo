import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { SAMPLE_QUESTIONS } from '@/types/quiz';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Use Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      const { data: questions, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', id)
        .order('question_number', { ascending: true });

      if (error) throw error;

      return NextResponse.json({ questions: questions || [] });
    }

    // Fallback to sample data
    const questions = SAMPLE_QUESTIONS.filter(q => q.quiz_id === id);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des questions' },
      { status: 500 }
    );
  }
}
