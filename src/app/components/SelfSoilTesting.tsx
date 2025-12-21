import { useState } from 'react';
import { motion } from 'motion/react';
import { X, ChevronRight, Droplets, Hand, Palette, TestTube, Mountain, Sparkles, HelpCircle } from 'lucide-react';

interface SelfSoilTestingProps {
  onClose: () => void;
  onSelectTest: (testType: string) => void;
}

interface TestCard {
  id: string;
  name: string;
  icon: any;
  emoji: string;
  duration: string;
  difficulty: 'easy' | 'medium';
  description: string;
  whyItMatters: string;
  mandatory: boolean;
}

export function SelfSoilTesting({ onClose, onSelectTest }: SelfSoilTestingProps) {
  const [showInfo, setShowInfo] = useState(false);

  const tests: TestCard[] = [
    {
      id: 'texture',
      name: 'Soil Type Test',
      icon: Mountain,
      emoji: '🟤',
      duration: '5 minutes',
      difficulty: 'easy',
      description: 'Find if your soil is sandy, loamy, or clay',
      whyItMatters: 'Tells you how often to water and which crops grow best',
      mandatory: true,
    },
    {
      id: 'water',
      name: 'Water Test',
      icon: Droplets,
      emoji: '💧',
      duration: '15 minutes',
      difficulty: 'easy',
      description: 'See how fast water drains from your soil',
      whyItMatters: 'Prevents waterlogging and helps plan irrigation',
      mandatory: true,
    },
    {
      id: 'moisture',
      name: 'Moisture Feel Test',
      icon: Hand,
      emoji: '✋',
      duration: '2 minutes',
      difficulty: 'easy',
      description: 'Check if soil has right amount of water now',
      whyItMatters: 'Know when to water - not too much, not too little',
      mandatory: true,
    },
    {
      id: 'color',
      name: 'Soil Color Test',
      icon: Palette,
      emoji: '🎨',
      duration: '3 minutes',
      difficulty: 'easy',
      description: 'Understand soil health from its color',
      whyItMatters: 'Dark soil = more nutrients, light soil = needs organic matter',
      mandatory: true,
    },
    {
      id: 'ph',
      name: 'pH Test (Optional)',
      icon: TestTube,
      emoji: '🧪',
      duration: '5 minutes',
      difficulty: 'medium',
      description: 'Check if soil is acidic, normal, or alkaline',
      whyItMatters: 'Some crops need specific pH to grow well',
      mandatory: false,
    },
  ];

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
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">🌱</span>
              <h3 className="text-2xl text-foreground">Test Your Soil</h3>
            </div>
            <p className="text-sm text-muted-foreground">Mera Mitti - Know your soil in 25 minutes</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Introduction */}
        <div className="mb-6 p-5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="text-3xl">💡</div>
            <div>
              <div className="text-foreground mb-2">No lab needed! Test at home</div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Follow simple steps with pictures</li>
                <li>• Just use your hands and water</li>
                <li>• Takes 25 minutes total</li>
                <li>• Get instant advice for your farm</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Test Cards */}
        <div className="space-y-3 mb-6">
          {tests.map((test, index) => {
            const Icon = test.icon;
            return (
              <motion.button
                key={test.id}
                onClick={() => onSelectTest(test.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="w-full text-left p-5 rounded-xl border-2 border-border hover:border-primary/50 bg-card hover:bg-muted/50 transition-all group"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <span className="text-2xl">{test.emoji}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-lg text-foreground">{test.name}</h4>
                          {test.mandatory && (
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                              Must Do
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>

                    <p className="text-sm text-foreground mb-2">{test.description}</p>

                    {/* Duration */}
                    <div className="flex items-center gap-4 mb-2">
                      <div className="text-xs text-muted-foreground">
                        ⏱️ {test.duration}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {test.difficulty === 'easy' ? '😊 Easy' : '📖 Medium'}
                      </div>
                    </div>

                    {/* Why it matters */}
                    <div className="p-2 bg-muted rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Why this matters:</div>
                      <div className="text-xs text-foreground">{test.whyItMatters}</div>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Complete Test Button */}
        <button
          onClick={() => onSelectTest('complete')}
          className="w-full mb-4 p-5 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="font-medium mb-1">Do Complete Test (All 5)</div>
                <div className="text-sm opacity-90">Get full soil profile - Recommended!</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>

        {/* Help Section */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <div className="text-sm text-foreground mb-1">New to soil testing?</div>
              <div className="text-sm text-muted-foreground mb-2">
                Don't worry! We'll guide you step by step with pictures and voice. It's very easy.
              </div>
              <button
                onClick={() => setShowInfo(true)}
                className="text-sm text-primary hover:underline"
              >
                Watch How It Works (2 min video) →
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg border-2 border-border hover:bg-muted transition-colors"
          >
            Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}