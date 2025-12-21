import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Check, ChevronRight, Mic, 
  Tractor, Sprout, Users, Droplets, Wrench, 
  Fuel, Clock, Calendar, MapPin, 
  ShieldAlert, Leaf, AlertTriangle,
  CreditCard, Banknote, QrCode, FileText,
  ArrowLeft, BadgeIndianRupee
} from 'lucide-react';
import { toast } from 'sonner';

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

export function ExpenseTracker({ onSave, onClose, currentBudget, recentLabourTypes = [] }: ExpenseTrackerProps) {
  const [step, setStep] = useState<StepType>('category');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  
  // Common Data
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [field, setField] = useState('North Field');
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
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-4">
        <h4 className="font-semibold text-blue-800 flex items-center gap-2">
          <Tractor className="w-5 h-5" /> Machinery Details
        </h4>
        
        {/* Operation Type */}
        <div>
          <label className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Operation</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {['Plowing', 'Sowing', 'Harvesting', 'Spraying', 'Transport'].map(op => (
              <button
                key={op}
                onClick={() => setMachineryOp(op)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  machineryOp === op 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
                }`}
              >
                {op}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Machine</label>
            <select 
              value={machineryType} 
              onChange={(e) => setMachineryType(e.target.value)}
              className="w-full mt-1 p-2 rounded-lg border border-blue-200 bg-white text-sm"
            >
              <option>Tractor</option>
              <option>Harvester</option>
              <option>Rotavator</option>
              <option>Sprayer</option>
              <option>Drone</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Owned?</label>
            <div className="flex bg-white rounded-lg border border-blue-200 mt-1 overflow-hidden">
              <button 
                onClick={() => setOwnership('owned')}
                className={`flex-1 py-2 text-xs font-medium ${ownership === 'owned' ? 'bg-blue-600 text-white' : 'text-blue-600'}`}
              >
                Yes
              </button>
              <button 
                onClick={() => setOwnership('rented')}
                className={`flex-1 py-2 text-xs font-medium ${ownership === 'rented' ? 'bg-blue-600 text-white' : 'text-blue-600'}`}
              >
                No
              </button>
            </div>
          </div>
        </div>

        {ownership === 'rented' ? (
          <div className="space-y-3 pt-2 border-t border-blue-200">
             <div className="flex gap-4">
               <div className="flex-1">
                 <label className="text-xs text-blue-700">Rent Type</label>
                 <select 
                   value={rentalType} 
                   onChange={(e) => setRentalType(e.target.value as any)}
                   className="w-full p-2 rounded-lg border border-blue-200 text-sm mt-1"
                 >
                   <option value="hour">Per Hour</option>
                   <option value="acre">Per Acre</option>
                 </select>
               </div>
               <div className="flex-1">
                 <label className="text-xs text-blue-700">Quantity</label>
                 <input 
                    type="number" 
                    value={rentalQty}
                    onChange={(e) => setRentalQty(e.target.value)}
                    placeholder={rentalType === 'hour' ? 'Hours' : 'Acres'}
                    className="w-full p-2 rounded-lg border border-blue-200 text-sm mt-1"
                 />
               </div>
               <div className="flex-1">
                 <label className="text-xs text-blue-700">Rate (₹)</label>
                 <input 
                    type="number" 
                    value={rentalRate}
                    onChange={(e) => setRentalRate(e.target.value)}
                    placeholder="Rate"
                    className="w-full p-2 rounded-lg border border-blue-200 text-sm mt-1"
                 />
               </div>
             </div>
          </div>
        ) : (
          <div className="space-y-3 pt-2 border-t border-blue-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-blue-700">Fuel Used (L)</label>
                <input 
                  type="number" 
                  value={fuelLitres}
                  onChange={(e) => setFuelLitres(e.target.value)}
                  className="w-full p-2 rounded-lg border border-blue-200 text-sm mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-blue-700">Fuel Cost (₹)</label>
                <input 
                  type="number" 
                  value={fuelCost}
                  onChange={(e) => { setFuelCost(e.target.value); setAmount(e.target.value); }}
                  className="w-full p-2 rounded-lg border border-blue-200 text-sm mt-1"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderInputForm = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
      <div className="bg-green-50 p-4 rounded-xl border border-green-100 space-y-4">
        <h4 className="font-semibold text-green-800 flex items-center gap-2">
          <Leaf className="w-5 h-5" /> Input Details
        </h4>

        {/* Type */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['Fertiliser', 'Pesticide', 'Herbicide', 'Seeds'].map(type => (
            <button
              key={type}
              onClick={() => setInputType(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap ${
                inputType === type 
                ? 'bg-green-600 text-white border-green-600' 
                : 'bg-white text-green-600 border-green-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-green-700 uppercase">Product Name</label>
            <input 
              type="text" 
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Urea, DAP, Monocrotophos"
              className="w-full p-2 rounded-lg border border-green-200 mt-1"
            />
          </div>
          <div>
             <label className="text-xs font-semibold text-green-700 uppercase">Target Issue / Crop</label>
             <input 
               type="text" 
               value={targetIssue}
               onChange={(e) => setTargetIssue(e.target.value)}
               placeholder="e.g. Stem borer, Nitrogen deficiency"
               className="w-full p-2 rounded-lg border border-green-200 mt-1"
             />
          </div>
          <div>
             <label className="text-xs font-semibold text-green-700 uppercase">Quantity</label>
             <input 
               type="text" 
               value={inputQty}
               onChange={(e) => setInputQty(e.target.value)}
               placeholder="e.g. 50 kg, 500 ml"
               className="w-full p-2 rounded-lg border border-green-200 mt-1"
             />
          </div>
        </div>

        {/* Safety */}
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
           <ShieldAlert className="w-5 h-5 text-amber-500" />
           <div className="flex-1">
             <div className="text-sm font-medium">Safety Check</div>
             <div className="text-xs text-muted-foreground">Did you wear masks/gloves?</div>
           </div>
           <input 
             type="checkbox" 
             checked={ppeUsed}
             onChange={(e) => setPpeUsed(e.target.checked)}
             className="w-5 h-5 accent-green-600"
           />
        </div>
      </div>
    </div>
  );

  const renderLabourForm = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
      <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 space-y-4">
        <h4 className="font-semibold text-orange-800 flex items-center gap-2">
          <Users className="w-5 h-5" /> Labour Details
        </h4>
        
        {/* Recent Types */}
        {recentLabourTypes.length > 0 && (
          <div>
             <div className="text-xs text-orange-700 mb-2">Recent Activities:</div>
             <div className="flex flex-wrap gap-2">
                {recentLabourTypes.map(type => (
                  <button 
                    key={type}
                    onClick={() => setLabourType(type)}
                    className="px-2 py-1 bg-white border border-orange-200 rounded text-xs text-orange-800"
                  >
                    {type}
                  </button>
                ))}
             </div>
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-orange-700 uppercase">Work Type</label>
          <input 
             type="text"
             value={labourType}
             onChange={(e) => setLabourType(e.target.value)} 
             placeholder="e.g. Weeding, Harvesting"
             className="w-full p-2 rounded-lg border border-orange-200 mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="text-xs font-semibold text-orange-700 uppercase">Workers</label>
             <input 
                type="number"
                value={workerCount}
                onChange={(e) => setWorkerCount(e.target.value)}
                className="w-full p-2 rounded-lg border border-orange-200 mt-1"
             />
           </div>
           <div>
             <label className="text-xs font-semibold text-orange-700 uppercase">Wage (₹)</label>
             <input 
                type="number"
                value={dailyWage}
                onChange={(e) => setDailyWage(e.target.value)}
                className="w-full p-2 rounded-lg border border-orange-200 mt-1"
             />
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
                <option>North Field</option>
                <option>South Field</option>
                <option>East Garden</option>
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 sm:p-4">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="bg-card w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
             {step !== 'category' && step !== 'success' && (
               <button onClick={handleBack} className="p-1 hover:bg-muted rounded-full">
                 <ArrowLeft className="w-5 h-5 text-muted-foreground" />
               </button>
             )}
             <div>
                <h3 className="font-semibold text-lg">
                  {step === 'category' ? 'Add Expense' : 
                   step === 'details' ? 'Enter Details' : 
                   step === 'payment' ? 'Payment' : 'Success'}
                </h3>
                {step !== 'success' && (
                  <div className="flex items-center gap-1 mt-1">
                    <div className={`h-1 w-6 rounded-full ${step === 'category' ? 'bg-primary' : 'bg-primary/30'}`} />
                    <div className={`h-1 w-6 rounded-full ${step === 'details' ? 'bg-primary' : 'bg-primary/30'}`} />
                    <div className={`h-1 w-6 rounded-full ${step === 'payment' ? 'bg-primary' : 'bg-primary/30'}`} />
                  </div>
                )}
             </div>
          </div>
          <div className="flex items-center gap-3">
             {step !== 'success' && (
                <button 
                  onClick={handleNext}
                  disabled={step === 'category' && !selectedCategory}
                  className="mr-2 text-sm font-semibold text-primary disabled:opacity-50 flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
                >
                  {step === 'payment' ? 'Save' : 'Next'} <ChevronRight className="w-4 h-4" />
                </button>
             )}
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-full text-muted-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
           {step === 'category' && renderCategorySelection()}
           
           {step === 'details' && (
             <>
               {selectedCategory === 'machinery' && renderMachineryForm()}
               {selectedCategory === 'input' && renderInputForm()}
               {selectedCategory === 'labor' && renderLabourForm()}
               {(selectedCategory === 'irrigation' || selectedCategory === 'other') && (
                 <div className="text-center py-8 text-muted-foreground">
                   Simple form for {selectedCategory} coming soon. 
                   <br/>Proceed to payment to enter amount.
                 </div>
               )}
             </>
           )}

           {step === 'payment' && renderPaymentForm()}
           
           {step === 'success' && renderSuccess()}
        </div>

        {/* Footer */}
        {step !== 'success' && (
          <div className="p-4 border-t border-border bg-muted/20">
             <button
               onClick={handleNext}
               disabled={step === 'category' && !selectedCategory}
               className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
             >
               {step === 'payment' ? 'Save Expense' : 'Continue'}
               <ChevronRight className="w-5 h-5" />
             </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
