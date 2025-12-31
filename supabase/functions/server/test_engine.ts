
import { CropEngine } from "./ce_simulation.ts";
import { PADDY_PROFILE } from "./ce_data.ts";
import { Field, DailyWeather, FarmOperation } from "./ce_models.ts";

// Setup Test Data
const field: Field = {
    id: "test_field",
    area_ha: 1,
    soil_type: "Clay",
    soil_properties: { ph: 6.5, organic_matter_pct: 1, texture: "Clay", nitrogen_level: "Medium" },
    water_holding_capacity_mm: 150,
    wilting_point_mm: 60,
    current_soil_water_mm: 100,
    current_nitrogen_kg_ha: 50,
    location: { lat: 30, lon: 75 }
};

const weather: DailyWeather[] = [];
for(let i=0; i<10; i++) {
    weather.push({
        date: `2024-06-1${i}`,
        t_max: 35,
        t_min: 25,
        rainfall_mm: i === 3 ? 20 : 0, // Rain on day 3
        humidity_pct: 60
    });
}

const ops: FarmOperation[] = [
    { date: "2024-06-12", operation_type: "Irrigation", quantity: 50 }
];

console.log("Running Simulation...");
const result = CropEngine.simulateSeason(field, PADDY_PROFILE, weather, ops, "2024-06-10");

console.log("\n--- Daily Logs (First 5 Days) ---");
result.logs.slice(0, 5).forEach(log => {
    console.log(`Day ${log.day_index} (${log.date}): Stage=${log.stage_name}, Water=${log.water_balance.end}mm, Stress=${log.stress.combined}, Biomass=+${log.growth.biomass_gain}`);
});

console.log("\n--- Summary ---");
console.log(JSON.stringify(result.summary, null, 2));
