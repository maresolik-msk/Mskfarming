
import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Bar
} from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";
import { Loader2, Sprout, Droplets, Sun, Calendar as CalendarIcon, Wheat } from "lucide-react";
import { 
  runSimulationV2, 
  SeasonResultV2, 
  CropType, 
  SoilType, 
  getFields 
} from "../../lib/api";

interface Field {
  id: string;
  name: string;
  crop: string;
  plantingDate: string;
  soilType: string;
  size: number;
}

export function CropSimulator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SeasonResultV2 | null>(null);

  // Mode: 'quick' = Manual Input, 'field' = Select from My Farm
  const [mode, setMode] = useState<'quick' | 'field'>('quick');
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string>('');

  // Form State
  const [cropType, setCropType] = useState<CropType>('Wheat');
  const [soilType, setSoilType] = useState<SoilType>('Clay Loam');
  const [sowingDate, setSowingDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [soilWater, setSoilWater] = useState<number>(60); // mm, not pct
  const [nitrogen, setNitrogen] = useState<number>(50); // initial soil N

  // Load fields on mount
  React.useEffect(() => {
    async function loadFields() {
      try {
        const data = await getFields();
        setFields(data);
      } catch (e) {
        console.error("Failed to load fields", e);
      }
    }
    loadFields();
  }, []);

  // When a field is selected, auto-populate form
  const handleFieldSelect = (fieldId: string) => {
    setSelectedFieldId(fieldId);
    const field = fields.find(f => f.id === fieldId);
    if (field) {
      // Map Crop Type
      if (['Wheat', 'Rice', 'Maize', 'Groundnut', 'Cotton', 'Soybean', 'Sugarcane', 'Bajra'].includes(field.crop)) {
        setCropType(field.crop as CropType);
      }
      
      // Map Soil Type
      if (field.soilType && ['Sandy Loam', 'Clay Loam', 'Silt Clay'].includes(field.soilType)) {
        setSoilType(field.soilType as SoilType);
      } else {
        // Simple heuristic mapping if exact match fails
        const s = (field.soilType || '').toLowerCase();
        if (s.includes('sand')) setSoilType('Sandy Loam');
        else if (s.includes('silt')) setSoilType('Silt Clay');
        else setSoilType('Clay Loam'); // Default fallback
      }

      // Map Date
      if (field.plantingDate) {
        setSowingDate(field.plantingDate);
      }
    }
  };

  const handleSimulate = async () => {
    setLoading(true);
    try {
      // Construct V2 Params
      const params = {
        cropType: cropType,
        startDate: sowingDate,
        initialSoilWater: soilWater, // Treat as mm for now
        initialNitrogen: nitrogen,
        operations: [] // No manual ops in UI yet
      };
      
      const data = await runSimulationV2(params);
      setResult(data);
      toast.success("Simulation complete!");
    } catch (error) {
      console.error(error);
      toast.error("Simulation failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-green-600" />
              Configuration
            </CardTitle>
            <CardDescription>
              Set parameters for the growing season.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* Mode Selection */}
            <div className="flex p-1 bg-muted rounded-lg mb-4">
              <button
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'quick' ? 'bg-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setMode('quick')}
              >
                Quick Sim
              </button>
              <button
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'field' ? 'bg-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setMode('field')}
              >
                My Farm
              </button>
            </div>

            {mode === 'field' && (
              <div className="space-y-2 pt-2 pb-4 border-b border-border/50">
                <Label>Select Field</Label>
                <Select value={selectedFieldId} onValueChange={handleFieldSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a field..." />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.length > 0 ? (
                      fields.map(f => (
                        <SelectItem key={f.id} value={f.id}>
                          <div className="flex items-center gap-2">
                             {/* @ts-ignore - image_url exists from backend enrichment */}
                             {f.image_url && <img src={f.image_url} alt="" className="w-5 h-5 rounded-full object-cover" />}
                             <span>{f.name} ({f.crop})</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-xs text-muted-foreground text-center">
                        No fields found. Add fields in Field Management.
                      </div>
                    )}
                  </SelectContent>
                </Select>
                {selectedFieldId && (
                   <p className="text-[10px] text-muted-foreground">
                     * Auto-filled parameters from field data
                   </p>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Crop Type</Label>
              <Select value={cropType} onValueChange={(v) => setCropType(v as CropType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Wheat">Wheat (Rabi)</SelectItem>
                  <SelectItem value="Rice">Rice (Kharif)</SelectItem>
                  <SelectItem value="Maize">Maize (Zaid/Kharif)</SelectItem>
                  <SelectItem value="Groundnut">Groundnut (Kharif/Summer)</SelectItem>
                  <SelectItem value="Cotton">Cotton (Kharif)</SelectItem>
                  <SelectItem value="Soybean">Soybean (Kharif)</SelectItem>
                  <SelectItem value="Sugarcane">Sugarcane (Annual)</SelectItem>
                  <SelectItem value="Bajra">Bajra (Arid/Kharif)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Soil Texture</Label>
              <Select value={soilType} onValueChange={(v) => setSoilType(v as SoilType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sandy Loam">Sandy Loam</SelectItem>
                  <SelectItem value="Clay Loam">Clay Loam</SelectItem>
                  <SelectItem value="Silt Clay">Silt Clay</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sowing Date</Label>
              <Input 
                type="date" 
                value={sowingDate} 
                onChange={(e) => setSowingDate(e.target.value)} 
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Initial Soil Moisture</Label>
                <span className="text-xs text-muted-foreground">{soilWater}%</span>
              </div>
              <Slider 
                value={[soilWater]} 
                onValueChange={(v) => setSoilWater(v[0])} 
                max={100} 
                step={5} 
                className="py-2"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Nitrogen (kg/ha)</Label>
                <span className="text-xs text-muted-foreground">{nitrogen} kg</span>
              </div>
              <Slider 
                value={[nitrogen]} 
                onValueChange={(v) => setNitrogen(v[0])} 
                max={300} 
                step={10} 
                className="py-2"
              />
            </div>

          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-green-700 hover:bg-green-800" 
              onClick={handleSimulate}
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sun className="mr-2 h-4 w-4" />}
              Run Simulation
            </Button>
          </CardFooter>
        </Card>

        {/* Results Panel */}
        <div className="md:col-span-2 space-y-6">
          {result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Yield Card */}
                <Card className="relative overflow-hidden border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estimated Yield</p>
                        <div className="mt-1 flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-green-700">
                            {((Number(result.summary.final_yield_t_ha) / 2.471) * 10).toFixed(2)}
                          </span>
                          <span className="text-sm font-medium text-green-600">q/acre</span>
                        </div>
                      </div>
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Wheat className="w-5 h-5 text-green-700" />
                      </div>
                    </div>
                    <div className="w-full bg-green-100 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-green-500 h-full rounded-full" style={{ width: '85%' }} />
                    </div>
                  </CardContent>
                </Card>

                {/* Days Card */}
                <Card className="relative overflow-hidden border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                   <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Duration</p>
                         <div className="mt-1 flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-foreground">
                            {result.summary.total_days}
                          </span>
                          <span className="text-sm font-medium text-muted-foreground">days</span>
                        </div>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <CalendarIcon className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                     <div className="w-full bg-blue-100 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min((result.summary.total_days / 150) * 100, 100)}%` }} />
                    </div>
                  </CardContent>
                </Card>

                {/* Irrigation Card */}
                <Card className="relative overflow-hidden border-l-4 border-l-cyan-500 shadow-sm hover:shadow-md transition-shadow">
                   <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Water Usage</p>
                         <div className="mt-1 flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-cyan-700">
                            {result.summary.total_irrigation}
                          </span>
                          <span className="text-sm font-medium text-cyan-600">mm</span>
                        </div>
                      </div>
                      <div className="p-2 bg-cyan-100 rounded-lg">
                        <Droplets className="w-5 h-5 text-cyan-600" />
                      </div>
                    </div>
                     <div className="w-full bg-cyan-100 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${Math.min((result.summary.total_irrigation / 800) * 100, 100)}%` }} />
                    </div>
                  </CardContent>
                </Card>

                {/* Potential Card */}
                <Card className="relative overflow-hidden border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
                   <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Potential</p>
                         <div className="mt-1 flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-orange-700">
                            {result.summary.yield_potential_realized_pct}
                          </span>
                          <span className="text-sm font-medium text-orange-600">%</span>
                        </div>
                      </div>
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Sun className="w-5 h-5 text-orange-600" />
                      </div>
                    </div>
                    <div className="w-full bg-orange-100 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-orange-500 h-full rounded-full" style={{ width: `${result.summary.yield_potential_realized_pct}%` }} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <Card className="shadow-md border-border/50">
                <CardHeader className="pb-2 border-b border-border/50 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                       <CardTitle className="text-lg font-bold flex items-center gap-2">
                         <Sprout className="w-5 h-5 text-green-600" />
                         Growth Analysis
                       </CardTitle>
                       <CardDescription>
                         Detailed visual breakdown of the crop season
                       </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <Tabs defaultValue="biomass" className="space-y-4">
                    <div className="flex justify-end">
                      <TabsList className="grid w-full max-w-md grid-cols-3">
                        <TabsTrigger value="biomass">Biomass</TabsTrigger>
                        <TabsTrigger value="water">Water</TabsTrigger>
                        <TabsTrigger value="stress">Stress</TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <div className="h-[400px] w-full bg-card rounded-lg border border-border/50 p-4">
                         <TabsContent value="biomass" className="h-full mt-0">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={result.logs} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                  <defs>
                                    <linearGradient id="colorBiomass" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8}/>
                                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                  <XAxis dataKey="day_index" label={{ value: 'Days After Sowing', position: 'insideBottom', offset: -5, fontSize: 12 }} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                  <YAxis label={{ value: 'Biomass (kg/ha)', angle: -90, position: 'insideLeft', fontSize: 12 }} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                  <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    labelFormatter={(label) => `Day ${label}`}
                                  />
                                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                  <Area 
                                    type="monotone" 
                                    dataKey="growth.accumulated_biomass" 
                                    stroke="#16a34a" 
                                    strokeWidth={2}
                                    fillOpacity={1} 
                                    fill="url(#colorBiomass)" 
                                    name="Accumulated Biomass"
                                    animationDuration={1500}
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            </TabsContent>

                            <TabsContent value="water" className="h-full mt-0">
                              <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={result.logs} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                   <XAxis dataKey="day_index" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                   <YAxis yAxisId="left" label={{ value: 'Soil Water (mm)', angle: -90, position: 'insideLeft', fontSize: 12 }} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                   <YAxis yAxisId="right" orientation="right" label={{ value: 'Daily ET (mm)', angle: 90, position: 'insideRight', fontSize: 12 }} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                   <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                   <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                   <Area yAxisId="left" type="monotone" dataKey="water_balance.end" fill="#bfdbfe" stroke="#3b82f6" strokeWidth={2} name="Soil Moisture" />
                                   <Bar yAxisId="right" dataKey="water_balance.et" fill="#60a5fa" name="Evapotranspiration" barSize={4} radius={[2, 2, 0, 0]} />
                                </ComposedChart>
                              </ResponsiveContainer>
                            </TabsContent>

                            <TabsContent value="stress" className="h-full mt-0">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={result.logs} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                   <XAxis dataKey="day_index" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                   <YAxis domain={[0, 1]} label={{ value: 'Stress Factor (0-1)', angle: -90, position: 'insideLeft', fontSize: 12 }} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                   <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                   <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                   <Line type="monotone" dataKey="stress.water" stroke="#ef4444" name="Water Stress" dot={false} strokeWidth={2} activeDot={{ r: 6 }} />
                                   <Line type="monotone" dataKey="stress.temperature" stroke="#ea580c" name="Heat Stress" dot={false} strokeWidth={2} activeDot={{ r: 6 }} />
                                   <Line type="monotone" dataKey="stress.nutrient" stroke="#ca8a04" name="Nutrient Stress" dot={false} strokeWidth={2} activeDot={{ r: 6 }} />
                                </LineChart>
                              </ResponsiveContainer>
                            </TabsContent>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-muted rounded-xl bg-muted/10 p-12">
              <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-6">
                <Wheat className="h-10 w-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Ready to Simulate</h3>
              <p className="text-sm text-center max-w-sm leading-relaxed">
                Configure the planting parameters in the left panel and click "Run Simulation" to generate AI-powered growth predictions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
