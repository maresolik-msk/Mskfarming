/**
 * MILA Soil Analysis Engine
 * 
 * Comprehensive soil analysis that cross-references multiple DIY test observations 
 * against the Indian Soil Master Database to produce accurate, composite soil profiles
 * with confidence scoring and region-appropriate crop recommendations.
 */

import { SOIL_MASTER_DATA } from "./soil_data.ts";

// ─── Types ───

export interface SoilTestObservation {
  test_type: string;
  observation: string;
  confidence?: number; // 0-1, how sure the user is
  sample_spots?: number; // how many spots they sampled from
}

export interface SoilAnalysisRequest {
  observations: SoilTestObservation[];
  location?: string; // State/Region
  season?: string;
  current_crop?: string;
  field_area_acres?: number;
}

export interface SoilTypeMatch {
  soil_id: string;
  soil_name: string;
  match_score: number; // 0-100
  matched_traits: string[];
  regions: string[];
}

export interface CompositeAnalysis {
  // Core Identity
  primary_soil_type: SoilTypeMatch;
  alternative_matches: SoilTypeMatch[];
  confidence_level: 'high' | 'medium' | 'low';
  confidence_percent: number;
  
  // Derived Properties
  texture_class: string;
  texture_detail: string;
  estimated_sand_pct: number;
  estimated_silt_pct: number;
  estimated_clay_pct: number;
  
  drainage_class: string;
  water_holding: string;
  organic_matter_level: string;
  estimated_ph: string;
  fertility_rating: string;
  
  // Health Scores (0-100)
  overall_health_score: number;
  structure_score: number;
  nutrient_score: number;
  biology_score: number;
  water_score: number;
  
  // Micronutrient Estimates
  micronutrient_estimates: { nutrient: string; level: string; concern: boolean; recommendation: string }[];
  estimated_ec: string;
  salinity_risk: string;
  compaction_risk: string;
  
  // Actionable Intelligence
  nutrient_deficiencies: string[];
  immediate_actions: { action: string; priority: 'urgent' | 'important' | 'recommended'; reason: string }[];
  seasonal_advice: string[];
  recommended_crops: string[];
  crops_to_avoid: string[];
  irrigation_plan: string;
  organic_amendments: { name: string; quantity_per_acre: string; timing: string }[];
  
  // Cross-Validation
  cross_validation_notes: string[];
  test_agreement_score: number; // 0-100, how well tests agree with each other
  
  // Improvement Roadmap
  improvement_plan: { month: string; action: string }[];
  estimated_improvement_months: number;
  next_test_date: string;
  
  // Raw data
  individual_results: any[];
}

// ─── Interpretation Maps ───

const TEXTURE_MAP: Record<string, { 
  sand: number; silt: number; clay: number; 
  class: string; detail: string;
  water_hold: string; drainage: string;
}> = {
  'sandy': { sand: 85, silt: 10, clay: 5, class: 'Sandy', detail: 'Coarse-textured, gritty feel, cannot form ribbon', water_hold: 'Very Low', drainage: 'Excessive' },
  'sandy_loam': { sand: 65, silt: 25, clay: 10, class: 'Sandy Loam', detail: 'Slightly gritty, forms weak ball that crumbles', water_hold: 'Low', drainage: 'Good' },
  'loamy': { sand: 40, silt: 40, clay: 20, class: 'Loam', detail: 'Balanced feel, forms ball, short ribbon (1-2 cm)', water_hold: 'Medium', drainage: 'Good' },
  'silt_loam': { sand: 20, silt: 60, clay: 20, class: 'Silt Loam', detail: 'Smooth, silky feel, forms weak ribbon', water_hold: 'Medium-High', drainage: 'Moderate' },
  'clay_loam': { sand: 30, silt: 30, clay: 40, class: 'Clay Loam', detail: 'Firm ball, ribbon 2-4 cm, slightly sticky', water_hold: 'High', drainage: 'Moderate-Poor' },
  'clay': { sand: 15, silt: 25, clay: 60, class: 'Clay', detail: 'Very sticky, long ribbon (>5 cm), hard when dry', water_hold: 'Very High', drainage: 'Poor' },
  'silty_clay': { sand: 5, silt: 45, clay: 50, class: 'Silty Clay', detail: 'Very smooth and sticky, long ribbon', water_hold: 'Very High', drainage: 'Very Poor' },
};

const JAR_TEST_MAP: Record<string, { sand: number; silt: number; clay: number; class: string }> = {
  'mostly_sand': { sand: 70, silt: 20, clay: 10, class: 'Sandy' },
  'balanced': { sand: 40, silt: 35, clay: 25, class: 'Loam' },
  'mostly_silt': { sand: 15, silt: 60, clay: 25, class: 'Silt Loam' },
  'mostly_clay': { sand: 15, silt: 25, clay: 60, class: 'Clay' },
  'sand_silt_mix': { sand: 55, silt: 35, clay: 10, class: 'Sandy Loam' },
  'silt_clay_mix': { sand: 10, silt: 45, clay: 45, class: 'Silty Clay' },
};

const DRAINAGE_MAP: Record<string, { class: string; score: number }> = {
  'very_fast': { class: 'Excessive', score: 30 },
  'fast_drainage': { class: 'Well-Drained (Fast)', score: 55 },
  'medium_drainage': { class: 'Moderate (Ideal)', score: 90 },
  'slow_drainage': { class: 'Poor', score: 40 },
  'very_slow': { class: 'Very Poor / Waterlogged', score: 15 },
};

const COLOR_MAP: Record<string, { organic: string; fertility: string; score: number; possible_soils: string[] }> = {
  'dark_high_organic': { organic: 'High', fertility: 'High', score: 90, possible_soils: ['alluvial_soil', 'black_soil', 'mountain_forest_soil', 'peaty_marshy_soil'] },
  'dark_brown': { organic: 'Medium-High', fertility: 'Medium-High', score: 75, possible_soils: ['alluvial_soil', 'mountain_forest_soil'] },
  'red_medium_organic': { organic: 'Medium', fertility: 'Medium', score: 60, possible_soils: ['red_soil', 'laterite_soil'] },
  'yellow_orange': { organic: 'Low-Medium', fertility: 'Low-Medium', score: 45, possible_soils: ['laterite_soil', 'arid_soil'] },
  'light_low_organic': { organic: 'Low', fertility: 'Low', score: 25, possible_soils: ['arid_soil', 'coastal_sandy_soil', 'saline_soil'] },
  'white_grey': { organic: 'Very Low', fertility: 'Very Low', score: 15, possible_soils: ['saline_soil', 'alkaline_soil', 'coastal_sandy_soil'] },
};

const PH_MAP: Record<string, { range: string; level: string; score: number; possible_soils: string[] }> = {
  'very_acidic': { range: '4.0-5.0', level: 'Strongly Acidic', score: 30, possible_soils: ['laterite_soil', 'peaty_marshy_soil'] },
  'acidic': { range: '5.0-6.0', level: 'Moderately Acidic', score: 55, possible_soils: ['laterite_soil', 'mountain_forest_soil', 'red_soil'] },
  'slightly_acidic': { range: '6.0-6.5', level: 'Slightly Acidic', score: 80, possible_soils: ['red_soil', 'mountain_forest_soil', 'alluvial_soil'] },
  'neutral': { range: '6.5-7.5', level: 'Neutral (Ideal)', score: 100, possible_soils: ['alluvial_soil', 'black_soil'] },
  'slightly_alkaline': { range: '7.5-8.0', level: 'Slightly Alkaline', score: 75, possible_soils: ['alluvial_soil', 'black_soil', 'arid_soil'] },
  'alkaline': { range: '8.0-8.5', level: 'Moderately Alkaline', score: 50, possible_soils: ['black_soil', 'arid_soil', 'saline_soil'] },
  'very_alkaline': { range: '8.5+', level: 'Strongly Alkaline', score: 25, possible_soils: ['alkaline_soil', 'saline_soil'] },
};

const MOISTURE_MAP: Record<string, { level: string; score: number }> = {
  'bone_dry': { level: 'Critically Dry', score: 10 },
  'dry': { level: 'Dry - Needs Water', score: 30 },
  'slightly_moist': { level: 'Slightly Moist', score: 60 },
  'adequate': { level: 'Optimal Moisture', score: 95 },
  'moist': { level: 'Well Moistened', score: 80 },
  'too_wet': { level: 'Excess Moisture', score: 40 },
  'waterlogged': { level: 'Waterlogged', score: 10 },
};

const SMELL_MAP: Record<string, { biology: string; score: number }> = {
  'earthy_sweet': { biology: 'Excellent microbial activity', score: 95 },
  'earthy_mild': { biology: 'Good microbial activity', score: 75 },
  'no_smell': { biology: 'Low microbial activity', score: 40 },
  'sour_rotten': { biology: 'Anaerobic conditions (waterlogged)', score: 20 },
  'chemical': { biology: 'Possible contamination', score: 10 },
};

const WORM_MAP: Record<string, { health: string; score: number }> = {
  'many_10plus': { health: 'Excellent soil biology', score: 95 },
  'several_5_10': { health: 'Good soil biology', score: 75 },
  'few_1_4': { health: 'Moderate - needs improvement', score: 50 },
  'none': { health: 'Poor soil biology', score: 20 },
};

// ─── Compaction Test Map ───
const COMPACTION_MAP: Record<string, { level: string; score: number; risk: string }> = {
  'wire_easy': { level: 'No Compaction', score: 95, risk: 'None' },
  'wire_moderate': { level: 'Light Compaction', score: 70, risk: 'Low' },
  'wire_hard': { level: 'Moderate Compaction', score: 40, risk: 'Medium' },
  'wire_impossible': { level: 'Severe Compaction (Hardpan)', score: 15, risk: 'High' },
};

// ─── Cross-Validation Compatibility Matrix ───
const TEXTURE_JAR_COMPATIBILITY: Record<string, string[]> = {
  'sandy': ['mostly_sand'],
  'sandy_loam': ['mostly_sand', 'sand_silt_mix'],
  'loamy': ['sand_silt_mix', 'balanced', 'mostly_silt'],
  'silt_loam': ['balanced', 'mostly_silt'],
  'clay_loam': ['balanced', 'silt_clay_mix'],
  'clay': ['silt_clay_mix', 'mostly_clay'],
  'silty_clay': ['silt_clay_mix', 'mostly_clay'],
};

const TEXTURE_DRAINAGE_COMPATIBILITY: Record<string, string[]> = {
  'sandy': ['very_fast', 'fast_drainage'],
  'sandy_loam': ['fast_drainage', 'medium_drainage'],
  'loamy': ['medium_drainage', 'fast_drainage'],
  'silt_loam': ['medium_drainage', 'slow_drainage'],
  'clay_loam': ['medium_drainage', 'slow_drainage'],
  'clay': ['slow_drainage', 'very_slow'],
  'silty_clay': ['slow_drainage', 'very_slow'],
};

const COLOR_ORGANIC_COMPATIBILITY: Record<string, string[]> = {
  'dark_high_organic': ['earthy_sweet', 'earthy_mild'],
  'dark_brown': ['earthy_sweet', 'earthy_mild'],
  'red_medium_organic': ['earthy_mild', 'no_smell'],
  'yellow_orange': ['earthy_mild', 'no_smell'],
  'light_low_organic': ['no_smell', 'chemical'],
  'white_grey': ['no_smell', 'chemical'],
};

// ─── Micronutrient Estimation Based on Soil Properties ───
function estimateMicronutrients(
  soilData: any,
  phData: any,
  colorData: any,
  textureClass: string,
  finalClay: number,
  finalSand: number
): { nutrient: string; level: string; concern: boolean; recommendation: string }[] {
  const micros: { nutrient: string; level: string; concern: boolean; recommendation: string }[] = [];
  
  // Zinc estimation
  let zincLevel = soilData?.nutrient_profile?.zinc || 'Unknown';
  if (phData) {
    // Zinc availability drops sharply above pH 7.5
    if (['alkaline', 'very_alkaline', 'slightly_alkaline'].includes(phData.raw)) {
      zincLevel = 'Low';
    }
  }
  if (finalSand > 60) zincLevel = 'Low'; // Sandy soils leach zinc
  micros.push({
    nutrient: 'Zinc (Zn)',
    level: zincLevel,
    concern: ['Low', 'Very Low'].includes(zincLevel),
    recommendation: ['Low', 'Very Low'].includes(zincLevel)
      ? 'Apply Zinc Sulphate (ZnSO4) @ 25 kg/ha as basal dose'
      : 'No immediate zinc supplementation needed'
  });
  
  // Iron estimation
  let ironLevel = soilData?.nutrient_profile?.iron || 'Unknown';
  if (phData && ['alkaline', 'very_alkaline'].includes(phData.raw)) {
    ironLevel = 'Low'; // Iron becomes unavailable in alkaline soils
  }
  if (colorData && ['red_medium_organic', 'yellow_orange'].includes(colorData.raw)) {
    ironLevel = 'Medium-High'; // Red/yellow soils rich in iron oxides
  }
  micros.push({
    nutrient: 'Iron (Fe)',
    level: ironLevel,
    concern: ['Low', 'Very Low'].includes(ironLevel),
    recommendation: ['Low', 'Very Low'].includes(ironLevel)
      ? 'Apply Ferrous Sulphate (FeSO4) @ 50 kg/ha or foliar spray 0.5% FeSO4'
      : 'Adequate iron levels'
  });
  
  // Sulphur estimation
  let sulphurLevel = soilData?.nutrient_profile?.sulphur || 'Unknown';
  if (colorData && colorData.organic === 'Low') sulphurLevel = 'Low';
  micros.push({
    nutrient: 'Sulphur (S)',
    level: sulphurLevel,
    concern: ['Low', 'Very Low'].includes(sulphurLevel),
    recommendation: ['Low', 'Very Low'].includes(sulphurLevel)
      ? 'Apply Gypsum @ 200 kg/ha or use SSP instead of DAP'
      : 'Sufficient sulphur'
  });
  
  // Boron estimation
  let boronLevel = soilData?.nutrient_profile?.boron || 'Unknown';
  if (finalSand > 60) boronLevel = 'Low'; // Boron leaches in sandy soils
  if (phData && ['very_acidic', 'acidic'].includes(phData.raw)) boronLevel = 'Low';
  micros.push({
    nutrient: 'Boron (B)',
    level: boronLevel,
    concern: ['Low', 'Very Low'].includes(boronLevel),
    recommendation: ['Low', 'Very Low'].includes(boronLevel)
      ? 'Apply Borax @ 10 kg/ha or foliar spray 0.2% Borax'
      : 'Adequate boron'
  });
  
  // Manganese estimation
  let manganeseLevel = soilData?.nutrient_profile?.manganese || 'Unknown';
  if (phData && ['alkaline', 'very_alkaline'].includes(phData.raw)) manganeseLevel = 'Low';
  micros.push({
    nutrient: 'Manganese (Mn)',
    level: manganeseLevel,
    concern: ['Low', 'Very Low'].includes(manganeseLevel),
    recommendation: ['Low', 'Very Low'].includes(manganeseLevel)
      ? 'Apply MnSO4 @ 25 kg/ha or foliar spray 0.5% MnSO4'
      : 'Sufficient manganese'
  });
  
  return micros;
}

// ─── Salinity & EC Estimation ───
function estimateSalinity(
  soilData: any,
  phData: any,
  colorData: any,
  drainageData: any,
  location?: string
): { ec: string; risk: string } {
  let ecRange = soilData?.ec_range || 'Unknown';
  let risk = 'Low';
  
  if (phData && ['very_alkaline', 'alkaline'].includes(phData.raw)) {
    risk = 'Medium-High';
  }
  if (colorData && colorData.raw === 'white_grey') {
    risk = 'High'; // White crust = salt
  }
  if (drainageData && drainageData.raw === 'very_slow') {
    // Poor drainage + alkaline = salt accumulation
    if (phData && ['alkaline', 'very_alkaline', 'slightly_alkaline'].includes(phData.raw)) {
      risk = 'High';
    }
  }
  if (location) {
    const coastalTerms = ['coast', 'coastal', 'beach', 'sea', 'sundarbans'];
    const salineTerms = ['kutch', 'rann', 'thar', 'desert'];
    const loc = location.toLowerCase();
    if (coastalTerms.some(t => loc.includes(t)) || salineTerms.some(t => loc.includes(t))) {
      risk = 'High';
    }
  }
  
  return { ec: ecRange, risk };
}

// ─── Core Analysis Function ───

export function analyzeSoil(request: SoilAnalysisRequest): CompositeAnalysis {
  const { observations, location, season } = request;
  
  // Individual test results
  const individualResults: any[] = [];
  
  // Accumulators for composite scoring
  let textureData: any = null;
  let jarTestData: any = null;
  let drainageData: any = null;
  let colorData: any = null;
  let phData: any = null;
  let moistureData: any = null;
  let smellData: any = null;
  let wormData: any = null;
  let compactionData: any = null;
  
  // Process each observation
  for (const obs of observations) {
    const spots = obs.sample_spots || 1;
    const userConf = obs.confidence || 0.7;
    // Multi-spot sampling boosts confidence
    const spotBonus = Math.min(spots / 5, 1) * 0.15; // up to 15% bonus for 5+ spots
    const adjustedConf = Math.min(userConf + spotBonus, 1.0);
    
    switch (obs.test_type) {
      case 'texture': {
        textureData = { ...TEXTURE_MAP[obs.observation], confidence: adjustedConf, raw: obs.observation };
        individualResults.push({ test: 'Texture (Ball & Ribbon)', result: textureData?.class || obs.observation, confidence: adjustedConf });
        break;
      }
      case 'jar_test': {
        jarTestData = { ...JAR_TEST_MAP[obs.observation], confidence: adjustedConf, raw: obs.observation };
        individualResults.push({ test: 'Jar Settling Test', result: jarTestData?.class || obs.observation, confidence: adjustedConf });
        break;
      }
      case 'water': {
        drainageData = { ...DRAINAGE_MAP[obs.observation], confidence: adjustedConf, raw: obs.observation };
        individualResults.push({ test: 'Water Drainage', result: drainageData?.class || obs.observation, confidence: adjustedConf });
        break;
      }
      case 'color': {
        colorData = { ...COLOR_MAP[obs.observation], confidence: adjustedConf, raw: obs.observation };
        individualResults.push({ test: 'Soil Color', result: colorData?.organic || obs.observation, confidence: adjustedConf });
        break;
      }
      case 'ph': {
        phData = { ...PH_MAP[obs.observation], confidence: adjustedConf, raw: obs.observation };
        individualResults.push({ test: 'pH (Vinegar/Baking Soda)', result: phData?.level || obs.observation, confidence: adjustedConf });
        break;
      }
      case 'moisture': {
        moistureData = { ...MOISTURE_MAP[obs.observation], confidence: adjustedConf, raw: obs.observation };
        individualResults.push({ test: 'Moisture Level', result: moistureData?.level || obs.observation, confidence: adjustedConf });
        break;
      }
      case 'smell': {
        smellData = { ...SMELL_MAP[obs.observation], confidence: adjustedConf, raw: obs.observation };
        individualResults.push({ test: 'Smell Test', result: smellData?.biology || obs.observation, confidence: adjustedConf });
        break;
      }
      case 'worm_count': {
        wormData = { ...WORM_MAP[obs.observation], confidence: adjustedConf, raw: obs.observation };
        individualResults.push({ test: 'Earthworm Count', result: wormData?.health || obs.observation, confidence: adjustedConf });
        break;
      }
      case 'compaction': {
        compactionData = { ...COMPACTION_MAP[obs.observation], confidence: adjustedConf, raw: obs.observation };
        individualResults.push({ test: 'Compaction Test', result: compactionData?.level || obs.observation, confidence: adjustedConf });
        break;
      }
    }
  }
  
  // ─── Resolve Texture (cross-validate ribbon test vs jar test) ───
  let finalSand = 40, finalSilt = 35, finalClay = 25;
  let textureClass = 'Loam';
  let textureDetail = 'Balanced texture (estimated from limited tests)';
  
  if (textureData && jarTestData) {
    // Average both tests for higher accuracy
    finalSand = Math.round((textureData.sand + jarTestData.sand) / 2);
    finalSilt = Math.round((textureData.silt + jarTestData.silt) / 2);
    finalClay = Math.round((textureData.clay + jarTestData.clay) / 2);
    textureClass = jarTestData.class; // jar test is more accurate
    textureDetail = `Cross-validated: Ribbon test (${textureData.class}) + Jar test (${jarTestData.class})`;
  } else if (jarTestData) {
    finalSand = jarTestData.sand;
    finalSilt = jarTestData.silt;
    finalClay = jarTestData.clay;
    textureClass = jarTestData.class;
    textureDetail = `Jar Settling Test result: ${jarTestData.class}`;
  } else if (textureData) {
    finalSand = textureData.sand;
    finalSilt = textureData.silt;
    finalClay = textureData.clay;
    textureClass = textureData.class;
    textureDetail = `Ball & Ribbon Test result: ${textureData.class}`;
  }
  
  // ─── Cross-Validation Analysis ───
  const crossValidationNotes: string[] = [];
  let agreementScore = 100;
  
  // Texture vs Jar Test agreement
  if (textureData && jarTestData) {
    const compatibleJarResults = TEXTURE_JAR_COMPATIBILITY[textureData.raw] || [];
    if (compatibleJarResults.includes(jarTestData.raw)) {
      crossValidationNotes.push('Texture and jar test AGREE - high confidence in texture classification');
    } else {
      crossValidationNotes.push('Texture test and jar test DISAGREE - jar test is more precise, using weighted average');
      agreementScore -= 15;
      // Give more weight to jar test when they disagree
      finalSand = Math.round(textureData.sand * 0.35 + jarTestData.sand * 0.65);
      finalSilt = Math.round(textureData.silt * 0.35 + jarTestData.silt * 0.65);
      finalClay = Math.round(textureData.clay * 0.35 + jarTestData.clay * 0.65);
      textureClass = jarTestData.class;
      textureDetail = `Weighted: Jar test (65%) + Ribbon (35%) — tests disagree, jar is more accurate`;
    }
  }
  
  // Texture vs Drainage agreement
  if (textureData && drainageData) {
    const compatibleDrainage = TEXTURE_DRAINAGE_COMPATIBILITY[textureData.raw] || [];
    if (compatibleDrainage.includes(drainageData.raw)) {
      crossValidationNotes.push('Texture and drainage AGREE - consistent physical properties');
    } else {
      crossValidationNotes.push('Texture and drainage DISAGREE - possible hardpan or unusual soil structure');
      agreementScore -= 10;
      if (textureData.raw === 'sandy' && ['slow_drainage', 'very_slow'].includes(drainageData.raw)) {
        crossValidationNotes.push('IMPORTANT: Sandy soil with poor drainage suggests a compacted layer (hardpan) beneath topsoil');
      }
      if (['clay', 'silty_clay'].includes(textureData.raw) && ['fast_drainage', 'very_fast'].includes(drainageData.raw)) {
        crossValidationNotes.push('IMPORTANT: Clay with fast drainage suggests cracks/fissures or very well-structured soil');
      }
    }
  }
  
  // Color vs Biology agreement
  if (colorData && smellData) {
    const compatibleSmells = COLOR_ORGANIC_COMPATIBILITY[colorData.raw] || [];
    if (compatibleSmells.includes(smellData.raw)) {
      crossValidationNotes.push('Color and smell AGREE - organic matter assessment is reliable');
    } else {
      crossValidationNotes.push('Color and smell DISAGREE - could indicate recent amendments or contamination');
      agreementScore -= 8;
    }
  }
  
  // Color vs Worm Count agreement
  if (colorData && wormData) {
    const darkSoil = ['dark_high_organic', 'dark_brown'].includes(colorData.raw);
    const manyWorms = ['many_10plus', 'several_5_10'].includes(wormData.raw);
    if (darkSoil && !manyWorms) {
      crossValidationNotes.push('Dark soil with few worms: possible recent chemical use or waterlogging killing biology');
      agreementScore -= 5;
    }
    if (!darkSoil && manyWorms) {
      crossValidationNotes.push('Light soil with many worms: soil biology is recovering, keep adding organic matter');
    }
  }
  
  // pH vs Drainage agreement for salinity
  if (phData && drainageData) {
    if (['alkaline', 'very_alkaline'].includes(phData.raw) && drainageData.raw === 'very_slow') {
      crossValidationNotes.push('ALERT: High pH + poor drainage = high salinity risk. Check for white salt crust.');
    }
  }
  
  // ─── Match Against Indian Soil Types ───
  const soilMatches: SoilTypeMatch[] = [];
  
  for (const soil of SOIL_MASTER_DATA) {
    let score = 0;
    const matched: string[] = [];
    let factors = 0;
    
    // Texture matching
    if (textureData || jarTestData) {
      factors++;
      const soilTextures = (soil.texture || []).map((t: string) => t.toLowerCase());
      if (soilTextures.some((t: string) => textureClass.toLowerCase().includes(t) || t.includes(textureClass.toLowerCase()))) {
        score += 25;
        matched.push(`Texture: ${textureClass}`);
      } else if (finalClay > 45 && soilTextures.includes('clayey')) {
        score += 20;
        matched.push('High clay content matches');
      } else if (finalSand > 60 && soilTextures.includes('sandy')) {
        score += 20;
        matched.push('Sandy texture matches');
      }
    }
    
    // Color matching
    if (colorData) {
      factors++;
      const soilColors = (soil.color || []).map((c: string) => c.toLowerCase());
      const obsColor = (colorData.raw || '').toLowerCase();
      
      if (colorData.possible_soils?.includes(soil.soil_id)) {
        score += 20;
        matched.push(`Color suggests ${soil.soil_name}`);
      }
      if (obsColor.includes('dark') && soilColors.some((c: string) => c.includes('dark') || c.includes('black'))) {
        score += 5;
      }
      if (obsColor.includes('red') && soilColors.some((c: string) => c.includes('red'))) {
        score += 10;
        matched.push('Red coloring matches');
      }
    }
    
    // pH matching
    if (phData) {
      factors++;
      if (phData.possible_soils?.includes(soil.soil_id)) {
        score += 20;
        matched.push(`pH range compatible`);
      }
    }
    
    // Drainage matching
    if (drainageData) {
      factors++;
      const soilDrainage = (soil.drainage || '').toLowerCase();
      const obsDrainage = (drainageData.class || '').toLowerCase();
      if (soilDrainage.includes('poor') && obsDrainage.includes('poor')) {
        score += 15;
        matched.push('Drainage pattern matches');
      } else if (soilDrainage.includes('good') && (obsDrainage.includes('moderate') || obsDrainage.includes('well'))) {
        score += 15;
        matched.push('Drainage pattern matches');
      } else if (soilDrainage.includes('excessive') && obsDrainage.includes('excessive')) {
        score += 15;
        matched.push('Excessive drainage matches');
      }
    }
    
    // Location matching (big bonus)
    if (location) {
      factors++;
      const regions = (soil.regions_in_india || []).map((r: string) => r.toLowerCase());
      if (regions.some((r: string) => location.toLowerCase().includes(r) || r.includes(location.toLowerCase()))) {
        score += 20;
        matched.push(`Region: ${location} matches`);
      }
    }
    
    // Normalize score based on number of factors available
    const maxPossible = factors * 25; // rough max per factor
    const normalizedScore = maxPossible > 0 ? Math.min(Math.round((score / maxPossible) * 100), 100) : 0;
    
    soilMatches.push({
      soil_id: soil.soil_id,
      soil_name: soil.soil_name,
      match_score: normalizedScore,
      matched_traits: matched,
      regions: soil.regions_in_india || [],
    });
  }
  
  // Sort by match score
  soilMatches.sort((a, b) => b.match_score - a.match_score);
  const primaryMatch = soilMatches[0];
  const alternatives = soilMatches.slice(1, 3).filter(m => m.match_score > 20);
  
  // ─── Health Scores (Enhanced with compaction) ───
  const structureScore = (() => {
    let base = textureData
      ? (textureClass.toLowerCase().includes('loam') ? 85 : textureClass.toLowerCase().includes('clay') ? 55 : 45)
      : 50;
    // Factor in compaction
    if (compactionData) {
      base = Math.round(base * 0.6 + compactionData.score * 0.4);
    }
    return base;
  })();
  
  const nutrientScore = colorData
    ? colorData.score
    : 50;
  
  const biologyScore = smellData && wormData
    ? Math.round((smellData.score + wormData.score) / 2)
    : smellData ? smellData.score
    : wormData ? wormData.score
    : 50;
  
  const waterScore = drainageData && moistureData
    ? Math.round((drainageData.score + moistureData.score) / 2)
    : drainageData ? drainageData.score
    : moistureData ? moistureData.score
    : 50;
  
  const overallScore = Math.round(
    structureScore * 0.25 +
    nutrientScore * 0.30 +
    biologyScore * 0.25 +
    waterScore * 0.20
  );
  
  // ─── Confidence (Enhanced with cross-validation) ───
  const testsCompleted = observations.length;
  const totalPossibleTests = 9; // Added compaction test
  const coverageRatio = testsCompleted / totalPossibleTests;
  const avgUserConfidence = observations.reduce((sum, o) => sum + (o.confidence || 0.7), 0) / Math.max(testsCompleted, 1);
  const multiSpotBonus = observations.some(o => (o.sample_spots || 1) >= 3) ? 0.1 : 0;
  
  const confidencePercent = Math.min(Math.round(
    (coverageRatio * 0.40 + avgUserConfidence * 0.25 + multiSpotBonus + (primaryMatch.match_score / 100) * 0.15 + (agreementScore / 100) * 0.20) * 100
  ), 95);
  
  const confidenceLevel: 'high' | 'medium' | 'low' = 
    confidencePercent >= 70 ? 'high' : confidencePercent >= 45 ? 'medium' : 'low';
  
  // ─── Get Primary Soil Data for Recommendations ───
  const primarySoilData = SOIL_MASTER_DATA.find((s: any) => s.soil_id === primaryMatch.soil_id);
  
  // ─── Micronutrient Estimates ───
  const micronutrients = estimateMicronutrients(primarySoilData, phData, colorData, textureClass, finalClay, finalSand);
  
  // ─── Salinity Estimation ───
  const { ec: estimatedEc, risk: salinityRisk } = estimateSalinity(primarySoilData, phData, colorData, drainageData, location);
  
  // ─── Compaction Risk ───
  const compactionRisk = compactionData
    ? compactionData.risk
    : (finalClay > 50 ? 'Medium-High' : finalClay > 30 ? 'Medium' : 'Low');

  // ─── Nutrient Deficiencies (Enhanced with micronutrients) ───
  const deficiencies: string[] = [];
  if (primarySoilData?.nutrient_profile) {
    const np = primarySoilData.nutrient_profile;
    if (np.nitrogen === 'Low' || np.nitrogen === 'Very Low') deficiencies.push('Nitrogen (N) - Apply urea or organic nitrogen sources');
    if (np.phosphorus === 'Low' || np.phosphorus === 'Very Low') deficiencies.push('Phosphorus (P) - Apply DAP or bone meal');
    if (np.potassium === 'Low') deficiencies.push('Potassium (K) - Apply MOP or wood ash');
  }
  if (colorData?.organic === 'Low' || colorData?.organic === 'Very Low') {
    deficiencies.push('Organic Carbon - Add compost, FYM, or green manure');
  }
  // Add micronutrient deficiencies
  for (const micro of micronutrients) {
    if (micro.concern) {
      deficiencies.push(`${micro.nutrient} - ${micro.recommendation}`);
    }
  }
  
  // ─── Immediate Actions ───
  const actions: { action: string; priority: 'urgent' | 'important' | 'recommended'; reason: string }[] = [];
  
  if (moistureData?.raw === 'bone_dry' || moistureData?.raw === 'dry') {
    actions.push({ action: 'Irrigate field immediately', priority: 'urgent', reason: 'Soil is critically dry - crops under stress' });
  }
  if (moistureData?.raw === 'waterlogged' || moistureData?.raw === 'too_wet') {
    actions.push({ action: 'Stop irrigation, create drainage channels', priority: 'urgent', reason: 'Excess water causing root damage' });
  }
  if (drainageData?.raw === 'very_slow') {
    actions.push({ action: 'Build raised beds or drainage furrows', priority: 'important', reason: 'Poor drainage will damage most crops' });
  }
  if (colorData?.organic === 'Low' || colorData?.organic === 'Very Low') {
    actions.push({ action: 'Apply 3-4 trolley compost/FYM per acre', priority: 'important', reason: 'Low organic matter reduces soil health over time' });
  }
  if (wormData?.raw === 'none') {
    actions.push({ action: 'Add well-decomposed compost to attract earthworms', priority: 'recommended', reason: 'No earthworms indicates poor soil biology' });
  }
  if (smellData?.raw === 'sour_rotten') {
    actions.push({ action: 'Improve drainage and add dry organic matter', priority: 'important', reason: 'Anaerobic conditions killing beneficial organisms' });
  }
  if (phData?.raw === 'very_acidic') {
    actions.push({ action: 'Apply agricultural lime (2-4 kg per acre)', priority: 'important', reason: 'Strongly acidic soil limits nutrient availability' });
  }
  if (phData?.raw === 'very_alkaline') {
    actions.push({ action: 'Apply gypsum and organic matter', priority: 'important', reason: 'Highly alkaline soil blocks iron and zinc uptake' });
  }
  
  // Add compaction-specific actions
  if (compactionData?.raw === 'wire_impossible') {
    actions.push({ action: 'Deep sub-soiling or chisel ploughing to break hardpan', priority: 'urgent', reason: 'Severe compaction blocking root growth and water movement' });
  } else if (compactionData?.raw === 'wire_hard') {
    actions.push({ action: 'Use cover crops with deep taproots (e.g., radish, sunflower)', priority: 'important', reason: 'Moderate compaction — bio-drilling with deep roots is effective' });
  }
  
  // Salinity-specific actions
  if (salinityRisk === 'High') {
    actions.push({ action: 'Apply gypsum @ 2-4 tonnes/acre and leach with fresh water', priority: 'urgent', reason: 'High salinity restricts crop water uptake and causes toxicity' });
  }
  
  // Add management practices from matched soil
  if (primarySoilData?.management_practices) {
    for (const practice of primarySoilData.management_practices) {
      if (!actions.some(a => a.action.toLowerCase().includes(practice.toLowerCase()))) {
        actions.push({ action: practice, priority: 'recommended', reason: `Standard practice for ${primarySoilData.soil_name}` });
      }
    }
  }
  
  // ─── Organic Amendments ───
  const amendments: { name: string; quantity_per_acre: string; timing: string }[] = [];
  
  if (nutrientScore < 60) {
    amendments.push({ name: 'Farm Yard Manure (FYM)', quantity_per_acre: '3-4 tonnes', timing: '2-3 weeks before sowing' });
    amendments.push({ name: 'Vermicompost', quantity_per_acre: '1-2 tonnes', timing: 'At sowing time' });
  }
  if (biologyScore < 50) {
    amendments.push({ name: 'Jeevamrit (Bio-culture)', quantity_per_acre: '200 litres', timing: 'Every 15 days during crop' });
  }
  if (finalClay > 50) {
    amendments.push({ name: 'Coarse Sand + Compost Mix', quantity_per_acre: '1-2 tonnes sand + 2 tonnes compost', timing: 'Before monsoon' });
  }
  if (finalSand > 60) {
    amendments.push({ name: 'Bentonite Clay + Compost', quantity_per_acre: '0.5 tonnes bentonite + 3 tonnes compost', timing: 'Before sowing' });
  }
  
  // ─── Improvement Plan ───
  const improvementPlan: { month: string; action: string }[] = [];
  const now = new Date();
  
  improvementPlan.push({ month: getMonthName(now, 0), action: 'Apply compost/FYM based on deficiency analysis' });
  improvementPlan.push({ month: getMonthName(now, 1), action: 'Begin green manure cover crop if field is fallow' });
  improvementPlan.push({ month: getMonthName(now, 2), action: 'Mulch with crop residue to conserve moisture' });
  improvementPlan.push({ month: getMonthName(now, 3), action: 'Re-test moisture and check earthworm population' });
  improvementPlan.push({ month: getMonthName(now, 6), action: 'Complete soil re-test to measure improvement' });
  
  // ─── Seasonal Advice ───
  const seasonalAdvice: string[] = [];
  const currentMonth = now.getMonth();
  if (currentMonth >= 5 && currentMonth <= 8) { // June-Sept (Kharif)
    seasonalAdvice.push('Monsoon season: Focus on drainage management');
    seasonalAdvice.push('Good time to incorporate green manure');
    if (finalClay > 40) seasonalAdvice.push('Clay soil risk: Avoid working wet soil - wait for slight drying');
  } else if (currentMonth >= 9 && currentMonth <= 1) { // Oct-Feb (Rabi)
    seasonalAdvice.push('Rabi season: Apply balanced NPK before sowing');
    if (finalSand > 50) seasonalAdvice.push('Sandy soil: Increase irrigation frequency in dry winter');
  } else { // March-May (Summer)
    seasonalAdvice.push('Summer: Apply mulch to reduce moisture loss');
    seasonalAdvice.push('Best time for deep summer ploughing to break hardpan');
  }
  
  // ─── Irrigation Plan ───
  let irrigationPlan = 'Follow standard irrigation schedule';
  if (finalSand > 60) {
    irrigationPlan = 'Light, frequent irrigation every 2-3 days. Drip irrigation highly recommended. Avoid flood irrigation.';
  } else if (finalClay > 50) {
    irrigationPlan = 'Deep, infrequent irrigation every 7-10 days. Avoid waterlogging. Furrow/drip irrigation preferred.';
  } else {
    irrigationPlan = 'Moderate irrigation every 5-7 days. Adjust based on crop stage and weather.';
  }
  
  // ─── Next Test ───
  const nextTest = new Date(now);
  nextTest.setMonth(nextTest.getMonth() + 6);
  
  return {
    primary_soil_type: primaryMatch,
    alternative_matches: alternatives,
    confidence_level: confidenceLevel,
    confidence_percent: confidencePercent,
    
    texture_class: textureClass,
    texture_detail: textureDetail,
    estimated_sand_pct: finalSand,
    estimated_silt_pct: finalSilt,
    estimated_clay_pct: finalClay,
    
    drainage_class: drainageData?.class || 'Unknown',
    water_holding: textureData?.water_hold || (finalClay > 40 ? 'High' : finalSand > 50 ? 'Low' : 'Medium'),
    organic_matter_level: colorData?.organic || 'Not tested',
    estimated_ph: phData?.range || 'Not tested',
    fertility_rating: colorData?.fertility || primarySoilData?.fertility || 'Medium',
    
    overall_health_score: overallScore,
    structure_score: structureScore,
    nutrient_score: nutrientScore,
    biology_score: biologyScore,
    water_score: waterScore,
    
    micronutrient_estimates: micronutrients,
    estimated_ec: estimatedEc,
    salinity_risk: salinityRisk,
    compaction_risk: compactionRisk,
    
    nutrient_deficiencies: deficiencies,
    immediate_actions: actions,
    seasonal_advice: seasonalAdvice,
    recommended_crops: primarySoilData?.common_crops || [],
    crops_to_avoid: getCropsToAvoid(textureClass, phData?.level, salinityRisk),
    irrigation_plan: irrigationPlan,
    organic_amendments: amendments,
    
    cross_validation_notes: crossValidationNotes,
    test_agreement_score: Math.max(agreementScore, 0),
    
    improvement_plan: improvementPlan,
    estimated_improvement_months: overallScore >= 70 ? 3 : overallScore >= 50 ? 6 : 12,
    next_test_date: nextTest.toISOString().split('T')[0],
    
    individual_results: individualResults,
  };
}

function getMonthName(from: Date, offsetMonths: number): string {
  const d = new Date(from);
  d.setMonth(d.getMonth() + offsetMonths);
  return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

function getCropsToAvoid(texture: string, ph?: string, salinityRisk?: string): string[] {
  const avoid: string[] = [];
  if (texture.toLowerCase().includes('sandy')) {
    avoid.push('Rice (Paddy)', 'Sugarcane');
  }
  if (texture.toLowerCase().includes('clay')) {
    avoid.push('Groundnut', 'Carrot', 'Root Vegetables');
  }
  if (ph?.toLowerCase().includes('acidic')) {
    avoid.push('Wheat', 'Barley');
  }
  if (ph?.toLowerCase().includes('alkaline')) {
    avoid.push('Blueberry', 'Potato');
  }
  if (salinityRisk === 'High') {
    avoid.push('Most Vegetables', 'Pulses (sensitive varieties)', 'Strawberry');
  }
  return avoid;
}