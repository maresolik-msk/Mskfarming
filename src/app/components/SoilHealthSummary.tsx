import { motion } from 'motion/react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Droplets, 
  Sprout,
  Download,
  Share2,
  Volume2
} from 'lucide-react';

interface SoilHealthSummaryProps {
  testResults: any;
  onClose: () => void;
  onSaveProfile: () => void;
}

export function SoilHealthSummary({ testResults, onClose, onSaveProfile }: SoilHealthSummaryProps) {
  // AI Interpretation Logic
  const interpretResults = () => {
    if (!testResults) return {};
    const { observation, testType } = testResults;

    // This would be replaced with actual AI/backend logic
    const interpretations: any = {
      texture: {
        sandy: {
          soilIdentity: 'Light & Sandy Soil',
          localName: 'Halki Balui Mitti',
          description: 'Your soil is light and doesn\'t hold water well',
          waterHolding: 'Low',
          goodFor: ['Groundnut', 'Watermelon', 'Carrot', 'Potato'],
          avoidNow: ['Rice', 'Paddy'],
          risks: ['Dries out quickly', 'Nutrients wash away easily'],
          actions: [
            'Add organic matter (compost/manure) - 2 trolley per acre',
            'Water more frequently but less quantity each time',
            'Use mulching to keep moisture',
          ],
          irrigationAdvice: 'Water every 2-3 days in summer',
        },
        loamy: {
          soilIdentity: 'Best Quality Soil (Loamy)',
          localName: 'Sabse Acchi Mitti (Domat)',
          description: 'Congratulations! You have the best soil type for farming',
          waterHolding: 'Perfect',
          goodFor: ['Most crops', 'Vegetables', 'Wheat', 'Cotton', 'Tomato'],
          avoidNow: [],
          risks: [],
          actions: [
            'Maintain organic matter with regular compost',
            'Continue good farming practices',
            'Test every 6 months to maintain quality',
          ],
          irrigationAdvice: 'Water every 5-7 days normally',
        },
        clay: {
          soilIdentity: 'Heavy Clay Soil',
          localName: 'Bhari Chikni Mitti',
          description: 'Your soil holds water very well but can become hard',
          waterHolding: 'Very High',
          goodFor: ['Rice', 'Wheat', 'Cotton', 'Sugarcane'],
          avoidNow: ['Groundnut', 'Root vegetables'],
          risks: ['Can get waterlogged', 'Becomes very hard when dry', 'Poor drainage'],
          actions: [
            'Add organic matter to improve texture',
            'Never over-water - risk of waterlogging',
            'Mix sand or compost to improve drainage',
            'Make raised beds for vegetables',
          ],
          irrigationAdvice: 'Water every 7-10 days, avoid standing water',
        },
      },
      water: {
        fast_drainage: {
          waterBehavior: 'Water drains too fast',
          implication: 'Need to water more often',
          actions: ['Add organic matter to hold water', 'Use mulching'],
        },
        medium_drainage: {
          waterBehavior: 'Perfect water drainage',
          implication: 'Ideal for most crops',
          actions: ['Maintain current practices'],
        },
        slow_drainage: {
          waterBehavior: 'Water stays too long',
          implication: 'Risk of waterlogging',
          actions: ['Improve drainage with channels', 'Add sand or organic matter', 'Make raised beds'],
        },
      },
      moisture: {
        dry: {
          currentStatus: 'Soil is too dry',
          urgentAction: 'Water your field soon - within 1 day',
          riskLevel: 'high',
        },
        adequate: {
          currentStatus: 'Perfect moisture level',
          urgentAction: 'No watering needed now',
          riskLevel: 'low',
        },
        too_wet: {
          currentStatus: 'Too much water',
          urgentAction: 'Do not water. Let it dry for 2-3 days',
          riskLevel: 'medium',
        },
      },
      color: {
        dark_high_organic: {
          organicMatter: 'High (Excellent)',
          meaning: 'Rich in nutrients and organic matter',
          fertility: 'High',
        },
        red_medium_organic: {
          organicMatter: 'Medium (Good)',
          meaning: 'Moderate nutrients, add compost yearly',
          fertility: 'Medium',
        },
        light_low_organic: {
          organicMatter: 'Low (Needs Improvement)',
          meaning: 'Lacking nutrients and organic matter',
          fertility: 'Low',
          urgentAction: 'Add 3-4 trolley compost per acre',
        },
      },
      ph: {
        acidic: {
          phLevel: 'Acidic (Sour)',
          suitable: ['Tea', 'Potato', 'Tomato'],
          action: 'Add lime if growing wheat/cotton',
        },
        neutral: {
          phLevel: 'Neutral (Perfect)',
          suitable: ['Most crops'],
          action: 'Maintain with balanced fertilizers',
        },
        alkaline: {
          phLevel: 'Alkaline (Soapy)',
          suitable: ['Wheat', 'Barley', 'Cotton'],
          action: 'Add organic matter, avoid urea overuse',
        },
      },
    };

    return interpretations[testType]?.[observation] || {};
  };

  const result = interpretResults();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
          <div>
            <h3 className="text-xl text-foreground mb-1">Your Soil Report</h3>
            <p className="text-sm text-muted-foreground">Complete analysis & recommendations</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Banner */}
        <div className="mb-6 p-5 bg-green-500/10 rounded-xl border border-green-500/20">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <div className="text-lg text-foreground font-medium">Test Completed!</div>
          </div>
          <div className="text-sm text-muted-foreground">
            Here's what we learned about your soil
          </div>
        </div>

        {/* Soil Identity */}
        <div className="mb-6 p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-3xl">
              🌱
            </div>
            <div className="flex-1">
              <h4 className="text-2xl text-foreground mb-1">{result.soilIdentity}</h4>
              <p className="text-muted-foreground">{result.localName}</p>
            </div>
          </div>
          <p className="text-foreground">{result.description}</p>
        </div>

        {/* Key Facts */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {result.waterHolding && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-5 h-5 text-primary" />
                <div className="text-sm text-muted-foreground">Water Holding</div>
              </div>
              <div className="text-lg text-foreground">{result.waterHolding}</div>
            </div>
          )}
          {result.fertility && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <div className="text-sm text-muted-foreground">Fertility</div>
              </div>
              <div className="text-lg text-foreground">{result.fertility}</div>
            </div>
          )}
        </div>

        {/* Good For */}
        {result.goodFor && result.goodFor.length > 0 && (
          <div className="mb-6 p-5 bg-green-500/10 rounded-xl border border-green-500/20">
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div className="flex-1">
                <div className="text-foreground font-medium mb-2">Best Crops for Your Soil:</div>
                <div className="flex flex-wrap gap-2">
                  {result.goodFor.map((crop: string) => (
                    <span
                      key={crop}
                      className="px-3 py-1 bg-green-500/20 text-green-700 rounded-full text-sm"
                    >
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Avoid Now */}
        {result.avoidNow && result.avoidNow.length > 0 && (
          <div className="mb-6 p-5 bg-red-500/10 rounded-xl border border-red-500/20">
            <div className="flex items-start gap-3">
              <div className="text-2xl">❌</div>
              <div className="flex-1">
                <div className="text-foreground font-medium mb-2">Not Recommended Right Now:</div>
                <div className="flex flex-wrap gap-2">
                  {result.avoidNow.map((crop: string) => (
                    <span
                      key={crop}
                      className="px-3 py-1 bg-red-500/20 text-red-700 rounded-full text-sm"
                    >
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Risks */}
        {result.risks && result.risks.length > 0 && (
          <div className="mb-6 p-5 bg-orange-500/10 rounded-xl border border-orange-500/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-orange-500 mt-0.5" />
              <div className="flex-1">
                <div className="text-foreground font-medium mb-2">Watch Out For:</div>
                <ul className="space-y-2">
                  {result.risks.map((risk: string, index: number) => (
                    <li key={index} className="text-sm text-foreground flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Actions to Take */}
        {result.actions && result.actions.length > 0 && (
          <div className="mb-6 p-5 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <div className="flex items-start gap-3">
              <div className="text-2xl">📋</div>
              <div className="flex-1">
                <div className="text-foreground font-medium mb-3">What You Should Do:</div>
                <div className="space-y-3">
                  {result.actions.map((action: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-background rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="text-sm text-foreground">{action}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Irrigation Advice */}
        {result.irrigationAdvice && (
          <div className="mb-6 p-5 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl border border-blue-500/20">
            <div className="flex items-start gap-3">
              <Droplets className="w-6 h-6 text-blue-500" />
              <div className="flex-1">
                <div className="text-foreground font-medium mb-1">Irrigation Schedule:</div>
                <div className="text-foreground">{result.irrigationAdvice}</div>
              </div>
            </div>
          </div>
        )}

        {/* Urgent Action */}
        {result.urgentAction && (
          <div className={`mb-6 p-5 rounded-xl border ${
            result.riskLevel === 'high'
              ? 'bg-red-500/10 border-red-500/20'
              : result.riskLevel === 'medium'
              ? 'bg-orange-500/10 border-orange-500/20'
              : 'bg-green-500/10 border-green-500/20'
          }`}>
            <div className="flex items-start gap-3">
              <div className="text-2xl">
                {result.riskLevel === 'high' ? '🚨' : result.riskLevel === 'medium' ? '⚠️' : '✅'}
              </div>
              <div className="flex-1">
                <div className="text-foreground font-medium mb-1">Right Now:</div>
                <div className="text-foreground">{result.urgentAction}</div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {/* Voice */}
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-blue-500/10 text-blue-600 rounded-lg hover:bg-blue-500/20 transition-colors border border-blue-500/20">
            <Volume2 className="w-5 h-5" />
            Listen to Report
          </button>

          {/* Save Profile */}
          <button
            onClick={onSaveProfile}
            className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
          >
            <CheckCircle2 className="w-5 h-5" />
            Save to My Soil Profile
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-border text-center">
          <div className="text-sm text-muted-foreground">
            Test again in 6 months to track improvement
          </div>
        </div>
      </motion.div>
    </div>
  );
}