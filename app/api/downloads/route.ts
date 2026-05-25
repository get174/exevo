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

    const { data: downloads, error } = await supabase
      .from('downloads')
      .select('*, exams(*)')
      .eq('user_id', user.id)
      .order('downloaded_at', { ascending: false });

    if (error) {
      console.error('Error fetching downloads:', error);
      return NextResponse.json({ error: 'Erreur lors du chargement' }, { status: 500 });
    }

    return NextResponse.json({ downloads: downloads || [] });
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
    const { exam_id } = body;

    // Record download
    const { data: download, error: insertError } = await supabase
      .from('downloads')
      .upsert({
        user_id: user.id,
        exam_id,
        downloaded_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,exam_id',
      })
      .select('*, exams(*)')
      .single();

    if (insertError) {
      console.error('Error recording download:', insertError);
      return NextResponse.json({ error: 'Erreur enregistrement' }, { status: 400 });
    }

    // Increment download count on exam
    await supabase.rpc('increment_download_count', { exam_id_param: exam_id });

    return NextResponse.json(download);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
