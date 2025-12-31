
export interface Pest {
  name: string;
  symptoms: string;
  prevention: string;
  treatment: string;
}

export interface Disease {
  name: string;
  symptoms: string;
  prevention: string;
  treatment: string;
}

export interface Weed {
  name: string;
  control: string;
}

export interface ManagementStage {
  stage_name: string;
  day_start: number;
  day_end: number;
  description: string;
  nutrients: {
    n: number; // kg/acre
    p: number; // kg/acre
    k: number; // kg/acre
    micronutrients?: string[];
    products?: string[];
  };
  protection: {
    pests: Pest[];
    diseases: Disease[];
    weeds: Weed[];
  };
  water: {
    activity: string;
    criticality: "Low" | "Medium" | "High";
    advice: string;
  };
  practices: string[];
}

export interface CropManagementPlan {
  crop_name: string;
  scientific_name: string;
  duration_days: number;
  stages: ManagementStage[];
}

export const CROP_MANAGEMENT_DATABASE: Record<string, CropManagementPlan> = {
  "Wheat": {
    crop_name: "Wheat",
    scientific_name: "Triticum aestivum",
    duration_days: 120,
    stages: [
      {
        stage_name: "Sowing / Basal",
        day_start: 0,
        day_end: 0,
        description: "Seed sowing and foundation nutrient application.",
        nutrients: { 
          n: 25, p: 25, k: 16,
          products: ["DAP (55kg)", "MOP (27kg)", "Urea (25kg)"]
        },
        protection: {
          pests: [
            { name: "Termites", symptoms: "Yellowing plants, damaged roots.", prevention: "Seed treatment.", treatment: "Chlorpyriphos 20 EC @ 4ml/kg seed." }
          ],
          diseases: [],
          weeds: [{ name: "Broadleaf weeds", control: "Pre-emergence Pendimethalin application." }]
        },
        water: {
          activity: "Pre-sowing irrigation (Rauni)",
          criticality: "High",
          advice: "Ensure good soil moisture for germination."
        },
        practices: ["Seed treatment with fungicides.", "Line sowing preferred (22.5cm spacing)."]
      },
      {
        stage_name: "CRI Stage (Crown Root Initiation)",
        day_start: 20,
        day_end: 25,
        description: "Most critical stage for irrigation and tillering.",
        nutrients: { 
          n: 12.5, p: 0, k: 0,
          products: ["Urea (27kg)"],
          micronutrients: ["Zinc Sulphate (10kg/acre) if deficient"]
        },
        protection: {
          pests: [{ name: "Aphids", symptoms: "Sucking sap from leaves.", prevention: "Monitor fields.", treatment: "Imidacloprid spray if threshold crossed." }],
          diseases: [],
          weeds: [{ name: "Phalaris minor (Gulli Danda)", control: "Clodinafop-propargyl spray." }]
        },
        water: {
          activity: "First Irrigation",
          criticality: "High",
          advice: "Do not delay irrigation at this stage. Root development depends on it."
        },
        practices: ["Top dressing of Nitrogen.", "Weed control sprays."]
      },
      {
        stage_name: "Tillering / Jointing",
        day_start: 40,
        day_end: 50,
        description: "Stem elongation and active vegetative growth.",
        nutrients: { 
          n: 12.5, p: 0, k: 0,
          products: ["Urea (27kg)"]
        },
        protection: {
          pests: [],
          diseases: [{ name: "Yellow Rust", symptoms: "Yellow pustules on leaves.", prevention: "Resistant varieties.", treatment: "Propiconazole spray." }],
          weeds: []
        },
        water: {
          activity: "Second Irrigation",
          criticality: "Medium",
          advice: "Irrigate at late jointing stage."
        },
        practices: ["Monitor for Rust diseases."]
      },
      {
        stage_name: "Flowering / Milk Stage",
        day_start: 80,
        day_end: 95,
        description: "Grain formation starts.",
        nutrients: { 
          n: 0, p: 0, k: 0,
          products: ["0:0:50 (Potassium Sulphate) Spray"]
        },
        protection: {
          pests: [],
          diseases: [{ name: "Loose Smut", symptoms: "Black powdery mass replacing grains.", prevention: "Seed treatment.", treatment: "Remove infected plants." }],
          weeds: []
        },
        water: {
          activity: "Third/Fourth Irrigation",
          criticality: "High",
          advice: "Water stress here reduces grain size significantly. Avoid irrigation on windy days to prevent lodging."
        },
        practices: ["Roguing (removing off-types).", "Watch for armyworm."]
      }
    ]
  },
  "Rice": {
    crop_name: "Rice (Paddy)",
    scientific_name: "Oryza sativa",
    duration_days: 140,
    stages: [
      {
        stage_name: "Transplanting (Basal)",
        day_start: 0,
        day_end: 5,
        description: "Transplanting seedlings into puddled field.",
        nutrients: { 
          n: 15, p: 25, k: 15,
          products: ["DAP (55kg)", "MOP (25kg)", "Zinc Sulphate (10kg)"]
        },
        protection: {
          pests: [{ name: "Stem Borer", symptoms: "Dead heart.", prevention: "Clip seedling tips.", treatment: "Cartap hydrochloride." }],
          diseases: [{ name: "Blast", symptoms: "Spindle shaped lesions.", prevention: "Seed treatment.", treatment: "Tricyclazole." }],
          weeds: [{ name: "Grasses & Sedges", control: "Pre-emergence Butachlor." }]
        },
        water: {
          activity: "Flooding",
          criticality: "High",
          advice: "Maintain 2-3cm water level for weed suppression."
        },
        practices: ["Puddling.", "Gap filling within 7-10 days."]
      },
      {
        stage_name: "Active Tillering",
        day_start: 20,
        day_end: 30,
        description: "Maximum tiller production.",
        nutrients: { 
          n: 30, p: 0, k: 0,
          products: ["Urea (65kg)", "Neem Oil coating"]
        },
        protection: {
          pests: [{ name: "Leaf Folder", symptoms: "Folded leaves.", prevention: "Avoid excess N.", treatment: "Chlorantraniliprole." }],
          diseases: [{ name: "Sheath Blight", symptoms: "Snake skin lesions.", prevention: "Clean bunds.", treatment: "Hexaconazole." }],
          weeds: []
        },
        water: {
          activity: "Submergence",
          criticality: "Medium",
          advice: "Maintain saturation to shallow submergence."
        },
        practices: ["Top dressing.", "Drain water before urea application."]
      },
      {
        stage_name: "Panicle Initiation",
        day_start: 45,
        day_end: 55,
        description: "Reproductive phase starts.",
        nutrients: { 
          n: 15, p: 0, k: 10,
          products: ["Urea (33kg)", "MOP (15kg)"]
        },
        protection: {
          pests: [{ name: "Brown Plant Hopper (BPH)", symptoms: "Hopper burn.", prevention: "Alleyways.", treatment: "Pymetrozine." }],
          diseases: [{ name: "False Smut", symptoms: "Velvety orange balls.", prevention: "Avoid late N.", treatment: "Copper Hydroxide." }],
          weeds: []
        },
        water: {
          activity: "Flooding",
          criticality: "High",
          advice: "Do not let soil crack. Maintain 5cm water."
        },
        practices: ["Making 30cm pathways (Alleyways) for aeration.", "Monitor BPH."]
      }
    ]
  },
  "Cotton": {
    crop_name: "Cotton",
    scientific_name: "Gossypium hirsutum",
    duration_days: 160,
    stages: [
      {
        stage_name: "Sowing / Vegetative",
        day_start: 0,
        day_end: 30,
        description: "Early growth phase.",
        nutrients: { 
          n: 10, p: 30, k: 10,
          products: ["DAP", "MOP"]
        },
        protection: {
          pests: [{ name: "Sucking Pests (Jassids)", symptoms: "Leaf curling.", prevention: "Yellow sticky traps.", treatment: "Imidacloprid." }],
          diseases: [{ name: "Root Rot", symptoms: "Wilting.", prevention: "Seed treatment.", treatment: "Drenching with Carbendazim." }],
          weeds: [{ name: "Broadleaf", control: "Pendimethalin." }]
        },
        water: {
          activity: "Establishment",
          criticality: "Medium",
          advice: "Avoid waterlogging."
        },
        practices: ["Gap filling.", "Thinning (maintain 1 plant/hill)."]
      },
      {
        stage_name: "Square Formation",
        day_start: 45,
        day_end: 60,
        description: "Bud initiation.",
        nutrients: { 
          n: 25, p: 0, k: 7.5,
          products: ["Urea", "Magnesium Sulphate"]
        },
        protection: {
          pests: [{ name: "Bollworm", symptoms: "Bored squares.", prevention: "Pheromone traps.", treatment: "Profenofos." }],
          diseases: [{ name: "Leaf Spot", symptoms: "Brown spots.", prevention: "Clean cultivation.", treatment: "Mancozeb." }],
          weeds: []
        },
        water: {
          activity: "Vegetative Irrigation",
          criticality: "High",
          advice: "Moisture stress causes square dropping."
        },
        practices: ["Top dressing.", "Weeding."]
      },
      {
        stage_name: "Boll Development",
        day_start: 75,
        day_end: 100,
        description: "Peak resource demand.",
        nutrients: { 
          n: 25, p: 0, k: 7.5,
          products: ["Urea", "Water Soluble NPK"]
        },
        protection: {
          pests: [{ name: "Pink Bollworm", symptoms: "Rosette flowers.", prevention: "PBW Traps.", treatment: "Emamectin Benzoate." }],
          diseases: [],
          weeds: []
        },
        water: {
          activity: "Critical Irrigation",
          criticality: "High",
          advice: "Irrigate every 15-20 days depending on soil."
        },
        practices: ["Detopping (remove terminal bud) to encourage bolls."]
      }
    ]
  },
  "Sugarcane": {
      crop_name: "Sugarcane",
      scientific_name: "Saccharum officinarum",
      duration_days: 365,
      stages: [
        {
          stage_name: "Germination (0-45 Days)",
          day_start: 0,
          day_end: 45,
          description: "Establishment of setts.",
          nutrients: {
            n: 15, p: 30, k: 15,
            products: ["DAP", "MOP", "Urea"]
          },
          protection: {
            pests: [{ name: "Early Shoot Borer", symptoms: "Dead heart.", prevention: "Trash mulching.", treatment: "Chlorantraniliprole." }],
            diseases: [{ name: "Red Rot", symptoms: "Reddening of internal tissues.", prevention: "Healthy setts.", treatment: "Dip setts in fungicide." }],
            weeds: [{ name: "General Weeds", control: "Atrazine." }]
          },
          water: {
            activity: "Frequent Light Irrigation",
            criticality: "Medium",
            advice: "Keep soil moist for germination."
          },
          practices: ["Sett treatment.", "Trash mulching."]
        },
        {
          stage_name: "Formative (Tillering)",
          day_start: 45,
          day_end: 120,
          description: "Rapid canopy development.",
          nutrients: {
            n: 35, p: 0, k: 0,
            products: ["Urea"]
          },
          protection: {
            pests: [{ name: "Top Borer", symptoms: "Shot holes in leaves.", prevention: "Release Trichogramma.", treatment: "Carbofuran." }],
            diseases: [],
            weeds: []
          },
          water: {
            activity: "Regular Irrigation",
            criticality: "High",
            advice: "Interval of 10-12 days."
          },
          practices: ["Earthing up (Partial).", "Weeding."]
        }
      ]
  },
  "Maize": {
    crop_name: "Maize (Corn)",
    scientific_name: "Zea mays",
    duration_days: 110,
    stages: [
      {
        stage_name: "Basal / Seedling",
        day_start: 0,
        day_end: 15,
        description: "Seedling emergence and establishment.",
        nutrients: {
          n: 20, p: 24, k: 16,
          products: ["DAP (52kg)", "MOP (27kg)", "Urea (20kg)", "Zinc Sulphate (10kg)"]
        },
        protection: {
          pests: [{ name: "Stem Borer / Fall Armyworm", symptoms: "Papery windows on leaves.", prevention: "Seed treatment.", treatment: "Chlorantraniliprole 18.5 SC." }],
          diseases: [{ name: "Seed Rot", symptoms: "Poor germination.", prevention: "Fungicide seed treatment.", treatment: "Thiram." }],
          weeds: [{ name: "Broadleaf / Grasses", control: "Pre-emergence Atrazine." }]
        },
        water: {
          activity: "Life Saving Irrigation",
          criticality: "Medium",
          advice: "Ensure moisture for germination, but avoid waterlogging."
        },
        practices: ["Ridge and furrow sowing method.", "Weed free field."]
      },
      {
        stage_name: "Knee High (V8)",
        day_start: 30,
        day_end: 45,
        description: "Rapid vegetative growth.",
        nutrients: {
          n: 25, p: 0, k: 0,
          products: ["Urea (55kg)"]
        },
        protection: {
          pests: [{ name: "Fall Armyworm", symptoms: "Large ragged holes in whorl.", prevention: "Pheromone traps.", treatment: "Spinetoram or Emamectin Benzoate." }],
          diseases: [],
          weeds: []
        },
        water: {
          activity: "Vegetative Irrigation",
          criticality: "High",
          advice: "Moisture stress affects plant height and leaf area."
        },
        practices: ["Top dressing of Urea.", "Earthing up."]
      },
      {
        stage_name: "Tasseling / Silking",
        day_start: 55,
        day_end: 70,
        description: "Flowering and pollination.",
        nutrients: {
          n: 25, p: 0, k: 10,
          products: ["Urea (55kg)", "MOP (15kg)"]
        },
        protection: {
          pests: [],
          diseases: [{ name: "Leaf Blight", symptoms: "Long elliptical lesions.", prevention: "Resistant hybrids.", treatment: "Mancozeb." }],
          weeds: []
        },
        water: {
          activity: "Critical Irrigation",
          criticality: "High",
          advice: "Most critical stage. Water stress causes poor seed setting."
        },
        practices: ["Monitor for pollination issues.", "Avoid water stress."]
      }
    ]
  },
  "Groundnut": {
    crop_name: "Groundnut",
    scientific_name: "Arachis hypogaea",
    duration_days: 110,
    stages: [
      {
        stage_name: "Sowing / Vegetative",
        day_start: 0,
        day_end: 25,
        description: "Establishment and early growth.",
        nutrients: {
          n: 10, p: 24, k: 16,
          products: ["DAP", "MOP", "Gypsum (200kg/acre)"]
        },
        protection: {
          pests: [{ name: "Aphids/Thrips", symptoms: "Leaf curling.", prevention: "Seed treatment.", treatment: "Imidacloprid." }],
          diseases: [{ name: "Collar Rot", symptoms: "Seedling death.", prevention: "Seed treatment.", treatment: "Trichoderma viride." }],
          weeds: [{ name: "Weeds", control: "Pendimethalin." }]
        },
        water: {
          activity: "Presowing",
          criticality: "Medium",
          advice: "Moist soil for germination."
        },
        practices: ["Gypsum application is crucial.", "Seed treatment."]
      },
      {
        stage_name: "Flowering & Pegging",
        day_start: 35,
        day_end: 55,
        description: "Pegs enter soil to form pods.",
        nutrients: {
          n: 0, p: 0, k: 0,
          products: ["Gypsum (top dressing if split)", "Boron spray"]
        },
        protection: {
          pests: [{ name: "Leaf Miner", symptoms: "Mines in leaves.", prevention: "Light traps.", treatment: "Quinalphos." }],
          diseases: [{ name: "Tikka Disease (Leaf Spot)", symptoms: "Dark spots with yellow halo.", prevention: "Crop rotation.", treatment: "Chlorothalonil." }],
          weeds: []
        },
        water: {
          activity: "Critical Irrigation",
          criticality: "High",
          advice: "Soil must be loose and moist for peg penetration."
        },
        practices: ["Do NOT disturb soil after pegging starts.", "Apply Calcium (Gypsum)."]
      }
    ]
  },
  "Soybean": {
    crop_name: "Soybean",
    scientific_name: "Glycine max",
    duration_days: 100,
    stages: [
      {
        stage_name: "Sowing",
        day_start: 0,
        day_end: 20,
        description: "Emergence and establishment.",
        nutrients: {
          n: 12, p: 32, k: 16,
          products: ["DAP", "MOP", "Sulphur"]
        },
        protection: {
          pests: [{ name: "Stem Fly", symptoms: "Wilting seedlings.", prevention: "Seed treatment.", treatment: "Thiamethoxam." }],
          diseases: [],
          weeds: [{ name: "Weeds", control: "Imazethapyr (Post-emergence)." }]
        },
        water: {
          activity: "Germination",
          criticality: "Medium",
          advice: "Ensure moisture."
        },
        practices: ["Seed inoculation with Rhizobium culture."]
      },
      {
        stage_name: "Flowering / Pod Initiation",
        day_start: 40,
        day_end: 60,
        description: "Bloom and pod set.",
        nutrients: {
          n: 0, p: 0, k: 0,
          products: ["0:52:34 (Water Soluble) spray"]
        },
        protection: {
          pests: [{ name: "Tobacco Caterpillar", symptoms: "Defoliation.", prevention: "Bird perches.", treatment: "Profenofos." }],
          diseases: [{ name: "Rust", symptoms: "Brown pustules.", prevention: "Resistant variety.", treatment: "Hexaconazole." }],
          weeds: []
        },
        water: {
          activity: "Critical Irrigation",
          criticality: "High",
          advice: "Moisture stress causes flower drop."
        },
        practices: ["Install bird perches.", "Monitor for caterpillars."]
      }
    ]
  },
  "Bajra": {
    crop_name: "Bajra (Pearl Millet)",
    scientific_name: "Pennisetum glaucum",
    duration_days: 90,
    stages: [
      {
        stage_name: "Vegetative",
        day_start: 0,
        day_end: 25,
        description: "Tillering phase.",
        nutrients: {
          n: 20, p: 15, k: 0,
          products: ["Urea", "DAP"]
        },
        protection: {
          pests: [{ name: "Shoot Fly", symptoms: "Dead heart.", prevention: "Early sowing.", treatment: "Imidacloprid seed treatment." }],
          diseases: [{ name: "Downy Mildew", symptoms: "Chlorosis.", prevention: "Resistant variety.", treatment: "Metalaxyl." }],
          weeds: [{ name: "Weeds", control: "Atrazine." }]
        },
        water: {
          activity: "Light Irrigation",
          criticality: "Low",
          advice: "Drought tolerant, but irrigation boosts yield."
        },
        practices: ["Thinning to maintain population."]
      },
      {
        stage_name: "Panicle Initiation",
        day_start: 40,
        day_end: 55,
        description: "Earhead formation.",
        nutrients: {
          n: 20, p: 0, k: 0,
          products: ["Urea top dressing"]
        },
        protection: {
          pests: [],
          diseases: [{ name: "Ergot", symptoms: "Pinkish ooze.", prevention: "Clean seed.", treatment: "Remove infected ears." }],
          weeds: []
        },
        water: {
          activity: "Flowering Irrigation",
          criticality: "Medium",
          advice: "Irrigate if available for better grain filling."
        },
        practices: ["Top dressing of N."]
      }
    ]
  }
};
