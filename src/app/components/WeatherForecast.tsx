import { motion } from 'motion/react';
import { Cloud, CloudRain, Sun, Wind, Droplets, AlertTriangle, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getWeather } from '../../lib/api';
import { toast } from 'sonner';

interface WeatherDay {
  day: string;
  date: string;
  temp: { min: number; max: number };
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  rainfall: number;
  humidity: number;
  wind: number;
}

interface WeatherForecastProps {
  location?: string;
  compact?: boolean;
}

export function WeatherForecast({ location = 'Nashik, Maharashtra', compact = true }: WeatherForecastProps) {
  const [forecast, setForecast] = useState<WeatherDay[]>([]);
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      // Start with a small delay to ensure auth is ready
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        // Default to Nashik coordinates if geolocation fails
        let lat = 19.9975;
        let lon = 73.7898;

        // Try to get user's location
        if (navigator.geolocation) {
          try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 5000,
              });
            });
            lat = position.coords.latitude;
            lon = position.coords.longitude;
          } catch (error) {
            console.log('Geolocation failed, using default location (Nashik)');
          }
        }

        console.log('Fetching weather for coordinates:', lat, lon);
        const weatherData = await getWeather(lat, lon);
        
        console.log('Weather data received:', weatherData);
        
        // Check if we have valid weather data
        if (!weatherData || (!weatherData.forecast?.list && !weatherData.isMock)) {
          console.log('No valid weather data, using default forecast');
          setIsLoading(false);
          return;
        }
        
        // If we got mock data or no forecast, but have current weather, use it
        if (weatherData.isMock || !weatherData.forecast?.list || weatherData.forecast.list.length === 0) {
          console.log('⚠️ Using mock/fallback weather data (live weather unavailable)');
          // Set current weather from mock data
          if (weatherData.current) {
            setCurrentWeather(weatherData.current);
          }
          // Process mock forecast if available
          if (weatherData.forecast?.list && weatherData.forecast.list.length > 0) {
            // Continue to process the mock forecast data below
          } else {
            setIsLoading(false);
            return;
          }
        }
        
        setCurrentWeather(weatherData.current);

        // Process forecast data
        const forecastDays: WeatherDay[] = [];
        const dailyForecasts: { [key: string]: any[] } = {};

        // Group forecast by day
        if (weatherData.forecast.list && Array.isArray(weatherData.forecast.list)) {
          weatherData.forecast.list.forEach((item: any) => {
            const date = new Date(item.dt * 1000);
            const dayKey = date.toLocaleDateString();

            if (!dailyForecasts[dayKey]) {
              dailyForecasts[dayKey] = [];
            }
            dailyForecasts[dayKey].push(item);
          });

          // Convert to our format
          Object.keys(dailyForecasts).slice(0, 5).forEach((dayKey, index) => {
            const dayData = dailyForecasts[dayKey];
            // Use the first item's timestamp to get the correct date
            const timestamp = dayData[0].dt * 1000;
            const date = new Date(timestamp);
            
            // Calculate min/max temps
            const temps = dayData.map((d: any) => d.main.temp);
            const minTemp = Math.round(Math.min(...temps));
            const maxTemp = Math.round(Math.max(...temps));

            // Get average humidity and wind
            const avgHumidity = Math.round(
              dayData.reduce((sum: number, d: any) => sum + d.main.humidity, 0) / dayData.length
            );
            const avgWind = Math.round(
              dayData.reduce((sum: number, d: any) => sum + d.wind.speed, 0) / dayData.length
            );

            // Get rainfall
            const rainfall = dayData.reduce(
              (sum: number, d: any) => sum + (d.rain?.['3h'] || 0),
              0
            );

            // Determine condition
            const mainWeather = dayData[Math.floor(dayData.length / 2)].weather[0].main.toLowerCase();
            let condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' = 'sunny';
            
            if (mainWeather.includes('rain') || mainWeather.includes('drizzle')) {
              condition = 'rainy';
            } else if (mainWeather.includes('storm') || mainWeather.includes('thunder')) {
              condition = 'stormy';
            } else if (mainWeather.includes('cloud')) {
              condition = 'cloudy';
            }

            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const dayName = index === 0 ? 'Today' : index === 1 ? 'Tom' : dayNames[date.getDay()];

            forecastDays.push({
              day: dayName,
              date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              temp: { min: minTemp, max: maxTemp },
              condition,
              rainfall: Math.round(rainfall),
              humidity: avgHumidity,
              wind: avgWind,
            });
          });

          if (forecastDays.length > 0) {
            setForecast(forecastDays);
            setIsLoading(false);
            return;
          }
        }
        
        // If we get here, use fallback data
        throw new Error('No forecast data available');
        
      } catch (error: any) {
        console.error('Weather fetch error:', error);
        
        // Only show toast if it's not an API key issue (which is expected in demo)
        if (!error.message?.includes('API key')) {
          console.log('Using fallback weather data');
        }
        
        // Fallback to mock data
        const mockData: WeatherDay[] = [
          {
            day: 'Today',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            temp: { min: 18, max: 28 },
            condition: 'sunny',
            rainfall: 0,
            humidity: 65,
            wind: 12,
          },
          {
            day: 'Tom',
            date: new Date(Date.now() + 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            temp: { min: 19, max: 29 },
            condition: 'sunny',
            rainfall: 0,
            humidity: 60,
            wind: 10,
          },
          {
            day: 'Mon',
            date: new Date(Date.now() + 172800000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            temp: { min: 20, max: 30 },
            condition: 'cloudy',
            rainfall: 0,
            humidity: 70,
            wind: 15,
          },
          {
            day: 'Tue',
            date: new Date(Date.now() + 259200000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            temp: { min: 21, max: 28 },
            condition: 'rainy',
            rainfall: 15,
            humidity: 85,
            wind: 20,
          },
          {
            day: 'Wed',
            date: new Date(Date.now() + 345600000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            temp: { min: 19, max: 27 },
            condition: 'cloudy',
            rainfall: 0,
            humidity: 75,
            wind: 18,
          },
        ];
        
        setForecast(mockData);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWeather();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-card/40 backdrop-blur-sm rounded-2xl p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="min-w-[100px] p-4 bg-muted animate-pulse rounded-xl h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  const getWeatherIcon = (condition: string, size = "w-6 h-6") => {
    switch (condition) {
      case 'sunny':
        return <Sun className={`${size} text-yellow-500`} />;
      case 'cloudy':
        return <Cloud className={`${size} text-gray-400`} />;
      case 'rainy':
        return <CloudRain className={`${size} text-blue-500`} />;
      case 'stormy':
        return <CloudRain className={`${size} text-blue-700`} />;
      default:
        return <Sun className={`${size} text-yellow-500`} />;
    }
  };

  const getFarmingAdvice = () => {
    const rainDays = forecast.filter(day => day.rainfall > 10).length;
    const totalRainfall = forecast.reduce((sum, day) => sum + day.rainfall, 0);
    
    if (rainDays >= 2 && totalRainfall > 30) {
      return {
        type: 'warning',
        icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
        message: 'Heavy rain expected. Delay fertilizer.',
      };
    } else if (rainDays === 0) {
      return {
        type: 'info',
        icon: <Droplets className="w-5 h-5 text-blue-500" />,
        message: 'No rain. Plan irrigation.',
      };
    } else {
      return {
        type: 'success',
        icon: <Sun className="w-5 h-5 text-green-500" />,
        message: 'Good weather for work.',
      };
    }
  };

  const advice = getFarmingAdvice();

  return (
    <div className="bg-card rounded-2xl p-4 border border-border overflow-hidden">
      {/* Header & Location */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-medium text-foreground flex items-center gap-2">
            Weather
            <span className="text-xs font-normal text-muted-foreground">• {location.split(',')[0]}</span>
          </h3>
        </div>
        <div className="text-xs text-primary font-medium flex items-center gap-1">
           7 Days <ChevronRight className="w-3 h-3" />
        </div>
      </div>

      {/* Main Horizontal Scroll Container */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="relative -mx-4 px-4">
        <div className="flex overflow-x-auto gap-3 pb-2 snap-x hide-scrollbar scroll-smooth">
          {/* Advice Card as the first item or separate? Let's keep it separate for visibility, or insert as first card. 
              The user wants a small horizontal section. Integrating advice card might be good.
          */}
          <div className="min-w-[140px] snap-start bg-muted/50 rounded-xl p-3 flex flex-col justify-between border border-border">
             <div className="flex items-start justify-between">
                <div className="text-xs font-medium text-muted-foreground">Advice</div>
                {advice.icon}
             </div>
             <div className="text-sm font-medium leading-tight mt-2 text-foreground">
               {advice.message}
             </div>
          </div>

          {forecast.map((day, index) => (
            <div
              key={`${day.date}-${index}`}
              className={`min-w-[85px] snap-start rounded-xl p-3 flex flex-col items-center justify-between border transition-colors ${
                index === 0
                  ? 'bg-primary/5 border-primary/20'
                  : 'bg-card border-border'
              }`}
            >
              <div className="text-xs font-medium text-muted-foreground">{day.day}</div>
              <div className="my-2">
                {getWeatherIcon(day.condition, "w-8 h-8")}
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-foreground">{day.temp.max}°</div>
                <div className="text-[10px] text-muted-foreground">{day.temp.min}°</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}