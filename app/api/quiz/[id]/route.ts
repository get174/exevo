import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { SAMPLE_QUIZZES } from '@/types/quiz';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Use Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      const { data: quiz, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!quiz) {
        return NextResponse.json(
          { error: 'Quiz non trouvé' },
          { status: 404 }
        );
      }

      return NextResponse.json(quiz);
    }

    // Fallback to sample data
    const quiz = SAMPLE_QUIZZES.find(q => q.id === id);
    
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement du quiz' },
      { status: 500 }
    );
  }
}
