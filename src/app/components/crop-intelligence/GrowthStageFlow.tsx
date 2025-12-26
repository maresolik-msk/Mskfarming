import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { CheckCircle2, Circle, Clock, AlertTriangle, Leaf, Droplet, Bug, Sprout } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';

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
    9: CheckCircle2,// Harvest
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
  const [stages, setStages] = useState<GrowthStage[]>([]);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [totalDaysSincePlanting, setTotalDaysSincePlanting] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completedStageIds, setCompletedStageIds] = useState<number[]>([]);
  const [baseStages, setBaseStages] = useState<GrowthStage[]>([]);

  // Universal 10-stage structure
  const UNIVERSAL_STAGES = [
    "Land Preparation",
    "Seed Selection & Treatment",
    "Sowing / Planting",
    "Germination & Establishment",
    "Vegetative Growth",
    "Flowering",
    "Fruiting / Grain Formation",
    "Maturity",
    "Harvest",
    "Post-Harvest Soil Care"
  ];

  // Initialize base stages (static data)
  useEffect(() => {
    setLoading(true);
    const mockStages: GrowthStage[] = UNIVERSAL_STAGES.map((name, index) => ({
      stage_id: index + 1,
      stage_name: name,
      duration_days: getDurationForStage(index + 1),
      soil_specific_notes: getSoilSpecificNote(name, soilType),
      key_actions: getKeyActionsForStage(index + 1, name, soilType),
      risk_factors: getRiskFactorsForStage(index + 1, name, soilType),
      ai_alerts: getAIAlertsForStage(index + 1, name, soilType),
    }));
    setBaseStages(mockStages);
    setLoading(false);
  }, [cropName, soilType]);

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
    // If no current stage (all completed), show the last stage
    setCurrentStageIndex(current >= 0 ? current : stagesWithTimeline.length - 1);
  }, [baseStages, plantingDate, completedStageIds]);

  const calculateStageTimelines = (stages: GrowthStage[], plantingDate: string) => {
    const planted = new Date(plantingDate);
    const today = new Date();
    
    // Find Sowing stage index to align it with plantingDate (Day 0)
    // The cycle should start (Day 0) when the crop is sowed/planted
    const sowingIndex = stages.findIndex(s => 
      s.stage_name.includes("Sowing") || s.stage_name.includes("Planting")
    );
    
    let cumulativeDays = 0;
    
    // If Sowing stage exists and is not the first stage, calculate offset 
    // so that the Sowing stage starts exactly on the plantingDate
    if (sowingIndex > 0) {
      // Sum durations of all stages BEFORE sowing to get the negative offset
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
    // The current stage is the first one that is NOT completed (either by date or manual override)
    let activeStageIndex = 0;
    
    // Find the first stage that is NEITHER automatically completed NOR manually completed
    const firstIncompleteIndex = stagesWithDates.findIndex((stage) => {
      const isAutomaticallyCompleted = today >= stage.endDateObj;
      const isManuallyCompleted = completedStageIds.includes(stage.stage_id);
      return !isAutomaticallyCompleted && !isManuallyCompleted;
    });

    // If all are completed, set index to length (so all are marked completed)
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
        
        // If we are in 'current' status because of date logic, use date math
        // If we are 'current' because previous was manually completed early, we might be "ahead of schedule"
        // i.e., today < startDate.
        
        if (today < startDate) {
           // We are ahead of schedule (previous stage finished early)
           // Progress could be 0?
           progress = 0;
           daysRemaining = avgDuration; // Full duration remaining
        } else {
           // Normal progress within the stage window
           const daysInStage = Math.floor(
            (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
           );
           progress = Math.min(Math.round((daysInStage / avgDuration) * 100), 99);
           // Ensure progress is at least 0
           progress = Math.max(0, progress);
           
           daysRemaining = Math.ceil(
            (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
           );
        }
      } else {
        // Upcoming
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
        // Optionally revert state on failure
      }
    }
  };

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

  const getSoilSpecificNote = (stageName: string, soil: string): string => {
    const notes: Record<string, Record<string, string>> = {
      'alluvial_soil': {
        'Land Preparation': 'Level field for uniform water retention; alluvial soil requires thorough puddling',
        'Vegetative Growth': 'Nitrogen deficiency common in alluvial soil; split application recommended',
      },
      'black_soil': {
        'Land Preparation': 'Deep ploughing reduces cracking tendency of black soil',
        'Sowing / Planting': 'Sow on ridges to prevent waterlogging in black soil',
      },
      'red_soil': {
        'Land Preparation': 'Red soil needs organic matter enrichment; low fertility',
        'Flowering': 'Peg penetration requires loose soil in red soil',
      },
      'arid_soil': {
        'Land Preparation': 'Minimal tillage to conserve moisture in arid soil',
        'Vegetative Growth': 'Critical irrigation needed; very low water retention',
      },
    };

    return notes[soil]?.[stageName] || `Monitor soil conditions carefully during ${stageName}`;
  };

  const getKeyActionsForStage = (stageId: number, stageName: string, soil: string): string[] => {
    const actions: Record<number, string[]> = {
      1: ['Deep ploughing', 'Levelling', 'Apply FYM/compost', 'Prepare drainage'],
      2: ['Select certified seeds', 'Seed treatment with fungicide', 'Quality testing'],
      3: ['Sow at optimal depth', 'Maintain row spacing', 'Light irrigation'],
      4: ['Monitor germination', 'Gap filling if needed', 'First weeding'],
      5: ['Apply nitrogen in splits', 'Regular irrigation', 'Weed control', 'Pest scouting'],
      6: ['Maintain adequate moisture', 'Monitor for pests', 'Apply micronutrients'],
      7: ['Continue irrigation', 'Disease monitoring', 'Nutrient top dressing'],
      8: ['Stop irrigation 7-10 days before harvest', 'Monitor grain/fruit maturity'],
      9: ['Harvest at optimal time', 'Proper handling', 'Sun drying if needed'],
      10: ['Stubble management', 'Soil testing', 'Prepare for next crop'],
    };
    return actions[stageId] || ['Monitor crop health', 'Follow recommended practices'];
  };

  const getRiskFactorsForStage = (stageId: number, stageName: string, soil: string): string[] => {
    const risks: Record<number, string[]> = {
      1: ['Poor drainage', 'Soil compaction'],
      2: ['Seed-borne diseases', 'Poor quality seeds'],
      3: ['Uneven germination', 'Pest attack on seeds'],
      4: ['Damping off', 'Seedling rot', 'Weed competition'],
      5: ['Nutrient deficiency', 'Pest infestation', 'Water stress'],
      6: ['Moisture stress', 'Flower drop', 'Pest damage'],
      7: ['Fruit/grain drop', 'Disease outbreak', 'Nutrient deficiency'],
      8: ['Over-maturity', 'Lodging', 'Bird/rat damage'],
      9: ['Post-harvest loss', 'Quality deterioration', 'Delayed harvest'],
      10: ['Stubble burning', 'Soil nutrient depletion', 'Pest carryover'],
    };
    return risks[stageId] || ['General crop risks'];
  };

  const getAIAlertsForStage = (stageId: number, stageName: string, soil: string): string[] => {
    const alerts: Record<number, string[]> = {
      1: ['Ensure proper drainage before sowing'],
      2: ['Use only certified disease-free seeds'],
      3: ['Sow at recommended depth for your soil type'],
      4: ['Monitor for early pest attack'],
      5: ['Apply nitrogen when plants show deficiency symptoms'],
      6: ['Do NOT skip irrigation during flowering - critical stage'],
      7: ['Maintain consistent moisture for good yield'],
      8: ['Stop irrigation at the right time to avoid quality issues'],
      9: ['Harvest at optimal maturity for best quality'],
      10: ['Do NOT burn crop residue - incorporate into soil'],
    };
    return alerts[stageId] || ['Follow best practices'];
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F3D2B] mx-auto"></div>
            <p className="mt-4 text-sm text-gray-600">Loading growth stages...</p>
          </div>
        </div>
      </Card>
    );
  }

  const currentStage = stages[currentStageIndex];

  return (
    <div className="space-y-6">
      {/* Current Stage Overview */}
      <Card className="p-6 bg-gradient-to-r from-[#1F3D2B] to-[#2d5a3f] text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-white/20 text-white">
                Stage {currentStage?.stage_id} of 10
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                Day {totalDaysSincePlanting}
              </Badge>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-[rgb(255,255,255)]">{currentStage?.stage_name}</h2>
            <p className="text-white/90 text-sm mb-4">
              {currentStage?.soil_specific_notes}
            </p>
            
            {currentStage?.status === 'current' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Stage Progress</span>
                    <span>{currentStage?.progress}%</span>
                  </div>
                  <Progress value={currentStage?.progress || 0} className="h-2 bg-white/20" />
                  <p className="text-xs text-white/80">
                    {currentStage?.daysRemaining} days remaining in this stage
                  </p>
                </div>
                
                <button 
                  onClick={() => markStageComplete(currentStage.stage_id)}
                  className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/40 rounded-lg py-2 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark Stage as Completed
                </button>
              </div>
            )}
          </div>
          
          <div className="ml-4">
            {React.createElement(getStageIcon(currentStage?.stage_id || 1), {
              className: "w-12 h-12 text-white/80"
            })}
          </div>
        </div>
      </Card>

      {/* Timeline View */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Complete Growth Timeline</h3>
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const StageIcon = getStageIcon(stage.stage_id);
            return (
              <div
                key={stage.stage_id}
                className={`relative pl-8 pb-4 ${
                  index === stages.length - 1 ? '' : 'border-l-2'
                } ${
                  stage.status === 'completed'
                    ? 'border-green-500'
                    : stage.status === 'current'
                    ? 'border-[#1F3D2B]'
                    : 'border-gray-300'
                }`}
              >
                {/* Stage Icon */}
                <div
                  className={`absolute left-0 top-0 -translate-x-1/2 rounded-full p-2 ${
                    stage.status === 'completed'
                      ? 'bg-green-500 text-white'
                      : stage.status === 'current'
                      ? 'bg-[#1F3D2B] text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <StageIcon className="w-4 h-4" />
                </div>

                {/* Stage Content */}
                <div className="ml-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-sm">{stage.stage_name}</h4>
                      <p className="text-xs text-gray-500">
                        {stage.startDate} to {stage.endDate} • {stage.duration_days} days
                      </p>
                    </div>
                    <Badge
                      variant={
                        stage.status === 'completed'
                          ? 'default'
                          : stage.status === 'current'
                          ? 'default'
                          : 'outline'
                      }
                      className={
                        stage.status === 'completed'
                          ? 'bg-green-500'
                          : stage.status === 'current'
                          ? 'bg-[#1F3D2B]'
                          : ''
                      }
                    >
                      {stage.status === 'completed'
                        ? 'Completed'
                        : stage.status === 'current'
                        ? 'In Progress'
                        : `Starts in ${stage.daysRemaining} days`}
                    </Badge>
                  </div>

                  {/* Progress bar for current stage */}
                  {stage.status === 'current' && (
                    <Progress value={stage.progress || 0} className="h-1.5 mb-3" />
                  )}

                  {/* Expandable details for current and upcoming stages */}
                  {(stage.status === 'current' || stage.status === 'upcoming') && (
                    <div className="mt-3 space-y-2 text-sm">
                      <details className="group">
                        <summary className="cursor-pointer font-medium text-[#1F3D2B] hover:underline">
                          Key Actions ({stage.key_actions.length})
                        </summary>
                        <ul className="mt-2 ml-4 space-y-1 text-gray-600">
                          {stage.key_actions.map((action, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </details>

                      <details className="group">
                        <summary className="cursor-pointer font-medium text-orange-600 hover:underline">
                          Risk Factors ({stage.risk_factors.length})
                        </summary>
                        <ul className="mt-2 ml-4 space-y-1 text-gray-600">
                          {stage.risk_factors.map((risk, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </details>

                      <details className="group">
                        <summary className="cursor-pointer font-medium text-blue-600 hover:underline">
                          AI Alerts ({stage.ai_alerts.length})
                        </summary>
                        <ul className="mt-2 ml-4 space-y-1 text-gray-600">
                          {stage.ai_alerts.map((alert, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Droplet className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>{alert}</span>
                            </li>
                          ))}
                        </ul>
                      </details>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Stages Completed</div>
          <div className="text-2xl font-bold text-green-600">
            {stages.filter(s => s.status === 'completed').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Current Stage</div>
          <div className="text-2xl font-bold text-[#1F3D2B]">
            {currentStage?.stage_id || 0}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Stages Remaining</div>
          <div className="text-2xl font-bold text-orange-600">
            {stages.filter(s => s.status === 'upcoming').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Total Progress</div>
          <div className="text-2xl font-bold text-[#1F3D2B]">
            {Math.round(
              (stages.filter(s => s.status === 'completed').length / stages.length) * 100
            )}%
          </div>
        </Card>
      </div>
    </div>
  );
}
