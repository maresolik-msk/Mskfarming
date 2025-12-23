import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Satellite, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Info, 
  Layers, 
  Plus, 
  Edit2, 
  Trash2, 
  RefreshCw, 
  Loader2, 
  Eye, 
  EyeOff,
  AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface Field {
  id: string;
  name: string;
  boundary: any;
  area_acres: number;
  crop?: string;
  created_at: string;
  vegetation_data?: {
    date: string;
    avg_ndvi: number;
    health_status: 'healthy' | 'moderate' | 'stressed' | 'poor';
    stress_zones_percent: number;
  };
}

interface SatelliteMonitoringProps {
  onClose: () => void;
}

// Declare global types for Leaflet
declare global {
  interface Window {
    L: any;
  }
}

export function SatelliteMonitoring({ onClose }: SatelliteMonitoringProps) {
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [loadingLeaflet, setLoadingLeaflet] = useState(true);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const drawnItemsRef = useRef<any>(null);

  // Load Leaflet libraries from CDN
  useEffect(() => {
    if (window.L) {
      setLeafletLoaded(true);
      setLoadingLeaflet(false);
      return;
    }

    const loadLeaflet = async () => {
      try {
        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const leafletCSS = document.createElement('link');
          leafletCSS.rel = 'stylesheet';
          leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          leafletCSS.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
          leafletCSS.crossOrigin = '';
          document.head.appendChild(leafletCSS);
        }

        // Load Leaflet JS
        if (!document.querySelector('script[src*="leaflet.js"]')) {
          await new Promise((resolve, reject) => {
            const leafletScript = document.createElement('script');
            leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            leafletScript.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
            leafletScript.crossOrigin = '';
            leafletScript.onload = resolve;
            leafletScript.onerror = reject;
            document.head.appendChild(leafletScript);
          });
        }

        // Load Leaflet Draw CSS
        if (!document.querySelector('link[href*="leaflet.draw.css"]')) {
          const drawCSS = document.createElement('link');
          drawCSS.rel = 'stylesheet';
          drawCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css';
          document.head.appendChild(drawCSS);
        }

        // Load Leaflet Draw JS
        if (!document.querySelector('script[src*="leaflet.draw.js"]')) {
          await new Promise((resolve, reject) => {
            const drawScript = document.createElement('script');
            drawScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js';
            drawScript.onload = resolve;
            drawScript.onerror = reject;
            document.head.appendChild(drawScript);
          });
        }

        // Wait for Leaflet to be available
        await new Promise(resolve => setTimeout(resolve, 100));

        if (window.L) {
          setLeafletLoaded(true);
          toast.success('Map loaded successfully');
        } else {
          throw new Error('Leaflet failed to load');
        }
      } catch (error) {
        console.error('Error loading Leaflet:', error);
        toast.error('Failed to load map. Please refresh the page.');
      } finally {
        setLoadingLeaflet(false);
      }
    };

    loadLeaflet();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current || mapRef.current) return;

    const L = window.L;

    // Create map
    const map = L.map(mapContainerRef.current).setView([20.5937, 78.9629], 5);
    mapRef.current = map;

    // Add satellite tile layer
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 18,
    }).addTo(map);

    // Initialize FeatureGroup for drawn items
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    drawnItemsRef.current = drawnItems;

    // Initialize draw control
    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
      draw: {
        polyline: false,
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: false,
        polygon: {
          allowIntersection: false,
          showArea: true,
        },
      },
    });
    map.addControl(drawControl);

    // Handle draw created event
    map.on(L.Draw.Event.CREATED, (e: any) => {
      const layer = e.layer;
      drawnItems.addLayer(layer);
      handleDrawCreate(layer);
    });

    // Handle draw deleted event
    map.on(L.Draw.Event.DELETED, (e: any) => {
      const layers = e.layers;
      layers.eachLayer((layer: any) => {
        handleDrawDelete(layer);
      });
    });

    // Load fields
    loadFields();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [leafletLoaded]);

  const loadFields = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6fdef95d/fields`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFields(data.fields || []);
        
        // Display fields on map
        if (drawnItemsRef.current && data.fields && window.L) {
          data.fields.forEach((field: Field) => {
            if (field.boundary && field.boundary.geometry) {
              const layer = window.L.geoJSON(field.boundary);
              drawnItemsRef.current?.addLayer(layer);
            }
          });
        }
      }
    } catch (error) {
      console.error('Error loading fields:', error);
      toast.error('Failed to load fields');
    } finally {
      setLoading(false);
    }
  };

  const handleDrawCreate = async (layer: any) => {
    const geoJSON = layer.toGeoJSON();
    
    // Calculate area (approximate)
    const area = calculateArea(geoJSON.geometry.coordinates[0]);
    
    // Prompt for field name
    const fieldName = prompt('Enter field name:');
    if (!fieldName) {
      if (drawnItemsRef.current) {
        drawnItemsRef.current.removeLayer(layer);
      }
      return;
    }

    const fieldData = {
      name: fieldName,
      boundary: geoJSON,
      area_acres: area,
      crop: null
    };

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6fdef95d/fields`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(fieldData),
        }
      );

      if (response.ok) {
        toast.success(`Field "${fieldName}" created successfully!`);
        loadFields();
      } else {
        throw new Error('Failed to create field');
      }
    } catch (error) {
      console.error('Error creating field:', error);
      toast.error('Failed to create field');
      if (drawnItemsRef.current) {
        drawnItemsRef.current.removeLayer(layer);
      }
    }
  };

  const handleDrawDelete = async (layer: any) => {
    const geoJSON = layer.toGeoJSON();
    const field = fields.find(f => JSON.stringify(f.boundary) === JSON.stringify(geoJSON));
    
    if (field) {
      try {
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-6fdef95d/fields/${field.id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );
        toast.success('Field deleted');
        loadFields();
      } catch (error) {
        console.error('Error deleting field:', error);
      }
    }
  };

  const calculateArea = (coordinates: number[][]): number => {
    let area = 0;
    const numPoints = coordinates.length;
    
    for (let i = 0; i < numPoints - 1; i++) {
      area += coordinates[i][0] * coordinates[i + 1][1];
      area -= coordinates[i + 1][0] * coordinates[i][1];
    }
    
    area = Math.abs(area / 2);
    const acres = area * 247.105;
    return parseFloat(acres.toFixed(2));
  };

  const fetchVegetationData = async (fieldId: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6fdef95d/fields/${fieldId}/vegetation?date=latest`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        setFields(prev => prev.map(f => 
          f.id === fieldId ? { ...f, vegetation_data: data } : f
        ));
        
        toast.success('Vegetation data updated');
      } else {
        const error = await response.json();
        if (error.message?.includes('cloud cover')) {
          toast.error('Satellite data unavailable due to cloud cover. Next update expected in 3-5 days.');
        } else {
          toast.error('Failed to fetch vegetation data');
        }
      }
    } catch (error) {
      console.error('Error fetching vegetation data:', error);
      toast.error('Failed to fetch vegetation data');
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (status?: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-500/10 border-green-500/30';
      case 'moderate': return 'text-yellow-600 bg-yellow-500/10 border-yellow-500/30';
      case 'stressed': return 'text-orange-600 bg-orange-500/10 border-orange-500/30';
      case 'poor': return 'text-red-600 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-600 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getHealthLabel = (status?: string) => {
    switch (status) {
      case 'healthy': return 'Healthy Growth';
      case 'moderate': return 'Moderate Health';
      case 'stressed': return 'Crop Stressed';
      case 'poor': return 'Poor Condition';
      default: return 'No Data';
    }
  };

  const getHealthIcon = (status?: string) => {
    switch (status) {
      case 'healthy': return <TrendingUp className="w-4 h-4" />;
      case 'moderate': return <Info className="w-4 h-4" />;
      case 'stressed': return <AlertTriangle className="w-4 h-4" />;
      case 'poor': return <TrendingDown className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const zoomToField = (field: Field) => {
    if (field.boundary?.geometry?.coordinates && mapRef.current && window.L) {
      const coords = field.boundary.geometry.coordinates[0];
      const bounds = coords.map((coord: number[]) => [coord[1], coord[0]]);
      mapRef.current.fitBounds(bounds);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background/95 backdrop-blur-xl rounded-3xl w-full h-full max-w-7xl max-h-[95vh] shadow-2xl border border-white/10 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-blue-600/10 via-green-600/10 to-blue-600/10 px-6 py-5 border-b border-border/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white shadow-lg">
              <Satellite className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Satellite Crop Monitoring</h3>
              <p className="text-sm text-muted-foreground">Monitor vegetation health from space</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-muted/80 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 border-r border-border/40 bg-muted/5 flex flex-col overflow-hidden">
            {/* Actions */}
            <div className="p-4 border-b border-border/40 space-y-3">
              <button
                onClick={() => setShowLegend(!showLegend)}
                className="w-full py-2 rounded-xl bg-background hover:bg-muted border border-border/40 font-medium flex items-center justify-center gap-2 text-sm"
              >
                {showLegend ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showLegend ? 'Hide' : 'Show'} Legend
              </button>
            </div>

            {/* Fields List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                Your Fields ({fields.length})
              </h4>

              {loading && fields.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : fields.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <Satellite className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No fields yet. Draw your first field on the map using the polygon tool!
                  </p>
                </div>
              ) : (
                fields.map((field) => (
                  <motion.div
                    key={field.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedField?.id === field.id
                        ? 'bg-primary/10 border-primary/50 shadow-lg'
                        : 'bg-background border-border/40 hover:border-primary/30'
                    }`}
                    onClick={() => {
                      setSelectedField(field);
                      zoomToField(field);
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h5 className="font-bold text-foreground">{field.name}</h5>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {field.area_acres} acres
                        </p>
                      </div>
                      {field.vegetation_data && (
                        <div className={`px-2 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 ${getHealthColor(field.vegetation_data.health_status)}`}>
                          {getHealthIcon(field.vegetation_data.health_status)}
                          {getHealthLabel(field.vegetation_data.health_status).split(' ')[0]}
                        </div>
                      )}
                    </div>

                    {field.vegetation_data ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Last updated:</span>
                          <span className="font-medium">
                            {new Date(field.vegetation_data.date).toLocaleDateString()}
                          </span>
                        </div>
                        {field.vegetation_data.stress_zones_percent > 0 && (
                          <div className="flex items-center gap-2 text-xs bg-orange-500/10 text-orange-600 px-2 py-1 rounded-lg">
                            <AlertCircle className="w-3 h-3" />
                            {field.vegetation_data.stress_zones_percent}% stressed zones
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          fetchVegetationData(field.id);
                        }}
                        disabled={loading}
                        className="w-full mt-2 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg text-xs font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <RefreshCw className="w-3 h-3" />
                        )}
                        Get Vegetation Data
                      </button>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1 relative">
            {loadingLeaflet ? (
              <div className="w-full h-full flex items-center justify-center bg-muted/20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-lg font-semibold text-foreground">Loading Map...</p>
                  <p className="text-sm text-muted-foreground mt-2">Initializing satellite view</p>
                </div>
              </div>
            ) : !leafletLoaded ? (
              <div className="w-full h-full flex items-center justify-center bg-muted/20">
                <div className="text-center">
                  <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-foreground">Failed to Load Map</p>
                  <p className="text-sm text-muted-foreground mt-2">Please refresh the page to try again</p>
                </div>
              </div>
            ) : (
              <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 0 }} />
            )}

            {/* Legend */}
            <AnimatePresence>
              {showLegend && leafletLoaded && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute bottom-6 right-6 bg-background/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/10 min-w-[200px]" 
                  style={{ zIndex: 1000 }}
                >
                  <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Vegetation Health
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded bg-green-500" />
                      <span className="text-xs">Healthy (&gt; 0.6)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded bg-yellow-500" />
                      <span className="text-xs">Moderate (0.4-0.6)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded bg-orange-500" />
                      <span className="text-xs">Stressed (0.2-0.4)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded bg-red-500" />
                      <span className="text-xs">Poor (&lt; 0.2)</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Instructions */}
            {leafletLoaded && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-xl font-medium flex items-center gap-3" 
                style={{ zIndex: 1000 }}
              >
                <Info className="w-5 h-5" />
                Use the polygon tool in the map toolbar to draw field boundaries
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
