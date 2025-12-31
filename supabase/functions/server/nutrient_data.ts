
export interface NutrientStage {
  stage_name: string;
  day_start: number;
  day_end: number;
  description: string;
  nutrients: {
    n: number; // kg/acre
    p: number; // kg/acre
    k: number; // kg/acre
  };
  recommended_products: string[];
  application_method: string;
}

export interface NutrientPlan {
  crop_name: string;
  total_n: number;
  total_p: number;
  total_k: number;
  stages: NutrientStage[];
}

export const NUTRIENT_DATABASE: Record<string, NutrientPlan> = {
  "Wheat": {
    crop_name: "Wheat",
    total_n: 50, // kg/acre approx (120kg/ha)
    total_p: 25, // kg/acre (60kg/ha)
    total_k: 16, // kg/acre (40kg/ha)
    stages: [
      {
        stage_name: "Basal (At Sowing)",
        day_start: 0,
        day_end: 0,
        description: "Foundation nutrients for root establishment.",
        nutrients: { n: 25, p: 25, k: 16 }, // 50% N, 100% P, 100% K
        recommended_products: ["DAP (Diammonium Phosphate)", "MOP (Muriate of Potash)", "Urea"],
        application_method: "Soil application / Drilling"
      },
      {
        stage_name: "CRI Stage (Crown Root Initiation)",
        day_start: 20,
        day_end: 25,
        description: "Critical stage for tillering. Top dressing required.",
        nutrients: { n: 12.5, p: 0, k: 0 }, // 25% N
        recommended_products: ["Urea"],
        application_method: "Top dressing before irrigation"
      },
      {
        stage_name: "Booting / Jointing",
        day_start: 45,
        day_end: 50,
        description: "Stem elongation phase.",
        nutrients: { n: 12.5, p: 0, k: 0 }, // 25% N
        recommended_products: ["Urea"],
        application_method: "Top dressing"
      }
    ]
  },
  "Rice": {
    crop_name: "Rice (Paddy)",
    total_n: 60, // 150kg/ha
    total_p: 25, // 60kg/ha
    total_k: 25, // 60kg/ha
    stages: [
      {
        stage_name: "Basal (Transplanting)",
        day_start: 0,
        day_end: 0,
        description: "Nutrients for transplant shock recovery and rooting.",
        nutrients: { n: 15, p: 25, k: 15 }, // 25% N, 100% P, 75% K
        recommended_products: ["DAP", "MOP", "Zinc Sulphate"],
        application_method: "Soil incorporation"
      },
      {
        stage_name: "Active Tillering",
        day_start: 20,
        day_end: 25,
        description: "To support rapid tiller formation.",
        nutrients: { n: 30, p: 0, k: 0 }, // 50% N
        recommended_products: ["Urea", "Neem Coated Urea"],
        application_method: "Broadcasting into standing water"
      },
      {
        stage_name: "Panicle Initiation",
        day_start: 45,
        day_end: 50,
        description: "Determines grain number per panicle.",
        nutrients: { n: 15, p: 0, k: 10 }, // 25% N, 25% K
        recommended_products: ["Urea", "MOP"],
        application_method: "Top dressing"
      }
    ]
  },
  "Maize": {
    crop_name: "Maize",
    total_n: 70, // 175kg/ha (Heavy feeder)
    total_p: 30,
    total_k: 25,
    stages: [
      {
        stage_name: "Basal (Sowing)",
        day_start: 0,
        day_end: 0,
        description: "Starter dose for vigorous seedling growth.",
        nutrients: { n: 20, p: 30, k: 25 }, // ~30% N, 100% P, 100% K
        recommended_products: ["NPK 12:32:16", "DAP"],
        application_method: "Band placement"
      },
      {
        stage_name: "Knee High Stage",
        day_start: 30,
        day_end: 35,
        description: "Rapid vegetative growth.",
        nutrients: { n: 25, p: 0, k: 0 },
        recommended_products: ["Urea"],
        application_method: "Side dressing"
      },
      {
        stage_name: "Tasseling",
        day_start: 55,
        day_end: 60,
        description: "Critical for cob formation.",
        nutrients: { n: 25, p: 0, k: 0 },
        recommended_products: ["Urea"],
        application_method: "Side dressing"
      }
    ]
  },
  "Cotton": {
    crop_name: "Cotton",
    total_n: 60,
    total_p: 30,
    total_k: 25,
    stages: [
      {
        stage_name: "Basal",
        day_start: 0,
        day_end: 0,
        description: "Foundation dose.",
        nutrients: { n: 10, p: 30, k: 10 },
        recommended_products: ["DAP", "MOP"],
        application_method: "Soil application"
      },
      {
        stage_name: "Square Formation",
        day_start: 45,
        day_end: 50,
        description: "Bud initiation phase.",
        nutrients: { n: 25, p: 0, k: 7.5 },
        recommended_products: ["Urea", "MOP"],
        application_method: "Top dressing / Ring method"
      },
      {
        stage_name: "Flowering / Boll Formation",
        day_start: 75,
        day_end: 80,
        description: "Peak nutrient demand.",
        nutrients: { n: 25, p: 0, k: 7.5 },
        recommended_products: ["Urea", "MOP", "Magnesium Sulphate"],
        application_method: "Top dressing"
      }
    ]
  },
  "Groundnut": {
    crop_name: "Groundnut",
    total_n: 10, // Legume, fixes own N
    total_p: 20,
    total_k: 15,
    stages: [
      {
        stage_name: "Basal",
        day_start: 0,
        day_end: 0,
        description: "Full dose of NPK + Gypsum for pod formation.",
        nutrients: { n: 10, p: 20, k: 15 },
        recommended_products: ["DAP", "MOP", "Gypsum (200kg/acre)"],
        application_method: "Soil incorporation"
      },
      {
        stage_name: "Pegging (Flowering)",
        day_start: 30,
        day_end: 35,
        description: "Critical stage. Avoid N, focus on Calcium/Sulphur.",
        nutrients: { n: 0, p: 0, k: 0 },
        recommended_products: ["Gypsum (Top dressing)", "Boron spray"],
        application_method: "Broadcasting near root zone"
      }
    ]
  },
  "Soybean": {
    crop_name: "Soybean",
    total_n: 12,
    total_p: 24,
    total_k: 16,
    stages: [
      {
        stage_name: "Basal",
        day_start: 0,
        day_end: 0,
        description: "Starter dose.",
        nutrients: { n: 12, p: 24, k: 16 },
        recommended_products: ["NPK 12:32:16", "Sulphur"],
        application_method: "Drilling below seed"
      },
      {
        stage_name: "Flowering",
        day_start: 35,
        day_end: 40,
        description: "Micronutrient correction.",
        nutrients: { n: 0, p: 0, k: 0 },
        recommended_products: ["Liquid NPK 19:19:19 Spray"],
        application_method: "Foliar Spray"
      }
    ]
  },
  "Sugarcane": {
    crop_name: "Sugarcane",
    total_n: 100, // Heavy feeder
    total_p: 30,
    total_k: 40,
    stages: [
      {
        stage_name: "Basal",
        day_start: 0,
        day_end: 0,
        description: "Planting dose.",
        nutrients: { n: 15, p: 30, k: 15 },
        recommended_products: ["DAP", "MOP", "Urea"],
        application_method: "Furrow application"
      },
      {
        stage_name: "Tillering (45 Days)",
        day_start: 45,
        day_end: 50,
        description: "Early growth boost.",
        nutrients: { n: 35, p: 0, k: 0 },
        recommended_products: ["Urea"],
        application_method: "Top dressing"
      },
      {
        stage_name: "Grand Growth (90 Days)",
        day_start: 90,
        day_end: 95,
        description: "Major biomass accumulation.",
        nutrients: { n: 35, p: 0, k: 15 },
        recommended_products: ["Urea", "MOP"],
        application_method: "Earthing up"
      },
      {
        stage_name: "Late Growth (120 Days)",
        day_start: 120,
        day_end: 125,
        description: "Final dose.",
        nutrients: { n: 15, p: 0, k: 10 },
        recommended_products: ["Urea", "MOP"],
        application_method: "Top dressing"
      }
    ]
  },
  "Bajra": {
    crop_name: "Bajra (Pearl Millet)",
    total_n: 30,
    total_p: 15,
    total_k: 10,
    stages: [
      {
        stage_name: "Basal",
        day_start: 0,
        day_end: 0,
        description: "Sowing dose.",
        nutrients: { n: 15, p: 15, k: 10 },
        recommended_products: ["DAP", "Urea", "MOP"],
        application_method: "Drilling"
      },
      {
        stage_name: "Tillering / Knee High",
        day_start: 25,
        day_end: 30,
        description: "Vegetative growth.",
        nutrients: { n: 15, p: 0, k: 0 },
        recommended_products: ["Urea"],
        application_method: "Top dressing after rain"
      }
    ]
  }
};
