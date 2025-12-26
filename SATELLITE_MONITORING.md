# 🛰️ Satellite Crop Monitoring - Feature Guide

## Overview
The Satellite Crop Monitoring module allows farmers to visualize their fields on a satellite map, draw field boundaries, and receive AI-simulated vegetation health data (NDVI).

## 🚀 How to Use

### **1. Access the Module**
- From the **Main Dashboard**, click on the **Satellite Monitoring** button in the "Quick Actions" grid (or in the "Farm Management" section).
- The map interface will open in a full-screen modal.

### **2. Draw Your Field**
1.  Look for the **Polygon Tool** (pentagon icon) in the map toolbar (top-left, under the zoom controls).
2.  Click the icon to start drawing.
3.  Click on the map to place points along the boundary of your field.
4.  Click the **first point** again to close the shape.
5.  Enter a name for your field (e.g., "North Field") when prompted.
6.  The field will be saved and appear in the sidebar list.

### **3. Analyze Vegetation Health**
1.  In the sidebar, find your newly created field.
2.  Click the **"Get Vegetation Data"** button.
3.  Wait for the analysis (simulated loading).
4.  View the results:
    *   **Health Status:** Healthy, Moderate, Stressed, or Poor.
    *   **NDVI Score:** Normalized Difference Vegetation Index (0.0 - 1.0).
    *   **Stress Zones:** Percentage of field requiring attention.

### **4. Manage Fields**
- **Zoom:** Click a field card in the sidebar to zoom into it on the map.
- **Delete:** Click the trash icon on a field card to remove it.

## 🛠️ Technical Details (Prototype)

### **Client-Side Storage**
- Field boundaries and vegetation data are stored in your browser's `localStorage` (Key: `app_fields`).
- No data is sent to a backend server in this prototype version.
- Data persists across refreshes but will be lost if you clear browser cache.

### **Simulated Data**
- **Vegetation Data:** The NDVI scores and health status are simulated for demonstration purposes.
- **Satellite Imagery:** Uses real satellite tiles from **ArcGIS World Imagery**.
- **Area Calculation:** Estimated acreage based on the drawn shape.

## ⚠️ Requirements
- An active internet connection is required to load the satellite map tiles and Leaflet libraries.
