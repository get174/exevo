'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { PROVINCES, SCHOOL_OPTIONS, PERIODS, type LeaderboardFilters } from '@/types/leaderboard';

interface LeaderboardFiltersProps {
  filters: LeaderboardFilters;
  onFiltersChange: (filters: LeaderboardFilters) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export function LeaderboardFiltersComponent({
  filters,
  onFiltersChange,
  onRefresh,
  isLoading,
}: LeaderboardFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<LeaderboardFilters>(filters);

  const activeFiltersCount = [
    filters.province,
    filters.option,
    filters.period !== 'all',
  ].filter(Boolean).length;

  const updateFilter = <K extends keyof LeaderboardFilters>(
    key: K,
    value: LeaderboardFilters[K]
  ) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    const resetFilters: LeaderboardFilters = {
      province: null,
      school: null,
      option: null,
      period: 'all',
      search: '',
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  return (
    <div className="space-y-4">
      {/* Main Search Bar and Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Rechercher un élève..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-9 h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          />
        </div>

        {/* Filter Toggle Button */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={`h-11 rounded-xl ${showFilters ? 'bg-exevo-blue text-white border-exevo-blue' : ''}`}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filtres
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-exevo-orange text-white text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {/* Refresh Button */}
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={isLoading}
          className="h-11 rounded-xl"
        >
          <RotateCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Expandable Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-slate-200 dark:border-slate-700">
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Province Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Province
                    </label>
                    <Select
                      value={filters.province || 'all'}
                      onValueChange={(value) =>
                        updateFilter('province', value === 'all' ? null : value)
                      }
                    >
                      <SelectTrigger className="h-10 rounded-lg">
                        <SelectValue placeholder="Toutes les provinces" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les provinces</SelectItem>
                        {PROVINCES.map((province) => (
                          <SelectItem key={province} value={province}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Option Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Option
                    </label>
                    <Select
                      value={filters.option || 'all'}
                      onValueChange={(value) =>
                        updateFilter('option', value === 'all' ? null : value)
                      }
                    >
                      <SelectTrigger className="h-10 rounded-lg">
                        <SelectValue placeholder="Toutes les options" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les options</SelectItem>
                        {SCHOOL_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Period Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Période
                    </label>
                    <Select
                      value={filters.period}
                      onValueChange={(value: LeaderboardFilters['period']) =>
                        updateFilter('period', value)
                      }
                    >
                      <SelectTrigger className="h-10 rounded-lg">
                        <SelectValue placeholder="Sélectionner une période" />
                      </SelectTrigger>
                      <SelectContent>
                        {PERIODS.map((period) => (
                          <SelectItem key={period.value} value={period.value}>
                            {period.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Reset Button */}
                  <div className="flex items-end">
                    <Button
                      variant="ghost"
                      onClick={resetFilters}
                      className="h-10 w-full text-slate-500 hover:text-slate-700 dark:text-slate-400"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Réinitialiser
                    </Button>
                  </div>
                </div>

                {/* Active Filters Tags */}
                {(filters.province || filters.option || filters.period !== 'all') && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Filtres actifs :
                    </span>
                    {filters.province && (
                      <Badge
                        variant="secondary"
                        className="bg-exevo-blue/10 text-exevo-blue cursor-pointer hover:bg-exevo-blue/20"
                        onClick={() => updateFilter('province', null)}
                      >
                        {filters.province}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    )}
                    {filters.option && (
                      <Badge
                        variant="secondary"
                        className="bg-exevo-orange/10 text-exevo-orange cursor-pointer hover:bg-exevo-orange/20"
                        onClick={() => updateFilter('option', null)}
                      >
                        {filters.option}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    )}
                    {filters.period !== 'all' && (
                      <Badge
                        variant="secondary"
                        className="bg-green-500/10 text-green-600 cursor-pointer hover:bg-green-500/20"
                        onClick={() => updateFilter('period', 'all')}
                      >
                        {PERIODS.find((p) => p.value === filters.period)?.label}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
