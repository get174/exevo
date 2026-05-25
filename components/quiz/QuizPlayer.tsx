'use client';

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { QuizQuestion, AnswerOption, getResultMessage } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface QuizPlayerProps {
  quiz: {
    id: string;
    title: string;
    duration_minutes: number;
    questions_count: number;
  };
  questions: QuizQuestion[];
  onComplete: (results: {
    score: number;
    correct_count: number;
    wrong_count: number;
    time_spent_seconds: number;
  }) => void;
  onQuit: () => void;
}

export function QuizPlayer({ quiz, questions, onComplete, onQuit }: QuizPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerOption>>({});
  const [showCorrection, setShowCorrection] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz.duration_minutes * 60);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());

const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  const handleFinish = useCallback(() => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    let correctCount = 0;
    let wrongCount = 0;

    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct_answer) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const score = Math.round((correctCount / totalQuestions) * 100);
    setIsComplete(true);

    // Clear saved progress
    localStorage.removeItem(`quiz_${quiz.id}_progress`);

    onComplete({
      score,
      correct_count: correctCount,
      wrong_count: wrongCount,
      time_spent_seconds: timeSpent,
    });
  }, [answers, questions, totalQuestions, startTime, onComplete, quiz.id]);

  // Timer - handleFinish is stable due to useCallback deps
  useEffect(() => {
    if (isComplete || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete, timeLeft]);

  // Auto-save progress to localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`quiz_${quiz.id}_progress`);
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setAnswers(parsed.answers || {});
      setCurrentIndex(parsed.currentIndex || 0);
    }
  }, [quiz.id]);

  useEffect(() => {
    localStorage.setItem(`quiz_${quiz.id}_progress`, JSON.stringify({
      answers,
      currentIndex,
    }));
  }, [answers, currentIndex, quiz.id]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (answer: AnswerOption) => {
    if (showCorrection) return;
    setAnswers({ ...answers, [currentIndex]: answer });
  };

  const handleNext = () => {
    if (!showCorrection) {
      // Show correction before going to next
      setShowCorrection(true);
    } else if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowCorrection(false);
    } else {
      handleFinish();
    }
  };

const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowCorrection(false);
    }
  };

  const getOptionStyle = (option: AnswerOption) => {
    const isSelected = answers[currentIndex] === option;
    const isCorrect = currentQuestion?.correct_answer === option;

    if (showCorrection) {
      if (isCorrect) {
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      }
      if (isSelected && !isCorrect) {
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      }
    }

    if (isSelected) {
      return 'border-exevo-blue bg-exevo-blue/10 dark:bg-exevo-blue/20';
    }

    return 'border-slate-200 dark:border-slate-700';
  };

  if (isComplete) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onQuit}>
            <X className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">
              {quiz.title}
            </h2>
            <p className="text-sm text-slate-500">
              Question {currentIndex + 1} sur {totalQuestions}
            </p>
          </div>
        </div>

        <div className={cn(
          'flex items-center gap-2 rounded-lg px-3 py-1.5',
          timeLeft < 60 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-slate-100 dark:bg-slate-800'
        )}>
          <Clock className="h-4 w-4" />
          <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
        >
          <p className="mb-6 text-lg font-medium text-slate-900 dark:text-slate-100">
            {currentQuestion?.question_text}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {(['A', 'B', 'C', 'D'] as AnswerOption[]).map((option) => {
              const optionText = currentQuestion?.[`option_${option.toLowerCase()}` as keyof QuizQuestion];
              
              return (
                <button
                  key={option}
                  onClick={() => handleSelectAnswer(option)}
                  disabled={showCorrection}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg border-2 p-4 text-left transition-all',
                    getOptionStyle(option),
                    !showCorrection && 'hover:border-exevo-blue hover:bg-exevo-blue/5'
                  )}
                >
                  <Badge 
                    variant="outline" 
                    className={cn(
                      'h-8 w-8 justify-center',
                      answers[currentIndex] === option && 'bg-exevo-blue text-white border-exevo-blue',
                      showCorrection && currentQuestion?.correct_answer === option && 'bg-green-500 text-white border-green-500',
                      showCorrection && answers[currentIndex] === option && currentQuestion?.correct_answer !== option && 'bg-red-500 text-white border-red-500'
                    )}
                  >
                    {option}
                  </Badge>
                  <span className="flex-1 font-medium text-slate-900 dark:text-slate-100">
                    {optionText}
                  </span>
                  {showCorrection && currentQuestion?.correct_answer === option && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {showCorrection && answers[currentIndex] === option && currentQuestion?.correct_answer !== option && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showCorrection && currentQuestion?.explanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 rounded-lg bg-exevo-cream p-4 dark:bg-slate-800"
              >
                <p className="mb-2 font-semibold text-exevo-orange">Explication</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {currentQuestion.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Précédent
        </Button>

        <div className="flex gap-2">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                'h-2 w-2 rounded-full transition-colors',
                idx === currentIndex 
                  ? 'bg-exevo-blue' 
                  : answers[idx] 
                    ? 'bg-exevo-orange' 
                    : 'bg-slate-200 dark:bg-slate-700'
              )}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={!answers[currentIndex] && !showCorrection}
          className="bg-exevo-blue hover:bg-exevo-blue/90"
        >
          {showCorrection 
            ? (currentIndex === totalQuestions - 1 ? 'Terminer' : 'Suivant') 
            : 'Vérifier'
          }
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
