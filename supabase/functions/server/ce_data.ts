
import { CropProfile } from "./ce_models.ts";

/**
 * Sample Crop Profile: Paddy (Rice) - Variety: IR-64 (Generic Proxy)
 * 
 * Agronomic Logic:
 * - High water sensitivity, especially in reproductive stages.
 * - Thermal time driven.
 * - 4 Key Stages: Establishment -> Vegetative -> Reproductive (Flowering) -> Ripening
 */
export const PADDY_PROFILE: CropProfile = {
  crop_name: "Paddy",
  variety_name: "High Yield Generic (e.g., IR-64)",
  base_temperature: 10,  // Rice stops growing below 10C
  opt_temperature: 30,   // Optimal growth temp
  max_temperature: 40,   // Heat stress threshold
  total_gdd_required: 2100,
  seed_rate_kg_per_ha: 40,
  yield_potential_t_per_ha: 7.5, // Good management potential
  water_sensitivity: "High",
  nutrient_sensitivity: "High",
  stages: [
    {
      stage_code: 1,
      stage_name: "Establishment / Seedling",
      gdd_required: 300,
      min_days: 15,
      water_requirement_mm_per_day: 4.0, // Nursery/early stage
      stress_sensitivity_multiplier: 0.8, // Moderate sensitivity
      description: "Germination and early root development."
    },
    {
      stage_code: 2,
      stage_name: "Vegetative / Tillering",
      gdd_required: 700,
      min_days: 35,
      water_requirement_mm_per_day: 6.5, // High demand for tillering
      stress_sensitivity_multiplier: 0.5, // Recoverable stress
      description: "Leaf canopy expansion and tiller formation. Biomass building."
    },
    {
      stage_code: 3,
      stage_name: "Reproductive / Flowering",
      gdd_required: 600,
      min_days: 30,
      water_requirement_mm_per_day: 7.5, // Peak demand
      stress_sensitivity_multiplier: 1.5, // CRITICAL STAGE - Irreversible yield loss
      description: "Panicle initiation, booting, flowering, and pollination. Highest sensitivity."
    },
    {
      stage_code: 4,
      stage_name: "Ripening / Grain Filling",
      gdd_required: 500,
      min_days: 25,
      water_requirement_mm_per_day: 5.0, // Declining demand
      stress_sensitivity_multiplier: 1.0, // Affects grain weight
      description: "Grain filling and maturation. Yield consolidation."
    }
  ]
};

export const WHEAT_PROFILE: CropProfile = {
  crop_name: "Wheat",
  variety_name: "HD-2967 (Rabi Standard)",
  base_temperature: 5,   // Wheat grows in cooler temps
  opt_temperature: 20,   // Optimal temp is lower
  max_temperature: 30,   // Heat stress threshold (terminal heat stress is common)
  total_gdd_required: 1800,
  seed_rate_kg_per_ha: 100,
  yield_potential_t_per_ha: 6.0,
  water_sensitivity: "Medium",
  nutrient_sensitivity: "High",
  stages: [
    {
      stage_code: 1,
      stage_name: "Crown Root / Tillering",
      gdd_required: 400,
      min_days: 25,
      water_requirement_mm_per_day: 2.5,
      stress_sensitivity_multiplier: 1.2, // CRI stage is critical for irrigation
      description: "Crown root initiation is critical for plant establishment."
    },
    {
      stage_code: 2,
      stage_name: "Jointing / Booting",
      gdd_required: 600,
      min_days: 40,
      water_requirement_mm_per_day: 4.0,
      stress_sensitivity_multiplier: 0.8,
      description: "Stem elongation and ear formation."
    },
    {
      stage_code: 3,
      stage_name: "Flowering / Anthesis",
      gdd_required: 300,
      min_days: 15,
      water_requirement_mm_per_day: 5.5,
      stress_sensitivity_multiplier: 1.5, // Critical for grain setting
      description: "Pollination. High sensitivity to water and heat stress."
    },
    {
      stage_code: 4,
      stage_name: "Grain Filling / Maturity",
      gdd_required: 500,
      min_days: 30,
      water_requirement_mm_per_day: 3.5,
      stress_sensitivity_multiplier: 1.1, // Terminal heat stress affects grain weight
      description: "Milking, dough, and hardening stages."
    }
  ]
};

export const MAIZE_PROFILE: CropProfile = {
  crop_name: "Maize",
  variety_name: "Hybrid Maize",
  base_temperature: 10,
  opt_temperature: 30,
  max_temperature: 42,
  total_gdd_required: 1600, // Shorter cycle
  seed_rate_kg_per_ha: 20,
  yield_potential_t_per_ha: 8.0,
  water_sensitivity: "High",
  nutrient_sensitivity: "High",
  stages: [
    {
      stage_code: 1,
      stage_name: "Germination / Establishment",
      gdd_required: 200,
      min_days: 10,
      water_requirement_mm_per_day: 3.0,
      stress_sensitivity_multiplier: 0.7,
      description: "Emergence to V4 stage."
    },
    {
      stage_code: 2,
      stage_name: "Vegetative (Knee High)",
      gdd_required: 600,
      min_days: 35,
      water_requirement_mm_per_day: 5.5,
      stress_sensitivity_multiplier: 0.9,
      description: "Rapid growth phase."
    },
    {
      stage_code: 3,
      stage_name: "Flowering (Tasseling/Silking)",
      gdd_required: 300,
      min_days: 15,
      water_requirement_mm_per_day: 7.0,
      stress_sensitivity_multiplier: 1.8, // Most critical stage for maize
      description: "Pollination. Severe yield loss if water stressed."
    },
    {
      stage_code: 4,
      stage_name: "Grain Filling / Maturity",
      gdd_required: 500,
      min_days: 30,
      water_requirement_mm_per_day: 4.5,
      stress_sensitivity_multiplier: 1.0,
      description: "Kernel development and dry down."
    }
  ]
};

export const GROUNDNUT_PROFILE: CropProfile = {
  crop_name: "Groundnut",
  variety_name: "TG-37A / Kadiri-6",
  base_temperature: 10,
  opt_temperature: 30,
  max_temperature: 40,
  total_gdd_required: 1700,
  seed_rate_kg_per_ha: 120,
  yield_potential_t_per_ha: 3.5,
  water_sensitivity: "Medium", // Resilient but needs water at pegging
  nutrient_sensitivity: "Medium",
  stages: [
    {
      stage_code: 1,
      stage_name: "Emergence / Seedling",
      gdd_required: 200,
      min_days: 15,
      water_requirement_mm_per_day: 3.0,
      stress_sensitivity_multiplier: 0.6,
      description: "Germination to first flowering."
    },
    {
      stage_code: 2,
      stage_name: "Flowering & Pegging",
      gdd_required: 500,
      min_days: 30,
      water_requirement_mm_per_day: 6.0,
      stress_sensitivity_multiplier: 1.6, // Critical stage - Peg penetration
      description: "Flowers turn to pegs and enter soil. Needs loose moist soil."
    },
    {
      stage_code: 3,
      stage_name: "Pod Formation",
      gdd_required: 600,
      min_days: 35,
      water_requirement_mm_per_day: 5.0,
      stress_sensitivity_multiplier: 1.2, // Pod filling
      description: "Pods developing underground."
    },
    {
      stage_code: 4,
      stage_name: "Maturity",
      gdd_required: 400,
      min_days: 20,
      water_requirement_mm_per_day: 3.0,
      stress_sensitivity_multiplier: 0.8,
      description: "Pod hardening and seed maturity."
    }
  ]
};

export const COTTON_PROFILE: CropProfile = {
  crop_name: "Cotton",
  variety_name: "Bt Cotton Hybrid",
  base_temperature: 15,
  opt_temperature: 32,
  max_temperature: 45,
  total_gdd_required: 2400, // Long duration
  seed_rate_kg_per_ha: 2.5,
  yield_potential_t_per_ha: 3.0,
  water_sensitivity: "High",
  nutrient_sensitivity: "High",
  stages: [
    {
      stage_code: 1,
      stage_name: "Seedling / Establishment",
      gdd_required: 300,
      min_days: 20,
      water_requirement_mm_per_day: 3.5,
      stress_sensitivity_multiplier: 0.8,
      description: "Germination and early growth."
    },
    {
      stage_code: 2,
      stage_name: "Vegetative / Square Formation",
      gdd_required: 700,
      min_days: 45,
      water_requirement_mm_per_day: 6.0,
      stress_sensitivity_multiplier: 1.0,
      description: "Branching and square (bud) formation."
    },
    {
      stage_code: 3,
      stage_name: "Flowering / Boll Formation",
      gdd_required: 900,
      min_days: 60,
      water_requirement_mm_per_day: 7.5,
      stress_sensitivity_multiplier: 1.5, // Critical for boll retention
      description: "Flowering and boll setting. High water need."
    },
    {
      stage_code: 4,
      stage_name: "Boll Opening / Maturity",
      gdd_required: 500,
      min_days: 30,
      water_requirement_mm_per_day: 4.0,
      stress_sensitivity_multiplier: 0.7,
      description: "Bolls burst open. Dry weather preferred."
    }
  ]
};

export const SOYBEAN_PROFILE: CropProfile = {
  crop_name: "Soybean",
  variety_name: "JS-335",
  base_temperature: 10,
  opt_temperature: 30,
  max_temperature: 40,
  total_gdd_required: 1600,
  seed_rate_kg_per_ha: 75,
  yield_potential_t_per_ha: 2.5,
  water_sensitivity: "Medium",
  nutrient_sensitivity: "Medium",
  stages: [
    {
      stage_code: 1,
      stage_name: "Emergence",
      gdd_required: 150,
      min_days: 8,
      water_requirement_mm_per_day: 3.0,
      stress_sensitivity_multiplier: 0.6,
      description: "Cotyledon emergence."
    },
    {
      stage_code: 2,
      stage_name: "Vegetative",
      gdd_required: 450,
      min_days: 25,
      water_requirement_mm_per_day: 5.0,
      stress_sensitivity_multiplier: 0.8,
      description: "Trifoliate leaves and branching."
    },
    {
      stage_code: 3,
      stage_name: "Flowering / Pod Initiation",
      gdd_required: 500,
      min_days: 30,
      water_requirement_mm_per_day: 6.5,
      stress_sensitivity_multiplier: 1.6, // Critical
      description: "Blooming and pod set."
    },
    {
      stage_code: 4,
      stage_name: "Pod Filling / Maturity",
      gdd_required: 500,
      min_days: 30,
      water_requirement_mm_per_day: 4.5,
      stress_sensitivity_multiplier: 1.2,
      description: "Seed development and leaf drop."
    }
  ]
};

export const SUGARCANE_PROFILE: CropProfile = {
  crop_name: "Sugarcane",
  variety_name: "Co-0238",
  base_temperature: 12,
  opt_temperature: 32,
  max_temperature: 45,
  total_gdd_required: 4500, // Very long duration (10-12 months)
  seed_rate_kg_per_ha: 7000, // Setts
  yield_potential_t_per_ha: 100, // Cane yield
  water_sensitivity: "High",
  nutrient_sensitivity: "High",
  stages: [
    {
      stage_code: 1,
      stage_name: "Germination",
      gdd_required: 400,
      min_days: 40,
      water_requirement_mm_per_day: 4.0,
      stress_sensitivity_multiplier: 0.9,
      description: "Sprouting of buds."
    },
    {
      stage_code: 2,
      stage_name: "Tillering / Formative",
      gdd_required: 1200,
      min_days: 100,
      water_requirement_mm_per_day: 7.0,
      stress_sensitivity_multiplier: 1.0,
      description: "Canopy development and tiller production."
    },
    {
      stage_code: 3,
      stage_name: "Grand Growth",
      gdd_required: 2000,
      min_days: 150,
      water_requirement_mm_per_day: 8.5,
      stress_sensitivity_multiplier: 1.4, // Yield formation
      description: "Cane elongation and weight gain."
    },
    {
      stage_code: 4,
      stage_name: "Maturation",
      gdd_required: 900,
      min_days: 60,
      water_requirement_mm_per_day: 4.0,
      stress_sensitivity_multiplier: 0.8,
      description: "Sucrose accumulation and ripening."
    }
  ]
};

export const BAJRA_PROFILE: CropProfile = {
  crop_name: "Bajra",
  variety_name: "Hybrid Bajra",
  base_temperature: 12,
  opt_temperature: 34,
  max_temperature: 45, // Heat tolerant
  total_gdd_required: 1400, // Short duration
  seed_rate_kg_per_ha: 5,
  yield_potential_t_per_ha: 3.5,
  water_sensitivity: "Low", // Drought tolerant
  nutrient_sensitivity: "Low",
  stages: [
    {
      stage_code: 1,
      stage_name: "Seedling",
      gdd_required: 200,
      min_days: 15,
      water_requirement_mm_per_day: 2.5,
      stress_sensitivity_multiplier: 0.6,
      description: "Establishment."
    },
    {
      stage_code: 2,
      stage_name: "Vegetative",
      gdd_required: 500,
      min_days: 30,
      water_requirement_mm_per_day: 4.5,
      stress_sensitivity_multiplier: 0.8,
      description: "Tillering and stem elongation."
    },
    {
      stage_code: 3,
      stage_name: "Reproductive",
      gdd_required: 400,
      min_days: 20,
      water_requirement_mm_per_day: 6.0,
      stress_sensitivity_multiplier: 1.5, // Flowering is sensitive
      description: "Earhead emergence and flowering."
    },
    {
      stage_code: 4,
      stage_name: "Maturity",
      gdd_required: 300,
      min_days: 20,
      water_requirement_mm_per_day: 3.0,
      stress_sensitivity_multiplier: 0.9,
      description: "Grain filling and hardening."
    }
  ]
};
