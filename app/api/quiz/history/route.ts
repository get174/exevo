import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!supabaseUrl || !supabaseServiceKey) {
      // Demo mode - return empty history
      return NextResponse.json({
        history: [],
        stats: {
          total_completed: 0,
          average_score: 0,
          best_subject: null,
          weakest_subject: null,
        },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 401 });
    }

    // Fetch user's quiz history with quiz details
    const { data: history, error } = await supabase
      .from('quiz_results')
      .select(`
        id,
        score,
        correct_count,
        wrong_count,
        time_spent_seconds,
        created_at,
        quiz:quizzes (
          id,
          title,
          subject,
          option,
          difficulty
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Calculate stats from all user's quiz results
    const { data: allResults } = await supabase
      .from('quiz_results')
      .select('score, quiz:quizzes(subject)')
      .eq('user_id', user.id);

    if (!allResults || allResults.length === 0) {
      return NextResponse.json({
        history: history || [],
        stats: {
          total_completed: 0,
          average_score: 0,
          best_subject: null,
          weakest_subject: null,
        },
      });
    }

    // Calculate average score
    const totalScore = allResults.reduce((acc, r) => acc + (r.score || 0), 0);
    const averageScore = Math.round((totalScore / allResults.length) * 100) / 100;

    // Calculate subject performance
    const subjectScores: Record<string, { total: number; count: number }> = {};
    allResults.forEach((r: any) => {
      const subject = r.quiz?.subject;
      if (subject) {
        if (!subjectScores[subject]) {
          subjectScores[subject] = { total: 0, count: 0 };
        }
        subjectScores[subject].total += r.score || 0;
        subjectScores[subject].count += 1;
      }
    });

    const subjectAverages = Object.entries(subjectScores).map(([subject, data]) => ({
      subject,
      average: data.total / data.count,
    }));

    subjectAverages.sort((a, b) => b.average - a.average);
    const bestSubject = subjectAverages[0]?.subject || null;
    const weakestSubject = subjectAverages[subjectAverages.length - 1]?.subject || null;

    return NextResponse.json({
      history: history || [],
      stats: {
        total_completed: allResults.length,
        average_score: averageScore,
        best_subject: bestSubject,
        weakest_subject: weakestSubject,
      },
    });
  } catch (error) {
    console.error('Error fetching quiz history:', error);
    return NextResponse.json({ error: 'Erreur lors du chargement de l\'historique' }, { status: 500 });
  }
}