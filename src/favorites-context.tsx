import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { createId } from './ids';
import { loadFavorites, saveFavorites, sortFavoritesByName } from './storage';
import type { FavoriteFood } from './types';

type FavoritesContextValue = {
  favorites: FavoriteFood[];
  loading: boolean;
  error: string | null;
  getFavorite: (id: string) => FavoriteFood | undefined;
  addFavorite: (input: Omit<FavoriteFood, 'id' | 'createdAt' | 'updatedAt'>) => Promise<FavoriteFood>;
  updateFavorite: (id: string, input: Omit<FavoriteFood, 'id' | 'createdAt' | 'updatedAt'>) => Promise<FavoriteFood>;
  deleteFavorite: (id: string) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteFood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadFavorites()
      .then((stored) => {
        if (!cancelled) {
          setFavorites(sortFavoritesByName(stored));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Could not load saved favorites on this device.');
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

  const persist = useCallback(async (next: FavoriteFood[]) => {
    const sorted = sortFavoritesByName(next);
    setFavorites(sorted);
    await saveFavorites(sorted);
  }, []);

  const getFavorite = useCallback((id: string) => favorites.find((item) => item.id === id), [favorites]);

  const addFavorite = useCallback(
    async (input: Omit<FavoriteFood, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const next: FavoriteFood = {
        ...input,
        id: createId('fav'),
        createdAt: now,
        updatedAt: now,
      };
      await persist([next, ...favorites]);
      return next;
    },
    [favorites, persist]
  );

  const updateFavorite = useCallback(
    async (id: string, input: Omit<FavoriteFood, 'id' | 'createdAt' | 'updatedAt'>) => {
      const existing = favorites.find((item) => item.id === id);
      if (!existing) {
        throw new Error('Favorite not found');
      }
      const next: FavoriteFood = {
        ...existing,
        ...input,
        id,
        updatedAt: new Date().toISOString(),
      };
      await persist(favorites.map((item) => (item.id === id ? next : item)));
      return next;
    },
    [favorites, persist]
  );

  const deleteFavorite = useCallback(
    async (id: string) => {
      await persist(favorites.filter((item) => item.id !== id));
    },
    [favorites, persist]
  );

  const value = useMemo(
    () => ({ favorites, loading, error, getFavorite, addFavorite, updateFavorite, deleteFavorite }),
    [favorites, loading, error, getFavorite, addFavorite, updateFavorite, deleteFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const value = useContext(FavoritesContext);
  if (!value) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return value;
}
