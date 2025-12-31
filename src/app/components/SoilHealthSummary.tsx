import { useState } from 'react';
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
  Volume2,
  ChevronRight
} from 'lucide-react';

interface SoilHealthSummaryProps {
  testResults: any;
  onClose: () => void;
  onSaveProfile: (fieldId: string, result: any) => void;
  fields: any[];
  isSaved?: boolean;
}

export function SoilHealthSummary({ testResults, onClose, onSaveProfile, fields, isSaved = false }: SoilHealthSummaryProps) {
  const [selectedFieldId, setSelectedFieldId] = useState<string>(fields.length > 0 ? fields[0].id : '');

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
          riskLevel: 'medium',
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
          riskLevel: 'low',
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
          riskLevel: 'medium',
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
          riskLevel: 'medium',
          actions: ['Add organic matter to hold water', 'Use mulching'],
        },
        medium_drainage: {
          waterBehavior: 'Perfect water drainage',
          implication: 'Ideal for most crops',
          riskLevel: 'low',
          actions: ['Maintain current practices'],
        },
        slow_drainage: {
          waterBehavior: 'Water stays too long',
          implication: 'Risk of waterlogging',
          riskLevel: 'high',
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
          riskLevel: 'low',
        },
        red_medium_organic: {
          organicMatter: 'Medium (Good)',
          meaning: 'Moderate nutrients, add compost yearly',
          fertility: 'Medium',
          riskLevel: 'low',
        },
        light_low_organic: {
          organicMatter: 'Low (Needs Improvement)',
          meaning: 'Lacking nutrients and organic matter',
          fertility: 'Low',
          urgentAction: 'Add 3-4 trolley compost per acre',
          riskLevel: 'high',
        },
      },
      ph: {
        acidic: {
          phLevel: 'Acidic (Sour)',
          suitable: ['Tea', 'Potato', 'Tomato'],
          action: 'Add lime if growing wheat/cotton',
          riskLevel: 'medium',
        },
        neutral: {
          phLevel: 'Neutral (Perfect)',
          suitable: ['Most crops'],
          action: 'Maintain with balanced fertilizers',
          riskLevel: 'low',
        },
        alkaline: {
          phLevel: 'Alkaline (Soapy)',
          suitable: ['Wheat', 'Barley', 'Cotton'],
          action: 'Add organic matter, avoid urea overuse',
          riskLevel: 'medium',
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
        className="bg-card rounded-3xl p-0 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-hidden flex flex-col ring-1 ring-white/10"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 bg-card/95 backdrop-blur-sm border-b border-border shrink-0 z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">📋</span>
                <h3 className="text-xl font-bold text-foreground font-[Megrim]">Your Soil Report</h3>
            </div>
            <p className="text-sm text-muted-foreground">MILA AI Analysis & Recommendations</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1 space-y-6 scrollbar-hide">
            {/* Success Banner */}
            <div className="p-5 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 rounded-2xl border border-emerald-500/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/20">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <div className="text-lg text-foreground font-bold">Test Completed Successfully!</div>
                        <div className="text-sm text-muted-foreground">
                            Here is the detailed breakdown of your soil health.
                        </div>
                    </div>
                </div>
            </div>

            {/* Soil Identity */}
            <div className="p-6 bg-gradient-to-br from-[#812F0F]/10 to-transparent rounded-2xl border border-[#812F0F]/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#812F0F]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-start gap-5 relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-[#812F0F]/10 flex items-center justify-center text-4xl border border-[#812F0F]/20 shadow-inner shrink-0">
                🌱
                </div>
                <div className="flex-1">
                <h4 className="text-2xl font-bold text-foreground mb-1 font-[Megrim]">{result.soilIdentity}</h4>
                <p className="text-[#812F0F] font-medium text-sm mb-3 uppercase tracking-wide">{result.localName}</p>
                <p className="text-foreground/80 leading-relaxed text-sm">{result.description}</p>
                </div>
            </div>
            </div>

            {/* Key Facts */}
            <div className="grid grid-cols-2 gap-4">
            {result.waterHolding && (
                <div className="p-4 bg-card rounded-2xl border border-border/50 hover:border-blue-500/30 transition-colors group">
                <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                        <Droplets className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Water Holding</div>
                </div>
                <div className="text-xl font-bold text-foreground pl-1">{result.waterHolding}</div>
                </div>
            )}
            {result.fertility && (
                <div className="p-4 bg-card rounded-2xl border border-border/50 hover:border-amber-500/30 transition-colors group">
                <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                        <TrendingUp className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Fertility</div>
                </div>
                <div className="text-xl font-bold text-foreground pl-1">{result.fertility}</div>
                </div>
            )}
            </div>

            {/* Good For */}
            {result.goodFor && result.goodFor.length > 0 && (
            <div className="p-5 bg-card rounded-2xl border border-border/50">
                <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                    <span className="text-xl">✅</span>
                </div>
                <div className="flex-1">
                    <div className="text-foreground font-bold mb-3">Best Crops for Your Soil</div>
                    <div className="flex flex-wrap gap-2">
                    {result.goodFor.map((crop: string) => (
                        <span
                        key={crop}
                        className="px-3 py-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 rounded-lg text-sm font-medium"
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
            <div className="p-5 bg-card rounded-2xl border border-border/50">
                <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
                    <span className="text-xl">❌</span>
                </div>
                <div className="flex-1">
                    <div className="text-foreground font-bold mb-3">Not Recommended Right Now</div>
                    <div className="flex flex-wrap gap-2">
                    {result.avoidNow.map((crop: string) => (
                        <span
                        key={crop}
                        className="px-3 py-1.5 bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20 rounded-lg text-sm font-medium"
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
            <div className="p-5 bg-orange-500/5 rounded-2xl border border-orange-500/10">
                <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20">
                    <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                    <div className="text-foreground font-bold mb-3">Watch Out For</div>
                    <ul className="space-y-2.5">
                    {result.risks.map((risk: string, index: number) => (
                        <li key={index} className="text-sm text-foreground/80 flex items-start gap-2.5 bg-card/50 p-2 rounded-lg border border-orange-500/10">
                        <span className="text-orange-500 mt-0.5">•</span>
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
            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl border border-blue-500/10">
                <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                    <span className="text-xl">📋</span>
                </div>
                <div className="flex-1">
                    <div className="text-foreground font-bold mb-4">Recommended Actions</div>
                    <div className="space-y-3">
                    {result.actions.map((action: string, index: number) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-card rounded-xl border border-blue-500/10 shadow-sm">
                        <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm">
                            {index + 1}
                        </div>
                        <div className="text-sm text-foreground/90 leading-relaxed">{action}</div>
                        </div>
                    ))}
                    </div>
                </div>
                </div>
            </div>
            )}

            {/* Irrigation Advice */}
            {result.irrigationAdvice && (
            <div className="p-5 bg-cyan-500/5 rounded-2xl border border-cyan-500/10">
                <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20">
                    <Droplets className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="flex-1">
                    <div className="text-foreground font-bold mb-1">Irrigation Schedule</div>
                    <div className="text-foreground/80 text-sm leading-relaxed">{result.irrigationAdvice}</div>
                </div>
                </div>
            </div>
            )}

            {/* Urgent Action */}
            {result.urgentAction && (
            <div className={`p-5 rounded-2xl border flex items-start gap-4 ${
                result.riskLevel === 'high'
                ? 'bg-red-500/5 border-red-500/20'
                : result.riskLevel === 'medium'
                ? 'bg-orange-500/5 border-orange-500/20'
                : 'bg-emerald-500/5 border-emerald-500/20'
            }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border text-xl ${
                    result.riskLevel === 'high' 
                    ? 'bg-red-500/10 border-red-500/20' 
                    : result.riskLevel === 'medium' 
                    ? 'bg-orange-500/10 border-orange-500/20' 
                    : 'bg-emerald-500/10 border-emerald-500/20'
                }`}>
                    {result.riskLevel === 'high' ? '🚨' : result.riskLevel === 'medium' ? '⚠️' : '✅'}
                </div>
                <div className="flex-1">
                    <div className="text-foreground font-bold mb-1">Immediate Action Required</div>
                    <div className="text-foreground/80 text-sm font-medium">{result.urgentAction}</div>
                </div>
            </div>
            )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-4 bg-card border-t border-border shrink-0 space-y-4">
          {/* Voice */}
          <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-muted/50 text-foreground/70 rounded-xl hover:bg-muted transition-colors border border-border/50 font-medium group">
            <div className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Volume2 className="w-3.5 h-3.5" />
            </div>
            Listen to Report
          </button>

          {/* Save Profile Section - Only show if not already saved/viewing mode */}
          {!isSaved && (
            <>
              {fields && fields.length > 0 ? (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                    Save Results To Field:
                  </label>
                  <div className="relative">
                    <select
                        value={selectedFieldId}
                        onChange={(e) => setSelectedFieldId(e.target.value)}
                        className="w-full p-4 bg-background border border-border rounded-xl text-foreground appearance-none cursor-pointer hover:border-[#812F0F]/50 focus:ring-2 focus:ring-[#812F0F]/20 focus:border-[#812F0F] outline-none transition-all font-medium"
                    >
                        {fields.map((field) => (
                        <option key={field.id} value={field.id}>
                            {field.name} ({field.crop || 'No crop'})
                        </option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                        <ChevronRight className="w-4 h-4 rotate-90" />
                    </div>
                  </div>
                </div>
              ) : (
                 <div className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  You need to add a field in the dashboard before you can save this profile.
                </div>
              )}

              <button
                onClick={() => onSaveProfile(selectedFieldId, result)}
                disabled={!selectedFieldId}
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#812F0F] text-white rounded-xl hover:bg-[#963714] transition-all shadow-lg shadow-[#812F0F]/20 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
              >
                <CheckCircle2 className="w-5 h-5" />
                Save to My Soil Profile
              </button>
            </>
          )}

          {/* View Mode Actions */}
          {isSaved && (
            <button
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-4 bg-muted hover:bg-muted/80 text-foreground rounded-xl transition-all font-bold"
            >
                Close Report
            </button>
          )}
          
          <div className="text-center">
            <div className="text-xs font-medium text-muted-foreground bg-muted/30 py-2 px-4 rounded-full inline-block">
                Test again in 6 months to track improvement
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}