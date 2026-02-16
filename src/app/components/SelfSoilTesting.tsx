import { useState } from 'react';
import { motion } from 'motion/react';
import { X, ChevronRight, Droplets, Hand, Palette, TestTube, Mountain, Sparkles, HelpCircle, Bug, Wind, FlaskConical, Pin } from 'lucide-react';

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
      name: 'pH Test (Vinegar & Baking Soda)',
      icon: TestTube,
      emoji: '🧪',
      duration: '5 minutes',
      difficulty: 'medium',
      description: 'Check if soil is acidic, neutral, or alkaline using household items',
      whyItMatters: 'Some crops need specific pH to grow well',
      mandatory: false,
    },
    {
      id: 'jar_test',
      name: 'Jar Settling Test',
      icon: FlaskConical,
      emoji: '🫙',
      duration: '24 hours (5 min active)',
      difficulty: 'easy',
      description: 'See exact sand/silt/clay % by settling soil in water',
      whyItMatters: 'Most accurate DIY texture test — confirms your soil type precisely',
      mandatory: false,
    },
    {
      id: 'smell',
      name: 'Soil Smell Test',
      icon: Wind,
      emoji: '👃',
      duration: '1 minute',
      difficulty: 'easy',
      description: 'Smell freshly dug soil to check microbial health',
      whyItMatters: 'Good soil smells earthy — bad smell means unhealthy microbes',
      mandatory: false,
    },
    {
      id: 'worm_count',
      name: 'Earthworm Count',
      icon: Bug,
      emoji: '🪱',
      duration: '10 minutes',
      difficulty: 'easy',
      description: 'Count earthworms in a 1-foot cube of soil',
      whyItMatters: 'Earthworms = healthy soil biology. More worms = better fertility',
      mandatory: false,
    },
    {
      id: 'compaction',
      name: 'Compaction Test',
      icon: Pin,
      emoji: '📌',
      duration: '5 minutes',
      difficulty: 'easy',
      description: 'Push a wire into soil to check for hardpan/compaction layers',
      whyItMatters: 'Compaction blocks roots and water — causes 20-40% yield loss',
      mandatory: false,
    },
  ];

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
              <span className="text-2xl">🌱</span>
              <h3 className="text-2xl font-bold text-foreground font-[Megrim]">Test Your Soil</h3>
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

        <div className="overflow-y-auto p-6 flex-1 space-y-6 scrollbar-hide">
            {/* Introduction */}
            <div className="p-5 bg-gradient-to-br from-[#812F0F]/10 to-transparent rounded-2xl border border-[#812F0F]/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#812F0F]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="flex items-start gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-[#812F0F]/10 flex items-center justify-center shrink-0 border border-[#812F0F]/20">
                        <span className="text-xl">💡</span>
                    </div>
                    <div>
                    <div className="font-bold text-foreground mb-2">No lab needed! Test at home</div>
                    <ul className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#812F0F]/50" />Follow simple steps with pictures</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#812F0F]/50" />Just use your hands and water</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#812F0F]/50" />Takes 25 minutes total</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#812F0F]/50" />Get instant advice for your farm</li>
                    </ul>
                    </div>
                </div>
            </div>

            {/* Test Cards */}
            <div className="space-y-3">
            {tests.map((test, index) => {
                const Icon = test.icon;
                return (
                <motion.button
                    key={test.id}
                    onClick={() => onSelectTest(test.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="w-full text-left p-5 rounded-2xl border border-border hover:border-[#812F0F]/30 bg-card hover:bg-muted/50 transition-all group relative overflow-hidden"
                >
                    <div className="flex items-start gap-5 relative z-10">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center flex-shrink-0 group-hover:bg-[#812F0F]/10 group-hover:scale-105 transition-all border border-border/50 shadow-sm">
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{test.emoji}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-lg font-bold text-foreground group-hover:text-[#812F0F] transition-colors">{test.name}</h4>
                            {test.mandatory && (
                                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider rounded-full">
                                Must Do
                                </span>
                            )}
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[#812F0F] group-hover:translate-x-1 transition-all" />
                        </div>

                        <p className="text-sm text-foreground/80 mb-3 leading-relaxed">{test.description}</p>

                        {/* Duration */}
                        <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                            <span>⏱️</span> {test.duration}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md capitalize">
                            <span>{test.difficulty === 'easy' ? '😊' : '📖'}</span> {test.difficulty}
                        </div>
                        </div>

                        {/* Why it matters */}
                        <div className="p-3 bg-muted/30 rounded-xl border border-border/50">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Why this matters</div>
                        <div className="text-xs text-foreground/90 leading-relaxed">{test.whyItMatters}</div>
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
            className="w-full p-1 rounded-2xl bg-gradient-to-r from-[#812F0F] via-[#963714] to-[#812F0F] p-[1px] group transition-transform hover:scale-[1.01]"
            >
            <div className="bg-[#812F0F] rounded-[15px] p-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center justify-between relative z-10 text-white">
                    <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-inner">
                        <Sparkles className="w-6 h-6 text-amber-200" />
                    </div>
                    <div className="text-left">
                        <div className="font-bold text-lg mb-0.5">Do Complete Test (All 9)</div>
                        <div className="text-sm text-white/80">Most accurate soil profile - <span className="text-amber-200 font-medium">Highly Recommended!</span></div>
                    </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                        <ChevronRight className="w-5 h-5" />
                    </div>
                </div>
            </div>
            </button>

            {/* Help Section */}
            <div className="p-4 bg-muted/30 rounded-xl border border-border/50 flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[#812F0F]/10 flex items-center justify-center shrink-0">
                <HelpCircle className="w-4 h-4 text-[#812F0F]" />
            </div>
            <div>
                <div className="text-sm font-bold text-foreground mb-1">New to soil testing?</div>
                <div className="text-xs text-muted-foreground mb-2 leading-relaxed">
                Don't worry! We'll guide you step by step with pictures and voice. It's very easy.
                </div>
                <button
                onClick={() => setShowInfo(true)}
                className="text-xs font-bold text-[#812F0F] hover:underline flex items-center gap-1"
                >
                Watch How It Works (2 min video) <ChevronRight className="w-3 h-3" />
                </button>
            </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 pt-4 bg-card border-t border-border shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl border border-border hover:bg-muted font-medium transition-colors"
          >
            Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}