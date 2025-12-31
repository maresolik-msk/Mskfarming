import { motion } from 'motion/react';
import { 
  Sun, 
  Cloud, 
  Mic, 
  Camera, 
  Wallet, 
  ClipboardEdit, 
  TriangleAlert, 
  CircleCheck, 
  Circle, 
  Sprout, 
  ChevronRight, 
  Droplets,
  Calendar,
  ArrowRight,
  FlaskConical,
} from 'lucide-react';
import { WeatherForecast } from './WeatherForecast';
import { useTranslation } from 'react-i18next';
import Logo from '../../imports/Logo';

interface Task {
  id: string;
  text: string;
  time: string;
  completed: boolean;
}

interface HomeViewProps {
  farmerName: string;
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
  tasks: Task[];
  budget: {
    total: number;
    used: number;
  };
  soilHealth?: {
    lastTested: string;
    status: 'Good' | 'Average' | 'Poor';
    riskLevel?: 'low' | 'medium' | 'high';
  };
  onToggleTask: (id: string) => void;
  onAction: (action: 'voice' | 'photo' | 'expense' | 'journal' | 'guidance' | 'soil-test' | 'seed-selection' | 'crop-details') => void;
}

export function HomeView({ 
  farmerName, 
  cropInfo, 
  tasks, 
  budget = { total: 0, used: 0 }, 
  soilHealth,
  onToggleTask, 
  onAction 
}: HomeViewProps) {
  const { t, i18n } = useTranslation();
  
  const criticalBudget = budget.total > 0 ? (budget.used / budget.total) > 0.9 : false;
  const warningBudget = budget.total > 0 ? (budget.used / budget.total) > 0.75 : false;
  
  // Get current date formatted nicely based on locale
  const today = new Date();
  const dateLocale = i18n.language === 'te' ? 'te-IN' : 'en-IN';
  const dateString = today.toLocaleDateString(dateLocale, { weekday: 'long', day: 'numeric', month: 'short' });

  // Helper to generate SVG path from GeoJSON
  const getFieldPath = (boundary: any) => {
    if (!boundary?.geometry?.coordinates?.[0]) return null;
    
    const coords = boundary.geometry.coordinates[0];
    if (coords.length === 0) return null;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    coords.forEach((c: number[]) => {
      minX = Math.min(minX, c[0]);
      maxX = Math.max(maxX, c[0]);
      minY = Math.min(minY, c[1]);
      maxY = Math.max(maxY, c[1]);
    });

    const rangeX = maxX - minX;
    const rangeY = maxY - minY;
    
    if (rangeX === 0 || rangeY === 0) return null;

    // Add 10% padding
    const padding = 10;
    const scaleX = (100 - 2 * padding) / rangeX;
    const scaleY = (100 - 2 * padding) / rangeY;
    const scale = Math.min(scaleX, scaleY);
    
    // Center the shape
    const offsetX = (100 - rangeX * scale) / 2;
    const offsetY = (100 - rangeY * scale) / 2;

    const points = coords.map((c: number[]) => {
      const x = (c[0] - minX) * scale + offsetX;
      // Flip Y axis for SVG (lat increases upwards, SVG Y increases downwards)
      const y = (maxY - c[1]) * scale + offsetY;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')} Z`;
  };

  const fieldPath = getFieldPath(cropInfo.boundary);

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

  // Safe tasks array
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const budgetUsedPercent = budget.total > 0 ? Math.round((budget.used / budget.total) * 100) : 0;

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 pt-[24px] pr-[0px] pb-[80px] pl-[0px] px-[0px] py-[24px]"
    >
      {/* Level 1: Context & Greeting */}
      <motion.div variants={item} className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Calendar className="w-4 h-4" />
          <span>{dateString}</span>
        </div>
        <h1 className="text-2xl font-medium text-foreground">
          {t('home.greeting', { name: farmerName })}
        </h1>
      </motion.div>

      {/* Level 2: Weather Snapshot (Simplified for glanceability) */}
      <motion.div variants={item}>
        <WeatherForecast />
      </motion.div>

      {/* Level 3: Urgent Alerts (Conditional) */}
      {(criticalBudget || warningBudget) && (
        <motion.div variants={item} className={`p-4 rounded-xl border ${criticalBudget ? 'bg-red-50 border-red-200 text-red-900' : 'bg-orange-50 border-orange-200 text-orange-900'}`}>
          <div className="flex items-start gap-3">
            <TriangleAlert className={`w-5 h-5 ${criticalBudget ? 'text-red-600' : 'text-orange-600'} shrink-0 mt-0.5`} />
            <div>
              <h3 className="font-medium mb-1">{t('home.budget.attention')}</h3>
              <p className="text-sm opacity-90">
                {criticalBudget 
                  ? t('home.budget.critical', { percent: budgetUsedPercent })
                  : t('home.budget.warning', { percent: budgetUsedPercent })}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Level 4: Core Actions (The Worker) */}
      <motion.div variants={item}>
        <h2 className="text-lg font-medium mb-3 text-foreground">{t('home.actions.title')}</h2>
        <div className="grid grid-cols-2 gap-3">
          {/* Voice Note - Primary Action */}
          <button
            onClick={() => onAction('voice')}
            className="col-span-2 flex items-center gap-4 p-4 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Mic className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-lg">{t('home.actions.voice.title')}</div>
              <div className="text-sm text-primary-foreground/80">{t('home.actions.voice.desc')}</div>
            </div>
            <ChevronRight className="w-5 h-5 ml-auto opacity-70" />
          </button>

          {/* Secondary Actions */}
          <button
            onClick={() => onAction('photo')}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <span className="font-medium text-sm">{t('home.actions.photo.title')}</span>
          </button>

          <button
            onClick={() => onAction('expense')}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="font-medium text-sm">{t('home.actions.expense.title')}</span>
          </button>
        </div>
      </motion.div>

      {/* Level 5: Daily Guidance (The Advisor) */}
      <motion.div variants={item} className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <h2 className="font-medium text-foreground flex items-center gap-2">
            <ClipboardEdit className="w-4 h-4 text-primary" />
            {t('home.dailyPlan.title')}
          </h2>
          <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
            {t('home.dailyPlan.pending', { count: safeTasks.filter(t => !t.completed).length })}
          </span>
        </div>
        <div className="divide-y divide-border">
          {safeTasks.map((task) => (
            <div 
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className="p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className={`mt-0.5 transition-colors ${task.completed ? 'text-primary' : 'text-muted-foreground'}`}>
                {task.completed ? <CircleCheck className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium transition-all ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                  {task.text}
                </p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  {task.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Level 6: Farm Status (The Monitor) */}
      <motion.div variants={item}>
        <h2 className="text-lg font-medium mb-3 text-foreground">{t('home.farmStatus.title')}</h2>
        <div className="grid grid-cols-1 gap-4">
          {/* Crop Card */}
          <div className="group relative overflow-hidden rounded-2xl shadow-lg transition-all hover:shadow-xl bg-gradient-to-br from-slate-900 to-slate-800">
            {/* Background Image or Field Shape */}
            <div className="absolute inset-0">
              {fieldPath ? (
                <div className="w-full h-full relative overflow-hidden bg-slate-900">
                  {/* Grid Pattern Background */}
                  <div className="absolute inset-0 opacity-20" 
                    style={{ 
                      backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', 
                      backgroundSize: '20px 20px' 
                    }} 
                  />
                  
                  {/* Field SVG */}
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl filter">
                      {/* Glow effect */}
                      <path d={fieldPath} fill="none" stroke="rgba(74, 222, 128, 0.3)" strokeWidth="4" className="blur-sm" />
                      {/* Main shape */}
                      <path d={fieldPath} fill="rgba(74, 222, 128, 0.2)" stroke="#4ade80" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                    </svg>
                  </div>

                  {/* Satellite texture overlay (optional, subtle) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                </div>
              ) : (
                <>
                  <img 
                    src="https://images.unsplash.com/photo-1607801219089-8dc5a700245d?auto=format&fit=crop&w=800&q=80" 
                    alt="Field" 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                </>
              )}
            </div>

            <div 
              onClick={() => onAction('crop-details')}
              className="relative p-7 text-white cursor-pointer group select-none"
            >
              {/* Dynamic Background */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-green-400/20 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:bg-green-400/30 transition-all duration-700 ease-out" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/20 rounded-full blur-[50px] translate-y-1/2 -translate-x-1/3 group-hover:bg-emerald-500/20 transition-all duration-700 ease-out" />
              
              {/* Header */}
              <div className="relative z-10 flex items-start justify-between mb-8">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-sm">
                    <div className="w-4 h-4 text-green-300">
                      <Logo />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-green-50">{cropInfo.field}</span>
                  </div>
                  <h3 className="text-4xl font-bold tracking-tight text-white drop-shadow-sm group-hover:scale-[1.02] transition-transform duration-300 origin-left">
                    {cropInfo.name}
                  </h3>
                </div>
                
                {/* Day Counter */}
                <div className="flex flex-col items-end">
                   <div className="bg-black/20 backdrop-blur-md border border-white/10 text-white pl-4 pr-1 py-1 rounded-full shadow-lg flex items-center gap-3 group-hover:bg-black/30 transition-all">
                     <span className="text-xs font-bold tracking-wide">{t('growth.days')} {cropInfo.day}</span>
                     <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-medium text-white/80">
                        {cropInfo.totalDays}
                     </div>
                   </div>
                </div>
              </div>

              {/* Progress Section */}
              <div className="relative z-10 space-y-5">
                <div className="flex justify-between items-end text-sm">
                  <span className="text-green-50/80 font-medium flex items-center gap-2">
                    {t('home.farmStatus.growthCycle')}
                  </span>
                  <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-white tracking-tight">{cropInfo.progress}</span>
                      <span className="text-sm font-medium text-green-300">%</span>
                  </div>
                </div>
                
                {/* Premium Progress Bar */}
                <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden backdrop-blur-md border border-white/5 p-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-full shadow-[0_0_20px_rgba(74,222,128,0.4)] relative overflow-hidden transition-all duration-1000 ease-out group-hover:shadow-[0_0_25px_rgba(74,222,128,0.6)]" 
                    style={{ width: `${cropInfo.progress}%` }} 
                  >
                     <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" />
                  </div>
                </div>

                {/* Footer / Next Action */}
                <div className="pt-5 mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-3.5 text-sm text-white bg-black/20 pl-3 pr-4 py-2.5 rounded-2xl backdrop-blur-md border border-white/5 shadow-sm group-hover:bg-black/30 transition-colors">
                    <div className="relative flex-shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse relative z-10" />
                        <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping opacity-75" />
                    </div>
                    <div className="flex flex-col leading-none gap-1">
                        <span className="text-[10px] text-white/60 font-medium uppercase tracking-wide">{t('home.farmStatus.nextTask')}</span>
                        <span className="font-bold text-xs">Fertilizer in 3 days</span>
                    </div>
                  </div>
                  
                  <div className="w-12 h-12 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-110 group-active:scale-95 transition-all duration-300">
                    <ArrowRight className="w-6 h-6 stroke-[3] -rotate-45 group-hover:rotate-0 transition-transform duration-500 ease-out" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Snapshot */}
          <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t('home.budget.monthly')}</div>
                <div className="font-bold text-foreground">₹{budget.used.toLocaleString()} <span className="text-muted-foreground font-normal text-xs">{t('home.budget.used')}</span></div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">₹{(budget.total - budget.used).toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">{t('home.budget.remaining')}</div>
            </div>
          </div>

          {/* Soil Health Card */}
          <button 
            onClick={() => onAction('soil-test')}
            className="group bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:bg-muted/50 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                soilHealth 
                  ? soilHealth.riskLevel === 'high' ? 'bg-red-100 text-red-700 group-hover:bg-red-200'
                  : soilHealth.riskLevel === 'medium' ? 'bg-orange-100 text-orange-700 group-hover:bg-orange-200'
                  : 'bg-green-100 text-green-700 group-hover:bg-green-200'
                  : 'bg-amber-100 text-amber-700 group-hover:bg-amber-200'
              }`}>
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t('home.farmStatus.soilHealth')}</div>
                <div className="font-bold text-foreground">
                  {soilHealth 
                    ? new Date(soilHealth.lastTested).toLocaleDateString(dateLocale, { month: 'short', day: 'numeric' })
                    : t('home.farmStatus.checkStatus')}
                </div>
              </div>
            </div>
            <div className="text-right">
              {soilHealth ? (
                 <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                  soilHealth.riskLevel === 'high' ? 'bg-red-100 text-red-700'
                  : soilHealth.riskLevel === 'medium' ? 'bg-orange-100 text-orange-700'
                  : 'bg-green-100 text-green-700'
                }`}>
                  {soilHealth.status}
                </div>
              ) : (
                <div className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">
                   {t('home.farmStatus.checkStatus')}
                </div>
              )}
            </div>
          </button>

          {/* Seed Selection Card */}
          <button 
            onClick={() => onAction('seed-selection')}
            className="group bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:bg-muted/50 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-200 transition-colors p-2">
                <Logo />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t('home.farmStatus.seedAdvisor')}</div>
                <div className="font-bold text-foreground">{t('home.farmStatus.nextSeason')}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                 <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
