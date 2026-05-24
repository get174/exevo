'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, RotateCcw, ChevronDown } from 'lucide-react';
import type { QuizFilters } from '@/types/quiz';
import { QUIZ_SUBJECTS, QUIZ_OPTIONS, QUIZ_DIFFICULTIES, DURATION_FILTERS } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface QuizFiltersProps {
  filters: QuizFilters;
  onFilterChange: (filters: QuizFilters) => void;
  onReset: () => void;
  className?: string;
}

export function QuizFilters({
  filters,
  onFilterChange,
  onReset,
  className,
}: QuizFiltersProps) {
  const [open, setOpen] = useState(false);

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== null && value !== ''
  ).length;

  const updateFilter = <K extends keyof QuizFilters>(
    key: K,
    value: QuizFilters[K]
  ) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const FilterContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={cn('space-y-6', isMobile && 'pb-8')}>
      {/* Matière */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Matière
        </label>
        <Select
          value={filters.subject || 'all'}
          onValueChange={(value) =>
            updateFilter('subject', value === 'all' ? null : value)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Toutes les matières" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les matières</SelectItem>
            {QUIZ_SUBJECTS.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Option */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Option
        </label>
        <Select
          value={filters.option || 'all'}
          onValueChange={(value) =>
            updateFilter('option', value === 'all' ? null : value)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Toutes les options" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les options</SelectItem>
            {QUIZ_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Difficulté */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Difficulté
        </label>
        <Select
          value={filters.difficulty || 'all'}
          onValueChange={(value) =>
            updateFilter('difficulty', value === 'all' ? null : value)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Toutes les difficultés" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les difficultés</SelectItem>
            {QUIZ_DIFFICULTIES.map((difficulty) => (
              <SelectItem key={difficulty} value={difficulty}>
                {difficulty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Durée */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Durée
        </label>
        <Select
          value={filters.duration || 'all'}
          onValueChange={(value) =>
            updateFilter('duration', value === 'all' ? null : value)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Toutes les durées" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les durées</SelectItem>
            {DURATION_FILTERS.map((duration) => (
              <SelectItem key={duration.value} value={duration.value}>
                {duration.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reset button */}
      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          onClick={onReset}
          className="w-full text-slate-600"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Réinitialiser les filtres
        </Button>
      )}
    </div>
  );

  return (
    <div className={className}>
      {/* Desktop Filters - Always visible */}
      <div className="hidden lg:block">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2">
            <Filter className="h-4 w-4 text-exevo-blue" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              Filtres
            </h3>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filters - Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="lg:hidden w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtres
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 min-w-5 items-center justify-center rounded-full px-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-exevo-blue" />
              Filtres
            </SheetTitle>
          </SheetHeader>
          <div className="px-4">
            <FilterContent isMobile />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
