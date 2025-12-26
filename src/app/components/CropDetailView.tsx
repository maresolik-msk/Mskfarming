import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { 
  ArrowLeft, 
  Sprout, 
  Droplets, 
  ThermometerSun, 
  Wind, 
  Calendar, 
  CheckCircle2, 
  Circle,
  TrendingUp,
  AlertCircle,
  MoreVertical,
  Leaf,
  Map as MapIcon,
  Loader2,
  Sparkles
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { GrowthStageFlow } from './crop-intelligence/GrowthStageFlow';

interface CropDetailViewProps {
  cropInfo: {
    name: string;
    field: string;
    day: number;
    totalDays: number;
    progress: number;
    boundary?: any;
    plantingDate?: string;
    soilType?: string;
  };
  onBack: () => void;
}

export function CropDetailView({ cropInfo, onBack }: CropDetailViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [aiTasks, setAiTasks] = useState<any[]>([]);
  const [loadingAi, setLoadingAi] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'stages' | 'tasks'>('overview');

  // Load Leaflet
  useEffect(() => {
    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    const link = document.createElement('link');
    link.id = 'leaflet-css';
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => setLeafletLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current || mapRef.current) return;

    const L = window.L;
    
    // Default center (India)
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false
    }).setView([20.5937, 78.9629], 5);
    
    mapRef.current = map;

    // Google Hybrid Layer
    L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 20,
    }).addTo(map);

    // Add field boundary if available
    if (cropInfo.boundary) {
      try {
        const fieldLayer = L.geoJSON(cropInfo.boundary, {
          style: {
            color: '#10b981', // Emerald 500
            weight: 3,
            opacity: 1,
            fillColor: '#10b981',
            fillOpacity: 0.2
          }
        }).addTo(map);
        
        map.fitBounds(fieldLayer.getBounds(), { padding: [20, 20] });
      } catch (e) {
        console.error("Invalid boundary", e);
      }
    } else {
        // Fallback view if no boundary
        map.setView([20.5937, 78.9629], 4);
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [leafletLoaded, cropInfo.boundary]);

  // Fetch AI Calendar Tasks
  useEffect(() => {
    async function fetchAiTasks() {
      try {
        setLoadingAi(true);
        
        // Get session
        const { data: { session } } = await supabase.auth.getSession();
        
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6fdef95d/ai/generate-calendar`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token || publicAnonKey}`
          },
          body: JSON.stringify({
            cropName: cropInfo.name,
            plantingDate: cropInfo.plantingDate || new Date(Date.now() - (cropInfo.day * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
            location: 'Punjab, India', // Could be dynamic from user profile
            fieldName: cropInfo.field,
            soilType: cropInfo.soilType
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.tasks) {
            setAiTasks(data.tasks);
          }
        }
      } catch (error) {
        console.error("Failed to fetch AI tasks", error);
      } finally {
        setLoadingAi(false);
      }
    }

    fetchAiTasks();
  }, [cropInfo]);

  // Mock additional data for the detail view
  const healthMetrics = [
    { label: 'Moisture', value: '62%', status: 'Optimal', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Soil Temp', value: '24°C', status: 'Normal', icon: ThermometerSun, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Humidity', value: '45%', status: 'Low', icon: Wind, color: 'text-slate-500', bg: 'bg-slate-500/10' },
    { label: 'Health', value: '98%', status: 'Excellent', icon: Leaf, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  // Use AI tasks if available, otherwise fall back to mock
  const displayTasks = aiTasks.length > 0 ? aiTasks : [
    { id: 1, title: 'Apply NPK Fertilizer', date: 'Tomorrow', type: 'Nutrients', urgent: true },
    { id: 2, title: 'Irrigation Cycle 4', date: 'In 3 days', type: 'Watering', urgent: false },
    { id: 3, title: 'Pest Inspection', date: 'In 5 days', type: 'Health', urgent: false },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-3xl overflow-y-auto">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto min-h-screen pb-24 relative"
      >
        {/* Background Gradients */}
        <div className="fixed top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-green-900/20 via-emerald-900/10 to-transparent pointer-events-none -z-10" />
        <div className="fixed top-[-20%] right-[-20%] w-[500px] h-[500px] bg-green-500/20 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* Header */}
        <motion.div variants={item} className="sticky top-0 z-40 p-4 flex items-center justify-between bg-background/0 backdrop-blur-sm">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-background/60 backdrop-blur-md border border-border flex items-center justify-center text-foreground hover:bg-background transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/80">Crop Details</div>
          <button className="w-10 h-10 rounded-full bg-background/60 backdrop-blur-md border border-border flex items-center justify-center text-foreground hover:bg-background transition-colors shadow-sm">
            <MoreVertical className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Hero Section */}
        <motion.div variants={item} className="px-6 pt-4 pb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 text-xs font-bold uppercase tracking-wider mb-3">
                <Sprout className="w-3.5 h-3.5" />
                <span>{cropInfo.field}</span>
              </div>
              <h1 className="text-5xl font-bold text-foreground tracking-tight mb-2">
                {cropInfo.name}
              </h1>
              <p className="text-muted-foreground text-lg">Vegetative Stage</p>
            </div>
          </div>

          {/* Large Progress Ring Card */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-600 to-green-500 p-8 text-white shadow-2xl shadow-green-900/20">
             {/* Background Pattern */}
             <div className="absolute inset-0 opacity-10" 
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} 
             />
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             
             <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative w-48 h-48 mb-6">
                  {/* SVG Circle Progress */}
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle
                      className="text-black/10"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="42"
                      cx="50"
                      cy="50"
                    />
                    <circle
                      className="text-white transition-all duration-1000 ease-out"
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${2 * Math.PI * 42 * (1 - cropInfo.progress / 100)}`}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="42"
                      cx="50"
                      cy="50"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold tracking-tighter">{cropInfo.day}</span>
                    <span className="text-sm font-medium opacity-80 uppercase tracking-wide">Days Old</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-8 w-full border-t border-white/20 pt-6 mt-2">
                  <div className="text-center">
                     <div className="text-xs opacity-70 uppercase tracking-wider mb-1">Total Cycle</div>
                     <div className="text-xl font-bold">{cropInfo.totalDays} Days</div>
                  </div>
                  <div className="h-8 w-px bg-white/20" />
                  <div className="text-center">
                     <div className="text-xs opacity-70 uppercase tracking-wider mb-1">Harvest</div>
                     <div className="text-xl font-bold">~45 Days</div>
                  </div>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div variants={item} className="px-4 mb-8">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4 px-2">Current Status</h3>
          <div className="grid grid-cols-2 gap-3">
            {healthMetrics.map((metric, idx) => (
              <div key={idx} className="bg-card border border-border/50 rounded-2xl p-4 flex flex-col gap-3 hover:bg-card/80 transition-colors shadow-sm">
                <div className="flex justify-between items-start">
                  <div className={`w-10 h-10 rounded-xl ${metric.bg} ${metric.color} flex items-center justify-center`}>
                    <metric.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full bg-muted text-muted-foreground`}>
                    {metric.status}
                  </span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground tracking-tight">{metric.value}</div>
                  <div className="text-xs text-muted-foreground font-medium">{metric.label}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div variants={item} className="px-4 mb-6">
          <div className="flex gap-2 bg-muted/50 rounded-2xl p-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('stages')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'stages'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Growth Stages
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'tasks'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Tasks
            </button>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div variants={item} className="px-4 mb-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Satellite View */}
              <div className="bg-black rounded-[2rem] p-0 relative overflow-hidden h-96 group shadow-2xl border border-border/50">
                {/* Satellite Background */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src="https://images.unsplash.com/photo-1720200793798-947f201e2028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRlbGxpdGUlMjB2aWV3JTIwZmFybSUyMGZpZWxkJTIwY3JvcHMlMjB0b3AlMjBkb3dufGVufDF8fHx8MTc2NjQ2MjIyN3ww&ixlib=rb-4.1.0&q=80&w=1080" 
                    alt="Satellite View" 
                    className="w-full h-full object-cover opacity-80 transition-transform duration-[10s] ease-linear group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                  
                  {/* Digital Grid Overlay */}
                  <div 
                      className="absolute inset-0 opacity-20 pointer-events-none" 
                      style={{ 
                          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                          backgroundSize: '40px 40px'
                      }} 
                  />
                </div>

                {/* HUD Header */}
                <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                        <div className="relative">
                            <Circle className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
                            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
                        </div>
                        <span className="text-xs font-bold text-white uppercase tracking-widest">Live Satellite</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-2 text-center min-w-[80px]">
                        <div className="text-[10px] text-white/60 uppercase tracking-wider font-bold">NDVI Index</div>
                        <div className="text-lg font-bold text-[#8BCF6A]">0.85</div>
                    </div>
                  </div>
                </div>

                {/* Scanning Animation */}
                <motion.div 
                  initial={{ top: '-20%', opacity: 0 }}
                  animate={{ top: ['-20%', '120%'], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-[#8BCF6A]/20 to-transparent z-10 pointer-events-none border-b border-[#8BCF6A]/30"
                />

                {/* Interactive Field Nodes */}
                <div ref={mapContainerRef} className="absolute inset-0 z-20 bg-slate-900/50">
                  {!leafletLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8BCF6A]"></div>
                      </div>
                  )}
                  
                  {/* Overlay Elements on top of map */}
                  <div className="absolute inset-0 pointer-events-none">
                      {/* Node 1: Healthy */}
                      <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="relative group/node pointer-events-auto cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-[#8BCF6A]/90 flex items-center justify-center animate-pulse border border-[#8BCF6A] shadow-[0_0_15px_rgba(139,207,106,0.8)]">
                              <Leaf className="w-4 h-4 text-white" />
                            </div>
                            
                            {/* Tooltip */}
                            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-xl border border-white/10 p-3 rounded-xl opacity-0 group-hover/node:opacity-100 transition-all duration-300 translate-x-2 group-hover/node:translate-x-0 w-32 shadow-2xl z-[1000]">
                                <div className="text-xs font-bold text-white mb-1">Zone A</div>
                                <div className="flex items-center gap-2 text-[10px] text-[#8BCF6A] font-medium">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Optimal Growth
                                </div>
                            </div>
                        </div>
                      </div>

                      {/* Node 2: Moisture Alert */}
                      <div className="absolute bottom-1/3 right-1/4 transform translate-x-1/2 translate-y-1/2">
                        <div className="relative group/node pointer-events-auto cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-[#4A90E2]/90 flex items-center justify-center animate-pulse border border-[#4A90E2] delay-700 shadow-[0_0_15px_rgba(74,144,226,0.8)]">
                              <Droplets className="w-4 h-4 text-white" />
                            </div>
                            
                            {/* Tooltip */}
                            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-xl border border-white/10 p-3 rounded-xl opacity-0 group-hover/node:opacity-100 transition-all duration-300 -translate-x-2 group-hover/node:translate-x-0 w-32 shadow-2xl text-right z-[1000]">
                                <div className="text-xs font-bold text-white mb-1">Zone B</div>
                                <div className="flex items-center justify-end gap-2 text-[10px] text-[#4A90E2] font-medium">
                                  High Moisture
                                  <TrendingUp className="w-3 h-3" />
                                </div>
                            </div>
                        </div>
                      </div>
                  </div>
                </div>

                {/* Bottom Panel */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <div className="bg-black/60 backdrop-blur-xl border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-lg">
                          <Sprout className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-white font-bold text-sm">Growth Velocity</div>
                          <div className="text-white/60 text-xs flex items-center gap-2">
                              +2.4cm / day
                              <span className="text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded text-[10px] font-bold">+12% vs last week</span>
                          </div>
                        </div>
                    </div>
                    
                    <button className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stages' && (
            <GrowthStageFlow
              cropName={cropInfo.name}
              soilType={cropInfo.soilType || 'alluvial_soil'}
              plantingDate={
                cropInfo.plantingDate || 
                new Date(Date.now() - (cropInfo.day * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
              }
              expectedHarvestDate={
                new Date(Date.now() + ((cropInfo.totalDays - cropInfo.day) * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
              }
            />
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-3">
              {loadingAi && aiTasks.length === 0 ? (
                // Skeleton Loading State
                [1, 2, 3].map((i) => (
                  <div key={i} className="bg-card border border-border/50 rounded-2xl p-5 animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                displayTasks.map(task => (
                  <div key={task.id} className="group relative bg-card border border-border/50 rounded-2xl p-5 hover:bg-card/80 transition-all active:scale-[0.99] overflow-hidden">
                    {task.urgent && (
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-red-500/20 to-transparent -translate-y-1/2 translate-x-1/2 rounded-full blur-xl" />
                    )}
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${task.urgent ? 'bg-red-500/10 text-red-600' : 'bg-primary/10 text-primary'}`}>
                          {task.urgent ? <AlertCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground">{task.title}</h4>
                        <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
                          <span>{task.type} • {task.date}</span>
                          {task.reason && (
                            <span className="text-xs text-muted-foreground/70 italic hidden sm:inline-block">
                              — {task.reason}
                            </span>
                          )}
                        </p>
                        {task.stage_name && (
                          <div className="mt-2 inline-flex items-center gap-1 text-xs bg-[#1F3D2B]/10 text-[#1F3D2B] px-2 py-1 rounded-full">
                            <Sprout className="w-3 h-3" />
                            {task.stage_name}
                          </div>
                        )}
                      </div>
                      <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-colors">
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>

        {activeTab === 'overview' && (
          <>
            {/* Tasks Section (shown only on overview tab) */}
            <motion.div variants={item} className="px-4 mb-8">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Recommended Actions</h3>
                  {loadingAi && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
                  {!loadingAi && aiTasks.length > 0 && (
                    <span className="flex items-center gap-1 text-[10px] bg-purple-500/10 text-purple-600 px-2 py-0.5 rounded-full font-bold border border-purple-500/20">
                      <Sparkles className="w-3 h-3" />
                      AI Generated
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => setActiveTab('tasks')}
                  className="text-xs font-bold text-primary hover:text-primary/80"
                >
                  View All
                </button>
              </div>
              
              <div className="space-y-3">
                {displayTasks.slice(0, 3).map(task => (
                  <div key={task.id} className="group relative bg-card border border-border/50 rounded-2xl p-5 hover:bg-card/80 transition-all active:scale-[0.99] overflow-hidden">
                    {task.urgent && (
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-red-500/20 to-transparent -translate-y-1/2 translate-x-1/2 rounded-full blur-xl" />
                    )}
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${task.urgent ? 'bg-red-500/10 text-red-600' : 'bg-primary/10 text-primary'}`}>
                          {task.urgent ? <AlertCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground">{task.title}</h4>
                        <p className="text-sm text-muted-foreground mt-0.5">{task.type} • {task.date}</p>
                      </div>
                      <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-colors">
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}

      </motion.div>
    </div>
  );
}