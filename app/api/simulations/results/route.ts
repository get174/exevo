import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

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
    const { simulationId, score, correctCount, wrongCount, blankCount, timeUsedSeconds } = body;

    const { data: result, error: insertError } = await supabase
      .from('simulation_results')
      .insert({
        simulation_id: simulationId,
        score,
        correct_count: correctCount,
        wrong_count: wrongCount,
        blank_count: blankCount,
        time_used_seconds: timeUsedSeconds,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting results:', insertError);
      return NextResponse.json({ error: 'Erreur lors de la sauvegarde des résultats' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

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

    const { data: results, error } = await supabase
      .from('simulation_results')
      .select('*, simulations(*)')
      .eq('simulations.user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching results:', error);
      return NextResponse.json({ error: 'Erreur lors du chargement' }, { status: 500 });
    }

    return NextResponse.json({ results: results || [] });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}