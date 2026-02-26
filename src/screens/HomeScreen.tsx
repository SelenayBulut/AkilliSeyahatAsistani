import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { getUser } from "../storage/userStorage"; // Kullanıcı adını çekmek için
import { getFavorites } from "../storage/favoritesStorage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const cities = [
  {
    name: "İstanbul",
    country: "Türkiye",
    description: "İki kıtayı birleştiren eşsiz şehir",
    image: require("../assets/istanbul.jpg"),
  },
  {
    name: "Ankara",
    country: "Türkiye",
    description: "Türkiye’nin başkenti",
    image: require("../assets/ankara.jpg"),
  },
  {
    name: "İzmir",
    country: "Türkiye",
    description: "Ege’nin incisi",
    image: require("../assets/izmir.jpg"),
  },
  {
    name: "Bursa",
    country: "Türkiye",
    description: "Tarihi ve doğasıyla ünlü şehir",
    image: require("../assets/bursa.jpg"),
  },
];

export default function HomeScreen({ navigation }: Props) {
  const [favCount, setFavCount] = useState(0);
  const [userName, setUserName] = useState("Gezgin");

  useEffect(() => {
    loadInitialData();
    const focus = navigation.addListener("focus", loadInitialData);
    return focus;
  }, []);

  const loadInitialData = async () => {
    // Favori sayısını yükle
    const list = await getFavorites();
    setFavCount(list.length);

    // Giriş yapan kullanıcının adını yükle
    const user = await getUser();
    if (user && user.name) {
      setUserName(user.name);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* 🟪 ÜST BAR (Profil İkonu Buraya Eklendi) */}
        <LinearGradient colors={["#4c1d95", "#9333ea"]} style={styles.topBar}>
          <View style={styles.topRow}>
            <View>
              <Text style={styles.welcomeText}>Merhaba,</Text>
              <Text style={styles.userNameText}>{userName}</Text>
            </View>

            {/* Profil İkonu */}
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => navigation.navigate("Profile")}
            >
               <View style={styles.profileCircle}>
                  <Text style={styles.profileEmoji}>👤</Text>
               </View>
            </TouchableOpacity>
          </View>

          {/* 🎲 Rastgele Keşfet */}
          <TouchableOpacity
            style={styles.randomButton}
            onPress={() => {
              const randomIndex = Math.floor(Math.random() * cities.length);
              const randomCity = cities[randomIndex];
              navigation.navigate("CityDetail", { city: randomCity.name });
            }}
          >
            <Text style={styles.randomButtonText}>🎲 Rastgele Keşfet</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* ⭐ Akıllı Gezi Planlayıcı */}
        <TouchableOpacity
          onPress={() => navigation.navigate("SmartPlanner")}
          activeOpacity={0.9}
        >
          <LinearGradient colors={["#f472b6", "#9333ea"]} style={styles.aiCard}>
            <Text style={styles.aiTitle}>Akıllı Gezi Planlayıcı</Text>
            <Text style={styles.aiSubtitle}>
              Yapay zeka ile özel seyahat planınızı oluşturun
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* 📍 Şehir Listesi */}
        <Text style={styles.sectionTitle}>Şehirler</Text>

        {cities.map((city, i) => (
          <TouchableOpacity
            key={i}
            style={styles.cityCard}
            onPress={() =>
              navigation.navigate("CityDetail", { city: city.name })
            }
          >
            <Image source={city.image} style={styles.cityImage} />
            <View style={styles.cityInfo}>
              <Text style={styles.cityName}>{city.name}</Text>
              <Text style={styles.cityCountry}>{city.country}</Text>
              <Text style={styles.cityDesc}>{city.description}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* 🔻 ALT BAR */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={[styles.tabIcon, { color: "#4c1d95" }]}>🏠</Text>
          <Text style={[styles.tabLabel, { color: "#4c1d95" }]}>Ana Sayfa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate("Favorites")}
        >
          <View style={{ position: "relative" }}>
            <Text style={[styles.tabIcon, { color: "#666" }]}>❤️</Text>
            {favCount > 0 && (
              <View style={styles.favBadge}>
                <Text style={styles.favBadgeText}>{favCount}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.tabLabel, { color: "#666" }]}>Favoriler</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  topBar: {
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: { color: "rgba(255,255,255,0.8)", fontSize: 14 },
  userNameText: { color: "white", fontSize: 22, fontWeight: "bold" },
  
  profileButton: {
    padding: 5,
  },
  profileCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  profileEmoji: { fontSize: 20 },

  randomButton: {
    alignSelf: "center",
    marginTop: 20,
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderRadius: 20,
    elevation: 5,
  },
  randomButtonText: { color: "#9333ea", fontWeight: "bold" },

  aiCard: {
    marginTop: 15,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 14,
  },
  aiTitle: { color: "white", fontSize: 18, fontWeight: "bold" },
  aiSubtitle: { color: "white", marginTop: 4 },

  sectionTitle: {
    fontSize: 20,
    marginLeft: 20,
    marginTop: 25,
    fontWeight: "bold",
    color: "#1e293b"
  },

  cityCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
  },
  cityImage: { width: "100%", height: 200 },
  cityInfo: { padding: 12 },
  cityName: { fontSize: 18, fontWeight: "bold" },
  cityCountry: { color: "#666" },
  cityDesc: { color: "#777", fontSize: 12, marginTop: 4 },

  tabBar: {
    height: 70,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  tabItem: { alignItems: "center" },
  tabIcon: { fontSize: 22 },
  tabLabel: { fontSize: 12 },

  favBadge: {
    position: "absolute",
    top: -6,
    right: -10,
    backgroundColor: "#e11d48",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  favBadgeText: { color: "white", fontSize: 12 },
});