import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../auth/AuthProvider";
import ScreenContainer from "../utils/ScreenContainer";

export default function Login() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const success = await login(username, password);
    if (!success) setError("Credenciais inválidas");
  };

  return (
    <ScreenContainer>
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Usuário"
          value={username}
          onChangeText={setUsername}
          backgroundColor="black"
          placeholderTextColor={"#ddd"}
          color="white"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          backgroundColor="black"
          placeholderTextColor={"#ddd"}
          color="white"
        />
        <Button title="Entrar" color="#2a9d8f" onPress={handleLogin} />
        <View style={styles.button}>
          <Button
            title="Cadastrar"
            color="#2a9d8f"
            onPress={() => navigation.navigate("Register")}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    width: "90%",
    maxWidth: 400,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: "#ccc",
  },
  error: { color: "red", marginBottom: 10, textAlign: "center" },
  button: { marginTop: 10 },
});
