import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { SAMPLE_EXAMS } from '@/types/exam';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    // Use Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      const { data: exam, error } = await supabase
        .from('exams')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json(
            { error: 'Examen non trouvé' },
            { status: 404 }
          );
        }
        throw error;
      }

      return NextResponse.json(exam);
    }

    // Fallback to sample data (demo mode)
    const exam = SAMPLE_EXAMS.find(e => e.id === id);

    if (!exam) {
      return NextResponse.json(
        { error: 'Examen non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(exam);
  } catch (error) {
    console.error('Error fetching exam:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement de l\'examen' },
      { status: 500 }
    );
  }
}

// PUT - Update exam (admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();

  try {
    if (!isSupabaseConfigured() || !supabase) {
      return NextResponse.json(
        { error: 'Base de données non configurée' },
        { status: 503 }
      );
    }

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
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

// DELETE - Delete exam (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    if (!isSupabaseConfigured() || !supabase) {
      return NextResponse.json(
        { error: 'Base de données non configurée' },
        { status: 503 }
      );
    }

    const { error } = await supabase
      .from('exams')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting exam:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}
