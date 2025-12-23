import * as Engine from './engine';
import { SeedCalculationRequest, CropStatusRequest, VarietyFullDetails } from './types';

/**
 * Crop Intelligence Service
 * Simulates API endpoints for the frontend.
 * In a real backend, these would be HTTP handlers.
 */

export const CropIntelligenceService = {
  
  /**
   * GET /api/crops
   * Returns list of supported crops and their varieties
   */
  async getCrops() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return Engine.getCropList();
  },

  async getVarietyFullDetails(cropId: string, varietyId: string): Promise<VarietyFullDetails | null> {
     await new Promise(resolve => setTimeout(resolve, 300));
     try {
       return Engine.getVarietyFullDetails(cropId, varietyId);
     } catch (e) {
       console.error(e);
       return null;
     }
  },

  /**
   * POST /api/calculate-seed-rate
   * Calculates required seed quantity based on acres and germination
   */
  async calculateSeedRate(params: SeedCalculationRequest) {
    await new Promise(resolve => setTimeout(resolve, 200));
    try {
      return { 
        success: true, 
        data: Engine.calculateSeedRate(params) 
      };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  /**
   * GET /api/crop-status
   * Returns current growth stage and risks based on sowing date
   */
  async getCropStatus(params: CropStatusRequest) {
    await new Promise(resolve => setTimeout(resolve, 150));
    try {
      return { 
        success: true, 
        data: Engine.getCropStatus(params) 
      };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  /**
   * GET /api/variety-details
   */
  async getVarietyDetails(cropId: string, varietyId: string) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const data = Engine.getVarietyDetails(cropId, varietyId);
    return { success: !!data, data };
  }
};

/* 
EXAMPLE API RESPONSES

1. calculateSeedRate({ cropId: 'groundnut', varietyId: 'g-41', acres: 2.5, germinationPercentage: 75 })
Response:
{
  "requiredKg": 141.67,
  "baseKg": 125,
  "isAdjusted": true,
  "adjustmentFactor": 1.133,
  "adjustmentReason": "Low germination (75% vs std 85%). Increased seed rate by 13%.",
  "confidence": "High",
  "treatmentRecommendation": {
    "fungicide": "Trichoderma viride @ 4g/kg",
    "bioInoculant": "Rhizobium (Groundnut specific)",
    "purpose": "Prevent collar rot & enhance nitrogen fixation"
  }
}

2. getCropStatus({ cropId: 'paddy', varietyId: 'mtu-1010', sowingDate: '2023-10-01' })
Response:
{
  "currentStage": {
    "id": "panicle",
    "name": "Panicle Initiation",
    "startDay": 56,
    "endDay": 75,
    "focus": "Water management",
    "risk": "Leaf folder"
  },
  "daysAfterSowing": 65,
  "nextCriticalAction": "Water management",
  "daysToNextStage": 10,
  "primaryRisk": "Leaf folder"
}
*/
