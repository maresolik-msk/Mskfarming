import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  CloudRain, 
  ShieldCheck, 
  Sprout, 
  Droplets, 
  AlertTriangle, 
  CircleCheck, 
  Calendar,
  ThermometerSun,
  Leaf
} from 'lucide-react';
import { motion } from 'motion/react';
import { CropIntelligenceService } from '../../core/crop-intelligence/service';
import { VarietyFullDetails } from '../../core/crop-intelligence/types';

interface VarietyDetailViewProps {
  cropId: string;
  varietyId: string;
  onBack: () => void;
}

export function VarietyDetailView({ cropId, varietyId, onBack }: VarietyDetailViewProps) {
  const [data, setData] = useState<VarietyFullDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setLoading(true);
      const details = await CropIntelligenceService.getVarietyFullDetails(cropId, varietyId);
      if (mounted) {
        setData(details);
        setLoading(false);
      }
    }
    loadData();
    return () => { mounted = false; };
  }, [cropId, varietyId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Sprout className="w-10 h-10 text-primary animate-bounce" />
        <p className="text-muted-foreground animate-pulse">Loading intelligence...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500">Failed to load variety details.</p>
        <button onClick={onBack} className="mt-4 text-primary underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-full flex flex-col">
      {/* 1. Sticky Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {data.cropName} • {data.season}
            </div>
            <h1 className="text-xl font-bold text-foreground leading-tight">
              {data.varietyName}
            </h1>
          </div>
          <div className="ml-auto bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {data.durationDays}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-8 pb-20">
        
        {/* 2. Variety Overview */}
        <section className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-800">
              <div className="text-xs text-green-700 dark:text-green-400 font-medium mb-1 flex items-center gap-1">
                <Sprout className="w-3 h-3" /> Yield Potential
              </div>
              <div className="font-bold text-lg text-green-800 dark:text-green-300">
                {data.yieldPotential}
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800">
              <div className="text-xs text-blue-700 dark:text-blue-400 font-medium mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Resistance
              </div>
              <div className="font-bold text-lg text-blue-800 dark:text-blue-300">
                {data.diseaseResistance}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-lg">
            <ThermometerSun className="w-4 h-4" />
            <span>Best for: <strong>{data.suitableConditions}</strong></span>
          </div>
        </section>

        {/* 3. Seed Intelligence */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Droplets className="w-5 h-5 text-primary" />
            Seed Requirement
          </h2>
          
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 bg-primary/5 border-b border-primary/10">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold">Recommended Rate</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{data.seed.seedRatePerAcre} <span className="text-sm font-normal text-muted-foreground">/ acre</span></p>
                </div>
                <div className="text-right">
                   <div className="text-xs text-muted-foreground mb-1">Germination</div>
                   <div className="badge bg-white dark:bg-black border border-border px-2 py-0.5 rounded text-xs font-mono">
                     Target: {data.seed.idealGermination}
                   </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-medium text-foreground">If germination is low...</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">{data.seed.adjustmentLogic}</p>
                </div>
              </div>

              {data.seed.treatment.required && (
                <div className="flex items-start gap-3 text-sm border-t border-dashed border-border pt-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0 mt-0.5">
                    <CircleCheck className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Seed Treatment Required</p>
                    <p className="text-muted-foreground text-xs">{data.seed.treatment.details}</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-0.5 italic">{data.seed.treatment.purpose}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 4. Full Crop Cycle Timeline */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Crop Cycle
            </h2>
            <span className="text-xs font-medium bg-muted px-2 py-1 rounded-full">
              {data.growthCycle.length} Stages
            </span>
          </div>

          <div className="relative pl-4 border-l-2 border-border space-y-8 ml-2">
            {data.growthCycle.map((stage, idx) => (
              <div key={idx} className="relative">
                {/* Timeline Dot */}
                <div className={`absolute -left-[21px] top-0 w-4 h-4 rounded-full border-2 ${idx === 0 ? 'bg-primary border-primary' : 'bg-background border-muted-foreground'}`} />
                
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-foreground">{stage.stageName}</h3>
                    <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      Day {stage.duration}
                    </span>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-3 mt-2 text-sm space-y-2">
                    <p className="text-foreground font-medium flex gap-2">
                      <Leaf className="w-4 h-4 text-green-600 mt-0.5" />
                      {stage.whatHappens}
                    </p>
                    <p className="text-amber-600 dark:text-amber-400 text-xs flex gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5" />
                      Risk: {stage.risk}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Risks & Care Summary */}
        <section className="space-y-4">
           <h2 className="text-lg font-bold">Key Risks & Care</h2>
           <div className="grid grid-cols-1 gap-3">
             <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-100 dark:border-red-900/30">
               <h4 className="font-bold text-red-800 dark:text-red-300 text-sm mb-2 flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4" /> Top Risks
               </h4>
               <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-400 space-y-1">
                 {data.risksAndCare.topRisks.map((r, i) => (
                   <li key={i}>{r}</li>
                 ))}
               </ul>
             </div>
             
             <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
               <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm mb-2 flex items-center gap-2">
                 <CircleCheck className="w-4 h-4" /> Care Notes
               </h4>
               <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-400 space-y-1">
                 {data.risksAndCare.careNotes.map((c, i) => (
                   <li key={i}>{c}</li>
                 ))}
               </ul>
             </div>
           </div>
        </section>

        {/* 6. Harvest */}
        <section className="bg-primary/5 rounded-xl p-5 border border-primary/20">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Sprout className="w-5 h-5 text-primary" /> Harvest Ready?
          </h2>
          <div className="space-y-3 text-sm">
             <div>
               <span className="font-semibold block text-xs uppercase text-muted-foreground">Signs of Maturity</span>
               <p>{data.harvest.maturitySigns}</p>
             </div>
             <div>
               <span className="font-semibold block text-xs uppercase text-muted-foreground">Harvest Window</span>
               <p>{data.harvest.harvestWindow}</p>
             </div>
             <div className="bg-background/50 p-2 rounded border border-dashed border-primary/30 text-primary-700 text-xs">
               <strong>Tip:</strong> {data.harvest.mistakesToAvoid}
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}