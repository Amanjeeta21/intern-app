import { Stack } from "expo-router";
import { FavoritesProvider } from "../hooks/useFavorites";

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </FavoritesProvider>
  );
}
