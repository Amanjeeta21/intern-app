import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { useAppTheme } from "../../context/ThemeContext";
import { useFavorites } from "../../hooks/useFavorites";

export default function TabsLayout() {
  const { favorites } = useFavorites();
  const { colors } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 65,
          paddingTop: 7,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        tabBarBadgeStyle: {
          backgroundColor: colors.accent,
          color: "#FFFFFF",
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
              color={focused ? colors.accent : colors.muted}
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
              color={focused ? colors.accent : colors.muted}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
