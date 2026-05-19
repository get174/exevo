'use client';

import { motion } from 'framer-motion';
import { Beaker, BookOpenText, BriefcaseBusiness, HeartPulse, Settings2, Shapes } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const sectionCards = [
  { icon: Beaker, title: 'Scientifique', exams: 2450, color: 'from-blue-500 to-cyan-500' },
  { icon: BriefcaseBusiness, title: 'Commerciale', exams: 1680, color: 'from-emerald-500 to-green-500' },
  { icon: BookOpenText, title: 'Littéraire', exams: 1210, color: 'from-violet-500 to-fuchsia-500' },
  { icon: Shapes, title: 'Pédagogie', exams: 980, color: 'from-amber-500 to-orange-500' },
  { icon: HeartPulse, title: 'Nutrition', exams: 760, color: 'from-rose-500 to-pink-500' },
  { icon: Settings2, title: 'Technique', exams: 1390, color: 'from-slate-600 to-slate-800' },
];

export function ExevoSections() {
  return (
    <section id="sections" className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-24">
      <div className="mb-10 text-center md:mb-14">
        <h2 className="text-3xl font-black text-exevo-blue md:text-4xl dark:text-white">
          Sections disponibles
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
          Choisis ta section et accède immédiatement aux examens adaptés à ton programme.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sectionCards.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
          >
            <Card className="overflow-hidden border-0 shadow-lg shadow-slate-200/60 transition-transform duration-300 hover:-translate-y-1 dark:shadow-none">
              <div className={`h-2 w-full bg-gradient-to-r ${section.color}`} />
              <CardContent className="p-6">
                <div className="mb-4 inline-flex rounded-lg bg-slate-100 p-3 text-exevo-blue dark:bg-slate-800 dark:text-white">
                  <section.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-exevo-blue dark:text-white">{section.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {section.exams.toLocaleString('fr-FR')} examens disponibles
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
