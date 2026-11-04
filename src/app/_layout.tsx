import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Colors } from "../constants/colors";
import { FavoritesProvider, useFavorites } from "../hooks/useFavorites";

function AppTabs() {
  const { favorites } = useFavorites();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.muted,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: Colors.border,
          height: 65,
          paddingTop: 7,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Products",
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name="grid-outline"
              color={focused ? Colors.accent : Colors.muted}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarBadge: favorites.length > 0 ? favorites.length : undefined,
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name="heart-outline"
              color={focused ? Colors.accent : Colors.muted}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="product/[id]"
        options={{
          href: null,
          title: "Product Details",
        }}
      />
    </Tabs>
  );
}

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <AppTabs />
    </FavoritesProvider>
  );
}
