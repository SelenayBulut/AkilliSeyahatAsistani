import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Alert,
  Dimensions
} from "react-native";
import { getFavorites, removeFavorite, getSavedPlans } from "../storage/favoritesStorage";

const { width } = Dimensions.get("window");

export default function FavoritesScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState("mekanlar"); // "mekanlar" veya "planlar"
  const [favorites, setFavorites] = useState<any[]>([]);
  const [savedPlans, setSavedPlans] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const favs = await getFavorites();
    const plans = await getSavedPlans();
    setFavorites(favs);
    setSavedPlans(plans);
  };

  const handleRemoveFavorite = async (title: string) => {
    Alert.alert("Emin misin?", "Bu mekanı favorilerden kaldırmak istiyor musun?", [
      { text: "Vazgeç" },
      { text: "Kaldır", onPress: async () => {
          await removeFavorite(title);
          loadData();
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      {/* ŞIK SEKME (TAB) TASARIMI */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "mekanlar" && styles.activeTab]} 
          onPress={() => setActiveTab("mekanlar")}
        >
          <Text style={[styles.tabText, activeTab === "mekanlar" && styles.activeTabText]}>📍 Mekanlar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === "planlar" && styles.activeTab]} 
          onPress={() => setActiveTab("planlar")}
        >
          <Text style={[styles.tabText, activeTab === "planlar" && styles.activeTabText]}>🗺️ Planlar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {activeTab === "mekanlar" ? (
          // MEKANLAR LİSTESİ
          favorites.length > 0 ? (
            favorites.map((item, index) => (
              <View key={index} style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{item.city}</Text>
                  <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                  <TouchableOpacity onPress={() => handleRemoveFavorite(item.city)} style={styles.removeBtn}>
                    <Text style={styles.removeBtnText}>Kaldır</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Henüz favori mekanın yok knk 🥲</Text>
          )
        ) : (
          // PLANLAR LİSTESİ
          savedPlans.length > 0 ? (
            savedPlans.map((plan, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.planCard}
                onPress={() => navigation.navigate("PlanResult", { 
                  selectedCity: plan.city, 
                  selectedDays: plan.details.length.toString(),
                  preloadedPlan: plan.details // PlanResultScreen'i buna göre güncelleyeceğiz
                })}
              >
                <View style={styles.planIconBg}>
                  <Text style={{fontSize: 24}}>📝</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.planTitle}>{plan.city} Gezi Planı</Text>
                  <Text style={styles.planDate}>{plan.date} tarihinde oluşturuldu</Text>
                </View>
                <Text style={styles.chevron}>→</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>Henüz kayıtlı bir planın yok knk 🗺️</Text>
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  tabContainer: { flexDirection: "row", padding: 15, backgroundColor: "white", elevation: 2 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center", borderRadius: 10 },
  activeTab: { backgroundColor: "#f3e8ff", borderBottomWidth: 2, borderBottomColor: "#9333ea" },
  tabText: { fontWeight: "bold", color: "#64748b" },
  activeTabText: { color: "#9333ea" },
  card: { backgroundColor: "white", marginHorizontal: 15, marginTop: 15, borderRadius: 15, overflow: "hidden", elevation: 3 },
  cardImage: { width: "100%", height: 150 },
  cardInfo: { padding: 15 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#1e293b" },
  cardDesc: { color: "#64748b", marginVertical: 5 },
  removeBtn: { alignSelf: "flex-end", padding: 5 },
  removeBtnText: { color: "#ef4444", fontWeight: "bold" },
  planCard: { backgroundColor: "white", marginHorizontal: 15, marginTop: 12, padding: 15, borderRadius: 12, flexDirection: "row", alignItems: "center", elevation: 2 },
  planIconBg: { width: 50, height: 50, backgroundColor: "#f3e8ff", borderRadius: 25, justifyContent: "center", alignItems: "center", marginRight: 15 },
  planTitle: { fontSize: 16, fontWeight: "bold", color: "#1e293b" },
  planDate: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  chevron: { fontSize: 20, color: "#cbd5e1" },
  emptyText: { textAlign: "center", marginTop: 50, color: "#94a3b8" }
});