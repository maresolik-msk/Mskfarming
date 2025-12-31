import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Check, ChevronRight, Clock, IndianRupee, Beaker, Smartphone, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TestOption {
  id: string;
  name: string;
  price: { min: number; max: number };
  duration: string;
  icon: string;
  recommended?: boolean;
  features: string[];
  bestFor: string;
  description: string;
}

interface SoilTestSelectionProps {
  onClose: () => void;
  onSelectTest: (testId: string) => void;
  onStartSelfTest: () => void;
}

export function SoilTestSelection({ onClose, onSelectTest, onStartSelfTest }: SoilTestSelectionProps) {
  const [selectedTest, setSelectedTest] = useState<string>('');
  const [showComparison, setShowComparison] = useState(false);

  const testOptions: TestOption[] = [
    {
      id: 'basic',
      name: 'Basic Test',
      price: { min: 50, max: 100 },
      duration: '3-5 days',
      icon: '🌱',
      recommended: true,
      features: [
        'Nitrogen (N) level',
        'Phosphorus (P) level',
        'Potassium (K) level',
        'pH Level',
        'Basic fertilizer recommendations',
      ],
      bestFor: 'Regular farming & common crops',
      description: 'Essential nutrients test for everyday farming',
    },
    {
      id: 'complete',
      name: 'Complete Test',
      price: { min: 200, max: 300 },
      duration: '5-7 days',
      icon: '🔬',
      features: [
        'NPK (Nitrogen, Phosphorus, Potassium)',
        'pH Level',
        'Micronutrients (Zinc, Iron, etc.)',
        'Organic Carbon content',
        'Soil Texture analysis',
        'Detailed fertilizer plan',
        'Crop suitability report',
      ],
      bestFor: 'High-value crops & detailed farming',
      description: 'Complete soil health analysis with detailed recommendations',
    },
    {
      id: 'home',
      name: 'Home Test Kit',
      price: { min: 30, max: 50 },
      duration: 'Same day',
      icon: '🏠',
      features: [
        'DIY test kit delivered',
        'Color-coded NPK strips',
        'pH indicator',
        'Instant results',
        'Step-by-step guide',
      ],
      bestFor: 'Quick checks & budget farming',
      description: 'Test yourself at home with instant results',
    },
    {
      id: 'ai',
      name: 'AI Photo Test',
      price: { min: 0, max: 0 },
      duration: 'Instant',
      icon: '📸',
      features: [
        'Take photo of soil',
        'AI analyzes color & texture',
        'Preliminary assessment',
        'Basic recommendations',
        'Free to use',
      ],
      bestFor: 'Quick assessment & first-time users',
      description: 'Free AI-powered soil analysis from photos (Coming Soon)',
    },
  ];

  const handleSelectTest = () => {
    if (!selectedTest) {
      toast.error('Please select a test type');
      return;
    }

    const test = testOptions.find(t => t.id === selectedTest);
    if (test?.id === 'ai') {
      toast.info('AI Photo Test coming soon! Please choose another option.');
      return;
    }

    onSelectTest(selectedTest);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-3xl p-0 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-hidden flex flex-col ring-1 ring-white/10"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 bg-card/95 backdrop-blur-sm border-b border-border shrink-0 z-10">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-1 font-[Megrim]">Choose Soil Test</h3>
            <p className="text-sm text-muted-foreground">Select the best option for your precision farming needs</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1 space-y-6 scrollbar-hide">
            {/* Education Banner */}
            <div className="p-5 bg-gradient-to-r from-amber-500/10 to-transparent rounded-2xl border border-amber-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-start gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0 border border-amber-500/20">
                    <span className="text-xl">💡</span>
                </div>
                <div>
                <div className="font-semibold text-foreground mb-1">Why soil testing helps:</div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                    Know your soil's exact needs → Use right fertilizers → Save money → <span className="text-amber-600 dark:text-amber-400 font-medium">Increase yield by 20-30%</span>
                </div>
                </div>
            </div>
            </div>

            {/* NEW: Self Testing Option */}
            <button
            onClick={onStartSelfTest}
            className="w-full p-1 rounded-2xl bg-gradient-to-br from-[#812F0F]/20 via-[#963714]/10 to-transparent p-[1px] group transition-transform hover:scale-[1.01]"
            >
            <div className="bg-card rounded-[15px] p-5 relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#812F0F]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-[#812F0F]/10 transition-colors" />
                
                <div className="flex items-center gap-5 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-[#812F0F]/5 border border-[#812F0F]/10 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                    🌱
                </div>
                
                <div className="flex-1 text-left min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h4 className="text-lg font-bold text-foreground tracking-tight">
                        Test Soil Yourself (Mera Mitti)
                    </h4>
                    <div className="flex gap-1.5">
                        <span className="px-2 py-0.5 bg-[#812F0F] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                        FREE
                        </span>
                        <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                        NEW
                        </span>
                    </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    No lab needed! Test at home in 25 minutes with simple steps.
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground/80">
                        <div className="w-4 h-4 rounded-full bg-[#812F0F]/10 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-[#812F0F]" />
                        </div>
                        Step-by-step guide
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground/80">
                        <div className="w-4 h-4 rounded-full bg-[#812F0F]/10 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-[#812F0F]" />
                        </div>
                        Voice instructions
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground/80">
                        <div className="w-4 h-4 rounded-full bg-[#812F0F]/10 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-[#812F0F]" />
                        </div>
                        Instant results
                    </div>
                    </div>
                </div>
                
                <div className="w-10 h-10 rounded-full bg-[#812F0F]/10 flex items-center justify-center group-hover:bg-[#812F0F] group-hover:text-white transition-all">
                    <ChevronRight className="w-5 h-5" />
                </div>
                </div>
            </div>
            </button>

            <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50"></div>
            </div>
            <div className="relative flex justify-center text-xs font-medium uppercase tracking-widest">
                <span className="px-3 bg-card text-muted-foreground/50">OR send sample to lab</span>
            </div>
            </div>

            {/* Test Options */}
            <div className="space-y-4">
            {testOptions.map((test) => (
                <motion.button
                key={test.id}
                onClick={() => setSelectedTest(test.id)}
                disabled={test.id === 'ai'}
                whileHover={{ scale: test.id === 'ai' ? 1 : 1.01 }}
                whileTap={{ scale: test.id === 'ai' ? 1 : 0.99 }}
                className={`w-full text-left p-5 rounded-2xl border transition-all relative overflow-hidden ${
                    selectedTest === test.id
                    ? 'border-[#812F0F] bg-[#812F0F]/5 shadow-lg shadow-[#812F0F]/5'
                    : 'border-border hover:border-[#812F0F]/30 hover:bg-muted/50'
                } ${test.id === 'ai' ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}`}
                >
                {selectedTest === test.id && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#812F0F]/5 rounded-bl-full -mr-8 -mt-8" />
                )}
                
                <div className="flex items-start gap-5 relative z-10">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center text-2xl border border-border/50 shadow-sm">
                        {test.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className={`text-lg font-bold ${selectedTest === test.id ? 'text-[#812F0F]' : 'text-foreground'}`}>
                                {test.name}
                            </h4>
                            {test.recommended && (
                            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider rounded-full">
                                Recommended
                            </span>
                            )}
                            {test.id === 'ai' && (
                            <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full border border-border">
                                Coming Soon
                            </span>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{test.description}</p>
                        </div>
                        {selectedTest === test.id && (
                        <div className="w-6 h-6 rounded-full bg-[#812F0F] flex items-center justify-center flex-shrink-0 shadow-md shadow-[#812F0F]/30 animate-in zoom-in">
                            <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                        )}
                    </div>

                    {/* Price & Duration */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1.5 text-sm font-medium">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <span className="text-foreground">
                            {test.price.min === 0 ? (
                            'Free'
                            ) : test.price.min === test.price.max ? (
                            `₹${test.price.min}`
                            ) : (
                            `₹${test.price.min}-${test.price.max}`
                            )}
                        </span>
                        </div>
                        <div className="w-px h-4 bg-border" />
                        <div className="flex items-center gap-1.5 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{test.duration}</span>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-2">
                        {test.features.slice(0, 4).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#812F0F]/40" />
                            <span className="truncate">{feature}</span>
                        </div>
                        ))}
                    </div>
                    </div>
                </div>
                </motion.button>
            ))}
            </div>

            {/* Compare Tests */}
            <button
            onClick={() => setShowComparison(!showComparison)}
            className="w-full py-3 text-sm text-[#812F0F] hover:text-[#963714] font-medium flex items-center justify-center gap-2 transition-colors"
            >
            <HelpCircle className="w-4 h-4" />
            {showComparison ? 'Hide Comparison' : 'Compare All Tests'}
            </button>

            {/* Comparison Table */}
            {showComparison && (
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="overflow-x-auto rounded-xl border border-border"
            >
                <table className="w-full">
                <thead className="bg-muted/50">
                    <tr>
                    <th className="p-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Feature</th>
                    <th className="p-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">Basic</th>
                    <th className="p-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">Complete</th>
                    <th className="p-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">Home Kit</th>
                    </tr>
                </thead>
                <tbody className="text-sm divide-y divide-border/50">
                    {[
                        ['NPK Testing', true, true, true],
                        ['pH Level', true, true, true],
                        ['Micronutrients', false, true, false],
                        ['Organic Carbon', false, true, false],
                        ['Soil Texture', false, true, false],
                        ['Crop Suitability', false, true, false],
                        ['Lab Testing', true, true, false],
                    ].map((row: any, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium text-foreground/80">{row[0]}</td>
                    <td className="p-3 text-center">{row[1] ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <div className="w-1 h-1 rounded-full bg-muted-foreground/30 mx-auto" />}</td>
                    <td className="p-3 text-center">{row[2] ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <div className="w-1 h-1 rounded-full bg-muted-foreground/30 mx-auto" />}</td>
                    <td className="p-3 text-center">{row[3] ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <div className="w-1 h-1 rounded-full bg-muted-foreground/30 mx-auto" />}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </motion.div>
            )}

            {/* Help Section */}
            <div className="p-4 bg-muted/30 rounded-xl border border-border/50 flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[#812F0F]/10 flex items-center justify-center shrink-0">
                <HelpCircle className="w-4 h-4 text-[#812F0F]" />
            </div>
            <div>
                <div className="text-sm font-bold text-foreground mb-1">Need help choosing?</div>
                <div className="text-xs text-muted-foreground mb-2 leading-relaxed">
                Most farmers choose <strong className="text-foreground">Basic Test</strong> for regular crops.
                Choose <strong className="text-foreground">Complete Test</strong> for high-value crops.
                </div>
                <button className="text-xs font-bold text-[#812F0F] hover:underline flex items-center gap-1">
                Talk to Expert <ChevronRight className="w-3 h-3" />
                </button>
            </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 pt-4 bg-card border-t border-border shrink-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-xl border border-border hover:bg-muted font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSelectTest}
            disabled={!selectedTest}
            className="flex-1 py-3.5 rounded-xl bg-[#812F0F] text-white hover:bg-[#963714] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#812F0F]/20 flex items-center justify-center gap-2 font-bold"
          >
            <span>Continue</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}