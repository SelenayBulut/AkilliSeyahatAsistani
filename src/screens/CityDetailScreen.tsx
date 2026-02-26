import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "CityDetail">;

const cityImages: any = {
  İstanbul: require("../assets/istanbul.jpg"),
  Ankara: require("../assets/ankara.jpg"),
  İzmir: require("../assets/izmir.jpg"),
  Bursa: require("../assets/bursa.jpg"),
};

export default function CityDetailScreen({ route, navigation }: Props) {
  // Şehir adını alırken veya eşleştirirken hata payını azaltalım
  const cityName = route.params?.city || "İstanbul";

  const cityInfo: any = {
    İstanbul: { country: "Türkiye", desc: "İki kıtayı birleştiren eşsiz şehir" },
    Ankara: { country: "Türkiye", desc: "Türkiye’nin başkenti" },
    İzmir: { country: "Türkiye", desc: "Ege’nin incisi" },
    Bursa: { country: "Türkiye", desc: "Tarihi ve doğasıyla ünlü şehir" },
  };

  // Şehir bilgisini güvenli alalım (Eğer şehir listede yoksa uygulama çökmesin)
  const info = cityInfo[cityName] || { country: "Bilinmiyor", desc: "" };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      
      {/* ÜST FOTOĞRAF ALANI - Aradaki boşluklar temizlendi */}
      <ImageBackground
        source={cityImages[cityName]}
        style={styles.headerImage}
      >
        <View style={styles.headerInfo}>
          <Text style={styles.cityTitle}>{cityName}</Text>
          <Text style={styles.cityCountry}>{info.country}</Text>
          <Text style={styles.cityDesc}>{info.desc}</Text>
        </View>
      </ImageBackground>

      <Text style={styles.sectionTitle}>Kategoriler</Text>

      <View style={styles.grid}>
        {/* Kategori Kartları */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Accommodation", { city: cityName, category: "Konaklama" })}
        >
          <Text style={styles.cardIcon}>🏨</Text>
          <Text style={styles.cardTitle}>Konaklama</Text>
          <Text style={styles.cardSubtitle}>AI Otel Önerileri</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate("Accommodation", { city: cityName, category: "Gezilecek Yerler" })}
        >
          <Text style={styles.cardIcon}>📍</Text>
          <Text style={styles.cardTitle}>Gezilecek Yerler</Text>
          <Text style={styles.cardSubtitle}>Turistik mekanlar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate("Accommodation", { city: cityName, category: "Yeme–İçme" })}
        >
          <Text style={styles.cardIcon}>🍽️</Text>
          <Text style={styles.cardTitle}>Yeme–İçme</Text>
          <Text style={styles.cardSubtitle}>Restoranlar ve kafeler</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Weather", { city: cityName })}
        >
          <Text style={styles.cardIcon}>☁️</Text>
          <Text style={styles.cardTitle}>Hava Durumu</Text>
          <Text style={styles.cardSubtitle}>Günlük Tahmin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: "100%",
    height: 250,
    justifyContent: "flex-end",
  },
  headerInfo: {
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  cityTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  cityCountry: {
    color: "#f1f5f9",
    fontSize: 14,
  },
  cityDesc: {
    color: "#e2e8f0",
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  card: {
    width: "47%",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },
  cardIcon: {
    fontSize: 28,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});