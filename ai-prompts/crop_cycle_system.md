# SOIL-WISE CROP CYCLE SYSTEM
## Indian Crop Intelligence Engine - Technical Documentation

## SYSTEM OVERVIEW

The Indian Crop Intelligence Engine implements a comprehensive soil-aware crop lifecycle intelligence system designed specifically for Indian farming conditions. This system stores, adapts, and exposes soil-specific crop cycles as structured, queryable data to power AI-driven recommendations, alerts, and farmer journals.

---

## ARCHITECTURE

### Data Layer Structure

```
/supabase/functions/server/
├── crop_cycles_types.ts       # TypeScript type definitions
├── crop_cycles_data.ts        # Comprehensive crop cycle database
├── soil_data.ts               # Indian Soil Master Data
└── index.tsx                  # Backend API with AI integration
```

### Core Components

1. **Type System** (`crop_cycles_types.ts`)
   - Universal 10-stage crop cycle structure
   - Soil and crop type definitions
   - Task generation types

2. **Data Repository** (`crop_cycles_data.ts`)
   - Soil-specific crop cycle templates
   - Helper functions for querying cycles
   - Stage-specific information retrieval

3. **AI Integration** (`index.tsx`)
   - OpenAI-powered crop calendar generation
   - Soil-aware reasoning logic
   - Context-aware task recommendations

---

## UNIVERSAL 10-STAGE CROP CYCLE

**MANDATORY**: Every crop cycle follows these exact stages in this order:

1. **Land Preparation**
2. **Seed Selection & Treatment**
3. **Sowing / Planting**
4. **Germination & Establishment**
5. **Vegetative Growth**
6. **Flowering**
7. **Fruiting / Grain Formation**
8. **Maturity**
9. **Harvest**
10. **Post-Harvest Soil Care**

### Stage Data Model

Each stage contains:
- `stage_id`: 1-10 (universal identifier)
- `stage_name`: Exact name from universal list
- `duration_days`: Range (e.g., "10-15", "20-30")
- `soil_specific_notes`: Soil-specific adaptations
- `key_actions`: Critical activities for this stage
- `risk_factors`: Potential problems to watch for
- `ai_alerts`: Actionable recommendations

---

## SOIL → CROP MAPPING (INDIA)

### 1. ALLUVIAL SOIL
**Regions**: Punjab, Haryana, UP, Bihar, West Bengal, Assam  
**Characteristics**: High fertility, good drainage, medium water retention  
**Crops Implemented**:
- Paddy (110-150 days)
- Wheat (120-150 days)
- Sugarcane (300-365 days)
- Maize (90-120 days)

### 2. BLACK SOIL (REGUR)
**Regions**: Maharashtra, Madhya Pradesh, Telangana, Karnataka, Gujarat  
**Characteristics**: High clay, high water retention, poor drainage, prone to cracking  
**Crops Implemented**:
- Cotton (160-180 days)
- Soybean (90-120 days)

### 3. RED SOIL
**Regions**: Tamil Nadu, Karnataka, Andhra Pradesh, Odisha  
**Characteristics**: Low fertility, low water retention, acidic pH, porous  
**Crops Implemented**:
- Groundnut (100-120 days)

### 4. ARID/DESERT SOIL
**Regions**: Rajasthan, Gujarat (arid zones)  
**Characteristics**: Very low fertility, sandy, poor water retention  
**Crops Implemented**:
- Bajra/Pearl Millet (75-95 days)

### 5-10. OTHER SOILS
**Remaining soils**: Laterite, Mountain/Forest, Saline, Alkaline, Peaty/Marshy, Coastal Sandy  
**Status**: Master data available, crop cycles pending implementation

---

## DATA MODEL EXAMPLE

```typescript
{
  "soil_id": "black_soil",
  "crop_id": "cotton",
  "crop_name": "Cotton",
  "crop_cycle_duration_days": "160-180",
  "stages": [
    {
      "stage_id": 1,
      "stage_name": "Land Preparation",
      "duration_days": "15-20",
      "soil_specific_notes": "Deep ploughing reduces cracking tendency of black soil",
      "key_actions": ["Deep ploughing up to 20-25 cm", "Apply FYM 10 tonnes/ha"],
      "risk_factors": ["Waterlogging in monsoon", "Soil cracking"],
      "ai_alerts": ["Ensure proper drainage", "Deep plough to reduce cracking"]
    },
    // ... stages 2-10
  ]
}
```

---

## AI REASONING LOGIC

### Workflow

```
User Field Data → Soil Type Validation → Crop Cycle Lookup → AI Context Building
                                              ↓
                        Stage Calculation ← Planting Date Analysis
                                              ↓
                        Task Generation ← OpenAI GPT-4o ← Enhanced Prompt
                                              ↓
                        Soil-Specific Tasks → Farmer Dashboard
```

### AI Prompt Structure

1. **System Prompt**:
   - Expert Indian agricultural AI role
   - Mandatory soil-specific reasoning
   - Validation rules enforcement
   - No Western assumptions allowed

2. **User Prompt Components**:
   - Field information (crop, soil, location, planting date)
   - Indian Soil Master Data
   - Soil-specific crop cycle data (if available)
   - Current growth stage calculation
   - Suitable crop alternatives

3. **Output Format**:
   - Structured JSON tasks
   - Stage-aligned recommendations
   - Soil-aware reasoning in each task
   - Urgent/non-urgent classification

---

## HELPER FUNCTIONS

### `getCropCycle(soilId, cropId)`
Retrieves specific crop cycle for soil-crop combination.

```typescript
const cycle = getCropCycle("black_soil", "cotton");
// Returns: Full cotton crop cycle for black soil
```

### `getCropsBySoil(soilId)`
Returns all suitable crops for a soil type.

```typescript
const crops = getCropsBySoil("alluvial_soil");
// Returns: [Paddy, Wheat, Sugarcane, Maize]
```

### `getSoilsByCrop(cropId)`
Returns all soil types suitable for a crop.

```typescript
const soils = getSoilsByCrop("paddy");
// Returns: All soil types where paddy can be grown
```

### `getCropStage(soilId, cropId, stageId)`
Retrieves specific stage information.

```typescript
const stage = getCropStage("black_soil", "cotton", 7);
// Returns: Boll Formation stage details for cotton in black soil
```

---

## APP INTEGRATION POINTS

The crop cycle system integrates with:

1. **Field Management** (`FieldManagement.tsx`)
   - Soil type selection (enforced)
   - Crop selection validation
   - Planting date tracking

2. **Crop Calendar** (`CropDetailView.tsx`)
   - AI-generated task recommendations
   - Stage-based progress tracking
   - Soil-aware alerts

3. **Farming Journal** (`FarmingJournal.tsx`)
   - Stage-specific prompts
   - Activity tracking by growth stage

4. **Chatbot** (`MSChatbot.tsx`)
   - Soil-aware Q&A
   - Crop cycle reference in responses

---

## VALIDATION RULES

### Mandatory Checks

1. **Stage Order**: Never change the universal 10-stage sequence
2. **Soil Constraints**: Must affect at least 3 stages per crop
3. **Duration Accuracy**: Must match Indian agronomic standards
4. **No Generic Advice**: All recommendations must be soil-specific

### Data Quality

- ✅ All stages must have non-empty `soil_specific_notes`
- ✅ `key_actions` array must have 2+ actionable items
- ✅ `risk_factors` must be region/soil-relevant
- ✅ `ai_alerts` must be contextually precise

### AI Output Validation

- ✅ Task types must match predefined categories
- ✅ Date calculations must be planting-date-relative
- ✅ Reason must reference soil type explicitly
- ✅ Stage references (optional) must be 1-10

---

## EXPANSION GUIDELINES

### Adding New Crops

1. Identify soil type from SOIL_MASTER_DATA
2. Create crop cycle object following the template
3. Populate all 10 stages with soil-specific data
4. Add to `CROP_CYCLES_DATABASE` array
5. Update crop mapping documentation

### Example Template

```typescript
const SOIL_TYPE_CROP: CropCycle = {
  soil_id: "soil_type_id",
  crop_id: "crop_identifier",
  crop_name: "Display Name",
  crop_cycle_duration_days: "min-max",
  stages: [
    {
      stage_id: 1,
      stage_name: "Land Preparation",
      duration_days: "10-15",
      soil_specific_notes: "[Why this matters for this soil]",
      key_actions: ["Action 1", "Action 2", "Action 3"],
      risk_factors: ["Risk 1", "Risk 2"],
      ai_alerts: ["Alert 1", "Alert 2"]
    },
    // ... complete all 10 stages
  ]
};
```

---

## API ENDPOINTS

### Generate Crop Calendar

**POST** `/make-server-6fdef95d/ai/generate-calendar`

**Request Body**:
```json
{
  "cropName": "Cotton",
  "plantingDate": "2024-06-15",
  "location": "Maharashtra",
  "fieldName": "Field A",
  "soilType": "black_soil"
}
```

**Response**:
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Deep Plough to Prevent Cracking",
      "date": "In 2 days",
      "type": "Land Preparation",
      "urgent": true,
      "reason": "Black soil requires deep ploughing to reduce cracking tendency",
      "stage_id": 1,
      "stage_name": "Land Preparation"
    }
  ]
}
```

---

## IMPLEMENTATION STATUS

### ✅ Complete
- Universal 10-stage structure
- Type system and interfaces
- Alluvial soil crops (Paddy, Wheat, Sugarcane, Maize)
- Black soil crops (Cotton, Soybean)
- Red soil crops (Groundnut)
- Arid soil crops (Bajra)
- AI integration with OpenAI GPT-4o
- Helper functions for data queries
- Backend API endpoints

### 🚧 Pending
- Laterite soil crops (Tea, Coffee, Cashew, Coconut)
- Mountain/Forest soil crops (Apple, Maize, Barley)
- Saline/Alkaline soil crops (Barley, Salt-tolerant Paddy)
- Additional varieties for existing crops
- Regional language translations
- Offline fallback data

### 🎯 Future Enhancements
- Real-time weather integration into stage recommendations
- Satellite imagery integration for stage verification
- Soil test result integration for nutrient recommendations
- Market price integration for harvest timing
- Pest/disease outbreak alerts by region and stage
- Climate adaptation recommendations

---

## CONFIRMATION CHECKLIST

- ✅ All soils have master data
- ✅ 8 major crops mapped across 4 soil types
- ✅ Cycles are reusable and queryable
- ✅ AI reasoning uses structured data
- ✅ Alerts are stage-specific and functional
- ✅ Soil constraints integrated into recommendations
- ✅ No Western assumptions in data
- ✅ Indian agronomic standards followed

---

## CONTACT & MAINTENANCE

For questions or contributions:
1. Review existing crop cycles in `crop_cycles_data.ts`
2. Follow the 10-stage universal structure strictly
3. Ensure soil-specific notes are agronomically accurate
4. Test AI outputs with real farmer scenarios
5. Validate against Indian agricultural research papers

**Last Updated**: December 25, 2024  
**Version**: 1.0  
**Status**: Production-Ready for Phase 1 Crops
