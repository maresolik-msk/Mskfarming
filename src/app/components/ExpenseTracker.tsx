import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Check, ChevronRight, Mic, 
  Tractor, Sprout, Users, Droplets, Wrench, 
  Fuel, Clock, Calendar, MapPin, 
  ShieldAlert, Leaf, TriangleAlert,
  CreditCard, Banknote, QrCode, FileText,
  ArrowLeft, BadgeIndianRupee
} from 'lucide-react';
import { toast } from 'sonner';
import { getFields } from '../../lib/api';

interface ExpenseTrackerProps {
  onSave: (expense: any) => void;
  onClose: () => void;
  currentBudget: {
    used: number;
    total: number;
  };
  recentLabourTypes?: string[];
}

type CategoryType = 'machinery' | 'input' | 'labor' | 'irrigation' | 'other';
type StepType = 'category' | 'details' | 'payment' | 'success';

const EXPENSE_CATEGORIES = [
  { id: 'machinery', label: 'Machinery', icon: Tractor, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { id: 'input', label: 'Inputs', icon: Sprout, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  { id: 'labor', label: 'Labour', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  { id: 'irrigation', label: 'Irrigation', icon: Droplets, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200' },
  { id: 'other', label: 'Other', icon: Wrench, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
];

export function ExpenseTracker({ onSave, onClose, currentBudget, recentLabourTypes = [], initialFieldId }: ExpenseTrackerProps & { initialFieldId?: string }) {
  const [step, setStep] = useState<StepType>('category');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [availableFields, setAvailableFields] = useState<any[]>([]);

  useEffect(() => {
    getFields().then(fields => {
      if (fields && fields.length > 0) {
        setAvailableFields(fields);
        // Set default field
        if (initialFieldId) {
             const found = fields.find((f: any) => f.id === initialFieldId);
             if (found) setField(found.id);
             else setField(fields[0].id);
        } else {
             setField(fields[0].id);
        }
      }
    });
  }, [initialFieldId]);
  
  // Common Data
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [field, setField] = useState(initialFieldId || '');
  const [description, setDescription] = useState('');

  // Machinery Data
  const [machineryOp, setMachineryOp] = useState('Plowing');
  const [machineryType, setMachineryType] = useState('Tractor');
  const [ownership, setOwnership] = useState<'owned' | 'rented'>('rented');
  const [fuelLitres, setFuelLitres] = useState('');
  const [fuelCost, setFuelCost] = useState('');
  const [rentalType, setRentalType] = useState<'hour' | 'acre'>('hour');
  const [rentalQty, setRentalQty] = useState('');
  const [rentalRate, setRentalRate] = useState('');

  // Input Data
  const [inputType, setInputType] = useState('Fertiliser');
  const [productName, setProductName] = useState('');
  const [targetIssue, setTargetIssue] = useState('');
  const [inputQty, setInputQty] = useState('');
  const [ppeUsed, setPpeUsed] = useState(false);

  // Labour Data
  const [labourType, setLabourType] = useState('');
  const [workerCount, setWorkerCount] = useState('');
  const [dailyWage, setDailyWage] = useState('');

  // Payment Data
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi' | 'credit'>('cash');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending'>('paid');

  // AI & Results
  const [aiInsight, setAiInsight] = useState('');

  // Auto-calculate amounts
  useEffect(() => {
    if (selectedCategory === 'machinery' && ownership === 'rented') {
      if (rentalQty && rentalRate) {
        setAmount((parseFloat(rentalQty) * parseFloat(rentalRate)).toString());
      }
    } else if (selectedCategory === 'labor') {
      if (workerCount && dailyWage) {
        setAmount((parseFloat(workerCount) * parseFloat(dailyWage)).toString());
      }
    }
  }, [selectedCategory, ownership, rentalQty, rentalRate, workerCount, dailyWage]);

  const handleNext = () => {
    if (step === 'category') setStep('details');
    else if (step === 'details') setStep('payment');
    else if (step === 'payment') handleFinalSave();
  };

  const handleBack = () => {
    if (step === 'details') setStep('category');
    else if (step === 'payment') setStep('details');
    else if (step === 'success') onClose();
  };

  const handleFinalSave = () => {
    // Generate AI Insight
    let insight = '';
    if (selectedCategory === 'machinery') {
      const cost = parseFloat(amount);
      if (ownership === 'rented') {
        insight = `🚜 Cost Analysis: Using a rented ${machineryType} for ${machineryOp} cost you ₹${cost}. Buying your own might be cheaper if you farm >15 acres.`;
      } else {
        insight = `🚜 Efficiency: Owned ${machineryType} operation cost ₹${cost} in fuel. Maintained good efficiency.`;
      }
    } else if (selectedCategory === 'input') {
      insight = `🌱 Agronomy Tip: Applied ${inputType} (${productName}). Ensure 3-day waiting period before entering the field. Cost is within 10% of regional average.`;
    } else if (selectedCategory === 'labor') {
       insight = `👷 Labour Insight: ₹${amount} spent on ${labourType}. This is a recurring expense. Consider mechanization for long-term savings.`;
    } else {
      insight = `✅ Expense recorded. Budget remaining: ₹${currentBudget.total - currentBudget.used - parseFloat(amount || '0')}`;
    }

    setAiInsight(insight);
    setStep('success');

    // Construct final object
    const finalExpense = {
      category: selectedCategory,
      amount: parseFloat(amount || '0'),
      date: new Date(date),
      field,
      description: description || `Expense for ${selectedCategory}`,
      aiInsight: insight,
      payment: {
        mode: paymentMode,
        status: paymentStatus
      },
      // Conditional fields
      ...(selectedCategory === 'machinery' && {
        machineryDetails: {
          operation: machineryOp,
          machineType: machineryType,
          ownership,
          ...(ownership === 'owned' ? { fuelDetails: { litres: parseFloat(fuelLitres), cost: parseFloat(fuelCost) } } : {}),
          ...(ownership === 'rented' ? { rentDetails: { type: rentalType, quantity: parseFloat(rentalQty), rate: parseFloat(rentalRate) } } : {})
        }
      }),
      ...(selectedCategory === 'input' && {
        inputDetails: {
          type: inputType,
          productName,
          targetIssue,
          quantity: inputQty,
          safety: { ppe: ppeUsed, waitingPeriod: 3 }
        }
      }),
      ...(selectedCategory === 'labor' && {
        labourDetails: {
          workType: labourType,
          workerCount: parseInt(workerCount),
          dailyWage: parseFloat(dailyWage)
        }
      })
    };

    onSave(finalExpense);
  };

  const renderCategorySelection = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
      <h3 className="text-lg font-semibold mb-4">What are you spending on?</h3>
      <div className="grid grid-cols-2 gap-3">
        {EXPENSE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat.id as CategoryType); setStep('details'); }}
            className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02] active:scale-95 ${cat.bg} ${cat.border}`}
          >
            <cat.icon className={`w-8 h-8 ${cat.color} mb-2`} />
            <div className={`font-semibold ${cat.color}`}>{cat.label}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderMachineryForm = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
      <div className="bg-card/40 backdrop-blur-sm p-5 sm:p-6 rounded-3xl border border-border/50 space-y-6 shadow-sm">
        <div className="flex items-center gap-4 pb-4 border-b border-border/40">
           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-600 flex items-center justify-center shadow-inner ring-1 ring-white/10">
             <Tractor className="w-6 h-6" />
           </div>
           <div>
             <h4 className="font-bold text-foreground text-lg">Machinery Details</h4>
             <p className="text-xs text-muted-foreground font-medium">Record equipment usage & costs</p>
           </div>
        </div>
        
        {/* Operation Type */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">Operation Type</label>
          <div className="flex flex-wrap gap-2.5">
            {['Plowing', 'Sowing', 'Harvesting', 'Spraying', 'Transport'].map(op => (
              <button
                key={op}
                onClick={() => setMachineryOp(op)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border relative overflow-hidden ${
                  machineryOp === op 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25' 
                  : 'bg-background hover:bg-muted text-muted-foreground border-border/60 hover:border-blue-200'
                }`}
              >
                {op}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">Machine</label>
            <div className="relative group">
                <select 
                  value={machineryType} 
                  onChange={(e) => setMachineryType(e.target.value)}
                  className="w-full appearance-none bg-background/50 border border-border/60 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-foreground cursor-pointer hover:bg-background/80"
                >
                  <option>Tractor</option>
                  <option>Harvester</option>
                  <option>Rotavator</option>
                  <option>Sprayer</option>
                  <option>Drone</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-hover:text-foreground transition-colors">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">Ownership</label>
            <div className="flex bg-muted/30 p-1 rounded-xl border border-border/40 relative h-[46px]">
              <button 
                onClick={() => setOwnership('owned')}
                className={`flex-1 rounded-[9px] text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                    ownership === 'owned' 
                    ? 'bg-background text-blue-600 shadow-sm ring-1 ring-black/5 dark:ring-white/10' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Owned
              </button>
              <button 
                onClick={() => setOwnership('rented')}
                className={`flex-1 rounded-[9px] text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                    ownership === 'rented' 
                    ? 'bg-background text-blue-600 shadow-sm ring-1 ring-black/5 dark:ring-white/10' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Rented
              </button>
            </div>
          </div>
        </div>

        <motion.div 
            key={ownership}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="pt-2"
        >
        {ownership === 'rented' ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               <div className="space-y-2">
                 <label className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">Rent Type</label>
                 <div className="relative">
                    <select 
                        value={rentalType} 
                        onChange={(e) => setRentalType(e.target.value as any)}
                        className="w-full appearance-none bg-background/50 border border-border/60 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none cursor-pointer"
                        >
                        <option value="hour">Per Hour</option>
                        <option value="acre">Per Acre</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                        <ChevronRight className="w-4 h-4 rotate-90" />
                    </div>
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">Quantity</label>
                 <div className="relative">
                    <input 
                        type="number" 
                        value={rentalQty}
                        onChange={(e) => setRentalQty(e.target.value)}
                        placeholder="0.0"
                        className="w-full bg-background/50 border border-border/60 rounded-xl py-3 pl-4 pr-9 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    />
                     <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium pointer-events-none">
                        {rentalType === 'hour' ? 'Hrs' : 'Ac'}
                     </span>
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">Rate</label>
                 <div className="relative">
                    <input 
                        type="number" 
                        value={rentalRate}
                        onChange={(e) => setRentalRate(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-background/50 border border-border/60 rounded-xl py-3 pl-9 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                        <BadgeIndianRupee className="w-4 h-4" />
                    </div>
                 </div>
               </div>
          </div>
        ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">Fuel Used</label>
                <div className="relative">
                    <input 
                    type="number" 
                    value={fuelLitres}
                    onChange={(e) => setFuelLitres(e.target.value)}
                    placeholder="0.0"
                    className="w-full bg-background/50 border border-border/60 rounded-xl py-3 pl-10 pr-9 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                        <Fuel className="w-4 h-4" />
                    </div>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium pointer-events-none">L</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">Fuel Cost</label>
                <div className="relative">
                    <input 
                    type="number" 
                    value={fuelCost}
                    onChange={(e) => { setFuelCost(e.target.value); setAmount(e.target.value); }}
                    placeholder="0.00"
                    className="w-full bg-background/50 border border-border/60 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                        <BadgeIndianRupee className="w-4 h-4" />
                    </div>
                </div>
              </div>
            </div>
        )}
        </motion.div>
      </div>
    </div>
  );

  const renderInputForm = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
      <div className="bg-card/40 backdrop-blur-sm p-5 sm:p-6 rounded-3xl border border-border/50 space-y-6 shadow-sm">
        <div className="flex items-center gap-4 pb-4 border-b border-border/40">
           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-600 flex items-center justify-center shadow-inner ring-1 ring-white/10">
             <Leaf className="w-6 h-6" />
           </div>
           <div>
             <h4 className="font-bold text-foreground text-lg">Input Details</h4>
             <p className="text-xs text-muted-foreground font-medium">Record materials & crop protection</p>
           </div>
        </div>

        {/* Type */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">Category</label>
          <div className="flex flex-wrap gap-2.5">
            {['Fertiliser', 'Pesticide', 'Herbicide', 'Seeds'].map(type => (
              <button
                key={type}
                onClick={() => setInputType(type)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border relative overflow-hidden ${
                  inputType === type 
                  ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-500/25' 
                  : 'bg-background hover:bg-muted text-muted-foreground border-border/60 hover:border-green-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">Product Name</label>
            <input 
              type="text" 
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Urea, DAP, Monocrotophos"
              className="w-full bg-background/50 border border-border/60 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                 <label className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">Target / Crop</label>
                 <input 
                   type="text" 
                   value={targetIssue}
                   onChange={(e) => setTargetIssue(e.target.value)}
                   placeholder="e.g. Stem borer"
                   className="w-full bg-background/50 border border-border/60 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">Quantity</label>
                 <input 
                   type="text" 
                   value={inputQty}
                   onChange={(e) => setInputQty(e.target.value)}
                   placeholder="e.g. 50 kg"
                   className="w-full bg-background/50 border border-border/60 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none"
                 />
              </div>
          </div>
        </div>

        {/* Safety */}
        <div className="flex items-center gap-4 p-4 bg-amber-500/5 rounded-2xl border border-amber-500/20 transition-colors hover:bg-amber-500/10 cursor-pointer" onClick={() => setPpeUsed(!ppeUsed)}>
           <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
           </div>
           <div className="flex-1">
             <div className="text-sm font-bold text-foreground">Safety Protocol</div>
             <div className="text-xs text-muted-foreground">Protective gear (mask/gloves) used?</div>
           </div>
           <div 
             className={`w-12 h-7 rounded-full transition-colors duration-200 ease-in-out relative ${ppeUsed ? 'bg-green-600' : 'bg-muted border border-border/50'}`}
           >
             <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${ppeUsed ? 'translate-x-5' : 'translate-x-0'}`} />
           </div>
        </div>
      </div>
    </div>
  );

  const renderLabourForm = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
      <div className="bg-card/40 backdrop-blur-sm p-5 sm:p-6 rounded-3xl border border-border/50 space-y-6 shadow-sm">
        <div className="flex items-center gap-4 pb-4 border-b border-border/40">
           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 text-orange-600 flex items-center justify-center shadow-inner ring-1 ring-white/10">
             <Users className="w-6 h-6" />
           </div>
           <div>
             <h4 className="font-bold text-foreground text-lg">Labour Details</h4>
             <p className="text-xs text-muted-foreground font-medium">Manage workforce & wages</p>
           </div>
        </div>
        
        {/* Recent Types */}
        {recentLabourTypes.length > 0 && (
          <div className="space-y-2.5">
             <div className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">Recent Activities</div>
             <div className="flex flex-wrap gap-2">
                {recentLabourTypes.map(type => (
                  <button 
                    key={type}
                    onClick={() => setLabourType(type)}
                    className="px-3 py-1.5 bg-orange-500/5 hover:bg-orange-500/15 border border-orange-500/10 hover:border-orange-500/30 rounded-lg text-xs font-semibold text-orange-700 transition-all duration-200"
                  >
                    {type}
                  </button>
                ))}
             </div>
          </div>
        )}

        {/* Common Tasks */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">Common Tasks</label>
          <div className="flex flex-wrap gap-2.5">
            {['Land Prep', 'Sowing', 'Weeding', 'Irrigation', 'Spraying', 'Harvesting', 'Threshing', 'Winnowing'].map(task => (
              <button
                key={task}
                onClick={() => setLabourType(task)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border relative overflow-hidden ${
                  labourType === task 
                  ? 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-500/25' 
                  : 'bg-background hover:bg-muted text-muted-foreground border-border/60 hover:border-orange-200'
                }`}
              >
                {task}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
            <div className="space-y-2">
            <label className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">Work Type</label>
            <input 
                type="text"
                value={labourType}
                onChange={(e) => setLabourType(e.target.value)} 
                placeholder="e.g. Weeding, Harvesting"
                className="w-full bg-background/50 border border-border/60 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
            />
            </div>

            <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">Workers</label>
                <div className="relative">
                    <input 
                        type="number"
                        value={workerCount}
                        onChange={(e) => setWorkerCount(e.target.value)}
                        placeholder="0"
                        className="w-full bg-background/50 border border-border/60 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                        <Users className="w-4 h-4" />
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">Daily Wage</label>
                <div className="relative">
                    <input 
                        type="number"
                        value={dailyWage}
                        onChange={(e) => setDailyWage(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-background/50 border border-border/60 rounded-xl py-3 pl-9 pr-4 text-sm font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                        <BadgeIndianRupee className="w-4 h-4" />
                    </div>
                </div>
            </div>
            </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentForm = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
       <div className="space-y-4">
         <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Total Amount (₹)</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full text-3xl font-bold bg-transparent border-b-2 border-primary/20 focus:border-primary outline-none py-2"
              placeholder="0"
            />
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Date</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 bg-muted/50 rounded-lg border border-border"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Field</label>
              <select 
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="w-full p-2 bg-muted/50 rounded-lg border border-border"
              >
                {availableFields.length > 0 ? (
                  availableFields.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))
                ) : (
                  <>
                    <option value="North Field">North Field</option>
                    <option value="South Field">South Field</option>
                    <option value="East Garden">East Garden</option>
                  </>
                )}
              </select>
            </div>
         </div>

         <div>
           <label className="block text-sm font-medium text-muted-foreground mb-2">Payment Mode</label>
           <div className="grid grid-cols-3 gap-2">
             {[
               { id: 'cash', label: 'Cash', icon: Banknote },
               { id: 'upi', label: 'UPI', icon: QrCode },
               { id: 'credit', label: 'Later', icon: Clock },
             ].map((mode) => (
               <button
                 key={mode.id}
                 onClick={() => setPaymentMode(mode.id as any)}
                 className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                   paymentMode === mode.id 
                   ? 'bg-primary/10 border-primary text-primary' 
                   : 'bg-card border-border hover:bg-muted'
                 }`}
               >
                 <mode.icon className="w-5 h-5 mb-1" />
                 <span className="text-xs font-medium">{mode.label}</span>
               </button>
             ))}
           </div>
         </div>

         <div>
           <label className="block text-sm font-medium text-muted-foreground mb-2">Status</label>
           <div className="flex bg-muted p-1 rounded-lg">
             <button 
               onClick={() => setPaymentStatus('paid')}
               className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                 paymentStatus === 'paid' ? 'bg-green-100 text-green-700 shadow-sm' : 'text-muted-foreground'
               }`}
             >
               Paid
             </button>
             <button 
               onClick={() => setPaymentStatus('pending')}
               className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                 paymentStatus === 'pending' ? 'bg-amber-100 text-amber-700 shadow-sm' : 'text-muted-foreground'
               }`}
             >
               Pending
             </button>
           </div>
         </div>
       </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-8 animate-in zoom-in-50 duration-300">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="w-10 h-10 text-green-600" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">Expense Saved!</h3>
      <p className="text-muted-foreground mb-6">Your record has been updated.</p>
      
      {/* AI Insight Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100 text-left relative overflow-hidden">
         <div className="absolute top-0 right-0 p-2 opacity-10">
           <Sprout className="w-24 h-24" />
         </div>
         <div className="flex items-start gap-3 relative z-10">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <BadgeIndianRupee className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">AI Smart Insight</div>
              <p className="text-sm text-indigo-900 leading-relaxed">
                {aiInsight}
              </p>
            </div>
         </div>
      </div>
      
      <button 
        onClick={onClose}
        className="mt-8 w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90"
      >
        Done
      </button>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center z-50 sm:p-6 transition-all duration-500"
      onClick={(e) => {
        // Close when clicking on backdrop
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ y: '20%', opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: '20%', opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 350, damping: 35 }}
        className="bg-background/95 backdrop-blur-xl w-full max-w-lg rounded-t-[2rem] sm:rounded-[2rem] max-h-[90vh] flex flex-col shadow-2xl border border-white/10 dark:border-white/5 ring-1 ring-black/5"
      >
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-5 border-b border-border/40 flex items-center justify-between bg-gradient-to-b from-white/5 to-transparent">
          <div className="flex items-center gap-4">
             {step !== 'category' && step !== 'success' && (
               <button onClick={handleBack} className="p-2 -ml-2 hover:bg-muted/80 rounded-full transition-colors group">
                 <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
               </button>
             )}
             <div>
                <motion.h3 
                  key={step}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-bold text-xl tracking-tight text-foreground"
                >
                  {step === 'category' ? 'Add Expense' : 
                   step === 'details' ? 'Details' : 
                   step === 'payment' ? 'Payment' : 'Complete'}
                </motion.h3>
                {step !== 'success' && (
                  <div className="flex items-center gap-1.5 mt-2">
                    {['category', 'details', 'payment'].map((s, i) => {
                         const steps = ['category', 'details', 'payment'];
                         const stepIndex = steps.indexOf(step);
                         const isActive = i <= stepIndex;
                         const isCurrent = i === stepIndex;
                         return (
                            <div 
                              key={s} 
                              className={`h-1.5 rounded-full transition-all duration-500 ease-out ${isActive ? 'bg-primary shadow-sm shadow-primary/30' : 'bg-muted-foreground/10'} ${isCurrent ? 'w-8' : isActive ? 'w-3' : 'w-2'}`} 
                            />
                         )
                    })}
                  </div>
                )}
             </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onClose} 
              className="w-10 h-10 flex items-center justify-center hover:bg-red-500/10 hover:text-red-600 rounded-full text-muted-foreground transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 scrollbar-hide">
           {step === 'category' && renderCategorySelection()}
           
           {step === 'details' && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
               {selectedCategory === 'machinery' && renderMachineryForm()}
               {selectedCategory === 'input' && renderInputForm()}
               {selectedCategory === 'labor' && renderLabourForm()}
               {(selectedCategory === 'irrigation' || selectedCategory === 'other') && (
                 <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                   <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                     <Wrench className="w-8 h-8 text-muted-foreground" />
                   </div>
                   <p className="text-muted-foreground font-medium">Simplified entry for {selectedCategory}.<br/>Proceed to payment.</p>
                 </div>
               )}
             </motion.div>
           )}

           {step === 'payment' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                {renderPaymentForm()}
              </motion.div>
           )}
           
           {step === 'success' && renderSuccess()}
        </div>

        {/* Footer */}
        {step !== 'success' && (
          <div className="flex-shrink-0 p-6 border-t border-border/40 bg-background/95 backdrop-blur-xl z-50 relative flex gap-3">
             {step !== 'category' && (
                <button
                  onClick={handleBack}
                  className="px-6 py-4 rounded-2xl font-bold text-muted-foreground bg-muted/50 hover:bg-muted transition-colors"
                >
                  Back
                </button>
             )}
             <button
               onClick={handleNext}
               disabled={step === 'category' && !selectedCategory}
               className="flex-1 py-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-primary/25 active:scale-[0.98] ring-offset-2 focus:ring-2 ring-primary"
             >
               {step === 'payment' ? 'Save & Record' : 'Continue'}
               <ChevronRight className="w-5 h-5 stroke-[3]" />
             </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}