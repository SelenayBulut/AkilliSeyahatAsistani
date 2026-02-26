import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    // 3 saniye bekledikten sonra kullanıcıyı Login ekranına yönlendirir
    const timer = setTimeout(() => {
      // navigation.replace kullandık ki geri butonuna basınca Splash'e dönmesin
      navigation.replace('Login'); 
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient 
        colors={['#9333ea', '#ec4899']} 
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Akıllı Gezi Planlayıcı</Text>
          <Text style={styles.subtitle}>Gemini AI ile unutulmaz seyahatler</Text>
          
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Yükleniyor...</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 60,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 50,
  },
  loadingText: {
    fontSize: 16,
    color: 'white',
    opacity: 0.7,
    letterSpacing: 1,
  },
});