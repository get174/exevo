'use client';

import { Bell, Menu, Moon, Search, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type DashboardHeaderProps = {
  onOpenMobileMenu: () => void;
};

export function DashboardHeader({ onOpenMobileMenu }: DashboardHeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === 'dark';

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="flex flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenMobileMenu}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="relative hidden flex-1 sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Rechercher un examen, un quiz..."
              className="h-10 rounded-xl border-slate-200 pl-9 dark:border-slate-700"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              className="rounded-full"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label="Changer le thème"
            >
              {mounted ? (
                isDark ? (
                  <Sun className="h-4 w-4 text-exevo-orange" />
                ) : (
                  <Moon className="h-4 w-4 text-exevo-blue" />
                )
              ) : (
                <Moon className="h-4 w-4 text-exevo-blue" />
              )}
            </Button>

            <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-700">
              <AvatarFallback className="bg-exevo-blue text-white">GM</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div>
          <p className="text-base font-black text-exevo-blue dark:text-white sm:text-lg">Bonjour Grâce 👋</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">Prêt pour réussir ton Exetat ?</p>
        </div>
      </div>
    </header>
  );
}
