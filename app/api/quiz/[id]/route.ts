import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SAMPLE_QUIZZES } from '@/types/quiz';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      // Fallback to sample data
      const quiz = SAMPLE_QUIZZES.find(q => q.id === id);
      if (!quiz) {
        return NextResponse.json({ error: 'Quiz non trouvé' }, { status: 404 });
      }
      return NextResponse.json(quiz);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: quiz, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz non trouvé' }, { status: 404 });
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json({ error: 'Erreur lors du chargement du quiz' }, { status: 500 });
  }
}