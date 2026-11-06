import { Stack } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";
import { FavoritesProvider } from "../hooks/useFavorites";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </FavoritesProvider>
    </ThemeProvider>
  );
}
