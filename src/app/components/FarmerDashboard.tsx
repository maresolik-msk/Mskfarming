import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  CircleCheck,
  Circle,
  Mic,
  Camera,
  Wallet,
  ChevronRight,
  FlaskConical,
  TriangleAlert,
  ArrowRight,
  ScanLine,
  Droplets,
  Wheat,
  ClipboardList,
  BookOpen,
  Sprout,
  Plus,
  Award,
  TrendingUp,
  Leaf,
} from 'lucide-react';
import { WeatherForecast } from './WeatherForecast';
import { KrishiKarmaWidget } from './KrishiKarmaWidget';
import { useTranslation } from 'react-i18next';
import Logo from '../../imports/Logo';

interface Task {
  id: string;
  text: string;
  time: string;
  completed: boolean;
}

interface FarmerDashboardProps {
  farmerName: string;
  cropInfo: {
    name: string;
    field: string;
    day: number;
    totalDays: number;
    progress: number;
    boundary?: any;
    soilType?: string;
  };
  tasks: Task[];
  budget: {
    total: number;
    used: number;
  };
  soilHealth?: {
    lastTested: string;
    status: string;
    riskLevel?: 'low' | 'medium' | 'high';
  };
  karmaPoints: number;
  karmaLevel: string;
  nextLevelPoints: number;
  onToggleTask: (id: string) => void;
  onAction: (action: string) => void;
  setActiveView: (view: string) => void;
  setShowAddFieldModal: (show: boolean) => void;
  setShowExpenseTracker: (show: boolean) => void;
  setShowFarmingJournal: (show: boolean) => void;
  setShowVoiceJournal: (show: boolean) => void;
  setShowPhotoCapture: (show: boolean) => void;
  setShowSeedSelection: (show: boolean) => void;
  handleTestSoil: () => void;
  availableFields: any[];
}

export function FarmerDashboard({
  farmerName,
  cropInfo,
  tasks,
  budget = { total: 0, used: 0 },
  soilHealth,
  karmaPoints,
  karmaLevel,
  nextLevelPoints,
  onToggleTask,
  onAction,
  setActiveView,
  setShowAddFieldModal,
  setShowExpenseTracker,
  setShowFarmingJournal,
  setShowVoiceJournal,
  setShowPhotoCapture,
  setShowSeedSelection,
  handleTestSoil,
  availableFields,
}: FarmerDashboardProps) {
  const { t, i18n } = useTranslation();
  const [showAllTasks, setShowAllTasks] = useState(false);

  const criticalBudget = budget.total > 0 ? (budget.used / budget.total) > 0.9 : false;
  const warningBudget = budget.total > 0 ? (budget.used / budget.total) > 0.75 : false;
  const budgetUsedPercent = budget.total > 0 ? Math.round((budget.used / budget.total) * 100) : 0;

  const today = new Date();
  const dateLocale = i18n.language === 'te' ? 'te-IN' : 'en-IN';
  const dateString = today.toLocaleDateString(dateLocale, { weekday: 'long', day: 'numeric', month: 'short' });

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const pendingTasks = safeTasks.filter(t => !t.completed);
  const completedTasks = safeTasks.filter(t => t.completed);
  const displayedTasks = showAllTasks ? safeTasks : safeTasks.slice(0, 3);

  // Generate SVG path from GeoJSON boundary
  const getFieldPath = (boundary: any) => {
    if (!boundary?.geometry?.coordinates?.[0]) return null;
    const coords = boundary.geometry.coordinates[0];
    if (coords.length === 0) return null;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    coords.forEach((c: number[]) => {
      minX = Math.min(minX, c[0]); maxX = Math.max(maxX, c[0]);
      minY = Math.min(minY, c[1]); maxY = Math.max(maxY, c[1]);
    });
    const rangeX = maxX - minX;
    const rangeY = maxY - minY;
    if (rangeX === 0 || rangeY === 0) return null;
    const padding = 10;
    const scaleX = (100 - 2 * padding) / rangeX;
    const scaleY = (100 - 2 * padding) / rangeY;
    const scale = Math.min(scaleX, scaleY);
    const offsetX = (100 - rangeX * scale) / 2;
    const offsetY = (100 - rangeY * scale) / 2;
    const points = coords.map((c: number[]) => {
      const x = (c[0] - minX) * scale + offsetX;
      const y = (maxY - c[1]) * scale + offsetY;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')} Z`;
  };

  const fieldPath = getFieldPath(cropInfo.boundary);

  // Empty state
  if (availableFields.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 px-6"
      >
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-[#812F0F]/20 via-amber-500/10 to-orange-400/20 blur-3xl -z-10 animate-pulse" />
          <div className="bg-white border border-border/50 rounded-3xl p-10 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#812F0F]/10 to-transparent rounded-full blur-3xl -z-10" />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-6 bg-[#812F0F]/10 rounded-2xl flex items-center justify-center p-5"
            >
              <Logo />
            </motion.div>
            <h2 className="text-2xl font-bold mb-3 text-foreground">{t('dashboard.welcomeMessage')}</h2>
            <p className="text-muted-foreground mb-8 text-sm leading-relaxed">{t('dashboard.welcomeSub')}</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowAddFieldModal(true)}
              className="px-8 py-4 bg-[#812F0F] text-white rounded-2xl font-semibold text-base shadow-lg shadow-[#812F0F]/25 flex items-center gap-2 mx-auto active:scale-95 transition-transform"
            >
              <Plus className="w-5 h-5" />
              {t('dashboard.addNewField')}
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-5 pt-4 pb-24"
    >
      {/* ============================================================ */}
      {/* LEVEL 1: Greeting + Date (Emotional anchor) */}
      {/* ============================================================ */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-0.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{dateString}</span>
          </div>
          <h1 className="text-xl font-bold text-foreground leading-tight">
            {t('home.greeting', { name: farmerName })}
          </h1>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200/60 rounded-full">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-xs font-bold text-amber-700">{karmaPoints}</span>
        </div>
      </motion.div>

      {/* ============================================================ */}
      {/* LEVEL 2: Weather (Critical for farming decisions) */}
      {/* ============================================================ */}
      <motion.div variants={item}>
        <WeatherForecast compact />
      </motion.div>

      {/* ============================================================ */}
      {/* LEVEL 3: Crop Status Hero (The most important card) */}
      {/* ============================================================ */}
      <motion.div variants={item}>
        <div
          onClick={() => onAction('crop-details')}
          className="group relative overflow-hidden rounded-2xl cursor-pointer active:scale-[0.98] transition-transform"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {fieldPath ? (
              <>
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center p-10 opacity-30">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path d={fieldPath} fill="rgba(74, 222, 128, 0.25)" stroke="#4ade80" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                  </svg>
                </div>
              </>
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-green-400/15 rounded-full blur-[50px] -translate-y-1/3 translate-x-1/4" />
          </div>

          {/* Content */}
          <div className="relative p-5 text-white">
            {/* Top row: field name + day counter */}
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                  <div className="w-3 h-3 text-green-300"><Logo /></div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-green-50">{cropInfo.field}</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight">{cropInfo.name || 'No Crop'}</h3>
              </div>
              <div className="bg-black/25 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                <span className="text-xs font-bold">{t('growth.days')} {cropInfo.day}</span>
                <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center text-[9px] font-medium text-white/70">
                  {cropInfo.totalDays}
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-end text-xs">
                <span className="text-green-50/70 font-medium">{t('home.farmStatus.growthCycle')}</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xl font-bold text-white">{cropInfo.progress}</span>
                  <span className="text-xs font-medium text-green-300">%</span>
                </div>
              </div>
              <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-full relative overflow-hidden transition-all duration-1000"
                  style={{ width: `${cropInfo.progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/25 animate-[shimmer_2s_infinite]" />
                </div>
              </div>
            </div>

            {/* Footer: next task + arrow */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2.5 text-xs bg-black/20 px-3 py-2 rounded-xl backdrop-blur-md border border-white/5">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-yellow-400 animate-ping opacity-75" />
                </div>
                <div className="flex flex-col leading-none gap-0.5">
                  <span className="text-[9px] text-white/50 font-medium uppercase tracking-wider">{t('home.farmStatus.nextTask')}</span>
                  <span className="font-bold text-[11px]">Fertilizer in 3 days</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <ArrowRight className="w-4 h-4 stroke-[3] -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ============================================================ */}
      {/* LEVEL 4: Urgent Alerts (Conditional) */}
      {/* ============================================================ */}
      <AnimatePresence>
        {(criticalBudget || warningBudget || (soilHealth?.riskLevel === 'high')) && (
          <motion.div
            variants={item}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {(criticalBudget || warningBudget) && (
              <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                criticalBudget
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : 'bg-orange-50 border-orange-200 text-orange-900'
              }`}>
                <TriangleAlert className={`w-4 h-4 shrink-0 mt-0.5 ${criticalBudget ? 'text-red-600' : 'text-orange-600'}`} />
                <div>
                  <h4 className="font-semibold text-sm">{t('home.budget.attention')}</h4>
                  <p className="text-xs opacity-80 mt-0.5">
                    {criticalBudget
                      ? t('home.budget.critical', { percent: budgetUsedPercent })
                      : t('home.budget.warning', { percent: budgetUsedPercent })}
                  </p>
                </div>
              </div>
            )}
            {soilHealth?.riskLevel === 'high' && (
              <div className="p-3.5 rounded-xl border bg-red-50 border-red-200 text-red-900 flex items-start gap-3">
                <FlaskConical className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Soil Health Critical</h4>
                  <p className="text-xs opacity-80 mt-0.5">Your soil needs attention. Tap to view recommendations.</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* LEVEL 5: Today's Tasks (What to do right now) */}
      {/* ============================================================ */}
      <motion.div variants={item}>
        <div className="bg-white border border-border/60 rounded-2xl overflow-hidden shadow-sm">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#812F0F] flex items-center justify-center">
                <CircleCheck className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-foreground text-sm">{t('home.dailyPlan.title')}</h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-[#812F0F]/10 text-[#812F0F] rounded-full">
              {t('home.dailyPlan.pending', { count: pendingTasks.length })}
            </span>
          </div>

          {/* Task List */}
          <div className="divide-y divide-border/30">
            {safeTasks.length === 0 ? (
              <div className="text-center py-8 px-4">
                <ClipboardList className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No tasks yet</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Add a field to get AI recommendations</p>
              </div>
            ) : (
              displayedTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className="px-4 py-3 flex items-start gap-3 hover:bg-muted/30 transition-colors cursor-pointer active:bg-muted/50"
                >
                  <div className={`mt-0.5 transition-colors ${task.completed ? 'text-[#812F0F]' : 'text-muted-foreground/40'}`}>
                    {task.completed ? <CircleCheck className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-snug transition-all ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground font-medium'}`}>
                      {task.text}
                    </p>
                    <p className="text-[11px] text-muted-foreground/60 mt-0.5">{task.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Show more/less */}
          {safeTasks.length > 3 && (
            <button
              onClick={() => setShowAllTasks(!showAllTasks)}
              className="w-full px-4 py-2.5 text-xs font-semibold text-[#812F0F] hover:bg-[#812F0F]/5 transition-colors border-t border-border/30"
            >
              {showAllTasks ? 'Show Less' : `Show All ${safeTasks.length} Tasks`}
            </button>
          )}
        </div>
      </motion.div>

      {/* ============================================================ */}
      {/* LEVEL 6: Primary Quick Actions (Most-used farmer actions) */}
      {/* ============================================================ */}
      <motion.div variants={item}>
        <h3 className="text-sm font-bold text-foreground mb-2.5">{t('home.actions.title')}</h3>
        <div className="space-y-2.5">
          {/* Voice Log - Primary CTA (full width) */}
          <button
            onClick={() => setShowVoiceJournal(true)}
            className="w-full flex items-center gap-3.5 p-3.5 bg-[#812F0F] text-white rounded-xl shadow-md shadow-[#812F0F]/20 hover:bg-[#812F0F]/90 active:scale-[0.98] transition-all"
          >
            <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <Mic className="w-5 h-5" />
            </div>
            <div className="text-left flex-1">
              <div className="font-semibold">{t('home.actions.voice.title')}</div>
              <div className="text-xs text-white/70">{t('home.actions.voice.desc')}</div>
            </div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          {/* Secondary actions row */}
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => setShowPhotoCapture(true)}
              className="flex flex-col items-center gap-1.5 p-3 bg-white border border-border/50 rounded-xl hover:bg-muted/30 active:scale-95 transition-all shadow-sm"
            >
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Camera className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-foreground/80">{t('home.actions.photo.title')}</span>
            </button>

            <button
              onClick={() => setShowExpenseTracker(true)}
              className="flex flex-col items-center gap-1.5 p-3 bg-white border border-border/50 rounded-xl hover:bg-muted/30 active:scale-95 transition-all shadow-sm"
            >
              <div className="w-9 h-9 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-foreground/80">{t('home.actions.expense.title')}</span>
            </button>

            <button
              onClick={() => setShowFarmingJournal(true)}
              className="flex flex-col items-center gap-1.5 p-3 bg-white border border-border/50 rounded-xl hover:bg-muted/30 active:scale-95 transition-all shadow-sm"
            >
              <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-foreground/80">Log Activity</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ============================================================ */}
      {/* LEVEL 7: Farm Status Monitor (Budget, Soil, Seeds) */}
      {/* ============================================================ */}
      <motion.div variants={item}>
        <h3 className="text-sm font-bold text-foreground mb-2.5">{t('home.farmStatus.title')}</h3>
        <div className="space-y-2">
          {/* Budget Snapshot */}
          <button
            onClick={() => setActiveView('expenses')}
            className="w-full bg-white border border-border/50 rounded-xl p-3.5 flex items-center justify-between hover:bg-muted/20 active:scale-[0.98] transition-all shadow-sm text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground">{t('home.budget.monthly')}</div>
                <div className="font-bold text-foreground text-sm">
                  ₹{budget.used.toLocaleString()} <span className="text-muted-foreground font-normal text-xs">{t('home.budget.used')}</span>
                </div>
              </div>
            </div>
            <div className="text-right flex items-center gap-2">
              <div>
                <div className="text-sm font-semibold text-foreground">₹{(budget.total - budget.used).toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground">{t('home.budget.remaining')}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
            </div>
          </button>

          {/* Soil Health */}
          <button
            onClick={() => handleTestSoil()}
            className="w-full bg-white border border-border/50 rounded-xl p-3.5 flex items-center justify-between hover:bg-muted/20 active:scale-[0.98] transition-all shadow-sm text-left"
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                soilHealth
                  ? soilHealth.riskLevel === 'high' ? 'bg-red-50 text-red-600'
                  : soilHealth.riskLevel === 'medium' ? 'bg-orange-50 text-orange-600'
                  : 'bg-green-50 text-green-600'
                  : 'bg-amber-50 text-amber-600'
              }`}>
                <FlaskConical className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground">{t('home.farmStatus.soilHealth')}</div>
                <div className="font-bold text-foreground text-sm">
                  {soilHealth
                    ? new Date(soilHealth.lastTested).toLocaleDateString(dateLocale, { month: 'short', day: 'numeric' })
                    : t('home.farmStatus.checkStatus')}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {soilHealth ? (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  soilHealth.riskLevel === 'high' ? 'bg-red-100 text-red-700'
                  : soilHealth.riskLevel === 'medium' ? 'bg-orange-100 text-orange-700'
                  : 'bg-green-100 text-green-700'
                }`}>{soilHealth.status}</span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-semibold">Test Now</span>
              )}
              <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
            </div>
          </button>

          {/* Seed Advisor */}
          <button
            onClick={() => setShowSeedSelection(true)}
            className="w-full bg-white border border-border/50 rounded-xl p-3.5 flex items-center justify-between hover:bg-muted/20 active:scale-[0.98] transition-all shadow-sm text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 p-2">
                <Logo />
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground">{t('home.farmStatus.seedAdvisor')}</div>
                <div className="font-bold text-foreground text-sm">{t('home.farmStatus.nextSeason')}</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
          </button>
        </div>
      </motion.div>

      {/* ============================================================ */}
      {/* LEVEL 8: Farm Tools Grid (Secondary actions) */}
      {/* ============================================================ */}
      <motion.div variants={item}>
        <h3 className="text-sm font-bold text-foreground mb-2.5">Farm Tools</h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: ScanLine, label: 'Scout', color: 'bg-emerald-50 text-emerald-600', view: 'scouting' },
            { icon: Droplets, label: 'Inputs', color: 'bg-blue-50 text-blue-600', view: 'inputs' },
            { icon: Wheat, label: 'Harvest', color: 'bg-amber-50 text-amber-600', view: 'harvest' },
            { icon: Sprout, label: 'Crops', color: 'bg-green-50 text-green-600', view: 'crop_manager' },
          ].map((tool, idx) => (
            <motion.button
              key={tool.view}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + idx * 0.06 }}
              onClick={() => setActiveView(tool.view)}
              className="flex flex-col items-center gap-1.5 p-3 bg-white border border-border/50 rounded-xl hover:bg-muted/20 active:scale-95 transition-all shadow-sm"
            >
              <div className={`w-10 h-10 rounded-xl ${tool.color} flex items-center justify-center`}>
                <tool.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-semibold text-foreground/70">{tool.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Crop Cycle as wider button below */}
        <button
          onClick={() => setActiveView('crop_cycle')}
          className="w-full mt-2 flex items-center gap-3 p-3 bg-white border border-border/50 rounded-xl hover:bg-muted/20 active:scale-[0.98] transition-all shadow-sm"
        >
          <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-left flex-1">
            <span className="text-sm font-semibold text-foreground">Crop Cycle Tracker</span>
            <p className="text-[10px] text-muted-foreground">Timeline, stages & milestones</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
        </button>

        {/* Horticulture Guide button */}
        <button
          onClick={() => setActiveView('horticulture')}
          className="w-full mt-2 flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 rounded-xl hover:from-green-100 hover:to-emerald-100 active:scale-[0.98] transition-all shadow-sm"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center shadow-sm">
            <Leaf className="w-4 h-4" />
          </div>
          <div className="text-left flex-1">
            <span className="text-sm font-semibold text-foreground">Horticulture Guide</span>
            <p className="text-[10px] text-muted-foreground">Fruits, vegetables, herbs - grow & sell organically</p>
          </div>
          <ChevronRight className="w-4 h-4 text-green-400" />
        </button>
      </motion.div>

      {/* ============================================================ */}
      {/* LEVEL 9: Krishi Karma (Gamification - lowest priority) */}
      {/* ============================================================ */}
      <motion.div variants={item}>
        <KrishiKarmaWidget points={karmaPoints} level={karmaLevel} nextLevelPoints={nextLevelPoints} />
      </motion.div>
    </motion.div>
  );
}
