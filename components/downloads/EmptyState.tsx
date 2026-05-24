'use client';

import { motion } from 'framer-motion';
import { Download, Heart, Clock, FileText } from 'lucide-react';

interface EmptyStateProps {
  type: 'downloads' | 'favorites' | 'history';
  message: string;
}

const emptyStateConfig = {
  downloads: {
    icon: Download,
    title: 'Aucun téléchargement',
    description: 'Vos examens téléchargés apparaîtront ici.',
  },
  favorites: {
    icon: Heart,
    title: 'Aucun favori',
    description: 'Ajoutez des examens à vos favoris pour les retrouver facilement.',
  },
  history: {
    icon: Clock,
    title: 'Aucune activité',
    description: 'Votre historique d\'activité apparaîtra ici.',
  },
};

export function EmptyState({ type, message }: EmptyStateProps) {
  const config = emptyStateConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring' }}
        className="rounded-full bg-slate-100 dark:bg-slate-800 p-6 mb-4"
      >
        <Icon className="h-12 w-12 text-slate-400 dark:text-slate-600" />
      </motion.div>
      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">
        {config.title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[250px]">
        {config.description}
      </p>
    </motion.div>
  );
}
