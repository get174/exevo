'use client';

import { motion } from 'framer-motion';
import { CircleUserRound, ListChecks, Rocket } from 'lucide-react';
import { Card } from '@/components/ui/card';

const steps = [
  {
    icon: CircleUserRound,
    title: '1. Crée un compte',
    description: 'Inscris-toi gratuitement en quelques secondes avec ton email et ton téléphone.',
  },
  {
    icon: ListChecks,
    title: '2. Choisis ta section',
    description: 'Sélectionne ta filière (Scientifique, Commerciale, Littéraire, etc.) pour personnaliser.',
  },
  {
    icon: Rocket,
    title: '3. Commence à réviser',
    description: 'Accède aux examens, corrigés et simulations et progresse chaque jour.',
  },
];

export function ExevoHowItWorks() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-24">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-black text-exevo-blue md:text-4xl dark:text-white">
          Comment ça marche
        </h2>
      </div>

      <div className="relative grid gap-5 md:grid-cols-3">
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 hidden h-[2px] -translate-y-1/2 bg-gradient-to-r from-transparent via-orange-300 to-transparent md:block" />
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
          >
            <Card className="relative h-full border-0 bg-white p-6 text-center shadow-lg shadow-slate-200/60 dark:bg-slate-900 dark:shadow-none">
              <div className="mx-auto mb-4 inline-flex rounded-full bg-orange-100 p-3 text-exevo-orange dark:bg-orange-500/10">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-exevo-blue dark:text-white">{step.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{step.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
