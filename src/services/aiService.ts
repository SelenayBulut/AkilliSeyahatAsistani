// src/services/aiService.ts
import { GEMINI_API_KEY, PEXELS_API_KEY } from "../constants/Config";

export const getCityInfo = async (cityName: string, category: string) => {
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY.trim()}`;
  const requestBody = {
    contents: [{
      parts: [{

        text: `Sen bir seyahat rehberisin. ${cityName} şehrinde ${category} kategorisinde en iyi 5 yeri öner. 
            Yanıtı SADECE JSON array olarak ver. Format:
            [
              {
               "id": 1,
               "title": "Mekan Adı",
               "description": "Kısa, çekici açıklama",
               "rating": 4.7,  // 1-5 arası gerçekçi bir puan/yıldız sayısı ekle
               "searchQuery": "${cityName} ${category} exterior"
             }
     ]`
      }]
    }],
    generationConfig: {
      temperature: 0.5,  // Daha tutarlı JSON için düşük tut
      maxOutputTokens: 1200,
      responseMimeType: "application/json"  // Zorunlu JSON modu!
    }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini Hata:", response.status, errorText);
      if (response.status === 429) {
        return "YOĞUNLUK";  // Özel kod, ekranda güzel mesaj göster
      }
      return null;
    }

    const data = await response.json();

    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      let textResponse = data.candidates[0].content.parts[0].text.trim();

      // Çok agresif temizleme (kesik JSON'lara karşı)
      textResponse = textResponse
        .replace(/```json|```/g, '')
        .replace(/^[^{[]+/, '')  // Baştaki fazlalıkları sil
        .replace(/[^}\]]+$/, '')  // Sondaki fazlalıkları sil
        .replace(/,\s*]$/, ']')   // Son virgülü sil
        .trim();

      // Eğer array başlamamışsa zorla ekle
      if (!textResponse.startsWith('[')) {
        textResponse = '[' + textResponse;
      }
      if (!textResponse.endsWith(']')) {
        textResponse += ']';
      }

      let parsedData;
      try {
        parsedData = JSON.parse(textResponse);
        console.log("Başarılı parse:", parsedData); // Test için log
      } catch (parseError) {
        console.error("JSON Parse Hatası:", parseError);
        console.error("Ham Yanıt (temizlenmiş):", textResponse);
        return null;
      }

      // Pexels fotoğrafları çek (aynı kalır)
      const results = await Promise.all(
        parsedData.map(async (item: any) => {
          const query = encodeURIComponent(item.searchQuery || `${cityName} ${item.title} exterior high quality`);
          const pexelsUrl = `https://api.pexels.com/v1/search?query=${query}&per_page=1&orientation=portrait`;

          try {
            const pexelsRes = await fetch(pexelsUrl, {
              headers: { Authorization: PEXELS_API_KEY }
            });
            if (pexelsRes.ok) {
              const pData = await pexelsRes.json();
              if (pData.photos?.length > 0) {
                return { ...item, imageUrl: pData.photos[0].src.portrait };
              }
            }
          } catch {}

          // Fallback
          return { ...item, imageUrl: `https://source.unsplash.com/featured/400x600/?${encodeURIComponent(item.title)}` };
        })
      );

      return results;
    }

    console.log("Beklenmedik yanıt:", data);
    return null;
  } catch (error) {
    console.error("Genel Hata:", error);
    return null;
  }
};
export const getTravelPlan = async (city: string, days: string) => {
  try {
    const prompt = `${city} şehri için ${days} günlük bir gezi planı hazırla. 
    Yanıtı SADECE aşağıdaki JSON yapısında ver, başka hiçbir metin ekleme:
    [
      {
        "gun": 1,
        "baslik": "Günün Konusu",
        "aktiviteler": { "sabah": "...", "ogle": "...", "aksam": "..." },
        "yemek": "Restoran adı",
        "konaklama": "Otel adı"
      }
    ]`;

    // Model ismini isteğin üzerine gemini-3-flash-preview olarak güncelledim
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY.trim()}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
          responseMimeType: "application/json" // Çıktının JSON olmasını zorlar
        }
      }),
    });

    const data = await response.json();
    
    // API'den hata dönüp dönmediğini kontrol edelim
    if (data.error) {
      console.error("Gemini API Hatası:", data.error.message);
      return null;
    }

    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      let textResponse = data.candidates[0].content.parts[0].text.trim();
      
      // JSON bloğunu temizleme
      textResponse = textResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      console.log("Gemini 3 Yanıtı:", textResponse);

      try {
        return JSON.parse(textResponse);
      } catch (parseError) {
        console.error("JSON Ayrıştırma Hatası:", parseError);
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Planlama sırasında ağ hatası:", error);
    return null;
  }
};