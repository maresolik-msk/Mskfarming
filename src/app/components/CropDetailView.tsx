import { motion } from 'motion/react';
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
  Leaf
} from 'lucide-react';

interface CropDetailViewProps {
  cropInfo: {
    name: string;
    field: string;
    day: number;
    totalDays: number;
    progress: number;
  };
  onBack: () => void;
}

export function CropDetailView({ cropInfo, onBack }: CropDetailViewProps) {
  // Mock additional data for the detail view
  const healthMetrics = [
    { label: 'Moisture', value: '62%', status: 'Optimal', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Soil Temp', value: '24°C', status: 'Normal', icon: ThermometerSun, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Humidity', value: '45%', status: 'Low', icon: Wind, color: 'text-slate-500', bg: 'bg-slate-500/10' },
    { label: 'Health', value: '98%', status: 'Excellent', icon: Leaf, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  const upcomingTasks = [
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

        {/* Tasks Section */}
        <motion.div variants={item} className="px-4 mb-8">
           <div className="flex items-center justify-between mb-4 px-2">
             <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Recommended Actions</h3>
             <button className="text-xs font-bold text-primary hover:text-primary/80">View All</button>
           </div>
           
           <div className="space-y-3">
             {upcomingTasks.map(task => (
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

        {/* Weekly Chart Placeholder */}
        <motion.div variants={item} className="px-4 pb-8">
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
                      <div className="text-lg font-bold text-emerald-400">0.85</div>
                   </div>
                </div>
             </div>

             {/* Scanning Animation */}
             <motion.div 
               initial={{ top: '-20%', opacity: 0 }}
               animate={{ top: ['-20%', '120%'], opacity: [0, 1, 1, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent z-10 pointer-events-none border-b border-emerald-500/30"
             />

             {/* Interactive Field Nodes */}
             <div className="absolute inset-0 z-20">
                {/* Node 1: Healthy */}
                <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 group/node cursor-pointer">
                   <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center animate-pulse border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                         <Leaf className="w-4 h-4 text-emerald-400" />
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-xl border border-white/10 p-3 rounded-xl opacity-0 group-hover/node:opacity-100 transition-all duration-300 translate-x-2 group-hover/node:translate-x-0 w-32 shadow-2xl z-30 pointer-events-none">
                          <div className="text-xs font-bold text-white mb-1">Zone A</div>
                          <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-medium">
                             <CheckCircle2 className="w-3 h-3" />
                             Optimal Growth
                          </div>
                      </div>
                   </div>
                </div>

                {/* Node 2: Moisture Alert */}
                <div className="absolute bottom-1/3 right-1/4 transform translate-x-1/2 translate-y-1/2 group/node cursor-pointer">
                   <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center animate-pulse border border-blue-500/50 delay-700 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                         <Droplets className="w-4 h-4 text-blue-400" />
                      </div>
                      
                       {/* Tooltip */}
                      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-xl border border-white/10 p-3 rounded-xl opacity-0 group-hover/node:opacity-100 transition-all duration-300 -translate-x-2 group-hover/node:translate-x-0 w-32 shadow-2xl text-right z-30 pointer-events-none">
                          <div className="text-xs font-bold text-white mb-1">Zone B</div>
                          <div className="flex items-center justify-end gap-2 text-[10px] text-blue-400 font-medium">
                             High Moisture
                             <TrendingUp className="w-3 h-3" />
                          </div>
                      </div>
                   </div>
                </div>
                
                 {/* Node 3: Warning */}
                <div className="absolute top-1/2 right-1/3 transform translate-x-1/2 -translate-y-1/2 group/node cursor-pointer">
                   <div className="relative">
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center animate-pulse border border-amber-500/50 delay-1000 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                         <AlertCircle className="w-3 h-3 text-amber-400" />
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
        </motion.div>

      </motion.div>
    </div>
  );
}
