import { motion } from 'motion/react';
import { X, Calendar, MapPin, Sun, Cloud, CloudRain, Wind, Droplets } from 'lucide-react';

interface JournalEntryViewProps {
  entry: any;
  onClose: () => void;
}

export function JournalEntryView({ entry, onClose }: JournalEntryViewProps) {
  const activities: any = {
    sowing: { label: 'Sowing', emoji: '🌱' },
    irrigation: { label: 'Irrigation', emoji: '💧' },
    weeding: { label: 'Weeding', emoji: '🌿' },
    fertilizer: { label: 'Fertilizer', emoji: '🧪' },
    pesticide: { label: 'Pest Control', emoji: '🐛' },
    ploughing: { label: 'Ploughing', emoji: '🚜' },
    pruning: { label: 'Pruning', emoji: '✂️' },
    harvesting: { label: 'Harvesting', emoji: '🌾' },
    'no-work': { label: 'No Work Today', emoji: '❌' },
  };

  const observations: any = {
    healthy: { label: 'Plant Healthy', emoji: '🌿' },
    yellowing: { label: 'Yellowing Leaves', emoji: '🍂' },
    pest: { label: 'Pest Seen', emoji: '🐛' },
    disease: { label: 'Disease Spots', emoji: '🍄' },
    'new-growth': { label: 'New Growth', emoji: '🌱' },
    flowering: { label: 'Flowering Started', emoji: '🌸' },
    unusual: { label: 'Something Unusual', emoji: '⚠️' },
  };

  const weatherIcons: any = {
    sunny: { icon: Sun, label: 'Sunny', color: 'text-yellow-500' },
    cloudy: { icon: Cloud, label: 'Cloudy', color: 'text-gray-500' },
    rain: { icon: CloudRain, label: 'Rained', color: 'text-blue-500' },
    windy: { icon: Wind, label: 'Windy', color: 'text-cyan-500' },
  };

  const weatherInfo = weatherIcons[entry.weather];
  const WeatherIcon = weatherInfo?.icon;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <div>
            <h3 className="text-xl text-foreground mb-1">Journal Entry</h3>
            <p className="text-sm text-muted-foreground">{formatDate(entry.date)}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Field & Crop Info */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <MapPin className="w-4 h-4" />
              Field
            </div>
            <div className="text-foreground font-medium capitalize">
              {entry.field.replace('-', ' ')}
            </div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-muted-foreground text-sm mb-1">Crop</div>
            <div className="text-foreground font-medium capitalize">{entry.crop}</div>
          </div>
        </div>

        {/* Activities */}
        {entry.activities && entry.activities.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-foreground mb-3">
              🧑‍🌾 Activities Done:
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {entry.activities.map((activityId: string) => {
                const activity = activities[activityId];
                if (!activity) return null;
                return (
                  <div
                    key={activityId}
                    className="p-3 bg-primary/10 rounded-lg border border-primary/20"
                  >
                    <div className="text-2xl mb-1">{activity.emoji}</div>
                    <div className="text-xs text-foreground">{activity.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Observations */}
        {entry.observations && entry.observations.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-foreground mb-3">
              👀 Observations:
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {entry.observations.map((obsId: string) => {
                const observation = observations[obsId];
                if (!observation) return null;
                return (
                  <div
                    key={obsId}
                    className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20"
                  >
                    <div className="text-2xl mb-1">{observation.emoji}</div>
                    <div className="text-xs text-foreground">{observation.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Weather */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3">🌦️ Weather:</h4>
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            {WeatherIcon && (
              <WeatherIcon className={`w-8 h-8 ${weatherInfo.color}`} />
            )}
            <div>
              <div className="text-foreground font-medium">{weatherInfo?.label}</div>
              <div className="text-sm text-muted-foreground">Temperature: 32°C</div>
            </div>
          </div>
        </div>

        {/* Water Status */}
        {(entry.waterStatus?.canal !== null || entry.waterStatus?.borewell !== null) && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Droplets className="w-4 h-4" />
              Water Status:
            </h4>
            <div className="space-y-2">
              {entry.waterStatus?.canal !== null && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm text-foreground">Canal water</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      entry.waterStatus.canal
                        ? 'bg-green-500/20 text-green-600'
                        : 'bg-red-500/20 text-red-600'
                    }`}
                  >
                    {entry.waterStatus.canal ? 'Available' : 'Not Available'}
                  </span>
                </div>
              )}
              {entry.waterStatus?.borewell !== null && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm text-foreground">Borewell</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      entry.waterStatus.borewell
                        ? 'bg-green-500/20 text-green-600'
                        : 'bg-red-500/20 text-red-600'
                    }`}
                  >
                    {entry.waterStatus.borewell ? 'Used' : 'Not Used'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        {entry.notes && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-foreground mb-3">📝 Notes:</h4>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-foreground whitespace-pre-wrap">{entry.notes}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-border text-center">
          <div className="text-xs text-muted-foreground">
            Logged at {new Date(entry.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
