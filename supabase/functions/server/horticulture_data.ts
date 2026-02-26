// ═══════════════════════════════════════════════════════════════
// MILA Horticulture Database — Comprehensive Fruits, Vegetables, Herbs & More
// Organic growing, natural pest control, crop cycles, selling strategies
// ═══════════════════════════════════════════════════════════════

export interface HortCrop {
  id: string;
  name: string;
  name_te?: string; // Telugu name
  category: 'fruit' | 'vegetable' | 'leafy_green' | 'herb' | 'root_tuber' | 'spice' | 'flower';
  image_hint: string; // keyword for frontend image mapping
  season: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  duration_days: number;
  spacing_cm: number;
  water_need: 'low' | 'medium' | 'high';
  sunlight: 'full' | 'partial' | 'shade';
  soil_types: string[];
  climate_zones: string[];

  // Growing Guide
  growing_guide: {
    soil_preparation: string[];
    sowing_method: string;
    seed_treatment?: string;
    germination_days: number;
    transplant_days?: number;
    key_stages: { name: string; day_range: string; tips: string[] }[];
    companion_plants: string[];
    avoid_near: string[];
  };

  // Organic & Natural Methods
  organic: {
    natural_fertilizers: { name: string; how: string; frequency: string }[];
    natural_pest_control: { pest: string; remedy: string }[];
    mulching_tips: string[];
    taste_enhancement: string[];
    soil_health_tips: string[];
  };

  // Crop Cycle
  crop_cycle: {
    sowing_window: string;
    harvest_window: string;
    yield_per_plant: string;
    successive_sowing: string;
    rotation_after: string[];
  };

  // Selling & Market
  selling: {
    peak_market_months: string[];
    avg_price_range: string;
    best_selling_tips: string[];
    value_addition: string[];
    storage_days: number;
    storage_method: string;
    organic_premium: string;
  };

  // Quick Facts
  nutrition: string[];
  fun_fact: string;
}

export const HORTICULTURE_DATABASE: HortCrop[] = [
  // ═══════ VEGETABLES ═══════
  {
    id: 'tomato',
    name: 'Tomato',
    name_te: 'టమాటా',
    category: 'vegetable',
    image_hint: 'tomato',
    season: ['Kharif', 'Rabi', 'Year-round (irrigated)'],
    difficulty: 'easy',
    duration_days: 90,
    spacing_cm: 60,
    water_need: 'medium',
    sunlight: 'full',
    soil_types: ['Sandy Loam', 'Loam', 'Red Soil'],
    climate_zones: ['Tropical', 'Sub-tropical'],
    growing_guide: {
      soil_preparation: [
        'Add 2-3 tonnes of well-decomposed FYM per acre 2 weeks before transplanting',
        'Ensure pH is between 6.0 and 7.0',
        'Raised beds of 15cm height for drainage',
        'Mix neem cake (200 kg/acre) into beds for root protection'
      ],
      sowing_method: 'Nursery raised seedlings transplanted at 4-leaf stage',
      seed_treatment: 'Soak seeds in Trichoderma solution (5g/L) for 30 min',
      germination_days: 7,
      transplant_days: 25,
      key_stages: [
        { name: 'Nursery', day_range: '0-25', tips: ['Keep seedbed moist', 'Provide 50% shade', 'Harden seedlings 3 days before transplant'] },
        { name: 'Vegetative Growth', day_range: '25-45', tips: ['Stake plants at 30cm height', 'Mulch with paddy straw', 'First top dressing at 30 days'] },
        { name: 'Flowering', day_range: '45-60', tips: ['Reduce nitrogen, increase phosphorus', 'Spray boron micro-nutrient for better fruit set', 'Avoid overhead irrigation'] },
        { name: 'Fruiting', day_range: '60-75', tips: ['Increase potassium for fruit quality', 'Remove suckers below first cluster', 'Monitor for fruit borer'] },
        { name: 'Harvest', day_range: '75-90', tips: ['Pick at breaker stage for longer shelf life', 'Harvest early morning', 'Handle gently to avoid bruising'] },
      ],
      companion_plants: ['Basil', 'Marigold', 'Carrot', 'Onion'],
      avoid_near: ['Cabbage', 'Fennel', 'Potato'],
    },
    organic: {
      natural_fertilizers: [
        { name: 'Jeevamrutha', how: 'Mix 10kg cow dung + 10L cow urine + 2kg jaggery + 2kg pulse flour + handful of soil in 200L water. Ferment 3 days.', frequency: 'Every 15 days' },
        { name: 'Panchagavya', how: 'Foliar spray 3% solution', frequency: 'Every 21 days during flowering' },
        { name: 'Bone Meal', how: 'Apply 50g per plant at base during flowering', frequency: 'Once at flowering' },
        { name: 'Wood Ash', how: 'Sprinkle 30g around plant base for potassium', frequency: 'Monthly' },
      ],
      natural_pest_control: [
        { pest: 'Fruit Borer', remedy: 'Neem oil spray (5ml/L) + install pheromone traps 12/acre' },
        { pest: 'Whitefly', remedy: 'Yellow sticky traps + garlic-chilli spray (crush 100g garlic + 50g chilli in 1L water, dilute 10x)' },
        { pest: 'Leaf Curl Virus', remedy: 'Remove affected plants, spray neem oil, control whitefly vectors' },
        { pest: 'Early Blight', remedy: 'Spray Pseudomonas fluorescens (10g/L), remove lower infected leaves' },
      ],
      mulching_tips: ['Use paddy straw 5-8cm thick', 'Black polythene mulch reduces weeds 90%', 'Coco peat mulch retains moisture in sandy soils'],
      taste_enhancement: [
        'Reduce watering 5 days before harvest for concentrated flavor',
        'Apply seaweed extract foliar spray during fruiting',
        'Ensure adequate potassium for sweetness - wood ash or banana peel compost',
        'Morning harvest has better sugar content than evening',
      ],
      soil_health_tips: ['Rotate with legumes (beans/peas) after tomato season', 'Green manure with sun hemp before planting', 'Add vermicompost 2 tonnes/acre annually'],
    },
    crop_cycle: {
      sowing_window: 'Jun-Jul (Kharif), Oct-Nov (Rabi), Jan-Feb (Summer)',
      harvest_window: 'Sep-Nov (Kharif), Jan-Mar (Rabi), Apr-May (Summer)',
      yield_per_plant: '3-5 kg per plant (organic), 15-20 tonnes/acre',
      successive_sowing: 'Stagger plantings every 3 weeks for continuous harvest',
      rotation_after: ['Beans', 'Cucumber', 'Onion', 'Cabbage'],
    },
    selling: {
      peak_market_months: ['November', 'December', 'April', 'May'],
      avg_price_range: '₹15-60/kg (varies by season)',
      best_selling_tips: [
        'Grade by size: A (>60g), B (40-60g), C (<40g) — fetch 30% more',
        'Sell at breaker stage to wholesalers, ripe to direct consumers',
        'Build relationships with local restaurant/hotel chains',
        'Weekend farmers markets offer 2x wholesale prices',
      ],
      value_addition: ['Sun-dried tomatoes (₹400-800/kg)', 'Tomato paste/puree (3x value)', 'Pickled green tomatoes', 'Dehydrated tomato powder'],
      storage_days: 10,
      storage_method: 'Store at 12-15°C, never refrigerate below 10°C (kills flavor)',
      organic_premium: '25-40% premium at organic markets and online platforms',
    },
    nutrition: ['Lycopene (antioxidant)', 'Vitamin C', 'Vitamin K', 'Potassium'],
    fun_fact: 'India is the 2nd largest tomato producer in the world after China!',
  },

  {
    id: 'brinjal',
    name: 'Brinjal (Eggplant)',
    name_te: 'వంకాయ',
    category: 'vegetable',
    image_hint: 'eggplant',
    season: ['Kharif', 'Rabi'],
    difficulty: 'easy',
    duration_days: 100,
    spacing_cm: 60,
    water_need: 'medium',
    sunlight: 'full',
    soil_types: ['Loam', 'Sandy Loam', 'Clay Loam'],
    climate_zones: ['Tropical', 'Sub-tropical'],
    growing_guide: {
      soil_preparation: ['Well-drained fertile soil with pH 5.5-6.5', 'Add FYM 15-20 tonnes/hectare', 'Deep ploughing to remove root-knot nematode hosts'],
      sowing_method: 'Transplant nursery-grown seedlings at 5-6 leaf stage',
      seed_treatment: 'Treat with Trichoderma viride 4g/kg seed',
      germination_days: 8,
      transplant_days: 30,
      key_stages: [
        { name: 'Nursery', day_range: '0-30', tips: ['Raise in protrays for uniform growth', 'Provide 50% shade net'] },
        { name: 'Establishment', day_range: '30-50', tips: ['Water daily for 1 week after transplant', 'Apply neem cake at base'] },
        { name: 'Flowering', day_range: '50-65', tips: ['Pinch first few flowers for bushier growth', 'Spray boron for fruit set'] },
        { name: 'Fruiting', day_range: '65-85', tips: ['Harvest every 5-7 days when fruit is glossy', 'Use sharp knife to avoid stem damage'] },
        { name: 'Late Harvest', day_range: '85-100', tips: ['Reduce water slightly', 'Remove overripe fruits to encourage new ones'] },
      ],
      companion_plants: ['Beans', 'Marigold', 'Pepper'],
      avoid_near: ['Fennel', 'Tomato (same family diseases)'],
    },
    organic: {
      natural_fertilizers: [
        { name: 'Vermicompost', how: 'Apply 2kg per plant at planting + 500g monthly', frequency: 'Monthly' },
        { name: 'Jeevamrutha', how: 'Soil drench 200L per acre', frequency: 'Every 15 days' },
      ],
      natural_pest_control: [
        { pest: 'Shoot & Fruit Borer', remedy: 'Prune affected shoots weekly + neem oil 5ml/L spray + pheromone traps' },
        { pest: 'Aphids', remedy: 'Spray neem soap solution (5ml neem oil + 1ml liquid soap per liter)' },
      ],
      mulching_tips: ['Dry grass mulch 4-5cm retains moisture', 'Silver-colored mulch repels aphids'],
      taste_enhancement: ['Harvest young and glossy for tender texture', 'Less water before picking intensifies flavor', 'Organic compost produces sweeter, less bitter fruit'],
      soil_health_tips: ['Rotate with cereals or legumes', 'Avoid planting solanaceae in same spot for 3 years'],
    },
    crop_cycle: {
      sowing_window: 'Jun-Jul (Kharif), Sep-Oct (Rabi)',
      harvest_window: 'Sep-Dec (Kharif), Jan-Apr (Rabi)',
      yield_per_plant: '2-4 kg per plant, 12-18 tonnes/acre',
      successive_sowing: 'Plant Kharif + Rabi for 8-month continuous harvest',
      rotation_after: ['Onion', 'Beans', 'Okra'],
    },
    selling: {
      peak_market_months: ['October', 'November', 'February', 'March'],
      avg_price_range: '₹15-50/kg',
      best_selling_tips: ['Purple/glossy fruits fetch higher price', 'Grade by size and color', 'Direct to restaurants for premium'],
      value_addition: ['Brinjal chips (dried)', 'Pickled brinjal', 'Ready-to-cook curry paste'],
      storage_days: 5,
      storage_method: 'Store at 10-12°C, perforated bags',
      organic_premium: '20-35% premium',
    },
    nutrition: ['Fiber', 'Manganese', 'Folate', 'Antioxidants (nasunin)'],
    fun_fact: 'India has the world\'s largest collection of brinjal varieties — over 2,500 types!',
  },

  {
    id: 'okra',
    name: 'Okra (Lady Finger)',
    name_te: 'బెండకాయ',
    category: 'vegetable',
    image_hint: 'okra',
    season: ['Kharif', 'Summer'],
    difficulty: 'easy',
    duration_days: 60,
    spacing_cm: 30,
    water_need: 'medium',
    sunlight: 'full',
    soil_types: ['Loam', 'Sandy Loam', 'Black Soil'],
    climate_zones: ['Tropical', 'Sub-tropical'],
    growing_guide: {
      soil_preparation: ['Well-drained soil, pH 6.0-6.8', 'Add FYM 10 tonnes/acre', 'Solarize soil for 2 weeks to kill pests'],
      sowing_method: 'Direct sowing in rows at 2cm depth',
      seed_treatment: 'Soak in water 12 hours, treat with Trichoderma',
      germination_days: 5,
      key_stages: [
        { name: 'Seedling', day_range: '0-15', tips: ['Thin seedlings to 30cm apart', 'Keep soil moist'] },
        { name: 'Vegetative', day_range: '15-35', tips: ['Apply neem cake mulch', 'First weeding at 20 days'] },
        { name: 'Flowering & Fruiting', day_range: '35-50', tips: ['Pick pods every 2 days when 7-8cm long', 'Tender pods have best market value'] },
        { name: 'Continuous Harvest', day_range: '50-60+', tips: ['Regular picking encourages more pods', 'Remove yellow leaves'] },
      ],
      companion_plants: ['Pepper', 'Melon', 'Sunflower'],
      avoid_near: ['None known — okra is very friendly!'],
    },
    organic: {
      natural_fertilizers: [
        { name: 'Cow dung slurry', how: 'Dilute 1:10 and apply at base', frequency: 'Weekly' },
        { name: 'Fish amino acid', how: 'Foliar spray 2ml/L', frequency: 'Every 2 weeks' },
      ],
      natural_pest_control: [
        { pest: 'Shoot Borer', remedy: 'Remove affected shoots, neem oil spray' },
        { pest: 'Jassids', remedy: 'Neem oil + sticky traps' },
        { pest: 'Yellow Vein Mosaic', remedy: 'Use resistant varieties, control whitefly' },
      ],
      mulching_tips: ['Sugarcane trash mulch works excellently', 'Mulch after first weeding'],
      taste_enhancement: ['Harvest tender (7-8cm) for best taste', 'Morning harvest is crispier', 'Organic okra is noticeably less slimy'],
      soil_health_tips: ['Good rotation crop after rice', 'Deep roots improve soil structure'],
    },
    crop_cycle: {
      sowing_window: 'Feb-Mar (Summer), Jun-Jul (Kharif)',
      harvest_window: 'Apr-Jun (Summer), Aug-Oct (Kharif)',
      yield_per_plant: '200-400g per plant, 4-6 tonnes/acre',
      successive_sowing: 'Sow every 3 weeks for continuous supply',
      rotation_after: ['Tomato', 'Beans', 'Leafy greens'],
    },
    selling: {
      peak_market_months: ['March', 'April', 'August', 'September'],
      avg_price_range: '₹20-60/kg',
      best_selling_tips: ['Tender green pods sell best', 'Bundle in 250g/500g packs', 'Early morning market gets premium'],
      value_addition: ['Dehydrated okra chips', 'Frozen cut okra', 'Okra powder (thickener)'],
      storage_days: 3,
      storage_method: 'Wrap in newspaper, store at 7-10°C',
      organic_premium: '30-50% premium',
    },
    nutrition: ['Vitamin C', 'Vitamin K', 'Folate', 'Fiber'],
    fun_fact: 'Okra seeds can be roasted and ground as a coffee substitute!',
  },

  {
    id: 'chilli',
    name: 'Chilli (Green/Red)',
    name_te: 'మిర్చి',
    category: 'vegetable',
    image_hint: 'chilli',
    season: ['Kharif', 'Rabi'],
    difficulty: 'medium',
    duration_days: 120,
    spacing_cm: 45,
    water_need: 'medium',
    sunlight: 'full',
    soil_types: ['Loam', 'Black Soil', 'Red Soil'],
    climate_zones: ['Tropical', 'Sub-tropical', 'Semi-arid'],
    growing_guide: {
      soil_preparation: ['Well-drained soil pH 6.0-7.0', 'Add FYM 15 tonnes/acre + neem cake 200kg/acre', 'Form raised beds in heavy soils'],
      sowing_method: 'Transplant 35-40 day old nursery seedlings',
      seed_treatment: 'Treat with Pseudomonas 10g/kg seed',
      germination_days: 10,
      transplant_days: 35,
      key_stages: [
        { name: 'Nursery', day_range: '0-35', tips: ['Use shade net nursery', 'Drench with Trichoderma solution'] },
        { name: 'Establishment', day_range: '35-55', tips: ['Irrigate immediately after transplant', 'Mulch to conserve moisture'] },
        { name: 'Branching', day_range: '55-70', tips: ['Pinch growing tip at 30cm for more branches'] },
        { name: 'Flowering', day_range: '70-85', tips: ['Spray boron + calcium for better fruit set'] },
        { name: 'Fruiting', day_range: '85-120', tips: ['Pick green chillies every 5 days', 'For red chilli, leave to mature and dry on plant'] },
      ],
      companion_plants: ['Basil', 'Carrot', 'Onion'],
      avoid_near: ['Fennel', 'Beans (some varieties)'],
    },
    organic: {
      natural_fertilizers: [
        { name: 'Jeevamrutha', how: 'Soil drench', frequency: 'Fortnightly' },
        { name: 'Vermicompost tea', how: 'Foliar spray', frequency: 'Every 10 days during fruiting' },
      ],
      natural_pest_control: [
        { pest: 'Thrips', remedy: 'Blue sticky traps + neem oil 3ml/L' },
        { pest: 'Fruit Rot', remedy: 'Copper hydroxide (organic grade) + good spacing for air flow' },
        { pest: 'Mites', remedy: 'Spray buttermilk solution or sulfur-based organic spray' },
      ],
      mulching_tips: ['Silver mulch repels thrips', 'Organic mulch keeps roots cool in summer'],
      taste_enhancement: ['Moderate water stress increases pungency', 'Potassium-rich organic feed enhances flavor', 'Harvest at right color stage'],
      soil_health_tips: ['Rotate with cereals', 'Add organic matter to maintain soil biome'],
    },
    crop_cycle: {
      sowing_window: 'May-Jun (Kharif), Sep-Oct (Rabi)',
      harvest_window: 'Aug-Dec (Kharif), Jan-Apr (Rabi)',
      yield_per_plant: '500g-1kg green chillies per plant',
      successive_sowing: 'Kharif + Rabi plantings for year-round supply',
      rotation_after: ['Rice', 'Maize', 'Leafy greens'],
    },
    selling: {
      peak_market_months: ['October', 'November', 'March', 'April'],
      avg_price_range: '₹30-120/kg (green), ₹100-300/kg (dried red)',
      best_selling_tips: ['Uniform color and size gets premium', 'Dried red chillies have longer shelf life and higher value', 'Guntur market is the biggest for Andhra chillies'],
      value_addition: ['Dried red chillies (3-5x value)', 'Chilli powder', 'Chilli flakes', 'Pickled chillies'],
      storage_days: 7,
      storage_method: 'Green: 5-7°C perforated bags. Dried: airtight containers',
      organic_premium: '30-50% premium for organic dried chilli',
    },
    nutrition: ['Capsaicin', 'Vitamin C (2x orange!)', 'Vitamin A', 'Iron'],
    fun_fact: 'Guntur in Andhra Pradesh is called the "Chilli Capital of India" and exports to 60+ countries!',
  },

  {
    id: 'bitter_gourd',
    name: 'Bitter Gourd',
    name_te: 'కాకరకాయ',
    category: 'vegetable',
    image_hint: 'bitter_gourd',
    season: ['Kharif', 'Summer'],
    difficulty: 'medium',
    duration_days: 75,
    spacing_cm: 100,
    water_need: 'medium',
    sunlight: 'full',
    soil_types: ['Sandy Loam', 'Loam'],
    climate_zones: ['Tropical', 'Sub-tropical'],
    growing_guide: {
      soil_preparation: ['Well-drained soil pH 6.0-6.7', 'FYM 10 tonnes/acre in pits', 'Form channels for training vines'],
      sowing_method: 'Direct sow 2-3 seeds per pit, thin to 1',
      seed_treatment: 'Soak in water 24 hours for faster germination',
      germination_days: 7,
      key_stages: [
        { name: 'Seedling', day_range: '0-15', tips: ['Provide stakes or pandal early', 'Water regularly'] },
        { name: 'Vine Training', day_range: '15-35', tips: ['Train vines on trellis/pandal', 'Pinch after 5-6 nodes for lateral growth'] },
        { name: 'Flowering', day_range: '35-50', tips: ['Hand pollinate in morning for better fruit set'] },
        { name: 'Harvest', day_range: '50-75', tips: ['Harvest while still green and firm', 'Pick every 3-4 days'] },
      ],
      companion_plants: ['Beans', 'Corn', 'Radish'],
      avoid_near: ['Squash (attracts same pests)'],
    },
    organic: {
      natural_fertilizers: [
        { name: 'FYM + Vermicompost', how: 'Mix in planting pits', frequency: 'At planting + monthly top dress' },
        { name: 'Panchagavya', how: 'Foliar spray 3%', frequency: 'Every 15 days' },
      ],
      natural_pest_control: [
        { pest: 'Fruit Fly', remedy: 'Cue-lure traps + bait spray (jaggery + malathion alternative: neem)' },
        { pest: 'Downy Mildew', remedy: 'Trichoderma spray + ensure air circulation on trellis' },
      ],
      mulching_tips: ['Organic mulch keeps soil cool for roots while vines get full sun on pandal'],
      taste_enhancement: ['Harvest at right maturity — overripe = overly bitter', 'Salt and squeeze to reduce bitterness for cooking', 'Organic-grown has more nuanced, less sharp bitterness'],
      soil_health_tips: ['Good rotation crop — cucurbits improve soil with deep roots'],
    },
    crop_cycle: {
      sowing_window: 'Feb-Mar (Summer), Jun-Jul (Kharif)',
      harvest_window: 'Apr-Jun (Summer), Aug-Oct (Kharif)',
      yield_per_plant: '15-25 fruits per vine, 6-8 tonnes/acre',
      successive_sowing: 'Stagger 3 weeks apart for continuous harvest',
      rotation_after: ['Tomato', 'Onion', 'Beans'],
    },
    selling: {
      peak_market_months: ['March', 'April', 'September'],
      avg_price_range: '₹30-80/kg',
      best_selling_tips: ['Small, green, firm fruits preferred', 'Pack 500g bundles', 'High demand in health-conscious markets'],
      value_addition: ['Bitter gourd juice (health drink)', 'Dried bitter gourd chips', 'Bitter gourd powder capsules'],
      storage_days: 4,
      storage_method: 'Wrap in newspaper, 10-12°C',
      organic_premium: '25-40% premium due to health food demand',
    },
    nutrition: ['Vitamin C', 'Vitamin A', 'Iron', 'Charantin (blood sugar regulator)'],
    fun_fact: 'Bitter gourd is used in traditional Ayurvedic medicine for managing diabetes!',
  },

  // ═══════ FRUITS ═══════
  {
    id: 'mango',
    name: 'Mango',
    name_te: 'మామిడి',
    category: 'fruit',
    image_hint: 'mango',
    season: ['Summer (perennial tree)'],
    difficulty: 'hard',
    duration_days: 1825,
    spacing_cm: 1000,
    water_need: 'low',
    sunlight: 'full',
    soil_types: ['Deep Loam', 'Alluvial', 'Laterite'],
    climate_zones: ['Tropical', 'Sub-tropical'],
    growing_guide: {
      soil_preparation: ['Dig 1m x 1m x 1m pits, fill with topsoil + FYM', 'Plant grafted saplings from certified nurseries', 'Ensure well-drained location, avoid waterlogging'],
      sowing_method: 'Plant grafted saplings in July-August',
      germination_days: 0,
      key_stages: [
        { name: 'Establishment', day_range: 'Year 1-2', tips: ['Water weekly, protect from cattle', 'Provide shade from harsh sun initially', 'Remove any flowers in first 2 years'] },
        { name: 'Juvenile Growth', day_range: 'Year 2-4', tips: ['Train to open-center canopy', 'Apply organic mulch ring', 'Whitewash trunk to prevent sun scald'] },
        { name: 'First Fruiting', day_range: 'Year 4-5', tips: ['Grafted trees fruit by year 4-5', 'Thin excess fruit for better size', 'Spray boron + zinc for quality'] },
        { name: 'Full Bearing', day_range: 'Year 5+', tips: ['Annual pruning after harvest', 'Regulate flowering with Paclobutrazol (or organic alternatives)', 'Protect from fruit fly'] },
      ],
      companion_plants: ['Legume groundcover', 'Turmeric/ginger intercrop in early years'],
      avoid_near: ['Other large trees competing for light'],
    },
    organic: {
      natural_fertilizers: [
        { name: 'FYM + Vermicompost', how: '50kg FYM + 5kg vermicompost per tree per year', frequency: 'Post-harvest (June-July)' },
        { name: 'Neem Cake', how: '2kg per tree in trunk basin', frequency: 'Twice a year' },
        { name: 'Bone Meal', how: '1kg per tree for phosphorus', frequency: 'Pre-flowering (October)' },
      ],
      natural_pest_control: [
        { pest: 'Fruit Fly', remedy: 'Methyl eugenol traps (10/acre) + bagging fruits + collect & destroy fallen fruits' },
        { pest: 'Mango Hopper', remedy: 'Neem oil spray before flowering + sticky traps + maintain orchard hygiene' },
        { pest: 'Anthracnose', remedy: 'Bordeaux mixture (organic) + prune dead wood + ensure air circulation' },
        { pest: 'Powdery Mildew', remedy: 'Sulfur spray (organic) at panicle emergence' },
      ],
      mulching_tips: ['Thick leaf litter mulch in trunk basin', 'Prevents moisture loss in hot summer'],
      taste_enhancement: [
        'Allow fruit to ripen on tree for best flavor',
        'Adequate potassium gives sweeter, deeper flavored fruit',
        'Organic mangoes have demonstrably better Brix (sugar) levels',
        'Calcium spray prevents internal breakdown and improves shelf life',
      ],
      soil_health_tips: ['Legume intercropping fixes nitrogen', 'Do not disturb root zone — mulch instead of tilling'],
    },
    crop_cycle: {
      sowing_window: 'July-August (sapling planting)',
      harvest_window: 'April-June (depends on variety)',
      yield_per_plant: '100-200 fruits/tree at maturity, 8-10 tonnes/acre',
      successive_sowing: 'Mix early (Banganapalli) + mid (Alphonso) + late (Totapuri) varieties for extended harvest',
      rotation_after: ['Perennial — intercrop with short-term crops like vegetables or pulses'],
    },
    selling: {
      peak_market_months: ['April', 'May', 'June'],
      avg_price_range: '₹30-150/kg (variety dependent)',
      best_selling_tips: [
        'Alphonso/Banganapalli fetch premium — invest in quality varieties',
        'Carbide-free ripening using ethylene sachets commands premium',
        'Export quality requires proper grading and packing',
        'Online direct-to-consumer sales (box of dozen) at 3x wholesale',
      ],
      value_addition: ['Mango pulp (₹200-400/kg)', 'Mango pickle (high value)', 'Dried mango (aam papad)', 'Mango jam/jelly', 'Mango leather (export quality)'],
      storage_days: 8,
      storage_method: 'Ripen at room temperature, store ripe at 8-10°C',
      organic_premium: '40-70% premium for certified organic mangoes',
    },
    nutrition: ['Vitamin A', 'Vitamin C', 'Fiber', 'Antioxidants'],
    fun_fact: 'India produces nearly 50% of the world\'s mangoes! The oldest mango tree (over 300 years old) is in Kandukur, Andhra Pradesh.',
  },

  {
    id: 'banana',
    name: 'Banana',
    name_te: 'అరటి',
    category: 'fruit',
    image_hint: 'banana',
    season: ['Year-round'],
    difficulty: 'medium',
    duration_days: 365,
    spacing_cm: 200,
    water_need: 'high',
    sunlight: 'full',
    soil_types: ['Rich Loam', 'Clay Loam', 'Alluvial'],
    climate_zones: ['Tropical'],
    growing_guide: {
      soil_preparation: ['Deep rich soil pH 6.5-7.5', 'Dig pits 60x60x60cm, fill with FYM + topsoil', 'Ensure good drainage'],
      sowing_method: 'Tissue culture or sword sucker planting',
      germination_days: 0,
      key_stages: [
        { name: 'Establishment', day_range: 'Month 1-3', tips: ['Water every 3 days', 'Remove all weeds within 1m radius', 'Prop up if windy'] },
        { name: 'Vegetative', day_range: 'Month 3-8', tips: ['Maintain 1 sucker per plant as ratoon', 'Monthly fertilizer application', 'Desuckering — keep only 1 follower'] },
        { name: 'Flowering', day_range: 'Month 8-10', tips: ['Ensure adequate water', 'Prop bunch with bamboo if heavy'] },
        { name: 'Bunch Development', day_range: 'Month 10-12', tips: ['Cover bunch with blue polythene bag', 'Dehand male bud when 2 hands remain'] },
      ],
      companion_plants: ['Legumes as cover crop', 'Turmeric', 'Ginger (in young plantations)'],
      avoid_near: ['Wind-exposed locations'],
    },
    organic: {
      natural_fertilizers: [
        { name: 'FYM', how: '10kg per plant per year', frequency: 'Quarterly' },
        { name: 'Vermicompost', how: '5kg per plant', frequency: 'Every 3 months' },
        { name: 'Banana stem compost', how: 'Chop old stems, compost, and recycle back', frequency: 'Post-harvest' },
      ],
      natural_pest_control: [
        { pest: 'Banana Weevil', remedy: 'Clean planting material + pseudostem traps with Beauveria bassiana' },
        { pest: 'Sigatoka Leaf Spot', remedy: 'Remove affected leaves, ensure spacing, Trichoderma spray' },
        { pest: 'Bunchy Top Virus', remedy: 'Use virus-free tissue culture plants, destroy infected plants' },
      ],
      mulching_tips: ['Thick mulch of banana leaves/stems (recycled from harvest)', 'Reduces irrigation by 30%'],
      taste_enhancement: ['Allow natural ripening (never carbide)', 'Organic bananas are noticeably sweeter', 'Adequate potassium = better flavor and texture'],
      soil_health_tips: ['Deep-rooted crops improve soil structure', 'Rotate location every 3-4 ratoon cycles'],
    },
    crop_cycle: {
      sowing_window: 'February-March or September-October',
      harvest_window: '11-14 months after planting',
      yield_per_plant: '15-25 kg per bunch, 30-40 tonnes/acre',
      successive_sowing: 'Ratoon cropping gives 2-3 harvests from single planting',
      rotation_after: ['Paddy', 'Vegetables', 'Legumes after 3 ratoons'],
    },
    selling: {
      peak_market_months: ['October', 'November', 'March', 'April'],
      avg_price_range: '₹15-40/kg',
      best_selling_tips: ['Grade by hand: premium for uniform bunches', 'Temple/festival season demand spikes', 'Direct-to-retailer supply chain'],
      value_addition: ['Banana chips (₹200-400/kg)', 'Banana powder', 'Banana fiber products', 'Dehydrated banana'],
      storage_days: 5,
      storage_method: 'Hang bunches in cool shade, 13-15°C',
      organic_premium: '20-35% premium',
    },
    nutrition: ['Potassium', 'Vitamin B6', 'Vitamin C', 'Magnesium'],
    fun_fact: 'India is the world\'s largest banana producer! Banana plants are technically giant herbs, not trees.',
  },

  {
    id: 'papaya',
    name: 'Papaya',
    name_te: 'బొప్పాయి',
    category: 'fruit',
    image_hint: 'papaya',
    season: ['Year-round (tropical)'],
    difficulty: 'easy',
    duration_days: 270,
    spacing_cm: 200,
    water_need: 'medium',
    sunlight: 'full',
    soil_types: ['Sandy Loam', 'Loam'],
    climate_zones: ['Tropical'],
    growing_guide: {
      soil_preparation: ['Well-drained soil is CRITICAL (papaya dies in waterlogging)', 'pH 6.0-7.0', 'Raised beds in heavy soils', 'FYM 10 tonnes/acre'],
      sowing_method: 'Transplant 6-8 week nursery seedlings or direct sow 3 seeds per pit',
      seed_treatment: 'Soak seeds 24 hours, dry and sow',
      germination_days: 14,
      transplant_days: 45,
      key_stages: [
        { name: 'Seedling', day_range: '0-45', tips: ['Keep nursery warm and moist', 'Protect from heavy rain'] },
        { name: 'Vegetative', day_range: '45-120', tips: ['Single stem growth, remove side shoots', 'Adequate water and nutrition'] },
        { name: 'Flowering', day_range: '120-150', tips: ['Identify male/female — remove excess males (keep 1:10 ratio)'] },
        { name: 'Fruiting', day_range: '150-270', tips: ['Support heavy branches', 'Harvest when 1/4 yellow on tree'] },
      ],
      companion_plants: ['Legumes', 'Leafy greens in gaps'],
      avoid_near: ['Waterlogged areas'],
    },
    organic: {
      natural_fertilizers: [
        { name: 'FYM + Neem Cake', how: 'Basin application 5kg FYM + 500g neem cake per plant', frequency: 'Quarterly' },
        { name: 'Jeevamrutha', how: 'Soil drench', frequency: 'Monthly' },
      ],
      natural_pest_control: [
        { pest: 'Papaya Ring Spot Virus', remedy: 'Use resistant varieties (Pusa Nanha), control aphid vectors' },
        { pest: 'Fruit Fly', remedy: 'Bag fruits + methyl eugenol traps' },
        { pest: 'Mealybugs', remedy: 'Release ladybird beetles + neem oil spray' },
      ],
      mulching_tips: ['Organic mulch around base but keep 6 inches away from stem to prevent rot'],
      taste_enhancement: ['Tree-ripened papaya is sweetest', 'Organic papayas have better sweetness', 'Adequate potassium enhances flavor and color'],
      soil_health_tips: ['Short rotation crop — replant every 2 years', 'Good for fallow land rehabilitation'],
    },
    crop_cycle: {
      sowing_window: 'February-March or September-October',
      harvest_window: '8-9 months after planting, continuous for 2 years',
      yield_per_plant: '30-50 kg per plant/year, 40-60 tonnes/acre',
      successive_sowing: 'Replace every 2 years for best production',
      rotation_after: ['Vegetables', 'Pulses'],
    },
    selling: {
      peak_market_months: ['Year-round demand, peak in summer'],
      avg_price_range: '₹15-40/kg',
      best_selling_tips: ['Uniform ripe fruits get premium', 'Pack in cushioned boxes', 'Target juice shops and hotels'],
      value_addition: ['Papaya pulp', 'Dried papaya', 'Papain extraction (very high value)', 'Raw papaya pickle'],
      storage_days: 5,
      storage_method: 'Room temperature to ripen, 10°C when ripe',
      organic_premium: '25-40% premium',
    },
    nutrition: ['Vitamin C (3x orange!)', 'Vitamin A', 'Papain (enzyme)', 'Folate'],
    fun_fact: 'Unripe green papaya produces papain enzyme, used in meat tenderizers and cosmetics worldwide!',
  },

  {
    id: 'guava',
    name: 'Guava',
    name_te: 'జామ',
    category: 'fruit',
    image_hint: 'guava',
    season: ['Rainy + Winter'],
    difficulty: 'easy',
    duration_days: 730,
    spacing_cm: 600,
    water_need: 'low',
    sunlight: 'full',
    soil_types: ['Wide range — even poor soils'],
    climate_zones: ['Tropical', 'Sub-tropical'],
    growing_guide: {
      soil_preparation: ['Tolerant of most soils pH 4.5-8.2', 'Pits 60x60x60cm with FYM', 'Good drainage preferred'],
      sowing_method: 'Plant grafted saplings (air-layered or budded)',
      germination_days: 0,
      key_stages: [
        { name: 'Establishment', day_range: 'Year 1', tips: ['Water regularly', 'Protect from frost', 'Stake young plants'] },
        { name: 'Canopy Formation', day_range: 'Year 1-2', tips: ['Prune to open vase shape', 'Remove water sprouts'] },
        { name: 'First Fruiting', day_range: 'Year 2-3', tips: ['Thin fruits for bigger size', 'Bag fruits to prevent fruit fly damage'] },
      ],
      companion_plants: ['Leguminous cover crops', 'Vegetables in young orchards'],
      avoid_near: ['Shaded areas'],
    },
    organic: {
      natural_fertilizers: [
        { name: 'FYM', how: '20-30kg per tree per year', frequency: 'Twice yearly' },
        { name: 'Vermicompost', how: '5kg per tree', frequency: 'Quarterly' },
      ],
      natural_pest_control: [
        { pest: 'Fruit Fly', remedy: 'Bagging + methyl eugenol traps + harvest at hard mature stage' },
        { pest: 'Guava Wilt', remedy: 'Use resistant rootstock, avoid waterlogging, Trichoderma in soil' },
      ],
      mulching_tips: ['Thick mulch conserves water in dry periods', 'Guava leaves themselves make excellent mulch'],
      taste_enhancement: ['Winter guavas are sweetest', 'Slight water stress before harvest concentrates sugars', 'Organic guavas have denser flesh and better aroma'],
      soil_health_tips: ['Extremely hardy — good for degraded lands', 'Deep roots bring up minerals'],
    },
    crop_cycle: {
      sowing_window: 'July-August (monsoon planting)',
      harvest_window: 'Winter (Nov-Feb) + Monsoon (Aug-Sep)',
      yield_per_plant: '30-50 kg/tree at maturity, 10-15 tonnes/acre',
      successive_sowing: 'Crop regulation possible for off-season production',
      rotation_after: ['Perennial — intercrop vegetables'],
    },
    selling: {
      peak_market_months: ['November', 'December', 'January'],
      avg_price_range: '₹20-80/kg',
      best_selling_tips: ['Winter crop fetches 2x monsoon crop price', 'Allahabad Safeda and Taiwan Pink varieties get premium', 'Direct consumer sales at 3x wholesale'],
      value_addition: ['Guava jelly/jam', 'Guava juice', 'Guava cheese (high-value)', 'Dried guava slices'],
      storage_days: 5,
      storage_method: '8-10°C in perforated bags',
      organic_premium: '30-50% premium',
    },
    nutrition: ['Vitamin C (4x orange!)', 'Fiber', 'Potassium', 'Lycopene (pink varieties)'],
    fun_fact: 'Guava has 4 times more Vitamin C than oranges and is called "Apple of the Tropics"!',
  },

  // ═══════ LEAFY GREENS ═══════
  {
    id: 'spinach',
    name: 'Spinach (Palak)',
    name_te: 'పాలకూర',
    category: 'leafy_green',
    image_hint: 'spinach',
    season: ['Rabi', 'Winter'],
    difficulty: 'easy',
    duration_days: 40,
    spacing_cm: 15,
    water_need: 'medium',
    sunlight: 'partial',
    soil_types: ['Loam', 'Clay Loam'],
    climate_zones: ['Temperate', 'Sub-tropical winter'],
    growing_guide: {
      soil_preparation: ['Rich organic soil pH 6.0-7.5', 'Fine tilth seedbed', 'Add vermicompost 2 tonnes/acre'],
      sowing_method: 'Direct broadcast or line sowing at 1cm depth',
      germination_days: 5,
      key_stages: [
        { name: 'Germination', day_range: '0-7', tips: ['Keep soil consistently moist', 'Light shade in warm weather'] },
        { name: 'Leaf Growth', day_range: '7-25', tips: ['Thin to 15cm spacing', 'Top dress with diluted organic fertilizer'] },
        { name: 'Harvest', day_range: '25-40', tips: ['Cut outer leaves first for continuous harvest', 'Harvest before bolting'] },
      ],
      companion_plants: ['Strawberry', 'Radish', 'Beans'],
      avoid_near: ['None significant'],
    },
    organic: {
      natural_fertilizers: [
        { name: 'Compost tea', how: 'Foliar spray weekly', frequency: 'Weekly' },
        { name: 'Diluted cow urine', how: '1:20 dilution soil drench', frequency: 'Fortnightly' },
      ],
      natural_pest_control: [
        { pest: 'Leaf Miner', remedy: 'Neem oil spray + yellow sticky traps' },
        { pest: 'Damping Off', remedy: 'Trichoderma seed treatment, avoid overwatering' },
      ],
      mulching_tips: ['Light straw mulch to retain moisture'],
      taste_enhancement: ['Cool weather spinach is sweeter', 'Organic matter in soil = more nutritious leaves', 'Harvest in morning for best texture'],
      soil_health_tips: ['Quick crop — great for filling rotation gaps', 'Adds organic matter when residues incorporated'],
    },
    crop_cycle: {
      sowing_window: 'October-February',
      harvest_window: '25-40 days after sowing, 3-4 cuttings possible',
      yield_per_plant: 'Multiple cuttings, 8-12 tonnes/acre per season',
      successive_sowing: 'Sow every 2 weeks for continuous supply Oct-Feb',
      rotation_after: ['Tomato', 'Okra', 'Any summer crop'],
    },
    selling: {
      peak_market_months: ['November', 'December', 'January'],
      avg_price_range: '₹20-60/kg',
      best_selling_tips: ['Bunch in 250g/500g bundles with roots washed', 'Early morning market gets freshest premium', 'Wilt quickly — sell same day'],
      value_addition: ['Palak puree (frozen)', 'Dehydrated spinach powder', 'Baby spinach premium packs'],
      storage_days: 2,
      storage_method: 'Mist and wrap in damp cloth, refrigerate',
      organic_premium: '30-50% premium — leafy greens are most demanded organic',
    },
    nutrition: ['Iron', 'Calcium', 'Vitamin K', 'Folate'],
    fun_fact: 'Despite the Popeye myth, spinach iron is not as easily absorbed — but it is still one of the most nutrient-dense foods on earth!',
  },

  // ═══════ HERBS ═══════
  {
    id: 'coriander',
    name: 'Coriander (Dhaniya)',
    name_te: 'కొత్తిమీర',
    category: 'herb',
    image_hint: 'coriander',
    season: ['Rabi', 'Cool weather'],
    difficulty: 'easy',
    duration_days: 45,
    spacing_cm: 10,
    water_need: 'medium',
    sunlight: 'partial',
    soil_types: ['Loam', 'Sandy Loam'],
    climate_zones: ['Temperate', 'Sub-tropical winter'],
    growing_guide: {
      soil_preparation: ['Fine tilth, rich organic soil', 'pH 6.2-6.8', 'Split seeds gently before sowing for better germination'],
      sowing_method: 'Broadcast or line sowing, cover lightly with soil',
      seed_treatment: 'Gently crush seeds to split, soak 6 hours',
      germination_days: 10,
      key_stages: [
        { name: 'Germination', day_range: '0-12', tips: ['Keep soil moist, not waterlogged', 'Germination is slow — be patient'] },
        { name: 'Leaf Growth', day_range: '12-30', tips: ['Thin seedlings', 'Liquid organic fertilizer every 10 days'] },
        { name: 'Harvest', day_range: '30-45', tips: ['Cut at 15cm height leaving 2cm stub for regrowth', 'Can get 2-3 cuttings'] },
      ],
      companion_plants: ['Tomato', 'Spinach', 'Chilli'],
      avoid_near: ['Fennel (inhibits coriander growth)'],
    },
    organic: {
      natural_fertilizers: [
        { name: 'Vermicompost', how: 'Mix into seedbed before sowing', frequency: 'At sowing' },
        { name: 'Jeevamrutha', how: 'Diluted soil drench', frequency: 'Every 10 days' },
      ],
      natural_pest_control: [
        { pest: 'Aphids', remedy: 'Strong water jet + neem soap spray' },
        { pest: 'Powdery Mildew', remedy: 'Baking soda spray (5g/L) + ensure air circulation' },
      ],
      mulching_tips: ['Light mulch between rows', 'Remove mulch in humid weather to prevent rot'],
      taste_enhancement: ['Cool weather = most aromatic leaves', 'Organic coriander has stronger aroma', 'Harvest before bolting for best flavor'],
      soil_health_tips: ['Quick crop ideal for rotation gaps', 'Roots have allelopathic properties that suppress some weeds'],
    },
    crop_cycle: {
      sowing_window: 'October-January (main), March-April (bolts quickly)',
      harvest_window: '30-45 days, 2-3 cuttings per sowing',
      yield_per_plant: '6-8 tonnes/acre fresh leaf per season',
      successive_sowing: 'Sow every 2 weeks for continuous supply',
      rotation_after: ['Any crop — excellent gap filler'],
    },
    selling: {
      peak_market_months: ['November', 'December', 'January'],
      avg_price_range: '₹30-120/kg (highly volatile)',
      best_selling_tips: ['Price spikes in summer when supply is low', 'Bundle with roots for freshness', 'Restaurant chains need consistent daily supply'],
      value_addition: ['Dried coriander leaves', 'Coriander seed (let it bolt!)', 'Coriander pesto/chutney'],
      storage_days: 3,
      storage_method: 'Stand in water like flowers, or wrap in damp paper in fridge',
      organic_premium: '40-60% premium — herbs are highest premium category',
    },
    nutrition: ['Vitamin K', 'Vitamin C', 'Vitamin A', 'Potassium'],
    fun_fact: 'Coriander is one of the oldest known herbs — seeds were found in 7,000-year-old archaeological sites!',
  },

  {
    id: 'curry_leaf',
    name: 'Curry Leaf',
    name_te: 'కరివేపాకు',
    category: 'herb',
    image_hint: 'curry_leaf',
    season: ['Year-round (perennial)'],
    difficulty: 'easy',
    duration_days: 365,
    spacing_cm: 300,
    water_need: 'low',
    sunlight: 'full',
    soil_types: ['Any well-drained soil'],
    climate_zones: ['Tropical', 'Sub-tropical'],
    growing_guide: {
      soil_preparation: ['Any well-drained soil, tolerates poor soils', 'pH 6.0-7.0', 'Add FYM in planting pit'],
      sowing_method: 'Plant from root suckers or stem cuttings (seeds are slow)',
      germination_days: 0,
      key_stages: [
        { name: 'Establishment', day_range: 'Month 1-6', tips: ['Water weekly initially', 'Protect from frost', 'Remove flowers in first year'] },
        { name: 'Bushing', day_range: 'Month 6-12', tips: ['Prune to encourage branching', 'Harvest tips regularly for bushier growth'] },
        { name: 'Full Production', day_range: 'Year 2+', tips: ['Harvest every 2-3 months', 'Cut branches, leaves regrow'] },
      ],
      companion_plants: ['Can be boundary planting around any crop'],
      avoid_near: ['Heavy shade'],
    },
    organic: {
      natural_fertilizers: [
        { name: 'FYM', how: '5kg per plant per year', frequency: 'Twice yearly' },
        { name: 'Buttermilk', how: 'Diluted 1:5 soil drench for calcium', frequency: 'Monthly' },
      ],
      natural_pest_control: [
        { pest: 'Scale Insects', remedy: 'Neem oil spray + manual removal' },
        { pest: 'Psyllids', remedy: 'Insecticidal soap spray' },
      ],
      mulching_tips: ['Mulch conserves water; curry leaf is drought tolerant once established'],
      taste_enhancement: ['Fresh leaves are far more aromatic than dried', 'Regular pruning = more tender aromatic new growth', 'Organic plants produce more aromatic oils'],
      soil_health_tips: ['Perennial roots improve soil year after year', 'Leaf fall adds nutrients'],
    },
    crop_cycle: {
      sowing_window: 'Monsoon (Jun-Aug) for best establishment',
      harvest_window: 'Year-round once established, peak in monsoon',
      yield_per_plant: '5-10 kg leaves per plant per year',
      successive_sowing: 'Plant once, harvest for 15-20 years',
      rotation_after: ['Perennial — no rotation needed'],
    },
    selling: {
      peak_market_months: ['Year-round demand, always needed in South Indian cooking'],
      avg_price_range: '₹100-300/kg',
      best_selling_tips: ['Fresh curry leaves always in demand', 'Supply to hotels/restaurants for steady income', 'Bundle in 50g/100g packs'],
      value_addition: ['Dried curry leaf powder (₹500-1000/kg)', 'Curry leaf oil (very high value)', 'Curry leaf hair oil'],
      storage_days: 7,
      storage_method: 'Wrap in newspaper, refrigerate. Or dry in shade.',
      organic_premium: '20-30% premium',
    },
    nutrition: ['Iron', 'Calcium', 'Phosphorus', 'Vitamin A'],
    fun_fact: 'Curry leaves are NOT related to curry powder! They are a uniquely South Asian ingredient with no real substitute.',
  },

  // ═══════ ROOT & TUBER ═══════
  {
    id: 'turmeric',
    name: 'Turmeric',
    name_te: 'పసుపు',
    category: 'root_tuber',
    image_hint: 'turmeric',
    season: ['Kharif'],
    difficulty: 'medium',
    duration_days: 270,
    spacing_cm: 25,
    water_need: 'high',
    sunlight: 'partial',
    soil_types: ['Sandy Loam', 'Clay Loam'],
    climate_zones: ['Tropical'],
    growing_guide: {
      soil_preparation: ['Rich organic soil with good drainage', 'pH 5.0-7.5', 'Raised beds 15cm high in heavy soils', 'FYM 20 tonnes/acre'],
      sowing_method: 'Plant mother/finger rhizomes 5-7cm deep',
      seed_treatment: 'Treat rhizomes with Trichoderma solution',
      germination_days: 20,
      key_stages: [
        { name: 'Sprouting', day_range: '0-30', tips: ['Keep soil moist', 'Light mulch to retain warmth'] },
        { name: 'Tillering', day_range: '30-90', tips: ['Weeding critical at 40 & 60 days', 'First earthing up at 60 days'] },
        { name: 'Rhizome Development', day_range: '90-210', tips: ['Second earthing up at 90 days', 'Ensure consistent moisture'] },
        { name: 'Maturation', day_range: '210-270', tips: ['Leaves yellowing = harvest time', 'Withhold water last 2 weeks'] },
      ],
      companion_plants: ['Coconut (intercrop)', 'Mango (intercrop)', 'Chilli'],
      avoid_near: ['Full sun (prefers partial shade under trees)'],
    },
    organic: {
      natural_fertilizers: [
        { name: 'FYM + Neem Cake', how: 'Basal application in beds', frequency: 'At planting + 90 days' },
        { name: 'Green Leaf Manure', how: 'Apply as mulch, decomposes to feed crop', frequency: 'Monthly' },
      ],
      natural_pest_control: [
        { pest: 'Rhizome Rot', remedy: 'Trichoderma + good drainage + Bordeaux paste on cut surfaces' },
        { pest: 'Shoot Borer', remedy: 'Remove affected shoots, spray neem oil' },
        { pest: 'Leaf Blotch', remedy: 'Bordeaux mixture spray 1%' },
      ],
      mulching_tips: ['Heavy mulching (12-15cm) is ESSENTIAL for turmeric', 'Green leaves, straw, or coir pith', 'Reduces weeds and retains moisture dramatically'],
      taste_enhancement: ['Erode and Duggirala varieties known for best curcumin', 'Organic turmeric has higher curcumin content', 'Proper curing (boiling + drying) is key to flavor'],
      soil_health_tips: ['Excellent rotation crop after rice', 'Returns organic matter to soil', 'Intercrop under tree canopy'],
    },
    crop_cycle: {
      sowing_window: 'May-June (with onset of monsoon)',
      harvest_window: 'January-March (8-9 months)',
      yield_per_plant: '250-500g fresh rhizome per plant, 20-25 tonnes/acre fresh',
      successive_sowing: 'Annual crop, reserve seed rhizomes from harvest',
      rotation_after: ['Onion', 'Garlic', 'Vegetables', 'Legumes'],
    },
    selling: {
      peak_market_months: ['March', 'April', 'May (post-processing)'],
      avg_price_range: '₹70-200/kg (dried), ₹30-60/kg (fresh)',
      best_selling_tips: [
        'Dried, polished turmeric gets 3x fresh price',
        'High curcumin content (>3%) fetches export premium',
        'Erode (Tamil Nadu) is India\'s largest turmeric market',
        'Organic certification enables export at $5-10/kg',
      ],
      value_addition: ['Turmeric powder (₹200-500/kg)', 'Curcumin extract (pharma grade, very high value)', 'Turmeric paste', 'Turmeric latte/milk premix'],
      storage_days: 180,
      storage_method: 'Dried turmeric stores 6+ months in airtight containers',
      organic_premium: '50-100% premium for certified organic turmeric',
    },
    nutrition: ['Curcumin (anti-inflammatory)', 'Manganese', 'Iron', 'Vitamin B6'],
    fun_fact: 'India produces 80% of the world\'s turmeric! Erode in Tamil Nadu is called "Turmeric City".',
  },

  // ═══════ SPICE ═══════
  {
    id: 'drumstick',
    name: 'Drumstick (Moringa)',
    name_te: 'మునగకాయ',
    category: 'vegetable',
    image_hint: 'moringa',
    season: ['Year-round (perennial)'],
    difficulty: 'easy',
    duration_days: 365,
    spacing_cm: 300,
    water_need: 'low',
    sunlight: 'full',
    soil_types: ['Sandy', 'Sandy Loam', 'Any well-drained'],
    climate_zones: ['Tropical', 'Semi-arid'],
    growing_guide: {
      soil_preparation: ['Tolerates poor soils', 'Avoid waterlogging', 'Pit planting 45x45x45cm with FYM'],
      sowing_method: 'Stem cuttings (1m long, 5cm thick) or seeds',
      germination_days: 10,
      key_stages: [
        { name: 'Establishment', day_range: 'Month 1-3', tips: ['Water weekly only', 'Support cutting until rooted'] },
        { name: 'Growth', day_range: 'Month 3-6', tips: ['Prune at 1m height for branching', 'Very fast growing (up to 3m in first year)'] },
        { name: 'Fruiting', day_range: 'Month 6-12', tips: ['Flowers in clusters, pods develop in 2-3 months', 'Annual pruning maintains manageable height'] },
      ],
      companion_plants: ['Any low-growing vegetables in between', 'Legumes'],
      avoid_near: ['Waterlogged areas'],
    },
    organic: {
      natural_fertilizers: [
        { name: 'FYM', how: '10kg per tree per year', frequency: 'Twice yearly' },
        { name: 'Moringa leaf compost', how: 'Prune excess leaves and compost back', frequency: 'Regular pruning' },
      ],
      natural_pest_control: [
        { pest: 'Pod Fly', remedy: 'Neem oil + timely harvest' },
        { pest: 'Bark Caterpillar', remedy: 'Manual removal + Beauveria bassiana' },
      ],
      mulching_tips: ['Moringa leaf mulch is an excellent biofertilizer for other crops'],
      taste_enhancement: ['Young tender pods (30cm) are most flavorful', 'Fresh leaves are incredibly nutritious', 'Flowers are edible and mildly sweet'],
      soil_health_tips: ['Moringa leaves are natural fertilizer (high nitrogen)', 'Deep roots bring up deep minerals', 'Leaves used as green manure for other crops'],
    },
    crop_cycle: {
      sowing_window: 'February-March or July-August',
      harvest_window: '6-8 months for pods, leaves year-round',
      yield_per_plant: '400-600 pods per tree per year',
      successive_sowing: 'Plant once, harvest for 10+ years',
      rotation_after: ['Perennial — intercrop vegetables'],
    },
    selling: {
      peak_market_months: ['Year-round, peak in winter'],
      avg_price_range: '₹30-80/kg (pods), ₹100-200/kg (leaves)',
      best_selling_tips: ['Moringa leaf powder is a superfood export product', 'Pods sell well in South Indian markets', 'Online health food market is booming for moringa'],
      value_addition: ['Moringa leaf powder (₹500-1500/kg!)', 'Moringa oil (ben oil, cosmetic grade)', 'Moringa capsules (supplement market)', 'Dried flower tea'],
      storage_days: 5,
      storage_method: 'Pods in fridge, leaves dried in shade',
      organic_premium: '50-80% premium for moringa powder',
    },
    nutrition: ['7x Vitamin C of oranges', '4x Calcium of milk', '2x Protein of yogurt', 'Iron, Potassium'],
    fun_fact: 'Moringa is called "The Miracle Tree" — every part is edible: leaves, pods, flowers, seeds, roots, and bark!',
  },

  // ═══════ FLOWER ═══════
  {
    id: 'marigold',
    name: 'Marigold',
    name_te: 'బంతి',
    category: 'flower',
    image_hint: 'marigold',
    season: ['Kharif', 'Rabi', 'Year-round'],
    difficulty: 'easy',
    duration_days: 75,
    spacing_cm: 30,
    water_need: 'medium',
    sunlight: 'full',
    soil_types: ['Any fertile soil'],
    climate_zones: ['Tropical', 'Sub-tropical', 'Temperate'],
    growing_guide: {
      soil_preparation: ['Fertile well-drained soil', 'pH 7.0-7.5', 'FYM 10 tonnes/acre'],
      sowing_method: 'Transplant 4-week nursery seedlings',
      germination_days: 5,
      transplant_days: 25,
      key_stages: [
        { name: 'Nursery', day_range: '0-25', tips: ['Sow in trays or beds', 'Harden before transplant'] },
        { name: 'Vegetative', day_range: '25-40', tips: ['Pinch at 6 leaf stage for branching', 'Water regularly'] },
        { name: 'Flowering', day_range: '40-75', tips: ['Pick flowers every 3-4 days', 'Remove dead heads for continuous blooming'] },
      ],
      companion_plants: ['EVERYTHING! Marigold is the ultimate companion plant — repels nematodes, aphids, and whiteflies'],
      avoid_near: ['None — marigold helps everything'],
    },
    organic: {
      natural_fertilizers: [
        { name: 'Vermicompost', how: '2 tonnes/acre', frequency: 'At planting' },
        { name: 'Panchagavya', how: 'Foliar spray', frequency: 'Every 15 days during flowering' },
      ],
      natural_pest_control: [
        { pest: 'Red Spider Mite', remedy: 'Sulfur spray + increase humidity' },
        { pest: 'Most pests', remedy: 'Marigold itself is a pest repellent!' },
      ],
      mulching_tips: ['Straw mulch between rows'],
      taste_enhancement: ['N/A — grown for flowers, not eating (though petals are edible!)'],
      soil_health_tips: ['Root exudates kill soil nematodes', 'Excellent rotation/companion crop', 'Green manure when incorporated'],
    },
    crop_cycle: {
      sowing_window: 'Year-round, peak plantings before festivals',
      harvest_window: '40-75 days, pick every 3-4 days',
      yield_per_plant: '200-300 flowers per plant per season, 8-10 tonnes/acre',
      successive_sowing: 'Stagger plantings for continuous flower supply',
      rotation_after: ['Any crop benefits from marigold pre-treatment'],
    },
    selling: {
      peak_market_months: ['October (Dussehra/Diwali)', 'January (Sankranti)', 'March (Ugadi)', 'April (Weddings)'],
      avg_price_range: '₹40-200/kg (peaks at festivals)',
      best_selling_tips: ['Festival season prices can be 5-10x normal', 'Time planting 75 days before major festivals', 'Weddings are the biggest market', 'Contract with flower mandis for guaranteed sales'],
      value_addition: ['Garlands', 'Natural dye extraction', 'Marigold oil (lutein extraction for supplements)', 'Dried petals for potpourri'],
      storage_days: 2,
      storage_method: 'Cool transport, sell same or next day',
      organic_premium: '10-20% (flowers have less organic premium than food)',
    },
    nutrition: ['Lutein (eye health)', 'Beta-carotene', 'Edible petals are nutrient-rich'],
    fun_fact: 'Marigold roots secrete alpha-terthienyl which kills root-knot nematodes — farmers plant them as "bio-fumigators"!',
  },
];

// ═══════ CATEGORY METADATA ═══════
export const HORT_CATEGORIES = [
  { id: 'all', name: 'All Crops', name_te: 'అన్ని పంటలు', icon: 'grid', color: '#812F0F' },
  { id: 'vegetable', name: 'Vegetables', name_te: 'కూరగాయలు', icon: 'carrot', color: '#4F8F4A' },
  { id: 'fruit', name: 'Fruits', name_te: 'పండ్లు', icon: 'apple', color: '#E4490D' },
  { id: 'leafy_green', name: 'Leafy Greens', name_te: 'ఆకు కూరలు', icon: 'leaf', color: '#22C55E' },
  { id: 'herb', name: 'Herbs & Spices', name_te: 'సుగంధ ద్రవ్యాలు', icon: 'flower', color: '#8B5CF6' },
  { id: 'root_tuber', name: 'Roots & Tubers', name_te: 'దుంపలు', icon: 'root', color: '#D97706' },
  { id: 'flower', name: 'Flowers', name_te: 'పూలు', icon: 'flower2', color: '#EC4899' },
];

// ═══════ SEASONAL CALENDAR ═══════
export const SEASONAL_CALENDAR: Record<string, string[]> = {
  'January': ['spinach', 'coriander', 'guava', 'papaya'],
  'February': ['okra', 'bitter_gourd', 'banana', 'turmeric', 'marigold'],
  'March': ['okra', 'tomato', 'chilli', 'papaya', 'drumstick'],
  'April': ['tomato', 'mango', 'papaya', 'drumstick'],
  'May': ['mango', 'turmeric', 'banana'],
  'June': ['tomato', 'brinjal', 'okra', 'chilli', 'bitter_gourd', 'turmeric'],
  'July': ['tomato', 'brinjal', 'okra', 'chilli', 'mango', 'banana'],
  'August': ['brinjal', 'okra', 'chilli', 'banana', 'guava'],
  'September': ['tomato', 'brinjal', 'chilli', 'banana', 'guava'],
  'October': ['spinach', 'coriander', 'tomato', 'brinjal', 'marigold'],
  'November': ['spinach', 'coriander', 'guava', 'marigold'],
  'December': ['spinach', 'coriander', 'guava', 'curry_leaf'],
};
