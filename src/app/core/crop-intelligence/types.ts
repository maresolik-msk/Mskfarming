export type CropType = 'Oilseed' | 'Cereal' | 'Pulse';
export type Season = 'Kharif' | 'Rabi' | 'Summer';
export type SoilType = 'Sandy' | 'Loam' | 'Clay' | 'Black' | 'Red' | 'All';
export type SowingMethod = 'Dibbling' | 'Broadcasting' | 'Line Sowing' | 'Transplanting';

export interface Crop {
  id: string;
  name: string;
  type: CropType;
  seasons: Season[];
  durationDays: { min: number; max: number };
  soilPreference: {
    types: SoilType[];
    phRange: { min: number; max: number };
  };
  climateTolerance: string;
  varieties: Variety[];
  growthStages: GrowthStage[]; 
  seedTreatment?: SeedTreatment;
  harvestProfile: HarvestProfile;
  riskProfile?: RiskProfile;
}

export interface Variety {
  id: string;
  name: string;
  type: 'Traditional' | 'Hybrid' | 'Improved';
  durationDays: number;
  yieldPotential: 'High' | 'Medium' | 'Low';
  diseaseResistance: string[];
  stressTolerance: {
    drought: 'High' | 'Medium' | 'Low';
    excessRain: 'High' | 'Medium' | 'Low';
  };
  source: string; // ICAR, SAU, etc.
  seedRate: {
    baseKgPerAcre: number;
    method?: SowingMethod; 
  };
  // Optional override for growth stages if this variety is significantly different
  growthStages?: GrowthStage[];
  harvestProfile?: HarvestProfile; // Variety specific override
}

export interface GrowthStage {
  id: string;
  name: string;
  startDay: number;
  endDay: number;
  focus: string;
  risk: string;
  description?: string; // "What happens in this stage"
}

export interface HarvestProfile {
  maturitySigns: string[];
  harvestWindowDays: { min: number; max: number }; // e.g. 5-7 days after maturity signs
  commonMistakes: string[];
}

export interface RiskProfile {
  topRisks: string[];
  generalCare: string[];
  climateSensitivity: string;
}

export interface Crop {
  id: string;
  name: string;
  type: CropType;
  seasons: Season[];
  durationDays: { min: number; max: number };
  soilPreference: {
    types: SoilType[];
    phRange: { min: number; max: number };
  };
  climateTolerance: string;
  varieties: Variety[];
  growthStages: GrowthStage[]; 
  seedTreatment?: SeedTreatment;
  harvestProfile: HarvestProfile; // Default for crop
  riskProfile?: RiskProfile; // General crop risks
}
  fungicide?: string;
  bioInoculant?: string;
  purpose: string;
  notes?: string;
}

export interface SeedQualityStandards {
  maxAgeMonths: number;
  minGerminationPercent: number;
  visualRejectionRules: string[];
}

export interface VarietyFullDetails {
  varietyId: string;
  varietyName: string;
  cropName: string;
  season: string;
  durationDays: string;
  yieldPotential: string;
  diseaseResistance: string; // Summarized string
  survivabilityScore: number; // 1-5
  suitableConditions: string;
  seed: {
    idealGermination: string;
    minGermination: string;
    seedRatePerAcre: string;
    adjustmentLogic: string;
    treatment: {
      required: boolean;
      details: string;
      purpose: string;
    };
  };
  growthCycle: {
    stageName: string;
    duration: string;
    whatHappens: string; // focus
    risk: string;
    isCurrent?: boolean; // For dynamic logic
  }[];
  harvest: {
    maturitySigns: string;
    harvestWindow: string;
    mistakesToAvoid: string;
  };
  risksAndCare: {
    topRisks: string[];
    careNotes: string[];
  };
}

// API Request/Response Models
export interface SeedCalculationRequest {
  cropId: string;
  varietyId: string;
  acres: number;
  germinationPercentage?: number;
  sowingMethod?: SowingMethod;
}

export interface SeedCalculationResult {
  requiredKg: number;
  baseKg: number;
  isAdjusted: boolean;
  adjustmentFactor: number;
  adjustmentReason?: string;
  confidence: 'High' | 'Medium' | 'Low';
  treatmentRecommendation?: SeedTreatment;
  qualityStandards?: SeedQualityStandards;
}

export interface CropStatusRequest {
  cropId: string;
  varietyId: string;
  sowingDate: string; // ISO Date
}

export interface CropStatusResult {
  currentStage: GrowthStage;
  daysAfterSowing: number;
  nextCriticalAction: string;
  daysToNextStage: number;
  primaryRisk: string;
}
