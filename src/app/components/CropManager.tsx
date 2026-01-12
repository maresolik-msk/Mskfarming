import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sprout, 
  Calendar as CalendarIcon, 
  Droplets, 
  Bug, 
  ShieldCheck, 
  Leaf, 
  History,
  Loader2,
  FileText,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Beaker
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { calculateCropManagementPlan, getCropManagementPlans, getFields } from '../../lib/api';
import { toast } from 'sonner';

export function CropManager() {
  const [loading, setLoading] = useState(false);
  const [cropType, setCropType] = useState('Wheat');
  const [sowingDate, setSowingDate] = useState(new Date().toISOString().split('T')[0]);
  const [fieldSize, setFieldSize] = useState('1'); // Acres
  const [fields, setFields] = useState<any[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string>('none');
  const [plan, setPlan] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadHistory();
    loadFields();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getCropManagementPlans();
      if (data.plans) {
        setHistory(data.plans);
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  };

  const loadFields = async () => {
    try {
      const data = await getFields();
      if (data) {
        setFields(data);
      }
    } catch (e) {
      console.error("Failed to load fields", e);
    }
  };

  const handleFieldSelect = (fieldId: string) => {
    setSelectedFieldId(fieldId);
    if (fieldId === 'none') return;

    const field = fields.find(f => f.id === fieldId);
    if (field) {
      // Assuming size is in acres or we just use the number. 
      // Ideally we would check units, but for now we fill the input.
      if (field.size) {
        setFieldSize(field.size.toString());
        toast.info(`Selected field: ${field.name}. Size updated to ${field.size} ${field.sizeUnit || 'Acres'}`);
      }
    }
  };

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const response = await calculateCropManagementPlan(
        cropType, 
        sowingDate, 
        parseFloat(fieldSize)
      );
      
      if (response.success) {
        setPlan(response.plan);
        toast.success("Crop management plan generated!");
        loadHistory(); 
      } else {
        toast.error(response.error || "Failed to generate plan");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const loadPlan = (savedPlan: any) => {
    setPlan(savedPlan);
    setShowHistory(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto overflow-x-hidden">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-green-900/20">
               <Leaf className="w-6 h-6" />
             </div>
             Crop Manager
          </h2>
          <p className="text-muted-foreground mt-2 text-base">
            Complete crop lifecycle management: Nutrients, Protection, and Irrigation.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowHistory(!showHistory)}
          className="gap-2 rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
        >
          <History className="w-4 h-4" />
          {showHistory ? 'Hide History' : 'Saved Plans'}
        </Button>
      </div>

      <AnimatePresence>
        {showHistory && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="bg-muted/30 border-dashed border-2 shadow-none mb-8">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Your Saved Plans
                </CardTitle>
              </CardHeader>
              <CardContent>
                {history.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {history.map((h) => (
                      <button
                        key={h.id} 
                        onClick={() => loadPlan(h)}
                        className="text-left p-4 rounded-xl border bg-background hover:border-primary/50 hover:shadow-md transition-all group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md text-xs uppercase tracking-wide">
                            {h.crop_type}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {new Date(h.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                             <CalendarIcon className="w-3.5 h-3.5" />
                             <span>Sown: {new Date(h.sowing_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <Leaf className="w-3.5 h-3.5" />
                             <span>{h.field_size_acres} acres</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No saved plans found.</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Input Panel - Fixed Sidebar on Desktop */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-0 shadow-xl shadow-black/5 overflow-hidden sticky top-6">
            <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-600" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sprout className="w-5 h-5 text-green-600" />
                New Plan Configuration
              </CardTitle>
              <CardDescription>Enter details to generate your guide</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Select Field (Optional)</Label>
                <Select value={selectedFieldId} onValueChange={handleFieldSelect}>
                  <SelectTrigger className="h-12 rounded-xl border-muted-foreground/20">
                    <SelectValue placeholder="Choose a field..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-- Manual Input --</SelectItem>
                    {fields.map((field) => (
                      <SelectItem key={field.id} value={field.id}>
                        {field.name} ({field.size} {field.sizeUnit || 'Acres'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Crop Type</Label>
                <Select value={cropType} onValueChange={setCropType}>
                  <SelectTrigger className="h-12 rounded-xl border-muted-foreground/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Wheat">🌾 Wheat</SelectItem>
                    <SelectItem value="Rice">🍚 Rice (Paddy)</SelectItem>
                    <SelectItem value="Cotton">👕 Cotton</SelectItem>
                    <SelectItem value="Sugarcane">🍬 Sugarcane</SelectItem>
                    <SelectItem value="Maize">🌽 Maize (Corn)</SelectItem>
                    <SelectItem value="Groundnut">🥜 Groundnut</SelectItem>
                    <SelectItem value="Soybean">🫘 Soybean</SelectItem>
                    <SelectItem value="Bajra">🌾 Bajra (Millet)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Sowing Date</Label>
                <Input 
                  type="date" 
                  value={sowingDate} 
                  onChange={(e) => setSowingDate(e.target.value)} 
                  className="h-12 rounded-xl border-muted-foreground/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Field Size</Label>
                <div className="relative">
                  <Input 
                    type="number" 
                    value={fieldSize} 
                    onChange={(e) => setFieldSize(e.target.value)}
                    min="0.1"
                    step="0.1"
                    className="h-12 rounded-xl border-muted-foreground/20 pr-16"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="text-xs font-bold bg-muted px-2 py-1 rounded text-muted-foreground">ACRES</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleCalculate} 
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold shadow-lg shadow-green-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Plan...
                  </>
                ) : (
                  <>
                    Generate Guide
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              
              {plan && (
                 <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-4 border border-amber-100 dark:border-amber-900/20 mt-4">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm">Active Plan Summary</h4>
                      <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                        Generating for <span className="font-semibold">{plan.crop_type}</span> ({plan.summary.scientific_name}).
                        <br/>
                        Cycle Duration: ~{plan.summary.duration_days} days.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8">
          {plan ? (
            <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700 ease-out">
              <Tabs defaultValue="timeline" className="w-full">
                <div className="sticky top-0 z-30 bg-background/95 backdrop-blur pb-6 pt-2">
                  <TabsList className="w-full h-14 p-1.5 bg-muted/50 rounded-2xl grid grid-cols-4 gap-2 border border-border/40">
                    <TabsTrigger value="timeline" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-black/5 font-semibold transition-all">Timeline</TabsTrigger>
                    <TabsTrigger value="nutrients" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-emerald-100 font-semibold transition-all">Nutrients</TabsTrigger>
                    <TabsTrigger value="protection" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-rose-100 font-semibold transition-all">Protection</TabsTrigger>
                    <TabsTrigger value="water" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-blue-100 font-semibold transition-all">Practices</TabsTrigger>
                  </TabsList>
                </div>

                {/* TIMELINE TAB */}
                <TabsContent value="timeline" className="mt-2 space-y-8">
                  {plan.schedule.map((stage: any, index: number) => {
                     const isPast = new Date(stage.date) < new Date();
                     const isToday = new Date(stage.date).toDateString() === new Date().toDateString();
                     
                     return (
                       <div key={index} className="relative pl-8 md:pl-0 group">
                         {/* Desktop Layout */}
                         <div className="hidden md:flex gap-6">
                            {/* Date Column */}
                            <div className="w-28 text-right pt-2 shrink-0 flex flex-col items-end">
                               <div className={`text-3xl font-bold tracking-tight ${isPast ? 'text-muted-foreground/60' : 'text-foreground'}`}>
                                 {new Date(stage.date).getDate()}
                               </div>
                               <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                 {new Date(stage.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                               </div>
                               {isToday && (
                                 <span className="mt-2 text-[10px] font-extrabold bg-primary text-primary-foreground px-2 py-0.5 rounded-full animate-pulse">
                                   TODAY
                                 </span>
                               )}
                            </div>
                            
                            {/* Timeline Line & Dot */}
                            <div className="relative flex flex-col items-center mx-2">
                               <div className={`w-0.5 h-full absolute top-6 bg-border/60 ${index === plan.schedule.length - 1 ? 'hidden' : ''}`} />
                               <div className={`relative z-10 w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                                 isPast 
                                   ? 'bg-muted border-muted-foreground/20 text-muted-foreground' 
                                   : 'bg-background border-primary shadow-lg shadow-primary/20 scale-110'
                               }`}>
                                 <div className={`w-2.5 h-2.5 rounded-full ${isPast ? 'bg-muted-foreground/50' : 'bg-primary'}`} />
                               </div>
                            </div>
                            
                            {/* Content Card */}
                            <div className="flex-1 pb-10">
                              <Card className={`border shadow-sm transition-all hover:shadow-md hover:border-primary/20 ${
                                isPast ? 'opacity-70 bg-muted/10 border-dashed' : 'bg-card'
                              }`}>
                                <CardHeader className="pb-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <CardTitle className="text-lg text-foreground">{stage.stage_name}</CardTitle>
                                        <span className="text-[10px] font-bold bg-muted/50 text-muted-foreground px-2 py-1 rounded-md border border-border/50">
                                          DAY {stage.day_start} - {stage.day_end}
                                        </span>
                                      </div>
                                      <CardDescription className="line-clamp-2">{stage.description}</CardDescription>
                                    </div>
                                  </div>
                                </CardHeader>
                              </Card>
                            </div>
                         </div>

                         {/* Mobile Layout */}
                         <div className="md:hidden flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center shrink-0 z-10 ${
                                isPast ? 'bg-muted border-muted-foreground/20' : 'bg-background border-primary'
                              }`}>
                                <div className={`w-2 h-2 rounded-full ${isPast ? 'bg-muted-foreground' : 'bg-primary'}`} />
                              </div>
                              <div className={`w-0.5 flex-1 bg-border/50 my-1 ${index === plan.schedule.length - 1 ? 'hidden' : ''}`} />
                            </div>
                            
                            <Card className={`flex-1 mb-6 border-0 shadow-sm ring-1 ring-border/50 ${isPast ? 'bg-muted/10' : 'bg-card'}`}>
                              <CardHeader className="p-4 pb-2">
                                <div className="text-xs font-bold text-primary mb-1">
                                   {new Date(stage.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                </div>
                                <CardTitle className="text-base">{stage.stage_name}</CardTitle>
                              </CardHeader>
                              <CardContent className="p-4 pt-0">
                                <p className="text-sm text-muted-foreground">{stage.description}</p>
                              </CardContent>
                            </Card>
                         </div>
                       </div>
                     );
                  })}
                </TabsContent>

                {/* NUTRIENTS TAB */}
                <TabsContent value="nutrients" className="mt-2 space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/30 dark:to-background border-green-200/50">
                      <CardContent className="pt-6 text-center">
                        <p className="text-xs font-semibold text-green-600 uppercase mb-1">Total Nitrogen</p>
                        <p className="text-2xl font-bold text-foreground">{plan.totals?.n || 0} kg</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-background border-blue-200/50">
                      <CardContent className="pt-6 text-center">
                        <p className="text-xs font-semibold text-blue-600 uppercase mb-1">Total Phosphorus</p>
                        <p className="text-2xl font-bold text-foreground">{plan.totals?.p || 0} kg</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/30 dark:to-background border-orange-200/50">
                      <CardContent className="pt-6 text-center">
                        <p className="text-xs font-semibold text-orange-600 uppercase mb-1">Total Potassium</p>
                        <p className="text-2xl font-bold text-foreground">{plan.totals?.k || 0} kg</p>
                      </CardContent>
                    </Card>
                  </div>

                  {plan.schedule.map((stage: any, idx: number) => {
                    const hasNutrients = parseFloat(stage.nutrient_quantities.n_kg) > 0 || parseFloat(stage.nutrient_quantities.p_kg) > 0 || stage.nutrient_quantities.products.length > 0;
                    if (!hasNutrients) return null;

                    return (
                      <div key={idx} className="bg-card rounded-2xl border shadow-sm overflow-hidden group hover:shadow-md transition-all">
                        <div className="bg-emerald-50/40 dark:bg-emerald-900/10 px-6 py-4 border-b border-emerald-100/50 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 shadow-sm">
                               <Beaker className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-emerald-950 dark:text-emerald-50">{stage.stage_name}</h3>
                              <p className="text-xs font-medium text-emerald-700/70 dark:text-emerald-300">{new Date(stage.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6 grid md:grid-cols-2 gap-8">
                          {/* Dosage Visuals */}
                          <div className="space-y-5">
                            <h4 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest">Nutrient Requirement (Kg/Acre)</h4>
                            
                            <div className="space-y-4">
                              {/* Nitrogen */}
                              <div className="space-y-1.5">
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium text-foreground">Nitrogen (N)</span>
                                  <span className="font-bold text-emerald-600">{stage.nutrient_quantities.n_kg} kg</span>
                                </div>
                                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" 
                                    style={{ width: `${Math.min((stage.nutrient_quantities.n_kg / 50) * 100, 100)}%` }} 
                                  />
                                </div>
                              </div>

                              {/* Phosphorus */}
                              <div className="space-y-1.5">
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium text-foreground">Phosphorus (P)</span>
                                  <span className="font-bold text-blue-600">{stage.nutrient_quantities.p_kg} kg</span>
                                </div>
                                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" 
                                    style={{ width: `${Math.min((stage.nutrient_quantities.p_kg / 50) * 100, 100)}%` }} 
                                  />
                                </div>
                              </div>

                              {/* Potassium */}
                              <div className="space-y-1.5">
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium text-foreground">Potassium (K)</span>
                                  <span className="font-bold text-orange-600">{stage.nutrient_quantities.k_kg} kg</span>
                                </div>
                                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full" 
                                    style={{ width: `${Math.min((stage.nutrient_quantities.k_kg / 50) * 100, 100)}%` }} 
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Products */}
                          <div className="space-y-5">
                            <h4 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest">Recommended Mix</h4>
                            <div className="grid gap-3">
                                {stage.nutrient_quantities.products.map((p: string, i: number) => (
                                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border bg-card/50 hover:bg-muted/30 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                                      <Leaf className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <span className="text-sm font-medium">{p}</span>
                                  </div>
                                ))}
                                {stage.nutrient_quantities.micronutrients?.map((p: string, i: number) => (
                                  <div key={`m-${i}`} className="flex items-center gap-3 p-3 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                      <AlertCircle className="w-4 h-4 text-amber-600" />
                                    </div>
                                    <span className="text-sm font-medium text-amber-900">{p}</span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </TabsContent>

                {/* PROTECTION TAB */}
                <TabsContent value="protection" className="mt-2 space-y-6">
                  {plan.schedule.map((stage: any, idx: number) => {
                    const hasIssues = stage.protection.pests.length > 0 || stage.protection.diseases.length > 0 || stage.protection.weeds.length > 0;
                    if (!hasIssues) return null;

                    return (
                      <div key={idx} className="relative bg-card rounded-2xl border shadow-sm overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-rose-500 via-orange-500 to-yellow-500" />
                        
                        <div className="pl-6 px-6 py-4 border-b bg-muted/20 flex justify-between items-center">
                           <div>
                             <h4 className="font-bold text-lg">{stage.stage_name}</h4>
                             <p className="text-xs text-muted-foreground">{new Date(stage.date).toLocaleDateString()}</p>
                           </div>
                           <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                        </div>
                        
                        <div className="p-6 pl-8 grid gap-6">
                           {/* Pests */}
                           {stage.protection.pests.length > 0 && (
                             <div className="space-y-3">
                               <h5 className="text-xs font-bold text-rose-600 flex items-center gap-2 uppercase tracking-wide">
                                 <Bug className="w-3.5 h-3.5" /> Pest Control
                               </h5>
                               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                                 {stage.protection.pests.map((pest: any, i: number) => (
                                   <div key={i} className="bg-rose-50/50 dark:bg-rose-900/10 rounded-xl p-3 border border-rose-100 dark:border-rose-900/30">
                                     <div className="font-bold text-sm text-rose-900 dark:text-rose-100 mb-1">{pest.name}</div>
                                     <div className="text-xs text-muted-foreground mb-2 italic">"{pest.symptoms}"</div>
                                     <div className="text-xs font-medium bg-white dark:bg-black/20 p-2 rounded border border-rose-100/50 text-rose-700">
                                       Rx: {pest.treatment}
                                     </div>
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )}

                           {/* Diseases */}
                           {stage.protection.diseases.length > 0 && (
                             <div className="space-y-3">
                               <h5 className="text-xs font-bold text-orange-600 flex items-center gap-2 uppercase tracking-wide">
                                 <AlertCircle className="w-3.5 h-3.5" /> Disease Management
                               </h5>
                               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                                 {stage.protection.diseases.map((d: any, i: number) => (
                                   <div key={i} className="bg-orange-50/50 dark:bg-orange-900/10 rounded-xl p-3 border border-orange-100 dark:border-orange-900/30">
                                     <div className="font-bold text-sm text-orange-900 dark:text-orange-100 mb-1">{d.name}</div>
                                     <div className="text-xs text-muted-foreground mb-2 italic">"{d.symptoms}"</div>
                                     <div className="text-xs font-medium bg-white dark:bg-black/20 p-2 rounded border border-orange-100/50 text-orange-700">
                                       Rx: {d.treatment}
                                     </div>
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )}
                           
                           {/* Weeds */}
                           {stage.protection.weeds.length > 0 && (
                              <div className="space-y-3">
                                <h5 className="text-xs font-bold text-yellow-600 flex items-center gap-2 uppercase tracking-wide">
                                  <Sprout className="w-3.5 h-3.5" /> Weed Suppression
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                   {stage.protection.weeds.map((w: any, i: number) => (
                                     <div key={i} className="bg-yellow-50 text-yellow-800 text-xs px-3 py-2 rounded-lg border border-yellow-200 font-medium flex items-center gap-2">
                                        <span className="font-bold">{w.name}</span>
                                        <ArrowRight className="w-3 h-3 opacity-50" />
                                        <span>{w.control}</span>
                                     </div>
                                   ))}
                                </div>
                              </div>
                           )}
                        </div>
                      </div>
                    );
                  })}
                </TabsContent>

                {/* WATER & PRACTICES TAB */}
                <TabsContent value="water" className="mt-2 space-y-6">
                  {plan.schedule.map((stage: any, idx: number) => (
                    <div key={idx} className="bg-card rounded-2xl border shadow-sm overflow-hidden flex flex-col md:flex-row">
                        {/* Criticality Indicator Strip */}
                        <div className={`w-full md:w-3 h-2 md:h-auto ${
                          stage.water.criticality === 'High' ? 'bg-blue-600' : 
                          stage.water.criticality === 'Medium' ? 'bg-blue-400' : 'bg-blue-200'
                        }`} />
                        
                        <div className="flex-1 p-6 md:p-8">
                          <div className="flex justify-between items-start mb-6">
                            <div>
                                <h4 className="font-bold text-xl text-foreground flex items-center gap-2">
                                  {stage.stage_name}
                                </h4>
                                <span className="text-xs text-muted-foreground">{new Date(stage.date).toLocaleDateString()}</span>
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${
                              stage.water.criticality === 'High' ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm' : 'bg-gray-50 text-gray-600 border-gray-200'
                            }`}>
                              Water Priority: {stage.water.criticality}
                            </span>
                          </div>

                          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                            {/* Irrigation Section */}
                            <div className="space-y-4">
                              <h5 className="text-xs font-bold uppercase text-blue-600 flex items-center gap-2 tracking-wide">
                                <Droplets className="w-4 h-4" /> Irrigation
                              </h5>
                              <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30 h-full relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100/50 rounded-bl-full -mr-8 -mt-8" />
                                <p className="font-bold text-blue-900 dark:text-blue-100 text-sm mb-2 relative z-10">{stage.water.activity}</p>
                                <p className="text-sm text-blue-800/80 dark:text-blue-200/80 leading-relaxed relative z-10">{stage.water.advice}</p>
                              </div>
                            </div>

                            {/* Practices Section */}
                            <div className="space-y-4">
                              <h5 className="text-xs font-bold uppercase text-green-600 flex items-center gap-2 tracking-wide">
                                <Leaf className="w-4 h-4" /> Agronomy
                              </h5>
                              <div className="space-y-3">
                                {stage.practices.map((practice: string, i: number) => (
                                  <div key={i} className="flex items-start gap-3 text-sm p-3.5 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors border border-transparent hover:border-border">
                                    <div className="mt-0.5 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                                       <CheckCircle2 className="w-3 h-3 text-green-600" />
                                    </div>
                                    <span className="text-foreground/90 font-medium">{practice}</span>
                                  </div>
                                ))}
                                {stage.practices.length === 0 && (
                                  <p className="text-sm text-muted-foreground italic px-2">Standard field maintenance.</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-muted rounded-3xl bg-muted/5 p-12 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center mb-6 shadow-inner">
                <Sprout className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Crop Intelligence Engine</h3>
              <p className="text-base max-w-md leading-relaxed mb-8 text-muted-foreground">
                Generate a precision farming schedule tailored to your field. 
                Get exact nutrient dosages, pest warnings, and irrigation alerts in seconds.
              </p>
              <div className="flex gap-2 text-xs font-mono text-muted-foreground/50">
                 <span>WHEAT</span> • <span>RICE</span> • <span>COTTON</span> • <span>SUGARCANE</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
