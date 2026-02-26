import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "@user_info";
const CREDENTIALS_KEY = "@user_credentials";

// Kayıt olurken şifre ve kullanıcı adını saklar
export const saveCredentials = async (data: any) => {
  try {
    await AsyncStorage.setItem(CREDENTIALS_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Kayıt hatası:", e);
  }
};

export const getCredentials = async () => {
  try {
    const data = await AsyncStorage.getItem(CREDENTIALS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

// Giriş yapmış kullanıcı bilgisini tutar
export const saveUser = async (user: any) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error("User kaydetme hatası:", e);
  }
};

export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};