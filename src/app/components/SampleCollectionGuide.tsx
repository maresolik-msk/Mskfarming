import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Clock, 
  MapPin, 
  Volume2,
  Circle,
  CircleAlert,
  CircleCheck
} from 'lucide-react';
import { toast } from 'sonner';

interface SampleCollectionGuideProps {
  onClose: () => void;
  onComplete: () => void;
  testType: string;
}

interface Step {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  tips: string[];
  warnings?: string[];
  image?: string;
  checklist: string[];
}

export function SampleCollectionGuide({ onClose, onComplete, testType }: SampleCollectionGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const steps: Step[] = [
    {
      id: 1,
      title: 'Best Time to Collect',
      subtitle: 'When to take soil sample',
      icon: '⏰',
      description: 'Timing is important for accurate results. Follow these guidelines for best results.',
      tips: [
        'Collect 2-3 weeks before planting season',
        'Choose a dry day (not right after rain)',
        'Morning time is best (7-10 AM)',
        'Avoid windy weather',
      ],
      warnings: [
        '❌ Don\'t collect right after heavy rain',
        '❌ Avoid collecting during or after fertilizer application',
        '❌ Wait at least 30 days after last fertilizer use',
      ],
      checklist: [
        'Checked the weather - dry day',
        'No recent rain (3+ days dry)',
        'Morning time selected',
      ],
    },
    {
      id: 2,
      title: 'Tools You Need',
      subtitle: 'Gather these simple items',
      icon: '🛠️',
      description: 'You don\'t need expensive tools. These common items are enough for proper sample collection.',
      tips: [
        'Khurpi or small spade (for digging)',
        'Clean plastic bucket',
        'Clean plastic bag (1kg size)',
        'Marker pen for labeling',
        'Optional: Clean cloth to wipe tools',
      ],
      warnings: [
        '⚠️ Make sure all tools are clean',
        '⚠️ Avoid rusty or dirty tools',
        '⚠️ Don\'t use fertilizer bags for sample',
      ],
      checklist: [
        'Khurpi/spade ready',
        'Clean bucket available',
        'Plastic bag ready',
        'Marker pen for labeling',
      ],
    },
    {
      id: 3,
      title: 'Where to Collect',
      subtitle: 'Choose right spots in your field',
      icon: '📍',
      description: 'Collect from multiple spots to get accurate results. Walk in a zig-zag pattern across your field.',
      tips: [
        'Collect from 5-7 different spots',
        'Walk in zig-zag pattern across field',
        'Cover different areas of field',
        'Mix all samples together',
      ],
      warnings: [
        '❌ Avoid field edges and corners',
        '❌ Stay away from wet or waterlogged areas',
        '❌ Don\'t collect near trees or compost piles',
        '❌ Avoid spots where fertilizer bags were stored',
      ],
      image: 'zig-zag pattern illustration',
      checklist: [
        'Identified 5-7 collection spots',
        'Avoided field edges',
        'Avoided wet/waterlogged areas',
        'Avoided fertilizer storage areas',
      ],
    },
    {
      id: 4,
      title: 'How to Collect',
      subtitle: 'Step-by-step collection process',
      icon: '⛏️',
      description: 'Follow these steps carefully at each collection spot for best results.',
      tips: [
        '1. Remove grass, stones, and debris from spot',
        '2. Dig 6 inches (15 cm) deep with khurpi',
        '3. Take soil from middle of the hole (not top or bottom)',
        '4. Put soil in bucket',
        '5. Repeat at all 5-7 spots',
        '6. Mix all soil thoroughly in bucket',
      ],
      warnings: [
        '⚠️ Don\'t take only top soil',
        '⚠️ Don\'t include grass or roots',
        '⚠️ Remove stones and debris',
      ],
      image: 'digging illustration',
      checklist: [
        'Removed grass and debris',
        'Dug 6 inches deep',
        'Took soil from middle portion',
        'Collected from all spots',
        'Mixed all samples in bucket',
      ],
    },
    {
      id: 5,
      title: 'Prepare Sample',
      subtitle: 'Final preparation for testing',
      icon: '📦',
      description: 'Prepare your mixed soil sample properly for lab testing.',
      tips: [
        'Mix all soil in bucket thoroughly',
        'Spread on clean cloth to dry (if wet)',
        'Remove any remaining stones or debris',
        'Take about 500 grams (2 cups) of mixed soil',
        'Put in clean plastic bag',
        'Label clearly with details',
      ],
      warnings: [
        '⚠️ Don\'t send wet or muddy soil',
        '⚠️ Label must be clear and readable',
      ],
      checklist: [
        'Soil mixed thoroughly',
        'Removed stones and debris',
        'About 500g taken',
        'Put in clean plastic bag',
        'Labeled with name, field, date, crop',
      ],
    },
  ];

  const handlePlayAudio = () => {
    toast.success('Playing voice instructions...');
    // In production, play actual audio
  };

  const handleCheckItem = (itemIndex: number) => {
    const key = `${currentStep}-${itemIndex}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isStepComplete = () => {
    const step = steps[currentStep];
    return step.checklist.every((_, index) => {
      const key = `${currentStep}-${index}`;
      return checkedItems[key];
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      if (isStepComplete() && !completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    } else {
      // Last step - mark complete and proceed
      if (isStepComplete()) {
        toast.success('Sample collection guide completed!');
        onComplete();
      } else {
        toast.error('Please complete all checklist items');
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <div className="flex-1">
            <h3 className="text-2xl text-foreground mb-1">Sample Collection Guide</h3>
            <p className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                    index === currentStep
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                      : completedSteps.includes(index)
                      ? 'bg-green-500 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {completedSteps.includes(index) ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                      completedSteps.includes(index) ? 'bg-green-500' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step Header */}
            <div className="mb-6 p-5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
              <div className="flex items-start gap-4">
                <div className="text-5xl">{step.icon}</div>
                <div className="flex-1">
                  <h4 className="text-xl text-foreground mb-1">{step.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{step.subtitle}</p>
                  <p className="text-foreground">{step.description}</p>
                </div>
              </div>

              {/* Voice Button */}
              <button
                onClick={handlePlayAudio}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                <span className="text-sm">Listen to Instructions</span>
              </button>
            </div>

            {/* Tips */}
            <div className="mb-6 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-start gap-2 mb-3">
                <div className="text-xl">✅</div>
                <div className="font-medium text-foreground">What to do:</div>
              </div>
              <ul className="space-y-2">
                {step.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Warnings */}
            {step.warnings && step.warnings.length > 0 && (
              <div className="mb-6 p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <div className="flex items-start gap-2 mb-3">
                  <CircleAlert className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div className="font-medium text-foreground">Important:</div>
                </div>
                <ul className="space-y-2">
                  {step.warnings.map((warning, index) => (
                    <li key={index} className="text-sm text-foreground">
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Checklist */}
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <div className="font-medium text-foreground mb-3">
                ✓ Checklist - Mark each item when done:
              </div>
              <div className="space-y-3">
                {step.checklist.map((item, index) => {
                  const key = `${currentStep}-${index}`;
                  const isChecked = checkedItems[key];
                  return (
                    <button
                      key={index}
                      onClick={() => handleCheckItem(index)}
                      className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-background transition-colors text-left"
                    >
                      <div className="mt-0.5">
                        {isChecked ? (
                          <CircleCheck className="w-5 h-5 text-primary" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          isChecked ? 'line-through text-muted-foreground' : 'text-foreground'
                        }`}
                      >
                        {item}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step Completion Status */}
            {isStepComplete() && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-500/10 rounded-lg border border-green-500/20"
              >
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Step completed! You can proceed.</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 sticky bottom-0 bg-card pt-4 border-t border-border">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-6 py-3 rounded-lg border-2 border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <button
            onClick={handleNext}
            className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Check className="w-5 h-5" />
                Complete Guide
              </>
            ) : (
              <>
                Next Step
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Help */}
        <div className="mt-4 text-center">
          <button className="text-sm text-primary hover:underline">
            Need help? Talk to Expert
          </button>
        </div>
      </motion.div>
    </div>
  );
}