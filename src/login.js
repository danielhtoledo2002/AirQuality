import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      console.log("User signed in:", user);
    } catch (error) {
      if (error.code === "auth/weak-password") {
        setErrorMessage("Password is not long enough.");
      } else if (error.code === "auth/missing-password") {
        setErrorMessage("Password is missing.");
      } else if (error.code === "auth/invalid-credential") {
        setErrorMessage("Invalid credentials provided.");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("Invalid email address.");
      } else {
        console.error("Error signing in:", error.message);
        throw error;
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Respira Hondo!</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <TouchableOpacity
        style={styles.loginButton}
        title="Login"
        onPress={handleLogin}
      >
        <Text style={styles.loginText}>Inicia Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.signButton}
        title="Sign Up"
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={styles.signText}>¿No Tienes Cuenta? Registrate</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "up",
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  input: {
    borderColor: "#32CD32",
    borderWidth: 4,
    borderRadius: 20,
    fontSize: 16,
    fontWeight: "bold",
    paddingLeft: 10,
    height: 40,
    width: 250,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#32CD32",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    marginBottom: 30,
  },
  signButton: {
    backgroundColor: "#fff",
    marginTop: 15,
  },
  signText: {
    color: "#32CD32",
    fontSize: 14,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 20,
  },
});

export default LoginScreen;
