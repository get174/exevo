import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET - Fetch all badges and user's earned badges
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all badges
    const { data: allBadges, error: badgesError } = await supabase
      .from('badges')
      .select('*')
      .order('created_at', { ascending: true });

    if (badgesError) {
      console.error('Error fetching badges:', badgesError);
      return NextResponse.json({ error: 'Erreur lors du chargement des badges' }, { status: 500 });
    }

    let earnedBadges: any[] = [];

    // If user is authenticated, get their earned badges
    if (authHeader) {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser(
          authHeader.replace('Bearer ', '')
        );

        if (!authError && user) {
          const { data: userBadges } = await supabase
            .from('user_badges')
            .select('*, badges(*)')
            .eq('user_id', user.id)
            .order('earned_at', { ascending: false });

          earnedBadges = userBadges || [];
        }
      } catch (err) {
        console.error('Error fetching user badges:', err);
      }
    }

    return NextResponse.json({
      allBadges: allBadges || [],
      earnedBadges: earnedBadges.map((ub) => ({
        id: ub.badges?.id,
        name: ub.badges?.name,
        description: ub.badges?.description,
        icon: ub.badges?.icon,
        earned_at: ub.earned_at,
      })),
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
