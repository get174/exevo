import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
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

    const { data: goals, error: goalsError } = await supabase
      .from('personal_goals')
      .select('*')
      .eq('user_id', user.id);

    if (goalsError) {
      return NextResponse.json({ error: 'Goals non trouvés' }, { status: 404 });
    }

    return NextResponse.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
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
    const { goal_type, target, current } = body;

    const { data: newGoal, error: insertError } = await supabase
      .from('personal_goals')
      .insert({
        user_id: user.id,
        goal_type,
        target,
        current: current || 0,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: 'Erreur création goal' }, { status: 400 });
    }

    return NextResponse.json(newGoal);
  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
