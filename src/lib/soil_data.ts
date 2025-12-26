export interface SoilType {
  soil_id: string;
  soil_name: string;
  category: string;
  regions_in_india?: string[];
  texture?: string[];
  color?: string[];
  ph_range?: string;
  water_retention?: string;
  drainage?: string;
  nutrient_profile?: {
    nitrogen: string;
    phosphorus: string;
    potassium: string;
  };
  organic_matter?: string;
  fertility?: string;
  common_crops: string[];
  major_problems?: string[];
  management_practices: string[];
  suitable_seasons?: string[];
  salinity_risk?: string;
}

export const SOIL_MASTER_DATA: SoilType[] = [
  {
    "soil_id": "alluvial_soil",
    "soil_name": "Alluvial Soil",
    "category": "Primary",
    "regions_in_india": ["Punjab","Haryana","Uttar Pradesh","Bihar","West Bengal","Assam","Odisha","Andhra Pradesh"],
    "texture": ["Sandy Loam","Loam","Clay Loam"],
    "color": ["Light Grey","Ash Grey"],
    "ph_range": "6.5 - 8.0",
    "water_retention": "Medium",
    "drainage": "Good",
    "nutrient_profile": {
      "nitrogen": "Low",
      "phosphorus": "Medium",
      "potassium": "Medium"
    },
    "organic_matter": "Medium",
    "fertility": "High",
    "common_crops": ["Paddy","Wheat","Sugarcane","Maize","Pulses","Oilseeds"],
    "major_problems": ["Nitrogen deficiency"],
    "management_practices": [
      "Add organic manure",
      "Split nitrogen application"
    ],
    "suitable_seasons": ["Kharif","Rabi"]
  },
  {
    "soil_id": "black_soil",
    "soil_name": "Black Soil (Regur)",
    "category": "Primary",
    "regions_in_india": ["Maharashtra","Madhya Pradesh","Telangana","Karnataka","Gujarat"],
    "texture": ["Clayey"],
    "color": ["Deep Black","Dark Brown"],
    "ph_range": "7.5 - 8.5",
    "water_retention": "Very High",
    "drainage": "Poor",
    "nutrient_profile": {
      "nitrogen": "Low",
      "phosphorus": "Low",
      "potassium": "High"
    },
    "organic_matter": "Medium",
    "fertility": "High",
    "common_crops": ["Cotton","Soybean","Groundnut","Sorghum","Wheat"],
    "major_problems": ["Waterlogging","Soil cracking"],
    "management_practices": [
      "Avoid excess irrigation",
      "Use organic compost",
      "Deep ploughing before monsoon"
    ],
    "suitable_seasons": ["Kharif","Rabi"]
  },
  {
    "soil_id": "red_soil",
    "soil_name": "Red Soil",
    "category": "Primary",
    "regions_in_india": ["Tamil Nadu","Karnataka","Andhra Pradesh","Odisha","Chhattisgarh","Jharkhand"],
    "texture": ["Sandy","Loamy"],
    "color": ["Red","Reddish Brown"],
    "ph_range": "5.5 - 7.0",
    "water_retention": "Low",
    "drainage": "Good",
    "nutrient_profile": {
      "nitrogen": "Low",
      "phosphorus": "Low",
      "potassium": "Low"
    },
    "organic_matter": "Low",
    "fertility": "Low to Medium",
    "common_crops": ["Millets","Pulses","Groundnut","Cotton"],
    "major_problems": ["Low fertility"],
    "management_practices": [
      "Add farmyard manure",
      "Use balanced fertilizers"
    ],
    "suitable_seasons": ["Kharif"]
  },
  {
    "soil_id": "laterite_soil",
    "soil_name": "Laterite Soil",
    "category": "Primary",
    "regions_in_india": ["Kerala","Goa","Karnataka","Maharashtra","Assam","Meghalaya"],
    "texture": ["Coarse","Porous"],
    "color": ["Red","Brown"],
    "ph_range": "4.5 - 6.5",
    "water_retention": "Low",
    "drainage": "Very Good",
    "nutrient_profile": {
      "nitrogen": "Low",
      "phosphorus": "Low",
      "potassium": "Low"
    },
    "organic_matter": "Low",
    "fertility": "Low",
    "common_crops": ["Tea","Coffee","Cashew","Rubber"],
    "major_problems": ["Leaching of nutrients"],
    "management_practices": [
      "Mulching",
      "Organic matter enrichment"
    ],
    "suitable_seasons": ["Perennial Crops"]
  },
  {
    "soil_id": "arid_soil",
    "soil_name": "Arid / Desert Soil",
    "category": "Primary",
    "regions_in_india": ["Rajasthan","Gujarat"],
    "texture": ["Sandy"],
    "color": ["Light Brown","Yellow"],
    "ph_range": "7.0 - 8.5",
    "water_retention": "Very Low",
    "drainage": "Excessive",
    "nutrient_profile": {
      "nitrogen": "Very Low",
      "phosphorus": "Low",
      "potassium": "Low"
    },
    "organic_matter": "Very Low",
    "fertility": "Very Low",
    "common_crops": ["Bajra","Guar","Moong"],
    "major_problems": ["Moisture stress"],
    "management_practices": [
      "Drip irrigation",
      "Organic mulching"
    ],
    "suitable_seasons": ["Kharif"]
  },
  {
    "soil_id": "mountain_forest_soil",
    "soil_name": "Mountain / Forest Soil",
    "category": "Primary",
    "regions_in_india": ["Himachal Pradesh","Uttarakhand","Jammu & Kashmir","Sikkim"],
    "texture": ["Loamy","Silty"],
    "color": ["Brown","Dark Brown"],
    "ph_range": "5.0 - 6.5",
    "water_retention": "Medium",
    "drainage": "Good",
    "nutrient_profile": {
      "nitrogen": "Medium",
      "phosphorus": "Low",
      "potassium": "Medium"
    },
    "organic_matter": "High",
    "fertility": "Medium",
    "common_crops": ["Apple","Maize","Barley","Potato"],
    "major_problems": ["Soil erosion"],
    "management_practices": [
      "Terrace farming",
      "Contour ploughing"
    ],
    "suitable_seasons": ["Rabi","Kharif"]
  },
  {
    "soil_id": "saline_soil",
    "soil_name": "Saline Soil",
    "category": "Problematic",
    "regions_in_india": ["Gujarat","Rajasthan","Punjab","Haryana","Coastal Areas"],
    "texture": ["Clayey","Loamy"],
    "ph_range": "8.0 - 10.0",
    "water_retention": "Poor",
    "fertility": "Low",
    "common_crops": ["Barley","Salt-tolerant Paddy"],
    "major_problems": ["Salt accumulation"],
    "management_practices": [
      "Gypsum application",
      "Proper drainage"
    ]
  },
  {
    "soil_id": "alkaline_soil",
    "soil_name": "Alkaline Soil",
    "category": "Problematic",
    "regions_in_india": ["Uttar Pradesh","Punjab","Haryana"],
    "ph_range": "8.5+",
    "fertility": "Low",
    "common_crops": ["Rice","Wheat (with treatment)"],
    "management_practices": [
      "Add organic matter",
      "Use sulfur-based amendments"
    ]
  },
  {
    "soil_id": "peaty_marshy_soil",
    "soil_name": "Peaty & Marshy Soil",
    "category": "Problematic",
    "regions_in_india": ["Kerala","West Bengal","Odisha"],
    "texture": ["Clayey"],
    "organic_matter": "Very High",
    "water_retention": "Very High",
    "fertility": "Medium",
    "common_crops": ["Paddy","Jute"],
    "major_problems": ["Poor drainage"],
    "management_practices": [
      "Drainage channels",
      "Raised bed farming"
    ]
  },
  {
    "soil_id": "coastal_sandy_soil",
    "soil_name": "Coastal Sandy Soil",
    "category": "Problematic",
    "regions_in_india": ["Tamil Nadu Coast","Kerala Coast","Odisha Coast","Andhra Coast"],
    "texture": ["Sandy"],
    "water_retention": "Very Low",
    "fertility": "Low",
    "salinity_risk": "High",
    "common_crops": ["Coconut","Casuarina"],
    "management_practices": [
      "Organic compost",
      "Windbreaks"
    ]
  }
];
