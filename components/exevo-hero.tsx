'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpenCheck, School, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const stats = [
  { icon: BookOpenCheck, label: 'examens', value: '+10 000' },
  { icon: Users, label: 'élèves', value: '+5 000' },
  { icon: School, label: 'écoles', value: '+200' },
];

export function ExevoHero() {
  return (
    <section id="accueil" className="relative overflow-hidden px-4 pb-16 pt-14 md:px-6 md:pb-24 md:pt-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-orange-400/20 blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="space-y-6"
        >
          <span className="inline-flex rounded-full border border-orange-300 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-exevo-orange dark:border-orange-500/40 dark:bg-orange-500/10">
            Startup EdTech congolaise
          </span>
          <h1 className="text-balance text-4xl font-black leading-tight text-exevo-blue md:text-5xl lg:text-6xl dark:text-white">
            Prépare ton Exetat intelligemment.
          </h1>
          <p className="max-w-xl text-base text-slate-600 md:text-lg dark:text-slate-300">
            Tous les anciens examens, corrigés et simulations Exetat réunis dans une seule
            plateforme moderne.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="bg-exevo-orange text-white hover:bg-exevo-light-orange"
              asChild
            >
              <Link href="/register">
                Commencer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#sections">Voir les examens</Link>
            </Button>
          </div>

          <div className="grid gap-3 pt-2 sm:grid-cols-3">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
              >
                <Card className="border-0 bg-white/70 p-4 shadow-md shadow-slate-200/60 backdrop-blur-sm dark:bg-slate-900/60 dark:shadow-none">
                  <div className="mb-2 inline-flex rounded-lg bg-orange-100 p-2 text-exevo-orange dark:bg-orange-500/10">
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <p className="text-xl font-bold text-exevo-blue dark:text-white">{stat.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-300">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <Card className="overflow-hidden border-0 bg-white/80 p-2 shadow-2xl shadow-slate-300/40 dark:bg-slate-900/80">
            <div className="relative rounded-xl bg-gradient-to-br from-exevo-blue via-slate-800 to-exevo-orange p-8 text-white">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
                  <p className="mb-2 text-xs uppercase tracking-wide text-orange-200">Étudiant</p>
                  <div className="h-24 rounded-lg bg-white/20" />
                </div>
                <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
                  <p className="mb-2 text-xs uppercase tracking-wide text-orange-200">Mobile App</p>
                  <div className="h-24 rounded-lg bg-white/20" />
                </div>
              </div>
              <p className="mt-5 text-sm text-orange-50/90">
                Illustration moderne : étudiants africains utilisant smartphone et ordinateur.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
