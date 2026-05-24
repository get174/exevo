import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { SAMPLE_EXAMS, DEFAULT_PAGINATION } from '@/types/exam';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Pagination
  const page = parseInt(searchParams.get('page') || String(DEFAULT_PAGINATION.page));
  const limit = parseInt(searchParams.get('limit') || String(DEFAULT_PAGINATION.limit));
  const offset = (page - 1) * limit;

  // Filters
  const search = searchParams.get('search') || '';
  const year = searchParams.get('year');
  const subject = searchParams.get('subject');
  const option = searchParams.get('option');
  const difficulty = searchParams.get('difficulty');

  try {
    // Use Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      let query = supabase
        .from('exams')
        .select('*', { count: 'exact' });

      // Apply filters
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

      // Order and paginate
      const { data: exams, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return NextResponse.json({
        exams: exams || [],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      });
    }

    // Fallback to sample data (demo mode)
    let filteredExams = [...SAMPLE_EXAMS];

    // Apply filters to sample data
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
  } catch (error) {
    console.error('Error fetching exams:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des examens' },
      { status: 500 }
    );
  }
}
