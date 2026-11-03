import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TodoInput from "../components/to-do/TodoInput";
import TodoItem from "../components/to-do/TodoItem";

type Todo = {
  id: string;
  title: string;
  done: boolean;
  timestamp: string;
};

export default function HomeScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleAddTodo = (title: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      done: false,
      timestamp: new Date().toLocaleString(),
    };

    setTodos((currentTodos) => [...currentTodos, newTodo]);
  };

  const handleToggleTodo = (id: string) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  };

  const pendingCount = todos.filter((todo) => !todo.done).length;

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>My To-Do List</Text>

      <View style={styles.dateCard}>
        <Text style={styles.dateLabel}>TODAY</Text>
        <Text style={styles.dateText}>{today}</Text>
      </View>

      <View style={styles.pendingCard}>
        <Text style={styles.pendingLabel}>Tasks Pending</Text>
        <Text style={styles.pendingCount}>{pendingCount}</Text>
      </View>

      <TodoInput onAddTodo={handleAddTodo} />

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {todos.length === 0 ? (
          <Text style={styles.emptyText}>
            No tasks yet. Add your first task!
          </Text>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              title={todo.title}
              timestamp={todo.timestamp}
              done={todo.done}
              onToggle={() => handleToggleTodo(todo.id)}
              onDelete={() => handleDeleteTodo(todo.id)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  heading: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#263B5E",
    textAlign: "center",
    marginBottom: 16,
  },
  dateCard: {
    backgroundColor: "#263B5E",
    padding: 14,
    borderRadius: 10,
  },
  dateLabel: {
    color: "#C9D6E8",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  dateText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
  pendingCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E8EDF5",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  pendingLabel: {
    fontSize: 14,
    color: "#263B5E",
    fontWeight: "600",
  },
  pendingCount: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#263B5E",
  },
  list: {
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 25,
    fontSize: 14,
    color: "#888888",
  },
});
