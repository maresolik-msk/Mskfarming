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
import svgPaths from '../../imports/svg-9v20g2g09i';

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
  fields?: any[];
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

export function BudgetOverview({ budget, expenses, onAddExpense, onBack, onUpdateBudget, fields = [] }: BudgetOverviewProps) {
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [editAmount, setEditAmount] = useState(budget.total.toString());

  const remaining = budget.total - budget.used;
  const percentUsed = (budget.used / budget.total) * 100;
  
  const isCritical = percentUsed > 90;
  const isWarning = percentUsed > 75;

  // Helper to get field name
  const getFieldName = (fieldId?: string) => {
    if (!fieldId) return undefined;
    const field = fields?.find(f => f.id === fieldId);
    return field ? field.name : fieldId;
  };

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
    <div className="h-full pb-24 animate-in fade-in slide-in-from-bottom-4 overflow-x-hidden">
        {/* New Header Implementation from Figma Frame 67 */}
        <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative w-full mb-6">
           {/* Top Bar with Back and Title */}
           <div className="h-[87px] relative shrink-0 w-full">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
                 {/* Back Button */}
                 {onBack && (
                 <button onClick={onBack} className="relative rounded-full shrink-0 size-[40px] flex items-center justify-center cursor-pointer hover:bg-black/5 transition-colors">
                    <div className="h-[20px] w-[20px] relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="block w-full h-full" fill="none" viewBox="0 0 12 7">
                                <path d={svgPaths.p134eaf00} stroke="#6B5C5C" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66612" />
                            </svg>
                        </div>
                    </div>
                 </button>
                 )}

                 {/* Title Text */}
                 <div className="relative shrink-0 flex-1">
                    <div className="flex flex-col items-start relative size-full">
                       <h2 className="font-['Merriweather',serif] font-bold text-[#812f0f] text-[24px] leading-[32px]">
                          Budget & Expenses
                       </h2>
                       <p className="font-['Inter',sans-serif] font-normal text-[#6b5c5c] text-[14px] leading-[22.75px]">
                          Track your farm's financial health
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Add Button */}
           <button onClick={onAddExpense} className="bg-[#812f0f] h-[41px] relative rounded-[20px] shrink-0 w-full hover:bg-[#963714] transition-colors cursor-pointer active:scale-[0.98] shadow-md">
              <div className="flex flex-row items-center justify-center size-full gap-2">
                 <div className="relative shrink-0 size-[16px]">
                    <svg className="block size-full" fill="none" viewBox="0 0 16 16">
                         <path d="M3.33174 7.99617H12.6606" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" />
                         <path d="M7.99617 3.33174V12.6606" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" />
                    </svg>
                 </div>
                 <span className="font-['Inter',sans-serif] font-medium text-[16px] text-white">Add</span>
              </div>
           </button>
        </div>

        {/* Budget Card */}
        <div className="bg-[#2c231f] overflow-hidden relative rounded-[24px] shrink-0 w-full mb-8 shadow-xl">
            <div className="p-[24px] flex flex-col gap-[32px]">
               {/* Top Row: Total Budget & Badge */}
               <div className="flex items-start justify-between w-full">
                  <div className="flex flex-col gap-[4px]">
                     <div className="flex items-center gap-2">
                        <span className="font-['Inter',sans-serif] font-medium leading-[24px] text-[#90a1b9] text-[16px]">Total Budget</span>
                        {!isEditingBudget && onUpdateBudget && (
                           <button 
                             onClick={() => {
                               setEditAmount(budget.total.toString());
                               setIsEditingBudget(true);
                             }}
                             className="flex items-center justify-center p-1 rounded-full w-[24px] h-[24px] hover:bg-white/10 transition-colors"
                           >
                              <div className="h-[14px] w-[14px] relative">
                                <svg className="block size-full" fill="none" viewBox="0 0 13 13">
                                   <path d={svgPaths.p325a6e80} stroke="#62748E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16" />
                                </svg>
                                <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%]">
                                   <svg className="block size-full" fill="none" viewBox="0 0 4 4">
                                      <path d={svgPaths.p3bc76280} stroke="#62748E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16" />
                                   </svg>
                                </div>
                              </div>
                           </button>
                        )}
                     </div>
                     {isEditingBudget ? (
                        <div className="flex items-center gap-2 h-[36px]">
                           <span className="text-white text-xl">₹</span>
                           <input 
                             type="number" 
                             value={editAmount} 
                             onChange={(e) => setEditAmount(e.target.value)}
                             className="bg-transparent border-b border-white/20 text-white text-2xl font-bold w-32 focus:outline-none"
                             autoFocus
                           />
                           <button onClick={() => {
                              const val = parseFloat(editAmount);
                              if (!isNaN(val) && val > 0 && onUpdateBudget) {
                                onUpdateBudget(val);
                                setIsEditingBudget(false);
                              }
                           }}><Check className="text-green-400 w-5 h-5"/></button>
                           <button onClick={() => setIsEditingBudget(false)}><X className="text-red-400 w-5 h-5"/></button>
                        </div>
                     ) : (
                        <span className="font-['Inter',sans-serif] font-semibold leading-[36px] text-[30px] text-white">₹{budget.total.toLocaleString()}</span>
                     )}
                  </div>
                  <div className="bg-[rgba(0,188,60,0.2)] h-[26px] relative rounded-[20px] px-3 flex items-center justify-center border border-[rgba(0,188,125,0.5)]">
                     <span className="font-['Inter',sans-serif] font-bold text-[#5ee9b5] text-[12px] whitespace-nowrap">{Math.round(percentUsed)}% USED</span>
                  </div>
               </div>

               {/* Progress & Stats */}
               <div className="flex flex-col gap-[12px] w-full">
                  <div className="bg-[rgba(255,255,255,0.1)] h-[16px] relative rounded-[20px] w-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percentUsed, 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="bg-[#fbe8e0] h-full rounded-[20px]"
                     />
                  </div>
                  <div className="flex items-center justify-between w-full">
                     <span className="font-['Inter',sans-serif] font-semibold text-[#cad5e2] text-[14px]">
                        <span className="font-light">Spent:</span> ₹{budget.used.toLocaleString()}
                     </span>
                     <span className="font-['Inter',sans-serif] font-medium text-[#cad5e2] text-[14px]">
                        Remaining: ₹{remaining.toLocaleString()}
                     </span>
                  </div>
               </div>
            </div>
        </div>

      {/* Analytics & History Tabs */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-bold text-lg text-[#2a0f05]">
          {viewMode === 'list' ? 'Recent Expenses' : 'Spending Analysis'}
        </h3>
        <div className="flex p-1 bg-muted/50 rounded-xl">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'list' 
                ? 'bg-white shadow-sm text-[#812f0f]' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('chart')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'chart' 
                ? 'bg-white shadow-sm text-[#812f0f]' 
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
            <div className="text-center py-12 bg-muted/20 border border-dashed border-border rounded-3xl">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-1 text-[#2a0f05]">No expenses yet</h3>
              <p className="text-muted-foreground text-sm mb-4">Start tracking your farm spending</p>
              <button 
                onClick={onAddExpense}
                className="text-[#812f0f] font-medium hover:underline"
              >
                Add your first expense
              </button>
            </div>
          ) : (
            sortedExpenses.map((expense) => (
              <ExpenseCard 
                key={expense.id} 
                expense={{
                  ...expense,
                  field: getFieldName(expense.field)
                }} 
              />
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
