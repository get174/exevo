import { ExevoNavbar } from '@/components/exevo-navbar';
import { ExevoHero } from '@/components/exevo-hero';
import { ExevoFeatures } from '@/components/exevo-features';
import { ExevoHowItWorks } from '@/components/exevo-how-it-works';
import { ExevoSections } from '@/components/exevo-sections';
import { ExevoCTA } from '@/components/exevo-cta';
import { ExevoFooter } from '@/components/exevo-footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-orange-50/40 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <ExevoNavbar />
      <ExevoHero />
      <ExevoFeatures />
      <ExevoHowItWorks />
      <ExevoSections />
      <ExevoCTA />
      <ExevoFooter />
    </main>
  );
}
