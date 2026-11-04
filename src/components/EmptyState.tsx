import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/colors";

interface EmptyStateProps {
  title: string;
  message: string;
}

export default function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>♡</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

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
    color: Colors.muted,
  },
  title: {
    color: Colors.text,
    fontSize: 19,
    fontWeight: "bold",
    marginTop: 12,
  },
  message: {
    color: Colors.muted,
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
});
