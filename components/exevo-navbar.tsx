'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { GraduationCap, Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export function ExevoNavbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };
  const navItems = [
    { label: 'Accueil', href: '#accueil' },
    { label: 'Fonctionnalités', href: '#fonctionnalites' },
    { label: 'Sections', href: '#sections' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="sticky top-0 z-50 border-b border-white/10 bg-white/70 backdrop-blur-md dark:bg-slate-950/60"
    >
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-lg bg-exevo-orange p-2 text-white shadow-lg shadow-orange-500/30">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-exevo-blue dark:text-white">
            ExetatApp
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-700 transition-colors hover:text-exevo-orange dark:text-slate-200"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="ghost"
            className="font-semibold"
            onClick={toggleTheme}
            aria-label="Basculer le thème"
          >
            {mounted ? (
              isDark ? (
                <Sun className="mr-2 h-4 w-4 text-exevo-orange" />
              ) : (
                <Moon className="mr-2 h-4 w-4 text-exevo-blue" />
              )
            ) : (
              <Moon className="mr-2 h-4 w-4 text-exevo-blue" />
            )}
            {mounted ? (isDark ? 'Mode clair' : 'Mode sombre') : 'Thème'}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login">Connexion</Link>
          </Button>
          <Button className="bg-exevo-orange text-white hover:bg-exevo-light-orange" asChild>
            <Link href="/register">Inscription</Link>
          </Button>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </Button>
      </nav>
    </motion.header>
  );
}
