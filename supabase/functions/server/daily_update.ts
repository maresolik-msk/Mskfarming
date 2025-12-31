
import * as kv from "./kv_store.tsx";
import { getWeatherByLocation, WeatherData } from "./weather.ts";

export async function processDailyHeartbeat(userId: string) {
    const user = await kv.get(`user:id:${userId}`);
    if (!user) return { error: "User not found" };

    const fieldIds = await kv.get(`user:${userId}:fields`) || [];
    if (fieldIds.length === 0) return { message: "No fields to update" };

    const fields = await kv.mget(fieldIds);
    const validFields = fields.filter(f => f);

    const today = new Date().toISOString().split('T')[0];
    const updates = [];

    for (const field of validFields) {
        // Skip if already updated today
        if (field.last_updated_date === today) {
            continue;
        }

        // Determine location
        let location = "New Delhi, India";
        if (field.location && field.location.trim()) location = field.location.trim();
        else if (user.location && user.location.trim()) location = user.location.trim();
        
        console.log(`Processing field ${field.id} (${field.name}) with location: '${location}'`);

        // Fetch Real Weather
        const weather = await getWeatherByLocation(location);
        
        if (weather) {
            // Calculate GDD (Simple formula: (Max + Min)/2 - BaseTemp)
            const baseTemp = 10; // Standard base temp
            const dailyAvg = (weather.max_temp + weather.min_temp) / 2;
            const gdd = Math.max(dailyAvg - baseTemp, 0);

            // Update Field
            const updatedField = {
                ...field,
                last_updated_date: today,
                current_weather: weather,
                accumulated_gdd: (field.accumulated_gdd || 0) + gdd,
                // We also store a history of weather for charts
                weather_history: [
                    { date: today, ...weather },
                    ...(field.weather_history || []).slice(0, 6) // Keep last 7 days
                ]
            };

            // Save
            await kv.set(field.id, updatedField);
            updates.push({ id: field.id, name: field.name, status: "Updated" });
        }
    }

    return { 
        success: true, 
        updates_count: updates.length,
        details: updates 
    };
}
