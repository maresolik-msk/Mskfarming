import { motion } from 'motion/react';
import { Award, TrendingUp, Star, ShieldCheck } from 'lucide-react';

interface KrishiKarmaWidgetProps {
  points: number;
  level: string;
  nextLevelPoints: number;
}

export function KrishiKarmaWidget({ points, level, nextLevelPoints }: KrishiKarmaWidgetProps) {
  const progress = Math.min((points / nextLevelPoints) * 100, 100);

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-900/50 rounded-3xl p-5 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

        <div className="flex items-start justify-between mb-4 relative z-10">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <h3 className="font-bold text-amber-900 dark:text-amber-100">Farm Points</h3>
                </div>
                <div className="text-sm text-amber-800/80 dark:text-amber-200/80 font-medium">
                    Reputation Score
                </div>
            </div>
            <div className="flex flex-col items-end">
                 <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono tracking-tight">
                    {points}
                 </div>
                 <div className="text-[10px] font-bold text-amber-700/60 uppercase tracking-wider">
                    Points
                 </div>
            </div>
        </div>

        <div className="relative z-10">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                    {level}
                </span>
                <span className="text-amber-600/70 dark:text-amber-400/70">
                    {nextLevelPoints - points} to next level
                </span>
            </div>
            
            <div className="h-3 bg-amber-200/50 dark:bg-amber-900/30 rounded-full overflow-hidden border border-amber-200/30">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, type: "spring" }}
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                />
            </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-amber-200/50 dark:border-amber-800/50 flex items-center justify-between gap-2">
             <div className="flex items-center gap-1.5 text-xs text-amber-800/70 dark:text-amber-200/70">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="font-medium">Top 5% in District</span>
             </div>
             <button className="text-xs font-bold text-amber-700 hover:text-amber-900 underline decoration-amber-400/50 hover:decoration-amber-600 transition-all">
                View Leaderboard
             </button>
        </div>
    </div>
  );
}
