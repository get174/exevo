import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Helper to get authenticated user
async function getAuthenticatedUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: { user }, error } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}

// GET - Fetch user's favorite exam IDs
export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  // If not authenticated, return empty (localStorage handles demo mode)
  if (!user) {
    return NextResponse.json({ favorites: [], authenticated: false });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: favorites, error } = await supabase
      .from('favorites')
      .select('exam_id')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching favorites:', error);
      return NextResponse.json({ favorites: [] });
    }

    const favoriteIds = favorites?.map(f => f.exam_id) || [];
    return NextResponse.json({ favorites: favoriteIds, authenticated: true });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ favorites: [] });
  }
}

// POST - Toggle favorite
export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  // If not authenticated, return error
  if (!user) {
    return NextResponse.json({ error: 'Non autorisé. Veuillez vous connecter.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { exam_id } = body;

    if (!exam_id) {
      return NextResponse.json({ error: 'exam_id required' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if already favorite
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('exam_id', exam_id)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      // Remove favorite
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id);

      if (error) throw error;

      return NextResponse.json({ success: true, favorited: false });
    } else {
      // Add favorite
      const { error } = await supabase
        .from('favorites')
        .insert({ exam_id, user_id: user.id });

      if (error) throw error;

      return NextResponse.json({ success: true, favorited: true });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json({ error: 'Failed to toggle favorite' }, { status: 500 });
  }
}