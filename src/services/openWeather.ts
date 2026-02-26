import axios from "axios";

const API_KEY = "OPENWEATHER_KEY_BURAYA";

export async function getWeatherByCity(city: string) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=tr`;
  const res = await axios.get(url);
  return res.data;
}
