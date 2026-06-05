'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, ChevronRight, RotateCcw, Home, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { BubbleButton, AnswerOptionButton } from '@/components/simulation/bubble-button';
import { CodeCandidatGrid } from '@/components/simulation/code-candidat-grid';
import { QuestionNavigator } from '@/components/simulation/question-navigator';
import { ExamTimer } from '@/components/simulation/exam-timer';
import { ItemSheet } from '@/components/simulation/item-sheet';
import { CorrectionView } from '@/components/simulation/correction-view';
import { useExamTimer } from '@/hooks/use-exam-timer';
import { useAutosave } from '@/hooks/use-autosave';
import {
  AnswerOption,
  CandidateInfo,
  SimulationQuestion,
  SAMPLE_QUESTIONS,
  DEFAULT_EXAM_CONFIG,
  DRC_PROVINCES,
  EXETAT_OPTIONS,
} from '@/types/simulation';
import { supabase } from '@/lib/supabase';

type Step = 'identification' | 'instructions' | 'exam' | 'results';

export default function SimulationPage() {
  const [step, setStep] = useState<Step>('identification');
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo | null>(null);
  const [questions, setQuestions] = useState<SimulationQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, AnswerOption>>({});
  const [hasReadInstructions, setHasReadInstructions] = useState(false);
  const [simulationId, setSimulationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const startTimeRef = useRef<number>(0);

  const totalTime = DEFAULT_EXAM_CONFIG.totalTimeMinutes * 60;
  const timer = useExamTimer({
    initialSeconds: totalTime,
    onTimeUp: handleTimeUp,
    autoStart: step === 'exam',
  });

  const autosave = useAutosave();

  function handleTimeUp() {
    finishExam();
  }

  const finishExam = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase!.auth.getSession();

      if (session?.access_token && simulationId) {
        const timeUsed = Math.floor((Date.now() - startTimeRef.current) / 1000);

        // Calculate results
        let correctCount = 0;
        let wrongCount = 0;
        let blankCount = 0;

        questions.forEach((q) => {
          const answer = answers[q.questionNumber];
          if (!answer) {
            blankCount++;
          } else if (answer === q.correctAnswer) {
            correctCount++;
          } else {
            wrongCount++;
          }
        });

        const score = (correctCount / questions.length) * 100;

        // Save results
        await fetch('/api/simulations/results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            simulationId,
            score,
            correctCount,
            wrongCount,
            blankCount,
            timeUsedSeconds: timeUsed,
          }),
        });

        // Update simulation status to completed
        await fetch('/api/simulations', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            id: simulationId,
            status: 'completed',
            ended_at: new Date().toISOString(),
          }),
        });
      }
    } catch (error) {
      console.error('Error saving results:', error);
    }
    setIsLoading(false);
    setStep('results');
  }, [simulationId, questions, answers]);

  useEffect(() => {
    if (step !== 'exam') return;
    const interval = setInterval(async () => {
      autosave.saveState({
        candidateInfo: candidateInfo!,
        currentQuestion,
        answers,
        timeRemaining: timer.remainingSeconds,
        lastSaved: Date.now(),
      });

      // Autosave answers to database
      if (simulationId) {
        const { data: { session } } = await supabase!.auth.getSession();
        if (session?.access_token) {
          const answersArray = Object.entries(answers).map(([num, ans]) => ({
            question_id: parseInt(num),
            selected_answer: ans,
          }));

          await fetch('/api/simulations', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              id: simulationId,
              status: 'in_progress',
              answers: answersArray,
            }),
          });
        }
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [step, autosave, candidateInfo, currentQuestion, answers, timer.remainingSeconds, simulationId]);

  const handleStartExam = async () => {
    if (!candidateInfo || !hasReadInstructions) return;

    setIsLoading(true);
    let newSimulationId: string | null = null;

    try {
      const { data: { session } } = await supabase!.auth.getSession();

      if (session?.access_token) {
        // Create simulation in database
        const response = await fetch('/api/simulations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            candidate_name: candidateInfo.name,
            candidate_firstname: candidateInfo.firstname,
            candidate_code: candidateInfo.code,
            sex: candidateInfo.sex,
            option: candidateInfo.option,
            province: candidateInfo.province,
            school: candidateInfo.school,
          }),
        });

        const data = await response.json();
        if (data.id) {
          newSimulationId = data.id;
          setSimulationId(data.id);
        }
      }
    } catch (error) {
      console.error('Error creating simulation:', error);
    }

    const examQuestions: SimulationQuestion[] = SAMPLE_QUESTIONS.map((q, i) => ({
      ...q,
      id: `q-${i + 1}`,
      simulationId: newSimulationId || 'demo',
    }));
    setQuestions(examQuestions);
    startTimeRef.current = Date.now();
    setIsLoading(false);
    setStep('exam');
  };

  const handleAnswer = (answer: AnswerOption) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: answer }));
  };

  const handleQuestionClick = (num: number) => {
    setCurrentQuestion(num);
  };

  const handleSubmit = () => {
    finishExam();
  };

  const handleRestart = () => {
    setStep('identification');
    setCandidateInfo(null);
    setAnswers({});
    setCurrentQuestion(1);
    setHasReadInstructions(false);
    setSimulationId(null);
    timer.reset();
  };

  if (step === 'identification') {
    return <IdentificationStep onComplete={(info) => { setCandidateInfo(info); setStep('instructions'); }} />;
  }

  if (step === 'instructions') {
    return (
      <InstructionsStep
        candidateInfo={candidateInfo!}
        onBack={() => setStep('identification')}
        hasReadInstructions={hasReadInstructions}
        onReadChange={setHasReadInstructions}
        onStart={handleStartExam}
      />
    );
  }

  if (step === 'exam') {
    const currentQ = questions.find((q) => q.questionNumber === currentQuestion);
    if (!currentQ) return null;

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">Simulation Exetat</h1>
              <p className="text-sm text-slate-500">{candidateInfo?.name} {candidateInfo?.firstname}</p>
            </div>
            <ExamTimer totalSeconds={timer.remainingSeconds} onTimeUp={handleTimeUp} paused={!timer.isRunning} />
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid gap-6 lg:grid-cols-[240px_1fr_280px]">
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <QuestionNavigator totalQuestions={questions.length} currentQuestion={currentQuestion} answers={answers} onQuestionClick={handleQuestionClick} />
              </div>
            </aside>

            <main className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">Question {currentQuestion} sur {questions.length}</span>
                  <span className="text-sm text-slate-500">{Object.keys(answers).length} répondue(s)</span>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{currentQ.questionText}</h2>
                </div>

                <div className="space-y-3">
                  {(['A', 'B', 'C', 'D', 'E'] as AnswerOption[]).map((option) => (
                    <AnswerOptionButton key={option} option={option} text={currentQ.options[option]} selected={answers[currentQuestion] === option} onClick={() => handleAnswer(option)} />
                  ))}
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" disabled={currentQuestion === 1} onClick={() => setCurrentQuestion((q) => q - 1)}>Précédent</Button>
                  {currentQuestion < questions.length ? (
                    <Button onClick={() => setCurrentQuestion((q) => q + 1)}>Suivant <ChevronRight className="ml-2 h-4 w-4" /></Button>
                  ) : (
                    <Button className="bg-exevo-orange hover:bg-exevo-light-orange" onClick={handleSubmit}>Terminer</Button>
                  )}
                </div>
              </motion.div>
            </main>

            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <ItemSheet questions={questions} answers={answers} currentQuestion={currentQuestion} onQuestionClick={handleQuestionClick} />
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'results') {
    const timeUsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
        <div className="mx-auto max-w-4xl space-y-6">
          <CorrectionView questions={questions} answers={answers} timeUsedSeconds={timeUsed} />
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => window.location.href = '/dashboard'}><Home className="mr-2 h-4 w-4" />Retour au tableau de bord</Button>
            <Button onClick={handleRestart}><RotateCcw className="mr-2 h-4 w-4" />Nouvelle simulation</Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function IdentificationStep({ onComplete }: { onComplete: (info: CandidateInfo) => void }) {
  const [form, setForm] = useState({ name: '', firstname: '', code: '', sex: 'M' as 'M' | 'F', option: '', province: '', school: '' });
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ ...form, code });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="mb-6 text-2xl font-black text-exevo-blue">Identification du candidat</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="mb-1 block text-sm font-medium">Nom</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-800" placeholder="MBAYO" /></div>
            <div><label className="mb-1 block text-sm font-medium">Prénom</label><input required value={form.firstname} onChange={(e) => setForm({ ...form, firstname: e.target.value })} className="w-full rounded-lg border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-800" placeholder="Grâce" /></div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="mb-1 block text-sm font-medium">Sexe</label>
              <select value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value as 'M' | 'F' })} className="w-full rounded-lg border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-800">
                <option value="M">Masculin</option><option value="F">Féminin</option>
              </select>
            </div>
            <div><label className="mb-1 block text-sm font-medium">Option</label>
              <select required value={form.option} onChange={(e) => setForm({ ...form, option: e.target.value })} className="w-full rounded-lg border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-800">
                <option value="">Sélectionner...</option>
                {EXETAT_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="mb-1 block text-sm font-medium">Province</label>
              <select required value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} className="w-full rounded-lg border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-800">
                <option value="">Sélectionner...</option>
                {DRC_PROVINCES.map((prov) => <option key={prov} value={prov}>{prov}</option>)}
              </select>
            </div>
            <div><label className="mb-1 block text-sm font-medium">École</label><input required value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} className="w-full rounded-lg border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-800" placeholder="NOM DE L'ÉCOLE" /></div>
          </div>
          <div><label className="mb-2 block text-sm font-medium">Code candidat</label><CodeCandidatGrid code={code} onCodeChange={setCode} /></div>
          <Button type="submit" className="w-full bg-exevo-blue text-white">Continuer <ChevronRight className="ml-2 h-4 w-4" /></Button>
        </form>
      </motion.div>
    </div>
  );
}

function InstructionsStep({ candidateInfo, onBack, hasReadInstructions, onReadChange, onStart }: { candidateInfo: CandidateInfo; onBack: () => void; hasReadInstructions: boolean; onReadChange: (v: boolean) => void; onStart: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="mb-4 text-2xl font-black text-exevo-blue">Consignes</h1>
        <div className="mb-6 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{candidateInfo.name} {candidateInfo.firstname}</p>
          <p className="text-sm text-slate-500">{candidateInfo.option} - {candidateInfo.province}</p>
          <p className="text-sm text-slate-500">{candidateInfo.school}</p>
        </div>
        <ul className="mb-6 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" />Lire attentivement chaque question</li>
          <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" />Éviter les erreurs de noircissement</li>
          <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" />Temps disponible: {DEFAULT_EXAM_CONFIG.totalTimeMinutes} minutes</li>
          <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" />{DEFAULT_EXAM_CONFIG.totalQuestions} questions à répondure</li>
          <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" />Réponses modifiables avant soumission</li>
        </ul>
        <label className="mb-6 flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={hasReadInstructions} onChange={(e) => onReadChange(e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
<span className="text-sm font-medium">J&apos;ai lu les consignes</span>
        </label>
        <div className="flex gap-4">
          <Button variant="outline" onClick={onBack} className="flex-1">Retour</Button>
          <Button onClick={onStart} disabled={!hasReadInstructions} className="flex-1 bg-exevo-blue">Commencer simulation</Button>
        </div>
      </motion.div>
    </div>
  );
}
