'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Crown,
  FileText,
  Gauge,
  LogOut,
  Medal,
  Settings,
  UserCircle2,
  ClipboardCheck,
  Trophy,
  X,
  GraduationCap,
  Download,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/lib/supabase';

type DashboardSidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
};

const menuItems = [
  { label: 'Tableau de bord', href: '/dashboard', icon: Gauge },
  { label: 'Anciens examens', href: '/dashboard/exams', icon: FileText },
  { label: 'Quiz', href: '/dashboard/quiz', icon: ClipboardCheck },
  { label: 'Simulations', href: '/dashboard/simulations', icon: Trophy },
  { label: 'Classement', href: '/dashboard/leaderboard', icon: Medal },
  { label: 'Téléchargements', href: '/dashboard/downloads', icon: Download },
  { label: 'Profil', href: '/dashboard/profile', icon: UserCircle2 },
  { label: 'Paramètres', href: '/dashboard/settings', icon: Settings },
];

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [profile, setProfile] = useState<{ full_name: string; option: string } | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!supabase) {
        setIsLoadingProfile(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          setIsLoadingProfile(false);
          return;
        }

        const res = await fetch('/api/profile', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoadingProfile(false);
      }
    }

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Sign out from Supabase
      if (supabase) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }

      toast.success('Déconnexion réussie');

      // Redirect to home page
      router.push('/');
      router.refresh();

      // Close sidebar if open
      onItemClick?.();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Erreur lors de la déconnexion');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 p-4 dark:border-slate-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-lg bg-exevo-orange p-2 text-white shadow-lg shadow-orange-500/30">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-xl font-black text-exevo-blue dark:text-white">Exevo</span>
        </Link>
      </div>

      <div className="border-b border-slate-200 p-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11 border border-slate-200 dark:border-slate-700">
            <AvatarFallback className="bg-exevo-blue text-white">
              {isLoadingProfile ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : profile?.full_name ? (
                profile.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
              ) : (
                'GM'
              )}
            </AvatarFallback>
          </Avatar>
          <div>
            {isLoadingProfile ? (
              <div className="space-y-1">
                <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-3 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            ) : (
              <>
                <p className="text-sm font-bold">{profile?.full_name || 'Utilisateur'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {profile?.option || 'Exetat 2026'}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                active
                  ? 'bg-exevo-blue text-white shadow-lg shadow-slate-400/20'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-slate-200 p-4 dark:border-slate-800">
        <Button className="w-full bg-exevo-orange text-white hover:bg-exevo-light-orange">
          <Crown className="mr-2 h-4 w-4" />
          Passer Premium
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:hover:bg-red-900/20"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Se déconnecter?</AlertDialogTitle>
              <AlertDialogDescription>
                Vous serez redirigé vers la page d&apos;accueil. Vous pourrez vous reconnecter à tout moment.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-red-500 hover:bg-red-600"
              >
                {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export function DashboardSidebar({ mobileOpen, onClose }: DashboardSidebarProps) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white lg:block dark:border-slate-800 dark:bg-slate-900">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:hidden"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            >
              <div className="flex items-center justify-end p-3">
                <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fermer le menu">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <SidebarContent onItemClick={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
