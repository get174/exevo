'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TimerStatus } from '@/types/simulation';

interface ExamTimerProps {
  totalSeconds: number;
  onTimeUp: () => void;
  paused?: boolean;
  onTick?: (remainingSeconds: number) => void;
}

export function ExamTimer({
  totalSeconds,
  onTimeUp,
  paused = false,
  onTick,
}: ExamTimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);

  // Reset when totalSeconds changes
  useEffect(() => {
    setRemaining(totalSeconds);
  }, [totalSeconds]);

  // Timer logic
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        const newValue = prev - 1;
        onTick?.(newValue);
        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [paused, onTimeUp, onTick]);

  const getStatus = (): TimerStatus => {
    if (remaining <= 60) return 'critical';
    if (remaining <= 120) return 'warning';
    return 'normal';
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const status = getStatus();

  const getStatusStyles = () => {
    switch (status) {
      case 'critical':
        return 'text-red-600 dark:text-red-400';
      case 'warning':
        return 'text-orange-500 dark:text-orange-400';
      default:
        return 'text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <motion.div
      className={cn(
        'flex items-center gap-2 rounded-lg px-4 py-2 font-mono',
        status === 'critical' && 'animate-pulse bg-red-50 dark:bg-red-950/30',
        getStatusStyles()
      )}
    >
      <ClockIcon className="h-5 w-5" />
      <span className="text-2xl font-bold tracking-wider">
        {formatTime(remaining)}
      </span>

      {status === 'critical' && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-sm text-red-600"
        >
          !
        </motion.span>
      )}
    </motion.div>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// =====================================================
// Compact Timer for Header
// =====================================================
interface CompactTimerProps {
  remainingSeconds: number;
}

export function CompactTimer({ remainingSeconds }: CompactTimerProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatus = () => {
    if (remainingSeconds <= 60) return 'critical';
    if (remainingSeconds <= 120) return 'warning';
    return 'normal';
  };

  const status = getStatus();

  return (
    <div
      className={cn(
        'font-mono text-lg font-bold',
        status === 'critical' && 'text-red-600 animate-pulse',
        status === 'warning' && 'text-orange-500',
        status === 'normal' && 'text-slate-600'
      )}
    >
      {formatTime(remainingSeconds)}
    </div>
  );
}

// =====================================================
// Timer Display with Controls
// =====================================================
interface TimerWithControlsProps {
  totalSeconds: number;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function TimerWithControls({
  totalSeconds,
  isRunning,
  onStart,
  onPause,
  onReset,
}: TimerWithControlsProps) {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && remaining > 0) {
      interval = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 0) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, remaining]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-4">
      <div className="font-mono text-3xl font-bold tracking-wider">
        {formatTime(remaining)}
      </div>

      <div className="flex gap-2">
        {!isRunning ? (
          <button
            onClick={onStart}
            className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Start
          </button>
        ) : (
          <button
            onClick={onPause}
            className="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
          >
            Pause
          </button>
        )}

        <button
          onClick={() => {
            setRemaining(totalSeconds);
            onReset();
          }}
          className="rounded-lg bg-slate-500 px-4 py-2 text-white hover:bg-slate-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
