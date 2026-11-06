import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "@product_catalog_favorites";

export async function getFavoriteIds(): Promise<number[]> {
  const stored = await AsyncStorage.getItem(FAVORITES_KEY);

  if (!stored) {
    return [];
  }

  const parsed: unknown = JSON.parse(stored);

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.filter(
    (id): id is number => typeof id === "number" && Number.isFinite(id),
  );
}

export async function saveFavoriteIds(ids: number[]): Promise<void> {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}
