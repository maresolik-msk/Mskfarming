
/**
 * Core Data Models for the Crop Engine
 * Based on Indian Crop Intelligence Engine requirements
 */

// --- A. Field Model ---
export interface Field {
  id: string;
  area_ha: number;
  soil_type: string; // e.g., "Sandy Loam"
  soil_properties: {
    ph: number;
    organic_matter_pct: number;
    texture: 'Sand' | 'Loam' | 'Clay' | 'Sandy Loam' | 'Clay Loam' | 'Silt Clay';
    nitrogen_level?: 'Low' | 'Medium' | 'High'; // Simplified for now
  };
  water_holding_capacity_mm: number; // Max water in root zone (Field Capacity)
  wilting_point_mm: number;          // Water level where plants die
  current_soil_water_mm: number;     // Dynamic state
  current_nitrogen_kg_ha: number;    // Dynamic state
  location: {
    lat: number;
    lon: number;
  };
}

// --- B. Crop Profile Model ---
export interface CropProfile {
  crop_name: string;
  variety_name: string;
  base_temperature: number; // Tbase (°C)
  opt_temperature: number;  // Topt (°C) - Added for heat stress
  max_temperature: number;  // Tmax (°C)
  total_gdd_required: number;
  seed_rate_kg_per_ha: number;
  yield_potential_t_per_ha: number; // Genetic potential under ideal conditions
  water_sensitivity: 'Low' | 'Medium' | 'High';
  nutrient_sensitivity: 'Low' | 'Medium' | 'High';
  stages: CropStageDefinition[];
}

// --- C. Crop Stage Definition ---
export interface CropStageDefinition {
  stage_code: number; // 1, 2, 3, 4
  stage_name: string; // e.g., "Vegetative", "Flowering"
  gdd_required: number; // GDD duration for this stage
  min_days: number; // Minimum calendar days regardless of heat
  water_requirement_mm_per_day: number; // Kc or absolute demand baseline
  stress_sensitivity_multiplier: number; // How much stress affects yield in this stage (0-1.5)
  description?: string;
}

// --- D. Weather Model ---
export interface DailyWeather {
  date: string; // ISO YYYY-MM-DD
  t_min: number;
  t_max: number;
  rainfall_mm: number;
  humidity_pct: number;
  solar_radiation_mj_m2?: number; // Optional
}

// --- E. Farm Operations ---
export type OperationType = 'Sowing' | 'Irrigation' | 'Fertilizer' | 'Spray' | 'Harvest';

export interface FarmOperation {
  date: string;
  operation_type: OperationType;
  quantity?: number; // Amount (liters, kg, etc.)
  nutrient_content?: {
    n_pct?: number; // Nitrogen %
    p_pct?: number;
    k_pct?: number;
  };
  notes?: string;
}

// --- Simulation State & Output ---
export interface CropState {
  current_stage_index: number;
  accumulated_gdd: number;
  stage_accumulated_gdd: number;
  biomass_kg_ha: number;
  yield_pool_t_ha: number; // The potential yield tracking
  stress_history: {
    water: number[];
    nutrient: number[];
    temperature: number[];
  };
  health_score: number; // 0-100
  days_elapsed: number;
  is_mature: boolean;
}

export interface DailySimulationOutput {
  day_index: number;
  date: string;
  stage_name: string;
  gdd_today: number;
  accumulated_gdd: number;
  water_balance: {
    start: number;
    rain: number;
    irrigation: number;
    et: number;
    end: number;
    drainage: number;
  };
  stress: {
    water: number;    // 0-1
    nutrient: number; // 0-1
    temperature: number; // 0-1
    combined: number; // 0-1
  };
  growth: {
    biomass_gain: number;
    accumulated_biomass: number;
    yield_potential_penalty: number; // Amount of yield lost today
  };
  advisory: string;
}

export interface SeasonResult {
  logs: DailySimulationOutput[];
  summary: {
    total_days: number;
    total_rainfall: number;
    total_irrigation: number;
    final_yield_t_ha: number;
    yield_potential_realized_pct: number;
    key_limiting_factors: string[];
    harvest_date: string;
  };
}
