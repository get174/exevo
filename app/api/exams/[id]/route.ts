import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SAMPLE_EXAMS } from '@/types/exam';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      // Fallback to sample data (demo mode)
      const exam = SAMPLE_EXAMS.find(e => e.id === id);
      if (!exam) {
        return NextResponse.json({ error: 'Examen non trouvé' }, { status: 404 });
      }
      return NextResponse.json(exam);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: exam, error } = await supabase
      .from('exams')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Examen non trouvé' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(exam);
  } catch (error) {
    console.error('Error fetching exam:', error);
    return NextResponse.json({ error: 'Erreur lors du chargement de l\'examen' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();

  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Base de données non configurée' }, { status: 503 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: exam, error } = await supabase
      .from('exams')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(exam);
  } catch (error) {
    console.error('Error updating exam:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Base de données non configurée' }, { status: 503 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase
      .from('exams')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting exam:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}