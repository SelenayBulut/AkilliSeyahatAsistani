// src/screens/WeatherScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default function WeatherScreen({ route, navigation }) {
  const city = route.params?.city || "İstanbul";

  const cityMap = {
    İstanbul: "Istanbul",
    İzmir: "Izmir",
    Ankara: "Ankara",
    Bursa: "Bursa",
    Antalya: "Antalya",
    Bodrum: "Bodrum",
    Kapadokya: "Goreme",
    Trabzon: "Trabzon",
    Mardin: "Mardin",
  };

  const apiCity = cityMap[city] || city.replace("İ", "I").replace("ı", "i");

  const API_KEY = "74d336bf43669b6c4be6942e9b1c874e";

  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getForecast = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${apiCity}&appid=${API_KEY}&units=metric&lang=tr`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "API hatası");
      }

      if (data.list) {
        // Bugünün verisi + 7 gün (her 3 saatte bir veri var, yaklaşık her gün 8 veri)
        const today = data.list[0];
        const dailyData = data.list.filter((item, index) => index % 8 === 4); // Yaklaşık her 24 saatte bir
        const fullForecast = [today, ...dailyData.slice(0, 7)]; // Bugün + 7 gün
        setForecast(fullForecast);
      }
    } catch (err) {
      setError(err.message);
      console.log("Hava durumu hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getForecast();
  }, []);

  const getWeatherIcon = (iconCode) => `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  const formatDate = (dt_txt) => {
    const date = new Date(dt_txt);
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('tr-TR', options);
  };

  if (loading) {
    return (
      <LinearGradient colors={["#4f8ef7", "#3a7bd5"]} style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Hava durumu yükleniyor...</Text>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={["#4f8ef7", "#3a7bd5"]} style={styles.container}>
        <Text style={styles.errorText}>Hata: {error}</Text>
        <Text style={styles.errorSub}>Lütfen internet bağlantınızı kontrol edin veya daha sonra tekrar deneyin.</Text>
      </LinearGradient>
    );
  }

  if (!forecast.length) {
    return (
      <LinearGradient colors={["#4f8ef7", "#3a7bd5"]} style={styles.container}>
        <Text style={styles.errorText}>Hava durumu verisi bulunamadı 😔</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#4f8ef7", "#3a7bd5"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.cityTitle}>{city} - 7 Günlük Hava Durumu</Text>

        {forecast.map((day, index) => (
          <View key={index} style={styles.dayCard}>
            <Text style={styles.dayText}>{formatDate(day.dt_txt)}</Text>
            
            <Image
              source={{ uri: getWeatherIcon(day.weather[0].icon) }}
              style={styles.weatherIcon}
            />

            <Text style={styles.tempText}>
              {Math.round(day.main.temp)}°C
            </Text>

            <Text style={styles.descText}>
              {day.weather[0].description.charAt(0).toUpperCase() + day.weather[0].description.slice(1)}
            </Text>

            <View style={styles.detailsRow}>
              <Text style={styles.detailText}>Nem: {day.main.humidity}%</Text>
              <Text style={styles.detailText}>Rüzgar: {Math.round(day.wind.speed * 3.6)} km/s</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ALT BAR */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.tabIcon}>🏠</Text>
          <Text style={styles.tabLabel}>Ana Sayfa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate("Favorites")}
        >
          <Text style={styles.tabIcon}>❤️</Text>
          <Text style={styles.tabLabel}>Favoriler</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  cityTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  dayCard: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  dayText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  weatherIcon: {
    width: 80,
    height: 80,
    marginVertical: 10,
  },
  tempText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  descText: {
    color: "white",
    fontSize: 16,
    marginVertical: 8,
    textAlign: "center",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  detailText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
  },
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#eee",
    elevation: 8,
  },
  tabItem: { alignItems: "center" },
  tabIcon: { fontSize: 24 },
  tabLabel: { fontSize: 12, color: "#475569" },
  loadingText: {
    color: "white",
    marginTop: 20,
    fontSize: 18,
  },
  errorText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
});