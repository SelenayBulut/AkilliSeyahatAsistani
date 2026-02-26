import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Linking,
  Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { getCityInfo } from "../services/aiService";
import { addFavorite } from "../storage/favoritesStorage"; // Favori ekleme importu

export default function AccommodationScreen({ route, navigation }: any) {
  const city = route?.params?.city || "Bilinmeyen Şehir";
  const category = route?.params?.category || "Konaklama";

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getAIRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCityInfo(city, category);
      if (response && Array.isArray(response)) {
        setData(response);
      } else {
        setError("Öneriler şu an alınamadı.");
      }
    } catch (e) {
      setError("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAIRecommendations();
  }, []);

  const handleAddFavorite = async (item: any) => {
    await addFavorite({
      city: item.title,
      image: item.imageUrl,
      description: item.description
    });
    Alert.alert("❤️", `${item.title} favorilere eklendi!`);
  };

  const openInMaps = (title: string) => {
    // Harita linkini düzelttim
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(title + " " + city)}`;
    Linking.openURL(url);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <LinearGradient colors={["#9333ea", "#ec4899"]} style={styles.header}>
          <Text style={styles.headerTitle}>{city} – {category}</Text>
          <Text style={styles.headerSub}>Gemini AI destekli rehberiniz</Text>
        </LinearGradient>

        <View style={styles.cardContainer}>
          <Text style={styles.sectionTitle}>{city} için en iyi {category.toLowerCase()}</Text>

          {loading && (
            <View style={styles.loadingArea}>
              <ActivityIndicator size="large" color="#9333ea" />
              <Text style={styles.loadingText}>Yapay zeka düşünüyor...</Text>
            </View>
          )}

          {!loading && data && data.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              {item.imageUrl && (
                <Image source={{ uri: item.imageUrl }} style={styles.itemImage} resizeMode="cover" />
              )}
              <View style={styles.itemInfo}>
                <View style={styles.titleRow}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  
                  {/* KALBİ BURAYA YERLEŞTİRDİK */}
                  <TouchableOpacity onPress={() => handleAddFavorite(item)}>
                    <Text style={{ fontSize: 24, color: '#e11d48' }}>❤️</Text>
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.itemDesc}>{item.description}</Text>

                <TouchableOpacity onPress={() => openInMaps(item.title)} style={styles.mapButton}>
                  <Text style={styles.mapLink}>📍 Haritalarda Gör</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* ALT BAR AYNI KALIR */}
    </View>
  );
}

// STYLES OBJESİ (Aşağıda tanımlı olması hata değil, TypeScript uyarısıdır)
const styles = StyleSheet.create({
  header: { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 20 },
  headerTitle: { color: "white", fontSize: 24, fontWeight: "bold" },
  headerSub: { color: "#fce7f3", marginTop: 4 },
  cardContainer: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  itemCard: { marginBottom: 20, backgroundColor: "white", borderRadius: 16, overflow: "hidden", elevation: 4 },
  itemImage: { width: "100%", height: 180 },
  itemInfo: { padding: 15 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  itemTitle: { fontSize: 17, fontWeight: "bold", flex: 1 },
  itemDesc: { fontSize: 14, color: "#64748b", lineHeight: 20 },
  loadingArea: { padding: 40, alignItems: "center" },
  loadingText: { marginTop: 10, color: "#9333ea" },
  mapButton: { marginTop: 12, paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#f3e8ff', borderRadius: 8, alignSelf: 'flex-start' },
  mapLink: { color: "#9333ea", fontWeight: "600", fontSize: 13 },
});