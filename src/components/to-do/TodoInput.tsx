import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import AppButton from "../AppButton";

type TodoInputProps = {
  onAddTodo: (title: string) => void;
};

export default function TodoInput({ onAddTodo }: TodoInputProps) {
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (title.trim() === "") return;

    onAddTodo(title.trim());
    setTitle("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Add a new task..."
        value={title}
        onChangeText={setTitle}
      />

      <AppButton title="Add" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: "#FFFFFF",
  },
});
