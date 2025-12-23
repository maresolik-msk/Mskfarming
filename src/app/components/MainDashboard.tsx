import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  CheckCircle2, 
  Menu, 
  LayoutDashboard, 
  History, 
  Calculator, 
  User, 
  Sprout, 
  FlaskConical, 
  Satellite, 
  Mic, 
  Camera, 
  Wallet, 
  FileText, 
  LogOut,
  Volume2,
  Calendar,
  Home,
  BookOpen,
  Plus,
  TrendingUp,
  Leaf
} from 'lucide-react';
import { WeeklySummary } from './WeeklySummary';
import { HomeView } from './HomeView';
import { CropDetailView } from './CropDetailView';
import { FieldManagement } from './FieldManagement';
import { SatelliteMonitoring } from './SatelliteMonitoring';
import { VoiceJournalEntry } from './VoiceJournalEntry';
import { PhotoCapture } from './PhotoCapture';
import { ExpenseTracker } from './ExpenseTracker';
import { ExpenseCard } from './ExpenseCard';
import { SoilTestSelection } from './SoilTestSelection';
import { SampleCollectionGuide } from './SampleCollectionGuide';
import { SampleSubmission } from './SampleSubmission';
import { SelfSoilTesting } from './SelfSoilTesting';
import { GuidedSoilTest } from './GuidedSoilTest';
import { SoilHealthSummary } from './SoilHealthSummary';
import { FarmingJournal } from './FarmingJournal';
import { JournalHistory } from './JournalHistory';
import { JournalEntryView } from './JournalEntryView';
import { SeedSelectionModal } from './seed-selection/SeedSelectionModal';
import { DemoHelper } from './DemoHelper';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetClose } from './ui/sheet';
import { toast } from 'sonner';
import { 
  getTasks, 
  createTask, 
  toggleTask as apiToggleTask, 
  deleteTask,
  getExpenses,
  createExpense,
  getJournalEntries,
  createJournalEntry,
  getFields,
  createField,
  updateField,
  deleteField as apiDeleteField,
} from '../../lib/api';

interface MainDashboardProps {
  farmerName: string;
  onLogout: () => void;
}

interface Task {
  id: string;
  text: string;
  time: string;
  completed: boolean;
}

interface JournalEntry {
  id: string;
  text: string;
  timestamp: Date;
  type: 'voice' | 'photo';
}

interface Expense {
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
    safety?: { ppe: boolean; waitingPeriod: number };
  };
}

export function MainDashboard({ farmerName, onLogout }: MainDashboardProps) {
  const [showVoiceJournal, setShowVoiceJournal] = useState(false);
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [showExpenseTracker, setShowExpenseTracker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'journal' | 'expenses' | 'field' | 'market'>('dashboard');

  // Soil Testing State
  const [showSoilTestSelection, setShowSoilTestSelection] = useState(false);
  const [showCollectionGuide, setShowCollectionGuide] = useState(false);
  const [showSampleSubmission, setShowSampleSubmission] = useState(false);
  const [selectedTestType, setSelectedTestType] = useState('');

  // Self Soil Testing State
  const [showSelfSoilTesting, setShowSelfSoilTesting] = useState(false);
  const [showGuidedSoilTest, setShowGuidedSoilTest] = useState(false);
  const [showSeedSelection, setShowSeedSelection] = useState(false);
  const [currentSelfTestType, setCurrentSelfTestType] = useState('');
  const [selfTestResults, setSelfTestResults] = useState<any[]>([]);
  const [showSoilSummary, setShowSoilSummary] = useState(false);

  // Farming Journal State
  const [showFarmingJournal, setShowFarmingJournal] = useState(false);
  const [showJournalHistory, setShowJournalHistory] = useState(false);
  const [showJournalEntry, setShowJournalEntry] = useState(false);
  const [showWeeklySummary, setShowWeeklySummary] = useState(false);
  const [showLogMenu, setShowLogMenu] = useState(false);
  const [showCropDetails, setShowCropDetails] = useState(false);
  
  // Field Monitoring State
  const [showFieldMonitoring, setShowFieldMonitoring] = useState(false);
  
  const [farmingJournalEntries, setFarmingJournalEntries] = useState<any[]>([
    {
      id: '1',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      field: 'field-a',
      crop: 'tomato',
      activities: ['irrigation', 'weeding'],
      observations: ['healthy', 'new-growth'],
      weather: 'sunny',
      waterStatus: { canal: true, borewell: false },
      notes: 'Field looking good. New growth visible.',
      timestamp: new Date(Date.now() - 86400000),
    },
  ]);
  const [selectedJournalEntry, setSelectedJournalEntry] = useState<any>(null);

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Water your field between 5-7 PM (30 min/acre)', time: '⏰ Evening', completed: false },
    { id: '2', text: 'Check plants for whitefly (leaves underside)', time: '⏰ Morning', completed: false },
    { id: '3', text: 'Hot day expected - increase watering by 20%', time: '🌡️ All day', completed: false },
  ]);

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      text: 'Started field preparation. Soil looks good after last rain.',
      timestamp: new Date(Date.now() - 86400000),
      type: 'voice',
    },
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', category: 'seeds', amount: 2000, description: 'Tomato seeds', date: new Date(Date.now() - 86400000 * 5) },
    { id: '2', category: 'fertilizer', amount: 3500, description: 'NPK fertilizer', date: new Date(Date.now() - 86400000 * 3) },
  ]);

  const [budget, setBudget] = useState({
    total: 18000,
    used: 5500,
  });

  // Mock Fields Data
  const availableFields = [
    {
      id: 'f1',
      name: 'North Field',
      crop: 'Tomato',
      day: 42,
      totalDays: 120,
      progress: 35,
    },
    {
      id: 'f2',
      name: 'South Field',
      crop: 'Wheat',
      day: 15,
      totalDays: 140,
      progress: 10,
    },
    {
      id: 'f3',
      name: 'East Garden',
      crop: 'Chili',
      day: 75,
      totalDays: 100,
      progress: 75,
    }
  ];

  const [selectedFieldId, setSelectedFieldId] = useState('f1');
  const [showFieldSelector, setShowFieldSelector] = useState(false);

  // We can remove showMenu state as we use Sheet now, but let's keep it if used elsewhere or just ignore it.
  // Actually, I'll remove it from usage in the render.

  const currentField = availableFields.find(f => f.id === selectedFieldId) || availableFields[0];

  const cropInfo = {
    name: currentField.crop,
    field: currentField.name,
    day: currentField.day,
    totalDays: currentField.totalDays,
    progress: currentField.progress,
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const newCompleted = !task.completed;
    
    // Optimistically update UI
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: newCompleted } : t
    ));
    
    try {
      await apiToggleTask(id, newCompleted);
      toast.success('Task updated');
    } catch (error) {
      // Revert on error
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, completed: task.completed } : t
      ));
      toast.error('Failed to update task');
    }
  };

  const playGuidance = () => {
    toast.success('Playing today\'s guidance...');
  };

  const handleVoiceJournalSave = (entry: any) => {
    setJournalEntries([
      {
        id: Date.now().toString(),
        text: entry.text,
        timestamp: entry.timestamp,
        type: 'voice',
      },
      ...journalEntries,
    ]);
  };

  const handlePhotoSave = (photo: any) => {
    setJournalEntries([
      {
        id: Date.now().toString(),
        text: `Photo: ${photo.category} - ${photo.notes || 'No notes'}`,
        timestamp: photo.timestamp,
        type: 'photo',
      },
      ...journalEntries,
    ]);
  };

  const handleExpenseSave = (expense: any) => {
    const newExpense = {
      id: Date.now().toString(),
      ...expense,
    };
    
    setExpenses([newExpense, ...expenses]);
    
    // Update budget with new expense
    setBudget({
      ...budget,
      used: budget.used + expense.amount,
    });
  };

  // Soil Testing Handlers
  const handleTestSoil = () => {
    setShowSoilTestSelection(true);
  };

  const handleSelectTest = (testId: string) => {
    setSelectedTestType(testId);
    setShowSoilTestSelection(false);
    setShowCollectionGuide(true);
  };

  const handleCollectionComplete = () => {
    setShowCollectionGuide(false);
    setShowSampleSubmission(true);
  };

  const handleSampleSubmit = (method: string, details: any) => {
    setShowSampleSubmission(false);
    toast.success(`Sample pickup booked! Tracking ID: ST${Date.now().toString().slice(-6)}`);
    // In production, save to state/database
  };

  // Self Soil Testing Handlers
  const handleStartSelfTest = () => {
    setShowSoilTestSelection(false);
    setShowSelfSoilTesting(true);
  };

  const handleSelectSelfTest = (testType: string) => {
    if (testType === 'complete') {
      // Start with texture test for complete flow
      setCurrentSelfTestType('texture');
    } else {
      setCurrentSelfTestType(testType);
    }
    setShowSelfSoilTesting(false);
    setShowGuidedSoilTest(true);
  };

  const handleSelfTestComplete = (result: any) => {
    setSelfTestResults([...selfTestResults, result]);
    setShowGuidedSoilTest(false);
    setShowSoilSummary(true);
  };

  const handleSaveSoilProfile = () => {
    setShowSoilSummary(false);
    toast.success('Soil profile saved! You can view it anytime in your dashboard.');
    // In production, save to database
  };

  // Farming Journal Handlers
  const handleFarmingJournalSave = (entry: any) => {
    setFarmingJournalEntries([entry, ...farmingJournalEntries]);
    setShowFarmingJournal(false);
    toast.success('Journal entry saved!');
  };

  const handleViewJournalEntry = (entry: any) => {
    setSelectedJournalEntry(entry);
    setShowJournalHistory(false);
    setShowJournalEntry(true);
  };

  const handleViewWeeklySummary = () => {
    setShowJournalHistory(false);
    setShowWeeklySummary(true);
  };

  useEffect(() => {
    // Fetch tasks from API
    getTasks()
      .then(data => {
        if (data && Array.isArray(data)) {
          setTasks(data);
        }
      })
      .catch(err => {
        console.error('Failed to load tasks:', err);
        // Keep default tasks on error
      });
  }, []);

  useEffect(() => {
    // Fetch expenses from API and calculate budget
    getExpenses()
      .then(data => {
        if (data && Array.isArray(data)) {
          setExpenses(data);
          // Calculate total used from all expenses
          const totalUsed = data.reduce((sum, exp) => sum + (exp.amount || 0), 0);
          setBudget(prev => ({ ...prev, used: totalUsed }));
        }
      })
      .catch(err => {
        console.error('Failed to load expenses:', err);
        // Keep default expenses on error
      });
  }, []);

  useEffect(() => {
    // Fetch journal entries from API
    getJournalEntries()
      .then(data => {
        if (data && Array.isArray(data)) {
          setJournalEntries(data);
        }
      })
      .catch(err => {
        console.error('Failed to load journal entries:', err);
        // Keep default journal entries on error
      });
  }, []);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3">
          {/* Header Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-xl shrink-0 text-white shadow-lg border border-white/10">
                  🌾
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Active Field</div>
                <div className="relative group">
                  <button 
                    onClick={() => setShowFieldSelector(!showFieldSelector)}
                    className="flex items-center gap-2 text-foreground font-bold text-lg hover:text-primary transition-colors"
                  >
                    {currentField.name}
                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                       <ChevronDown className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </button>
                  
                  {/* Premium Field Selector Dropdown */}
                  <AnimatePresence>
                  {showFieldSelector && (
                    <>
                    <div 
                      className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[1px]"
                      onClick={() => setShowFieldSelector(false)} 
                    />
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-3 w-64 bg-card/95 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-2xl shadow-2xl z-50 overflow-hidden ring-1 ring-black/5 p-1"
                    >
                      {availableFields.map(field => (
                        <button
                          key={field.id}
                          onClick={() => {
                            setSelectedFieldId(field.id);
                            setShowFieldSelector(false);
                            toast.success(`Switched to ${field.name}`);
                          }}
                          className={`w-full text-left px-4 py-3.5 rounded-xl transition-all mb-1 flex items-center justify-between group ${
                            selectedFieldId === field.id 
                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                                : 'hover:bg-muted/80 text-foreground'
                          }`}
                        >
                          <div>
                              <div className={`font-bold text-sm ${selectedFieldId === field.id ? 'text-white' : 'text-foreground'}`}>{field.name}</div>
                              <div className={`text-xs ${selectedFieldId === field.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{field.crop} • Day {field.day}</div>
                          </div>
                          {selectedFieldId === field.id && (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                    </>
                  )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
      
              
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    className="w-10 h-10 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-muted hover:border-border transition-all flex items-center justify-center text-muted-foreground hover:text-foreground shadow-sm"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[350px] border-l border-white/10 bg-card/95 backdrop-blur-xl overflow-y-auto">
                  <SheetHeader className="mb-8">
                    <SheetTitle className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-2xl text-white shadow-xl shadow-primary/25">
                         🌾
                      </div>
                      <span className="text-2xl font-bold">Menu</span>
                    </SheetTitle>
                    <SheetDescription className="hidden">
                      Access dashboard navigation and quick actions
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="flex flex-col gap-2 pb-8">
                    <div className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-[0.15em] mb-4 px-3">
                      Navigation
                    </div>
                    
                    <SheetClose asChild>
                      <button 
                        onClick={() => setActiveView('dashboard')}
                        className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${activeView === 'dashboard' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'hover:bg-muted/60 text-foreground hover:scale-[1.02]'}`}
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-semibold text-[15px]">Home Dashboard</span>
                        {activeView === 'dashboard' && <div className="w-2 h-2 rounded-full bg-white ml-auto shadow-sm" />}
                      </button>
                    </SheetClose>

                    <SheetClose asChild>
                      <button 
                        onClick={() => setShowJournalHistory(true)}
                        className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-muted/60 text-foreground transition-all duration-300 group hover:scale-[1.02]"
                      >
                        <History className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <span className="font-medium text-[15px]">Journal History</span>
                      </button>
                    </SheetClose>

                    <SheetClose asChild>
                      <button 
                        onClick={() => setActiveView('expenses')}
                        className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${activeView === 'expenses' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'hover:bg-muted/60 text-foreground hover:scale-[1.02]'}`}
                      >
                        <Calculator className="w-5 h-5" />
                        <span className="font-semibold text-[15px]">Budget & Expenses</span>
                        {activeView === 'expenses' && <div className="w-2 h-2 rounded-full bg-white ml-auto shadow-sm" />}
                      </button>
                    </SheetClose>

                    <SheetClose asChild>
                      <button 
                        onClick={() => setActiveView('profile')}
                        className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${activeView === 'profile' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'hover:bg-muted/60 text-foreground hover:scale-[1.02]'}`}
                      >
                        <User className="w-5 h-5" />
                        <span className="font-semibold text-[15px]">My Profile</span>
                        {activeView === 'profile' && <div className="w-2 h-2 rounded-full bg-white ml-auto shadow-sm" />}
                      </button>
                    </SheetClose>

                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-6" />
                    
                    <div className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-[0.15em] mb-4 px-3">
                      Farming Tools
                    </div>

                    <SheetClose asChild>
                      <button 
                        onClick={() => setShowSeedSelection(true)}
                        className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-muted/60 text-foreground transition-all duration-300 group hover:scale-[1.02]"
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500/20 transition-all duration-300 group-hover:scale-110">
                           <Sprout className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-[15px]">Smart Seed Selection</span>
                      </button>
                    </SheetClose>

                    <SheetClose asChild>
                      <button 
                          onClick={() => setShowSoilTestSelection(true)}
                          className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-muted/60 text-foreground transition-all duration-300 group hover:scale-[1.02]"
                      >
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-600 flex items-center justify-center group-hover:bg-amber-500/20 transition-all duration-300 group-hover:scale-110">
                            <FlaskConical className="w-5 h-5" />
                          </div>
                          <span className="font-medium text-[15px]">Schedule Soil Test</span>
                      </button>
                    </SheetClose>

                    <SheetClose asChild>
                      <button 
                          onClick={() => setShowFieldMonitoring(true)}
                          className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-muted/60 text-foreground transition-all duration-300 group hover:scale-[1.02]"
                      >
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:bg-blue-500/20 transition-all duration-300 group-hover:scale-110">
                            <Satellite className="w-5 h-5" />
                          </div>
                          <span className="font-medium text-[15px]">Satellite Monitoring</span>
                      </button>
                    </SheetClose>

                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-6" />

                    <div className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-[0.15em] mb-4 px-3">
                      Quick Actions
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <SheetClose asChild>
                          <button 
                            onClick={() => setShowVoiceJournal(true)}
                            className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-card/40 hover:bg-card/80 border border-border/40 text-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                              <Mic className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium">Voice Note</span>
                          </button>
                        </SheetClose>

                        <SheetClose asChild>
                          <button 
                            onClick={() => setShowPhotoCapture(true)}
                            className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-card/40 hover:bg-card/80 border border-border/40 text-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                              <Camera className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium">Take Photo</span>
                          </button>
                        </SheetClose>

                        <SheetClose asChild>
                          <button 
                            onClick={() => setShowExpenseTracker(true)}
                            className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-card/40 hover:bg-card/80 border border-border/40 text-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                              <Wallet className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium">Add Expense</span>
                          </button>
                        </SheetClose>

                        <SheetClose asChild>
                          <button 
                            onClick={() => setShowFarmingJournal(true)}
                            className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-card/40 hover:bg-card/80 border border-border/40 text-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                              <FileText className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium">Daily Log</span>
                          </button>
                        </SheetClose>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-8" />

                    <SheetClose asChild>
                      <button 
                        onClick={onLogout}
                        className="flex items-center justify-center gap-3 px-5 py-4 rounded-2xl bg-red-500/5 hover:bg-red-500/10 text-red-600 transition-all duration-300 border border-red-500/20 hover:border-red-500/40 group hover:scale-[1.02]"
                      >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-semibold text-[15px]">Log Out</span>
                      </button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Quick Stats - Glassmorphic Cards */}
          <div className="mt-2 grid grid-cols-3 gap-3">
            <div className="bg-card/40 backdrop-blur-sm border border-white/10 dark:border-white/5 rounded-2xl p-3 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-2 opacity-5">
                  <Sprout className="w-12 h-12" />
               </div>
               <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Current Crop</div>
               <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{cropInfo.name}</div>
            </div>
            
            <div className="bg-card/40 backdrop-blur-sm border border-white/10 dark:border-white/5 rounded-2xl p-3 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-5">
                  <Calendar className="w-12 h-12" />
               </div>
               <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Growth Stage</div>
               <div className="text-sm font-bold text-foreground">Day {cropInfo.day}</div>
            </div>

            <div className="bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-3 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-10">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600" />
               </div>
               <div className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-wider mb-1">Status</div>
               <div className="text-sm font-bold text-emerald-700">Healthy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Dropdown - REMOVED since we use Sheet now */}
      
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 pb-32">
        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <HomeView 
            farmerName={farmerName}
            cropInfo={cropInfo}
            tasks={tasks}
            budget={budget}
            onToggleTask={toggleTask}
            onAction={(action) => {
              if (action === 'voice') setShowVoiceJournal(true);
              if (action === 'photo') setShowPhotoCapture(true);
              if (action === 'expense') setShowExpenseTracker(true);
              if (action === 'journal') setShowFarmingJournal(true);
              if (action === 'guidance') playGuidance();
              if (action === 'soil-test') setShowSoilTestSelection(true);
              if (action === 'seed-selection') setShowSeedSelection(true);
              if (action === 'crop-details') setShowCropDetails(true);
            }}
          />
        )}

        {/* Budget/Expenses View */}
        {activeView === 'expenses' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/40 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border border-white/10 dark:border-white/5 shadow-2xl min-h-[80vh] ring-1 ring-black/5"
          >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-6 tracking-tight">Budget & Expenses</h2>
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-[2rem] p-6 border border-primary/20 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-10">
                      <Wallet className="w-32 h-32 text-primary" />
                   </div>
                   <div className="relative z-10">
                       <div className="flex justify-between items-end mb-4">
                         <div>
                           <p className="text-sm font-bold text-primary/80 uppercase tracking-widest mb-1">Total Spent</p>
                           <h3 className="text-4xl font-bold text-foreground tracking-tight">₹{budget.used.toLocaleString()}</h3>
                         </div>
                         <div className="text-right">
                           <p className="text-xs font-medium text-muted-foreground mb-1">Total Budget</p>
                           <div className="px-3 py-1 rounded-full bg-background/50 border border-primary/10 text-sm font-bold">
                             ₹{budget.total.toLocaleString()}
                           </div>
                         </div>
                       </div>
                       <div className="h-4 bg-background/50 rounded-full overflow-hidden p-1 box-content ring-1 ring-white/20">
                         <div 
                           className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-primary/20 relative" 
                           style={{ width: `${Math.min((budget.used / budget.total) * 100, 100)}%` }} 
                         >
                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                         </div>
                       </div>
                       <div className="mt-3 flex justify-between text-xs font-medium text-muted-foreground">
                          <span>0%</span>
                          <span>{Math.round((budget.used / budget.total) * 100)}% Used</span>
                       </div>
                   </div>
                </div>
              </div>

              <button
                onClick={() => setShowExpenseTracker(true)}
                className="w-full mb-10 py-5 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-2xl hover:opacity-95 transition-all flex items-center justify-center gap-3 font-bold text-lg shadow-xl shadow-primary/25 active:scale-[0.99] ring-offset-2 focus:ring-2 ring-primary group"
              >
                <div className="p-1 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                    <Plus className="w-5 h-5 stroke-[3]" />
                </div>
                Record New Expense
              </button>
              
              <div className="space-y-8">
                {expenses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-muted/20 rounded-[2rem] border border-dashed border-border/50">
                    <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4 text-4xl shadow-inner">💰</div>
                    <p className="font-medium text-lg">No expenses recorded yet</p>
                    <p className="text-sm opacity-60">Tap the button above to start tracking</p>
                  </div>
                ) : (
                  Object.entries(
                    expenses.reduce((groups, expense) => {
                      const date = new Date(expense.date);
                      const today = new Date();
                      const yesterday = new Date();
                      yesterday.setDate(yesterday.getDate() - 1);

                      let dateLabel = date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
                      
                      if (date.toDateString() === today.toDateString()) dateLabel = 'Today';
                      else if (date.toDateString() === yesterday.toDateString()) dateLabel = 'Yesterday';

                      if (!groups[dateLabel]) groups[dateLabel] = [];
                      groups[dateLabel].push(expense);
                      return groups;
                    }, {} as Record<string, typeof expenses>)
                  )
                  .sort((a, b) => {
                     // Sort logic remains same: compare first items of each group
                     return new Date(b[1][0].date).getTime() - new Date(a[1][0].date).getTime();
                  })
                  .map(([dateLabel, groupExpenses]) => (
                    <div key={dateLabel}>
                      <div className="flex items-center gap-4 mb-4">
                          <h3 className="text-xs font-bold text-muted-foreground/70 uppercase tracking-[0.2em] ml-1">{dateLabel}</h3>
                          <div className="h-px flex-1 bg-gradient-to-r from-border/50 to-transparent" />
                      </div>
                      <div className="space-y-3">
                        {groupExpenses.map(expense => (
                          <div key={expense.id} className="transform transition-all hover:scale-[1.01]">
                             <ExpenseCard expense={expense} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
          </motion.div>
        )}

        {/* Profile View */}
        {activeView === 'profile' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/40 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border border-white/10 dark:border-white/5 shadow-2xl min-h-[80vh] ring-1 ring-black/5"
          >
            <h2 className="text-3xl font-bold text-foreground mb-8 tracking-tight">My Profile</h2>
              
            {/* Profile Info */}
            <div className="relative mb-10 group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-indigo-500/20 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative flex items-center gap-6 p-6 bg-background/60 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-lg transition-transform group-hover:-translate-y-1">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-4xl shadow-xl shadow-primary/20 ring-4 ring-background">
                  🌾
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">{farmerName}</h3>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                    Premium Member
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Options */}
            <div className="space-y-6">
                <div>
                    <h3 className="text-xs font-bold text-muted-foreground/70 uppercase tracking-[0.2em] mb-4 ml-2">Preferences</h3>
                    <div className="space-y-3">
                        <button className="w-full flex items-center justify-between p-5 bg-card/50 hover:bg-card/80 backdrop-blur-sm border border-border/40 rounded-2xl transition-all hover:shadow-md group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Volume2 className="w-5 h-5" />
                                </div>
                                <span className="font-semibold text-foreground">Language</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <span className="text-sm font-medium">English</span>
                                <ChevronDown className="w-4 h-4 -rotate-90 opacity-50" />
                            </div>
                        </button>
                        <button className="w-full flex items-center justify-between p-5 bg-card/50 hover:bg-card/80 backdrop-blur-sm border border-border/40 rounded-2xl transition-all hover:shadow-md group">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <span className="font-semibold text-foreground">Notifications</span>
                            </div>
                             <div className="flex items-center gap-2 text-muted-foreground">
                                <span className="text-sm font-medium">On</span>
                                <ChevronDown className="w-4 h-4 -rotate-90 opacity-50" />
                            </div>
                        </button>
                    </div>
                </div>

                <div>
                     <h3 className="text-xs font-bold text-muted-foreground/70 uppercase tracking-[0.2em] mb-4 ml-2">Account</h3>
                     <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-3 p-5 bg-red-500/5 hover:bg-red-500/10 text-red-600 rounded-2xl transition-all border border-red-500/10 hover:border-red-500/30 group"
                        >
                        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-bold">Log Out</span>
                    </button>
                </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      {showVoiceJournal && (
        <VoiceJournalEntry
          onSave={handleVoiceJournalSave}
          onClose={() => setShowVoiceJournal(false)}
        />
      )}
      {showPhotoCapture && (
        <PhotoCapture
          onSave={handlePhotoSave}
          onClose={() => setShowPhotoCapture(false)}
        />
      )}
      {showExpenseTracker && (
        <ExpenseTracker
          onSave={handleExpenseSave}
          onClose={() => setShowExpenseTracker(false)}
          currentBudget={budget}
          recentLabourTypes={Array.from(new Set(
            expenses
              .filter(e => e.category === 'labor' && e.labourDetails?.workType)
              .map(e => e.labourDetails!.workType)
          ))}
        />
      )}

      {/* Soil Testing Modals */}
      {showSoilTestSelection && (
        <SoilTestSelection
          onClose={() => setShowSoilTestSelection(false)}
          onSelectTest={handleSelectTest}
          onStartSelfTest={handleStartSelfTest}
        />
      )}
      {showCollectionGuide && (
        <SampleCollectionGuide
          onClose={() => setShowCollectionGuide(false)}
          onComplete={handleCollectionComplete}
          testType={selectedTestType}
        />
      )}
      {showSampleSubmission && (
        <SampleSubmission
          onClose={() => setShowSampleSubmission(false)}
          onSubmit={handleSampleSubmit}
          testType={selectedTestType}
        />
      )}

      {/* Self Soil Testing Modals */}
      {showSelfSoilTesting && (
        <SelfSoilTesting
          onClose={() => setShowSelfSoilTesting(false)}
          onSelectTest={handleSelectSelfTest}
        />
      )}
      {showGuidedSoilTest && (
        <GuidedSoilTest
          testType={currentSelfTestType}
          onClose={() => setShowGuidedSoilTest(false)}
          onComplete={handleSelfTestComplete}
        />
      )}
      {showSoilSummary && selfTestResults.length > 0 && (
        <SoilHealthSummary
          testResults={selfTestResults[selfTestResults.length - 1]}
          onClose={() => setShowSoilSummary(false)}
          onSaveProfile={handleSaveSoilProfile}
        />
      )}

      {/* Farming Journal Modals */}
      {showFarmingJournal && (
        <FarmingJournal
          onClose={() => setShowFarmingJournal(false)}
          onSave={handleFarmingJournalSave}
        />
      )}
      {showJournalHistory && (
        <JournalHistory
          entries={farmingJournalEntries}
          onClose={() => setShowJournalHistory(false)}
          onViewEntry={handleViewJournalEntry}
          onViewWeeklySummary={handleViewWeeklySummary}
        />
      )}
      {showJournalEntry && selectedJournalEntry && (
        <JournalEntryView
          entry={selectedJournalEntry}
          onClose={() => {
            setShowJournalEntry(false);
            setSelectedJournalEntry(null);
          }}
        />
      )}
      {showWeeklySummary && (
        <WeeklySummary
          entries={farmingJournalEntries}
          onClose={() => setShowWeeklySummary(false)}
        />
      )}

      {/* Seed Selection Modal */}
      {showSeedSelection && (
        <SeedSelectionModal 
          onClose={() => setShowSeedSelection(false)}
          fieldId={selectedFieldId}
          fieldName={currentField.name}
          soilType="Clay Loam" // In production this would come from the field's soil test data
        />
      )}

      {/* Crop Detail View */}
      {showCropDetails && (
        <CropDetailView
          cropInfo={cropInfo}
          onBack={() => setShowCropDetails(false)}
        />
      )}

      {/* Satellite Monitoring */}
      {showFieldMonitoring && (
        <SatelliteMonitoring
          onClose={() => setShowFieldMonitoring(false)}
        />
      )}

      {/* Demo Helper */}
      <DemoHelper />

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="max-w-4xl mx-auto px-4 py-2">
          <div className="grid grid-cols-5 gap-1 items-end">
            {/* Home */}
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all ${
                activeView === 'dashboard'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px]">Home</span>
            </button>

            {/* Journal History */}
            <button
              onClick={() => setShowJournalHistory(true)}
              className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-muted-foreground hover:bg-muted transition-all"
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-[10px]">History</span>
            </button>

            {/* Add Entry (Central FAB-like) */}
            <div className="relative -top-5">
              
              {/* Log Menu Popup */}
              <AnimatePresence>
                {showLogMenu && (
                  <>
                    <div 
                      className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-40" 
                      onClick={() => setShowLogMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-64 bg-card/95 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-2xl rounded-2xl p-2 flex flex-col gap-1 z-50 ring-1 ring-black/5 dark:ring-white/10"
                    >
                       <div className="px-2 py-2 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest text-center">
                         Select one
                       </div>
                       
                       <button
                         onClick={() => {
                           setShowFarmingJournal(true);
                           setShowLogMenu(false);
                         }}
                         className="flex items-center gap-4 p-3 text-left hover:bg-muted/50 rounded-xl transition-all group relative overflow-hidden"
                       >
                         <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                         <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 text-white flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:scale-105 transition-transform duration-300">
                           <FileText className="w-6 h-6" />
                         </div>
                         <div className="relative flex-1">
                           <div className="font-bold text-sm text-foreground group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">Farming Journal</div>
                           <div className="text-[11px] text-muted-foreground font-medium">Log daily activities</div>
                         </div>
                       </button>
                       
                       <button
                         onClick={() => {
                           setShowExpenseTracker(true);
                           setShowLogMenu(false);
                         }}
                         className="flex items-center gap-4 p-3 text-left hover:bg-muted/50 rounded-xl transition-all group relative overflow-hidden"
                       >
                         <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                         <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                           <Wallet className="w-6 h-6" />
                         </div>
                         <div className="relative flex-1">
                           <div className="font-bold text-sm text-foreground group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">Add Expenses</div>
                           <div className="text-[11px] text-muted-foreground font-medium">Track costs & bills</div>
                         </div>
                       </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              <button
                onClick={() => setShowLogMenu(!showLogMenu)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border-4 border-background z-50 relative ${
                  showLogMenu 
                    ? 'bg-muted text-foreground rotate-45' 
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95'
                }`}
              >
                <Plus className="w-7 h-7" />
              </button>
              <div className="text-[10px] text-center mt-1 text-muted-foreground font-medium"></div>
            </div>

            {/* Budget */}
            <button
              onClick={() => setActiveView('expenses')}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all ${
                activeView === 'expenses'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="text-[10px]">Budget</span>
            </button>

            {/* Profile */}
            <button
              onClick={() => setActiveView('profile')}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all ${
                activeView === 'profile'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px]">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}