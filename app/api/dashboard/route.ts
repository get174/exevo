import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from Authorization header (optional)
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    let userId: string | null = null;
    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Always fetch public data in parallel
    const [
      { count: examsCount },
      { data: leaderboard },
      { data: popularExams },
    ] = await Promise.all([
      supabase.from('exams').select('*', { count: 'exact', head: true }),
      supabase
        .from('leaderboard')
        .select('*, profiles(full_name)')
        .order('score', { ascending: false })
        .limit(10),
      supabase
        .from('exams')
        .select('id, title, subject, year, option, difficulty, downloads_count')
        .order('downloads_count', { ascending: false })
        .limit(4),
    ]);

    // If user is authenticated, fetch user-specific data
    let stats = {
      examsCount: examsCount || 0,
      quizzesCompleted: 0,
      averageScore: 0,
      userPosition: 0,
    };
    let recentRevisions: unknown[] = [];

    if (userId) {
      const [
        { data: quizResults },
        { data: userStats },
        { data: subjectProgress },
      ] = await Promise.all([
        supabase
          .from('quiz_results')
          .select('score')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
        supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', userId)
          .single(),
        supabase
          .from('subject_progress')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false }),
      ]);

      const quizzesCompleted = quizResults?.length || 0;
      const averageScore = quizResults && quizResults.length > 0
        ? quizResults.reduce((acc, r) => acc + (r.score || 0), 0) / quizResults.length
        : userStats?.average_score || 0;

      // Calculate user position
      const { data: allLeaderboard } = await supabase
        .from('leaderboard')
        .select('user_id')
        .order('score', { ascending: false });

      let userPosition = 0;
      if (allLeaderboard) {
        const positionIndex = allLeaderboard.findIndex(entry => entry.user_id === userId);
        userPosition = positionIndex >= 0 ? positionIndex + 1 : allLeaderboard.length + 1;
      }

      stats = {
        examsCount: examsCount || 0,
        quizzesCompleted,
        averageScore: Math.round(averageScore),
        userPosition,
      };
      recentRevisions = subjectProgress || [];
    }

    return NextResponse.json({
      stats,
      leaderboard: leaderboard || [],
      popularExams: popularExams || [],
      recentRevisions,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
