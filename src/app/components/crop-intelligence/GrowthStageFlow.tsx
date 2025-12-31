import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { CircleCheck, Circle, Clock, TriangleAlert, Leaf, Droplet, Bug, Sprout, ChevronDown, ChevronRight, Lock, Sparkles, LoaderCircle, Info } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';

interface GrowthStage {
  stage_id: number;
  stage_name: string;
  duration_days: string;
  soil_specific_notes: string;
  key_actions: string[];
  risk_factors: string[];
  ai_alerts: string[];
  status?: 'completed' | 'current' | 'upcoming';
  progress?: number;
  startDate?: string;
  endDate?: string;
  daysRemaining?: number;
}

interface GrowthStageFlowProps {
  cropName: string;
  soilType: string;
  plantingDate: string;
  expectedHarvestDate?: string;
  cropCycleDuration?: string;
}

// Helper function to parse duration range (e.g., "10-15" -> average = 12.5)
const parseDurationAvg = (duration: string): number => {
  const [min, max] = duration.split('-').map(Number);
  return (min + max) / 2;
};

// Icon mapping for each stage
const getStageIcon = (stageId: number) => {
  const icons = {
    1: Sprout,      // Land Preparation
    2: Leaf,        // Seed Selection
    3: Sprout,      // Sowing
    4: Leaf,        // Germination
    5: Leaf,        // Vegetative Growth
    6: Leaf,        // Flowering
    7: Leaf,        // Fruiting
    8: Clock,       // Maturity
    9: CircleCheck,// Harvest
    10: Sprout      // Post-Harvest
  };
  return icons[stageId as keyof typeof icons] || Circle;
};

export function GrowthStageFlow({ 
  cropName, 
  soilType, 
  plantingDate, 
  expectedHarvestDate,
  cropCycleDuration 
}: GrowthStageFlowProps) {
  const { t, i18n } = useTranslation();
  const [stages, setStages] = useState<GrowthStage[]>([]);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [totalDaysSincePlanting, setTotalDaysSincePlanting] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completedStageIds, setCompletedStageIds] = useState<number[]>([]);
  const [baseStages, setBaseStages] = useState<GrowthStage[]>([]);
  const [expandedStageId, setExpandedStageId] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  // Helper to generate detailed instructions for a task
  const getTaskBestPractices = (taskName: string): string[] => {
    const lowerTask = taskName.toLowerCase();

    // Simple keyword matching (English + Hindi)
    if (['irrigation', 'water', 'सिंचाई', 'पानी'].some(k => lowerTask.includes(k))) {
      const practices = t('growth.practices.irrigation', { returnObjects: true });
      return Array.isArray(practices) ? practices : [];
    }
    if (['fertilizer', 'nutrient', 'nitrogen', 'खाद', 'पोषक', 'नाइट्रोजन'].some(k => lowerTask.includes(k))) {
      const practices = t('growth.practices.fertilizer', { returnObjects: true });
      return Array.isArray(practices) ? practices : [];
    }
    if (['pest', 'disease', 'कीट', 'रोग'].some(k => lowerTask.includes(k))) {
      const practices = t('growth.practices.pest', { returnObjects: true });
      return Array.isArray(practices) ? practices : [];
    }
    if (['weed', 'खरपतवार'].some(k => lowerTask.includes(k))) {
      const practices = t('growth.practices.weed', { returnObjects: true });
      return Array.isArray(practices) ? practices : [];
    }

    const defaultPractices = t('growth.practices.default', { returnObjects: true });
    return Array.isArray(defaultPractices) ? defaultPractices : [];
  };

  // Helper functions using translations
  const getDurationForStage = (stageId: number): string => {
    const durations: Record<number, string> = {
      1: '10-15',
      2: '2-3',
      3: '1-2',
      4: '7-10',
      5: '30-40',
      6: '10-15',
      7: '20-30',
      8: '7-10',
      9: '3-5',
      10: '10-15',
    };
    return durations[stageId] || '7-10';
  };

  const getSoilSpecificNote = (stageId: number, soil: string): string => {
    // Attempt to get specific note, fallback to default note
    const key = `growth.soil_notes.${soil}.${stageId}`;
    const note = t(key, { defaultValue: '' });
    
    if (note) return note;
    return t('growth.soil_notes.default', 'Monitor soil conditions carefully during this stage');
  };

  const getKeyActionsForStage = (stageId: number): string[] => {
    const actions = t(`growth.actions.${stageId}`, { returnObjects: true });
    return Array.isArray(actions) ? actions : [t('growth.actions.default.0')];
  };

  const getRiskFactorsForStage = (stageId: number): string[] => {
    const risks = t(`growth.risks.${stageId}`, { returnObjects: true });
    return Array.isArray(risks) ? risks : [t('growth.risks.default.0')];
  };

  const getAIAlertsForStage = (stageId: number): string[] => {
    const alerts = t(`growth.alerts.${stageId}`, { returnObjects: true });
    return Array.isArray(alerts) ? alerts : [t('growth.alerts.default.0')];
  };

  // Initialize base stages (dynamic based on language)
  useEffect(() => {
    setLoading(true);
    // Universal 10-stage structure by ID
    const stageIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    const mockStages: GrowthStage[] = stageIds.map((id) => ({
      stage_id: id,
      stage_name: t(`growth.stages.${id}`),
      duration_days: getDurationForStage(id),
      soil_specific_notes: getSoilSpecificNote(id, soilType),
      key_actions: getKeyActionsForStage(id),
      risk_factors: getRiskFactorsForStage(id),
      ai_alerts: getAIAlertsForStage(id),
    }));
    
    setBaseStages(mockStages);
    setLoading(false);
  }, [cropName, soilType, i18n.language]); // Re-run when language changes

  // Fetch saved progress on mount
  useEffect(() => {
    async function fetchSavedProgress() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // Build query string
        const params = new URLSearchParams();
        params.append('cropName', cropName);
        if (plantingDate) params.append('plantingDate', plantingDate);
        
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6fdef95d/crop/progress?${params.toString()}`, {
          headers: {
            'Authorization': `Bearer ${session?.access_token || publicAnonKey}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.completedStageIds && Array.isArray(data.completedStageIds)) {
            setCompletedStageIds(data.completedStageIds);
          }
        }
      } catch (error) {
        console.error("Failed to fetch saved progress", error);
      }
    }
    
    fetchSavedProgress();
  }, [cropName, plantingDate]);

  // Recalculate timeline whenever dependencies change
  useEffect(() => {
    if (baseStages.length === 0) return;

    // Calculate days since planting
    const planted = new Date(plantingDate);
    const today = new Date();
    const daysSincePlanting = Math.floor(
      (today.getTime() - planted.getTime()) / (1000 * 60 * 60 * 24)
    );
    setTotalDaysSincePlanting(daysSincePlanting);

    // Calculate stage timelines and status
    const stagesWithTimeline = calculateStageTimelines(baseStages, plantingDate);
    setStages(stagesWithTimeline);

    // Find current stage
    const current = stagesWithTimeline.findIndex(s => s.status === 'current');
    const currentIndex = current >= 0 ? current : stagesWithTimeline.length - 1;
    setCurrentStageIndex(currentIndex);
    
    // Auto expand current stage if not already set (or if changed)
    // Only set it once initially to avoid annoying resets
    if (expandedStageId === null) {
      setExpandedStageId(stagesWithTimeline[currentIndex]?.stage_id);
    }
    
  }, [baseStages, plantingDate, completedStageIds]);

  const calculateStageTimelines = (stages: GrowthStage[], plantingDate: string) => {
    const planted = new Date(plantingDate);
    const today = new Date();
    
    // Find Sowing stage index (Stage 3)
    const sowingIndex = stages.findIndex(s => s.stage_id === 3);
    
    let cumulativeDays = 0;
    
    // Align Sowing stage with plantingDate (Day 0)
    if (sowingIndex > 0) {
      const preSowingDuration = stages.slice(0, sowingIndex).reduce((acc, stage) => {
        return acc + parseDurationAvg(stage.duration_days);
      }, 0);
      
      cumulativeDays = -preSowingDuration;
    }

    // First pass: Calculate dates and initial automatic status
    const stagesWithDates = stages.map((stage) => {
      const avgDuration = parseDurationAvg(stage.duration_days);
      const startDate = new Date(planted);
      startDate.setDate(startDate.getDate() + cumulativeDays);
      
      const endDate = new Date(planted);
      endDate.setDate(endDate.getDate() + cumulativeDays + avgDuration);
      
      cumulativeDays += avgDuration;
      
      return {
        ...stage,
        avgDuration, // Keep for progress calc
        startDateObj: startDate,
        endDateObj: endDate,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      };
    });

    // Determine current stage index based on completion
    let activeStageIndex = 0;
    
    const firstIncompleteIndex = stagesWithDates.findIndex((stage) => {
      const isAutomaticallyCompleted = today >= stage.endDateObj;
      const isManuallyCompleted = completedStageIds.includes(stage.stage_id);
      return !isAutomaticallyCompleted && !isManuallyCompleted;
    });

    if (firstIncompleteIndex === -1) {
      activeStageIndex = stagesWithDates.length;
    } else {
      activeStageIndex = firstIncompleteIndex;
    }

    // Second pass: Assign status based on the active index
    return stagesWithDates.map((stage, index) => {
      let status: 'completed' | 'current' | 'upcoming' = 'upcoming';
      
      if (index < activeStageIndex) {
        status = 'completed';
      } else if (index === activeStageIndex) {
        status = 'current';
      } else {
        status = 'upcoming';
      }
      
      // Calculate progress and remaining days
      let progress = 0;
      let daysRemaining = 0;
      
      if (status === 'completed') {
        progress = 100;
        daysRemaining = 0;
      } else if (status === 'current') {
        const startDate = stage.startDateObj;
        const endDate = stage.endDateObj;
        const avgDuration = stage.avgDuration;
        
        if (today < startDate) {
           progress = 0;
           daysRemaining = avgDuration; 
        } else {
           const daysInStage = Math.floor(
            (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
           );
           progress = Math.min(Math.round((daysInStage / avgDuration) * 100), 99);
           progress = Math.max(0, progress);
           
           daysRemaining = Math.ceil(
            (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
           );
        }
      } else {
        const startDate = stage.startDateObj;
        daysRemaining = Math.ceil(
          (startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
      }

      return {
        stage_id: stage.stage_id,
        stage_name: stage.stage_name,
        duration_days: stage.duration_days,
        soil_specific_notes: stage.soil_specific_notes,
        key_actions: stage.key_actions,
        risk_factors: stage.risk_factors,
        ai_alerts: stage.ai_alerts,
        status,
        progress,
        startDate: stage.startDate,
        endDate: stage.endDate,
        daysRemaining
      };
    });
  };

  const markStageComplete = async (stageId: number) => {
    if (!completedStageIds.includes(stageId)) {
      const newCompletedIds = [...completedStageIds, stageId];
      setCompletedStageIds(newCompletedIds);
      
      // Save to backend
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6fdef95d/crop/progress`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token || publicAnonKey}`
          },
          body: JSON.stringify({
            cropName,
            plantingDate,
            completedStageIds: newCompletedIds
          })
        });
      } catch (error) {
        console.error("Failed to save progress", error);
      }
    }
  };

  if (loading) {
    return (
      <Card className="p-6 border-none shadow-none bg-transparent">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <LoaderCircle className="animate-spin h-8 w-8 text-emerald-600 mx-auto" />
            <p className="mt-4 text-sm text-muted-foreground">{t('growth.analyzing')}</p>
          </div>
        </div>
      </Card>
    );
  }

  const currentStage = stages[currentStageIndex];

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. Hero / Current Stage Dashboard */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-[#0f241a] to-emerald-950 text-white shadow-2xl border border-white/10"
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {t('growth.liveStage')}
                </span>
                <span className="text-white/50 text-xs font-medium">
                  {t('growth.stageCount', { current: currentStage?.stage_id, total: 10 })}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
                {currentStage?.stage_name}
              </h2>
              <p className="text-emerald-100/70 text-sm max-w-lg">
                {currentStage?.soil_specific_notes}
              </p>
            </div>

            {/* Circular Progress (Visual Hook) */}
            <div className="flex items-center gap-6 bg-white/5 rounded-2xl p-4 border border-white/5 backdrop-blur-sm">
              <div className="relative w-16 h-16 flex items-center justify-center">
                 <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-white/10"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="text-emerald-400 transition-all duration-1000 ease-out"
                      strokeDasharray={`${currentStage?.progress || 0}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold">{currentStage?.progress}%</span>
                 </div>
              </div>
              <div>
                <div className="text-xs text-white/50 uppercase tracking-wider mb-0.5">{t('growth.timeRemaining')}</div>
                <div className="text-xl font-bold text-white">{currentStage?.daysRemaining} {t('growth.days')}</div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {currentStage?.status === 'current' && (
             <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={() => markStageComplete(currentStage.stage_id)}
               className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20 rounded-xl py-3.5 px-6 text-sm font-bold transition-colors flex items-center justify-center gap-2 group"
             >
               <CircleCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
               {t('growth.markComplete')}
             </motion.button>
          )}
        </div>
      </motion.div>

      {/* 2. Interactive Timeline */}
      <div className="relative pl-4 md:pl-8 space-y-0">
        <div className="absolute left-[1.65rem] md:left-[2.65rem] top-4 bottom-4 w-0.5 bg-gradient-to-b from-emerald-500/50 via-emerald-500/20 to-transparent" />
        
        {stages.map((stage, index) => {
          const StageIcon = getStageIcon(stage.stage_id);
          const isCurrent = stage.status === 'current';
          const isCompleted = stage.status === 'completed';
          const isUpcoming = stage.status === 'upcoming';
          const isExpanded = expandedStageId === stage.stage_id;

          return (
            <div key={stage.stage_id} className="relative pb-8 last:pb-0">
              {/* Timeline Node */}
              <div 
                className={`absolute left-0 top-0 z-10 w-14 h-14 md:w-20 md:h-20 flex flex-col items-center justify-center transition-all duration-500 ${
                  isCurrent ? 'scale-100' : 'scale-90 opacity-70'
                }`}
              >
                <div className={`relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-600' 
                    : isCurrent 
                      ? 'bg-emerald-600 border-emerald-200 text-white shadow-xl shadow-emerald-600/30' 
                      : 'bg-muted border-transparent text-muted-foreground'
                }`}>
                   {isCompleted ? <CircleCheck className="w-5 h-5 md:w-6 md:h-6" /> : <StageIcon className="w-5 h-5 md:w-6 md:h-6" />}
                   
                   {/* Pulse Effect for Current */}
                   {isCurrent && (
                     <div className="absolute inset-0 rounded-full border-2 border-emerald-500 animate-ping opacity-50" />
                   )}
                </div>
              </div>

              {/* Card Content */}
              <div className="pl-16 md:pl-24 pt-1">
                <motion.div 
                   onClick={() => setExpandedStageId(isExpanded ? null : stage.stage_id)}
                   className={`cursor-pointer rounded-2xl border transition-all duration-300 overflow-hidden group ${
                     isCurrent 
                       ? 'bg-white dark:bg-card border-emerald-500 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/20' 
                       : isCompleted
                         ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200/50 dark:border-emerald-800/30 opacity-90'
                         : 'bg-card border-border/50 opacity-60 hover:opacity-100'
                   }`}
                >
                   {/* Header */}
                   <div className="p-5 flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                           <h3 className={`font-bold text-lg tracking-tight ${isCurrent ? 'text-emerald-800 dark:text-emerald-400' : isCompleted ? 'text-emerald-900/70' : 'text-muted-foreground'}`}>
                             {stage.stage_name}
                           </h3>
                           {isCurrent && <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 shadow-sm pointer-events-none">{t('growth.currentPhase')}</Badge>}
                           {isUpcoming && <Lock className="w-3.5 h-3.5 text-muted-foreground/50" />}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-muted-foreground font-medium">
                           <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-emerald-500/70" /> 
                              <span>{t('growth.duration', { days: stage.duration_days })}</span>
                           </div>
                           {stage.startDate && (
                             <div className="hidden md:flex items-center gap-1.5 text-muted-foreground/60">
                                <div className="w-1 h-1 rounded-full bg-border" />
                                <span>{t('growth.estDate', { date: stage.startDate })}</span>
                             </div>
                           )}
                        </div>
                      </div>
                      
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isExpanded ? 'bg-emerald-100/50 text-emerald-600' : 'bg-transparent text-muted-foreground group-hover:bg-muted'}`}>
                         <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                   </div>

                   {/* Expanded Details */}
                   <AnimatePresence>
                     {isExpanded && (
                       <motion.div 
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: 'auto', opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         transition={{ duration: 0.3 }}
                         className="border-t border-border/40 bg-gradient-to-b from-muted/20 to-muted/40"
                       >
                         <div className="p-5 space-y-6">
                           
                           {/* Section 1: Action Plan */}
                           <div className="space-y-3">
                              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
                                <Sparkles className="w-3 h-3" />
                                Action Plan
                              </h4>
                              <div className="grid gap-2">
                                {stage.key_actions.map((action, i) => (
                                  <div 
                                    key={i} 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedTask(action);
                                    }}
                                    className="flex items-start gap-3 p-3 rounded-xl bg-white/50 hover:bg-white border border-border/50 hover:border-emerald-200 transition-all cursor-pointer group/task"
                                  >
                                    <div className="mt-0.5 w-5 h-5 rounded-full border-2 border-emerald-500/30 flex items-center justify-center group-hover/task:border-emerald-500 transition-colors">
                                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 opacity-0 group-hover/task:opacity-100 transition-opacity" />
                                    </div>
                                    <span className="text-sm font-medium text-foreground/90">{action}</span>
                                    <Info className="w-4 h-4 ml-auto text-muted-foreground opacity-0 group-hover/task:opacity-100 transition-opacity" />
                                  </div>
                                ))}
                              </div>
                           </div>

                           {/* Section 2: Risks & Alerts Grid */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600">
                                  <Bug className="w-3 h-3" />
                                  Risk Factors
                                </h4>
                                <ul className="space-y-2">
                                  {stage.risk_factors.map((risk, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground bg-amber-50/50 p-2 rounded-lg border border-amber-100/50">
                                      <span className="mt-1 w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                                      {risk}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div className="space-y-2">
                                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
                                  <TriangleAlert className="w-3 h-3" />
                                  AI Insights
                                </h4>
                                <ul className="space-y-2">
                                  {stage.ai_alerts.map((alert, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground bg-blue-50/50 p-2 rounded-lg border border-blue-100/50">
                                      <span className="mt-1 w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                                      {alert}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                           </div>
                           
                         </div>
                       </motion.div>
                     )}
                   </AnimatePresence>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Guide Popup */}
      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              Task Guide
            </DialogTitle>
            <DialogDescription>
              Best practices for <span className="font-medium text-foreground">"{selectedTask}"</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
              <h4 className="font-medium text-emerald-900 mb-3 text-sm uppercase tracking-wide">Recommended Steps</h4>
              <ul className="space-y-3">
                {selectedTask && getTaskBestPractices(selectedTask).map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-emerald-800">
                    <div className="mt-1 w-5 h-5 rounded-full bg-white text-emerald-600 flex items-center justify-center shrink-0 text-xs font-bold border border-emerald-200 shadow-sm">
                      {i + 1}
                    </div>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg text-xs text-muted-foreground">
              <Info className="w-4 h-4 shrink-0" />
              These recommendations are general guidelines. Adjust based on your local conditions.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
