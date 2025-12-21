import { motion } from 'motion/react';
import { Cloud, CloudRain, Sun, Wind, Droplets, AlertTriangle } from 'lucide-react';

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
}

export function WeatherForecast({ location = 'Nashik, Maharashtra' }: WeatherForecastProps) {
  // Mock weather data - In production, replace with real API call
  // Example: OpenWeatherMap API, WeatherAPI, etc.
  const forecast: WeatherDay[] = [
    {
      day: 'Today',
      date: 'Dec 21',
      temp: { min: 18, max: 28 },
      condition: 'sunny',
      rainfall: 0,
      humidity: 65,
      wind: 12,
    },
    {
      day: 'Tomorrow',
      date: 'Dec 22',
      temp: { min: 19, max: 29 },
      condition: 'sunny',
      rainfall: 0,
      humidity: 60,
      wind: 10,
    },
    {
      day: 'Monday',
      date: 'Dec 23',
      temp: { min: 20, max: 30 },
      condition: 'cloudy',
      rainfall: 0,
      humidity: 70,
      wind: 15,
    },
    {
      day: 'Tuesday',
      date: 'Dec 24',
      temp: { min: 21, max: 28 },
      condition: 'rainy',
      rainfall: 15,
      humidity: 85,
      wind: 20,
    },
    {
      day: 'Wednesday',
      date: 'Dec 25',
      temp: { min: 20, max: 26 },
      condition: 'rainy',
      rainfall: 25,
      humidity: 90,
      wind: 18,
    },
    {
      day: 'Thursday',
      date: 'Dec 26',
      temp: { min: 19, max: 27 },
      condition: 'cloudy',
      rainfall: 5,
      humidity: 75,
      wind: 14,
    },
    {
      day: 'Friday',
      date: 'Dec 27',
      temp: { min: 18, max: 28 },
      condition: 'sunny',
      rainfall: 0,
      humidity: 68,
      wind: 12,
    },
  ];

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="w-8 h-8 text-gray-400" />;
      case 'rainy':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'stormy':
        return <CloudRain className="w-8 h-8 text-blue-700" />;
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  const getFarmingAdvice = () => {
    const rainDays = forecast.filter(day => day.rainfall > 10).length;
    const totalRainfall = forecast.reduce((sum, day) => sum + day.rainfall, 0);
    
    if (rainDays >= 2 && totalRainfall > 30) {
      return {
        type: 'warning',
        icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
        message: 'Heavy rain expected. Delay fertilizer application. Ensure proper drainage.',
      };
    } else if (rainDays === 0) {
      return {
        type: 'info',
        icon: <Droplets className="w-5 h-5 text-blue-500" />,
        message: 'No rain forecast. Plan irrigation for next 7 days.',
      };
    } else {
      return {
        type: 'success',
        icon: <Sun className="w-5 h-5 text-green-500" />,
        message: 'Good weather for field work. Ideal for weeding and spraying.',
      };
    }
  };

  const advice = getFarmingAdvice();
  const totalRainfall = forecast.reduce((sum, day) => sum + day.rainfall, 0);

  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl text-foreground mb-1">Weather Forecast</h3>
          <p className="text-sm text-muted-foreground">{location}</p>
        </div>
        <button className="text-sm text-primary hover:underline">
          Change Location
        </button>
      </div>

      {/* Farming Advice Alert */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-start gap-3 p-4 rounded-lg mb-6 ${
          advice.type === 'warning'
            ? 'bg-orange-500/10 border border-orange-500/20'
            : advice.type === 'info'
            ? 'bg-blue-500/10 border border-blue-500/20'
            : 'bg-green-500/10 border border-green-500/20'
        }`}
      >
        <div className="mt-0.5">{advice.icon}</div>
        <div className="flex-1">
          <div className="text-sm text-foreground">{advice.message}</div>
        </div>
      </motion.div>

      {/* 7-Day Forecast Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        {forecast.map((day, index) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-lg border-2 transition-all ${
              index === 0
                ? 'bg-primary/5 border-primary'
                : 'bg-muted border-transparent hover:border-primary/30'
            }`}
          >
            {/* Day */}
            <div className="text-sm text-foreground mb-2 text-center">{day.day}</div>
            
            {/* Weather Icon */}
            <div className="flex justify-center mb-2">{getWeatherIcon(day.condition)}</div>
            
            {/* Temperature */}
            <div className="text-center mb-3">
              <div className="text-xl text-foreground">{day.temp.max}°</div>
              <div className="text-xs text-muted-foreground">{day.temp.min}°</div>
            </div>
            
            {/* Rainfall */}
            {day.rainfall > 0 && (
              <div className="flex items-center justify-center gap-1 text-xs text-blue-500">
                <Droplets className="w-3 h-3" />
                {day.rainfall}mm
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Weather Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <CloudRain className="w-4 h-4 text-blue-500" />
            <div className="text-xs text-muted-foreground">Total Rain</div>
          </div>
          <div className="text-lg text-foreground">{totalRainfall}mm</div>
          <div className="text-xs text-muted-foreground">Next 7 days</div>
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Droplets className="w-4 h-4 text-blue-500" />
            <div className="text-xs text-muted-foreground">Avg Humidity</div>
          </div>
          <div className="text-lg text-foreground">
            {Math.round(forecast.reduce((sum, d) => sum + d.humidity, 0) / forecast.length)}%
          </div>
          <div className="text-xs text-muted-foreground">This week</div>
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Wind className="w-4 h-4 text-gray-500" />
            <div className="text-xs text-muted-foreground">Avg Wind</div>
          </div>
          <div className="text-lg text-foreground">
            {Math.round(forecast.reduce((sum, d) => sum + d.wind, 0) / forecast.length)} km/h
          </div>
          <div className="text-xs text-muted-foreground">This week</div>
        </div>
      </div>

      {/* API Integration Note - Remove in production */}
      <div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
        <div className="text-xs text-muted-foreground">
          💡 <strong>For Production:</strong> Replace mock data with real weather API
          (OpenWeatherMap, WeatherAPI, etc.) by updating the forecast data fetch.
        </div>
      </div>
    </div>
  );
}
