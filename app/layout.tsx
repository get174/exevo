import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ExetatApp | Prépare ton Exetat intelligemment',
  description:
    "Plateforme éducative congolaise de préparation à l'Exetat : anciens examens, corrigés et simulations dans une expérience moderne.",
  keywords: [
    'ExetatApp',
    'Exetat',
    'RDC',
    'République Démocratique du Congo',
    'éducation',
    'examens',
    'préparation',
    'startup EdTech',
  ],
  openGraph: {
    title: 'ExetatApp | Prépare ton Exetat intelligemment',
    description:
      "Tous les anciens examens, corrigés et simulations Exetat réunis dans une seule plateforme moderne.",
    siteName: 'ExetatApp',
    locale: 'fr_CD',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ExetatApp | Prépare ton Exetat intelligemment',
    description:
      "La plateforme éducative congolaise moderne pour réussir l'Exetat.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
