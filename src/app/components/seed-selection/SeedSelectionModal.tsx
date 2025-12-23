import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sprout, 
  Droplets, 
  Calendar, 
  Check, 
  ArrowRight, 
  Scale, 
  ShieldCheck, 
  Award, 
  PlayCircle,
  AlertTriangle,
  Info,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SheetClose } from '../ui/sheet'; // Just in case, though we are in a modal

import { CropIntelligenceService } from '../../core/crop-intelligence/service';
import { VarietyDetailView } from '../crop-intelligence/VarietyDetailView';

// Mock Data for Seeds (Fallback)
interface SeedVariety {
  id: string;
  name: string;
  crop: string;
  description: string;
  duration: string;
  yield: string;
  waterNeed: 'Low' | 'Medium' | 'High';
  diseaseResistance: 'Low' | 'Medium' | 'High';
  risk: 'Low' | 'Medium' | 'High';
  tags: string[];
  matchScore: number;
  matchReasons: string[];
  expertBadge?: string;
}

const SEED_DATABASE: SeedVariety[] = [
  {
    id: 's1',
    name: 'MTU-1010 (Cotton Dora Sannalu)',
    crop: 'Rice',
    description: 'A popular short-duration variety suitable for both seasons.',
    duration: '120-125 days',
    yield: '22-25 quintals/acre',
    waterNeed: 'Medium',
    diseaseResistance: 'High',
    risk: 'Low',
    tags: ['Short Duration', 'Blast Resistant'],
    matchScore: 92,
    matchReasons: ['Perfect for your Clay Loam soil', 'Fits within your water availability', 'High resistance to local pests'],
    expertBadge: 'KVK Recommended'
  },
  {
    id: 's2',
    name: 'BPT-5204 (Samba Mahsuri)',
    crop: 'Rice',
    description: 'Premium quality rice with excellent cooking characteristics.',
    duration: '145-150 days',
    yield: '20-22 quintals/acre',
    waterNeed: 'High',
    diseaseResistance: 'Medium',
    risk: 'Medium',
    tags: ['Premium Quality', 'High Market Value'],
    matchScore: 85,
    matchReasons: ['Good market price potential', 'Suitable for your soil type'],
    expertBadge: 'Used by 128 local farmers'
  },
  {
    id: 's3',
    name: 'RNR-15048 (Telangana Sona)',
    crop: 'Rice',
    description: 'Fine grain variety with low glycemic index.',
    duration: '125 days',
    yield: '24-26 quintals/acre',
    waterNeed: 'Low',
    diseaseResistance: 'High',
    risk: 'Low',
    tags: ['Water Efficient', 'Health Benefit'],
    matchScore: 88,
    matchReasons: ['Requires 30% less water', 'Ideal for current forecast'],
    expertBadge: 'ICAR Approved'
  }
];

interface SeedSelectionModalProps {
  onClose: () => void;
  fieldId: string;
  fieldName: string;
  soilType?: string; // Mocked for now if not available
}

export function SeedSelectionModal({ onClose, fieldId, fieldName, soilType = "Clay Loam" }: SeedSelectionModalProps) {
  const [step, setStep] = useState<'input' | 'analyzing' | 'results' | 'compare'>('input');
  const [selectedSeason, setSelectedSeason] = useState('Kharif');
  const [waterSource, setWaterSource] = useState('Borewell');
  
  // Dynamic Data State
  const [availableCrops, setAvailableCrops] = useState<any[]>([]);
  const [selectedCropId, setSelectedCropId] = useState<string>('');
  const [recommendedSeeds, setRecommendedSeeds] = useState<SeedVariety[]>([]);
  const [loadingCrops, setLoadingCrops] = useState(true);
  const [viewingVarietyId, setViewingVarietyId] = useState<string | null>(null);

  // Load Crops on Mount
  useEffect(() => {
    async function loadCrops() {
      try {
        const crops = await CropIntelligenceService.getCrops();
        setAvailableCrops(crops);
        if (crops.length > 0) setSelectedCropId(crops[0].id);
      } catch (err) {
        console.error("Failed to load crops", err);
      } finally {
        setLoadingCrops(false);
      }
    }
    loadCrops();
  }, []);
  
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisMessage, setAnalysisMessage] = useState('Initializing...');
  
  const [selectedSeedsForCompare, setSelectedSeedsForCompare] = useState<string[]>([]);

  // Simulate Analysis & Fetch Data
  useEffect(() => {
    if (step === 'analyzing') {
      const stages = [
        { progress: 10, msg: 'Checking soil compatibility...' },
        { progress: 30, msg: 'Analyzing historical rainfall data...' },
        { progress: 50, msg: 'Consulting ICAR & KVK databases...' },
        { progress: 70, msg: 'Checking pest & disease patterns...' },
        { progress: 90, msg: 'Finalizing recommendations...' },
        { progress: 100, msg: 'Done!' }
      ];
      
      let currentStage = 0;
      
      // Fetch varieties while animating
      const fetchData = async () => {
         const cropData = await CropIntelligenceService.getCrops(); // Re-fetch or use state
         const currentCrop = cropData.find(c => c.id === selectedCropId);
         
         if (currentCrop) {
           // Get details for all varieties of this crop
           const varietiesPromises = currentCrop.varieties.map(v => 
             CropIntelligenceService.getVarietyDetails(selectedCropId, v.id)
           );
           
           const varietiesDetails = (await Promise.all(varietiesPromises)).map(res => res.data).filter(Boolean);
           
           // Map to UI Model
           const mappedSeeds: SeedVariety[] = varietiesDetails.map((v: any, idx) => ({
             id: v.id,
             name: v.name,
             crop: currentCrop.name,
             description: `${v.type} variety from ${v.source}.`,
             duration: `${v.durationDays} days`,
             yield: `${v.yieldPotential} Potential`,
             // Map Logic
             waterNeed: v.stressTolerance?.drought === 'High' ? 'Low' : v.stressTolerance?.drought === 'Medium' ? 'Medium' : 'High',
             diseaseResistance: v.diseaseResistance?.length > 0 ? 'High' : 'Medium',
             risk: v.stressTolerance?.excessRain === 'Low' ? 'High' : 'Low',
             tags: [v.type, ...v.diseaseResistance],
             matchScore: 85 + (idx * 5) % 15, // Mock score
             matchReasons: [`Suitable for ${selectedSeason}`, `Matches ${v.durationDays} day window`],
             expertBadge: v.source
           }));
           
           setRecommendedSeeds(mappedSeeds);
         }
      };
      
      fetchData();

      const interval = setInterval(() => {
        if (currentStage >= stages.length) {
          clearInterval(interval);
          setTimeout(() => setStep('results'), 500);
          return;
        }
        
        setAnalysisProgress(stages[currentStage].progress);
        setAnalysisMessage(stages[currentStage].msg);
        currentStage++;
      }, 800); // Slightly slower to allow fetch
      
      return () => clearInterval(interval);
    }
  }, [step, selectedCropId]);

  const handleToggleCompare = (id: string) => {
    if (selectedSeedsForCompare.includes(id)) {
      setSelectedSeedsForCompare(prev => prev.filter(s => s !== id));
    } else {
      if (selectedSeedsForCompare.length < 2) {
        setSelectedSeedsForCompare(prev => [...prev, id]);
      }
    }
  };

  // Render Detail View if selected
  if (viewingVarietyId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-card w-full max-w-lg max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-1 overflow-y-auto relative bg-background">
            <VarietyDetailView 
              cropId={selectedCropId} 
              varietyId={viewingVarietyId} 
              onBack={() => setViewingVarietyId(null)} 
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-card w-full max-w-lg max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Sprout className="w-5 h-5 text-primary" />
              Smart Seed Advisor
            </h2>
            <p className="text-xs text-muted-foreground">Expert recommendations for {fieldName}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* STEP 1: INPUTS */}
          {step === 'input' && (
            <div className="space-y-6">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">AI Assistant</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    I'll analyze government data, local weather, and your soil report to find the perfect seed for you.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Season</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Kharif', 'Rabi', 'Summer'].map(season => (
                      <button
                        key={season}
                        onClick={() => setSelectedSeason(season)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                          selectedSeason === season 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'bg-background border-border hover:bg-muted'
                        }`}
                      >
                        {season}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Crop Preference</label>
                  {loadingCrops ? (
                    <div className="h-10 bg-muted animate-pulse rounded-lg" />
                  ) : (
                    <select 
                      value={selectedCropId}
                      onChange={(e) => setSelectedCropId(e.target.value)}
                      className="w-full p-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      {availableCrops.map(crop => (
                        <option key={crop.id} value={crop.id}>{crop.name}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Water Source</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Canal', 'Borewell', 'Rainfed', 'Tank'].map(source => (
                      <button
                        key={source}
                        onClick={() => setWaterSource(source)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all text-left flex items-center gap-2 ${
                          waterSource === source 
                            ? 'bg-blue-50 border-blue-200 text-blue-700' 
                            : 'bg-background border-border hover:bg-muted'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${waterSource === source ? 'bg-blue-500' : 'bg-muted-foreground'}`} />
                        {source}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted p-2 rounded-lg">
                    <Check className="w-3 h-3 text-green-600" />
                    Using Soil Data: <strong>{soilType}</strong> (from Soil Test)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ANALYZING */}
          {step === 'analyzing' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted/30"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={226} // 2 * pi * 36
                    strokeDashoffset={226 - (226 * analysisProgress) / 100}
                    className="text-primary transition-all duration-300 ease-in-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sprout className="w-8 h-8 text-primary animate-bounce" />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-1">Finding Best Seeds</h3>
                <p className="text-sm text-muted-foreground animate-pulse">{analysisMessage}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full max-w-xs mt-4">
                <div className="bg-muted/50 p-2 rounded-lg flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="w-3 h-3" /> Soil Match
                </div>
                <div className="bg-muted/50 p-2 rounded-lg flex items-center gap-2 text-xs text-muted-foreground">
                  <Droplets className="w-3 h-3" /> Rainfall
                </div>
                <div className="bg-muted/50 p-2 rounded-lg flex items-center gap-2 text-xs text-muted-foreground">
                  <Award className="w-3 h-3" /> Expert Data
                </div>
                <div className="bg-muted/50 p-2 rounded-lg flex items-center gap-2 text-xs text-muted-foreground">
                  <Scale className="w-3 h-3" /> Yield Risk
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: RESULTS */}
          {step === 'results' && (
            <div className="space-y-6">
              {/* Voice Explain Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Top Recommendations</h3>
                <button className="flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">
                  <PlayCircle className="w-3 h-3" />
                  Listen to Expert
                </button>
              </div>

              <div className="space-y-4">
                {recommendedSeeds.length === 0 ? (
                   <div className="text-center py-8 text-muted-foreground">
                     <p>No varieties found for this crop/season.</p>
                   </div>
                ) : (
                  recommendedSeeds.map((seed, index) => (
                  <motion.div
                    key={seed.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-border rounded-xl p-4 bg-card relative overflow-hidden group"
                  >
                    {/* Badge */}
                    {seed.expertBadge && (
                      <div className="absolute top-0 right-0 bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-bl-lg border-b border-l border-blue-100 flex items-center gap-1">
                        <Award className="w-3 h-3" /> {seed.expertBadge}
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-3 mt-1 cursor-pointer" onClick={() => setViewingVarietyId(seed.id)}>
                      <div>
                        <h4 className="font-bold text-lg text-foreground hover:text-primary transition-colors flex items-center gap-2">
                          {seed.name} <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </h4>
                        <p className="text-xs text-muted-foreground">{seed.duration} • {seed.yield}</p>
                      </div>
                      <div className="flex flex-col items-end pt-5">
                        <div className={`text-xl font-bold ${seed.matchScore > 90 ? 'text-green-600' : 'text-amber-600'}`}>
                          {seed.matchScore}%
                        </div>
                        <span className="text-[10px] text-muted-foreground">Match</span>
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-3 mb-4 space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Why this seed?</p>
                      {seed.matchReasons.map((reason, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                          <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-3">
                      <div className="flex items-center gap-1">
                        <Droplets className="w-3 h-3" /> {seed.waterNeed} Water
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertTriangle className={`w-3 h-3 ${seed.risk === 'Low' ? 'text-green-500' : 'text-amber-500'}`} /> 
                        {seed.risk} Risk
                      </div>
                      <label className="ml-auto flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                          checked={selectedSeedsForCompare.includes(seed.id)}
                          onChange={() => handleToggleCompare(seed.id)}
                          disabled={!selectedSeedsForCompare.includes(seed.id) && selectedSeedsForCompare.length >= 2}
                        />
                        <span className="font-medium">Compare</span>
                      </label>
                    </div>
                  </motion.div>
                ))
              )}
              </div>
            </div>
          )}

          {/* STEP 4: COMPARE */}
          {step === 'compare' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {recommendedSeeds.filter(s => selectedSeedsForCompare.includes(s.id)).map(seed => (
                  <div key={seed.id} className="space-y-4">
                    <div className="h-12 flex items-center justify-center font-bold text-center border-b border-border pb-2">
                      {seed.name}
                    </div>
                    
                    <div className="space-y-4 text-sm">
                      <div>
                        <div className="text-xs text-muted-foreground">Yield</div>
                        <div className="font-medium">{seed.yield}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Duration</div>
                        <div className="font-medium">{seed.duration}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Water</div>
                        <div className="font-medium">{seed.waterNeed}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Risk</div>
                        <div className={`font-medium ${seed.risk === 'Low' ? 'text-green-600' : 'text-amber-600'}`}>
                          {seed.risk}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Disease Res.</div>
                        <div className="font-medium">{seed.diseaseResistance}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-muted/30">
          {step === 'input' && (
            <button 
              onClick={() => setStep('analyzing')}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Find Best Seeds <ArrowRight className="w-5 h-5" />
            </button>
          )}

          {step === 'results' && (
            <div className="flex gap-3">
              <button 
                onClick={() => setStep('input')}
                className="flex-1 py-3 bg-background border border-border text-foreground rounded-xl font-medium hover:bg-muted transition-colors"
              >
                Start Over
              </button>
              <button 
                onClick={() => setStep('compare')}
                disabled={selectedSeedsForCompare.length < 2}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Compare ({selectedSeedsForCompare.length})
              </button>
            </div>
          )}

          {step === 'compare' && (
            <button 
              onClick={() => setStep('results')}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Back to List
            </button>
          )}

          {step === 'analyzing' && (
             <div className="w-full py-3 text-center text-sm text-muted-foreground">
               Please wait...
             </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
