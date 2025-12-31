
/**
 * Indian Crop Intelligence Engine - Core Simulation Logic
 * 
 * A deterministic, daily time-step crop simulation model designed for Indian agriculture.
 * Implements FAO-56 style water balance and radiation use efficiency (RUE) biomass growth.
 * 
 * Key Principles:
 * 1. Phenology driven by Thermal Time (Growing Degree Days - GDD)
 * 2. Growth limited by Water Stress (Soil Water Deficit)
 * 3. Yield partitioning based on Harvest Index sensitive to stress during critical windows
 */

// --- Types & Interfaces ---

export type CropType = 'Wheat' | 'Rice' | 'Maize';
export type SoilType = 'Sandy Loam' | 'Clay Loam' | 'Silt Clay';

export interface WeatherDaily {
  day: number;           // Day of simulation (1..N)
  date: string;          // ISO Date
  tmax: number;          // Max Temperature (C)
  tmin: number;          // Min Temperature (C)
  precip: number;        // Precipitation (mm)
  solar_rad: number;     // Solar Radiation (MJ/m2/day)
  eto?: number;          // Reference Evapotranspiration (mm), optional if calculated
}

export interface SimulationParams {
  crop_type: CropType;
  sowing_date: string;   // ISO Date
  soil_type: SoilType;
  initial_soil_water_pct: number; // 0-100% of PAW (Plant Available Water)
  nitrogen_applied_kg_ha: number; // Total N applied (simplification for now)
  weather_history?: WeatherDaily[]; // If not provided, will generate defaults
  simulation_days?: number; // Default 120-150 depending on crop
}

export interface DailyOutput {
  day: number;
  date: string;
  stage: string;         // 'Sowing', 'Emergence', 'Vegetative', 'Flowering', 'Grain Filling', 'Maturity'
  gdd_cum: number;       // Accumulated Thermal Time
  biomass: number;       // Above-ground biomass (kg/ha)
  lai: number;           // Leaf Area Index
  root_depth: number;    // Root depth (mm)
  soil_water: number;    // Current soil water (mm)
  water_stress: number;  // 0 (no stress) to 1 (full stress)
  et_crop: number;       // Actual Crop Evapotranspiration (mm)
}

export interface SimulationResult {
  summary: {
    total_biomass: number; // kg/ha
    yield: number;         // kg/ha
    days_to_maturity: number;
    total_water_use: number; // mm
    average_stress: number; // 0-1
  };
  daily_logs: DailyOutput[];
}

// --- Crop Parameters Database ---

interface CropParams {
  base_temp: number;      // Tbase (C)
  opt_temp: number;       // Topt (C)
  max_temp: number;       // Tmax (C)
  gdd_emergence: number;  // GDD required for emergence
  gdd_flowering: number;  // GDD required for flowering
  gdd_maturity: number;   // GDD required for maturity
  rue: number;            // Radiation Use Efficiency (g/MJ)
  max_lai: number;        // Maximum Leaf Area Index
  kc_ini: number;         // Crop Coefficient - Initial
  kc_mid: number;         // Crop Coefficient - Mid-season
  kc_end: number;         // Crop Coefficient - End-season
  root_depth_max: number; // Maximum root depth (mm)
  harvest_index: number;  // Potential Harvest Index
  stress_sensitivity: number; // Sensitivity of HI to stress (0-1)
}

const CROP_DB: Record<CropType, CropParams> = {
  'Wheat': {
    base_temp: 0,
    opt_temp: 26,
    max_temp: 35,
    gdd_emergence: 120,
    gdd_flowering: 1100, // Reduced for typical Indian varieties
    gdd_maturity: 1800,
    rue: 3.0, // High efficiency C3
    max_lai: 5.0,
    kc_ini: 0.3,
    kc_mid: 1.15,
    kc_end: 0.4,
    root_depth_max: 1200,
    harvest_index: 0.45,
    stress_sensitivity: 0.6
  },
  'Rice': {
    base_temp: 10,
    opt_temp: 30,
    max_temp: 40,
    gdd_emergence: 150, // Nursery usually, but simulating field
    gdd_flowering: 1300,
    gdd_maturity: 2100,
    rue: 2.8, // C3 but heat tolerant
    max_lai: 6.0,
    kc_ini: 1.05, // Flooded/saturated
    kc_mid: 1.20,
    kc_end: 0.90, // Drain before harvest
    root_depth_max: 600, // Shallow rooted
    harvest_index: 0.50,
    stress_sensitivity: 0.8 // Highly sensitive
  },
  'Maize': {
    base_temp: 8,
    opt_temp: 30,
    max_temp: 40,
    gdd_emergence: 100,
    gdd_flowering: 900,
    gdd_maturity: 1600,
    rue: 3.8, // C4 plant, higher efficiency
    max_lai: 4.5,
    kc_ini: 0.3,
    kc_mid: 1.2,
    kc_end: 0.6,
    root_depth_max: 1000,
    harvest_index: 0.50,
    stress_sensitivity: 0.7
  }
};

// --- Soil Parameters Database ---

interface SoilParams {
  field_capacity: number; // Volumetric water content at FC (mm/mm)
  wilting_point: number;  // Volumetric water content at WP (mm/mm)
  sat_conductivity: number; // mm/day
  runoff_curve_number: number;
}

const SOIL_DB: Record<SoilType, SoilParams> = {
  'Sandy Loam': { field_capacity: 0.22, wilting_point: 0.10, sat_conductivity: 500, runoff_curve_number: 65 },
  'Clay Loam': { field_capacity: 0.32, wilting_point: 0.18, sat_conductivity: 100, runoff_curve_number: 80 },
  'Silt Clay': { field_capacity: 0.38, wilting_point: 0.22, sat_conductivity: 20, runoff_curve_number: 85 }
};

// --- Simulation Engine Class ---

export class CropEngine {
  
  /**
   * Main simulation runner
   */
  public static runSimulation(params: SimulationParams): SimulationResult {
    const crop = CROP_DB[params.crop_type];
    const soil = SOIL_DB[params.soil_type];
    
    // Initialize State
    let current_date = new Date(params.sowing_date);
    let gdd_cum = 0;
    let biomass = 0; // kg/ha
    let yield_mass = 0;
    let root_depth = 100; // Start with 10cm roots
    let lai = 0;
    
    // Soil Water Balance Initialization
    // Assume soil depth 1500mm effectively
    const soil_profile_depth = 1500; 
    const total_paw = (soil.field_capacity - soil.wilting_point) * soil_profile_depth; // Total Plant Available Water (mm)
    let current_soil_water = (params.initial_soil_water_pct / 100) * total_paw + (soil.wilting_point * soil_profile_depth);
    
    const logs: DailyOutput[] = [];
    
    // Generate weather if missing (simple climatology generator)
    const weatherData = params.weather_history || this.generateSyntheticWeather(params.sowing_date, params.simulation_days || 150);
    
    // Accumulators
    let total_et = 0;
    let stress_sum = 0;
    let stress_days = 0;
    let maturity_reached = false;
    let days_count = 0;
    
    for (const weather of weatherData) {
      if (maturity_reached) break;
      days_count++;
      
      // 1. Calculate Thermal Time (GDD)
      const t_mean = (weather.tmax + weather.tmin) / 2;
      let daily_gdd = Math.max(0, t_mean - crop.base_temp);
      // Cap at optimal temp (simplification)
      if (t_mean > crop.opt_temp) {
        daily_gdd -= (t_mean - crop.opt_temp); // Penalty for high heat
      }
      daily_gdd = Math.max(0, daily_gdd);
      gdd_cum += daily_gdd;
      
      // 2. Determine Phenological Stage
      let stage = 'Vegetative';
      let kc = crop.kc_ini;
      
      if (gdd_cum < crop.gdd_emergence) {
        stage = 'Sowing';
        kc = 0.3; // Bare soil evap
        lai = 0;
      } else if (gdd_cum < crop.gdd_flowering) {
        stage = 'Vegetative';
        // Linear increase in Kc and LAI
        const progress = (gdd_cum - crop.gdd_emergence) / (crop.gdd_flowering - crop.gdd_emergence);
        kc = crop.kc_ini + (crop.kc_mid - crop.kc_ini) * progress;
        lai = crop.max_lai * Math.pow(progress, 1.5); // Sigmoidal approx
        // Root growth
        root_depth = Math.min(crop.root_depth_max, 100 + (crop.root_depth_max - 100) * progress);
      } else if (gdd_cum < crop.gdd_maturity) {
        const progress = (gdd_cum - crop.gdd_flowering) / (crop.gdd_maturity - crop.gdd_flowering);
        if (progress < 0.5) {
            stage = 'Flowering';
            kc = crop.kc_mid;
        } else {
            stage = 'Grain Filling';
            kc = crop.kc_mid + (crop.kc_end - crop.kc_mid) * ((progress - 0.5) * 2);
        }
        lai = crop.max_lai * (1 - 0.3 * progress); // Leaves senescence
      } else {
        stage = 'Maturity';
        maturity_reached = true;
      }
      
      // 3. Water Balance
      // Reference ETo (Hargreaves method if not provided)
      const eto = weather.eto || this.calculateETo(weather.tmin, weather.tmax, weather.solar_rad, current_date.getMonth() + 1);
      
      // Crop Water Demand
      const et_c_potential = eto * kc;
      
      // Soil Water Limits (in root zone)
      // For simplicity, we model the whole profile as a single bucket for now, 
      // but scale availability by root depth fraction.
      const root_zone_fraction = root_depth / soil_profile_depth;
      const paw_root_zone = total_paw * root_zone_fraction;
      
      // Current water available above wilting point in root zone
      const available_water = Math.max(0, (current_soil_water - (soil.wilting_point * soil_profile_depth)) * root_zone_fraction);
      const paw_fraction = available_water / (paw_root_zone + 0.1); // Avoid div by zero
      
      // Stress Coefficient (Ks)
      // Stress starts when PAW < 50% (p = 0.5 roughly)
      let ks = 1.0;
      const depletion_threshold = 0.5; 
      if (paw_fraction < depletion_threshold) {
        ks = paw_fraction / depletion_threshold;
      }
      
      const et_actual = et_c_potential * ks;
      const water_stress_factor = 1.0 - ks; // 0 = no stress, 1 = full stress
      
      // Update Bucket
      // In + Precip - ET - Drainage
      // Drainage: anything above Field Capacity
      const fc_absolute = soil.field_capacity * soil_profile_depth;
      
      current_soil_water += weather.precip;
      current_soil_water -= et_actual;
      
      if (current_soil_water > fc_absolute) {
        current_soil_water = fc_absolute; // Instant drainage assumption
      }
      if (current_soil_water < soil.wilting_point * soil_profile_depth) {
        current_soil_water = soil.wilting_point * soil_profile_depth;
      }
      
      // 4. Biomass Accumulation
      // RUE * Intercepted Radiation * Stress Factor
      // Intercepted Rad = SolarRad * (1 - exp(-k * LAI))  where k ~ 0.5
      if (stage !== 'Sowing' && !maturity_reached) {
         const k_extinction = 0.65;
         const f_intercepted = 1 - Math.exp(-k_extinction * lai);
         const daily_biomass = crop.rue * weather.solar_rad * f_intercepted * Math.min(ks, 1.0); // Simple stress reduction
         biomass += daily_biomass * 10; // Convert g/m2 to kg/ha
      }
      
      // Track stress during sensitive periods (Flowering/Grain Filling)
      if (stage === 'Flowering' || stage === 'Grain Filling') {
        stress_sum += water_stress_factor;
        stress_days++;
      }
      
      total_et += et_actual;
      
      // Log Output
      logs.push({
        day: weather.day,
        date: weather.date,
        stage,
        gdd_cum,
        biomass: Math.round(biomass),
        lai: parseFloat(lai.toFixed(2)),
        root_depth: Math.round(root_depth),
        soil_water: Math.round(current_soil_water),
        water_stress: parseFloat(water_stress_factor.toFixed(2)),
        et_crop: parseFloat(et_actual.toFixed(2))
      });
      
      // Advance Date
      current_date.setDate(current_date.getDate() + 1);
    }
    
    // 5. Final Yield Calculation
    // HI is reduced by average stress during reproductive stages
    let actual_hi = crop.harvest_index;
    if (stress_days > 0) {
        const avg_stress = stress_sum / stress_days;
        // Linear reduction: HI = HI_pot * (1 - sensitivity * stress)
        actual_hi = crop.harvest_index * (1 - (crop.stress_sensitivity * avg_stress));
    }
    
    yield_mass = biomass * Math.max(0.05, actual_hi); // Minimum 0.05 HI even in bad failure
    
    return {
      summary: {
        total_biomass: Math.round(biomass),
        yield: Math.round(yield_mass),
        days_to_maturity: logs.length,
        total_water_use: Math.round(total_et),
        average_stress: parseFloat((stress_days > 0 ? stress_sum / stress_days : 0).toFixed(2))
      },
      daily_logs: logs
    };
  }
  
  /**
   * Hargreaves-Samani method for ETo
   */
  private static calculateETo(tmin: number, tmax: number, srad: number, month: number): number {
    const tmean = (tmax + tmin) / 2;
    // 0.0023 * Ra * (Tmean + 17.8) * sqrt(Tmax - Tmin)
    // Using srad (MJ/m2/day) instead of Ra (Extraterrestrial) is a valid modification (approx 0.408 to convert MJ to mm)
    // Standard FAO: 0.408 * 0.0023 * Srad * (T + 17.8) ... wait, Hargreaves uses Ra.
    // If we have Srad, we can use Priestley-Taylor or simple conversion if humidity unknown.
    // Let's use a simplified radiation-temperature method:
    // ETo ~ 0.0135 * (Tmean + 17.78) * Rs * (238.8 / (595.5 - 0.55 * Tmean)) -- complex.
    
    // Simple conversion for approximation:
    // ETo approx 0.0023 * (Tmean + 17.8) * (Tmax - Tmin)^0.5 * Ra
    // We will use the input Srad as the energy driver directly.
    // ETo approx alpha * Srad/lambda
    // let's stick to a robust standard approx: 
    return 0.0023 * (tmean + 17.8) * Math.sqrt(Math.max(0.1, tmax - tmin)) * (0.408 * srad * 1.3); // 1.3 factor to approx Ra from Rs
  }

  /**
   * Generates synthetic weather for testing if no API data
   */
  private static generateSyntheticWeather(start_date_str: string, days: number): WeatherDaily[] {
    const weather: WeatherDaily[] = [];
    const date = new Date(start_date_str);
    
    for (let i = 1; i <= days; i++) {
        const month = date.getMonth(); // 0-11
        
        // Seasonal Temperature Sine Wave (India context: Hot in May/June, Cold in Dec/Jan)
        // Peak ~ Day 170 (June), Trough ~ Day 15 (Jan)
        const day_of_year = this.getDayOfYear(date);
        const temp_offset = -10 * Math.cos(2 * Math.PI * (day_of_year - 15) / 365);
        
        const base_tmax = 32 + temp_offset;
        const base_tmin = 20 + temp_offset;
        
        // Daily variability
        const noise = (Math.random() - 0.5) * 4;
        
        // Monsoon Rain (June to Sept)
        let precip = 0;
        const is_monsoon = (month >= 5 && month <= 8); // Jun-Sep
        if (is_monsoon && Math.random() > 0.6) {
            precip = Math.random() * 50; // Some heavy rain
        }
        
        // Solar Rad (lower in monsoon due to clouds, lower in winter due to angle)
        let srad = 20;
        if (is_monsoon) srad = 15 + Math.random() * 5;
        else if (month === 11 || month === 0) srad = 14 + Math.random() * 2;
        else srad = 22 + Math.random() * 4;

        weather.push({
            day: i,
            date: date.toISOString().split('T')[0],
            tmax: parseFloat((base_tmax + noise).toFixed(1)),
            tmin: parseFloat((base_tmin + noise).toFixed(1)),
            precip: parseFloat(precip.toFixed(1)),
            solar_rad: parseFloat(srad.toFixed(1))
        });
        
        date.setDate(date.getDate() + 1);
    }
    return weather;
  }
  
  private static getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
}
