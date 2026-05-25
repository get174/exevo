'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Quiz, QuizQuestion } from '@/types/quiz';
import { QuizPlayer } from '@/components/quiz/QuizPlayer';
import { QuizResults } from '@/components/quiz/QuizResults';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface QuizPageProps {
  params: Promise<{ id: string }>;
}

export default function QuizPlayPage({ params }: QuizPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<{
    score: number;
    correct_count: number;
    wrong_count: number;
    time_spent_seconds: number;
  } | null>(null);

  // Fetch quiz and questions
  useEffect(() => {
    const fetchData = async () => {
      const { id } = await params;
      
      setIsLoading(true);
      try {
        // Fetch quiz details
        const quizResponse = await fetch(`/api/quiz/${id}`);
        const quizData = await quizResponse.json();
        
        if (quizData.error) {
          toast({
            title: 'Erreur',
            description: 'Quiz non trouvé',
            variant: 'destructive',
          });
          router.push('/dashboard/quiz');
          return;
        }
        
        setQuiz(quizData);
        
        // Fetch questions
        const questionsResponse = await fetch(`/api/quiz/${id}/questions`);
        const questionsData = await questionsResponse.json();
        
        setQuestions(questionsData.questions || []);
      } catch (error) {
        console.error('Error fetching quiz:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger le quiz',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params, router, toast]);

  // Handle completion
  const handleComplete = useCallback(async (resultsData: {
    score: number;
    correct_count: number;
    wrong_count: number;
    time_spent_seconds: number;
  }) => {
    setResults(resultsData);

    // Save result to API
    if (quiz && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }

        await fetch('/api/quiz/results', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            quiz_id: quiz.id,
            ...resultsData,
          }),
        });
      } catch (error) {
        console.error('Error saving result:', error);
      }
    }
  }, [quiz]);

  // Handle quit
  const handleQuit = () => {
    router.push('/dashboard/quiz');
  };

  // Handle retry
  const handleRetry = () => {
    setResults(null);
  };

  // Handle home
  const handleHome = () => {
    router.push('/dashboard/quiz');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-exevo-blue" />
          <p className="mt-4 text-slate-500">Chargement du quiz...</p>
        </motion.div>
      </div>
    );
  }

  // No quiz found
  if (!quiz) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-500">Quiz non trouvé</p>
      </div>
    );
  }

  // Show results if completed
  if (results) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <QuizResults
          quiz={quiz}
          results={results}
          onRetry={handleRetry}
          onHome={handleHome}
        />
      </div>
    );
  }

  // Show player
  return (
    <div className="min-h-screen bg-slate-50 py-6 dark:bg-slate-950">
      <QuizPlayer
        quiz={{
          id: quiz.id,
          title: quiz.title,
          duration_minutes: quiz.duration_minutes,
          questions_count: quiz.questions_count,
        }}
        questions={questions}
        onComplete={handleComplete}
        onQuit={handleQuit}
      />
      <Toaster />
    </div>
  );
}
