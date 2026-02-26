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
  ScrollView
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { saveCredentials } from "../storage/userStorage";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
  console.log("Kayıt butonu basıldı"); // Terminalde bunu görüyor musun kontrol et

  if (!fullName.trim() || !username.trim() || !password.trim()) {
    Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert("Hata", "Şifreler eşleşmiyor.");
    return;
  }

  try {
    await saveCredentials({
      fullName: fullName,
      username: username,
      password: password
    });
    
    console.log("Kayıt başarılı, yönlendiriliyor...");
    
    Alert.alert(
      "Başarılı ✅", 
      "Hesabınız oluşturuldu. Giriş yapabilirsiniz.",
      [{ text: "Tamam", onPress: () => navigation.navigate("Login") }]
    );
  } catch (error) {
    console.log("Kayıt Hatası:", error);
    Alert.alert("Hata", "Kayıt sırasında bir sorun oluştu.");
  }
};

  return (
    <LinearGradient
      colors={["#4c1d95", "#9333ea", "#ec4899"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ width: "100%" }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={styles.title}>Yeni Hesap</Text>
            <Text style={styles.subtitle}>Maceraya katılmak için kayıt ol</Text>

            {/* FULL NAME */}
            <TextInput
              placeholder="Ad Soyad"
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
            />

            {/* USERNAME */}
            <TextInput
              placeholder="Kullanıcı Adı"
              placeholderTextColor="#999"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
            />

            {/* PASSWORD */}
            <TextInput
              placeholder="Şifre"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />

            {/* CONFIRM PASSWORD */}
            <TextInput
              placeholder="Şifre Tekrar"
              placeholderTextColor="#999"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
            />

            {/* KAYIT OL BUTONU */}
            <TouchableOpacity style={{ width: "100%" }} onPress={handleRegister}>
              <LinearGradient
                colors={["#10b981", "#059669"]}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Kayıt Ol</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* GERİ DÖNÜŞ */}
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>
                Zaten hesabın var mı? <Text style={styles.loginLinkBold}>Giriş Yap</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: "center", alignItems: "center", paddingVertical: 50 },
  card: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#4c1d95", marginBottom: 5 },
  subtitle: { color: "#666", marginBottom: 25, textAlign: "center" },
  input: {
    width: "100%",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    color: "#333",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 18 },
  loginLink: { marginTop: 20, color: "#555", fontSize: 14 },
  loginLinkBold: { color: "#9333ea", fontWeight: "bold" },
});