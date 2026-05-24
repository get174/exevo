'use client';

import { useEffect, useRef, useCallback } from 'react';
import { AnswerOption } from '@/types/simulation';

const AUTOSAVE_INTERVAL = 30000; // 30 seconds
const STORAGE_KEY = 'exevo_simulation_state';

interface AutosaveState {
  candidateInfo: {
    name: string;
    firstname: string;
    code: string;
    sex: 'M' | 'F';
    option: string;
    province: string;
    school: string;
  };
  currentQuestion: number;
  answers: Record<number, AnswerOption>;
  timeRemaining: number;
  lastSaved: number;
}

export function useAutosave() {
  const stateRef = useRef<AutosaveState | null>(null);

  const saveState = useCallback((state: AutosaveState) => {
    try {
      stateRef.current = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Autosave failed:', error);
    }
  }, []);

  const loadState = useCallback((): AutosaveState | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Load state failed:', error);
    }
    return null;
  }, []);

  const clearState = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      stateRef.current = null;
    } catch (error) {
      console.error('Clear state failed:', error);
    }
  }, []);

  const hasSavedState = useCallback((): boolean => {
    return !!localStorage.getItem(STORAGE_KEY);
  }, []);

  return {
    saveState,
    loadState,
    clearState,
    hasSavedState,
  };
}
