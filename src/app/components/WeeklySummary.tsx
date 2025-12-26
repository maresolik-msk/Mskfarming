import { motion } from 'motion/react';
import { X, Calendar, TrendingUp, Activity, Eye, AlertCircle, Lightbulb } from 'lucide-react';

interface WeeklySummaryProps {
  entries: any[];
  onClose: () => void;
}

export function WeeklySummary({ entries = [], onClose }: WeeklySummaryProps) {
  // Get last 7 days of entries
  const getLastWeekEntries = () => {
    if (!Array.isArray(entries)) return [];
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= lastWeek && entryDate <= today;
    });
  };

  const weekEntries = getLastWeekEntries();

  // Calculate statistics
  const totalActivities = weekEntries.reduce(
    (sum, entry) => sum + (entry.activities?.length || 0),
    0
  );

  const totalObservations = weekEntries.reduce(
    (sum, entry) => sum + (entry.observations?.length || 0),
    0
  );

  const issuesFound = weekEntries.filter(entry =>
    entry.observations?.some((o: string) => ['pest', 'disease', 'unusual', 'yellowing'].includes(o))
  ).length;

  const irrigationDays = weekEntries.filter(entry =>
    entry.activities?.includes('irrigation')
  ).length;

  // Weather summary
  const weatherCount: any = {};
  weekEntries.forEach(entry => {
    weatherCount[entry.weather] = (weatherCount[entry.weather] || 0) + 1;
  });
  const dominantWeather = Object.keys(weatherCount).reduce((a, b) =>
    weatherCount[a] > weatherCount[b] ? a : b
  , 'sunny');

  // Generate AI advice
  const generateAdvice = () => {
    const advice = [];

    // Check irrigation pattern
    if (irrigationDays === 0) {
      advice.push({
        type: 'warning',
        message: 'No irrigation logged this week. Check if plants need water.',
      });
    } else if (irrigationDays > 5) {
      advice.push({
        type: 'caution',
        message: 'High irrigation frequency. Watch for waterlogging.',
      });
    } else {
      advice.push({
        type: 'success',
        message: 'Good irrigation schedule maintained.',
      });
    }

    // Check for issues
    if (issuesFound > 0) {
      advice.push({
        type: 'alert',
        message: `${issuesFound} issue(s) detected. Consider consulting an expert.`,
      });
    }

    // Weather-based advice
    if (dominantWeather === 'rain') {
      advice.push({
        type: 'info',
        message: 'Rainy week. Avoid fertilizer application and watch for fungal diseases.',
      });
    } else if (dominantWeather === 'sunny') {
      advice.push({
        type: 'info',
        message: 'Sunny week. Ensure adequate irrigation and mulching.',
      });
    }

    // Activity check
    const hasWeeding = weekEntries.some(e => e.activities?.includes('weeding'));
    if (!hasWeeding && weekEntries.length > 0) {
      advice.push({
        type: 'suggestion',
        message: 'No weeding logged. Check if field needs cleaning.',
      });
    }

    return advice;
  };

  const advice = generateAdvice();

  const getAdviceColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20 text-green-600';
      case 'warning':
        return 'bg-orange-500/10 border-orange-500/20 text-orange-600';
      case 'alert':
        return 'bg-red-500/10 border-red-500/20 text-red-600';
      case 'caution':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600';
      default:
        return 'bg-blue-500/10 border-blue-500/20 text-blue-600';
    }
  };

  const getAdviceIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
      case 'caution':
        return '⚠️';
      case 'alert':
        return '🚨';
      default:
        return '💡';
    }
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
            <h3 className="text-xl text-foreground mb-1">Weekly Summary</h3>
            <p className="text-sm text-muted-foreground">Last 7 days overview</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Entries Logged</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{weekEntries.length}</div>
            <div className="text-xs text-muted-foreground mt-1">out of 7 days</div>
          </div>

          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-muted-foreground">Activities</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{totalActivities}</div>
            <div className="text-xs text-muted-foreground mt-1">total tasks done</div>
          </div>

          <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-green-500" />
              <span className="text-sm text-muted-foreground">Observations</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{totalObservations}</div>
            <div className="text-xs text-muted-foreground mt-1">things noticed</div>
          </div>

          <div className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-xl border border-orange-500/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-muted-foreground">Issues</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{issuesFound}</div>
            <div className="text-xs text-muted-foreground mt-1">problems detected</div>
          </div>
        </div>

        {/* Weather Summary */}
        <div className="mb-6 p-5 bg-muted rounded-xl">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            🌦️ Weather This Week
          </h4>
          <div className="flex items-center gap-2 flex-wrap">
            {Object.entries(weatherCount).map(([weather, count]: [string, any]) => (
              <div
                key={weather}
                className="px-3 py-2 bg-background rounded-lg border border-border"
              >
                <span className="text-sm text-foreground capitalize">{weather}</span>
                <span className="ml-2 text-xs text-muted-foreground">({count} days)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Crop Condition Trend */}
        <div className="mb-6 p-5 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl border border-green-500/20">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Crop Condition Trend
          </h4>
          <div className="text-foreground">
            {issuesFound === 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌿</span>
                <span>Plants looking healthy overall. Keep up the good work!</span>
              </div>
            ) : issuesFound <= 2 ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                <span>Some issues noticed. Monitor closely and take action if needed.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚨</span>
                <span>Multiple issues detected. Consider consulting an expert soon.</span>
              </div>
            )}
          </div>
        </div>

        {/* AI Advice */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Advice for You
          </h4>
          <div className="space-y-3">
            {advice.map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border ${getAdviceColor(item.type)}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{getAdviceIcon(item.type)}</span>
                  <p className="text-sm flex-1">{item.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Breakdown */}
        {totalActivities > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-foreground mb-3">
              📊 Most Common Activities
            </h4>
            <div className="space-y-2">
              {['irrigation', 'weeding', 'fertilizer', 'pesticide'].map((activity) => {
                const count = weekEntries.filter(e => e.activities?.includes(activity)).length;
                if (count === 0) return null;
                
                const activityLabels: any = {
                  irrigation: { label: 'Irrigation', emoji: '💧' },
                  weeding: { label: 'Weeding', emoji: '🌿' },
                  fertilizer: { label: 'Fertilizer', emoji: '🧪' },
                  pesticide: { label: 'Pest Control', emoji: '🐛' },
                };

                const info = activityLabels[activity];
                const percentage = (count / weekEntries.length) * 100;

                return (
                  <div key={activity} className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{info.emoji}</span>
                        <span className="text-sm text-foreground">{info.label}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {count} {count === 1 ? 'time' : 'times'}
                      </span>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Message */}
        <div className="pt-4 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Keep logging daily to get better insights and track your farm's progress! 🌾
          </p>
        </div>
      </motion.div>
    </div>
  );
}
