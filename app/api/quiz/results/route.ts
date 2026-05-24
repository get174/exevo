import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quiz_id, score, correct_count, wrong_count, time_spent_seconds } = body;

    // Validate required fields
    if (!quiz_id || score === undefined || correct_count === undefined || wrong_count === undefined || !time_spent_seconds) {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      );
    }

    // Use Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      const { data: result, error } = await supabase
        .from('quiz_results')
        .insert({
          quiz_id,
          score,
          correct_count,
          wrong_count,
          time_spent_seconds,
        })
        .select()
        .single();

      if (error) throw error;

      // Update quiz statistics
      const { data: quiz } = await supabase
        .from('quizzes')
        .select('times_completed, average_score')
        .eq('id', quiz_id)
        .single();

      if (quiz) {
        const newCompleted = quiz.times_completed + 1;
        const newAverage = ((quiz.average_score * quiz.times_completed) + score) / newCompleted;

        await supabase
          .from('quizzes')
          .update({
            times_completed: newCompleted,
            average_score: Math.round(newAverage * 100) / 100,
          })
          .eq('id', quiz_id);
      }

      return NextResponse.json(result);
    }

    // Demo mode - just return success
    return NextResponse.json({
      id: `result_${Date.now()}`,
      quiz_id,
      score,
      correct_count,
      wrong_count,
      time_spent_seconds,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error saving quiz result:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde du résultat' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const quiz_id = searchParams.get('quiz_id');

  if (!quiz_id) {
    return NextResponse.json(
      { error: 'ID du quiz requis' },
      { status: 400 }
    );
  }

  try {
    // Use Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      const { data: results, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('quiz_id', quiz_id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      return NextResponse.json({ results: results || [] });
    }

    // Demo mode
    return NextResponse.json({ results: [] });
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des résultats' },
      { status: 500 }
    );
  }
}
