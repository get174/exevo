'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExamSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onSearch?: (value: string) => void;
}

export function ExamSearch({
  value,
  onChange,
  placeholder = "Rechercher un examen...",
  className,
  onSearch,
}: ExamSearchProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  // Debounce effect
  useEffect(() => {
    if (!hasChanged) return;

setIsLoading(true);
    const timer = setTimeout(() => {
      onChange(localValue);
      onSearch?.(localValue);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, hasChanged, onChange, onSearch]);

  // Sync external value
  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value);
    }
  }, [value]);

  const handleClear = () => {
    setLocalValue('');
    setHasChanged(true);
    onChange('');
    onSearch?.('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    setHasChanged(true);
  };

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          type="text"
          value={localValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="h-11 rounded-xl border-slate-200 pl-10 pr-10 dark:border-slate-700"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
          ) : localValue ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// Skeleton for loading state
export function ExamSearchSkeleton() {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        <Search className="h-4 w-4 text-slate-300" />
      </div>
      <div className="h-11 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}
