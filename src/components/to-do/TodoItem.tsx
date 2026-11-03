import { Pressable, StyleSheet, Text, View } from "react-native";

type TodoItemProps = {
  title: string;
  timestamp: string;
  done: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

export default function TodoItem({
  title,
  timestamp,
  done,
  onToggle,
  onDelete,
}: TodoItemProps) {
  return (
    <View
      style={[
        styles.container,
        done ? styles.completedContainer : styles.pendingContainer,
      ]}
    >
      <View style={styles.taskRow}>
        <Pressable
          style={[styles.checkbox, done && styles.checkedBox]}
          onPress={onToggle}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: done }}
        >
          {done && <Text style={styles.checkmark}>✓</Text>}
        </Pressable>

        <View style={styles.taskDetails}>
          <Text style={[styles.title, done && styles.completedText]}>
            {title}
          </Text>

          <Text style={[styles.timestamp, done && styles.completedTimestamp]}>
            Added: {timestamp}
          </Text>
        </View>

        <Pressable onPress={onDelete} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 9,
  },

  pendingContainer: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
  },

  completedContainer: {
    backgroundColor: "#E8F3E9",
    borderColor: "#C8DEC9",
  },

  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  checkbox: {
    width: 23,
    height: 23,
    borderWidth: 2,
    borderColor: "#777777",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  checkedBox: {
    backgroundColor: "#2E7D32",
    borderColor: "#2E7D32",
  },

  checkmark: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },

  taskDetails: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#263238",
  },

  completedText: {
    color: "#9CA3AF",
    textDecorationLine: "line-through",
    textDecorationColor: "#9CA3AF",
    opacity: 0.7,
  },

  timestamp: {
    fontSize: 11,
    color: "#888888",
    marginTop: 4,
  },

  completedTimestamp: {
    color: "#A3ADA4",
  },

  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },

  deleteText: {
    color: "#D32F2F",
    fontSize: 13,
    fontWeight: "600",
  },
});
