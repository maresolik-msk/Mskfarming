import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sprout, Calendar, CheckCircle2, Circle, AlertTriangle,
  ChevronRight, ChevronDown, Plus, Loader2, Leaf, Droplets,
  Sun, Zap, Shield, Bell, Target, Trash2, X,
  ChevronLeft, Sparkles, Activity
} from 'lucide-react';
import { toast } from 'sonner';
import {
  activateCropCycle, getActiveCropCycles, getCropCycleDetail,
  updateCropCycleActivity, addCustomActivity, deleteCustomActivity
} from '../../lib/api';

// ─── Types ───
interface CropActivity {
  id: string;
  date: string;
  title: string;
  type: 'action' | 'alert' | 'warning';
  stage_id: number | null;
  stage_name: string | null;
  source: 'system' | 'ai' | 'custom';
  status: 'pending' | 'completed' | 'skipped';
  notes: string;
  priority: 'high' | 'medium' | 'low';
}

interface TimelineStage {
  stage_id: number;
  stage_name: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  soil_specific_notes: string;
  key_actions: string[];
  risk_factors: string[];
  ai_alerts: string[];
}

interface ActiveCycle {
  id: string;
  crop_name: string;
  crop_id: string;
  soil_type: string;
  sowing_date: string;
  cycle_end_date: string;
  cycle_duration_days: string;
  image_url: string;
  field_name: string | null;
  status: string;
  timeline: TimelineStage[];
  activities: CropActivity[];
  today_summary?: {
    date: string;
    activities: CropActivity[];
    pending: number;
    completed: number;
    total: number;
  };
  current_stage?: TimelineStage | null;
  progress_percent: number;
}

// ─── Activity Type Config ───
const actTypeConfig: Record<string, { icon: typeof Sprout; color: string; bg: string }> = {
  action: { icon: Sprout, color: 'text-[#4F8F4A]', bg: 'bg-[#4F8F4A]/10' },
  alert: { icon: Bell, color: 'text-[#E4490D]', bg: 'bg-[#E4490D]/10' },
  warning: { icon: AlertTriangle, color: 'text-[#E6A23C]', bg: 'bg-[#E6A23C]/10' },
};

const stageIcons: Record<number, typeof Sprout> = {
  1: Target, 2: Sparkles, 3: Sprout, 4: Leaf, 5: Activity,
  6: Sun, 7: Droplets, 8: Zap, 9: CheckCircle2, 10: Shield,
};

// ─── Subcomponents ───

function ActivityItem({
  activity,
  onToggle,
  onDelete,
  cycleId,
}: {
  activity: CropActivity;
  onToggle: (id: string, status: string) => void;
  onDelete?: (id: string) => void;
  cycleId: string;
}) {
  const config = actTypeConfig[activity.type] || actTypeConfig.action;
  const Icon = config.icon;
  const isDone = activity.status === 'completed';
  const isSkipped = activity.status === 'skipped';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
        isDone
          ? 'bg-green-50/60 border-green-200/50 opacity-70'
          : isSkipped
          ? 'bg-gray-50/60 border-gray-200/50 opacity-50'
          : 'bg-white/70 border-[#812F0F]/8 hover:bg-white/90 hover:border-[#812F0F]/15'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() =>
          onToggle(activity.id, isDone ? 'pending' : 'completed')
        }
        className="mt-0.5 shrink-0"
      >
        {isDone ? (
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        ) : (
          <Circle className="w-5 h-5 text-[#812F0F]/30 hover:text-[#812F0F]/60 transition-colors" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`p-1 rounded-md ${config.bg}`}>
            <Icon className={`w-3 h-3 ${config.color}`} />
          </div>
          <p
            className={`text-sm font-medium leading-snug ${
              isDone ? 'line-through text-[#2A0F05]/40' : 'text-[#2A0F05]/80'
            }`}
          >
            {activity.title}
          </p>
        </div>
        {activity.stage_name && (
          <p className="text-[10px] text-[#2A0F05]/35 mt-1 font-medium">
            Stage {activity.stage_id}: {activity.stage_name}
          </p>
        )}
        {activity.notes && (
          <p className="text-[10px] text-[#2A0F05]/30 mt-0.5 italic">{activity.notes}</p>
        )}
      </div>

      {/* Priority & Source badges */}
      <div className="flex items-center gap-1.5 shrink-0">
        {activity.source === 'custom' && (
          <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#8B5CF6]/10 text-[#8B5CF6] font-bold uppercase">
            Custom
          </span>
        )}
        {activity.priority === 'high' && !isDone && (
          <span className="text-[8px] px-1.5 py-0.5 rounded bg-red-50 text-red-500 font-bold uppercase">
            High
          </span>
        )}
        {activity.source === 'custom' && onDelete && (
          <button
            onClick={() => onDelete(activity.id)}
            className="p-1 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
          </button>
        )}
        {!isDone && !isSkipped && (
          <button
            onClick={() => onToggle(activity.id, 'skipped')}
            className="text-[9px] text-[#2A0F05]/30 hover:text-[#2A0F05]/60 font-medium"
          >
            Skip
          </button>
        )}
      </div>
    </motion.div>
  );
}

function AddActivityForm({
  cycleId,
  defaultDate,
  stages,
  onAdded,
  onCancel,
}: {
  cycleId: string;
  defaultDate: string;
  stages: TimelineStage[];
  onAdded: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(defaultDate);
  const [priority, setPriority] = useState('medium');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Find which stage this date falls in
  const matchedStage = stages.find(
    (s) => date >= s.start_date && date <= s.end_date
  );

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Please enter an activity title');
      return;
    }
    setSaving(true);
    try {
      const res = await addCustomActivity(cycleId, {
        title: title.trim(),
        date,
        type: 'action',
        stage_id: matchedStage?.stage_id,
        stage_name: matchedStage?.stage_name,
        priority,
        notes: notes.trim(),
      });
      if (res.success) {
        toast.success('Activity added');
        onAdded();
      } else {
        toast.error(res.error || 'Failed to add');
      }
    } catch (e) {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-white/80 backdrop-blur-sm border border-[#812F0F]/12 rounded-2xl p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-[#2A0F05]">Add Custom Activity</h4>
        <button onClick={onCancel} className="p-1 hover:bg-[#812F0F]/5 rounded-lg">
          <X className="w-4 h-4 text-[#2A0F05]/40" />
        </button>
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What do you need to do?"
        className="w-full px-4 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#812F0F]/10 text-sm text-[#2A0F05] placeholder:text-[#2A0F05]/30 focus:outline-none focus:border-[#812F0F]/25"
      />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-[#2A0F05]/40 font-bold uppercase tracking-wider">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-lg bg-[#F7F6F2] border border-[#812F0F]/10 text-xs text-[#2A0F05] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] text-[#2A0F05]/40 font-bold uppercase tracking-wider">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-lg bg-[#F7F6F2] border border-[#812F0F]/10 text-xs text-[#2A0F05] focus:outline-none"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {matchedStage && (
        <p className="text-[10px] text-[#4F8F4A] bg-[#4F8F4A]/5 px-3 py-1.5 rounded-lg">
          This falls in Stage {matchedStage.stage_id}: {matchedStage.stage_name}
        </p>
      )}

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Optional notes..."
        rows={2}
        className="w-full px-4 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#812F0F]/10 text-sm text-[#2A0F05] placeholder:text-[#2A0F05]/30 focus:outline-none resize-none"
      />

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={saving || !title.trim()}
          className="flex-1 py-2.5 bg-[#812F0F] text-white text-sm font-bold rounded-xl hover:bg-[#6D280D] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add Activity
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2.5 bg-[#F7F6F2] text-[#2A0F05]/60 text-sm font-medium rounded-xl hover:bg-[#EBE6DF] transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───

export function CropCycleTracker() {
  const [cycles, setCycles] = useState<ActiveCycle[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<ActiveCycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewDate, setViewDate] = useState(new Date().toISOString().split('T')[0]);
  const [expandedStage, setExpandedStage] = useState<number | null>(null);
  const [showActivation, setShowActivation] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [view, setView] = useState<'today' | 'timeline' | 'calendar'>('today');

  // Activation form state
  const [actCrop, setActCrop] = useState('paddy');
  const [actSowingDate, setActSowingDate] = useState(new Date().toISOString().split('T')[0]);
  const [actSoilType, setActSoilType] = useState('alluvial_soil');
  const [actFieldName, setActFieldName] = useState('');
  const [activating, setActivating] = useState(false);

  const availableCrops = [
    { id: 'paddy', name: 'Paddy (Rice)', soils: ['alluvial_soil'] },
    { id: 'wheat', name: 'Wheat', soils: ['alluvial_soil'] },
    { id: 'sugarcane', name: 'Sugarcane', soils: ['alluvial_soil'] },
    { id: 'maize', name: 'Maize', soils: ['alluvial_soil'] },
    { id: 'cotton', name: 'Cotton', soils: ['black_soil'] },
    { id: 'soybean', name: 'Soybean', soils: ['black_soil'] },
    { id: 'groundnut', name: 'Groundnut', soils: ['red_soil'] },
    { id: 'bajra', name: 'Bajra (Pearl Millet)', soils: ['arid_soil'] },
  ];

  const soilTypes = [
    { id: 'alluvial_soil', name: 'Alluvial Soil' },
    { id: 'black_soil', name: 'Black Soil (Regur)' },
    { id: 'red_soil', name: 'Red Soil' },
    { id: 'arid_soil', name: 'Arid/Desert Soil' },
    { id: 'laterite_soil', name: 'Laterite Soil' },
  ];

  useEffect(() => {
    loadCycles();
  }, []);

  const loadCycles = async () => {
    setLoading(true);
    try {
      const res = await getActiveCropCycles();
      if (res.cycles) {
        setCycles(res.cycles);
        if (res.cycles.length > 0 && !selectedCycle) {
          setSelectedCycle(res.cycles[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load crop cycles:', e);
    } finally {
      setLoading(false);
    }
  };

  const refreshSelectedCycle = async () => {
    if (!selectedCycle) return;
    try {
      const res = await getCropCycleDetail(selectedCycle.id);
      if (res.cycle) {
        setSelectedCycle(res.cycle);
        setCycles((prev) =>
          prev.map((c) => (c.id === res.cycle.id ? res.cycle : c))
        );
      }
    } catch (e) {
      console.error('Failed to refresh cycle:', e);
    }
  };

  const handleActivate = async () => {
    setActivating(true);
    try {
      const res = await activateCropCycle({
        crop_name: actCrop,
        sowing_date: actSowingDate,
        soil_type: actSoilType,
        field_name: actFieldName || undefined,
      });
      if (res.success && res.cycle) {
        toast.success(`${res.cycle.crop_name} crop cycle activated!`);
        setShowActivation(false);
        await loadCycles();
        setSelectedCycle(res.cycle);
      } else {
        toast.error(res.error || 'Failed to activate');
      }
    } catch (e) {
      toast.error('Network error');
    } finally {
      setActivating(false);
    }
  };

  const handleToggleActivity = async (actId: string, newStatus: string) => {
    if (!selectedCycle) return;
    try {
      await updateCropCycleActivity(selectedCycle.id, actId, { status: newStatus });
      await refreshSelectedCycle();
      if (newStatus === 'completed') toast.success('Activity completed!');
    } catch (e) {
      toast.error('Failed to update');
    }
  };

  const handleDeleteActivity = async (actId: string) => {
    if (!selectedCycle) return;
    try {
      await deleteCustomActivity(selectedCycle.id, actId);
      await refreshSelectedCycle();
      toast.success('Activity removed');
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Get activities for the selected date
  const getActivitiesForDate = (dateStr: string) => {
    if (!selectedCycle) return [];
    let acts = selectedCycle.activities.filter((a) => a.date === dateStr);
    if (filter === 'pending') acts = acts.filter((a) => a.status === 'pending');
    if (filter === 'completed') acts = acts.filter((a) => a.status === 'completed');
    return acts;
  };

  const todayActivities = getActivitiesForDate(todayStr);
  const viewActivities = getActivitiesForDate(viewDate);
  const pendingCount = todayActivities.filter((a) => a.status === 'pending').length;
  const completedCount = todayActivities.filter((a) => a.status === 'completed').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#812F0F]/40" />
      </div>
    );
  }

  // ─── No Active Cycles — Show Activation ───
  if (cycles.length === 0 || showActivation) {
    return (
      <div className="space-y-6 pb-8">
        <div className="text-center pt-4 pb-2">
          <div className="inline-flex p-4 rounded-2xl bg-[#812F0F]/8 mb-4">
            <Sprout className="w-8 h-8 text-[#812F0F]" />
          </div>
          <h2 className="text-xl font-bold text-[#2A0F05]">Start Your Crop Cycle</h2>
          <p className="text-sm text-[#2A0F05]/50 mt-1 max-w-sm mx-auto">
            Select your crop and sowing date. MILA will generate a detailed daily activity plan for the entire cycle.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-[#812F0F]/10 rounded-2xl p-6 space-y-5 mx-4">
          {/* Crop Selection */}
          <div>
            <label className="text-[10px] text-[#2A0F05]/40 font-bold uppercase tracking-wider">Crop</label>
            <select
              value={actCrop}
              onChange={(e) => {
                setActCrop(e.target.value);
                const crop = availableCrops.find((c) => c.id === e.target.value);
                if (crop) setActSoilType(crop.soils[0]);
              }}
              className="w-full mt-1.5 px-4 py-3 rounded-xl bg-[#F7F6F2] border border-[#812F0F]/10 text-sm text-[#2A0F05] font-medium focus:outline-none focus:border-[#812F0F]/25"
            >
              {availableCrops.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Sowing Date */}
          <div>
            <label className="text-[10px] text-[#2A0F05]/40 font-bold uppercase tracking-wider">Sowing Date</label>
            <input
              type="date"
              value={actSowingDate}
              onChange={(e) => setActSowingDate(e.target.value)}
              className="w-full mt-1.5 px-4 py-3 rounded-xl bg-[#F7F6F2] border border-[#812F0F]/10 text-sm text-[#2A0F05] focus:outline-none focus:border-[#812F0F]/25"
            />
          </div>

          {/* Soil Type */}
          <div>
            <label className="text-[10px] text-[#2A0F05]/40 font-bold uppercase tracking-wider">Soil Type</label>
            <select
              value={actSoilType}
              onChange={(e) => setActSoilType(e.target.value)}
              className="w-full mt-1.5 px-4 py-3 rounded-xl bg-[#F7F6F2] border border-[#812F0F]/10 text-sm text-[#2A0F05] font-medium focus:outline-none focus:border-[#812F0F]/25"
            >
              {soilTypes.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Field Name (optional) */}
          <div>
            <label className="text-[10px] text-[#2A0F05]/40 font-bold uppercase tracking-wider">Field Name (Optional)</label>
            <input
              type="text"
              value={actFieldName}
              onChange={(e) => setActFieldName(e.target.value)}
              placeholder="e.g., Main Field, North Plot"
              className="w-full mt-1.5 px-4 py-3 rounded-xl bg-[#F7F6F2] border border-[#812F0F]/10 text-sm text-[#2A0F05] placeholder:text-[#2A0F05]/30 focus:outline-none"
            />
          </div>

          {/* Activate Button */}
          <button
            onClick={handleActivate}
            disabled={activating}
            className="w-full py-4 bg-[#812F0F] text-white rounded-xl font-bold text-sm hover:bg-[#6D280D] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
          >
            {activating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sprout className="w-5 h-5" />
            )}
            {activating ? 'Generating Daily Plan...' : 'Activate Crop Cycle'}
          </button>

          {showActivation && cycles.length > 0 && (
            <button
              onClick={() => setShowActivation(false)}
              className="w-full py-3 text-[#2A0F05]/50 text-sm font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }

  // ─── Active Cycle View ───
  const cycle = selectedCycle || cycles[0];
  if (!cycle) return null;

  const currentStage = cycle.current_stage;

  return (
    <div className="space-y-4 pb-8">
      {/* ── Header Card ── */}
      <div className="mx-4 bg-white/70 backdrop-blur-sm border border-[#812F0F]/10 rounded-2xl overflow-hidden shadow-sm">
        {/* Crop Image + Info */}
        <div className="relative h-32">
          {cycle.image_url && (
            <img src={cycle.image_url} alt={cycle.crop_name} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A0F05]/80 via-[#2A0F05]/30 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white text-lg font-bold">{cycle.crop_name}</p>
                <p className="text-white/60 text-xs">
                  {cycle.field_name ? `${cycle.field_name} · ` : ''}Sown: {new Date(cycle.sowing_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white text-xl font-bold">{cycle.progress_percent}%</p>
                <p className="text-white/50 text-[10px] uppercase tracking-wider">Complete</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pt-3 pb-4">
          <div className="h-2 bg-[#812F0F]/8 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#812F0F] to-[#E4490D] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${cycle.progress_percent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          {currentStage && (
            <div className="flex items-center gap-2 mt-2.5">
              <div className="p-1 rounded-md bg-[#E4490D]/10">
                {(() => { const StIcon = stageIcons[currentStage.stage_id] || Sprout; return <StIcon className="w-3 h-3 text-[#E4490D]" />; })()}
              </div>
              <p className="text-xs text-[#2A0F05]/60">
                <span className="font-semibold text-[#2A0F05]/80">Stage {currentStage.stage_id}:</span> {currentStage.stage_name}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── View Switcher ── */}
      <div className="flex gap-2 mx-4">
        {(['today', 'timeline', 'calendar'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold capitalize transition-all ${
              view === v
                ? 'bg-[#812F0F] text-white shadow-md'
                : 'bg-white/60 text-[#2A0F05]/50 border border-[#812F0F]/8'
            }`}
          >
            {v === 'today' ? `Today (${pendingCount})` : v}
          </button>
        ))}
      </div>

      {/* ── Today's Activities View ── */}
      {view === 'today' && (
        <div className="mx-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#2A0F05]">
                Today's Activities
              </h3>
              <p className="text-[10px] text-[#2A0F05]/40 mt-0.5">
                {completedCount}/{todayActivities.length} completed
              </p>
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="text-[10px] px-2 py-1 rounded-lg bg-[#F7F6F2] border border-[#812F0F]/8 text-[#2A0F05]/60 focus:outline-none"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Done</option>
              </select>
              <button
                onClick={() => setShowAddForm(true)}
                className="p-2 bg-[#812F0F]/8 rounded-xl hover:bg-[#812F0F]/15 transition-colors"
              >
                <Plus className="w-4 h-4 text-[#812F0F]" />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showAddForm && (
              <AddActivityForm
                cycleId={cycle.id}
                defaultDate={todayStr}
                stages={cycle.timeline}
                onAdded={() => {
                  setShowAddForm(false);
                  refreshSelectedCycle();
                }}
                onCancel={() => setShowAddForm(false)}
              />
            )}
          </AnimatePresence>

          {todayActivities.length === 0 ? (
            <div className="text-center py-10 bg-white/50 rounded-2xl border border-dashed border-[#812F0F]/10">
              <Calendar className="w-8 h-8 text-[#812F0F]/20 mx-auto mb-2" />
              <p className="text-sm text-[#2A0F05]/40">No activities for today</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-3 text-xs text-[#812F0F] font-bold hover:underline"
              >
                + Add a custom activity
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {getActivitiesForDate(todayStr).map((act) => (
                  <ActivityItem
                    key={act.id}
                    activity={act}
                    onToggle={handleToggleActivity}
                    onDelete={act.source === 'custom' ? handleDeleteActivity : undefined}
                    cycleId={cycle.id}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* ── Timeline View ── */}
      {view === 'timeline' && (
        <div className="mx-4 space-y-3">
          <h3 className="text-sm font-bold text-[#2A0F05]">Full Crop Cycle Timeline</h3>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-[#812F0F]/20 via-[#E4490D]/10 to-[#812F0F]/5" />
            <div className="space-y-3">
              {cycle.timeline.map((stage, i) => {
                const isCurrentStage = currentStage?.stage_id === stage.stage_id;
                const isPast = todayStr > stage.end_date;
                const StIcon = stageIcons[stage.stage_id] || Sprout;
                const stageActivities = (cycle.activities || []).filter((a) => a.stage_id === stage.stage_id);
                const stageCompleted = stageActivities.filter((a) => a.status === 'completed').length;
                const isExpanded = expandedStage === stage.stage_id;

                return (
                  <div key={stage.stage_id} className="relative pl-12">
                    {/* Dot */}
                    <div
                      className={`absolute left-3.5 w-4 h-4 rounded-full border-2 z-10 ${
                        isCurrentStage
                          ? 'bg-[#E4490D] border-white shadow-md shadow-[#E4490D]/30'
                          : isPast
                          ? 'bg-[#4F8F4A] border-white'
                          : 'bg-white border-[#812F0F]/20'
                      }`}
                      style={{ top: '10px' }}
                    />

                    <motion.button
                      onClick={() => setExpandedStage(isExpanded ? null : stage.stage_id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        isCurrentStage
                          ? 'bg-[#E4490D]/5 border-[#E4490D]/20 shadow-sm'
                          : isPast
                          ? 'bg-green-50/40 border-green-200/30'
                          : 'bg-white/60 border-[#812F0F]/6 hover:bg-white/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-1.5 rounded-lg ${
                            isCurrentStage ? 'bg-[#E4490D]/10' : isPast ? 'bg-green-500/8' : 'bg-[#812F0F]/5'
                          }`}
                        >
                          <StIcon
                            className={`w-4 h-4 ${
                              isCurrentStage ? 'text-[#E4490D]' : isPast ? 'text-green-600' : 'text-[#2A0F05]/30'
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p
                              className={`text-xs font-bold ${
                                isCurrentStage ? 'text-[#E4490D]' : isPast ? 'text-green-700' : 'text-[#2A0F05]/70'
                              }`}
                            >
                              {stage.stage_name}
                            </p>
                            {isCurrentStage && (
                              <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#E4490D]/15 text-[#E4490D] font-bold uppercase">
                                Current
                              </span>
                            )}
                            {isPast && (
                              <CheckCircle2 className="w-3 h-3 text-green-500" />
                            )}
                          </div>
                          <p className="text-[10px] text-[#2A0F05]/35 mt-0.5">
                            {new Date(stage.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            {' — '}
                            {new Date(stage.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            {' · '}{stage.duration_days} days
                            {stageActivities.length > 0 && ` · ${stageCompleted}/${stageActivities.length} done`}
                          </p>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-[#2A0F05]/25 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </motion.button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2 space-y-2">
                            {/* Soil Notes */}
                            {stage.soil_specific_notes && (
                              <div className="bg-amber-50/50 border border-amber-200/30 rounded-lg p-3">
                                <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                                  <span className="font-bold">Soil Note:</span> {stage.soil_specific_notes}
                                </p>
                              </div>
                            )}
                            {/* Stage Activities */}
                            {stageActivities.map((act) => (
                              <ActivityItem
                                key={act.id}
                                activity={act}
                                onToggle={handleToggleActivity}
                                onDelete={act.source === 'custom' ? handleDeleteActivity : undefined}
                                cycleId={cycle.id}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Calendar View ── */}
      {view === 'calendar' && (
        <div className="mx-4 space-y-3">
          {/* Date Navigator */}
          <div className="flex items-center justify-between bg-white/60 border border-[#812F0F]/8 rounded-xl px-4 py-3">
            <button
              onClick={() => {
                const d = new Date(viewDate);
                d.setDate(d.getDate() - 1);
                setViewDate(d.toISOString().split('T')[0]);
              }}
              className="p-1 hover:bg-[#812F0F]/5 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5 text-[#2A0F05]/50" />
            </button>
            <div className="text-center">
              <p className="text-sm font-bold text-[#2A0F05]">
                {new Date(viewDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
              {viewDate === todayStr && (
                <p className="text-[9px] text-[#E4490D] font-bold uppercase">Today</p>
              )}
            </div>
            <button
              onClick={() => {
                const d = new Date(viewDate);
                d.setDate(d.getDate() + 1);
                setViewDate(d.toISOString().split('T')[0]);
              }}
              className="p-1 hover:bg-[#812F0F]/5 rounded-lg"
            >
              <ChevronRight className="w-5 h-5 text-[#2A0F05]/50" />
            </button>
          </div>

          {/* Quick Jump */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewDate(todayStr)}
              className="flex-1 py-2 text-[10px] font-bold rounded-lg bg-[#812F0F]/5 text-[#812F0F] hover:bg-[#812F0F]/10"
            >
              Today
            </button>
            <button
              onClick={() => {
                const d = new Date(todayStr);
                d.setDate(d.getDate() + 1);
                setViewDate(d.toISOString().split('T')[0]);
              }}
              className="flex-1 py-2 text-[10px] font-bold rounded-lg bg-[#812F0F]/5 text-[#812F0F] hover:bg-[#812F0F]/10"
            >
              Tomorrow
            </button>
            <button
              onClick={() => {
                const d = new Date(todayStr);
                d.setDate(d.getDate() + 7);
                setViewDate(d.toISOString().split('T')[0]);
              }}
              className="flex-1 py-2 text-[10px] font-bold rounded-lg bg-[#812F0F]/5 text-[#812F0F] hover:bg-[#812F0F]/10"
            >
              +7 Days
            </button>
          </div>

          {/* Stage Info for this date */}
          {(() => {
            const st = cycle.timeline.find((t) => viewDate >= t.start_date && viewDate <= t.end_date);
            if (st) {
              return (
                <div className="bg-[#E4490D]/5 border border-[#E4490D]/10 rounded-xl px-4 py-2.5">
                  <p className="text-xs text-[#E4490D] font-bold">
                    Stage {st.stage_id}: {st.stage_name}
                  </p>
                  <p className="text-[10px] text-[#2A0F05]/40 mt-0.5">
                    Day {Math.floor((new Date(viewDate).getTime() - new Date(st.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1} of {st.duration_days}
                  </p>
                </div>
              );
            }
            return null;
          })()}

          {/* Add Button + Activities */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2A0F05]">
              Activities ({viewActivities.length})
            </h3>
            <button
              onClick={() => {
                setShowAddForm(true);
              }}
              className="p-2 bg-[#812F0F]/8 rounded-xl hover:bg-[#812F0F]/15"
            >
              <Plus className="w-4 h-4 text-[#812F0F]" />
            </button>
          </div>

          <AnimatePresence>
            {showAddForm && (
              <AddActivityForm
                cycleId={cycle.id}
                defaultDate={viewDate}
                stages={cycle.timeline}
                onAdded={() => {
                  setShowAddForm(false);
                  refreshSelectedCycle();
                }}
                onCancel={() => setShowAddForm(false)}
              />
            )}
          </AnimatePresence>

          {viewActivities.length === 0 ? (
            <div className="text-center py-10 bg-white/50 rounded-2xl border border-dashed border-[#812F0F]/10">
              <Calendar className="w-8 h-8 text-[#812F0F]/20 mx-auto mb-2" />
              <p className="text-sm text-[#2A0F05]/40">No activities on this date</p>
            </div>
          ) : (
            <div className="space-y-2">
              {viewActivities.map((act) => (
                <ActivityItem
                  key={act.id}
                  activity={act}
                  onToggle={handleToggleActivity}
                  onDelete={act.source === 'custom' ? handleDeleteActivity : undefined}
                  cycleId={cycle.id}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Floating Action: New Cycle ── */}
      <div className="mx-4 pt-4 border-t border-[#812F0F]/5">
        <button
          onClick={() => setShowActivation(true)}
          className="w-full flex items-center justify-center gap-2 py-3 text-xs text-[#812F0F] font-bold bg-[#812F0F]/5 rounded-xl hover:bg-[#812F0F]/10 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Start Another Crop Cycle
        </button>
      </div>
    </div>
  );
}