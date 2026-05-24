'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CodeCandidatGridProps {
  code: string;
  onCodeChange: (code: string) => void;
  disabled?: boolean;
  length?: number;
}

export function CodeCandidatGrid({
  code,
  onCodeChange,
  disabled = false,
  length = 5,
}: CodeCandidatGridProps) {
  const [positions, setPositions] = useState<number[]>(
    code ? code.split('').map(Number) : Array(length).fill(-1)
  );

  // Update positions when code changes externally
  useEffect(() => {
    if (code) {
      setPositions(code.split('').map(Number));
    }
  }, [code]);

  const handleDigitClick = (digit: number, position: number) => {
    if (disabled) return;

    const newPositions = [...positions];
    newPositions[position] = digit === newPositions[position] ? -1 : digit;
    setPositions(newPositions);

    // Filter out -1 (empty) positions and join
    const newCode = newPositions
      .filter((d) => d !== -1)
      .join('');
    onCodeChange(newCode);
  };

  return (
    <div className="space-y-4">
      {/* Code Display - Shows selected digits as bubbles */}
      <div className="flex flex-wrap gap-2">
        {positions.map((digit, index) => (
          <div
            key={index}
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-full border-2 text-xl font-bold transition-all',
              digit === -1
                ? 'border-dashed border-slate-300 bg-slate-50 text-slate-300'
                : 'border-exevo-blue bg-exevo-blue text-white',
              disabled && 'opacity-50'
            )}
          >
            {digit === -1 ? '○' : digit}
          </div>
        ))}
      </div>

      {/* Digit Selection Grid */}
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 10 }, (_, i) => (
          <button
            key={i}
            onClick={() => {
              // Find first empty position or replace first position
              const emptyPos = positions.findIndex((d) => d === -1);
              if (emptyPos !== -1) {
                handleDigitClick(i, emptyPos);
              } else if (positions.length > 0) {
                handleDigitClick(i, 0);
              }
            }}
            disabled={disabled || positions.every((d) => d !== -1)}
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-lg border-2 text-lg font-bold transition-all',
              positions.includes(i)
                ? 'border-exevo-blue bg-exevo-blue text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-exevo-blue hover:bg-exevo-cream',
              (disabled || positions.every((d) => d !== -1)) &&
                'cursor-not-allowed opacity-50'
            )}
          >
            {i}
          </button>
        ))}
      </div>

      {/* Clear Button */}
      {positions.some((d) => d !== -1) && !disabled && (
        <button
          onClick={() => {
            setPositions(Array(length).fill(-1));
            onCodeChange('');
          }}
          className="text-sm text-slate-500 hover:text-exevo-orange"
        >
          Effacer le code
        </button>
      )}
    </div>
  );
}

// =====================================================
// Simple Code Display (for review)
// =====================================================
interface CodeDisplayProps {
  code: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CodeDisplay({ code, size = 'md' }: CodeDisplayProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-xl',
  };

  return (
    <div className="flex gap-1">
      {code.split('').map((digit, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className={cn(
            'flex items-center justify-center rounded-full bg-exevo-blue font-bold text-white',
            sizeClasses[size]
          )}
        >
          {digit}
        </motion.div>
      ))}
    </div>
  );
}

// =====================================================
// Code Input with individual digit selection
// =====================================================
interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function CodeInput({ value, onChange, disabled }: CodeInputProps) {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const digits = value.padEnd(5, '').slice(0, 5).split('');

  const handleDigitChange = (digit: string, index: number) => {
    if (!/^\d*$/.test(digit)) return;

    const newDigits = [...digits];
    newDigits[index] = digit;
    onChange(newDigits.join('').slice(0, 5));
  };

  return (
    <div className="flex gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleDigitChange(e.target.value, index)}
          onFocus={() => setFocusedIndex(index)}
          disabled={disabled}
          className={cn(
            'flex h-14 w-14 items-center justify-center rounded-lg border-2 text-center text-2xl font-bold outline-none transition-all',
            digit
              ? 'border-exevo-blue bg-exevo-blue text-white'
              : 'border-slate-300 bg-white text-slate-600 focus:border-exevo-blue',
            disabled && 'opacity-50'
          )}
        />
      ))}
    </div>
  );
}
