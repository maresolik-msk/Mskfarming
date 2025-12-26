import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
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
import { FieldManagement, AddEditFieldForm } from './FieldManagement';
import { SatelliteMonitoring } from './SatelliteMonitoring';
import { VoiceJournalEntry } from './VoiceJournalEntry';
import { PhotoCapture } from './PhotoCapture';
import { ExpenseTracker } from './ExpenseTracker';
import { ExpenseCard } from './ExpenseCard';
import { BudgetOverview } from './BudgetOverview';
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
import { MSChatbot } from './MSChatbot';
import { UserProfile } from './UserProfile';
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
  getUserProfile,
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
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [showEditFieldModal, setShowEditFieldModal] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState<any>(null);
  const [showQuickAddMenu, setShowQuickAddMenu] = useState(false);
  
  // Tour State
  const [runTour, setRunTour] = useState(false);
  
  const [farmingJournalEntries, setFarmingJournalEntries] = useState<any[]>([]);
  const [selectedJournalEntry, setSelectedJournalEntry] = useState<any>(null);

  const [tasks, setTasks] = useState<Task[]>([]);

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [budget, setBudget] = useState({
    total: 18000,
    used: 0,
  });
  
  const [userProfile, setUserProfile] = useState<any>(null);

  // Load User Profile
  useEffect(() => {
    getUserProfile().then(profile => {
      if (profile) setUserProfile(profile);
    });
  }, []);

  // Fields State (loaded from localStorage)
  const [availableFields, setAvailableFields] = useState<any[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [showFieldSelector, setShowFieldSelector] = useState(false);

  // Load fields from localStorage
  const loadFields = async () => {
    try {
      const fields = await getFields();
      setAvailableFields(fields);
      
      if (fields.length > 0) {
        if (!selectedFieldId) {
          setSelectedFieldId(fields[0].id);
        }
      } else {
        setSelectedFieldId(null);
      }
    } catch (error) {
      console.error('Error loading fields:', error);
      toast.error('Failed to load fields');
    }
  };

  // Load fields on mount
  useEffect(() => {
    loadFields();
    
    // Check if we should run the tour
    const shouldRunTour = localStorage.getItem('showDashboardTour');
    if (shouldRunTour === 'true') {
      // Small delay to ensure everything is rendered
      setTimeout(() => {
        setRunTour(true);
        localStorage.removeItem('showDashboardTour');
      }, 1000);
    }
  }, []);

  const currentField = availableFields.find(f => f.id === selectedFieldId) || availableFields[0];

  const day = currentField?.day ? Number(currentField.day) : 0;
  const totalDays = currentField?.totalDays ? Number(currentField.totalDays) : 120;
  const progress = currentField?.progress 
    ? Number(currentField.progress) 
    : (totalDays > 0 ? Math.floor((day / totalDays) * 100) : 0);

  const cropInfo = currentField ? {
    name: currentField.crop,
    field: currentField.name,
    day: day,
    totalDays: totalDays,
    progress: isNaN(progress) ? 0 : progress,
    boundary: currentField.boundary,
    soilType: currentField.soilType,
  } : {
    name: '',
    field: 'No Field Selected',
    day: 0,
    totalDays: 120,
    progress: 0,
    boundary: null,
    soilType: '',
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

  const handleVoiceJournalSave = async (entry: any) => {
    const newEntry = {
      text: entry.text,
      timestamp: entry.timestamp,
      type: 'voice',
    };
    
    // Optimistic update
    const tempEntry = { ...newEntry, id: Date.now().toString() };
    setJournalEntries([tempEntry, ...journalEntries]);

    try {
      await createJournalEntry(newEntry);
      toast.success('Voice journal saved');
    } catch (error) {
      console.error('Failed to save journal:', error);
      toast.error('Failed to save to cloud');
    }
  };

  const handlePhotoSave = async (photo: any) => {
    const newEntry = {
      text: `Photo: ${photo.category} - ${photo.notes || 'No notes'}`,
      timestamp: photo.timestamp,
      type: 'photo',
    };
    
    // Optimistic update
    const tempEntry = { ...newEntry, id: Date.now().toString() };
    setJournalEntries([tempEntry, ...journalEntries]);
    
    try {
      await createJournalEntry(newEntry);
      toast.success('Photo saved to journal');
    } catch (error) {
      console.error('Failed to save photo journal:', error);
      toast.error('Failed to save to cloud');
    }
  };

  const handleExpenseSave = async (expense: any) => {
    // Optimistic update
    const tempExpense = {
      id: Date.now().toString(),
      ...expense,
    };
    
    setExpenses([tempExpense, ...expenses]);
    
    // Update budget with new expense
    setBudget({
      ...budget,
      used: budget.used + expense.amount,
    });
    
    try {
      await createExpense(expense);
      toast.success('Expense saved');
    } catch (error) {
      console.error('Failed to save expense:', error);
      toast.error('Failed to save to cloud');
    }
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
  const handleFarmingJournalSave = async (entry: any) => {
    setFarmingJournalEntries([entry, ...farmingJournalEntries]);
    setShowFarmingJournal(false);
    
    try {
      await createJournalEntry({
        text: entry.activities ? `Activities: ${entry.activities.join(', ')}` : 'Daily Log',
        timestamp: new Date(),
        type: 'log',
        details: entry
      });
      toast.success('Journal entry saved!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save to cloud');
    }
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

  // Tour Steps
  const tourSteps: Step[] = [
    {
      target: 'body',
      content: (
        <div className="text-left">
          <h3 className="font-bold text-lg mb-2">Welcome to your Farm Dashboard! 🌱</h3>
          <p>Let's take a quick tour to help you get started.</p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '#tour-field-selector',
      content: (
        <div className="text-left">
          <h3 className="font-bold mb-1">Manage Your Fields</h3>
          <p>Click here to switch between fields or add a new field to your farm.</p>
        </div>
      ),
    },
    {
      target: '#tour-menu-button',
      content: (
        <div className="text-left">
          <h3 className="font-bold mb-1">More Features</h3>
          <p>Access your Profile, Expenses, and Market Prices here.</p>
        </div>
      ),
    }
  ];

  const handleTourCallback = (data: CallBackProps) => {
    const { status } = data;
    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      setRunTour(false);
    }
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
    <div className="min-h-screen bg-background pb-24 p-[0px]">
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showSkipButton
        showProgress
        callback={handleTourCallback}
        styles={{
          options: {
            primaryColor: '#1F3D2B',
            zIndex: 1000,
          },
          tooltipContainer: {
            textAlign: 'left',
          },
          buttonNext: {
            backgroundColor: '#1F3D2B',
          },
          buttonBack: {
            color: '#1F3D2B',
          }
        }}
      />

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
                    id="tour-field-selector"
                    onClick={() => setShowFieldSelector(!showFieldSelector)}
                    className="flex items-center gap-2 text-foreground font-bold text-lg hover:text-primary transition-colors"
                  >
                    {currentField?.name || 'Select Field'}
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
                        <div
                          key={field.id}
                          className={`w-full px-4 py-3.5 rounded-xl transition-all mb-1 flex items-center justify-between group ${
                            selectedFieldId === field.id 
                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                                : 'hover:bg-muted/80 text-foreground'
                          }`}
                        >
                          <button
                            onClick={() => {
                              setSelectedFieldId(field.id);
                              setShowFieldSelector(false);
                              toast.success(`Switched to ${field.name}`);
                            }}
                            className="flex-1 text-left flex items-center justify-between"
                          >
                            <div>
                                <div className={`font-bold text-sm ${selectedFieldId === field.id ? 'text-white' : 'text-foreground'}`}>{field.name}</div>
                                <div className={`text-xs ${selectedFieldId === field.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{field.crop} • Day {field.day}</div>
                            </div>
                            {selectedFieldId === field.id && (
                                <CheckCircle2 className="w-4 h-4 text-white" />
                            )}
                          </button>
                          
                          {/* Edit and Delete Actions */}
                          <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setFieldToEdit(field);
                                setShowEditFieldModal(true);
                                setShowFieldSelector(false);
                              }}
                              className={`p-1.5 rounded-lg transition-colors ${
                                selectedFieldId === field.id
                                  ? 'hover:bg-white/20 text-white'
                                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                              }`}
                              title="Edit field"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (confirm(`Delete "${field.name}"? This cannot be undone.`)) {
                                  try {
                                    await apiDeleteField(field.id);
                                    if (selectedFieldId === field.id) {
                                      const remainingFields = availableFields.filter(f => f.id !== field.id);
                                      if (remainingFields.length > 0) {
                                        setSelectedFieldId(remainingFields[0].id);
                                      } else {
                                        setSelectedFieldId(null);
                                      }
                                    }
                                    await loadFields();
                                    toast.success('Field deleted');
                                  } catch (error) {
                                    toast.error('Failed to delete field');
                                  }
                                }
                              }}
                              className={`p-1.5 rounded-lg transition-colors ${
                                selectedFieldId === field.id
                                  ? 'hover:bg-white/20 text-white'
                                  : 'hover:bg-destructive/10 text-muted-foreground hover:text-destructive'
                              }`}
                              title="Delete field"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {/* Add New Field Button */}
                      <div className="border-t border-white/10 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setShowAddFieldModal(true);
                            setShowFieldSelector(false);
                          }}
                          className="w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-2 hover:bg-primary/10 text-primary group"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="font-medium text-sm">Add New Field</span>
                        </button>
                      </div>
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
                    id="tour-menu-button"
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
                        className={`flex items-center gap-4 px-5 py-4 rounded-0px transition-all duration-300 group ${activeView === 'dashboard' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'hover:bg-muted/60 text-foreground hover:scale-[1.02]'}`}
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
                        onClick={() => setActiveView('market')}
                        className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${activeView === 'market' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'hover:bg-muted/60 text-foreground hover:scale-[1.02]'}`}
                      >
                        <TrendingUp className="w-5 h-5" />
                        <span className="font-semibold text-[15px]">Market Prices</span>
                        {activeView === 'market' && <div className="w-2 h-2 rounded-full bg-white ml-auto shadow-sm" />}
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
                        <Sprout className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <span className="font-medium text-[15px]">Seed Selection</span>
                      </button>
                    </SheetClose>

                    <SheetClose asChild>
                      <button 
                        onClick={handleTestSoil}
                        className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-muted/60 text-foreground transition-all duration-300 group hover:scale-[1.02]"
                      >
                        <FlaskConical className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <span className="font-medium text-[15px]">Soil Health</span>
                      </button>
                    </SheetClose>

                    <SheetClose asChild>
                      <button 
                        onClick={() => setShowFieldMonitoring(true)}
                        className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-muted/60 text-foreground transition-all duration-300 group hover:scale-[1.02]"
                      >
                        <Satellite className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <span className="font-medium text-[15px]">Satellite View</span>
                      </button>
                    </SheetClose>
                    
                    <div className="mt-auto pt-8">
                      <SheetClose asChild>
                        <button 
                          onClick={onLogout}
                          className="flex items-center gap-2 px-5 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </SheetClose>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        {activeView === 'dashboard' ? (
          <>
            {availableFields.length === 0 ? (
              <div className="text-center py-10 animate-in fade-in slide-in-from-bottom-4">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Sprout className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Welcome to Your Farm! 🌱</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Get started by adding your first field. You can track crops, monitor expenses, and get AI insights.
                </p>
                <button
                  onClick={() => setShowAddFieldModal(true)}
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-6 h-6" />
                  Add Your First Field
                </button>
              </div>
            ) : (
              <>
                {/* Field Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <HomeView 
                    farmerName={userProfile?.name || farmerName}
                    cropInfo={cropInfo}
                    tasks={tasks}
                    budget={budget}
                    onToggleTask={toggleTask}
                    onAction={(action) => {
                      switch(action) {
                        case 'voice': setShowVoiceJournal(true); break;
                        case 'photo': setShowPhotoCapture(true); break;
                        case 'expense': setShowExpenseTracker(true); break;
                        case 'journal': setShowFarmingJournal(true); break;
                        case 'guidance': playGuidance(); break;
                        case 'soil-test': handleTestSoil(); break;
                        case 'seed-selection': setShowSeedSelection(true); break;
                        case 'crop-details': setShowCropDetails(true); break;
                      }
                    }}
                  />
                  
                  {/* Daily Tasks */}
                  <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h3 className="font-bold text-foreground">Today's Tasks</h3>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {tasks.filter(t => t.completed).length}/{tasks.length}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {tasks.length === 0 ? (
                         <div className="text-center py-6 text-muted-foreground text-sm">
                           <p>No tasks yet.</p>
                           <p className="text-xs mt-1">Add a field to get recommendations.</p>
                         </div>
                      ) : (
                        tasks.map(task => (
                          <div 
                            key={task.id}
                            onClick={() => toggleTask(task.id)}
                            className={`flex items-start gap-3 p-3 rounded-2xl transition-all cursor-pointer border ${
                              task.completed 
                                ? 'bg-muted/30 border-transparent opacity-60' 
                                : 'bg-card border-border hover:border-primary/30 hover:bg-muted/20'
                            }`}
                          >
                            <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                              task.completed
                                ? 'bg-primary border-primary'
                                : 'border-muted-foreground/30'
                            }`}>
                              {task.completed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm font-medium transition-all ${
                                task.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                              }`}>
                                {task.text}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                {task.time}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Quick Actions Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-20">
                  <button 
                    onClick={() => setShowFarmingJournal(true)}
                    className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-2xl hover:bg-muted/50 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-xs font-medium text-center">Log Activity</span>
                  </button>
                  
                  <button 
                    onClick={() => setActiveView('expenses')}
                    className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-2xl hover:bg-muted/50 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Wallet className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="text-xs font-medium text-center">Add Expense</span>
                  </button>
                  
                  <button 
                    onClick={handleTestSoil}
                    className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-2xl hover:bg-muted/50 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FlaskConical className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-xs font-medium text-center">Test Soil</span>
                  </button>
                  
                  <button 
                    onClick={() => setShowSeedSelection(true)}
                    className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-2xl hover:bg-muted/50 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Sprout className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-xs font-medium text-center">Seed Select</span>
                  </button>
                </div>
              </>
            )}
          </>
        ) : activeView === 'expenses' ? (
          <BudgetOverview 
            budget={budget}
            expenses={expenses}
            onAddExpense={() => setShowExpenseTracker(true)}
            onBack={() => setActiveView('dashboard')}
          />
        ) : activeView === 'market' ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setActiveView('dashboard')} className="p-2 hover:bg-muted rounded-full">
                <ChevronDown className="w-5 h-5 rotate-90" />
              </button>
              <h2 className="text-xl font-bold">Market Prices</h2>
            </div>
            <div className="p-8 text-center text-muted-foreground bg-card border border-border rounded-2xl">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Market prices module loading...</p>
            </div>
          </div>
        ) : activeView === 'profile' ? (
          <UserProfile 
            onBack={() => setActiveView('dashboard')} 
            onProfileUpdate={(updatedProfile) => {
              setUserProfile(updatedProfile);
            }}
          />
        ) : null}
      </div>

      {/* Bottom Navigation Bar - Only show when NOT in a full-screen modal mode like Expense Tracker */}
      {activeView !== 'expenses' && (
      <>
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border px-2 py-2 pb-6 z-40 flex justify-around items-center">
        <button 
          onClick={() => setActiveView('dashboard')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl min-w-[64px] transition-all ${
            activeView === 'dashboard' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <LayoutDashboard className={`w-6 h-6 ${activeView === 'dashboard' ? 'fill-current' : ''}`} />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        <button 
          onClick={() => setActiveView('expenses')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl min-w-[64px] transition-all ${
            activeView === 'expenses' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Wallet className={`w-6 h-6 ${activeView === 'expenses' ? 'fill-current' : ''}`} />
          <span className="text-[10px] font-medium">Expenses</span>
        </button>

        {/* Spacer for FAB */}
        <div className="w-16" />

        <button 
          onClick={() => setActiveView('market')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl min-w-[64px] transition-all ${
            activeView === 'market' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <TrendingUp className={`w-6 h-6 ${activeView === 'market' ? 'fill-current' : ''}`} />
          <span className="text-[10px] font-medium">Market</span>
        </button>

        <button 
          onClick={() => setActiveView('profile')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl min-w-[64px] transition-all ${
            activeView === 'profile' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <User className={`w-6 h-6 ${activeView === 'profile' ? 'fill-current' : ''}`} />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </div>

      {/* Floating Action Button (Plus) - Centered with Speed Dial Menu */}
      <AnimatePresence>
        {showQuickAddMenu && (
          <>
            <div 
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity" 
              onClick={() => setShowQuickAddMenu(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[320px]"
            >
              <div className="bg-card/95 backdrop-blur-md border border-border shadow-2xl rounded-3xl p-4 grid grid-cols-2 gap-3">
               <button 
                 onClick={() => { setShowQuickAddMenu(false); setShowExpenseTracker(true); }}
                 className="flex flex-col items-center justify-center gap-2 p-4 hover:bg-muted/50 rounded-2xl transition-all group"
               >
                 <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <Wallet className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                 </div>
                 <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">Expense</span>
               </button>

               <button 
                 onClick={() => { setShowQuickAddMenu(false); setShowFarmingJournal(true); }}
                 className="flex flex-col items-center justify-center gap-2 p-4 hover:bg-muted/50 rounded-2xl transition-all group"
               >
                 <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                 </div>
                 <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">Log Activity</span>
               </button>

               <button 
                 onClick={() => { setShowQuickAddMenu(false); setShowVoiceJournal(true); }}
                 className="flex flex-col items-center justify-center gap-2 p-4 hover:bg-muted/50 rounded-2xl transition-all group"
               >
                 <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <Mic className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                 </div>
                 <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">Voice Note</span>
               </button>

               <button 
                 onClick={() => { setShowQuickAddMenu(false); setShowPhotoCapture(true); }}
                 className="flex flex-col items-center justify-center gap-2 p-4 hover:bg-muted/50 rounded-2xl transition-all group"
               >
                 <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <Camera className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                 </div>
                 <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">Take Photo</span>
               </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setShowQuickAddMenu(!showQuickAddMenu)}
          className={`w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 text-white rounded-full shadow-xl shadow-primary/30 ring-4 ring-background flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 ${showQuickAddMenu ? 'rotate-45 bg-red-500 from-red-500 to-rose-600' : ''}`}
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>
      </>
      )}

      {/* Modals & Sheets */}
      {showExpenseTracker && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-0 bg-background flex flex-col h-full overflow-y-auto">
            <ExpenseTracker 
              currentBudget={budget} 
              onSave={(expense) => {
                handleExpenseSave(expense);
                setShowExpenseTracker(false);
              }}
              onClose={() => setShowExpenseTracker(false)}
            />
          </div>
        </div>
      )}

      {showVoiceJournal && (
        <VoiceJournalEntry 
          onClose={() => setShowVoiceJournal(false)} 
          onSave={handleVoiceJournalSave}
        />
      )}

      {showPhotoCapture && (
        <PhotoCapture 
          onClose={() => setShowPhotoCapture(false)} 
          onSave={handlePhotoSave}
        />
      )}

      {/* Soil Testing Flow */}
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
        />
      )}

      {showSelfSoilTesting && (
        <SelfSoilTesting 
          onClose={() => setShowSelfSoilTesting(false)}
          onSelectTest={handleSelectSelfTest}
        />
      )}

      {showGuidedSoilTest && (
        <GuidedSoilTest 
          onClose={() => setShowGuidedSoilTest(false)}
          testType={currentSelfTestType}
          onComplete={handleSelfTestComplete}
        />
      )}

      {showSoilSummary && (
        <SoilHealthSummary 
          onClose={() => setShowSoilSummary(false)}
          results={selfTestResults}
          onSave={handleSaveSoilProfile}
        />
      )}

      {/* Farming Journal Flow */}
      {showFarmingJournal && (
        <FarmingJournal 
          onClose={() => setShowFarmingJournal(false)} 
          onSave={handleFarmingJournalSave}
        />
      )}

      {showJournalHistory && (
        <JournalHistory 
          onClose={() => setShowJournalHistory(false)}
          entries={farmingJournalEntries}
          onViewEntry={handleViewJournalEntry}
          onViewWeeklySummary={handleViewWeeklySummary}
        />
      )}

      {showJournalEntry && (
        <JournalEntryView 
          onClose={() => setShowJournalEntry(false)}
          entry={selectedJournalEntry}
        />
      )}

      {showWeeklySummary && (
        <WeeklySummary 
          entries={farmingJournalEntries} 
          onClose={() => setShowWeeklySummary(false)} 
        />
      )}
      
      {/* Field Management - Add/Edit Modals */}
      {showAddFieldModal && (
        <AddEditFieldForm 
          field={null}
          onCancel={() => setShowAddFieldModal(false)}
          onSave={async (field) => {
            try {
              await createField(field as any);
              await loadFields();
              toast.success('Field created successfully');
              setShowAddFieldModal(false);
            } catch (error) {
              console.error(error);
              toast.error('Failed to create field');
            }
          }}
        />
      )}

      {showEditFieldModal && (
        <AddEditFieldForm 
          field={fieldToEdit}
          onCancel={() => setShowEditFieldModal(false)}
          onSave={async (field) => {
            try {
              if (fieldToEdit?.id) {
                await updateField(fieldToEdit.id, field);
                await loadFields();
                toast.success('Field updated successfully');
                setShowEditFieldModal(false);
              }
            } catch (error) {
              console.error(error);
              toast.error('Failed to update field');
            }
          }}
        />
      )}

      {showFieldMonitoring && (
        <SatelliteMonitoring 
          onClose={() => setShowFieldMonitoring(false)}
        />
      )}

      {showSeedSelection && (
        <SeedSelectionModal 
          onClose={() => setShowSeedSelection(false)}
          fieldId={selectedFieldId || 'default'}
          fieldName={currentField?.name || 'Main Field'}
          soilType={currentField?.soilType}
        />
      )}

      {showCropDetails && (
        <CropDetailView 
          cropInfo={cropInfo}
          onBack={() => setShowCropDetails(false)}
        />
      )}

      <MSChatbot />
      
      {/* Demo Helper - Shows prototype hints */}
      <DemoHelper />
    </div>
  );
}