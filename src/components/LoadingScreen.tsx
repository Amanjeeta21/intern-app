import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../context/ThemeContext";

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({
  message = "Loading products...",
}: LoadingScreenProps) {
  const { colors } = useAppTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
    },
    text: {
      color: colors.muted,
      fontSize: 14,
    },
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.accent} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}
