import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const province = searchParams.get('province');
    const option = searchParams.get('option');
    const school = searchParams.get('school');
    const period = searchParams.get('period') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Build date filter for period
    let dateFilter: string | null = null;
    const now = new Date();
    if (period === 'today') {
      dateFilter = now.toISOString().split('T')[0];
    } else if (period === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = weekAgo.toISOString();
    } else if (period === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = monthAgo.toISOString();
    }

    // Build query without foreign key relationship
    let query = supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);

    if (province) {
      query = query.eq('province', province);
    }
    if (option) {
      query = query.eq('option', option);
    }
    if (school) {
      query = query.eq('school', school);
    }
    if (dateFilter) {
      query = query.gte('updated_at', dateFilter);
    }

    const { data: leaderboard, error } = await query;

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return NextResponse.json({ error: 'Erreur lors du chargement' }, { status: 500 });
    }

    // Get user profiles for all users in leaderboard
    const userIds = (leaderboard || []).map((entry) => entry.user_id).filter(Boolean);
    let profilesMap: Record<string, { full_name: string; avatar_url: string | null }> = {};

    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url')
        .in('user_id', userIds);

      profilesMap = (profiles || []).reduce((acc, profile) => {
        acc[profile.user_id] = {
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
        };
        return acc;
      }, {} as Record<string, { full_name: string; avatar_url: string | null }>);
    }

    // Merge leaderboard data with profile info
    const rankedData = (leaderboard || []).map((entry, index) => {
      const profile = profilesMap[entry.user_id] || {};
      return {
        ...entry,
        full_name: profile.full_name || 'Utilisateur',
        avatar_url: profile.avatar_url,
        rank: offset + index + 1,
      };
    });

    return NextResponse.json({
      leaderboard: rankedData,
      total: rankedData.length,
      offset,
      limit,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 401 });
    }

    const body = await request.json();
    const { score, province, school, option } = body;

    // Get current score for comparison
    const { data: currentEntry } = await supabase
      .from('leaderboard')
      .select('score')
      .eq('user_id', user.id)
      .single();

    const previousScore = currentEntry?.score || 0;
    const scoreChange = score - previousScore;

    // Upsert leaderboard entry
    const { data: entry, error: upsertError } = await supabase
      .from('leaderboard')
      .upsert({
        user_id: user.id,
        score,
        province,
        school,
        option,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      })
      .select()
      .single();

    if (upsertError) {
      console.error('Error updating leaderboard:', upsertError);
      return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 400 });
    }

    return NextResponse.json({
      ...entry,
      score_change: scoreChange,
      previous_score: previousScore,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Get user's current position
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 401 });
    }

    // Get user's position
    const { data: userEntry } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!userEntry) {
      return NextResponse.json({ rank: null, score: 0, message: 'Pas encore dans le classement' });
    }

    // Get user's profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('user_id', user.id)
      .single();

    // Count users with higher scores
    const { count: higherCount } = await supabase
      .from('leaderboard')
      .select('*', { count: 'exact', head: true })
      .gt('score', userEntry.score);

    const rank = (higherCount || 0) + 1;

    // Get province rank
    const { count: provinceCount } = await supabase
      .from('leaderboard')
      .select('*', { count: 'exact', head: true })
      .eq('province', userEntry.province)
      .gt('score', userEntry.score);

    const provinceRank = (provinceCount || 0) + 1;

    // Get option rank
    const { count: optionCount } = await supabase
      .from('leaderboard')
      .select('*', { count: 'exact', head: true })
      .eq('option', userEntry.option)
      .gt('score', userEntry.score);

    const optionRank = (optionCount || 0) + 1;

    // Calculate points to next rank
    const { data: nextPlayer } = await supabase
      .from('leaderboard')
      .select('user_id, score')
      .gt('score', userEntry.score)
      .order('score', { ascending: true })
      .limit(1)
      .single();

    const pointsToNextRank = nextPlayer ? nextPlayer.score - userEntry.score : 0;

    // Get next player profile
    let nextPlayerName: string | null = null;
    if (nextPlayer) {
      const { data: nextProfile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', nextPlayer.user_id)
        .single();
      nextPlayerName = nextProfile?.full_name || null;
    }

    // Get weekly and daily progress (simulated - would need activity tracking table)
    const weeklyProgress = Math.floor(Math.random() * 50);
    const dailyProgress = Math.floor(Math.random() * 10);

    return NextResponse.json({
      rank,
      score: userEntry.score,
      province: userEntry.province,
      option: userEntry.option,
      pointsToNextRank,
      nextPlayerName,
      provinceRank,
      optionRank,
      weeklyProgress,
      dailyProgress,
      full_name: profile?.full_name || 'Utilisateur',
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
