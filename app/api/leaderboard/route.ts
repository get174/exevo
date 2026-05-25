import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const province = searchParams.get('province');
    const option = searchParams.get('option');
    const limit = parseInt(searchParams.get('limit') || '50');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let query = supabase
      .from('leaderboard')
      .select('*, profiles(full_name, school, province, option)')
      .order('score', { ascending: false })
      .limit(limit);

    if (province) {
      query = query.eq('province', province);
    }
    if (option) {
      query = query.eq('option', option);
    }

    const { data: leaderboard, error } = await query;

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return NextResponse.json({ error: 'Erreur lors du chargement' }, { status: 500 });
    }

    return NextResponse.json({ leaderboard: leaderboard || [] });
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

    return NextResponse.json(entry);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
