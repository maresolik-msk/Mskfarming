
import * as kv from "./kv_store.tsx";

export interface WeatherData {
  temp: number;
  min_temp: number;
  max_temp: number;
  humidity: number;
  rainfall: number;
  description: string;
  icon: string;
  wind_speed: number;
  location: string;
  timestamp: number;
}

const BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function getWeatherByLocation(location: string): Promise<WeatherData | null> {
  const API_KEY = Deno.env.get("OPENWEATHER_API_KEY");
  if (!API_KEY) {
    console.error("Missing OPENWEATHER_API_KEY");
    // Return mock data if API key is missing to prevent crash
    return {
        temp: 28,
        min_temp: 22,
        max_temp: 34,
        humidity: 65,
        rainfall: 0,
        description: "Clear sky (Mock)",
        icon: "01d",
        wind_speed: 5,
        location: location,
        timestamp: Date.now()
    };
  }

  // Helper to fetch weather
  const fetchWeather = async (query: string) => {
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(query)}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
       // Throw error so we can catch it and try fallback
       throw new Error(`Weather API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  };

  try {
    let data;
    try {
        data = await fetchWeather(location);
    } catch (e) {
        console.warn(`Weather fetch failed for '${location}': ${e.message}`);
        
        // Intelligent Fallbacks
        let fallback = "New Delhi,IN"; // Ultimate fallback
        
        if (location.toLowerCase().includes("punjab")) fallback = "Ludhiana,IN";
        else if (location.toLowerCase().includes("maharashtra")) fallback = "Pune,IN";
        else if (location.toLowerCase().includes("karnataka")) fallback = "Bengaluru,IN";
        else if (location.toLowerCase().includes("tamil")) fallback = "Chennai,IN";
        else if (location.toLowerCase().includes("gujarat")) fallback = "Ahmedabad,IN";
        
        console.log(`Retrying with fallback location: ${fallback}`);
        data = await fetchWeather(fallback);
    }

    return {
      temp: data.main.temp,
      min_temp: data.main.temp_min,
      max_temp: data.main.temp_max,
      humidity: data.main.humidity,
      rainfall: data.rain ? (data.rain["1h"] || 0) * 24 : 0, 
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      wind_speed: data.wind.speed,
      location: data.name,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error("Failed to fetch weather (final):", error);
    
    // Last resort: Return mock data instead of failing completely
    // This ensures the simulation 'heartbeat' doesn't die just because weather API failed
    return {
        temp: 30,
        min_temp: 25,
        max_temp: 35,
        humidity: 60,
        rainfall: 0,
        description: "Clear sky (Fallback)",
        icon: "01d",
        wind_speed: 5,
        location: location + " (Simulated)",
        timestamp: Date.now()
    };
  }
}
