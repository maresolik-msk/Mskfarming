import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  Check,
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
  const [confidenceLevel, setConfidenceLevel] = useState(0.7);
  const [sampleSpots, setSampleSpots] = useState(1);

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
              id: 'sandy_loam',
              label: 'Weak Ball, Crumbles Easily',
              emoji: '🟡',
              description: 'Forms weak ball but falls apart quickly, feels gritty',
              value: 'sandy_loam',
            },
            {
              id: 'loamy',
              label: 'Good Ball, Short Ribbon',
              emoji: '🟢',
              description: 'Forms solid ball, ribbon breaks at 1-2 cm — best soil!',
              value: 'loamy',
            },
            {
              id: 'clay_loam',
              label: 'Firm Ball, Medium Ribbon',
              emoji: '🟠',
              description: 'Firm ball, ribbon 2-4 cm, slightly sticky',
              value: 'clay_loam',
            },
            {
              id: 'clay',
              label: 'Very Sticky, Long Ribbon',
              emoji: '🟤',
              description: 'Very sticky ball, ribbon over 5 cm without breaking',
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
              description: 'Rich dark color, looks fertile — high organic matter',
              value: 'dark_high_organic',
            },
            {
              id: 'dark_brown',
              label: 'Medium Brown',
              emoji: '🫘',
              description: 'Brownish color, moderate organic content',
              value: 'dark_brown',
            },
            {
              id: 'red',
              label: 'Red / Reddish Brown',
              emoji: '🟠',
              description: 'Reddish tint — iron-rich soil, medium organic matter',
              value: 'red_medium_organic',
            },
            {
              id: 'yellow',
              label: 'Yellow / Orange',
              emoji: '🟡',
              description: 'Yellowish tint — leached soil, low-medium organic',
              value: 'yellow_orange',
            },
            {
              id: 'light',
              label: 'Light Brown / Grey',
              emoji: '⚪',
              description: 'Pale, light colored — low organic matter',
              value: 'light_low_organic',
            },
            {
              id: 'white',
              label: 'White / Grey with Crust',
              emoji: '🧂',
              description: 'White patches or crust — possible salt/alkaline problem',
              value: 'white_grey',
            },
          ],
        };

      case 'ph':
        return {
          name: 'pH Test (Vinegar & Baking Soda)',
          emoji: '🧪',
          steps: [
            {
              id: 1,
              title: 'Collect Two Soil Samples',
              instruction: 'Take 2 tablespoons of soil and put into two separate cups or bowls.',
              visual: 'illustration-cups',
              voiceText: 'Put 2 spoons of soil into two separate cups',
              checklist: [
                'Prepared 2 clean cups',
                'Put 2 spoons soil in each cup',
              ],
            },
            {
              id: 2,
              title: 'Vinegar Test (Acid Check)',
              instruction: 'Pour 2 spoons of regular vinegar (sirka) on the FIRST cup of soil. Watch for fizzing or bubbles.',
              visual: 'illustration-vinegar',
              voiceText: 'Pour vinegar on first cup. If it fizzes, soil is alkaline.',
              checklist: [
                'Poured vinegar on first cup',
                'Watched for 30 seconds',
                'Noted if bubbles appeared',
              ],
            },
            {
              id: 3,
              title: 'Baking Soda Test (Alkaline Check)',
              instruction: 'Add a little water to the SECOND cup to make soil moist, then add 2 spoons baking soda (meetha soda). Watch for fizzing.',
              visual: 'illustration-soda',
              voiceText: 'Add water then baking soda to second cup. If it fizzes, soil is acidic.',
              checklist: [
                'Added water to second cup',
                'Added baking soda',
                'Watched for fizzing',
              ],
            },
          ],
          observations: [
            {
              id: 'very_acidic',
              label: 'Strong Fizz with Baking Soda',
              emoji: '🍋',
              description: 'Second cup fizzed a lot — soil is strongly acidic',
              value: 'very_acidic',
            },
            {
              id: 'acidic',
              label: 'Some Fizz with Baking Soda',
              emoji: '🟡',
              description: 'Second cup fizzed a little — soil is mildly acidic',
              value: 'acidic',
            },
            {
              id: 'neutral',
              label: 'No Fizz in Either Cup',
              emoji: '🟢',
              description: 'Neither cup fizzed — soil is neutral (ideal!)',
              value: 'neutral',
            },
            {
              id: 'slightly_alkaline',
              label: 'Some Fizz with Vinegar',
              emoji: '🟠',
              description: 'First cup fizzed a little — soil is mildly alkaline',
              value: 'slightly_alkaline',
            },
            {
              id: 'alkaline',
              label: 'Strong Fizz with Vinegar',
              emoji: '🧼',
              description: 'First cup fizzed a lot — soil is strongly alkaline',
              value: 'very_alkaline',
            },
          ],
        };

      case 'jar_test':
        return {
          name: 'Jar Settling Test',
          emoji: '🫙',
          steps: [
            {
              id: 1,
              title: 'Prepare the Jar',
              instruction: 'Fill a clean glass jar (mason jar or tall glass bottle) 1/3 full with soil from 6 inches deep. Remove stones and roots.',
              visual: 'illustration-jar-fill',
              voiceText: 'Fill a glass jar one third with clean soil',
              checklist: [
                'Got a clean glass jar',
                'Filled 1/3 with soil',
                'Removed stones and roots',
              ],
            },
            {
              id: 2,
              title: 'Add Water & Shake',
              instruction: 'Fill the jar with water to almost full. Add 1 teaspoon salt or dish soap. Close lid and shake vigorously for 2 minutes.',
              visual: 'illustration-jar-shake',
              voiceText: 'Fill with water, add salt, close and shake hard for 2 minutes',
              checklist: [
                'Filled with water',
                'Added 1 teaspoon salt',
                'Closed lid tightly',
                'Shook for 2 full minutes',
              ],
            },
            {
              id: 3,
              title: 'Let it Settle (24 hours)',
              instruction: 'Put the jar on a flat surface and DO NOT disturb it for 24 hours. Sand settles in 1 min, silt in 2-4 hours, clay in 24 hours. You\'ll see distinct layers.',
              visual: 'illustration-jar-settle',
              voiceText: 'Leave jar undisturbed for 24 hours. You will see layers of sand, silt, and clay.',
              checklist: [
                'Placed on flat surface',
                'Waited 24 hours',
                'Can see distinct layers',
              ],
            },
          ],
          observations: [
            {
              id: 'mostly_sand',
              label: 'Bottom Layer is Biggest (>60%)',
              emoji: '⚪',
              description: 'Thick sand at bottom, thin middle and top — Sandy soil',
              value: 'mostly_sand',
            },
            {
              id: 'sand_silt_mix',
              label: 'Bottom & Middle Layers are Equal',
              emoji: '🟡',
              description: 'Good sand layer + good silt layer — Sandy Loam',
              value: 'sand_silt_mix',
            },
            {
              id: 'balanced',
              label: 'Three Roughly Equal Layers',
              emoji: '🟢',
              description: 'Similar sized layers of sand, silt, clay — Loam (best!)',
              value: 'balanced',
            },
            {
              id: 'mostly_silt',
              label: 'Middle Layer is Biggest',
              emoji: '🟠',
              description: 'Thin bottom, thick middle, thin top — Silty soil',
              value: 'mostly_silt',
            },
            {
              id: 'silt_clay_mix',
              label: 'Middle & Top Layers are Biggest',
              emoji: '🔵',
              description: 'Little sand, lots of silt and clay — Silty Clay',
              value: 'silt_clay_mix',
            },
            {
              id: 'mostly_clay',
              label: 'Top Layer is Biggest, Water Cloudy',
              emoji: '🟤',
              description: 'Little sand, thin silt, thick clay, murky water — Heavy Clay',
              value: 'mostly_clay',
            },
          ],
        };

      case 'smell':
        return {
          name: 'Soil Smell Test',
          emoji: '👃',
          steps: [
            {
              id: 1,
              title: 'Dig Fresh Soil',
              instruction: 'Dig 4-6 inches deep and immediately take a handful of FRESH soil. This test works best just after light rain or watering.',
              visual: 'illustration-fresh-dig',
              voiceText: 'Dig 4 to 6 inches deep and take a handful of fresh soil',
              checklist: [
                'Dug 4-6 inches deep',
                'Soil is freshly dug',
                'Took a handful',
              ],
            },
            {
              id: 2,
              title: 'Smell the Soil',
              instruction: 'Bring the soil close to your nose and take a deep breath. Healthy soil has a pleasant "petrichor" (after-rain) smell. Unhealthy soil smells sour or like chemicals.',
              visual: 'illustration-smell',
              voiceText: 'Smell the soil deeply. Healthy soil smells like fresh earth after rain.',
              checklist: [
                'Brought soil near nose',
                'Took a deep breath',
                'Identified the smell',
              ],
            },
          ],
          observations: [
            {
              id: 'earthy_sweet',
              label: 'Sweet, Earthy, Like After Rain',
              emoji: '🌱',
              description: 'Pleasant earthy smell — excellent microbial life',
              value: 'earthy_sweet',
            },
            {
              id: 'earthy_mild',
              label: 'Mild Earthy Smell',
              emoji: '🟢',
              description: 'Some earth smell but not strong — decent biology',
              value: 'earthy_mild',
            },
            {
              id: 'no_smell',
              label: 'No Particular Smell',
              emoji: '⚪',
              description: 'Smells like nothing — low microbial activity',
              value: 'no_smell',
            },
            {
              id: 'sour_rotten',
              label: 'Sour, Rotten, Metallic',
              emoji: '🔴',
              description: 'Bad smell — waterlogged or anaerobic conditions',
              value: 'sour_rotten',
            },
          ],
        };

      case 'worm_count':
        return {
          name: 'Earthworm Count Test',
          emoji: '🪱',
          steps: [
            {
              id: 1,
              title: 'Mark a Square Area',
              instruction: 'Mark a 1 foot x 1 foot (30cm x 30cm) square area in your field. Choose a spot with some plant cover, not bare ground.',
              visual: 'illustration-square',
              voiceText: 'Mark a 1 foot by 1 foot area in your field',
              checklist: [
                'Found spot with plant cover',
                'Marked 1 foot square',
              ],
            },
            {
              id: 2,
              title: 'Dig 1 Foot Deep',
              instruction: 'Carefully dig out all the soil in this square, 1 foot deep. Put the soil on a sheet or clean surface.',
              visual: 'illustration-dig-square',
              voiceText: 'Dig out all soil in the square, 1 foot deep',
              checklist: [
                'Dug carefully',
                'Went 1 foot deep',
                'Put soil on clean surface',
              ],
            },
            {
              id: 3,
              title: 'Count Earthworms',
              instruction: 'Break apart the soil gently and count ALL earthworms you see. Include big and small ones. Be patient and thorough!',
              visual: 'illustration-count',
              voiceText: 'Break apart soil gently and count all earthworms',
              checklist: [
                'Broke apart soil gently',
                'Counted all worms carefully',
                'Put soil back after counting',
              ],
            },
          ],
          observations: [
            {
              id: 'many',
              label: '10 or More Worms',
              emoji: '🟢',
              description: 'Excellent! Rich, biologically active soil',
              value: 'many_10plus',
            },
            {
              id: 'several',
              label: '5 to 9 Worms',
              emoji: '🟡',
              description: 'Good soil health, but can improve',
              value: 'several_5_10',
            },
            {
              id: 'few',
              label: '1 to 4 Worms',
              emoji: '🟠',
              description: 'Below average — soil needs more organic matter',
              value: 'few_1_4',
            },
            {
              id: 'none',
              label: 'No Worms Found',
              emoji: '🔴',
              description: 'Poor soil biology — needs urgent organic improvement',
              value: 'none',
            },
          ],
        };

      case 'compaction':
        return {
          name: 'Compaction Test (Wire/Stick)',
          emoji: '📌',
          steps: [
            {
              id: 1,
              title: 'Get a Wire or Stick',
              instruction: 'Find a stiff wire (like a bicycle spoke or clothes hanger wire) or a thin metal rod about 1 foot (30cm) long. A pointed stick also works.',
              visual: 'illustration-wire',
              voiceText: 'Get a stiff wire or thin metal rod, about 1 foot long',
              checklist: [
                'Found stiff wire or thin rod',
                'Wire is about 1 foot long',
                'Wire has a pointed end',
              ],
            },
            {
              id: 2,
              title: 'Push Into Soil',
              instruction: 'Push the wire straight down into moist soil (not dry, not waterlogged). Use steady, even pressure — do not hammer it. Try 3-5 spots across your field.',
              visual: 'illustration-push',
              voiceText: 'Push wire straight down into moist soil. Try 3 to 5 spots.',
              checklist: [
                'Soil is moist, not dry',
                'Pushed wire straight down',
                'Tried at 3-5 different spots',
                'Used steady pressure only',
              ],
            },
            {
              id: 3,
              title: 'Observe Resistance',
              instruction: 'Note how easily the wire goes in. Does it go smoothly, or does it stop at a hard layer? The depth where it stops tells you about compaction.',
              visual: 'illustration-observe-resistance',
              voiceText: 'Note how deep the wire goes and how much force is needed',
              checklist: [
                'Noted the resistance',
                'Checked depth wire reached',
                'Tried multiple spots to confirm',
              ],
            },
          ],
          observations: [
            {
              id: 'wire_easy',
              label: 'Wire Goes In Easily (Full Depth)',
              emoji: '🟢',
              description: 'No resistance — wire goes 10+ inches with gentle push. Excellent!',
              value: 'wire_easy',
            },
            {
              id: 'wire_moderate',
              label: 'Some Resistance at 6-8 Inches',
              emoji: '🟡',
              description: 'Wire goes 6-8 inches then hits mild resistance',
              value: 'wire_moderate',
            },
            {
              id: 'wire_hard',
              label: 'Stops at 3-5 Inches',
              emoji: '🟠',
              description: 'Wire hits hard layer at 3-5 inches — moderate compaction',
              value: 'wire_hard',
            },
            {
              id: 'wire_impossible',
              label: 'Barely Goes In (0-2 Inches)',
              emoji: '🔴',
              description: 'Cannot push wire past 2 inches — severe compaction or hardpan',
              value: 'wire_impossible',
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
      // Complete test with observation + accuracy metadata
      const result = {
        testType,
        observation: selectedObservation,
        confidence: confidenceLevel,
        sampleSpots: sampleSpots,
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
        className="bg-card rounded-3xl p-0 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-hidden flex flex-col ring-1 ring-white/10"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 bg-card/95 backdrop-blur-sm border-b border-border shrink-0 z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{testConfig.emoji}</span>
              <h3 className="text-xl font-bold text-foreground font-[Megrim]">{testConfig.name}</h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-widest mt-1">
              <span className="w-2 h-2 rounded-full bg-[#812F0F] animate-pulse"></span>
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
        <div className="w-full h-1 bg-muted/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / testConfig.steps.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-[#812F0F] to-[#963714]"
          />
        </div>

        <div className="overflow-y-auto p-6 flex-1 scrollbar-hide">
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
              <div className="mb-6 text-center">
                <h4 className="text-2xl font-bold text-foreground mb-3">{currentStepData.title}</h4>
                <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">{currentStepData.instruction}</p>
              </div>

              {/* Visual Placeholder */}
              <div className="mb-6 aspect-video bg-gradient-to-br from-[#812F0F]/5 to-transparent rounded-2xl border border-[#812F0F]/10 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.05)_100%)] pointer-events-none" />
                
                <div className="text-center p-8 relative z-10">
                  <div className="w-20 h-20 rounded-full bg-[#812F0F]/10 flex items-center justify-center mx-auto mb-4 border border-[#812F0F]/20 shadow-inner">
                    <span className="text-5xl">{testConfig.emoji}</span>
                  </div>
                  
                  <button
                    onClick={() => setShowVideo(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#812F0F] text-white rounded-full hover:bg-[#963714] transition-all shadow-lg shadow-[#812F0F]/20 group-hover:scale-105 active:scale-95"
                  >
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <Play className="w-3 h-3 fill-current" />
                    </div>
                    <span className="text-sm font-bold">Watch Tutorial</span>
                  </button>
                </div>
              </div>

              {/* Voice Instructions */}
              <button
                onClick={handlePlayVoice}
                className="w-full mb-6 flex items-center justify-center gap-3 p-4 bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-xl hover:bg-amber-500/20 transition-colors border border-amber-500/20 group"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Volume2 className="w-4 h-4" />
                </div>
                <span className="font-medium">Play Voice Instructions</span>
              </button>

              {/* Checklist */}
              {currentStepData.checklist && (
                <div className="mb-8 p-5 bg-muted/30 rounded-2xl border border-border/50">
                  <div className="font-bold text-xs uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#812F0F]" />
                    Action Checklist
                  </div>
                  <div className="space-y-3">
                    {currentStepData.checklist.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 text-sm p-3 bg-card rounded-xl border border-border/50">
                        <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${checklistCompleted[currentStep] ? 'border-[#812F0F] bg-[#812F0F]' : 'border-muted-foreground/30'}`}>
                            {checklistCompleted[currentStep] && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`transition-opacity ${checklistCompleted[currentStep] ? 'opacity-50 line-through' : 'opacity-100'}`}>{item}</span>
                      </div>
                    ))}
                  </div>
                  {!checklistCompleted[currentStep] && (
                    <button
                      onClick={handleChecklistComplete}
                      className="w-full mt-4 py-3 bg-[#812F0F] text-white rounded-xl hover:bg-[#963714] transition-all font-bold shadow-md shadow-[#812F0F]/20 flex items-center justify-center gap-2"
                    >
                      <span>I've Done These Steps</span>
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  {checklistCompleted[currentStep] && (
                    <div className="mt-4 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-center gap-2 text-emerald-600 font-medium animate-in fade-in zoom-in">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                      Steps completed!
                    </div>
                  )}
                </div>
              )}

              {/* Observations (Last Step) */}
              {isLastStep && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h5 className="font-bold text-lg">What did you observe?</h5>
                    <p className="text-sm text-muted-foreground">Select the option that best matches your result</p>
                  </div>
                  
                  {/* Color Swatches for color test */}
                  {testType === 'color' && (
                    <div className="p-4 bg-muted/30 rounded-xl border border-border/50 mb-4">
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Visual Color Reference</div>
                      <div className="flex gap-2 justify-center flex-wrap">
                        {[
                          { color: '#2C1810', label: 'Dark/Black' },
                          { color: '#5C3A21', label: 'Med. Brown' },
                          { color: '#A0522D', label: 'Reddish' },
                          { color: '#D4A340', label: 'Yellow' },
                          { color: '#B8A898', label: 'Light Grey' },
                          { color: '#E8E0D8', label: 'White/Salt' },
                        ].map(s => (
                          <div key={s.color} className="text-center">
                            <div className="w-10 h-10 rounded-lg border border-border/50 shadow-sm mx-auto" style={{ backgroundColor: s.color }} />
                            <div className="text-[9px] mt-1 text-muted-foreground font-medium">{s.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid gap-3">
                  {testConfig.observations.map((obs) => (
                    <button
                      key={obs.id}
                      onClick={() => setSelectedObservation(obs.value)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all relative overflow-hidden group ${
                        selectedObservation === obs.value
                          ? 'border-[#812F0F] bg-[#812F0F]/5'
                          : 'border-border hover:border-[#812F0F]/30 hover:bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center gap-4 relative z-10">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border transition-colors ${
                            selectedObservation === obs.value ? 'bg-[#812F0F]/10 border-[#812F0F]/20' : 'bg-muted border-border'
                        }`}>
                            {obs.emoji}
                        </div>
                        <div className="flex-1">
                          <div className={`font-bold mb-0.5 ${selectedObservation === obs.value ? 'text-[#812F0F]' : 'text-foreground'}`}>{obs.label}</div>
                          <div className="text-xs text-muted-foreground">{obs.description}</div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            selectedObservation === obs.value ? 'border-[#812F0F] bg-[#812F0F]' : 'border-muted-foreground/30'
                        }`}>
                            {selectedObservation === obs.value && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </div>
                    </button>
                  ))}
                  </div>
                  
                  {/* Accuracy Metadata: Confidence + Sampling Spots */}
                  {selectedObservation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 p-5 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl border border-blue-500/10"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <span className="text-xs">🎯</span>
                        </div>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Improve Accuracy</span>
                      </div>
                      
                      {/* Confidence Slider */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">How sure are you?</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            confidenceLevel >= 0.8 ? 'bg-emerald-500/10 text-emerald-600' :
                            confidenceLevel >= 0.5 ? 'bg-amber-500/10 text-amber-600' :
                            'bg-red-500/10 text-red-600'
                          }`}>
                            {confidenceLevel >= 0.8 ? 'Very Sure' : confidenceLevel >= 0.5 ? 'Somewhat Sure' : 'Not Sure'}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.3"
                          max="1.0"
                          step="0.1"
                          value={confidenceLevel}
                          onChange={(e) => setConfidenceLevel(parseFloat(e.target.value))}
                          className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-[#812F0F]"
                        />
                        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                          <span>Not sure</span>
                          <span>Very sure</span>
                        </div>
                      </div>
                      
                      {/* Sampling Spots */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">How many spots did you test?</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            sampleSpots >= 5 ? 'bg-emerald-500/10 text-emerald-600' :
                            sampleSpots >= 3 ? 'bg-amber-500/10 text-amber-600' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {sampleSpots >= 5 ? 'Excellent sampling' : sampleSpots >= 3 ? 'Good sampling' : '1 spot'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {[1, 2, 3, 5, 7].map(n => (
                            <button
                              key={n}
                              onClick={() => setSampleSpots(n)}
                              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                sampleSpots === n
                                  ? 'bg-[#812F0F] text-white shadow-md shadow-[#812F0F]/20'
                                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                              }`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1.5">
                          Testing 3-5 spots increases accuracy by 15-25%
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-4 bg-card border-t border-border shrink-0 flex flex-col gap-4">
            {/* Help Link */}
            <div className="flex justify-center">
                <button className="flex items-center gap-2 text-xs font-bold text-[#812F0F] hover:underline uppercase tracking-wider">
                    <HelpCircle className="w-3.5 h-3.5" />
                    Need help? Talk to Expert
                </button>
            </div>

            <div className="flex gap-3">
            <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="px-6 py-3.5 rounded-xl border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
            >
                <ChevronLeft className="w-5 h-5" />
                Back
            </button>

            <button
                onClick={handleNext}
                disabled={!canProceed}
                className="flex-1 py-3.5 rounded-xl bg-[#812F0F] text-white hover:bg-[#963714] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#812F0F]/20 flex items-center justify-center gap-2 font-bold"
            >
                {isLastStep ? 'Complete Test' : 'Next Step'}
                <ChevronRight className="w-5 h-5" />
            </button>
            </div>
        </div>
      </motion.div>
    </div>
  );
}