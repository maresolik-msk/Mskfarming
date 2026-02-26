import { Sprout, ChevronRight, TrendingUp, CircleAlert } from 'lucide-react';

interface SoilHealthCardProps {
  onTestSoil: () => void;
}

export function SoilHealthCard({ onTestSoil }: SoilHealthCardProps) {
  // Mock data - in production, fetch from API
  const hasTestResult = true;
  const lastTest = {
    date: new Date('2024-06-15'),
    healthScore: 72,
    status: 'moderate' as 'good' | 'moderate' | 'poor',
    nextTestDue: new Date('2024-12-15'),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'moderate':
        return 'text-orange-500';
      case 'poor':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-500/10 border-green-500/20';
      case 'moderate':
        return 'bg-orange-500/10 border-orange-500/20';
      case 'poor':
        return 'bg-red-500/10 border-red-500/20';
      default:
        return 'bg-muted';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'good':
        return 'Good';
      case 'moderate':
        return 'Moderate';
      case 'poor':
        return 'Poor';
      default:
        return 'Unknown';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'good':
        return '🟢';
      case 'moderate':
        return '🟡';
      case 'poor':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const isDueForTest = () => {
    if (!hasTestResult) return true;
    const monthsSinceTest = (Date.now() - lastTest.date.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return monthsSinceTest >= 6; // Test every 6 months
  };

  return (
    <div
      className="bg-card rounded-2xl p-6 border border-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Sprout className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl text-foreground">Soil Health</h3>
            <p className="text-sm text-muted-foreground">Know your soil better</p>
          </div>
        </div>
      </div>

      {hasTestResult ? (
        <>
          {/* Health Score */}
          <div className="mb-4">
            <div className="flex items-end gap-3 mb-2">
              <div className={`text-4xl ${getStatusColor(lastTest.status)}`}>
                {lastTest.healthScore}
              </div>
              <div className="pb-1">
                <div className="text-sm text-muted-foreground">out of 100</div>
              </div>
            </div>

            {/* Status Badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusBg(lastTest.status)}`}>
              <span className="text-lg">{getStatusEmoji(lastTest.status)}</span>
              <span className={`text-sm ${getStatusColor(lastTest.status)}`}>
                {getStatusText(lastTest.status)} Health
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                initial={{ width: 0 }}
                animate={{ width: `${lastTest.healthScore}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className={`h-full ${
                  lastTest.status === 'good'
                    ? 'bg-green-500'
                    : lastTest.status === 'moderate'
                    ? 'bg-orange-500'
                    : 'bg-red-500'
                }`}
              />
            </div>
          </div>

          {/* Last Test Info */}
          <div className="flex items-start gap-2 mb-4 p-3 bg-muted rounded-lg">
            <div className="flex-1">
              <div className="text-sm text-muted-foreground mb-1">Last Tested</div>
              <div className="text-foreground">
                {lastTest.date.toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {Math.floor((Date.now() - lastTest.date.getTime()) / (1000 * 60 * 60 * 24))} days ago
              </div>
            </div>
            {isDueForTest() && (
              <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/10 rounded-lg">
                <CircleAlert className="w-4 h-4 text-orange-500" />
                <span className="text-xs text-orange-500">Due for test</span>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Nitrogen</div>
              <div className="flex items-center gap-1">
                <span className="text-lg">🟡</span>
                <span className="text-sm text-foreground">Medium</span>
              </div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Phosphorus</div>
              <div className="flex items-center gap-1">
                <span className="text-lg">🔴</span>
                <span className="text-sm text-foreground">Low</span>
              </div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">pH Level</div>
              <div className="flex items-center gap-1">
                <span className="text-lg">🟢</span>
                <span className="text-sm text-foreground">Good</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* No Test Result */
        <div className="mb-4">
          <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20 mb-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <div className="text-foreground mb-1">Why test your soil?</div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Increase crop yield by 20-30%</li>
                  <li>• Save money on fertilizers</li>
                  <li>• Know exactly what your soil needs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <button
        onClick={onTestSoil}
        className="w-full flex items-center justify-between px-5 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Sprout className="w-5 h-5" />
          <span className="font-medium">
            {hasTestResult ? 'Test Soil Again' : 'Test Your Soil'}
          </span>
        </div>
        <ChevronRight className="w-5 h-5" />
      </button>

      {hasTestResult && (
        <button className="w-full mt-3 py-2 text-sm text-primary hover:underline">
          View Full Report
        </button>
      )}
    </div>
  );
}