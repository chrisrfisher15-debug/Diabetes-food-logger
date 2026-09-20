import AsyncStorage from '@react-native-async-storage/async-storage';

import type { FavoriteFood, MealLog } from './types';
import { isFavoriteFood, isMealLog } from './validation';

const STORAGE_KEY = '@diabetes-food-logger/meal-logs-v1';
const FAVORITES_KEY = '@diabetes-food-logger/favorites-v1';

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

export async function loadFavorites(): Promise<FavoriteFood[]> {
  const raw = await AsyncStorage.getItem(FAVORITES_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isFavoriteFood);
  } catch {
    return [];
  }
}

export async function saveFavorites(favorites: FavoriteFood[]): Promise<void> {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function sortFavoritesByName(favorites: FavoriteFood[]): FavoriteFood[] {
  return [...favorites].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
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
