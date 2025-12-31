
import { 
    Field, 
    CropProfile, 
    DailyWeather, 
    FarmOperation, 
    DailySimulationOutput, 
    CropState,
    SeasonResult 
  } from "./ce_models.ts";
  
  /**
   * Crop Growth Engine Implementation
   * A deterministic, daily time-step simulator for crop phenology and yield.
   */
  export class CropEngine {
    
    /**
     * Run a full season simulation
     */
    public static simulateSeason(
      field: Field,
      profile: CropProfile,
      weatherHistory: DailyWeather[],
      operations: FarmOperation[],
      startDate: string
    ): SeasonResult {
      // 1. Initialize State
      let state: CropState = {
        current_stage_index: 0,
        accumulated_gdd: 0,
        stage_accumulated_gdd: 0,
        biomass_kg_ha: 0,
        yield_pool_t_ha: profile.yield_potential_t_per_ha,
        stress_history: { water: [], nutrient: [], temperature: [] },
        health_score: 100,
        days_elapsed: 0,
        is_mature: false
      };
  
      // Copy field state to avoid mutation of input
      let soilWater = field.current_soil_water_mm;
      let soilNitrogen = field.current_nitrogen_kg_ha || 50; // Default soil N pool
  
      const logs: DailySimulationOutput[] = [];
      const totalStages = profile.stages.length;
      
      let totalRain = 0;
      let totalIrrigation = 0;
      
      // Sort operations
      const sortedOps = [...operations].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
      // 2. Daily Loop
      // Filter weather from start date
      const seasonWeather = weatherHistory
        .filter(w => new Date(w.date) >= new Date(startDate))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
      for (const weather of seasonWeather) {
        if (state.is_mature) break;
  
        // A. Get operations for today
        const todaysOps = sortedOps.filter(op => op.date === weather.date);
        let irrigationToday = 0;
        let fertNToday = 0;
  
        todaysOps.forEach(op => {
          if (op.operation_type === 'Irrigation') {
            irrigationToday += (op.quantity || 0);
          } else if (op.operation_type === 'Fertilizer') {
            // Assume quantity is kg/ha, and nutrient content determines N
            // If nutrient_content missing, assume Urea (46% N) as fallback default
            const nPct = op.nutrient_content?.n_pct ?? 0.46;
            fertNToday += (op.quantity || 0) * nPct;
          }
        });
        
        totalIrrigation += irrigationToday;
        totalRain += weather.rainfall_mm;
        
        // Update Nutrient Pool
        soilNitrogen += fertNToday;
  
        // B. Simulate Day Logic
        const currentStage = profile.stages[state.current_stage_index];
        
        // 1. Calculate GDD
        const tAvg = (weather.t_max + weather.t_min) / 2;
        let gdd = Math.max(0, tAvg - profile.base_temperature);
        // Cap GDD if temp > max_temp (simple plateau or reduction)
        if (tAvg > profile.max_temperature) {
             gdd = 0; // Growth stops at extreme heat
        }
        
        // 2. Accumulate GDD
        state.accumulated_gdd += gdd;
        state.stage_accumulated_gdd += gdd;
        state.days_elapsed++;
  
        // 3. Water Balance
        // ETc = ETo * Kc (simplified)
        // Estimate ETo from Temp (Hargreaves approx)
        // ETo ~ 0.0023 * (Tmean + 17.8) * (Tmax - Tmin)^0.5 * Ra
        // Simplified: roughly 4-6mm/day in tropics. 
        // We use stage requirement as the demand directly (simulating Kc * ETo)
        const waterDemand = currentStage.water_requirement_mm_per_day;
        
        // Soil water update
        const waterStart = soilWater;
        // Inflow
        soilWater += weather.rainfall_mm + irrigationToday;
        
        // Outflow (Evapotranspiration)
        // Actual ET depends on availability
        let actualET = waterDemand;
        let drainage = 0;
        
        // Capacity check
        if (soilWater > field.water_holding_capacity_mm) {
            drainage = soilWater - field.water_holding_capacity_mm;
            soilWater = field.water_holding_capacity_mm;
        }
        
        // Available for plant?
        let waterStressFactor = 0; // 0 = No stress, 1 = Max stress
        if (soilWater < field.wilting_point_mm) {
            actualET = 0;
            waterStressFactor = 1.0;
        } else if (soilWater < (field.wilting_point_mm + 0.5 * (field.water_holding_capacity_mm - field.wilting_point_mm))) {
            // Linear stress below 50% available water
            const available = soilWater - field.wilting_point_mm;
            const maxAvailable = field.water_holding_capacity_mm - field.wilting_point_mm;
            const fraction = available / maxAvailable;
            // Stress starts at 0.5 fraction
            // fraction 0.5 -> stress 0
            // fraction 0.0 -> stress 1
            if (fraction < 0.5) {
                waterStressFactor = (0.5 - fraction) * 2; // Map 0.5-0 to 0-1
                actualET = waterDemand * (1 - waterStressFactor); // Reduce ET
            }
        }
        
        soilWater -= actualET;
        if (soilWater < field.wilting_point_mm) soilWater = field.wilting_point_mm;
  
        // 4. Nutrient Stress
        // Simplified N depletion: Crop uses ~2kg N per ton of biomass? 
        // Let's assume daily N demand is proportional to growth.
        // If N pool < threshold, stress.
        let nutrientStressFactor = 0;
        if (soilNitrogen < 10) { // arbitrary threshold 10kg/ha
            nutrientStressFactor = (10 - soilNitrogen) / 10;
        }
        // Deplete N (simple constant consumption per day for active growth)
        soilNitrogen = Math.max(0, soilNitrogen - 0.5); 
  
        // 5. Temperature Stress
        // Heat stress if Tmax > Opt
        let tempStressFactor = 0;
        if (weather.t_max > profile.opt_temperature) {
            tempStressFactor = Math.min(1, (weather.t_max - profile.opt_temperature) / (profile.max_temperature - profile.opt_temperature));
        }
  
        // 6. Calculate Growth & Yield Impact
        // Aggregate Stress
        const combinedStress = Math.max(waterStressFactor, nutrientStressFactor, tempStressFactor);
        
        // Apply sensitivity
        const stageSensitivity = currentStage.stress_sensitivity_multiplier;
        const effectiveStress = Math.min(1, combinedStress * stageSensitivity);
        
        // Biomass accumulation (Vegetative logic)
        // Potential growth ~ 200 kg/ha/day in peak? Simplified model:
        const potentialBiomassDaily = 150; // kg/ha
        const actualBiomass = potentialBiomassDaily * (1 - effectiveStress);
        state.biomass_kg_ha += actualBiomass;
        
        // Yield Penalty (Reproductive logic)
        let yieldPenalty = 0;
        if (currentStage.stage_name.includes("Flowering") || currentStage.stage_name.includes("Grain")) {
            // Stress directly reduces yield potential
            const dailyPenaltyPct = 0.02 * effectiveStress; // 2% loss per day of full stress?
            const loss = state.yield_pool_t_ha * dailyPenaltyPct;
            state.yield_pool_t_ha -= loss;
            yieldPenalty = loss;
        }
  
        // Log history
        state.stress_history.water.push(waterStressFactor);
        state.stress_history.nutrient.push(nutrientStressFactor);
        state.stress_history.temperature.push(tempStressFactor);
  
        // Advisory Generation
        let advisory = "Conditions optimal.";
        if (waterStressFactor > 0.4) advisory = "Severe water stress detected. Irrigate immediately.";
        else if (waterStressFactor > 0.1) advisory = "Soil moisture declining. Plan irrigation soon.";
        else if (tempStressFactor > 0.5) advisory = "Heat stress alert. Protect crop if possible.";
        else if (nutrientStressFactor > 0.3) advisory = "Nutrient deficiency likely. Consider top dressing.";
  
        logs.push({
            day_index: state.days_elapsed,
            date: weather.date,
            stage_name: currentStage.stage_name,
            gdd_today: gdd,
            accumulated_gdd: state.accumulated_gdd,
            water_balance: {
                start: parseFloat(waterStart.toFixed(1)),
                rain: weather.rainfall_mm,
                irrigation: irrigationToday,
                et: parseFloat(actualET.toFixed(1)),
                drainage: parseFloat(drainage.toFixed(1)),
                end: parseFloat(soilWater.toFixed(1))
            },
            stress: {
                water: parseFloat(waterStressFactor.toFixed(2)),
                nutrient: parseFloat(nutrientStressFactor.toFixed(2)),
                temperature: parseFloat(tempStressFactor.toFixed(2)),
                combined: parseFloat(combinedStress.toFixed(2))
            },
            growth: {
                biomass_gain: parseFloat(actualBiomass.toFixed(1)),
                accumulated_biomass: parseFloat(state.biomass_kg_ha.toFixed(1)),
                yield_potential_penalty: parseFloat(yieldPenalty.toFixed(3))
            },
            advisory
        });
  
        // 7. Stage Transition Check
        if (state.stage_accumulated_gdd >= currentStage.gdd_required) {
            // Move to next stage
            if (state.current_stage_index < totalStages - 1) {
                state.current_stage_index++;
                state.stage_accumulated_gdd = 0; // Reset for next stage
            } else {
                state.is_mature = true;
            }
        }
      }
      
      // Final Summary
      const finalYield = Math.max(0, state.yield_pool_t_ha);
      const yieldPct = (finalYield / profile.yield_potential_t_per_ha) * 100;
      
      // Determine limiting factors
      const factors = [];
      const avgWaterStress = state.stress_history.water.reduce((a,b)=>a+b,0) / state.days_elapsed;
      const avgNutrientStress = state.stress_history.nutrient.reduce((a,b)=>a+b,0) / state.days_elapsed;
      const avgTempStress = state.stress_history.temperature.reduce((a,b)=>a+b,0) / state.days_elapsed;
      
      if (avgWaterStress > 0.1) factors.push("Water Availability");
      if (avgNutrientStress > 0.1) factors.push("Nutrient Deficiency");
      if (avgTempStress > 0.1) factors.push("Temperature Extremes");
  
      return {
        logs,
        summary: {
            total_days: state.days_elapsed,
            total_rainfall: totalRain,
            total_irrigation: totalIrrigation,
            final_yield_t_ha: parseFloat(finalYield.toFixed(2)),
            yield_potential_realized_pct: parseFloat(yieldPct.toFixed(1)),
            key_limiting_factors: factors.length > 0 ? factors : ["None"],
            harvest_date: logs[logs.length-1].date
        }
      };
    }
  }
