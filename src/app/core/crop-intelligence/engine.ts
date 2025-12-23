import { CROPS, SEED_STANDARDS_MAP } from './data';
import { 
  SeedCalculationRequest, 
  SeedCalculationResult, 
  CropStatusRequest, 
  CropStatusResult,
  GrowthStage,
  Variety,
  VarietyFullDetails
} from './types';

/**
 * Core Crop Intelligence Engine
 * Phase 1: Deterministic logic for specific crops
 */

export function getCropList() {
  return Object.values(CROPS).map(c => ({ 
    id: c.id, 
    name: c.name, 
    type: c.type,
    varieties: c.varieties.map(v => ({ id: v.id, name: v.name }))
  }));
}

export function getVarietyDetails(cropId: string, varietyId: string): Variety | null {
  const crop = CROPS[cropId];
  if (!crop) return null;
  return crop.varieties.find(v => v.id === varietyId) || null;
}

export function calculateSeedRate(request: SeedCalculationRequest): SeedCalculationResult {
  const crop = CROPS[request.cropId];
  const variety = crop?.varieties.find(v => v.id === request.varietyId);

  if (!crop || !variety) {
    throw new Error('Invalid crop or variety ID');
  }

  // 1. Determine Base Rate
  let baseRate = variety.seedRate.baseKgPerAcre;
  
  // If request specifies method and variety supports it (Future Phase), we could adjust here.
  // Currently variety.seedRate might imply a default method.

  // 2. Adjust for Germination
  const standards = SEED_STANDARDS_MAP[request.cropId];
  const targetGermination = standards.minGerminationPercent;
  const actualGermination = request.germinationPercentage || targetGermination; // Default to standard if unknown

  let adjustedRate = baseRate;
  let isAdjusted = false;
  let adjustmentReason = undefined;
  let adjustmentFactor = 1;

  if (actualGermination < targetGermination) {
    // Logic: If standard is 85% and actual is 70%, we need more seeds.
    // Factor = 85 / 70 = 1.21
    adjustmentFactor = targetGermination / actualGermination;
    adjustedRate = baseRate * adjustmentFactor;
    isAdjusted = true;
    adjustmentReason = `Low germination (${actualGermination}% vs std ${targetGermination}%). Increased seed rate by ${((adjustmentFactor - 1) * 100).toFixed(0)}%.`;
  }

  // 3. Scale by Acres
  const totalRequired = adjustedRate * request.acres;

  // 4. Determine Confidence
  // Simple logic: If we have specific variety data, High. If generic, Medium.
  const confidence = 'High'; // Phase 1 data is hardcoded for specific varieties

  return {
    requiredKg: Number(totalRequired.toFixed(2)),
    baseKg: Number((baseRate * request.acres).toFixed(2)),
    isAdjusted,
    adjustmentFactor,
    adjustmentReason,
    confidence,
    treatmentRecommendation: crop.seedTreatment,
    qualityStandards: standards
  };
}

export function getCropStatus(request: CropStatusRequest): CropStatusResult {
  const crop = CROPS[request.cropId];
  const variety = crop?.varieties.find(v => v.id === request.varietyId);

  if (!crop) throw new Error('Invalid crop ID');

  // Calculate days elapsed
  const sowingDate = new Date(request.sowingDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - sowingDate.getTime());
  const daysAfterSowing = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

  // Determine Stages (Variety override or Default)
  const stages = variety?.growthStages || crop.growthStages;

  // Find current stage
  let currentStage: GrowthStage | undefined = stages.find(
    s => daysAfterSowing >= s.startDay && daysAfterSowing <= s.endDay
  );

  // If beyond last stage
  if (!currentStage && daysAfterSowing > stages[stages.length - 1].endDay) {
    currentStage = {
      id: 'harvested',
      name: 'Harvest Completed',
      startDay: stages[stages.length - 1].endDay + 1,
      endDay: 999,
      focus: 'Post-harvest management',
      risk: 'Storage pests'
    };
  }

  // If before first stage (future date?)
  if (!currentStage) {
    currentStage = stages[0]; // Default to first if 0 or weird
  }

  // Find next stage
  const currentIndex = stages.findIndex(s => s.id === currentStage?.id);
  const nextStage = stages[currentIndex + 1];

  let daysToNextStage = 0;
  if (nextStage) {
    daysToNextStage = nextStage.startDay - daysAfterSowing;
  }

  return {
    currentStage,
    daysAfterSowing,
    nextCriticalAction: currentStage.focus,
    daysToNextStage: Math.max(0, daysToNextStage),
    primaryRisk: currentStage.risk
  };
}

export function getVarietyFullDetails(cropId: string, varietyId: string): VarietyFullDetails {
  const crop = CROPS[cropId];
  if (!crop) throw new Error('Crop not found');
  const variety = crop.varieties.find(v => v.id === varietyId);
  if (!variety) throw new Error('Variety not found');
  
  const standards = SEED_STANDARDS_MAP[cropId];
  const stages = variety.growthStages || crop.growthStages;
  const lastStage = stages[stages.length - 1];

  return {
    varietyId: variety.id,
    varietyName: variety.name,
    cropName: crop.name,
    season: crop.seasons.join(' / '),
    durationDays: `${variety.durationDays} days`,
    yieldPotential: variety.yieldPotential,
    diseaseResistance: variety.diseaseResistance.length > 0 ? variety.diseaseResistance.join(', ') : 'Moderate',
    survivabilityScore: variety.stressTolerance.drought === 'High' ? 5 : 4, // Mock logic
    suitableConditions: `${crop.soilPreference.types.join('/')} soil`,
    seed: {
      idealGermination: `>${standards.minGerminationPercent}%`,
      minGermination: `${standards.minGerminationPercent}%`,
      seedRatePerAcre: `${variety.seedRate.baseKgPerAcre} kg`,
      adjustmentLogic: `Increase by 1% for every 1% drop below ${standards.minGerminationPercent}%`,
      treatment: {
        required: !!crop.seedTreatment,
        details: crop.seedTreatment ? `${crop.seedTreatment.fungicide || ''} ${crop.seedTreatment.bioInoculant || ''}` : 'None',
        purpose: crop.seedTreatment?.purpose || ''
      }
    },
    growthCycle: stages.map(s => ({
      stageName: s.name,
      duration: `${s.startDay}-${s.endDay} days`,
      whatHappens: s.focus,
      risk: s.risk
    })),
    harvest: {
      maturitySigns: lastStage.focus,
      harvestWindow: `${lastStage.startDay}-${lastStage.endDay} days`,
      mistakesToAvoid: 'Delayed harvest causes shattering'
    },
    risksAndCare: {
      topRisks: [lastStage.risk, ...variety.diseaseResistance],
      careNotes: ['Maintain optimal moisture', 'Weed regularly']
    }
  };
}

export function getSeedTreatmentGuidance(cropId: string) {
  return CROPS[cropId]?.seedTreatment;
}
