import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Filter, 
  Download,
  PieChart as PieChartIcon,
  List,
  AlertTriangle,
  ChevronDown,
  Pencil,
  Check,
  X
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';
import { ExpenseCard } from './ExpenseCard';

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: Date;
  field?: string;
  aiInsight?: string;
  machineryDetails?: any;
  inputDetails?: any;
  labourDetails?: any;
  payment?: any;
}

interface BudgetOverviewProps {
  budget: {
    total: number;
    used: number;
  };
  expenses: Expense[];
  onAddExpense: () => void;
  onBack?: () => void;
  onUpdateBudget?: (newTotal: number) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  machinery: '#2563eb', // blue-600
  input: '#16a34a',     // green-600
  labor: '#ea580c',     // orange-600
  irrigation: '#0891b2', // cyan-600
  other: '#4b5563',     // gray-600
};

const CATEGORY_LABELS: Record<string, string> = {
  machinery: 'Machinery',
  input: 'Inputs',
  labor: 'Labor',
  irrigation: 'Irrigation',
  other: 'Other',
};

export function BudgetOverview({ budget, expenses, onAddExpense, onBack, onUpdateBudget }: BudgetOverviewProps) {
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [editAmount, setEditAmount] = useState(budget.total.toString());

  const remaining = budget.total - budget.used;
  const percentUsed = (budget.used / budget.total) * 100;
  
  const isCritical = percentUsed > 90;
  const isWarning = percentUsed > 75;

  // Prepare chart data
  const expensesByCategory = expenses.reduce((acc, curr) => {
    const cat = curr.category || 'other';
    acc[cat] = (acc[cat] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name: CATEGORY_LABELS[name] || name,
    value,
    color: CATEGORY_COLORS[name] || '#94a3b8'
  }));

  // Sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="h-full pb-24 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-muted rounded-full transition-colors -ml-2">
              <ChevronDown className="w-5 h-5 rotate-90 text-muted-foreground" />
            </button>
          )}
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Wallet className="w-6 h-6 text-primary" />
              Budget & Expenses
            </h2>
            <p className="text-muted-foreground text-sm">Track your farm's financial health</p>
          </div>
        </div>
        <button 
          onClick={onAddExpense}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Expense</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Budget Summary Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-xl mb-8 relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/20 rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="text-slate-400 font-medium mb-1 flex items-center gap-2">
                Total Budget
                {!isEditingBudget && onUpdateBudget && (
                   <button 
                     onClick={() => { 
                       setEditAmount(budget.total.toString()); 
                       setIsEditingBudget(true); 
                     }} 
                     className="p-1 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                   >
                     <Pencil className="w-3.5 h-3.5" />
                   </button>
                )}
              </div>
              
              {isEditingBudget ? (
                <div className="flex items-center gap-2 h-9">
                   <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                      <input 
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="w-32 bg-white/10 border border-white/20 rounded-lg py-1 pl-6 pr-2 text-white font-bold text-lg focus:outline-none focus:border-primary/50"
                        autoFocus
                      />
                   </div>
                   <button 
                    onClick={() => {
                        const amount = parseFloat(editAmount);
                        if (!isNaN(amount) && amount > 0 && onUpdateBudget) {
                          onUpdateBudget(amount);
                          setIsEditingBudget(false);
                        }
                    }} 
                    className="p-1.5 bg-primary/20 hover:bg-primary/40 text-primary rounded-lg transition-colors"
                   >
                     <Check className="w-4 h-4" />
                   </button>
                   <button onClick={() => setIsEditingBudget(false)} className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg transition-colors">
                     <X className="w-4 h-4" />
                   </button>
                </div>
              ) : (
                <h3 className="text-3xl font-bold text-[rgb(255,255,255)]">₹{budget.total.toLocaleString()}</h3>
              )}
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
              isCritical ? 'bg-red-500/20 text-red-300 border-red-500/50' : 
              isWarning ? 'bg-orange-500/20 text-orange-300 border-orange-500/50' : 
              'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
            }`}>
              {Math.round(percentUsed)}% USED
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {(() => {
              // Calculate dynamic values for live preview during editing
              const displayTotal = isEditingBudget 
                ? (parseFloat(editAmount) || budget.total) 
                : budget.total;
              
              const displayRemaining = displayTotal - budget.used;
              const displayPercent = (budget.used / (displayTotal || 1)) * 100;
              
              const displayIsCritical = displayPercent > 90;
              const displayIsWarning = displayPercent > 75;

              return (
                <>
                  <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(displayPercent, 100)}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        displayIsCritical ? 'bg-gradient-to-r from-red-500 to-rose-600' :
                        displayIsWarning ? 'bg-gradient-to-r from-orange-500 to-amber-500' :
                        'bg-gradient-to-r from-primary to-emerald-400'
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-300">Spent: ₹{budget.used.toLocaleString()}</span>
                    <span className="text-slate-300">Remaining: ₹{displayRemaining.toLocaleString()}</span>
                  </div>
                </>
              );
            })()}
          </div>

          {isWarning && (
            <div className={`flex items-center gap-2 text-sm p-3 rounded-xl bg-white/5 border ${isCritical ? 'border-red-500/30 text-red-200' : 'border-orange-500/30 text-orange-200'}`}>
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <p className="leading-tight">
                {isCritical 
                  ? "Critical budget status. Review expenses immediately." 
                  : "Approaching budget limit. Monitor spending closely."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Analytics & History Tabs */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">
          {viewMode === 'list' ? 'Recent Expenses' : 'Spending Analysis'}
        </h3>
        <div className="flex p-1 bg-muted/50 rounded-xl">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'list' 
                ? 'bg-background shadow-sm text-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('chart')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'chart' 
                ? 'bg-background shadow-sm text-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <PieChartIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {sortedExpenses.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border dashed border-2 rounded-3xl">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-1">No expenses yet</h3>
              <p className="text-muted-foreground text-sm mb-4">Start tracking your farm spending</p>
              <button 
                onClick={onAddExpense}
                className="text-primary font-medium hover:underline"
              >
                Add your first expense
              </button>
            </div>
          ) : (
            sortedExpenses.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))
          )}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 space-y-3">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">₹{item.value.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round((item.value / budget.used) * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
