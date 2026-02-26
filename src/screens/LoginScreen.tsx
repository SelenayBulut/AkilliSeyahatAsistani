import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { saveUser, getCredentials } from "../storage/userStorage";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = async () => {
    if (!username.trim() || !pass.trim()) {
      Alert.alert("Eksik Bilgi", "Lütfen tüm alanları doldurun.");
      return;
    }

    const credentials = await getCredentials();

    if (!credentials) {
      Alert.alert("Hesap Bulunamadı", "Önce kayıt olmanız gerekiyor.");
      return;
    }

    if (username !== credentials.username || pass !== credentials.password) {
      Alert.alert("Hatalı Giriş", "Kullanıcı adı veya şifre yanlış.");
      return;
    }

    // Giriş başarılı, kullanıcı bilgisini kaydet ve Home'a git
    await saveUser({ name: username });
    navigation.replace("Home");
  };

  return (
    <LinearGradient
      colors={["#4c1d95", "#9333ea", "#ec4899"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ width: "100%", alignItems: "center" }}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Seyahat Rehberi</Text>
          <Text style={styles.subtitle}>Dünyayı keşfet</Text>

          <Text style={styles.sectionTitle}>Giriş Yap</Text>
          <Text style={styles.sectionSubtext}>Hesabınıza giriş yapın</Text>

          <TextInput
            placeholder="Kullanıcı Adı"
            placeholderTextColor="#999"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />

          <TextInput
            placeholder="Şifre"
            placeholderTextColor="#999"
            secureTextEntry
            value={pass}
            onChangeText={setPass}
            style={styles.input}
          />

          <TouchableOpacity style={{ width: "100%" }} onPress={handleLogin}>
            <LinearGradient
              colors={["#4f46e5", "#9333ea"]}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Giriş Yap</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.signupText}>
              Hesabınız yok mu?{" "}
              <Text style={{ color: "#9333ea", fontWeight: "bold" }}>Kayıt olun</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#4c1d95", marginTop: 10 },
  subtitle: { color: "#666", marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "bold" },
  sectionSubtext: { color: "#666", marginBottom: 15 },
  input: {
    width: "100%",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    color: "#333"
  },
  button: { width: "100%", paddingVertical: 12, borderRadius: 12, alignItems: "center", marginTop: 8 },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  signupText: { marginTop: 15, fontSize: 14, color: "#555" },
});