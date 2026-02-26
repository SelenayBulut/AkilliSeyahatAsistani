import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { getUser, getCredentials, saveCredentials } from "../storage/userStorage";

export default function ProfileScreen({ navigation }: any) {
  const [userData, setUserData] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const user = await getCredentials(); // Kayıtlı tüm bilgileri al
    setUserData(user);
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert("Hata", "Yeni şifre en az 6 karakter olmalıdır.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Hata", "Şifreler uyuşmuyor.");
      return;
    }

    const updatedData = { ...userData, password: newPassword };
    await saveCredentials(updatedData);
    Alert.alert("Başarılı", "Şifreniz güncellendi.");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogout = () => {
    navigation.replace("Login");
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={["#9333ea", "#ec4899"]} style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{userData?.fullName?.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.userName}>{userData?.fullName}</Text>
        <Text style={styles.userSub}>@{userData?.username}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Şifre Değiştir</Text>
        <TextInput
          placeholder="Yeni Şifre"
          style={styles.input}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          placeholder="Yeni Şifre Tekrar"
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity style={styles.updateButton} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Güncelle</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={[styles.buttonText, { color: "#ef4444" }]}>Oturumu Kapat</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { padding: 40, alignItems: "center", borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: "white", justifyContent: "center", alignItems: "center", marginBottom: 10 },
  avatarText: { fontSize: 32, fontWeight: "bold", color: "#9333ea" },
  userName: { color: "white", fontSize: 22, fontWeight: "bold" },
  userSub: { color: "rgba(255,255,255,0.8)", fontSize: 14 },
  content: { padding: 25 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#1e293b" },
  input: { backgroundColor: "white", padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: "#e2e8f0" },
  updateButton: { backgroundColor: "#9333ea", padding: 15, borderRadius: 12, alignItems: "center", marginTop: 5 },
  logoutButton: { marginTop: 30, padding: 15, borderRadius: 12, alignItems: "center", borderWidth: 1, borderColor: "#ef4444" },
  buttonText: { color: "white", fontWeight: "bold" }
});