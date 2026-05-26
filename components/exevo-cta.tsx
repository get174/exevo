'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function ExevoCTA() {
  return (
    <section className="px-4 py-16 md:px-6 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-5xl rounded-3xl bg-gradient-to-r from-exevo-orange to-exevo-light-orange p-8 text-center text-white shadow-2xl shadow-orange-500/30 md:p-12"
      >
        <h2 className="text-3xl font-black md:text-4xl">
          Commence ta préparation dès aujourd’hui.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-orange-50 md:text-base">
          Rejoins ExetatApp et progresse avec les meilleurs contenus de révision Exetat en RDC.
        </p>
        <Button
          size="lg"
          variant="secondary"
          className="mt-6 bg-white font-bold text-exevo-orange hover:bg-orange-50"
          asChild
        >
          <Link href="/register">Créer un compte gratuitement</Link>
        </Button>
      </motion.div>
    </section>
  );
}
