import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/colors";

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.accent} />
      <Text style={styles.text}>Loading products...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  text: {
    color: Colors.muted,
    fontSize: 14,
  },
});
