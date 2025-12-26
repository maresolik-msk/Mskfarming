/**
 * INDIAN CROP INTELLIGENCE ENGINE
 * Soil-Wise Crop Cycle Database
 * 
 * This module contains the comprehensive crop cycle templates for all major Indian crops
 * across different soil types. Each crop cycle follows the universal 10-stage structure.
 * 
 * USAGE:
 * - Import CROP_CYCLES_DATABASE to access all crop cycles
 * - Use getCropCycle(soilId, cropId) to retrieve specific cycles
 * - Use getCropsBySoil(soilId) to get all suitable crops for a soil type
 */

import { CropCycle } from "./crop_cycles_types.ts";

/**
 * ========================================
 * ALLUVIAL SOIL CROP CYCLES
 * ========================================
 * Regions: Punjab, Haryana, UP, Bihar, West Bengal, Assam
 * Characteristics: High fertility, good drainage, medium water retention
 */

const ALLUVIAL_PADDY: CropCycle = {
  soil_id: "alluvial_soil",
  crop_id: "paddy",
  crop_name: "Paddy (Rice)",
  crop_cycle_duration_days: "110-150",
  stages: [
    {
      stage_id: 1,
      stage_name: "Land Preparation",
      duration_days: "15-20",
      soil_specific_notes: "Level field for uniform water retention; alluvial soil requires thorough puddling",
      key_actions: ["Deep ploughing", "Puddling (wet tillage)", "Levelling with laser leveller", "Bund strengthening"],
      risk_factors: ["Uneven water distribution", "Poor bund integrity"],
      ai_alerts: ["Ensure bund strength before transplanting", "Check field levelness - critical for water management"]
    },
    {
      stage_id: 2,
      stage_name: "Seed Selection & Treatment",
      duration_days: "3-5",
      soil_specific_notes: "Select varieties suited for alluvial regions; treat for fungal diseases common in waterlogged conditions",
      key_actions: ["Select certified seeds", "Seed treatment with Trichoderma", "Pre-germination soaking"],
      risk_factors: ["Seed-borne diseases", "Poor germination"],
      ai_alerts: ["Use locally adapted varieties like Pusa Basmati or Swarna"]
    },
    {
      stage_id: 3,
      stage_name: "Sowing / Planting",
      duration_days: "1-2",
      soil_specific_notes: "Transplanting preferred in alluvial soil; maintain 2-3 inches water depth",
      key_actions: ["Transplant 20-25 day old seedlings", "Spacing: 20x15 cm", "Maintain shallow water"],
      risk_factors: ["Transplanting shock", "Seedling mortality"],
      ai_alerts: ["Transplant in evening to reduce stress", "Ensure 2-3 seedlings per hill"]
    },
    {
      stage_id: 4,
      stage_name: "Germination & Establishment",
      duration_days: "7-10",
      soil_specific_notes: "High moisture in alluvial soil supports fast establishment; avoid deep water",
      key_actions: ["Maintain 2-3 cm water depth", "First weeding after 15 days", "Watch for early pests"],
      risk_factors: ["Seedling rot if water stagnates", "Weed competition"],
      ai_alerts: ["Avoid deep water in early stage - causes lodging", "Monitor for stem borer eggs"]
    },
    {
      stage_id: 5,
      stage_name: "Vegetative Growth",
      duration_days: "30-40",
      soil_specific_notes: "Nitrogen deficiency common in alluvial soil; split application recommended",
      key_actions: ["Apply nitrogen in splits (basal + top dressing)", "Increase water depth to 5-7 cm", "Second weeding"],
      risk_factors: ["Nitrogen leaching", "Bacterial leaf blight"],
      ai_alerts: ["Apply urea at tillering stage", "Watch for yellowing - sign of nitrogen deficiency"]
    },
    {
      stage_id: 6,
      stage_name: "Flowering",
      duration_days: "10-15",
      soil_specific_notes: "Critical water requirement; ensure no moisture stress in alluvial fields",
      key_actions: ["Maintain continuous water supply", "Monitor for blast disease", "Apply potassium if deficient"],
      risk_factors: ["Moisture stress reduces grain setting", "Blast disease in humid conditions"],
      ai_alerts: ["Do NOT drain field during flowering - critical stage", "Apply second dose of potash"]
    },
    {
      stage_id: 7,
      stage_name: "Fruiting / Grain Formation",
      duration_days: "25-30",
      soil_specific_notes: "Grain filling stage; maintain adequate soil moisture but avoid waterlogging",
      key_actions: ["Keep water at 3-5 cm", "Monitor for sheath blight", "Apply final nitrogen if needed"],
      risk_factors: ["Grain discoloration", "Lodging in high nitrogen"],
      ai_alerts: ["Reduce water gradually after milking stage", "Scout for brown plant hopper"]
    },
    {
      stage_id: 8,
      stage_name: "Maturity",
      duration_days: "7-10",
      soil_specific_notes: "Drain field 7-10 days before harvest to allow machinery access in alluvial soil",
      key_actions: ["Complete drainage", "Check grain moisture (20-22%)", "Prepare for harvest"],
      risk_factors: ["Delayed harvesting causes shattering", "Bird damage"],
      ai_alerts: ["Drain field when 80% grains turn golden", "Harvest when grain moisture is 20-22%"]
    },
    {
      stage_id: 9,
      stage_name: "Harvest",
      duration_days: "3-5",
      soil_specific_notes: "Use combine harvester in large alluvial fields; manual harvesting for small plots",
      key_actions: ["Mechanical/manual harvesting", "Threshing", "Sun drying to 12-14% moisture"],
      risk_factors: ["Grain shattering", "Rain damage"],
      ai_alerts: ["Harvest early morning to reduce shattering", "Complete harvest within 5 days of maturity"]
    },
    {
      stage_id: 10,
      stage_name: "Post-Harvest Soil Care",
      duration_days: "10-15",
      soil_specific_notes: "Incorporate rice stubble to improve organic matter in alluvial soil",
      key_actions: ["Stubble incorporation or removal", "Deep ploughing", "Green manure sowing (optional)"],
      risk_factors: ["Stubble burning (prohibited)", "Nutrient mining"],
      ai_alerts: ["Do NOT burn stubble - illegal and reduces soil health", "Consider wheat or pulses as next crop"]
    }
  ]
};

const ALLUVIAL_WHEAT: CropCycle = {
  soil_id: "alluvial_soil",
  crop_id: "wheat",
  crop_name: "Wheat",
  crop_cycle_duration_days: "120-150",
  stages: [
    {
      stage_id: 1,
      stage_name: "Land Preparation",
      duration_days: "10-15",
      soil_specific_notes: "Alluvial soil needs fine tilth for wheat; avoid over-compaction",
      key_actions: ["Ploughing after paddy harvest", "Harrowing 2-3 times", "Levelling", "Apply farmyard manure"],
      risk_factors: ["Soil compaction", "Poor drainage"],
      ai_alerts: ["Wait for optimal soil moisture before tillage", "Ensure fine seed bed - critical for germination"]
    },
    {
      stage_id: 2,
      stage_name: "Seed Selection & Treatment",
      duration_days: "2-3",
      soil_specific_notes: "Select high-yielding varieties adapted to alluvial plains",
      key_actions: ["Select certified seeds (HD-2967, PBW-343)", "Seed treatment with fungicide", "Seed rate: 100 kg/ha"],
      risk_factors: ["Seed-borne smut", "Poor quality seeds"],
      ai_alerts: ["Use disease-free certified seeds only", "Treat seeds with Vitavax or Raxil"]
    },
    {
      stage_id: 3,
      stage_name: "Sowing / Planting",
      duration_days: "1-2",
      soil_specific_notes: "Timely sowing (Nov 10-25) crucial in alluvial regions for optimal yield",
      key_actions: ["Drill sowing at 5-6 cm depth", "Row spacing: 20-23 cm", "Light irrigation after sowing"],
      risk_factors: ["Late sowing reduces yield", "Uneven germination"],
      ai_alerts: ["Sow by November 25 for best results", "Apply light irrigation if soil is dry"]
    },
    {
      stage_id: 4,
      stage_name: "Germination & Establishment",
      duration_days: "7-10",
      soil_specific_notes: "Good moisture retention in alluvial soil aids germination",
      key_actions: ["First irrigation at crown root initiation (21 DAS)", "Watch for termite attack", "Monitor germination percentage"],
      risk_factors: ["Germination failure", "Termite damage"],
      ai_alerts: ["Apply first irrigation at 21 days after sowing", "Check for termite attack in early stage"]
    },
    {
      stage_id: 5,
      stage_name: "Vegetative Growth",
      duration_days: "40-50",
      soil_specific_notes: "Apply nitrogen in splits to prevent leaching in alluvial soil",
      key_actions: ["Apply nitrogen at tillering (25 DAS)", "Second irrigation at tillering", "Weed control at 30 DAS"],
      risk_factors: ["Weed competition", "Aphid infestation"],
      ai_alerts: ["Apply 1/2 nitrogen at tillering stage", "Control broad-leaf weeds early"]
    },
    {
      stage_id: 6,
      stage_name: "Flowering",
      duration_days: "10-12",
      soil_specific_notes: "Critical irrigation needed; no moisture stress in alluvial fields",
      key_actions: ["Irrigation at flowering stage", "Monitor for rust diseases", "Apply final nitrogen top dressing"],
      risk_factors: ["Moisture stress affects grain setting", "Rust diseases in humid weather"],
      ai_alerts: ["Ensure irrigation at flowering - yield determining stage", "Scout for yellow/brown rust"]
    },
    {
      stage_id: 7,
      stage_name: "Fruiting / Grain Formation",
      duration_days: "25-30",
      soil_specific_notes: "Maintain soil moisture for grain filling in alluvial soil",
      key_actions: ["Irrigation at milk stage", "Irrigation at dough stage", "Monitor for aphids"],
      risk_factors: ["Grain shriveling due to moisture stress", "Aphid damage"],
      ai_alerts: ["Do not skip irrigation during grain filling", "Control aphids to prevent yield loss"]
    },
    {
      stage_id: 8,
      stage_name: "Maturity",
      duration_days: "7-10",
      soil_specific_notes: "Stop irrigation 10-12 days before harvest in alluvial soil",
      key_actions: ["Stop irrigation at hard dough stage", "Monitor grain hardening", "Prepare harvesting equipment"],
      risk_factors: ["Lodging if over-irrigated", "Delayed harvest"],
      ai_alerts: ["Stop irrigation when grains turn golden", "Harvest when grain moisture is 20-25%"]
    },
    {
      stage_id: 9,
      stage_name: "Harvest",
      duration_days: "3-5",
      soil_specific_notes: "Use combine harvester in large alluvial fields",
      key_actions: ["Mechanical/manual harvesting", "Threshing", "Sun drying to 12% moisture"],
      risk_factors: ["Grain shattering", "Rain damage"],
      ai_alerts: ["Harvest when peduncle turns yellow", "Complete harvest within 5 days"]
    },
    {
      stage_id: 10,
      stage_name: "Post-Harvest Soil Care",
      duration_days: "10-15",
      soil_specific_notes: "Prepare for summer crop or monsoon paddy in alluvial rotation",
      key_actions: ["Stubble management", "Deep summer ploughing", "Apply organic manure"],
      risk_factors: ["Stubble burning", "Nutrient depletion"],
      ai_alerts: ["Incorporate wheat straw into soil", "Plan for paddy or summer moong"]
    }
  ]
};

const ALLUVIAL_SUGARCANE: CropCycle = {
  soil_id: "alluvial_soil",
  crop_id: "sugarcane",
  crop_name: "Sugarcane",
  crop_cycle_duration_days: "300-365",
  stages: [
    {
      stage_id: 1,
      stage_name: "Land Preparation",
      duration_days: "20-30",
      soil_specific_notes: "Deep ploughing essential in alluvial soil for root penetration",
      key_actions: ["Deep ploughing up to 30-40 cm", "Harrowing", "Ridges and furrows formation", "Apply FYM 25 tonnes/ha"],
      risk_factors: ["Poor drainage", "Soil compaction"],
      ai_alerts: ["Ensure field is well-drained before planting", "Make ridges 75-90 cm apart"]
    },
    {
      stage_id: 2,
      stage_name: "Seed Selection & Treatment",
      duration_days: "5-7",
      soil_specific_notes: "Select disease-free setts; treat to prevent red rot and smut",
      key_actions: ["Select 8-10 month old healthy cane", "Cut 2-3 budded setts", "Treat setts with fungicide"],
      risk_factors: ["Red rot", "Smut disease"],
      ai_alerts: ["Use certified disease-free seed cane", "Treat setts with Carbendazim before planting"]
    },
    {
      stage_id: 3,
      stage_name: "Sowing / Planting",
      duration_days: "10-15",
      soil_specific_notes: "Plant in furrows in alluvial soil; ensure good soil-sett contact",
      key_actions: ["Plant setts in furrows", "End-to-end placement", "Cover with 5-7 cm soil", "Light irrigation"],
      risk_factors: ["Poor germination", "Sett rot"],
      ai_alerts: ["Plant during Feb-Mar (spring) or Oct-Nov (autumn)", "Apply light irrigation after planting"]
    },
    {
      stage_id: 4,
      stage_name: "Germination & Establishment",
      duration_days: "30-40",
      soil_specific_notes: "Alluvial soil supports good germination; maintain moisture",
      key_actions: ["Light frequent irrigation", "First earthing up after 45 days", "Gap filling if needed"],
      risk_factors: ["Termite attack", "Shoot borer"],
      ai_alerts: ["Monitor for early shoot borer attack", "Apply first irrigation at 7-10 days"]
    },
    {
      stage_id: 5,
      stage_name: "Vegetative Growth",
      duration_days: "120-150",
      soil_specific_notes: "Heavy nitrogen requirement; split application needed in alluvial soil",
      key_actions: ["Apply nitrogen in 3 splits", "Irrigation every 10-15 days", "Second and third earthing up", "Weed control"],
      risk_factors: ["Nitrogen leaching", "Weed competition", "Early shoot borer"],
      ai_alerts: ["Apply nitrogen at 30, 60, and 90 days", "Irrigate regularly during summer months"]
    },
    {
      stage_id: 6,
      stage_name: "Flowering",
      duration_days: "15-20",
      soil_specific_notes: "Flowering generally undesirable in sugarcane; indicates stress",
      key_actions: ["Maintain optimal irrigation", "Monitor for diseases", "Continue nutrient supply"],
      risk_factors: ["Flowering reduces sugar content", "Water stress"],
      ai_alerts: ["Prevent flowering by avoiding moisture stress", "If flowering occurs, harvest early"]
    },
    {
      stage_id: 7,
      stage_name: "Fruiting / Grain Formation",
      duration_days: "0",
      soil_specific_notes: "Not applicable - sugarcane is harvested for stem, not grain",
      key_actions: ["N/A"],
      risk_factors: [],
      ai_alerts: ["Focus on stem maturity, not fruiting"]
    },
    {
      stage_id: 8,
      stage_name: "Maturity",
      duration_days: "30-40",
      soil_specific_notes: "Stop irrigation 15-20 days before harvest for sugar accumulation",
      key_actions: ["Stop irrigation", "Stop nitrogen application", "Monitor sugar content (Brix)"],
      risk_factors: ["Lodging", "Red rot"],
      ai_alerts: ["Stop irrigation 15-20 days before harvest", "Harvest when Brix reaches 18-20%"]
    },
    {
      stage_id: 9,
      stage_name: "Harvest",
      duration_days: "15-30",
      soil_specific_notes: "Harvest close to ground level in alluvial fields for ratoon crop",
      key_actions: ["Cut cane close to ground", "Remove trash", "Transport to mill within 24 hours"],
      risk_factors: ["Post-harvest sucrose loss", "Delayed milling"],
      ai_alerts: ["Harvest at ground level for better ratoon", "Send to mill immediately to prevent sugar loss"]
    },
    {
      stage_id: 10,
      stage_name: "Post-Harvest Soil Care",
      duration_days: "15-20",
      soil_specific_notes: "Prepare for ratoon crop or rotate with legumes in alluvial soil",
      key_actions: ["Trash mulching for ratoon", "Apply fertilizer for ratoon", "Or deep ploughing for new crop"],
      risk_factors: ["Nutrient depletion", "Pest carryover"],
      ai_alerts: ["Consider ratoon crop if plant cane yielded well", "Or rotate with wheat/pulses"]
    }
  ]
};

const ALLUVIAL_MAIZE: CropCycle = {
  soil_id: "alluvial_soil",
  crop_id: "maize",
  crop_name: "Maize",
  crop_cycle_duration_days: "90-120",
  stages: [
    {
      stage_id: 1,
      stage_name: "Land Preparation",
      duration_days: "7-10",
      soil_specific_notes: "Alluvial soil requires fine tilth for maize; good drainage essential",
      key_actions: ["Ploughing and harrowing", "Levelling", "Apply FYM 10 tonnes/ha"],
      risk_factors: ["Waterlogging", "Soil compaction"],
      ai_alerts: ["Ensure good drainage - maize sensitive to waterlogging"]
    },
    {
      stage_id: 2,
      stage_name: "Seed Selection & Treatment",
      duration_days: "1-2",
      soil_specific_notes: "Select hybrids suited for alluvial regions",
      key_actions: ["Select certified hybrid seeds", "Seed treatment with insecticide/fungicide", "Seed rate: 20-25 kg/ha"],
      risk_factors: ["Seed-borne diseases", "Termite attack"],
      ai_alerts: ["Use locally adapted hybrids", "Treat seeds with Imidacloprid for termite protection"]
    },
    {
      stage_id: 3,
      stage_name: "Sowing / Planting",
      duration_days: "1-2",
      soil_specific_notes: "Optimal sowing time varies by season in alluvial regions",
      key_actions: ["Drill sowing at 5 cm depth", "Row spacing: 60 cm, plant spacing: 20 cm", "Light irrigation if soil is dry"],
      risk_factors: ["Uneven germination", "Bird damage"],
      ai_alerts: ["Sow Kharif maize in June-July, Rabi in October-November"]
    },
    {
      stage_id: 4,
      stage_name: "Germination & Establishment",
      duration_days: "7-10",
      soil_specific_notes: "Good moisture in alluvial soil ensures uniform germination",
      key_actions: ["First irrigation at 10-12 DAS if needed", "Gap filling if required", "Watch for cutworm"],
      risk_factors: ["Cutworm damage", "Poor germination"],
      ai_alerts: ["Protect young plants from cutworm and termite"]
    },
    {
      stage_id: 5,
      stage_name: "Vegetative Growth",
      duration_days: "30-40",
      soil_specific_notes: "Apply nitrogen in splits to match crop uptake in alluvial soil",
      key_actions: ["Apply nitrogen at knee-high stage", "Irrigation at critical stages", "Weeding and earthing up"],
      risk_factors: ["Stem borer", "Weed competition"],
      ai_alerts: ["Apply nitrogen when plant is knee-high (25-30 DAS)", "Control stem borer early"]
    },
    {
      stage_id: 6,
      stage_name: "Flowering",
      duration_days: "10-15",
      soil_specific_notes: "Critical water requirement; ensure no moisture stress",
      key_actions: ["Irrigation at tasseling stage", "Irrigation at silking stage", "Monitor for fall armyworm"],
      risk_factors: ["Moisture stress reduces grain setting", "Fall armyworm"],
      ai_alerts: ["Do NOT skip irrigation during tasseling and silking", "Scout for fall armyworm regularly"]
    },
    {
      stage_id: 7,
      stage_name: "Fruiting / Grain Formation",
      duration_days: "20-30",
      soil_specific_notes: "Maintain soil moisture for grain filling",
      key_actions: ["Irrigation at grain filling stage", "Monitor for diseases", "Watch for lodging"],
      risk_factors: ["Grain filling affected by water stress", "Lodging in high winds"],
      ai_alerts: ["Support plants if lodging risk is high", "Maintain adequate moisture"]
    },
    {
      stage_id: 8,
      stage_name: "Maturity",
      duration_days: "10-15",
      soil_specific_notes: "Grains harden; stop irrigation 7-10 days before harvest",
      key_actions: ["Stop irrigation", "Monitor grain moisture", "Check for black layer formation"],
      risk_factors: ["Bird damage", "Rat damage"],
      ai_alerts: ["Harvest when black layer forms at kernel base", "Protect from birds and rats"]
    },
    {
      stage_id: 9,
      stage_name: "Harvest",
      duration_days: "3-5",
      soil_specific_notes: "Mechanical or manual harvesting based on scale",
      key_actions: ["Harvest when grain moisture is 20-25%", "Shelling and drying", "Sun dry to 12-14% moisture"],
      risk_factors: ["Grain spoilage", "Mycotoxin contamination"],
      ai_alerts: ["Dry grains properly before storage", "Store at 12-14% moisture to prevent fungal growth"]
    },
    {
      stage_id: 10,
      stage_name: "Post-Harvest Soil Care",
      duration_days: "7-10",
      soil_specific_notes: "Incorporate maize stubble to improve soil organic matter",
      key_actions: ["Stubble incorporation", "Ploughing", "Plan next crop (wheat/pulses)"],
      risk_factors: ["Nutrient mining", "Pest carryover"],
      ai_alerts: ["Rotate with legumes to restore nitrogen", "Incorporate crop residue into soil"]
    }
  ]
};

/**
 * ========================================
 * BLACK SOIL (REGUR) CROP CYCLES
 * ========================================
 * Regions: Maharashtra, Madhya Pradesh, Telangana, Karnataka, Gujarat
 * Characteristics: High clay content, high water retention, poor drainage, prone to cracking
 */

const BLACK_COTTON: CropCycle = {
  soil_id: "black_soil",
  crop_id: "cotton",
  crop_name: "Cotton",
  crop_cycle_duration_days: "160-180",
  stages: [
    {
      stage_id: 1,
      stage_name: "Land Preparation",
      duration_days: "15-20",
      soil_specific_notes: "Deep ploughing reduces cracking tendency of black soil; essential for cotton root development",
      key_actions: ["Deep ploughing up to 20-25 cm", "Apply FYM 10 tonnes/ha", "Form ridges and furrows", "Ensure proper drainage"],
      risk_factors: ["Waterlogging in monsoon", "Soil cracking in dry periods"],
      ai_alerts: ["Ensure proper drainage before sowing - black soil retains too much water", "Deep plough to reduce cracking"]
    },
    {
      stage_id: 2,
      stage_name: "Seed Selection & Treatment",
      duration_days: "2-3",
      soil_specific_notes: "Select Bt cotton varieties adapted to black soil regions",
      key_actions: ["Select certified Bt cotton seeds", "Delinting if fuzzy seeds", "Seed treatment with fungicide and insecticide"],
      risk_factors: ["Seed-borne diseases", "Early season pests"],
      ai_alerts: ["Use Bt cotton for bollworm resistance", "Treat seeds with Imidacloprid and Carbendazim"]
    },
    {
      stage_id: 3,
      stage_name: "Sowing / Planting",
      duration_days: "3-5",
      soil_specific_notes: "Sow on ridges in black soil to prevent waterlogging; timing critical",
      key_actions: ["Sow on ridges at 5-6 cm depth", "Spacing: 90 cm x 60 cm (Bt cotton)", "Light irrigation after sowing"],
      risk_factors: ["Waterlogging if sown in furrows", "Delayed germination"],
      ai_alerts: ["Sow in June with onset of monsoon", "Always sow on ridges, never in furrows"]
    },
    {
      stage_id: 4,
      stage_name: "Germination & Establishment",
      duration_days: "10-15",
      soil_specific_notes: "Black soil retains moisture well; avoid over-irrigation",
      key_actions: ["Thinning to 1-2 plants per hill", "Gap filling within 10 days", "Watch for sucking pests"],
      risk_factors: ["Damping off disease", "Jassids and thrips attack"],
      ai_alerts: ["Thin to single plant per hill at 15 DAS", "Control jassids early to prevent leaf curl"]
    },
    {
      stage_id: 5,
      stage_name: "Vegetative Growth",
      duration_days: "50-60",
      soil_specific_notes: "Black soil has high potassium but low nitrogen; adjust fertilization",
      key_actions: ["Apply nitrogen in splits", "Top dressing at 30 and 60 DAS", "Irrigation every 15-20 days", "Weeding and intercultivation"],
      risk_factors: ["Nitrogen deficiency", "Weed competition", "Whitefly attack"],
      ai_alerts: ["Apply nitrogen regularly - black soil is deficient", "Control whitefly to prevent leaf curl virus"]
    },
    {
      stage_id: 6,
      stage_name: "Flowering",
      duration_days: "30-40",
      soil_specific_notes: "Critical stage; black soil should have adequate moisture but not waterlogged",
      key_actions: ["Regular irrigation at 7-10 day intervals", "Monitor for pink bollworm", "Apply potash if deficient"],
      risk_factors: ["Flower drop due to stress", "Pest attack on squares"],
      ai_alerts: ["Maintain consistent soil moisture - critical for boll setting", "Scout for bollworm damage on squares"]
    },
    {
      stage_id: 7,
      stage_name: "Fruiting / Boll Formation",
      duration_days: "30-40",
      soil_specific_notes: "Potassium demand highest in black soil during boll formation; supplement if needed",
      key_actions: ["Apply potash (muriate of potash)", "Irrigation at boll formation", "Monitor for boll shedding"],
      risk_factors: ["Boll shedding due to moisture stress", "Boll rot in excess moisture"],
      ai_alerts: ["Avoid moisture stress - causes massive boll shedding", "Apply extra potassium - black soil may need it"]
    },
    {
      stage_id: 8,
      stage_name: "Maturity",
      duration_days: "15-20",
      soil_specific_notes: "Stop irrigation to allow bolls to mature and open in black soil",
      key_actions: ["Stop irrigation 20-25 days before harvest", "Monitor boll opening", "Watch for pink bollworm"],
      risk_factors: ["Delayed opening in humid conditions", "Pink bollworm in mature bolls"],
      ai_alerts: ["Stop irrigation when bolls start opening", "Scout for pink bollworm larvae in bolls"]
    },
    {
      stage_id: 9,
      stage_name: "Harvest",
      duration_days: "30-40",
      soil_specific_notes: "Multiple pickings needed; black soil may restrict field access after rains",
      key_actions: ["First picking when 50% bolls open", "Subsequent pickings at 15-day intervals", "Pick in dry conditions"],
      risk_factors: ["Cotton staining in rain", "Quality degradation"],
      ai_alerts: ["Complete picking before monsoon rains", "Store cotton in dry place immediately"]
    },
    {
      stage_id: 10,
      stage_name: "Post-Harvest Soil Care",
      duration_days: "15-20",
      soil_specific_notes: "Deep ploughing helps break cotton root carryover and reduces pest buildup in black soil",
      key_actions: ["Uproot and destroy cotton stalks", "Deep summer ploughing", "Apply organic manure"],
      risk_factors: ["Pink bollworm carryover", "Soil nutrient depletion"],
      ai_alerts: ["Mandatory: Destroy cotton stalks before May 31", "Deep plough to expose pests to heat"]
    }
  ]
};

const BLACK_SOYBEAN: CropCycle = {
  soil_id: "black_soil",
  crop_id: "soybean",
  crop_name: "Soybean",
  crop_cycle_duration_days: "90-120",
  stages: [
    {
      stage_id: 1,
      stage_name: "Land Preparation",
      duration_days: "10-15",
      soil_specific_notes: "Minimum tillage preferred in black soil; avoid over-compaction",
      key_actions: ["One deep ploughing", "1-2 harrowings", "Levelling", "Form ridges and furrows"],
      risk_factors: ["Soil compaction", "Poor drainage"],
      ai_alerts: ["Avoid excessive tillage in black soil", "Ensure drainage channels are ready"]
    },
    {
      stage_id: 2,
      stage_name: "Seed Selection & Treatment",
      duration_days: "1-2",
      soil_specific_notes: "Select varieties adapted to black soil regions of Central India",
      key_actions: ["Select certified seeds (JS-335, JS-95-60)", "Seed treatment with Rhizobium", "Seed treatment with fungicide"],
      risk_factors: ["Poor nodulation", "Seed rot"],
      ai_alerts: ["MUST treat with Rhizobium for nitrogen fixation", "Use fungicide to prevent seed rot in black soil"]
    },
    {
      stage_id: 3,
      stage_name: "Sowing / Planting",
      duration_days: "2-3",
      soil_specific_notes: "Sow with onset of monsoon in black soil; moisture conservation critical",
      key_actions: ["Sow at 3-4 cm depth", "Spacing: 45 cm x 5 cm", "Seed rate: 75-80 kg/ha"],
      risk_factors: ["Delayed germination if sown too deep", "Waterlogging"],
      ai_alerts: ["Sow in last week of June with adequate rainfall", "Do not sow too deep - black soil retains moisture"]
    },
    {
      stage_id: 4,
      stage_name: "Germination & Establishment",
      duration_days: "7-10",
      soil_specific_notes: "Black soil moisture retention aids germination; avoid excess water",
      key_actions: ["Gap filling if needed", "First weeding at 20 DAS", "Watch for damping off"],
      risk_factors: ["Damping off in waterlogged patches", "Stem fly attack"],
      ai_alerts: ["Check for waterlogging and drain excess water", "Control stem fly at early stage"]
    },
    {
      stage_id: 5,
      stage_name: "Vegetative Growth",
      duration_days: "25-35",
      soil_specific_notes: "Nitrogen fixation begins; black soil provides good potassium",
      key_actions: ["Intercultivation at 25-30 DAS", "Check nodulation status", "Control weeds"],
      risk_factors: ["Weed competition", "Defoliators"],
      ai_alerts: ["Ensure nodules are pink inside - sign of active N-fixation", "Control leaf-eating caterpillars"]
    },
    {
      stage_id: 6,
      stage_name: "Flowering",
      duration_days: "15-20",
      soil_specific_notes: "Critical stage; ensure adequate moisture in black soil",
      key_actions: ["Irrigation if dry spell during flowering", "Monitor for pod borer", "Apply potash if deficient"],
      risk_factors: ["Flower drop due to moisture stress", "Pod borer attack"],
      ai_alerts: ["Provide irrigation if no rain for 10 days during flowering", "Scout for Helicoverpa pod borers"]
    },
    {
      stage_id: 7,
      stage_name: "Fruiting / Grain Formation",
      duration_days: "20-30",
      soil_specific_notes: "Pod filling stage; black soil moisture usually adequate",
      key_actions: ["Maintain soil moisture", "Control pod-sucking bugs", "Monitor for pod shattering varieties"],
      risk_factors: ["Pod shattering", "Chaffy pods"],
      ai_alerts: ["Ensure moisture during pod filling for good seed size", "Control stink bugs"]
    },
    {
      stage_id: 8,
      stage_name: "Maturity",
      duration_days: "10-15",
      soil_specific_notes: "Harvest timing critical; black soil may delay field drying",
      key_actions: ["Monitor pod maturity (brown color)", "Check seed moisture", "Prepare for harvest"],
      risk_factors: ["Pod shattering if over-mature", "Delayed harvest due to wet soil"],
      ai_alerts: ["Harvest when 95% pods turn brown", "Ensure field is trafficable in black soil"]
    },
    {
      stage_id: 9,
      stage_name: "Harvest",
      duration_days: "3-5",
      soil_specific_notes: "Mechanical harvesting challenging in black soil after rains",
      key_actions: ["Harvest at 12-14% seed moisture", "Threshing", "Drying to 10% moisture"],
      risk_factors: ["Seed shattering", "Quality deterioration"],
      ai_alerts: ["Harvest early morning to reduce shattering", "Dry seeds immediately after harvest"]
    },
    {
      stage_id: 10,
      stage_name: "Post-Harvest Soil Care",
      duration_days: "10-15",
      soil_specific_notes: "Soybean residue enriches black soil with nitrogen; incorporate into soil",
      key_actions: ["Incorporate soybean stubble", "Deep ploughing", "Plan rabi crop (wheat/chickpea)"],
      risk_factors: ["Nutrient mining if residue removed", "Pest carryover"],
      ai_alerts: ["Incorporate residue - soybean adds nitrogen to black soil", "Follow with rabi wheat or chickpea"]
    }
  ]
};

/**
 * ========================================
 * RED SOIL CROP CYCLES
 * ========================================
 * Regions: Tamil Nadu, Karnataka, Andhra Pradesh, Odisha
 * Characteristics: Low fertility, low water retention, acidic pH, porous
 */

const RED_GROUNDNUT: CropCycle = {
  soil_id: "red_soil",
  crop_id: "groundnut",
  crop_name: "Groundnut",
  crop_cycle_duration_days: "100-120",
  stages: [
    {
      stage_id: 1,
      stage_name: "Land Preparation",
      duration_days: "10-15",
      soil_specific_notes: "Red soil needs deep ploughing for peg penetration; improve fertility with organics",
      key_actions: ["Deep ploughing 20-25 cm", "Harrowing", "Apply FYM 12 tonnes/ha", "Apply lime if pH <6.0"],
      risk_factors: ["Low soil fertility", "Hard soil crust formation"],
      ai_alerts: ["Add organic manure - red soil has low fertility", "Apply lime if soil is acidic"]
    },
    {
      stage_id: 2,
      stage_name: "Seed Selection & Treatment",
      duration_days: "1-2",
      soil_specific_notes: "Select varieties suited for red soil regions",
      key_actions: ["Select certified seeds (TMV-2, K-6)", "Seed treatment with Rhizobium + PSB", "Seed treatment with fungicide"],
      risk_factors: ["Seed-borne diseases", "Poor nodulation"],
      ai_alerts: ["MUST treat with Rhizobium for nitrogen fixation", "Use thiram or carbendazim for seed treatment"]
    },
    {
      stage_id: 3,
      stage_name: "Sowing / Planting",
      duration_days: "2-3",
      soil_specific_notes: "Sow at optimal depth in red soil; too deep reduces emergence",
      key_actions: ["Sow at 5-6 cm depth", "Spacing: 30 cm x 10 cm", "Seed rate: 100-125 kg/ha"],
      risk_factors: ["Uneven germination", "Termite attack"],
      ai_alerts: ["Sow in June-July (Kharif) or January-February (summer)", "Protect seeds from termites"]
    },
    {
      stage_id: 4,
      stage_name: "Germination & Establishment",
      duration_days: "7-10",
      soil_specific_notes: "Red soil may crust after rain; light irrigation helps emergence",
      key_actions: ["Light irrigation if soil crusts", "Gap filling within 10 days", "First weeding"],
      risk_factors: ["Soil crusting", "Damping off"],
      ai_alerts: ["Break soil crust gently if formed", "Watch for early leaf spot disease"]
    },
    {
      stage_id: 5,
      stage_name: "Vegetative Growth",
      duration_days: "25-35",
      soil_specific_notes: "Low nutrient status of red soil requires balanced fertilization",
      key_actions: ["Apply gypsum 400-500 kg/ha at 30 DAS", "Irrigation every 7-10 days", "Weeding and intercultivation"],
      risk_factors: ["Leaf spot diseases", "Aphid infestation"],
      ai_alerts: ["MUST apply gypsum - improves pod filling in red soil", "Control early and late leaf spot"]
    },
    {
      stage_id: 6,
      stage_name: "Flowering",
      duration_days: "15-20",
      soil_specific_notes: "Peg penetration requires loose red soil; ensure soil remains friable",
      key_actions: ["Light earthing up before flowering", "Regular irrigation", "Monitor for thrips"],
      risk_factors: ["Hard soil crust prevents peg entry", "Thrips damage"],
      ai_alerts: ["Ensure soil remains loose - critical for peg penetration", "Light earthing up helps peg entry"]
    },
    {
      stage_id: 7,
      stage_name: "Fruiting / Grain Formation",
      duration_days: "25-30",
      soil_specific_notes: "Pod development stage; maintain soil moisture in red soil",
      key_actions: ["Regular irrigation every 7-10 days", "Avoid waterlogging", "Monitor for pod rot"],
      risk_factors: ["Pod rot in heavy rainfall", "Dry pod formation if moisture stress"],
      ai_alerts: ["Maintain consistent moisture for good pod filling", "Calcium from gypsum essential for pod development"]
    },
    {
      stage_id: 8,
      stage_name: "Maturity",
      duration_days: "10-15",
      soil_specific_notes: "Stop irrigation 7-10 days before harvest to ease digging in red soil",
      key_actions: ["Stop irrigation", "Check pod maturity (inner shell darkening)", "Prepare for harvest"],
      risk_factors: ["Over-maturity causes seed dormancy", "Delayed harvest"],
      ai_alerts: ["Harvest when inner shell shows brown/black veining", "Red soil facilitates easy pod recovery"]
    },
    {
      stage_id: 9,
      stage_name: "Harvest",
      duration_days: "5-7",
      soil_specific_notes: "Manual or mechanical digging in red soil relatively easy",
      key_actions: ["Dig plants carefully", "Shake off excess soil", "Pod stripping", "Sun drying"],
      risk_factors: ["Pod breakage", "Aflatoxin if moisture is high"],
      ai_alerts: ["Dry pods to 8-10% moisture before storage", "Proper drying prevents aflatoxin contamination"]
    },
    {
      stage_id: 10,
      stage_name: "Post-Harvest Soil Care",
      duration_days: "7-10",
      soil_specific_notes: "Incorporate groundnut haulm to enrich low-fertility red soil",
      key_actions: ["Incorporate groundnut haulm", "Ploughing", "Apply organic manure"],
      risk_factors: ["Nutrient depletion", "Soil degradation"],
      ai_alerts: ["Groundnut haulm is valuable - incorporate into soil", "Rotate with cereals to restore balance"]
    }
  ]
};

/**
 * ========================================
 * ARID/DESERT SOIL CROP CYCLES
 * ========================================
 * Regions: Rajasthan, Gujarat (arid zones)
 * Characteristics: Very low fertility, sandy texture, poor water retention
 */

const ARID_BAJRA: CropCycle = {
  soil_id: "arid_soil",
  crop_id: "bajra",
  crop_name: "Bajra (Pearl Millet)",
  crop_cycle_duration_days: "75-95",
  stages: [
    {
      stage_id: 1,
      stage_name: "Land Preparation",
      duration_days: "5-7",
      soil_specific_notes: "Minimal tillage in arid soil to conserve moisture; avoid dust mulch formation",
      key_actions: ["One deep ploughing", "Harrowing", "Apply FYM if available (5 tonnes/ha)"],
      risk_factors: ["Moisture loss due to excessive tillage", "Wind erosion"],
      ai_alerts: ["Minimize tillage to conserve moisture in arid soil", "Complete land prep just before sowing"]
    },
    {
      stage_id: 2,
      stage_name: "Seed Selection & Treatment",
      duration_days: "1",
      soil_specific_notes: "Select drought-tolerant varieties adapted to arid regions",
      key_actions: ["Select certified hybrid seeds", "Seed treatment with fungicide", "Seed rate: 4-5 kg/ha (hybrid)"],
      risk_factors: ["Seed-borne diseases", "Poor germination"],
      ai_alerts: ["Use drought-tolerant hybrids like GHB-538, GHB-744", "Treat seeds with thiram"]
    },
    {
      stage_id: 3,
      stage_name: "Sowing / Planting",
      duration_days: "1-2",
      soil_specific_notes: "Sow with first monsoon showers in arid soil; timing is critical",
      key_actions: ["Sow at 3-4 cm depth", "Spacing: 45 cm x 12 cm", "Light irrigation if available"],
      risk_factors: ["Germination failure if insufficient moisture", "Wind damage to seedlings"],
      ai_alerts: ["Sow immediately after first monsoon rain", "Shallow sowing - arid soil dries quickly"]
    },
    {
      stage_id: 4,
      stage_name: "Germination & Establishment",
      duration_days: "5-7",
      soil_specific_notes: "Arid soil dries quickly; ensure adequate moisture for establishment",
      key_actions: ["Thinning to 1-2 plants per hill", "Light irrigation if dry spell", "Gap filling if needed"],
      risk_factors: ["Seedling mortality due to moisture stress", "Shoot fly attack"],
      ai_alerts: ["Protect seedlings from moisture stress", "Control shoot fly early"]
    },
    {
      stage_id: 5,
      stage_name: "Vegetative Growth",
      duration_days: "25-35",
      soil_specific_notes: "Very low nitrogen in arid soil; apply fertilizer in splits",
      key_actions: ["Apply nitrogen at 20-25 DAS", "Irrigation at critical stages if available", "Weeding"],
      risk_factors: ["Nitrogen deficiency", "Moisture stress"],
      ai_alerts: ["Apply urea even in rainfed - arid soil has very low N", "One irrigation at tillering boosts yield significantly"]
    },
    {
      stage_id: 6,
      stage_name: "Flowering",
      duration_days: "7-10",
      soil_specific_notes: "Critical water requirement; irrigation highly beneficial if available",
      key_actions: ["Irrigation at flowering if possible", "Monitor for downy mildew"],
      risk_factors: ["Moisture stress reduces grain setting", "Downy mildew"],
      ai_alerts: ["Flowering stage most sensitive to drought", "One irrigation at flowering critical for yield"]
    },
    {
      stage_id: 7,
      stage_name: "Fruiting / Grain Formation",
      duration_days: "15-20",
      soil_specific_notes: "Grain filling in arid soil depends on moisture availability",
      key_actions: ["Irrigation at grain filling if available", "Monitor for grain mold", "Watch for bird damage"],
      risk_factors: ["Shriveled grains due to drought", "Bird damage to ripening grains"],
      ai_alerts: ["Protect from birds as grains ripen", "Moisture at grain filling determines grain size"]
    },
    {
      stage_id: 8,
      stage_name: "Maturity",
      duration_days: "7-10",
      soil_specific_notes: "Grains mature quickly in arid conditions",
      key_actions: ["Monitor grain hardening", "Prepare for harvest", "Bird scaring"],
      risk_factors: ["Bird damage", "Grain shattering"],
      ai_alerts: ["Harvest when grains are hard and dry", "Protect from bird flocks"]
    },
    {
      stage_id: 9,
      stage_name: "Harvest",
      duration_days: "3-5",
      soil_specific_notes: "Manual or mechanical harvesting based on scale",
      key_actions: ["Cut earheads", "Threshing", "Sun drying"],
      risk_factors: ["Grain shattering", "Quality deterioration"],
      ai_alerts: ["Harvest early morning to reduce shattering", "Dry to 12% moisture for safe storage"]
    },
    {
      stage_id: 10,
      stage_name: "Post-Harvest Soil Care",
      duration_days: "5-7",
      soil_specific_notes: "Incorporate bajra stubble to add organic matter to arid soil",
      key_actions: ["Stubble incorporation or grazing", "Mulching if possible", "Plan next crop"],
      risk_factors: ["Organic matter depletion", "Soil degradation"],
      ai_alerts: ["Incorporate residue - arid soil desperately needs organic matter", "Consider legumes in rotation"]
    }
  ]
};

// Export all crop cycles as a database
export const CROP_CYCLES_DATABASE: CropCycle[] = [
  ALLUVIAL_PADDY,
  ALLUVIAL_WHEAT,
  ALLUVIAL_SUGARCANE,
  ALLUVIAL_MAIZE,
  BLACK_COTTON,
  BLACK_SOYBEAN,
  RED_GROUNDNUT,
  ARID_BAJRA,
  // More crops can be added here following the same pattern
];

/**
 * Helper function to get crop cycle by soil and crop ID
 */
export function getCropCycle(soilId: string, cropId: string): CropCycle | undefined {
  return CROP_CYCLES_DATABASE.find(
    cycle => cycle.soil_id === soilId && cycle.crop_id === cropId
  );
}

/**
 * Helper function to get all crops suitable for a soil type
 */
export function getCropsBySoil(soilId: string): CropCycle[] {
  return CROP_CYCLES_DATABASE.filter(cycle => cycle.soil_id === soilId);
}

/**
 * Helper function to get all soil types suitable for a crop
 */
export function getSoilsByCrop(cropId: string): CropCycle[] {
  return CROP_CYCLES_DATABASE.filter(cycle => cycle.crop_id === cropId);
}

/**
 * Helper function to get stage-specific information
 */
export function getCropStage(
  soilId: string,
  cropId: string,
  stageId: number
): any | undefined {
  const cycle = getCropCycle(soilId, cropId);
  if (!cycle) return undefined;
  return cycle.stages.find(stage => stage.stage_id === stageId);
}

// ==========================================
// CROP TIMELINE CALCULATION LOGIC
// ==========================================

// Helper to parse "10-15" to 12.5
function parseDurationAvg(duration: string): number {
  if (!duration.includes('-')) return parseFloat(duration);
  const [min, max] = duration.split('-').map(Number);
  return (min + max) / 2;
}

export function calculateCropTimeline(sowingDate: Date, stages: any[]) {
  const timeline = [];
  
  // Align "Sowing / Planting" (usually Stage 3) to Day 0 (sowingDate)
  // Find Sowing stage index
  const sowingIndex = stages.findIndex(s => 
    s.stage_name.toLowerCase().includes("sowing") || 
    s.stage_name.toLowerCase().includes("planting")
  );
  
  // Calculate start date offset (pre-sowing stages go backwards from sowing date)
  let currentDate = new Date(sowingDate);
  
  if (sowingIndex > 0) {
    // Calculate duration of all pre-sowing stages
    let preSowingDuration = 0;
    for (let i = 0; i < sowingIndex; i++) {
      preSowingDuration += parseDurationAvg(stages[i].duration_days);
    }
    // Shift start date back so that sowing happens on sowingDate
    // We treat duration as whole days
    currentDate.setDate(currentDate.getDate() - Math.ceil(preSowingDuration));
  }

  for (const stage of stages) {
    const duration = Math.ceil(parseDurationAvg(stage.duration_days));
    const startDate = new Date(currentDate);
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + duration - 1);
    
    timeline.push({
      stage_id: stage.stage_id,
      stage_name: stage.stage_name,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      duration_days: duration,
      stage_data: stage // Include full stage data for details
    });
    
    // Next stage starts day after this stage ends
    currentDate = new Date(endDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return timeline;
}

export function getCurrentGrowthStage(timeline: any[], todayStr: string = new Date().toISOString().split('T')[0]) {
  const today = new Date(todayStr);
  // Reset time to midnight for comparison to avoid timezone issues affecting date overlap
  today.setHours(0,0,0,0);

  for (const stage of timeline) {
    const start = new Date(stage.start_date);
    const end = new Date(stage.end_date);
    start.setHours(0,0,0,0);
    end.setHours(0,0,0,0);
    
    if (today >= start && today <= end) {
       const days_completed = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
       const days_remaining = stage.duration_days - days_completed;
       
       return {
         current_stage: stage.stage_name.toLowerCase().replace(/\s+/g, '_'), // normalize to snake_case id if needed
         stage_name: stage.stage_name,
         stage_id: stage.stage_id,
         stage_start_date: stage.start_date,
         stage_end_date: stage.end_date,
         days_completed,
         days_remaining,
         key_actions: stage.stage_data.key_actions,
         risk_factors: stage.stage_data.risk_factors,
         ai_alerts: stage.stage_data.ai_alerts
       };
    }
  }
  
  // Check if before first stage
  if (timeline.length > 0) {
    const firstStart = new Date(timeline[0].start_date);
    firstStart.setHours(0,0,0,0);
    if (today < firstStart) {
       return { 
         current_stage: "upcoming", 
         message: "Cycle has not started yet",
         days_until_start: Math.ceil((firstStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
       };
    }
  }

  return {
    current_stage: "completed",
    message: "Crop cycle completed"
  };
}

export function processCropCycle(cropName: string, sowingDateStr: string, soilType?: string) {
    const sowingDate = new Date(sowingDateStr);
    if (isNaN(sowingDate.getTime())) {
      throw new Error("Invalid sowing date format");
    }
    
    let cropCycle;
    if (soilType) {
        cropCycle = getCropCycle(soilType, cropName);
    }
    
    if (!cropCycle) {
        // Find first match by crop ID or name if soil not specified or not found
        // Normalize input crop name
        const normalizedInput = cropName.toLowerCase().replace(/\s+/g, '_');
        
        cropCycle = CROP_CYCLES_DATABASE.find(c => 
            c.crop_id === normalizedInput || 
            c.crop_id === cropName ||
            c.crop_name.toLowerCase() === cropName.toLowerCase()
        );
    }
    
    if (!cropCycle) {
        throw new Error(`Crop '${cropName}' not supported`);
    }

    const timeline = calculateCropTimeline(sowingDate, cropCycle.stages);
    const todayStr = new Date().toISOString().split('T')[0];
    const currentStatus = getCurrentGrowthStage(timeline, todayStr);
    
    // Calculate total progress
    const firstStageStart = new Date(timeline[0].start_date);
    const lastStageEnd = new Date(timeline[timeline.length - 1].end_date);
    
    // Total duration including pre-sowing stages
    const totalDuration = (lastStageEnd.getTime() - firstStageStart.getTime()) / (1000 * 60 * 60 * 24);
    
    const today = new Date();
    // Days elapsed since start of LAND PREPARATION (not sowing)
    const daysElapsed = Math.floor((today.getTime() - firstStageStart.getTime()) / (1000 * 60 * 60 * 24));
    
    const progressPercent = Math.min(Math.max(Math.round((daysElapsed / totalDuration) * 100), 0), 100);

    return {
        crop: cropCycle.crop_name,
        soil_type: cropCycle.soil_id,
        sowing_date: sowingDateStr,
        today: todayStr,
        progress_percent: progressPercent,
        current_status: currentStatus,
        timeline: timeline.map(t => ({
            stage_id: t.stage_id,
            stage_name: t.stage_name,
            start_date: t.start_date,
            end_date: t.end_date,
            duration_days: t.duration_days
        }))
    };
}
