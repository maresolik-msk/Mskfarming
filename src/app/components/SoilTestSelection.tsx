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
        className="bg-card rounded-2xl p-6 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-card pb-4 border-b border-border">
          <div>
            <h3 className="text-2xl text-foreground mb-1">Choose Soil Test</h3>
            <p className="text-sm text-muted-foreground">Select the best option for your needs</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Education Banner */}
        <div className="mb-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <div className="text-foreground mb-1">Why soil testing helps:</div>
              <div className="text-sm text-muted-foreground">
                Know your soil's exact needs → Use right fertilizers → Save money → Increase yield by 20-30%
              </div>
            </div>
          </div>
        </div>

        {/* NEW: Self Testing Option */}
        <button
          onClick={onStartSelfTest}
          className="w-full mb-6 p-5 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/10 border-2 border-green-500/30 hover:border-green-500/50 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
              🌱
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-lg text-foreground font-medium">Test Soil Yourself (Mera Mitti)</h4>
                <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                  FREE
                </span>
                <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                  NEW
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                No lab needed! Test at home in 25 minutes with simple steps
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>✅ Step-by-step guide</span>
                <span>✅ Voice instructions</span>
                <span>✅ Instant results</span>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-green-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-card text-muted-foreground">OR send sample to lab</span>
          </div>
        </div>

        {/* Test Options */}
        <div className="space-y-4 mb-6">
          {testOptions.map((test) => (
            <motion.button
              key={test.id}
              onClick={() => setSelectedTest(test.id)}
              disabled={test.id === 'ai'}
              whileHover={{ scale: test.id === 'ai' ? 1 : 1.01 }}
              className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                selectedTest === test.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              } ${test.id === 'ai' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="text-4xl">{test.icon}</div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg text-foreground">{test.name}</h4>
                        {test.recommended && (
                          <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                            Recommended
                          </span>
                        )}
                        {test.id === 'ai' && (
                          <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{test.description}</p>
                    </div>
                    {selectedTest === test.id && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Price & Duration */}
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1 text-sm">
                      <IndianRupee className="w-4 h-4 text-primary" />
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
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{test.duration}</span>
                    </div>
                  </div>

                  {/* Best For */}
                  <div className="mb-3 p-2 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Best for:</div>
                    <div className="text-sm text-foreground">{test.bestFor}</div>
                  </div>

                  {/* Features */}
                  <div className="space-y-1">
                    {test.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
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
          className="w-full mb-6 py-3 text-sm text-primary hover:underline flex items-center justify-center gap-2"
        >
          <HelpCircle className="w-4 h-4" />
          {showComparison ? 'Hide Comparison' : 'Compare All Tests'}
        </button>

        {/* Comparison Table */}
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 overflow-x-auto"
          >
            <table className="w-full border border-border rounded-lg overflow-hidden">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-left text-sm text-foreground">Feature</th>
                  <th className="p-3 text-center text-sm text-foreground">Basic</th>
                  <th className="p-3 text-center text-sm text-foreground">Complete</th>
                  <th className="p-3 text-center text-sm text-foreground">Home Kit</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-t border-border">
                  <td className="p-3 text-muted-foreground">NPK Testing</td>
                  <td className="p-3 text-center">✅</td>
                  <td className="p-3 text-center">✅</td>
                  <td className="p-3 text-center">✅</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3 text-muted-foreground">pH Level</td>
                  <td className="p-3 text-center">✅</td>
                  <td className="p-3 text-center">✅</td>
                  <td className="p-3 text-center">✅</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3 text-muted-foreground">Micronutrients</td>
                  <td className="p-3 text-center">❌</td>
                  <td className="p-3 text-center">✅</td>
                  <td className="p-3 text-center">❌</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3 text-muted-foreground">Organic Carbon</td>
                  <td className="p-3 text-center">❌</td>
                  <td className="p-3 text-center">✅</td>
                  <td className="p-3 text-center">❌</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3 text-muted-foreground">Soil Texture</td>
                  <td className="p-3 text-center">❌</td>
                  <td className="p-3 text-center">✅</td>
                  <td className="p-3 text-center">❌</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3 text-muted-foreground">Crop Suitability</td>
                  <td className="p-3 text-center">❌</td>
                  <td className="p-3 text-center">✅</td>
                  <td className="p-3 text-center">❌</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3 text-muted-foreground">Lab Testing</td>
                  <td className="p-3 text-center">✅</td>
                  <td className="p-3 text-center">✅</td>
                  <td className="p-3 text-center">❌</td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Help Section */}
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <div className="text-sm text-foreground mb-1">Need help choosing?</div>
              <div className="text-sm text-muted-foreground mb-2">
                Most farmers choose <strong>Basic Test</strong> for regular crops like wheat, rice, and vegetables.
                Choose <strong>Complete Test</strong> for high-value crops like fruits, cash crops, or if you want detailed analysis.
              </div>
              <button className="text-sm text-primary hover:underline">
                Talk to Expert →
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 sticky bottom-0 bg-card pt-4 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg border-2 border-border hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSelectTest}
            disabled={!selectedTest}
            className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <span>Continue</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}