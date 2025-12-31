/**
 * INDIAN CROP INTELLIGENCE ENGINE
 * Soil-Wise Crop Cycle Type Definitions
 * 
 * This module defines the TypeScript types for the universal 10-stage crop cycle system
 * used throughout the Indian Crop Intelligence Engine.
 */

/**
 * Universal 10-stage crop cycle structure
 * MANDATORY: All crops must follow these exact stages in this order
 */
export type CropStageId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type CropStageName =
  | "Land Preparation"
  | "Seed Selection & Treatment"
  | "Sowing / Planting"
  | "Germination & Establishment"
  | "Vegetative Growth"
  | "Flowering"
  | "Fruiting / Grain Formation"
  | "Maturity"
  | "Harvest"
  | "Post-Harvest Soil Care";

export interface CropStage {
  stage_id: CropStageId;
  stage_name: CropStageName;
  duration_days: string; // e.g., "10-15", "20-30"
  soil_specific_notes: string;
  key_actions: string[];
  risk_factors: string[];
  ai_alerts: string[];
}

export interface CropCycle {
  soil_id: string; // References SOIL_MASTER_DATA soil_id
  crop_id: string; // Lowercase identifier, e.g., "paddy", "cotton"
  crop_name: string; // Display name, e.g., "Paddy", "Cotton"
  crop_cycle_duration_days: string; // e.g., "110-150", "160-180"
  image_url: string; // URL of the crop image
  stages: CropStage[];
}

/**
 * Soil Type IDs from SOIL_MASTER_DATA
 */
export type SoilTypeId =
  | "alluvial_soil"
  | "black_soil"
  | "red_soil"
  | "laterite_soil"
  | "arid_soil"
  | "mountain_forest_soil"
  | "saline_soil"
  | "alkaline_soil"
  | "peaty_marshy_soil"
  | "coastal_sandy_soil";

/**
 * Crop IDs supported in the system
 */
export type CropId =
  // Alluvial Soil Crops
  | "paddy"
  | "wheat"
  | "sugarcane"
  | "maize"
  | "pulses"
  // Black Soil Crops
  | "cotton"
  | "soybean"
  | "groundnut"
  | "sorghum"
  // Red Soil Crops
  | "millets"
  // Laterite Soil Crops
  | "cashew"
  | "tea"
  | "coffee"
  | "coconut"
  // Arid Soil Crops
  | "bajra"
  | "guar"
  | "moong"
  // Saline/Alkaline Soil Crops
  | "barley"
  | "salt_tolerant_paddy"
  // Mountain/Forest Soil Crops
  | "apple";

/**
 * Task types generated from crop cycles
 */
export type TaskType =
  | "Land Preparation"
  | "Seed Treatment"
  | "Sowing"
  | "Irrigation"
  | "Nutrients"
  | "Pest Control"
  | "Watering"
  | "Health"
  | "Harvesting"
  | "Soil Care"
  | "Maintenance";

/**
 * AI-generated task from crop cycle
 */
export interface CropTask {
  id: number;
  title: string;
  date: string; // Relative or absolute date
  type: TaskType;
  urgent: boolean;
  reason: string;
  stage_id?: CropStageId;
  stage_name?: CropStageName;
}
