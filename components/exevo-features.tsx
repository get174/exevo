'use client';

import { motion } from 'framer-motion';
import {
  BookOpen,
  Brain,
  FileCheck2,
  Smartphone,
  Trophy,
  NotebookPen,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: BookOpen,
    title: 'Anciens examens',
    description: "Accède rapidement aux sujets d'années précédentes pour t'entraîner efficacement.",
  },
  {
    icon: Brain,
    title: 'Quiz interactifs',
    description: 'Teste tes connaissances avec des quiz dynamiques adaptés à ta section.',
  },
  {
    icon: FileCheck2,
    title: 'Corrigés détaillés',
    description: 'Comprends chaque solution avec des explications claires et structurées.',
  },
  {
    icon: NotebookPen,
    title: 'Simulation Exetat',
    description: 'Reproduis les conditions réelles de l’examen pour gagner en confiance.',
  },
  {
    icon: Trophy,
    title: 'Classement national',
    description: 'Compare tes performances avec des élèves de toute la RDC.',
  },
  {
    icon: Smartphone,
    title: 'Accessible sur mobile',
    description: 'Révise partout depuis ton smartphone Android, même en déplacement.',
  },
];

export function ExevoFeatures() {
  return (
    <section id="fonctionnalites" className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-24">
      <div className="mb-10 text-center md:mb-14">
        <h2 className="text-3xl font-black text-exevo-blue md:text-4xl dark:text-white">
          Fonctionnalités pensées pour la réussite
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
          Une expérience moderne, rapide et intuitive pour accompagner chaque élève vers la réussite
          à l’Exetat.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Card className="group h-full border-0 bg-white shadow-lg shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900 dark:shadow-none">
              <CardHeader>
                <div className="mb-3 inline-flex w-fit rounded-lg bg-orange-100 p-3 text-exevo-orange transition-colors group-hover:bg-exevo-orange group-hover:text-white dark:bg-orange-500/10">
                  <feature.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg text-exevo-blue dark:text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
