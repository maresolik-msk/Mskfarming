Objective:
Create a complete soil master dataset for Indian agriculture.

Mandatory soil categories:
- Alluvial
- Black (Regur)
- Red
- Laterite
- Arid / Desert
- Mountain / Forest
- Saline
- Alkaline
- Peaty / Marshy
- Coastal Sandy

For each soil, store the following schema:

{
  soil_id,
  soil_name,
  alternate_names,
  regions_in_india,
  texture,
  color,
  depth,
  drainage,
  water_retention,
  ph_range,
  nutrient_profile: {
    nitrogen,
    phosphorus,
    potassium,
    micronutrients
  },
  organic_matter,
  fertility_level,
  common_crops,
  unsuitable_crops,
  typical_problems,
  recommended_management,
  suitable_seasons
}

Ensure data accuracy for Indian conditions.
