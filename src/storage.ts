import AsyncStorage from '@react-native-async-storage/async-storage';

import type { MealLog } from './types';
import { isMealLog } from './validation';

const STORAGE_KEY = '@diabetes-food-logger/meal-logs-v1';

export async function loadMealLogs(): Promise<MealLog[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isMealLog);
  } catch {
    return [];
  }
}

export async function saveMealLogs(logs: MealLog[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export function sortLogsNewestFirst(logs: MealLog[]): MealLog[] {
  return [...logs].sort((a, b) => {
    const timeDiff = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    if (timeDiff !== 0) {
      return timeDiff;
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}
