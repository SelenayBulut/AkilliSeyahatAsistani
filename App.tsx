import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native"; 

// Ekranlar
import SplashScreen from "./src/screens/SplashScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen"; // Yeni Eklendi
import CityDetailScreen from "./src/screens/CityDetailScreen";
import FavoritesScreen from "./src/screens/FavoritesScreen";
import WeatherScreen from "./src/screens/WeatherScreen";
import AccommodationScreen from "./src/screens/AccommodationScreen";
import PlanResultScreen from './src/screens/PlanResultScreen';
import SmartPlannerScreen from './src/screens/SmartPlannerScreen';

// TypeScript Tipleri
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Profile: undefined; // Yeni Eklendi
  CityDetail: { city: string };
  Accommodation: { city: string; category: string };
  Weather: { city: string };
  Favorites: undefined;
  SmartPlanner: undefined;
  PlanResult: { 
    selectedCity: string; 
    selectedDays: string; 
    preloadedPlan?: any 
  }; 
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#333',
          headerTitleAlign: 'center',
        }}
      >
        {/* Giriş Akışı Ekranları */}
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }}
        />

        {/* Ana Uygulama Ekranları */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        
        {/* Profil Ekranı */}
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ title: 'Profilim' }} 
        />

        <Stack.Screen name="CityDetail" component={CityDetailScreen} options={{ title: 'Şehir Detayı' }} />
        <Stack.Screen name="Accommodation" component={AccommodationScreen} options={{ title: 'Konaklama' }} />
        <Stack.Screen name="Weather" component={WeatherScreen} options={{ title: 'Hava Durumu' }} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favorilerim' }} />
        
        <Stack.Screen 
          name="SmartPlanner" 
          component={SmartPlannerScreen} 
          options={{ title: 'Gezi Planlayıcı' }}
        />
        <Stack.Screen 
          name="PlanResult" 
          component={PlanResultScreen} 
          options={{ title: 'Gezi Planın' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  // İleride gerekirse burayı doldururuz knk.
});