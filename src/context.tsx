import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { createId } from './ids';
import { loadMealLogs, saveMealLogs, sortLogsNewestFirst } from './storage';
import type { MealLog } from './types';

type MealLogContextValue = {
  logs: MealLog[];
  loading: boolean;
  error: string | null;
  getLog: (id: string) => MealLog | undefined;
  addLog: (input: Omit<MealLog, 'id' | 'createdAt' | 'updatedAt'>) => Promise<MealLog>;
  updateLog: (id: string, input: Omit<MealLog, 'id' | 'createdAt' | 'updatedAt'>) => Promise<MealLog>;
  deleteLog: (id: string) => Promise<void>;
};

const MealLogContext = createContext<MealLogContextValue | null>(null);

export function MealLogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<MealLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadMealLogs()
      .then((stored) => {
        if (!cancelled) {
          setLogs(sortLogsNewestFirst(stored));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Could not load saved logs on this device.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(async (next: MealLog[]) => {
    const sorted = sortLogsNewestFirst(next);
    setLogs(sorted);
    await saveMealLogs(sorted);
  }, []);

  const getLog = useCallback((id: string) => logs.find((log) => log.id === id), [logs]);

  const addLog = useCallback(
    async (input: Omit<MealLog, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const nextLog: MealLog = {
        ...input,
        id: createId('meal'),
        createdAt: now,
        updatedAt: now,
      };
      await persist([nextLog, ...logs]);
      return nextLog;
    },
    [logs, persist]
  );

  const updateLog = useCallback(
    async (id: string, input: Omit<MealLog, 'id' | 'createdAt' | 'updatedAt'>) => {
      const existing = logs.find((log) => log.id === id);
      if (!existing) {
        throw new Error('Meal log not found');
      }
      const nextLog: MealLog = {
        ...existing,
        ...input,
        id,
        updatedAt: new Date().toISOString(),
      };
      await persist(logs.map((log) => (log.id === id ? nextLog : log)));
      return nextLog;
    },
    [logs, persist]
  );

  const deleteLog = useCallback(
    async (id: string) => {
      await persist(logs.filter((log) => log.id !== id));
    },
    [logs, persist]
  );

  const value = useMemo(
    () => ({ logs, loading, error, getLog, addLog, updateLog, deleteLog }),
    [logs, loading, error, getLog, addLog, updateLog, deleteLog]
  );

  return <MealLogContext.Provider value={value}>{children}</MealLogContext.Provider>;
}

export function useMealLogs(): MealLogContextValue {
  const value = useContext(MealLogContext);
  if (!value) {
    throw new Error('useMealLogs must be used within MealLogProvider');
  }
  return value;
}
