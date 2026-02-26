import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert, // Alert ekledik
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import CustomDropdown from "../components/CustomDropdown";

export default function SmartPlannerScreen({ navigation }: any) {
  const [city, setCity] = useState("");
  const [days, setDays] = useState("");

  const cityList = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Muğla"];
  const dayList = ["1 Gün", "2 Gün", "3 Gün", "4 Gün", "5 Gün", "6 Gün", "7 Gün"];

  // Plan oluşturma tetikleyici
  const handleCreatePlan = () => {
    if (!city || !days) {
      Alert.alert("Eksik Bilgi", "Lütfen bir şehir ve kalacağınız gün sayısını seçin. 😊");
      return;
    }

    // Seçilen bilgileri PlanResultScreen'e gönderiyoruz (Bu ekranı birazdan yapacağız)
    navigation.navigate("PlanResult", {
      selectedCity: city,
      selectedDays: days.split(' ')[0], // "3 Gün" -> "3" olarak gönderir
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <ScrollView style={{ flex: 1 }}>
        <LinearGradient colors={["#9333ea", "#ec4899"]} style={styles.header}>
          <Text style={styles.headerTitle}>✨ Akıllı Gezi Planlayıcı</Text>
          <Text style={styles.headerSubtitle}>
            Yapay zeka destekli kişisel seyahat planı
          </Text>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🧭 Seyahat Planınızı Oluşturun</Text>
          <Text style={styles.cardText}>
            Merhaba! Hangi şehri ziyaret etmek istersiniz?
          </Text>

          <CustomDropdown
            label="📍 Şehir Seçin"
            items={cityList}
            value={city}
            onSelect={setCity}
          />

          <CustomDropdown
            label="📅 Kaç Gün Kalacaksınız?"
            items={dayList}
            value={days}
            onSelect={setDays}
          />

          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={handleCreatePlan} // Fonksiyonu buraya bağladık
          >
            <LinearGradient colors={["#ec4899", "#9333ea"]} style={styles.button}>
              <Text style={styles.buttonText}>✨ Akıllı Plan Oluştur</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Nasıl Çalışır?</Text>
          <Text style={styles.infoItem}>• Ziyaret etmek istediğiniz şehri seçin</Text>
          <Text style={styles.infoItem}>• Kalacağınız süreyi belirtin</Text>
          <Text style={styles.infoItem}>
            • Yapay zeka sizin için özel gezi planı oluşturacak
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ALT BAR (Sabit) */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.tabIcon}>🏠</Text>
          <Text style={styles.tabLabel}>Ana Sayfa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Favorites")}>
          <Text style={[styles.tabIcon, { color: "#e11d48" }]}>❤️</Text>
          <Text style={styles.tabLabel}>Favoriler</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles kısmın zaten çok iyi olduğu için aynen koruyabilirsin.
// Sadece bir iki küçük düzeltme (margin/padding) yeterli olur.
const styles = StyleSheet.create({
  header: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20 },
  headerTitle: { color: "white", fontSize: 22, fontWeight: "bold" },
  headerSubtitle: { color: "white", marginTop: 4, opacity: 0.9 },
  card: { backgroundColor: "white", margin: 20, padding: 20, borderRadius: 18, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  cardTitle: { fontWeight: "bold", fontSize: 18, color: '#1e293b' },
  cardText: { color: "#64748b", marginTop: 6, marginBottom: 14 },
  button: { paddingVertical: 14, borderRadius: 14, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  infoCard: { marginHorizontal: 20, marginBottom: 40, padding: 20, borderRadius: 14, backgroundColor: "#fdf2f8" },
  infoTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 10, color: '#9d174d' },
  infoItem: { color: "#be185d", marginBottom: 6, fontSize: 14 },
  tabBar: { height: 70, backgroundColor: "white", borderTopWidth: 1, borderColor: "#f1f5f9", flexDirection: "row", justifyContent: "space-around", alignItems: "center", position: "absolute", bottom: 0, width: "100%" },
  tabItem: { alignItems: "center" },
  tabIcon: { fontSize: 22 },
  tabLabel: { fontSize: 12, color: '#64748b' },
});