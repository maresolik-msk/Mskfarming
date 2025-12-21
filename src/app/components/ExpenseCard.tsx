import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Tractor, Sprout, Users, Droplets, Wrench, 
  ChevronDown, ChevronUp, MapPin, Calendar, 
  CreditCard, Info, Sparkles, Fuel,
  IndianRupee, Clock
} from 'lucide-react';

interface ExpenseCardProps {
  expense: {
    id: string;
    category: string;
    amount: number;
    description: string;
    date: Date;
    field?: string;
    aiInsight?: string;
    payment?: {
      mode: 'cash' | 'upi' | 'credit' | 'bank';
      status: 'paid' | 'partial' | 'pending';
    };
    labourDetails?: {
      workType: string;
      workerCount: number;
      dailyWage: number;
    };
    machineryDetails?: {
      operation: string;
      machineType: string;
      ownership: 'owned' | 'rented';
      fuelDetails?: { litres: number; cost: number };
      rentDetails?: { type: 'hour' | 'acre'; quantity: number; rate: number };
    };
    inputDetails?: {
      type: string;
      productName: string;
      targetIssue?: string;
      quantity?: string;
    };
  };
}

export function ExpenseCard({ expense }: ExpenseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'machinery': return Tractor;
      case 'input': return Sprout;
      case 'labor': return Users;
      case 'irrigation': return Droplets;
      default: return Wrench;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'machinery': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'input': return 'bg-green-100 text-green-700 border-green-200';
      case 'labor': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'irrigation': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const Icon = getCategoryIcon(expense.category);
  const colorClass = getCategoryColor(expense.category);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border shadow-sm overflow-hidden mb-3"
    >
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 flex gap-4 cursor-pointer group relative hover:bg-muted/30 transition-all duration-200"
      >
        {/* Active Indicator */}
        <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${isExpanded ? 'bg-primary' : 'bg-transparent'} transition-colors`} />

        {/* Icon Box */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 shadow-sm ${colorClass} group-hover:scale-105 transition-transform duration-200`}>
          <Icon className="w-6 h-6" />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground truncate text-sm sm:text-base leading-tight">
                {expense.machineryDetails?.operation || 
                 expense.inputDetails?.productName || 
                 expense.labourDetails?.workType || 
                 expense.description}
              </h3>
              
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-muted-foreground/70" />
                  {new Date(expense.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
                {expense.field && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1 bg-muted/50 px-1.5 py-0.5 rounded-md">
                    <MapPin className="w-3 h-3 text-muted-foreground/70" />
                    {expense.field}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right shrink-0 flex flex-col items-end gap-1">
              <div className="font-bold text-base sm:text-lg text-foreground flex items-center">
                <IndianRupee className="w-4 h-4 mr-0.5 stroke-[2.5]" />
                {expense.amount.toLocaleString()}
              </div>
              
              <div className="flex items-center gap-2">
                {expense.payment?.status === 'pending' && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-medium border border-amber-100 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Due
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 text-muted-foreground/50 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border bg-muted/30"
          >
            <div className="p-4 space-y-4">
              {/* AI Insight */}
              {expense.aiInsight && (
                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 flex gap-3">
                  <div className="bg-white p-1.5 rounded-md shadow-sm h-fit">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">AI Insight</div>
                    <p className="text-sm text-indigo-900 leading-snug">{expense.aiInsight}</p>
                  </div>
                </div>
              )}

              {/* Specific Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {expense.machineryDetails && (
                  <>
                    <div className="bg-background p-2 rounded-lg border border-border">
                      <div className="text-xs text-muted-foreground mb-1">Machine</div>
                      <div className="font-medium">{expense.machineryDetails.machineType} ({expense.machineryDetails.ownership})</div>
                    </div>
                    {expense.machineryDetails.ownership === 'rented' && expense.machineryDetails.rentDetails && (
                      <div className="bg-background p-2 rounded-lg border border-border">
                        <div className="text-xs text-muted-foreground mb-1">Rental</div>
                        <div className="font-medium">
                          {expense.machineryDetails.rentDetails.quantity} {expense.machineryDetails.rentDetails.type}s @ ₹{expense.machineryDetails.rentDetails.rate}
                        </div>
                      </div>
                    )}
                    {expense.machineryDetails.ownership === 'owned' && expense.machineryDetails.fuelDetails && (
                      <div className="bg-background p-2 rounded-lg border border-border">
                        <div className="text-xs text-muted-foreground mb-1">Fuel</div>
                        <div className="font-medium flex items-center gap-1">
                          <Fuel className="w-3 h-3" />
                          {expense.machineryDetails.fuelDetails.litres}L (₹{expense.machineryDetails.fuelDetails.cost})
                        </div>
                      </div>
                    )}
                  </>
                )}

                {expense.inputDetails && (
                   <>
                    <div className="bg-background p-2 rounded-lg border border-border">
                      <div className="text-xs text-muted-foreground mb-1">Type</div>
                      <div className="font-medium">{expense.inputDetails.type}</div>
                    </div>
                    <div className="bg-background p-2 rounded-lg border border-border">
                      <div className="text-xs text-muted-foreground mb-1">Quantity</div>
                      <div className="font-medium">{expense.inputDetails.quantity || 'N/A'}</div>
                    </div>
                   </>
                )}

                {expense.labourDetails && (
                   <>
                    <div className="bg-background p-2 rounded-lg border border-border">
                      <div className="text-xs text-muted-foreground mb-1">Workforce</div>
                      <div className="font-medium">{expense.labourDetails.workerCount} Workers</div>
                    </div>
                    <div className="bg-background p-2 rounded-lg border border-border">
                      <div className="text-xs text-muted-foreground mb-1">Daily Wage</div>
                      <div className="font-medium">₹{expense.labourDetails.dailyWage}/day</div>
                    </div>
                   </>
                )}
                
                {expense.payment && (
                  <div className="bg-background p-2 rounded-lg border border-border">
                    <div className="text-xs text-muted-foreground mb-1">Payment</div>
                    <div className="font-medium flex items-center gap-1 capitalize">
                      <CreditCard className="w-3 h-3" />
                      {expense.payment.mode}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}