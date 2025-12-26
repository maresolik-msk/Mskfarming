# CROP CYCLE SYSTEM - DEVELOPER QUICK REFERENCE

## Quick Start

### 1. Query Crop Cycle Data

```typescript
import { getCropCycle, getCropsBySoil } from './crop_cycles_data.ts';

// Get specific crop cycle
const cottonCycle = getCropCycle("black_soil", "cotton");
console.log(cottonCycle.crop_cycle_duration_days); // "160-180"
console.log(cottonCycle.stages.length); // 10

// Get all suitable crops for a soil
const alluvialCrops = getCropsBySoil("alluvial_soil");
console.log(alluvialCrops.map(c => c.crop_name)); 
// ["Paddy (Rice)", "Wheat", "Sugarcane", "Maize"]

// Get specific stage
const floweringStage = cottonCycle.stages.find(s => s.stage_id === 6);
console.log(floweringStage.stage_name); // "Flowering"
console.log(floweringStage.ai_alerts);
```

### 2. Calculate Current Growth Stage

```typescript
function getCurrentStage(plantingDate: string, cropCycle: CropCycle) {
  const planted = new Date(plantingDate);
  const today = new Date();
  const daysSincePlanting = Math.floor(
    (today.getTime() - planted.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  let cumulativeDays = 0;
  for (const stage of cropCycle.stages) {
    const [min, max] = stage.duration_days.split('-').map(Number);
    const avgDuration = (min + max) / 2;
    cumulativeDays += avgDuration;
    
    if (daysSincePlanting <= cumulativeDays) {
      return {
        stage_id: stage.stage_id,
        stage_name: stage.stage_name,
        days_in_stage: daysSincePlanting - (cumulativeDays - avgDuration),
        total_days_since_planting: daysSincePlanting
      };
    }
  }
  
  // Past harvest
  return { stage_id: 10, stage_name: "Post-Harvest Soil Care" };
}
```

### 3. Normalize Crop Names

```typescript
function normalizeCropName(cropName: string): string {
  // "Paddy (Rice)" -> "paddy"
  // "Pearl Millet" -> "pearl_millet"
  // "Cotton" -> "cotton"
  
  return cropName
    .toLowerCase()
    .replace(/\s*\([^)]*\)/g, '') // Remove parentheses
    .trim()
    .replace(/\s+/g, '_'); // Replace spaces with underscores
}

// Examples
normalizeCropName("Paddy (Rice)"); // "paddy"
normalizeCropName("Pearl Millet"); // "pearl_millet"
normalizeCropName("Cotton"); // "cotton"
```

## Soil Type IDs Reference

```typescript
type SoilTypeId =
  | "alluvial_soil"        // Punjab, Haryana, UP, Bihar
  | "black_soil"           // Maharashtra, MP, Karnataka
  | "red_soil"             // Tamil Nadu, Karnataka, AP
  | "laterite_soil"        // Kerala, Goa, Karnataka
  | "arid_soil"            // Rajasthan, Gujarat
  | "mountain_forest_soil" // Himachal, Uttarakhand
  | "saline_soil"          // Coastal areas, Gujarat
  | "alkaline_soil"        // UP, Punjab, Haryana
  | "peaty_marshy_soil"    // Kerala, West Bengal
  | "coastal_sandy_soil";  // Tamil Nadu, Odisha coasts
```

## Crop IDs Reference (Currently Implemented)

```typescript
// Alluvial Soil
"paddy"      // Paddy (Rice) - 110-150 days
"wheat"      // Wheat - 120-150 days
"sugarcane"  // Sugarcane - 300-365 days
"maize"      // Maize - 90-120 days

// Black Soil
"cotton"     // Cotton - 160-180 days
"soybean"    // Soybean - 90-120 days

// Red Soil
"groundnut"  // Groundnut - 100-120 days

// Arid Soil
"bajra"      // Bajra (Pearl Millet) - 75-95 days
```

## Task Type Reference

```typescript
type TaskType =
  | "Land Preparation"  // Ploughing, levelling, FYM
  | "Seed Treatment"    // Seed selection, treatment
  | "Sowing"           // Planting operations
  | "Irrigation"       // Water management
  | "Nutrients"        // Fertilizer application
  | "Pest Control"     // Pest/disease management
  | "Watering"         // General water needs
  | "Health"           // Crop health monitoring
  | "Harvesting"       // Harvest operations
  | "Soil Care"        // Post-harvest, amendments
  | "Maintenance";     // General field upkeep
```

## API Request Examples

### Generate Crop Calendar

```bash
curl -X POST https://[project-id].supabase.co/functions/v1/make-server-6fdef95d/ai/generate-calendar \
  -H "Authorization: Bearer [access_token]" \
  -H "Content-Type: application/json" \
  -d '{
    "cropName": "Cotton",
    "plantingDate": "2024-06-20",
    "location": "Maharashtra",
    "fieldName": "Main Field",
    "soilType": "black_soil"
  }'
```

### Response Format

```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Deep Plough to Prevent Cracking",
      "date": "In 2 days",
      "type": "Land Preparation",
      "urgent": true,
      "reason": "Black soil requires deep ploughing...",
      "stage_id": 1,
      "stage_name": "Land Preparation"
    }
  ]
}
```

## Common Patterns

### Pattern 1: Validate Crop-Soil Combination

```typescript
function isValidCombination(soilId: string, cropId: string): boolean {
  const cycle = getCropCycle(soilId, cropId);
  return cycle !== undefined;
}

// Usage
if (!isValidCombination("laterite_soil", "wheat")) {
  const alternatives = getCropsBySoil("laterite_soil");
  console.log("Consider:", alternatives.map(c => c.crop_name));
}
```

### Pattern 2: Get Next Recommended Actions

```typescript
function getNextActions(soilId: string, cropId: string, stageId: number) {
  const cycle = getCropCycle(soilId, cropId);
  if (!cycle) return [];
  
  const currentStage = cycle.stages.find(s => s.stage_id === stageId);
  if (!currentStage) return [];
  
  return {
    actions: currentStage.key_actions,
    risks: currentStage.risk_factors,
    alerts: currentStage.ai_alerts,
    notes: currentStage.soil_specific_notes
  };
}
```

### Pattern 3: Generate Stage-Based Timeline

```typescript
function generateTimeline(cropCycle: CropCycle, plantingDate: string) {
  const planted = new Date(plantingDate);
  const timeline = [];
  let cumulativeDays = 0;
  
  for (const stage of cropCycle.stages) {
    const [min, max] = stage.duration_days.split('-').map(Number);
    const avgDuration = (min + max) / 2;
    
    const startDate = new Date(planted);
    startDate.setDate(startDate.getDate() + cumulativeDays);
    
    const endDate = new Date(planted);
    endDate.setDate(endDate.getDate() + cumulativeDays + avgDuration);
    
    timeline.push({
      stage_id: stage.stage_id,
      stage_name: stage.stage_name,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      duration_days: avgDuration
    });
    
    cumulativeDays += avgDuration;
  }
  
  return timeline;
}

// Usage
const timeline = generateTimeline(cottonCycle, "2024-06-20");
console.log(timeline);
// [
//   { stage_id: 1, stage_name: "Land Preparation", start_date: "2024-06-20", end_date: "2024-07-07", ... },
//   ...
// ]
```

## Debugging Tips

### Enable Verbose Logging

```typescript
// In backend endpoint
console.log('=== CROP CALENDAR DEBUG ===');
console.log('Input:', { cropName, soilType, plantingDate });
console.log('Normalized Crop ID:', cropId);
console.log('Crop Cycle Found:', !!cropCycle);
if (cropCycle) {
  console.log('Cycle Duration:', cropCycle.crop_cycle_duration_days);
  console.log('Stages Count:', cropCycle.stages.length);
}
```

### Validate Stage Data Completeness

```typescript
function validateCropCycle(cycle: CropCycle): string[] {
  const errors: string[] = [];
  
  if (cycle.stages.length !== 10) {
    errors.push(`Expected 10 stages, got ${cycle.stages.length}`);
  }
  
  cycle.stages.forEach((stage, index) => {
    if (stage.stage_id !== index + 1) {
      errors.push(`Stage ${index + 1} has wrong ID: ${stage.stage_id}`);
    }
    if (!stage.soil_specific_notes) {
      errors.push(`Stage ${stage.stage_id} missing soil_specific_notes`);
    }
    if (stage.key_actions.length < 2) {
      errors.push(`Stage ${stage.stage_id} has too few key_actions`);
    }
  });
  
  return errors;
}
```

## Frontend Integration Examples

### React Hook for Crop Cycle Data

```typescript
import { useState, useEffect } from 'react';

function useCropCycle(soilType: string, cropName: string) {
  const [cycle, setCycle] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real implementation, this would be fetched from backend
    // For now, assume getCropCycle is available client-side or via API
    const fetchCycle = async () => {
      try {
        const cropId = cropName.toLowerCase().replace(/\s+/g, '_');
        const response = await fetch(`/api/crop-cycles/${soilType}/${cropId}`);
        const data = await response.json();
        setCycle(data);
      } catch (error) {
        console.error('Failed to fetch crop cycle:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCycle();
  }, [soilType, cropName]);
  
  return { cycle, loading };
}

// Usage
function CropDetails({ soilType, cropName }) {
  const { cycle, loading } = useCropCycle(soilType, cropName);
  
  if (loading) return <div>Loading...</div>;
  if (!cycle) return <div>No data available</div>;
  
  return (
    <div>
      <h2>{cycle.crop_name}</h2>
      <p>Duration: {cycle.crop_cycle_duration_days} days</p>
      <ul>
        {cycle.stages.map(stage => (
          <li key={stage.stage_id}>{stage.stage_name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Error Handling

### Handle Missing Crop Cycles

```typescript
async function generateCalendar(req: Request) {
  const { cropName, soilType } = await req.json();
  const cropId = normalizeCropName(cropName);
  const cropCycle = getCropCycle(soilType, cropId);
  
  if (!cropCycle) {
    // Get alternatives
    const alternatives = getCropsBySoil(soilType);
    
    return Response.json({
      error: 'Crop cycle not found',
      message: `${cropName} data not available for ${soilType}`,
      alternatives: alternatives.map(c => ({
        name: c.crop_name,
        duration: c.crop_cycle_duration_days
      })),
      fallback_tasks: generateFallbackTasks(soilType, cropName)
    });
  }
  
  // Continue with normal flow
  return generateAICalendar(cropCycle, ...);
}
```

## Testing Utilities

### Mock Crop Cycle Data

```typescript
const MOCK_CROP_CYCLE: CropCycle = {
  soil_id: "test_soil",
  crop_id: "test_crop",
  crop_name: "Test Crop",
  crop_cycle_duration_days: "100-120",
  stages: Array.from({ length: 10 }, (_, i) => ({
    stage_id: (i + 1) as CropStageId,
    stage_name: ["Land Preparation", "Seed Selection & Treatment", ...][i] as CropStageName,
    duration_days: "10-15",
    soil_specific_notes: "Test notes",
    key_actions: ["Action 1", "Action 2"],
    risk_factors: ["Risk 1"],
    ai_alerts: ["Alert 1"]
  }))
};
```

### Unit Test Example

```typescript
import { getCropCycle, getCropsBySoil } from './crop_cycles_data';

describe('Crop Cycle System', () => {
  test('should retrieve paddy cycle for alluvial soil', () => {
    const cycle = getCropCycle('alluvial_soil', 'paddy');
    expect(cycle).toBeDefined();
    expect(cycle?.crop_name).toBe('Paddy (Rice)');
    expect(cycle?.stages).toHaveLength(10);
  });
  
  test('should return undefined for invalid combination', () => {
    const cycle = getCropCycle('arid_soil', 'paddy');
    expect(cycle).toBeUndefined();
  });
  
  test('should get all alluvial crops', () => {
    const crops = getCropsBySoil('alluvial_soil');
    expect(crops.length).toBeGreaterThan(0);
    expect(crops.map(c => c.crop_id)).toContain('paddy');
  });
});
```

## Performance Optimization

### Cache Crop Cycles

```typescript
const cropCycleCache = new Map<string, CropCycle>();

function getCropCycleCached(soilId: string, cropId: string): CropCycle | undefined {
  const key = `${soilId}:${cropId}`;
  
  if (!cropCycleCache.has(key)) {
    const cycle = getCropCycle(soilId, cropId);
    if (cycle) {
      cropCycleCache.set(key, cycle);
    }
  }
  
  return cropCycleCache.get(key);
}
```

## Constants & Enums

```typescript
// Universal Stage Names (NEVER CHANGE ORDER)
export const UNIVERSAL_STAGES = [
  "Land Preparation",
  "Seed Selection & Treatment",
  "Sowing / Planting",
  "Germination & Establishment",
  "Vegetative Growth",
  "Flowering",
  "Fruiting / Grain Formation",
  "Maturity",
  "Harvest",
  "Post-Harvest Soil Care"
] as const;

// Soil Categories
export const SOIL_CATEGORIES = {
  PRIMARY: ["alluvial_soil", "black_soil", "red_soil", "laterite_soil", "arid_soil", "mountain_forest_soil"],
  PROBLEMATIC: ["saline_soil", "alkaline_soil", "peaty_marshy_soil", "coastal_sandy_soil"]
} as const;
```

---

**Last Updated**: December 25, 2024  
**Quick Reference Version**: 1.0
