import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

    const { data: simulations, error } = await supabase
      .from('simulations')
      .select('*, simulation_results(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching simulations:', error);
      return NextResponse.json({ error: 'Erreur lors du chargement' }, { status: 500 });
    }

    return NextResponse.json({ simulations: simulations || [] });
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
    const { candidate_name, candidate_firstname, candidate_code, sex, option, province, school } = body;

    const { data: simulation, error: createError } = await supabase
      .from('simulations')
      .insert({
        user_id: user.id,
        candidate_name,
        candidate_firstname,
        candidate_code,
        sex,
        option,
        province,
        school,
        status: 'pending',
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating simulation:', createError);
      return NextResponse.json({ error: 'Erreur création simulation' }, { status: 400 });
    }

    return NextResponse.json(simulation);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

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

    const body = await request.json();
    const { id, status, started_at, ended_at, answers } = body;

    // Update simulation status
    if (status || started_at || ended_at) {
      const { data: simulation, error: updateError } = await supabase
        .from('simulations')
        .update({
          status,
          started_at: started_at || new Date().toISOString(),
          ended_at,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating simulation:', updateError);
        return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 400 });
      }

      // Save answers if provided
      if (answers && Array.isArray(answers)) {
        for (const answer of answers) {
          await supabase
            .from('simulation_answers')
            .upsert({
              simulation_id: id,
              question_id: answer.question_id,
              selected_answer: answer.selected_answer,
              answered_at: new Date().toISOString(),
            }, {
              onConflict: 'simulation_id,question_id',
            });
        }
      }

      return NextResponse.json(simulation);
    }

    return NextResponse.json({ error: 'Aucune donnée à mettre à jour' }, { status: 400 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
