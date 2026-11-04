import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

import { getFavoriteIds, saveFavoriteIds } from "../services/storageService";

interface FavoritesContextType {
  favorites: number[];
  isLoading: boolean;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const favoritesRef = useRef<number[]>([]);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let active = true;

    async function loadFavorites() {
      try {
        const saved = await getFavoriteIds();

        if (!active) return;

        favoritesRef.current = saved;
        setFavorites(saved);
      } catch (error) {
        console.error("Unable to load favorites:", error);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadFavorites();

    return () => {
      active = false;
    };
  }, []);

  const toggleFavorite = useCallback(async (id: number) => {
    const previous = favoritesRef.current;

    const updated = previous.includes(id)
      ? previous.filter((item) => item !== id)
      : [...previous, id];

    favoritesRef.current = updated;
    setFavorites(updated);

    saveQueue.current = saveQueue.current
      .catch(() => undefined)
      .then(() => saveFavoriteIds(updated));

    try {
      await saveQueue.current;
    } catch (error) {
      console.error("Unable to save favorites:", error);

      if (favoritesRef.current === updated) {
        favoritesRef.current = previous;
        setFavorites(previous);
      }
    }
  }, []);

  const isFavorite = useCallback(
    (id: number) => favorites.includes(id),
    [favorites],
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isLoading,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used inside FavoritesProvider");
  }

  return context;
}
