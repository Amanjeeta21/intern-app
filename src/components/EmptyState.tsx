import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../context/ThemeContext";

interface EmptyStateProps {
  title: string;
  message: string;
}

export default function EmptyState({ title, message }: EmptyStateProps) {
  const { colors } = useAppTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 30,
      minHeight: 280,
    },
    icon: {
      fontSize: 65,
      color: colors.muted,
    },
    title: {
      color: colors.text,
      fontSize: 19,
      fontWeight: "bold",
      marginTop: 12,
    },
    message: {
      color: colors.muted,
      fontSize: 13,
      textAlign: "center",
      marginTop: 8,
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>♡</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}
