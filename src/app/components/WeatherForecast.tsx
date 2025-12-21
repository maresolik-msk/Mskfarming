import { motion } from 'motion/react';
import { Cloud, CloudRain, Sun, Wind, Droplets, AlertTriangle, ChevronRight } from 'lucide-react';

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
  // Mock weather data
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
      day: 'Tom',
      date: 'Dec 22',
      temp: { min: 19, max: 29 },
      condition: 'sunny',
      rainfall: 0,
      humidity: 60,
      wind: 10,
    },
    {
      day: 'Mon',
      date: 'Dec 23',
      temp: { min: 20, max: 30 },
      condition: 'cloudy',
      rainfall: 0,
      humidity: 70,
      wind: 15,
    },
    {
      day: 'Tue',
      date: 'Dec 24',
      temp: { min: 21, max: 28 },
      condition: 'rainy',
      rainfall: 15,
      humidity: 85,
      wind: 20,
    },
    {
      day: 'Wed',
      date: 'Dec 25',
      temp: { min: 20, max: 26 },
      condition: 'rainy',
      rainfall: 25,
      humidity: 90,
      wind: 18,
    },
    {
      day: 'Thu',
      date: 'Dec 26',
      temp: { min: 19, max: 27 },
      condition: 'cloudy',
      rainfall: 5,
      humidity: 75,
      wind: 14,
    },
    {
      day: 'Fri',
      date: 'Dec 27',
      temp: { min: 18, max: 28 },
      condition: 'sunny',
      rainfall: 0,
      humidity: 68,
      wind: 12,
    },
  ];

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
              key={day.date}
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
