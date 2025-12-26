Objective:
Enable AI to recommend crops based on soil intelligence.

Rules:
- Never recommend crops unsuitable for soil constraints
- Consider season + irrigation availability
- Consider soil problems before recommendation

Reasoning chain:
Soil → Constraints → Crop Compatibility → Yield Risk → Recommendation

Example:
Black Soil + Poor Drainage + Kharif
→ Avoid water-sensitive crops
→ Prefer cotton, soybean

Output must include:
- Recommended crops
- Risk warnings
- Soil improvement suggestions
