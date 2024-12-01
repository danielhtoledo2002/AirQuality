import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      navigation.replace("Login");
      console.log("User signed up:", user);
    } catch (error) {
      if (error.code === "auth/weak-password") {
        setErrorMessage("Password must be at least 6 characters long.");
      } else if (error.code === "auth/missing-password") {
        setErrorMessage("Password is missing.");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("Invalid email address.");
      } else if (error.code === "auth/email-already-in-use") {
        navigation.replace("Login");
        console.log("User already exists:", error.message);
      } else {
        console.error("Error signing up:", error.message);
        throw error; // Terminate the app for more serious errors
      }
    } finally {
      if (!errorMessage) {
        setErrorMessage("");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ready Yourself For a Healthier Life</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <TouchableOpacity
        style={styles.loginButton}
        title="Create Account"
        onPress={handleLogin}
      >
        <Text style={styles.loginText}>Create Account</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.signInText}>Already have an account? Sign In</Text>
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
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 20,
  },
  signInText: {
    color: "#32CD32",
    fontSize: 14,
    marginTop: 20,
  },
});

export default SignUpScreen;
