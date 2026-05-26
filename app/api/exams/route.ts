import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SAMPLE_EXAMS, DEFAULT_PAGINATION } from '@/types/exam';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get('page') || String(DEFAULT_PAGINATION.page));
  const limit = parseInt(searchParams.get('limit') || String(DEFAULT_PAGINATION.limit));
  const offset = (page - 1) * limit;

  const search = searchParams.get('search') || '';
  const year = searchParams.get('year') || '';
  const subject = searchParams.get('subject') || '';
  const option = searchParams.get('option') || '';
  const difficulty = searchParams.get('difficulty') || '';

  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      // Fallback to sample data
      return getDemoResponse(search, year, subject, option, difficulty, offset, limit, page);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let query = supabase.from('exams').select('*', { count: 'exact' });

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (year) {
      query = query.eq('year', year);
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

    const { data: exams, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Supabase error:', error);
      return getDemoResponse(search, year, subject, option, difficulty, offset, limit, page);
    }

    // If no exams from DB but we have demo data, use demo
    if (!exams || exams.length === 0) {
      console.log('No exams from DB, using demo data');
      return getDemoResponse(search, year, subject, option, difficulty, offset, limit, page);
    }

    return NextResponse.json({
      exams: exams || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error('Error fetching exams:', error);
    return getDemoResponse(search, year, subject, option, difficulty, offset, limit, page);
  }
}

function getDemoResponse(search: string, year: string, subject: string, option: string, difficulty: string, offset: number, limit: number, page: number) {
  let filteredExams = [...SAMPLE_EXAMS];

  if (search) {
    const searchLower = search.toLowerCase();
    filteredExams = filteredExams.filter(exam =>
      exam.title.toLowerCase().includes(searchLower) ||
      exam.subject.toLowerCase().includes(searchLower) ||
      exam.description?.toLowerCase().includes(searchLower)
    );
  }

  if (year) {
    filteredExams = filteredExams.filter(exam => exam.year === parseInt(year));
  }

  if (subject) {
    filteredExams = filteredExams.filter(exam => exam.subject === subject);
  }

  if (option) {
    filteredExams = filteredExams.filter(exam => exam.option === option);
  }

  if (difficulty) {
    filteredExams = filteredExams.filter(exam => exam.difficulty === difficulty);
  }

  const total = filteredExams.length;
  const paginatedExams = filteredExams.slice(offset, offset + limit);

  return NextResponse.json({
    exams: paginatedExams,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}