import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quiz_id, score, correct_count, wrong_count, time_spent_seconds } = body;

    if (!quiz_id || score === undefined || correct_count === undefined || wrong_count === undefined || !time_spent_seconds) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      // Demo mode
      return NextResponse.json({
        id: `result_${Date.now()}`,
        quiz_id,
        score,
        correct_count,
        wrong_count,
        time_spent_seconds,
        created_at: new Date().toISOString(),
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = request.headers.get('authorization');
    let userId = null;
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      userId = user?.id;
    }

    // Insert result
    const { data: result, error } = await supabase
      .from('quiz_results')
      .insert({
        quiz_id,
        user_id: userId,
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
  } catch (error) {
    console.error('Error saving quiz result:', error);
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde du résultat' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const quiz_id = searchParams.get('quiz_id');

  if (!quiz_id) {
    return NextResponse.json({ error: 'ID du quiz requis' }, { status: 400 });
  }

  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ results: [] });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: results, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('quiz_id', quiz_id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    return NextResponse.json({ results: results || [] });
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return NextResponse.json({ error: 'Erreur lors du chargement des résultats' }, { status: 500 });
  }
}
