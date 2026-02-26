import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  CircleCheck, 
  CircleAlert, 
  TrendingUp, 
  Droplets, 
  Sprout,
  Volume2,
  ChevronRight,
  Loader2,
  Zap,
  Target,
  ShieldAlert,
  Beaker,
  Leaf,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { analyzeSoilComposite } from '../../lib/api';

interface SoilHealthSummaryProps {
  testResults: any;
  onClose: () => void;
  onSaveProfile: (fieldId: string, result: any) => void;
  fields: any[];
  isSaved?: boolean;
  accumulatedTests?: Record<string, string>;
  onRunAnotherTest?: () => void;
}

export function SoilHealthSummary({ testResults, onClose, onSaveProfile, fields, isSaved = false, accumulatedTests = {}, onRunAnotherTest }: SoilHealthSummaryProps) {
  const [selectedFieldId, setSelectedFieldId] = useState<string>(fields.length > 0 ? fields[0].id : '');
  const [compositeAnalysis, setCompositeAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showComposite, setShowComposite] = useState(false);

  const testCount = Object.keys(accumulatedTests).length;

  // Run comprehensive backend analysis
  const handleRunCompositeAnalysis = async () => {
    if (testCount === 0) { toast.error('Complete at least one soil test first'); return; }
    setAnalyzing(true);
    try {
      const res = await analyzeSoilComposite({ tests: accumulatedTests });
      if (res.success && res.analysis) {
        setCompositeAnalysis(res.analysis);
        setShowComposite(true);
        toast.success('Comprehensive analysis complete!');
      } else {
        toast.error(res.error || 'Analysis failed');
      }
    } catch (e: any) {
      toast.error(e.message || 'Network error');
    } finally {
      setAnalyzing(false);
    }
  };

  // AI Interpretation Logic
  const interpretResults = () => {
    if (!testResults) return {};
    const { observation, testType } = testResults;

    const interpretations: any = {
      texture: {
        sandy: {
          soilIdentity: 'Light & Sandy Soil',
          localName: 'Halki Balui Mitti',
          description: 'Your soil is light and doesn\'t hold water well. Nutrients wash away quickly.',
          waterHolding: 'Low',
          goodFor: ['Groundnut', 'Watermelon', 'Carrot', 'Potato'],
          avoidNow: ['Rice', 'Paddy'],
          risks: ['Dries out quickly', 'Nutrients wash away easily', 'Low organic matter retention'],
          riskLevel: 'medium',
          actions: [
            'Add organic matter (compost/manure) - 2 trolley per acre',
            'Water more frequently but less quantity each time',
            'Use mulching to keep moisture',
            'Apply split-dose fertilizers (not all at once)',
          ],
          irrigationAdvice: 'Water every 2-3 days in summer. Drip irrigation recommended.',
        },
        sandy_loam: {
          soilIdentity: 'Sandy Loam Soil',
          localName: 'Halki Domat Mitti',
          description: 'Good workable soil with slight sandiness. Drains well but holds some moisture.',
          waterHolding: 'Low-Medium',
          goodFor: ['Vegetables', 'Pulses', 'Groundnut', 'Potato', 'Maize'],
          avoidNow: [],
          risks: ['Can dry out in summer', 'May need extra fertilizer'],
          riskLevel: 'low',
          actions: ['Add compost yearly', 'Mulch during summer', 'Regular irrigation schedule'],
          irrigationAdvice: 'Water every 3-4 days in summer',
        },
        loamy: {
          soilIdentity: 'Best Quality Soil (Loamy)',
          localName: 'Sabse Acchi Mitti (Domat)',
          description: 'Congratulations! You have the best soil type for farming. Perfect balance of sand, silt, and clay.',
          waterHolding: 'Perfect',
          goodFor: ['Most crops', 'Vegetables', 'Wheat', 'Cotton', 'Tomato'],
          avoidNow: [],
          risks: [],
          riskLevel: 'low',
          actions: ['Maintain organic matter with regular compost', 'Continue good farming practices', 'Test every 6 months to maintain quality'],
          irrigationAdvice: 'Water every 5-7 days normally',
        },
        silt_loam: {
          soilIdentity: 'Silky Silt Loam',
          localName: 'Mulayam Domat Mitti',
          description: 'Smooth, silky soil that holds moisture well. Good for most crops with proper drainage.',
          waterHolding: 'Medium-High',
          goodFor: ['Wheat', 'Vegetables', 'Fruits', 'Pulses'],
          avoidNow: [],
          risks: ['Can form crust on surface', 'Susceptible to wind erosion when dry'],
          riskLevel: 'low',
          actions: ['Maintain soil cover', 'Add organic matter', 'Avoid leaving soil bare'],
          irrigationAdvice: 'Water every 5-7 days',
        },
        clay_loam: {
          soilIdentity: 'Clay Loam Soil',
          localName: 'Chikni Domat Mitti',
          description: 'Good fertile soil with higher clay content. Holds nutrients well but watch for drainage.',
          waterHolding: 'High',
          goodFor: ['Wheat', 'Rice', 'Cotton', 'Soybean'],
          avoidNow: ['Root vegetables (difficult)'],
          risks: ['Can get waterlogged in monsoon', 'Becomes sticky when wet'],
          riskLevel: 'low',
          actions: ['Ensure proper drainage', 'Add compost to improve structure', 'Use raised beds for vegetables'],
          irrigationAdvice: 'Water every 7-8 days, ensure drainage',
        },
        clay: {
          soilIdentity: 'Heavy Clay Soil',
          localName: 'Bhari Chikni Mitti',
          description: 'Your soil holds water very well but can become hard. Rich in nutrients but difficult to work.',
          waterHolding: 'Very High',
          goodFor: ['Rice', 'Wheat', 'Cotton', 'Sugarcane'],
          avoidNow: ['Groundnut', 'Root vegetables', 'Carrot'],
          risks: ['Can get waterlogged', 'Becomes very hard when dry', 'Poor drainage', 'Risk of compaction'],
          riskLevel: 'medium',
          actions: ['Add organic matter to improve texture', 'Never over-water', 'Mix sand or compost to improve drainage', 'Make raised beds for vegetables'],
          irrigationAdvice: 'Water every 7-10 days, avoid standing water',
        },
        silty_clay: {
          soilIdentity: 'Silty Clay Soil',
          localName: 'Chikni Mitti',
          description: 'Very fine, sticky soil. Holds water and nutrients very well but drainage is poor.',
          waterHolding: 'Very High',
          goodFor: ['Rice', 'Jute', 'Wheat'],
          avoidNow: ['Root vegetables', 'Groundnut'],
          risks: ['Very poor drainage', 'Difficult to work', 'Waterlogging risk', 'Cracks when dry'],
          riskLevel: 'medium',
          actions: ['Build drainage channels', 'Add sand + compost mix', 'Use broad bed & furrow system'],
          irrigationAdvice: 'Water infrequently, every 10+ days. Avoid flood irrigation.',
        },
      },
      water: {
        very_fast: {
          waterBehavior: 'Water drains extremely fast',
          implication: 'Severe moisture loss, nutrients leach rapidly',
          riskLevel: 'high',
          actions: ['Add heavy organic matter', 'Use drip irrigation', 'Apply mulch 4-5 cm thick'],
        },
        fast_drainage: {
          waterBehavior: 'Water drains faster than ideal',
          implication: 'Need to water more often, some nutrient loss',
          riskLevel: 'medium',
          actions: ['Add organic matter to hold water', 'Use mulching', 'Consider drip irrigation'],
        },
        medium_drainage: {
          waterBehavior: 'Perfect water drainage',
          implication: 'Ideal for most crops — good balance',
          riskLevel: 'low',
          actions: ['Maintain current practices', 'Keep adding organic matter'],
        },
        slow_drainage: {
          waterBehavior: 'Water stays too long',
          implication: 'Risk of waterlogging and root diseases',
          riskLevel: 'high',
          actions: ['Improve drainage with channels', 'Add sand or organic matter', 'Make raised beds'],
        },
        very_slow: {
          waterBehavior: 'Water barely drains — waterlogged risk',
          implication: 'Serious waterlogging. Most crops will suffer.',
          riskLevel: 'high',
          actions: ['Build drainage channels urgently', 'Raised bed farming', 'Deep ploughing to break hardpan', 'Only grow water-loving crops like rice'],
        },
      },
      moisture: {
        bone_dry: {
          currentStatus: 'Critically dry — soil has no moisture',
          urgentAction: 'Irrigate immediately! Crops under severe stress.',
          riskLevel: 'high',
        },
        dry: {
          currentStatus: 'Soil is too dry',
          urgentAction: 'Water your field soon — within 1 day',
          riskLevel: 'high',
        },
        slightly_moist: {
          currentStatus: 'Soil has some moisture but needs more',
          urgentAction: 'Plan irrigation within 2 days for most crops',
          riskLevel: 'medium',
        },
        adequate: {
          currentStatus: 'Perfect moisture level',
          urgentAction: 'No watering needed now. Check again in 3-4 days.',
          riskLevel: 'low',
        },
        moist: {
          currentStatus: 'Well moistened soil',
          urgentAction: 'Soil is well watered. No irrigation needed for several days.',
          riskLevel: 'low',
        },
        too_wet: {
          currentStatus: 'Too much water',
          urgentAction: 'Do not water. Let it dry for 2-3 days.',
          riskLevel: 'medium',
        },
        waterlogged: {
          currentStatus: 'Soil is waterlogged — standing water present',
          urgentAction: 'STOP all irrigation. Create drainage channels immediately.',
          riskLevel: 'high',
        },
      },
      color: {
        dark_high_organic: {
          organicMatter: 'High (Excellent)',
          meaning: 'Rich in nutrients and organic matter — excellent soil biology',
          fertility: 'High',
          riskLevel: 'low',
        },
        dark_brown: {
          organicMatter: 'Medium-High (Good)',
          meaning: 'Good organic content. Maintain with annual compost.',
          fertility: 'Medium-High',
          riskLevel: 'low',
        },
        red_medium_organic: {
          organicMatter: 'Medium',
          meaning: 'Iron-rich soil with moderate nutrients. Add compost yearly.',
          fertility: 'Medium',
          riskLevel: 'low',
        },
        yellow_orange: {
          organicMatter: 'Low-Medium',
          meaning: 'Leached soil — nutrients have washed out over time. Needs organic matter.',
          fertility: 'Low-Medium',
          urgentAction: 'Add 2-3 trolley compost per acre',
          riskLevel: 'medium',
        },
        light_low_organic: {
          organicMatter: 'Low (Needs Improvement)',
          meaning: 'Lacking nutrients and organic matter. Soil biology is weak.',
          fertility: 'Low',
          urgentAction: 'Add 3-4 trolley compost per acre urgently',
          riskLevel: 'high',
        },
        white_grey: {
          organicMatter: 'Very Low (Critical)',
          meaning: 'White crust or grey color indicates salt-affected or degraded soil.',
          fertility: 'Very Low',
          urgentAction: 'Apply gypsum + organic matter immediately. Get lab salinity test.',
          riskLevel: 'high',
        },
      },
      ph: {
        very_acidic: {
          phLevel: 'Strongly Acidic (pH 4-5)',
          suitable: ['Tea', 'Blueberry', 'Potato'],
          action: 'Apply agricultural lime 2-3 tonnes/acre before sowing',
          riskLevel: 'high',
        },
        acidic: {
          phLevel: 'Moderately Acidic (pH 5-6)',
          suitable: ['Tea', 'Potato', 'Tomato', 'Coffee'],
          action: 'Add lime if growing wheat/cotton/pulses',
          riskLevel: 'medium',
        },
        slightly_acidic: {
          phLevel: 'Slightly Acidic (pH 6-6.5)',
          suitable: ['Most crops', 'Vegetables', 'Fruits'],
          action: 'Good range! Most crops do well. Small lime dose if growing legumes.',
          riskLevel: 'low',
        },
        neutral: {
          phLevel: 'Neutral (Perfect) (pH 6.5-7.5)',
          suitable: ['All crops'],
          action: 'Maintain with balanced fertilizers. Ideal for all crops!',
          riskLevel: 'low',
        },
        slightly_alkaline: {
          phLevel: 'Slightly Alkaline (pH 7.5-8)',
          suitable: ['Wheat', 'Cotton', 'Barley', 'Sugarcane'],
          action: 'Add organic matter, watch for zinc/iron deficiency',
          riskLevel: 'low',
        },
        alkaline: {
          phLevel: 'Moderately Alkaline (pH 8-8.5)',
          suitable: ['Wheat', 'Barley', 'Cotton'],
          action: 'Add organic matter and gypsum. Apply zinc and iron foliar sprays.',
          riskLevel: 'medium',
        },
        very_alkaline: {
          phLevel: 'Strongly Alkaline (pH 8.5+)',
          suitable: ['Only salt-tolerant varieties'],
          action: 'Apply gypsum 2-4 tonnes/acre + organic matter. Serious micronutrient lock-up.',
          riskLevel: 'high',
        },
      },
      smell: {
        earthy_sweet: {
          biology: 'Excellent — rich microbial life',
          riskLevel: 'low',
          actions: ['Maintain current practices'],
        },
        earthy_mild: {
          biology: 'Good microbial activity',
          riskLevel: 'low',
          actions: ['Add compost to boost biology further'],
        },
        no_smell: {
          biology: 'Low microbial activity',
          riskLevel: 'medium',
          actions: ['Add compost and jeevamrit', 'Avoid chemical-only farming'],
        },
        sour_rotten: {
          biology: 'Anaerobic conditions — waterlogged',
          urgentAction: 'Improve drainage immediately. Deep ploughing needed.',
          riskLevel: 'high',
          actions: ['Create drainage', 'Deep plough', 'Add vermicompost'],
        },
        chemical: {
          biology: 'Possible contamination',
          urgentAction: 'Get professional lab analysis. Avoid growing food crops until tested.',
          riskLevel: 'high',
          actions: ['Lab test for contaminants', 'Phytoremediation with sunflower/mustard'],
        },
      },
      worm_count: {
        many_10plus: {
          biology: 'Excellent soil biology',
          riskLevel: 'low',
          actions: ['Keep up the great practices!'],
        },
        several_5_10: {
          biology: 'Good soil biology — room to improve',
          riskLevel: 'low',
          actions: ['Continue adding organic matter'],
        },
        few_1_4: {
          biology: 'Below average — soil needs organic matter',
          riskLevel: 'medium',
          actions: ['Add well-decomposed compost', 'Reduce chemical pesticide use'],
        },
        none: {
          biology: 'Poor biology — no earthworms',
          urgentAction: 'Urgent: Add 3-4 tonnes compost/acre. Stop chemical-only farming.',
          riskLevel: 'high',
          actions: ['Add FYM and vermicompost', 'Reduce chemical inputs', 'Plant cover crops'],
        },
      },
      compaction: {
        wire_easy: {
          compaction: 'No Compaction — excellent root zone',
          riskLevel: 'low',
          actions: ['Maintain with organic matter'],
        },
        wire_moderate: {
          compaction: 'Light compaction at depth',
          riskLevel: 'low',
          actions: ['Deep ploughing once a year', 'Use cover crops'],
        },
        wire_hard: {
          compaction: 'Moderate compaction — roots restricted',
          urgentAction: 'Break compaction with deep-rooted cover crops or sub-soiling',
          riskLevel: 'medium',
          actions: ['Plant sunflower/radish to bio-drill', 'Sub-soil ploughing', 'Add organic matter to loosen soil'],
        },
        wire_impossible: {
          compaction: 'Severe hardpan — roots cannot grow',
          urgentAction: 'Chisel plough or sub-soiler REQUIRED before any planting',
          riskLevel: 'high',
          actions: ['Deep sub-soiling at 60cm', 'Add gypsum for clay soils', 'Avoid heavy machinery when wet'],
        },
      },
      jar_test: {
        mostly_sand: { soilIdentity: 'Sandy Soil (Jar confirmed)', riskLevel: 'medium' },
        sand_silt_mix: { soilIdentity: 'Sandy Loam (Jar confirmed)', riskLevel: 'low' },
        balanced: { soilIdentity: 'Loam — Best soil! (Jar confirmed)', riskLevel: 'low' },
        mostly_silt: { soilIdentity: 'Silty Soil (Jar confirmed)', riskLevel: 'low' },
        silt_clay_mix: { soilIdentity: 'Silty Clay (Jar confirmed)', riskLevel: 'medium' },
        mostly_clay: { soilIdentity: 'Heavy Clay (Jar confirmed)', riskLevel: 'medium' },
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
                        <CircleCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <div className="text-lg text-foreground font-bold">Test Completed Successfully!</div>
                        <div className="text-sm text-muted-foreground">
                            {testCount >= 2 ? `${testCount} tests completed. Run comprehensive analysis for cross-referenced results.` : 'Here is the detailed breakdown of your soil health.'}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Comprehensive Analysis CTA ── */}
            {testCount >= 1 && !showComposite && (
              <div className="p-5 bg-gradient-to-br from-[#812F0F]/8 to-[#812F0F]/3 rounded-2xl border border-[#812F0F]/15 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#812F0F]/10 flex items-center justify-center shrink-0 border border-[#812F0F]/15">
                    <Beaker className="w-5 h-5 text-[#812F0F]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-foreground font-bold mb-1">Comprehensive Soil Analysis</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Cross-reference {testCount} test{testCount > 1 ? 's' : ''} against India&apos;s soil database to identify your exact soil type, 
                      NPK levels, health score, and get precision remediation plans.
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {Object.keys(accumulatedTests).map((t) => (
                        <span key={t} className="text-[10px] px-2 py-1 rounded-lg bg-[#812F0F]/10 text-[#812F0F] font-bold uppercase">{t.replace(/_/g, ' ')}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleRunCompositeAnalysis}
                    disabled={analyzing}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#812F0F] text-white rounded-xl hover:bg-[#963714] transition-all shadow-lg shadow-[#812F0F]/20 disabled:opacity-50 font-bold"
                  >
                    {analyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                    {analyzing ? 'Analyzing...' : 'Run Analysis'}
                  </button>
                  {onRunAnotherTest && testCount < 9 && (
                    <button
                      onClick={onRunAnotherTest}
                      className="flex items-center gap-2 px-5 py-3.5 bg-muted/60 text-foreground/70 rounded-xl hover:bg-muted transition-colors font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add Test
                    </button>
                  )}
                </div>
                {testCount < 3 && (
                  <p className="text-[11px] text-muted-foreground/60 text-center">
                    Tip: Complete 3+ tests for Medium confidence, 5+ for High confidence
                  </p>
                )}
              </div>
            )}

            {/* ── Composite Analysis Results ── */}
            {showComposite && compositeAnalysis && (
              <>
                {/* Identified Soil Type */}
                <div className="p-6 bg-gradient-to-br from-[#812F0F]/12 to-[#812F0F]/4 rounded-2xl border border-[#812F0F]/15 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#812F0F]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-5 h-5 text-[#812F0F]" />
                      <span className="text-xs font-bold text-[#812F0F] uppercase tracking-wider">Identified Soil Type</span>
                    </div>
                    <h4 className="text-2xl font-bold text-foreground mb-1 font-[Megrim]">{compositeAnalysis.identified_soil.soil_name}</h4>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-xs px-2.5 py-1 rounded-lg font-bold uppercase ${
                        compositeAnalysis.identified_soil.confidence_level === 'High' ? 'bg-emerald-500/10 text-emerald-600' :
                        compositeAnalysis.identified_soil.confidence_level === 'Medium' ? 'bg-amber-500/10 text-amber-600' :
                        'bg-orange-500/10 text-orange-600'
                      }`}>{compositeAnalysis.identified_soil.confidence_level} Confidence ({compositeAnalysis.identified_soil.confidence_score}%)</span>
                    </div>
                    {compositeAnalysis.identified_soil.match_reasons.length > 0 && (
                      <ul className="space-y-1 mb-2">
                        {compositeAnalysis.identified_soil.match_reasons.slice(0, 4).map((r: string, i: number) => (
                          <li key={i} className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-2"><CircleCheck className="w-3 h-3 shrink-0" />{r}</li>
                        ))}
                      </ul>
                    )}
                    {compositeAnalysis.identified_soil.is_ambiguous && compositeAnalysis.identified_soil.ambiguity_note && (
                      <p className="text-xs text-amber-600 bg-amber-500/5 p-2.5 rounded-lg mt-2 border border-amber-500/10">{compositeAnalysis.identified_soil.ambiguity_note}</p>
                    )}
                  </div>
                </div>

                {/* Health Score */}
                <div className="p-6 bg-card rounded-2xl border border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Soil Health Score</div>
                      <div className="text-3xl font-bold text-foreground">{compositeAnalysis.health_score}<span className="text-lg text-muted-foreground">/100</span></div>
                    </div>
                    <div className={`px-4 py-2 rounded-xl font-bold text-sm ${
                      compositeAnalysis.health_grade === 'Excellent' ? 'bg-emerald-500/10 text-emerald-600' :
                      compositeAnalysis.health_grade === 'Good' ? 'bg-green-500/10 text-green-600' :
                      compositeAnalysis.health_grade === 'Moderate' ? 'bg-amber-500/10 text-amber-600' :
                      'bg-red-500/10 text-red-600'
                    }`}>{compositeAnalysis.health_grade}</div>
                  </div>
                  {/* Health Factors as bars */}
                  <div className="space-y-3">
                    {compositeAnalysis.health_factors.map((f: any, i: number) => (
                      <div key={i}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-medium text-foreground/70">{f.name}</span>
                          <span className={`font-bold ${f.score >= 70 ? 'text-emerald-600' : f.score >= 40 ? 'text-amber-600' : 'text-red-600'}`}>{f.status}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${f.score}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className={`h-full rounded-full ${f.score >= 70 ? 'bg-emerald-500' : f.score >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* NPK + pH Estimates */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-card rounded-2xl border border-border/50">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">NPK Estimate</div>
                    <div className="space-y-2">
                      {(['nitrogen', 'phosphorus', 'potassium'] as const).map((n) => {
                        const label = n === 'nitrogen' ? 'N' : n === 'phosphorus' ? 'P' : 'K';
                        const val = compositeAnalysis.npk_estimate[n];
                        const color = val === 'High' ? 'text-emerald-600' : val === 'Medium' ? 'text-amber-600' : 'text-red-600';
                        return (
                          <div key={n} className="flex items-center justify-between">
                            <span className="text-sm font-bold text-foreground">{label}</span>
                            <span className={`text-xs font-bold ${color}`}>{val}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {compositeAnalysis.ph_estimate && (
                    <div className="p-4 bg-card rounded-2xl border border-border/50">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">pH Level</div>
                      <div className="text-lg font-bold text-foreground">{compositeAnalysis.ph_estimate.min} - {compositeAnalysis.ph_estimate.max}</div>
                      <div className="text-xs text-muted-foreground mt-1">{compositeAnalysis.ph_estimate.label}</div>
                    </div>
                  )}
                </div>

                {/* Micronutrient Estimates */}
                {compositeAnalysis.micronutrient_estimates && compositeAnalysis.micronutrient_estimates.length > 0 && (
                  <div className="p-5 bg-card rounded-2xl border border-border/50">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Micronutrient Estimates</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {compositeAnalysis.micronutrient_estimates.map((m: any, i: number) => (
                        <div key={i} className={`p-3 rounded-xl border ${m.concern ? 'bg-red-500/5 border-red-500/10' : 'bg-muted/30 border-border/30'}`}>
                          <div className="text-xs font-bold text-foreground mb-1">{m.nutrient}</div>
                          <div className={`text-xs font-bold ${m.concern ? 'text-red-600' : 'text-emerald-600'}`}>{m.level}</div>
                        </div>
                      ))}
                    </div>
                    {compositeAnalysis.micronutrient_estimates.some((m: any) => m.concern) && (
                      <p className="text-[11px] text-red-600 mt-2 bg-red-500/5 p-2 rounded-lg">
                        Deficient micronutrients detected. Apply targeted foliar sprays or soil amendments.
                      </p>
                    )}
                  </div>
                )}

                {/* Soil Properties */}
                {compositeAnalysis.soil_properties && (
                  <div className="p-5 bg-card rounded-2xl border border-border/50">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Soil Physical Properties</div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Water Retention', value: compositeAnalysis.soil_properties.water_retention },
                        { label: 'Drainage', value: compositeAnalysis.soil_properties.drainage },
                        { label: 'Texture', value: compositeAnalysis.soil_properties.texture },
                        { label: 'Organic Matter', value: compositeAnalysis.soil_properties.organic_matter },
                        { label: 'Compaction Risk', value: compositeAnalysis.soil_properties.compaction_tendency },
                        { label: 'EC Range', value: compositeAnalysis.soil_properties.ec_range },
                      ].filter(p => p.value && p.value !== 'Unknown').map((prop, i) => (
                        <div key={i} className="flex justify-between items-center p-2 bg-muted/20 rounded-lg">
                          <span className="text-xs text-muted-foreground">{prop.label}</span>
                          <span className="text-xs font-bold text-foreground">{prop.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cross-Test Warnings */}
                {compositeAnalysis.cross_test_warnings.length > 0 && (
                  <div className="p-5 bg-amber-500/5 rounded-2xl border border-amber-500/10">
                    <div className="flex items-center gap-2 mb-3">
                      <ShieldAlert className="w-5 h-5 text-amber-600" />
                      <span className="font-bold text-foreground">Cross-Test Validation</span>
                    </div>
                    <ul className="space-y-2">
                      {compositeAnalysis.cross_test_warnings.map((w: string, i: number) => (
                        <li key={i} className="text-sm text-amber-700 dark:text-amber-400 flex items-start gap-2 bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
                          <CircleAlert className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Remediation Plan */}
                {compositeAnalysis.remediation_plan.length > 0 && (
                  <div className="p-6 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl border border-blue-500/10">
                    <div className="flex items-center gap-2 mb-4">
                      <Sprout className="w-5 h-5 text-blue-600" />
                      <span className="font-bold text-foreground">Precision Remediation Plan</span>
                    </div>
                    <div className="space-y-3">
                      {compositeAnalysis.remediation_plan.map((r: any, i: number) => (
                        <div key={i} className={`p-4 bg-card rounded-xl border shadow-sm ${r.priority === 'high' ? 'border-red-500/15' : 'border-border/50'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${r.priority === 'high' ? 'bg-red-500/10 text-red-600' : 'bg-blue-500/10 text-blue-600'}`}>{r.priority}</span>
                            <span className="text-sm font-bold text-foreground">{r.action}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-muted-foreground">
                            <div><span className="font-semibold text-foreground/60">Qty:</span> {r.quantity}</div>
                            <div><span className="font-semibold text-foreground/60">When:</span> {r.timing}</div>
                          </div>
                          <p className="text-[11px] text-emerald-600 mt-1.5">{r.benefit}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Crop Recommendations from Analysis */}
                {compositeAnalysis.crop_recommendations.length > 0 && (
                  <div className="p-5 bg-card rounded-2xl border border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Leaf className="w-5 h-5 text-emerald-600" />
                      <span className="font-bold text-foreground">Recommended Crops for Your Soil</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {compositeAnalysis.crop_recommendations.map((cr: any) => (
                        <div key={cr.crop_id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border/30">
                          {cr.image_url && <img src={cr.image_url} alt={cr.crop_name} className="w-10 h-10 rounded-lg object-cover" />}
                          <div>
                            <div className="text-sm font-bold text-foreground">{cr.crop_name}</div>
                            <div className="text-[10px] text-muted-foreground">{cr.cycle_duration} days</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {compositeAnalysis.additional_suitable_crops.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        <span className="text-[10px] text-muted-foreground font-medium">Also suitable: </span>
                        {compositeAnalysis.additional_suitable_crops.map((c: string) => (
                          <span key={c} className="text-[10px] px-2 py-0.5 bg-emerald-500/8 text-emerald-700 rounded font-medium">{c}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Accuracy Note */}
                <div className="p-4 bg-muted/30 rounded-xl border border-border/30 text-center">
                  <p className="text-xs text-muted-foreground">{compositeAnalysis.recommendation_to_improve_accuracy}</p>
                  <p className="text-[10px] text-muted-foreground/50 mt-1">{compositeAnalysis.tests_completed} of 9 tests completed</p>
                </div>
              </>
            )}

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
                    <CircleAlert className="w-5 h-5 text-orange-600 dark:text-orange-400" />
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
                  <CircleAlert className="w-5 h-5 shrink-0" />
                  You need to add a field in the dashboard before you can save this profile.
                </div>
              )}

              <button
                onClick={() => onSaveProfile(selectedFieldId, result)}
                disabled={!selectedFieldId}
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#812F0F] text-white rounded-xl hover:bg-[#963714] transition-all shadow-lg shadow-[#812F0F]/20 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
              >
                <CircleCheck className="w-5 h-5" />
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