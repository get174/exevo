import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SAMPLE_QUIZZES, DEFAULT_PAGINATION } from '@/types/quiz';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get('page') || String(DEFAULT_PAGINATION.page));
  const limit = parseInt(searchParams.get('limit') || String(DEFAULT_PAGINATION.limit));
  const offset = (page - 1) * limit;

  const search = searchParams.get('search') || '';
  const subject = searchParams.get('subject') || '';
  const option = searchParams.get('option') || '';
  const difficulty = searchParams.get('difficulty') || '';
  const duration = searchParams.get('duration') || '';

  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      console.log('Missing Supabase config - using demo data');
      return getDemoResponse(search, subject, option, difficulty, duration, offset, limit, page);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let query = supabase.from('quizzes').select('*', { count: 'exact' });

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

    const { data: quizzes, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Supabase error:', error);
      // Fallback to demo data on error
      return getDemoResponse(search, subject, option, difficulty, duration, offset, limit, page);
    }

    return NextResponse.json({
      quizzes: quizzes || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    // Fallback to demo data
    return getDemoResponse(search, subject, option, difficulty, duration, offset, limit, page);
  }
}

function getDemoResponse(search: string, subject: string, option: string, difficulty: string, duration: string, offset: number, limit: number, page: number) {
  let filteredQuizzes = [...SAMPLE_QUIZZES];

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
}