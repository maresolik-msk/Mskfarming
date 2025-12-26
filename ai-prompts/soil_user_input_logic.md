Objective:
Map farmer-friendly inputs into probable soil types.

Supported input methods:
1. Manual selection
2. Location-based (State / District)
3. Observation-based identification

Observation signals include:
- Soil color
- Texture when wet (sticky, loose, gritty)
- Water holding time
- Cracking behavior
- Salinity signs (white crust)
- Crop performance history

Example logic:
IF color = black AND sticky_when_wet = true
→ Probable Soil = Black Soil

IF sandy AND drains quickly AND arid region
→ Probable Soil = Arid Soil

Confidence scoring must be applied.
If confidence < 70%, ask follow-up questions.
