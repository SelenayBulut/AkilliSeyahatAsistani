import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  Alert 
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { getTravelPlan } from "../services/aiService";
// Yeni eklediğimiz kayıt fonksiyonunu import ediyoruz
import { saveTravelPlan } from "../storage/favoritesStorage";

export default function PlanResultScreen({ route, navigation }: any) {
  const { selectedCity, selectedDays, preloadedPlan } = route.params;
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<any[]>([]);

  useEffect(() => {
    // Eğer favorilerden tıklandıysa (preloadedPlan varsa) AI'ya sorma, direkt yükle
    if (preloadedPlan) {
      setPlan(preloadedPlan);
      setLoading(false);
    } else {
      fetchPlan();
    }
  }, []);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const data = await getTravelPlan(selectedCity, selectedDays);
      
      if (data && Array.isArray(data)) {
        setPlan(data);
      } else {
        Alert.alert(
          "Hata", 
          "Plan oluşturulamadı. Lütfen model ismini veya internet bağlantınızı kontrol edin.",
          [{ text: "Tamam", onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      console.error("Fetch hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  // Favorilere Kaydetme Fonksiyonu
  const handleSavePlan = async () => {
    const success = await saveTravelPlan(plan, selectedCity);
    if (success) {
      Alert.alert(
        "Başarılı ✅", 
        `${selectedCity} planı favorilerine eklendi!`,
        [
          { text: "Tamam", onPress: () => navigation.navigate("Favorites") }
        ]
      );
    } else {
      Alert.alert("Hata", "Plan kaydedilirken bir sorun oluştu.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#9333ea" />
        <Text style={styles.loadingText}>Yapay zeka rotanı çiziyor... 🗺️</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={["#9333ea", "#ec4899"]} style={styles.header}>
        <Text style={styles.headerTitle}>{selectedCity} Gezi Planı</Text>
        <Text style={styles.headerSub}>{selectedDays} Günlük Macera</Text>
      </LinearGradient>

      <View style={styles.contentPadding}>
        {plan.length > 0 ? (
          plan.map((item, index) => (
            <View key={index} style={styles.dayCard}>
              <View style={styles.dayBadge}>
                <Text style={styles.dayBadgeText}>{item.gun}. GÜN</Text>
              </View>
              <Text style={styles.dayTitle}>{item.baslik}</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailText}>
                  <Text style={styles.emoji}>🌅</Text> 
                  <Text style={styles.boldText}> Sabah:</Text> {item.aktiviteler?.sabah}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailText}>
                  <Text style={styles.emoji}>☀️</Text> 
                  <Text style={styles.boldText}> Öğle:</Text> {item.aktiviteler?.ogle}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailText}>
                  <Text style={styles.emoji}>🌙</Text> 
                  <Text style={styles.boldText}> Akşam:</Text> {item.aktiviteler?.aksam}
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <Text style={styles.footerInfo}>🍴 <Text style={styles.boldText}>Yemek:</Text> {item.yemek}</Text>
              <Text style={styles.footerInfo}>🏨 <Text style={styles.boldText}>Konaklama:</Text> {item.konaklama}</Text>
            </View>
          ))
        ) : (
          <View style={styles.center}>
             <Text style={styles.noDataText}>Gösterilecek plan bulunamadı.</Text>
          </View>
        )}
      </View>
      
      {/* Güncellenen Buton Kısmı */}
      {plan.length > 0 && (
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSavePlan}
        >
          <Text style={styles.saveButtonText}>💾 Planı Favorilerime Ekle</Text>
        </TouchableOpacity>
      )}
      
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  loadingText: { marginTop: 15, color: '#666', fontSize: 16 },
  header: { padding: 40, paddingTop: 60, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTitle: { color: "white", fontSize: 24, fontWeight: "bold", textAlign: "center" },
  headerSub: { color: "white", textAlign: "center", opacity: 0.8, fontSize: 16, marginTop: 5 },
  contentPadding: { padding: 20 },
  dayCard: { backgroundColor: "white", borderRadius: 20, padding: 20, marginBottom: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  dayBadge: { backgroundColor: "#9333ea", alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, marginBottom: 12 },
  dayBadgeText: { color: 'white', fontWeight: 'bold', fontSize: 13 },
  dayTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#1e293b' },
  detailRow: { marginBottom: 12 },
  detailText: { fontSize: 15, color: '#475569', lineHeight: 22 },
  emoji: { fontSize: 18 },
  boldText: { fontWeight: 'bold', color: '#334155' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 15 },
  footerInfo: { fontSize: 14, color: '#64748b', marginTop: 6 },
  saveButton: { marginHorizontal: 20, backgroundColor: '#10b981', padding: 18, borderRadius: 15, alignItems: 'center', marginBottom: 20 },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  noDataText: { color: '#94a3b8', fontSize: 16, marginTop: 20 }
});