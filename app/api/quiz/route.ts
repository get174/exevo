import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { SAMPLE_QUIZZES, DEFAULT_PAGINATION } from '@/types/quiz';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Pagination
  const page = parseInt(searchParams.get('page') || String(DEFAULT_PAGINATION.page));
  const limit = parseInt(searchParams.get('limit') || String(DEFAULT_PAGINATION.limit));
  const offset = (page - 1) * limit;

  // Filters
  const search = searchParams.get('search') || '';
  const subject = searchParams.get('subject');
  const option = searchParams.get('option');
  const difficulty = searchParams.get('difficulty');
  const duration = searchParams.get('duration');

  try {
    // Use Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      let query = supabase
        .from('quizzes')
        .select('*', { count: 'exact' });

      // Apply filters
      if (search) {
        query = query.or(`title.ilike.%${search}%`);
      }
      if (subject) {
        query = query.eq('subject', subject);
      }
      if (option) {
        query = query.eq('option', option);
      }
      if (difficulty) {
        query = query.eq('difficulty', difficulty);
      }
      if (duration) {
        if (duration === 'short') {
          query = query.lt('duration_minutes', 5);
        } else if (duration === 'medium') {
          query = query.gte('duration_minutes', 5).lte('duration_minutes', 10);
        } else if (duration === 'long') {
          query = query.gt('duration_minutes', 10);
        }
      }

      // Order and paginate
      const { data: quizzes, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return NextResponse.json({
        quizzes: quizzes || [],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      });
    }

    // Fallback to sample data (demo mode)
    let filteredQuizzes = [...SAMPLE_QUIZZES];

    // Apply filters to sample data
    if (search) {
      const searchLower = search.toLowerCase();
      filteredQuizzes = filteredQuizzes.filter(quiz =>
        quiz.title.toLowerCase().includes(searchLower) ||
        quiz.subject.toLowerCase().includes(searchLower)
      );
    }

    if (subject) {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.subject === subject);
    }

    if (option) {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.option === option);
    }

    if (difficulty) {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.difficulty === difficulty);
    }

    if (duration) {
      if (duration === 'short') {
        filteredQuizzes = filteredQuizzes.filter(quiz => quiz.duration_minutes < 5);
      } else if (duration === 'medium') {
        filteredQuizzes = filteredQuizzes.filter(quiz => quiz.duration_minutes >= 5 && quiz.duration_minutes <= 10);
      } else if (duration === 'long') {
        filteredQuizzes = filteredQuizzes.filter(quiz => quiz.duration_minutes > 10);
      }
    }

    const total = filteredQuizzes.length;
    const paginatedQuizzes = filteredQuizzes.slice(offset, offset + limit);

    return NextResponse.json({
      quizzes: paginatedQuizzes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des quizzes' },
      { status: 500 }
    );
  }
}
