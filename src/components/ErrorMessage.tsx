import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../context/ThemeContext";

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  const { colors } = useAppTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    title: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "bold",
    },
    message: {
      color: colors.muted,
      fontSize: 14,
      textAlign: "center",
      marginTop: 10,
    },
    button: {
      backgroundColor: colors.accent,
      paddingHorizontal: 28,
      paddingVertical: 12,
      borderRadius: 8,
      marginTop: 20,
    },
    buttonText: {
      color: "#FFFFFF",
      fontWeight: "bold",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{message}</Text>

      <Pressable style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Try Again</Text>
      </Pressable>
    </View>
  );
}
