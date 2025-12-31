
import { projectId, publicAnonKey } from '../../utils/supabase/info';

// Configuration
const PROJECT_ID = projectId;
const ANON_KEY = publicAnonKey;
const URL = `https://${PROJECT_ID}.supabase.co/functions/v1/make-server-6fdef95d/simulation/run-v2`;

// Payload matching SimulationParamsV2 in api.ts
const payload = {
  startDate: "2024-06-15",
  initialSoilWater: 60,
  initialNitrogen: 50,
  operations: [] 
};

console.log("Testing Frontend V2 Integration Logic...");
console.log("URL:", URL);
console.log("Payload:", JSON.stringify(payload, null, 2));

// Simulate fetch
fetch(URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${ANON_KEY}`
  },
  body: JSON.stringify(payload)
})
.then(async response => {
  if (!response.ok) {
     const text = await response.text();
     throw new Error(`Server error ${response.status}: ${text}`);
  }
  return response.json();
})
.then(data => {
  console.log("✅ API V2 Integration Verification SUCCESS");
  console.log("Received valid SeasonResultV2");
  if (data.logs && data.logs.length > 0 && data.logs[0].growth && typeof data.logs[0].growth.accumulated_biomass === 'number') {
      console.log("✅ 'accumulated_biomass' field confirmed present in response.");
  } else {
      console.error("❌ MISSING 'accumulated_biomass' field in response!");
      console.log("Sample log:", data.logs[0]);
  }
})
.catch(err => {
  console.error("❌ Integration Test FAILED:", err);
});
