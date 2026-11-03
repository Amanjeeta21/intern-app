import { useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlaygroundScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [count, setCount] = useState(0);
  const [loginCount, setLoginCount] = useState(0);

  useEffect(() => {
    console.log("Email changed:", email);
  }, [email]);

  const handleLogin = () => {
    const newCount = loginCount + 1;

    setLoginCount(newCount);

    Alert.alert("Login Successful", `Login: ${newCount}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.logo}>QUANTEK</Text>

        <Text style={styles.heading}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Login to continue</Text>

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        <Pressable
          style={[
            styles.button,
            (!email.trim() || !password.trim()) && styles.disabledButton,
          ]}
          disabled={!email.trim() || !password.trim()}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>

        <Text style={styles.forgotPassword}>Forgot password?</Text>

        <Text style={styles.counterHeading}>Counter</Text>

        <View style={styles.counterContainer}>
          <Pressable
            style={styles.counterButton}
            onPress={() => setCount(count - 1)}
          >
            <Text style={styles.counterText}>-</Text>
          </Pressable>

          <Text style={styles.count}>{count}</Text>

          <Pressable
            style={styles.counterButton}
            onPress={() => setCount(count + 1)}
          >
            <Text style={styles.counterText}>+</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    padding: 25,
  },
  loginContainer: {
    width: "100%",
    alignItems: "center",
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2563EB",
    marginBottom: 35,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#777777",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  button: {
    width: "100%",
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#9CA3AF",
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#2563EB",
    marginTop: 20,
    fontSize: 14,
  },
  counterHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    gap: 25,
  },
  counterButton: {
    backgroundColor: "#2563EB",
    width: 45,
    height: 45,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  counterText: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "bold",
  },
  count: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
