import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  CheckCircle2,
  Circle,
  Play,
  HelpCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface GuidedSoilTestProps {
  testType: string;
  onClose: () => void;
  onComplete: (result: any) => void;
}

interface TestStep {
  id: number;
  title: string;
  instruction: string;
  visual: string;
  voiceText: string;
  checklist?: string[];
}

interface ObservationOption {
  id: string;
  label: string;
  emoji: string;
  description: string;
  value: string;
}

export function GuidedSoilTest({ testType, onClose, onComplete }: GuidedSoilTestProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedObservation, setSelectedObservation] = useState('');
  const [checklistCompleted, setChecklistCompleted] = useState<{ [key: number]: boolean }>({});
  const [showVideo, setShowVideo] = useState(false);

  const getTestConfig = () => {
    switch (testType) {
      case 'texture':
        return {
          name: 'Soil Type Test',
          emoji: '🟤',
          steps: [
            {
              id: 1,
              title: 'Collect Soil Sample',
              instruction: 'Dig 6-8 inches deep and take handful of soil. Remove stones and grass.',
              visual: 'illustration-dig',
              voiceText: 'Dig 6 to 8 inches deep in your field and collect soil',
              checklist: [
                'Dug 6-8 inches deep',
                'Removed stones and grass',
                'Took handful of clean soil',
              ],
            },
            {
              id: 2,
              title: 'Add Water',
              instruction: 'Add small amount of water to soil. Mix well until it becomes like dough.',
              visual: 'illustration-water',
              voiceText: 'Add water slowly and mix until soil becomes like dough',
              checklist: [
                'Added water slowly',
                'Mixed thoroughly',
                'Soil is like dough now',
              ],
            },
            {
              id: 3,
              title: 'Make a Ball',
              instruction: 'Try to make a ball with the wet soil. Press firmly in your palm.',
              visual: 'illustration-ball',
              voiceText: 'Try to make a ball with wet soil and press firmly',
              checklist: [
                'Tried to make ball',
                'Pressed firmly',
                'Observed what happened',
              ],
            },
            {
              id: 4,
              title: 'Make a Ribbon',
              instruction: 'If ball forms, try to make a thin strip (ribbon) by pressing between thumb and finger.',
              visual: 'illustration-ribbon',
              voiceText: 'If ball forms, try to make a thin ribbon by pressing',
              checklist: [
                'Tried to make ribbon',
                'Checked how long it is',
                'Noted if it breaks',
              ],
            },
          ],
          observations: [
            {
              id: 'sandy',
              label: 'Cannot Form Ball',
              emoji: '⚪',
              description: 'Soil crumbles and doesn\'t stick together',
              value: 'sandy',
            },
            {
              id: 'loamy',
              label: 'Ball Forms, Breaks Easily',
              emoji: '🟡',
              description: 'Forms ball but breaks when making ribbon',
              value: 'loamy',
            },
            {
              id: 'clay',
              label: 'Sticky Ball & Long Ribbon',
              emoji: '🟤',
              description: 'Very sticky, makes long ribbon without breaking',
              value: 'clay',
            },
          ],
        };

      case 'water':
        return {
          name: 'Water Absorption Test',
          emoji: '💧',
          steps: [
            {
              id: 1,
              title: 'Dig a Small Pit',
              instruction: 'Dig a pit 1 foot deep and 1 foot wide in your field.',
              visual: 'illustration-pit',
              voiceText: 'Dig a pit 1 foot deep and 1 foot wide',
              checklist: [
                'Found clear spot in field',
                'Dug 1 foot deep pit',
                'Made it 1 foot wide',
              ],
            },
            {
              id: 2,
              title: 'Pour Water',
              instruction: 'Fill the pit with water (about 1 bucket). Note the time.',
              visual: 'illustration-pour',
              voiceText: 'Fill pit with 1 bucket water and note the time',
              checklist: [
                'Filled pit with water',
                'Used about 1 bucket',
                'Noted the start time',
              ],
            },
            {
              id: 3,
              title: 'Observe',
              instruction: 'Watch how fast water disappears into soil. Wait and observe.',
              visual: 'illustration-observe',
              voiceText: 'Watch how fast the water drains into the soil',
              checklist: [
                'Watched water level',
                'Waited patiently',
                'Noted how long it took',
              ],
            },
          ],
          observations: [
            {
              id: 'fast',
              label: 'Water Disappears Fast',
              emoji: '⚡',
              description: 'Within 5-10 minutes, water is gone',
              value: 'fast_drainage',
            },
            {
              id: 'medium',
              label: 'Takes Some Time',
              emoji: '⏳',
              description: '10-30 minutes for water to drain',
              value: 'medium_drainage',
            },
            {
              id: 'slow',
              label: 'Water Stays Long',
              emoji: '💧',
              description: 'More than 30 minutes, water still there',
              value: 'slow_drainage',
            },
          ],
        };

      case 'moisture':
        return {
          name: 'Moisture Feel Test',
          emoji: '✋',
          steps: [
            {
              id: 1,
              title: 'Take Soil from Root Area',
              instruction: 'Dig 2-3 inches deep near plant roots. Take soil in your hand.',
              visual: 'illustration-scoop',
              voiceText: 'Take soil from 2 to 3 inches deep near plant roots',
              checklist: [
                'Dug near plant roots',
                'Went 2-3 inches deep',
                'Took handful of soil',
              ],
            },
            {
              id: 2,
              title: 'Squeeze in Hand',
              instruction: 'Squeeze the soil firmly in your fist. Feel the moisture.',
              visual: 'illustration-squeeze',
              voiceText: 'Squeeze soil in your fist and feel the moisture',
              checklist: [
                'Squeezed soil in fist',
                'Felt the moisture level',
                'Observed what happened',
              ],
            },
          ],
          observations: [
            {
              id: 'dry',
              label: 'Crumbles Like Powder',
              emoji: '💨',
              description: 'Dry, falls apart easily, no moisture',
              value: 'dry',
            },
            {
              id: 'adequate',
              label: 'Holds Shape',
              emoji: '✋',
              description: 'Forms shape, feels moist but no water comes out',
              value: 'adequate',
            },
            {
              id: 'wet',
              label: 'Water Comes Out',
              emoji: '💧',
              description: 'Very wet, water drips when squeezed',
              value: 'too_wet',
            },
          ],
        };

      case 'color':
        return {
          name: 'Soil Color Test',
          emoji: '🎨',
          steps: [
            {
              id: 1,
              title: 'Collect Dry Soil',
              instruction: 'Take soil from 4-6 inches deep. Spread on paper and let it dry completely.',
              visual: 'illustration-spread',
              voiceText: 'Take soil from 4 to 6 inches deep and let it dry',
              checklist: [
                'Collected soil from 4-6 inches',
                'Spread on clean paper',
                'Made sure it\'s completely dry',
              ],
            },
            {
              id: 2,
              title: 'Observe Color',
              instruction: 'Look at the dry soil color in sunlight. Compare with options below.',
              visual: 'illustration-color',
              voiceText: 'Look at the dry soil color in good sunlight',
              checklist: [
                'Soil is completely dry',
                'Looked in good light',
                'Ready to identify color',
              ],
            },
          ],
          observations: [
            {
              id: 'dark',
              label: 'Dark Brown / Black',
              emoji: '🟤',
              description: 'Rich dark color, looks fertile',
              value: 'dark_high_organic',
            },
            {
              id: 'red',
              label: 'Red / Yellow / Orange',
              emoji: '🟠',
              description: 'Reddish or yellowish tint',
              value: 'red_medium_organic',
            },
            {
              id: 'light',
              label: 'Light Brown / Grey',
              emoji: '⚪',
              description: 'Pale, light colored',
              value: 'light_low_organic',
            },
          ],
        };

      case 'ph':
        return {
          name: 'pH Test (Simple)',
          emoji: '🧪',
          steps: [
            {
              id: 1,
              title: 'Prepare Soil Water',
              instruction: 'Mix 2 spoons of soil with 4 spoons of clean water. Stir well and wait 5 minutes.',
              visual: 'illustration-mix',
              voiceText: 'Mix 2 spoons soil with 4 spoons water and wait',
              checklist: [
                'Mixed 2 spoons soil',
                'Added 4 spoons water',
                'Stirred well and waited',
              ],
            },
            {
              id: 2,
              title: 'Taste Test (Optional)',
              instruction: 'OPTIONAL: Touch a tiny drop to tongue tip. Does it feel sour, normal, or soapy?',
              visual: 'illustration-taste',
              voiceText: 'Optional: Test if it feels sour, normal, or soapy',
              checklist: [
                'Understood this is optional',
                'Can skip if not comfortable',
              ],
            },
          ],
          observations: [
            {
              id: 'acidic',
              label: 'Sour / Vinegar Like',
              emoji: '🍋',
              description: 'Feels acidic or sour',
              value: 'acidic',
            },
            {
              id: 'neutral',
              label: 'Normal / No Special Taste',
              emoji: '⚪',
              description: 'Neutral, no strong taste',
              value: 'neutral',
            },
            {
              id: 'alkaline',
              label: 'Bitter / Soapy',
              emoji: '🧼',
              description: 'Slightly bitter or soapy feeling',
              value: 'alkaline',
            },
          ],
        };

      default:
        return null;
    }
  };

  const testConfig = getTestConfig();
  if (!testConfig) return null;

  const currentStepData = testConfig.steps[currentStep];
  const isLastStep = currentStep === testConfig.steps.length - 1;
  const canProceed = isLastStep ? !!selectedObservation : checklistCompleted[currentStep];

  const handleNext = () => {
    if (isLastStep) {
      // Complete test with observation
      const result = {
        testType,
        observation: selectedObservation,
        timestamp: new Date(),
      };
      onComplete(result);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChecklistComplete = () => {
    setChecklistCompleted({ ...checklistCompleted, [currentStep]: true });
    toast.success('Step completed!');
  };

  const handlePlayVoice = () => {
    toast.success('Playing instructions in your language...');
    // In production, play actual audio
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
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{testConfig.emoji}</span>
              <h3 className="text-xl text-foreground">{testConfig.name}</h3>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Step {currentStep + 1} of {testConfig.steps.length}
            </div>
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
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / testConfig.steps.length) * 100}%` }}
              className="h-full bg-primary"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Step Content */}
            <div className="mb-6">
              {/* Title */}
              <div className="mb-4">
                <h4 className="text-2xl text-foreground mb-2">{currentStepData.title}</h4>
                <p className="text-foreground">{currentStepData.instruction}</p>
              </div>

              {/* Visual Placeholder */}
              <div className="mb-4 aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">{testConfig.emoji}</div>
                  <div className="text-sm text-muted-foreground mb-3">
                    {currentStepData.title}
                  </div>
                  <button
                    onClick={() => setShowVideo(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors mx-auto"
                  >
                    <Play className="w-4 h-4" />
                    Watch How To Do This
                  </button>
                </div>
              </div>

              {/* Voice Instructions */}
              <button
                onClick={handlePlayVoice}
                className="w-full mb-4 flex items-center justify-center gap-2 p-4 bg-blue-500/10 text-blue-600 rounded-lg hover:bg-blue-500/20 transition-colors border border-blue-500/20"
              >
                <Volume2 className="w-5 h-5" />
                <span>Play Voice Instructions</span>
              </button>

              {/* Checklist */}
              {currentStepData.checklist && (
                <div className="mb-6 p-4 bg-muted rounded-lg">
                  <div className="font-medium text-foreground mb-3">
                    ✓ Complete these steps:
                  </div>
                  <div className="space-y-2">
                    {currentStepData.checklist.map((item, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <Circle className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                  {!checklistCompleted[currentStep] && (
                    <button
                      onClick={handleChecklistComplete}
                      className="w-full mt-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      ✓ I've Done These Steps
                    </button>
                  )}
                  {checklistCompleted[currentStep] && (
                    <div className="mt-3 p-2 bg-green-500/10 rounded-lg border border-green-500/20 flex items-center justify-center gap-2 text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm">Steps completed!</span>
                    </div>
                  )}
                </div>
              )}

              {/* Observations (Last Step) */}
              {isLastStep && (
                <div className="space-y-3">
                  <div className="text-foreground font-medium mb-3">
                    What did you observe? (Tap your answer)
                  </div>
                  {testConfig.observations.map((obs) => (
                    <button
                      key={obs.id}
                      onClick={() => setSelectedObservation(obs.value)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedObservation === obs.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{obs.emoji}</div>
                        <div className="flex-1">
                          <div className="text-foreground font-medium mb-1">{obs.label}</div>
                          <div className="text-sm text-muted-foreground">{obs.description}</div>
                        </div>
                        {selectedObservation === obs.value && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Help */}
        <div className="mb-6 p-3 bg-muted rounded-lg">
          <button className="flex items-center gap-2 text-sm text-primary hover:underline">
            <HelpCircle className="w-4 h-4" />
            Need help? Talk to Expert
          </button>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 sticky bottom-0 bg-card pt-4 border-t border-border">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-6 py-3 rounded-lg border-2 border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLastStep ? 'Complete Test' : 'Next Step'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}