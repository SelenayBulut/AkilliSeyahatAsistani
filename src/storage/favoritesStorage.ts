import AsyncStorage from "@react-native-async-storage/async-storage";

// Anahtar Kelimeler (Key)
const FAVORITES_KEY = "@favorites_list";
const PLANS_KEY = "@saved_plans";

// --- MEKAN FAVORİLERİ FONKSİYONLARI ---

export async function getFavorites() {
  try {
    const json = await AsyncStorage.getItem(FAVORITES_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error("Mekanlar yüklenirken hata:", e);
    return [];
  }
}

export async function saveFavorites(list: any[]) {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Mekanlar kaydedilirken hata:", e);
  }
}

export async function addFavorite(city: any) {
  const list = await getFavorites();
  // Aynı isimli mekan varsa ekleme (Senin mantığını koruduk knk)
  if (list.some((item: any) => item.city === city.city)) return list;

  const newList = [...list, city];
  await saveFavorites(newList);
  return newList;
}

export async function removeFavorite(cityName: string) {
  const list = await getFavorites();
  // Burada senin 'item.name' kullanımını 'item.city' olarak güncelledim 
  // çünkü önceki mesajlarda veri yapımızı 'city' üzerine kurmuştuk.
  const newList = list.filter((item: any) => item.city !== cityName);
  await saveFavorites(newList);
  return newList;
}


// --- AI GEZİ PLANI FONKSİYONLARI (YENİ EKLENENLER) ---

// Kayıtlı tüm planları getirir
export const getSavedPlans = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(PLANS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Planlar yüklenirken hata:", e);
    return [];
  }
};

// Yeni bir planı listeye ekler
export const saveTravelPlan = async (planData: any, cityName: string) => {
  try {
    const currentPlans = await getSavedPlans();
    
    const newPlan = {
      id: Date.now().toString(), // Benzersiz ID
      city: cityName,
      date: new Date().toLocaleDateString('tr-TR'), // Bugünün tarihi
      details: planData // AI'dan gelen gezi listesi
    };

    const updatedPlans = [newPlan, ...currentPlans];
    await AsyncStorage.setItem(PLANS_KEY, JSON.stringify(updatedPlans));
    return true;
  } catch (e) {
    console.error("Plan kaydedilirken hata:", e);
    return false;
  }
};

// Bir planı siler (Opsiyonel ama lazım olur knk)
export const removeSavedPlan = async (id: string) => {
  try {
    const list = await getSavedPlans();
    const newList = list.filter((item: any) => item.id !== id);
    await AsyncStorage.setItem(PLANS_KEY, JSON.stringify(newList));
    return newList;
  } catch (e) {
    console.error("Plan silinirken hata:", e);
    return null;
  }
};