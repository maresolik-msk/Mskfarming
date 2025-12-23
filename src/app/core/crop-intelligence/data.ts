import { Crop, GrowthStage, SeedQualityStandards } from './types';

// Shared Standards
const DEFAULT_SEED_STANDARDS: SeedQualityStandards = {
  maxAgeMonths: 12,
  minGerminationPercent: 85,
  visualRejectionRules: ['Discolored', 'Broken', 'Wrinkled', 'Insect damaged']
};

const PULSE_SEED_STANDARDS: SeedQualityStandards = {
  ...DEFAULT_SEED_STANDARDS,
  maxAgeMonths: 24, // Pulses store longer
  minGerminationPercent: 80
};

// Growth Stage Templates
const PULSE_STAGES: GrowthStage[] = [
  { id: 'germination', name: 'Germination', startDay: 0, endDay: 7, focus: 'Moisture management', risk: 'Seed rot, Damping off' },
  { id: 'vegetative', name: 'Vegetative', startDay: 8, endDay: 35, focus: 'Weed control, Thinning', risk: 'Aphids, Jassids' },
  { id: 'flowering', name: 'Flowering', startDay: 36, endDay: 55, focus: 'Avoid water stress', risk: 'Flower drop, Pod borer' },
  { id: 'pod-formation', name: 'Pod Formation', startDay: 56, endDay: 75, focus: 'Pod filling support', risk: 'Pod fly, Moisture stress' },
  { id: 'maturity', name: 'Maturity', startDay: 76, endDay: 90, focus: 'Harvest timing', risk: 'Shattering' }
];

export const CROPS: Record<string, Crop> = {
  'groundnut': {
    id: 'groundnut',
    name: 'Groundnut',
    type: 'Oilseed',
    seasons: ['Kharif', 'Rabi', 'Summer'],
    durationDays: { min: 100, max: 130 },
    soilPreference: { types: ['Sandy', 'Loam'], phRange: { min: 6.0, max: 7.5 } },
    climateTolerance: 'Warm tropical, needs well-distributed rainfall',
    seedTreatment: {
      fungicide: 'Trichoderma viride @ 4g/kg',
      bioInoculant: 'Rhizobium (Groundnut specific)',
      purpose: 'Prevent collar rot & enhance nitrogen fixation'
    },
    growthStages: [
      { id: 'germination', name: 'Emergence', startDay: 0, endDay: 10, focus: 'Soil crust breaking', risk: 'Seed rot' },
      { id: 'vegetative', name: 'Vegetative', startDay: 11, endDay: 30, focus: 'Weeding, Gypsum application', risk: 'Leaf minor' },
      { id: 'flowering', name: 'Flowering & Pegging', startDay: 31, endDay: 55, focus: 'Soil loose for pegs', risk: 'Water stress' },
      { id: 'pod-filling', name: 'Pod Filling', startDay: 56, endDay: 90, focus: 'Moisture maintenance', risk: 'White grub' },
      { id: 'maturity', name: 'Maturity', startDay: 91, endDay: 110, focus: 'Harvest when shell is dark inside', risk: 'Aflatoxin (if wet)' }
    ],
    varieties: [
      {
        id: 'kadiri-6',
        name: 'Kadiri-6',
        type: 'Improved',
        durationDays: 110,
        yieldPotential: 'High',
        diseaseResistance: ['Bud necrosis'],
        stressTolerance: { drought: 'High', excessRain: 'Medium' },
        source: 'ANGRAU',
        seedRate: { baseKgPerAcre: 60 }
      },
      {
        id: 'g-41',
        name: 'GG-20',
        type: 'Traditional',
        durationDays: 120,
        yieldPotential: 'Medium',
        diseaseResistance: ['Rust'],
        stressTolerance: { drought: 'Medium', excessRain: 'Low' },
        source: 'JAU',
        seedRate: { baseKgPerAcre: 50 }
      }
    ]
  },

  'castor': {
    id: 'castor',
    name: 'Castor',
    type: 'Oilseed',
    seasons: ['Kharif'],
    durationDays: { min: 150, max: 210 },
    soilPreference: { types: ['Sandy', 'Loam', 'Black'], phRange: { min: 5.5, max: 8.0 } },
    climateTolerance: 'Drought tolerant, sensitive to frost',
    seedTreatment: {
      fungicide: 'Carbendazim @ 2g/kg',
      purpose: 'Prevent wilt and root rot'
    },
    growthStages: [
      { id: 'germination', name: 'Germination', startDay: 0, endDay: 15, focus: 'Gap filling', risk: 'Seedling blight' },
      { id: 'vegetative', name: 'Vegetative', startDay: 16, endDay: 45, focus: 'Intercultivation', risk: 'Semilooper' },
      { id: 'flowering-primary', name: 'Primary Spike Flowering', startDay: 46, endDay: 75, focus: 'Nutrient spray', risk: 'Botrytis' },
      { id: 'capsule-dev', name: 'Capsule Development', startDay: 76, endDay: 120, focus: 'Irrigation', risk: 'Capsule borer' },
      { id: 'maturity', name: 'Maturity (Picking)', startDay: 121, endDay: 180, focus: 'Selective harvesting', risk: 'Shattering' }
    ],
    varieties: [
      {
        id: 'gch-7',
        name: 'GCH-7',
        type: 'Hybrid',
        durationDays: 180,
        yieldPotential: 'High',
        diseaseResistance: ['Wilt', 'Root rot'],
        stressTolerance: { drought: 'High', excessRain: 'Medium' },
        source: 'SDAU',
        seedRate: { baseKgPerAcre: 2.5, method: 'Dibbling' }
      }
    ]
  },

  'paddy': {
    id: 'paddy',
    name: 'Paddy (Rice)',
    type: 'Cereal',
    seasons: ['Kharif', 'Rabi'],
    durationDays: { min: 110, max: 150 },
    soilPreference: { types: ['Clay', 'Black', 'Loam'], phRange: { min: 5.0, max: 8.5 } },
    climateTolerance: 'High water requirement, warm humidity',
    seedTreatment: {
      fungicide: 'Carbendazim @ 2g/kg',
      bioInoculant: 'Azospirillum',
      purpose: 'Seed borne diseases & N-fixation'
    },
    growthStages: [
      { id: 'nursery', name: 'Nursery', startDay: 0, endDay: 25, focus: 'Healthy seedling raising', risk: 'Blast' },
      { id: 'tillering', name: 'Active Tillering', startDay: 26, endDay: 55, focus: 'Top dressing Urea', risk: 'Stem borer' },
      { id: 'panicle', name: 'Panicle Initiation', startDay: 56, endDay: 75, focus: 'Water management', risk: 'Leaf folder' },
      { id: 'flowering', name: 'Flowering', startDay: 76, endDay: 90, focus: 'Avoid stress', risk: 'Gundhi bug' },
      { id: 'maturity', name: 'Grain Filling & Maturity', startDay: 91, endDay: 120, focus: 'Drain water before harvest', risk: 'BPH' }
    ],
    varieties: [
      {
        id: 'mtu-1010',
        name: 'MTU-1010',
        type: 'Improved',
        durationDays: 115,
        yieldPotential: 'High',
        diseaseResistance: ['Blast'],
        stressTolerance: { drought: 'Low', excessRain: 'High' },
        source: 'ANGRAU',
        seedRate: { baseKgPerAcre: 25, method: 'Transplanting' }
      }
    ]
  },

  // PULSES
  'red-gram': {
    id: 'red-gram',
    name: 'Red Gram (Pigeon pea)',
    type: 'Pulse',
    seasons: ['Kharif'],
    durationDays: { min: 150, max: 180 },
    soilPreference: { types: ['Loam', 'Black'], phRange: { min: 6.5, max: 7.5 } },
    climateTolerance: 'Drought tolerant',
    seedTreatment: { bioInoculant: 'Rhizobium (Pigeonpea strain)', purpose: 'Nodulation' },
    growthStages: [...PULSE_STAGES, { id: 'maturity', name: 'Maturity', startDay: 150, endDay: 180, focus: 'Harvest', risk: 'Pod fly' }], // Override duration
    varieties: [
      {
        id: 'icpl-87119',
        name: 'Asha (ICPL-87119)',
        type: 'Improved',
        durationDays: 180,
        yieldPotential: 'High',
        diseaseResistance: ['Wilt', 'Sterility Mosaic'],
        stressTolerance: { drought: 'High', excessRain: 'Medium' },
        source: 'ICRISAT',
        seedRate: { baseKgPerAcre: 4 }
      }
    ]
  },

  'green-gram': {
    id: 'green-gram',
    name: 'Green Gram (Moong)',
    type: 'Pulse',
    seasons: ['Kharif', 'Summer'],
    durationDays: { min: 60, max: 70 },
    soilPreference: { types: ['Loam', 'Sandy'], phRange: { min: 6.0, max: 7.5 } },
    climateTolerance: 'Short duration, needs warm climate',
    seedTreatment: { bioInoculant: 'Rhizobium', purpose: 'Nodulation' },
    growthStages: [
       // Shorter stages for Moong
       { id: 'germination', name: 'Germination', startDay: 0, endDay: 5, focus: 'Moisture', risk: 'Rot' },
       { id: 'vegetative', name: 'Vegetative', startDay: 6, endDay: 25, focus: 'Weeding', risk: 'Jassids' },
       { id: 'flowering', name: 'Flowering', startDay: 26, endDay: 40, focus: 'No water stress', risk: 'Thrips' },
       { id: 'maturity', name: 'Pod Maturity', startDay: 41, endDay: 65, focus: 'Harvest', risk: 'Pod borer' }
    ],
    varieties: [
      {
        id: 'ipm-2-3',
        name: 'Shikha (IPM-2-3)',
        type: 'Improved',
        durationDays: 65,
        yieldPotential: 'High',
        diseaseResistance: ['MYMV'],
        stressTolerance: { drought: 'Medium', excessRain: 'Low' },
        source: 'IIPR',
        seedRate: { baseKgPerAcre: 8 }
      }
    ]
  },

  'black-gram': {
    id: 'black-gram',
    name: 'Black Gram (Urad)',
    type: 'Pulse',
    seasons: ['Kharif', 'Rabi'],
    durationDays: { min: 70, max: 80 },
    soilPreference: { types: ['Black', 'Loam'], phRange: { min: 6.0, max: 7.5 } },
    climateTolerance: 'Humid, warm',
    seedTreatment: { bioInoculant: 'Rhizobium', purpose: 'Nodulation' },
    growthStages: PULSE_STAGES, // Use default
    varieties: [
      {
        id: 'pu-31',
        name: 'PU-31',
        type: 'Improved',
        durationDays: 75,
        yieldPotential: 'High',
        diseaseResistance: ['MYMV'],
        stressTolerance: { drought: 'Medium', excessRain: 'Medium' },
        source: 'PAU',
        seedRate: { baseKgPerAcre: 8 }
      }
    ]
  },

  'bengal-gram': {
    id: 'bengal-gram',
    name: 'Bengal Gram (Chickpea)',
    type: 'Pulse',
    seasons: ['Rabi'],
    durationDays: { min: 90, max: 120 },
    soilPreference: { types: ['Black', 'Clay'], phRange: { min: 6.0, max: 8.0 } },
    climateTolerance: 'Cool climate required',
    seedTreatment: { bioInoculant: 'Rhizobium (Chickpea specific)', purpose: 'Nodulation' },
    growthStages: [
       { id: 'germination', name: 'Emergence', startDay: 0, endDay: 10, focus: 'Moisture', risk: 'Wilt' },
       { id: 'vegetative', name: 'Vegetative', startDay: 11, endDay: 45, focus: 'Nipping', risk: 'Cutworm' },
       { id: 'flowering', name: 'Flowering', startDay: 46, endDay: 75, focus: 'Irrigation', risk: 'Pod borer' },
       { id: 'maturity', name: 'Pod Maturity', startDay: 76, endDay: 110, focus: 'Harvest', risk: 'Wilt' }
    ],
    varieties: [
      {
        id: 'jg-11',
        name: 'JG-11',
        type: 'Improved',
        durationDays: 100,
        yieldPotential: 'High',
        diseaseResistance: ['Wilt'],
        stressTolerance: { drought: 'High', excessRain: 'Low' },
        source: 'JNKVV',
        seedRate: { baseKgPerAcre: 25 } // Desi variety
      }
    ]
  }
};

export const SEED_STANDARDS_MAP: Record<string, SeedQualityStandards> = {
  'groundnut': DEFAULT_SEED_STANDARDS,
  'castor': DEFAULT_SEED_STANDARDS,
  'paddy': DEFAULT_SEED_STANDARDS,
  'red-gram': PULSE_SEED_STANDARDS,
  'green-gram': PULSE_SEED_STANDARDS,
  'black-gram': PULSE_SEED_STANDARDS,
  'bengal-gram': PULSE_SEED_STANDARDS,
};
