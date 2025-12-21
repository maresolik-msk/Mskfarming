import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Menu,
  Settings,
  LogOut,
  Mic,
  Camera,
  Wallet,
  HelpCircle,
  Volume2,
  CheckCircle2,
  Circle,
  Sprout,
  Home,
  BookOpen,
  TrendingUp,
  User,
  Plus,
  ChevronDown,
  LayoutDashboard,
  History,
  Calculator,
  FileText,
  FlaskConical,
} from 'lucide-react';
import { ExpenseCard } from './ExpenseCard';
import { SeedSelectionModal } from './seed-selection/SeedSelectionModal';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetDescription,
} from './ui/sheet';
import { VoiceJournalEntry } from './VoiceJournalEntry';
import { PhotoCapture } from './PhotoCapture';
import { ExpenseTracker } from './ExpenseTracker';
import { WeatherForecast } from './WeatherForecast';
import { DemoHelper } from './DemoHelper';
import { SoilHealthCard } from './SoilHealthCard';
import { SoilTestSelection } from './SoilTestSelection';
import { SampleCollectionGuide } from './SampleCollectionGuide';
import { SampleSubmission } from './SampleSubmission';
import { SelfSoilTesting } from './SelfSoilTesting';
import { GuidedSoilTest } from './GuidedSoilTest';
import { SoilHealthSummary } from './SoilHealthSummary';
import { FarmingJournal } from './FarmingJournal';
import { JournalHistory } from './JournalHistory';
import { JournalEntryView } from './JournalEntryView';
import { WeeklySummary } from './WeeklySummary';
import { HomeView } from './HomeView';
import { toast } from 'sonner';

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

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    toast.success('Task updated');
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

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-xl shrink-0">
                🌾
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Monitoring</div>
                <div className="relative">
                  <button 
                    onClick={() => setShowFieldSelector(!showFieldSelector)}
                    className="flex items-center gap-1 text-foreground font-semibold hover:opacity-80 transition-opacity"
                  >
                    {currentField.name}
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                  
                  {/* Field Selector Dropdown */}
                  {showFieldSelector && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden">
                      {availableFields.map(field => (
                        <button
                          key={field.id}
                          onClick={() => {
                            setSelectedFieldId(field.id);
                            setShowFieldSelector(false);
                            toast.success(`Switched to ${field.name}`);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-muted transition-colors ${
                            selectedFieldId === field.id ? 'bg-primary/5 text-primary font-medium' : 'text-foreground'
                          }`}
                        >
                          <div className="font-medium">{field.name}</div>
                          <div className="text-xs text-muted-foreground">{field.crop}</div>
                        </button>
                      ))}
                    </div>
                  )}
                  {/* Backdrop to close dropdown */}
                  {showFieldSelector && (
                    <div 
                      className="fixed inset-0 z-40 bg-transparent"
                      onClick={() => setShowFieldSelector(false)} 
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <span className="text-2xl">🌾</span>
                      <span>Menu</span>
                    </SheetTitle>
                    <SheetDescription className="hidden">
                      Access dashboard navigation and quick actions
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="flex flex-col gap-1 mt-6">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                      Navigation
                    </div>
                    
                    <SheetClose asChild>
                      <button 
                        onClick={() => setActiveView('dashboard')}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeView === 'dashboard' ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'}`}
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Home Dashboard</span>
                      </button>
                    </SheetClose>

                    <SheetClose asChild>
                      <button 
                        onClick={() => setShowJournalHistory(true)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors"
                      >
                        <History className="w-5 h-5" />
                        <span>Journal History</span>
                      </button>
                    </SheetClose>

                    <SheetClose asChild>
                      <button 
                        onClick={() => setActiveView('expenses')}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeView === 'expenses' ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'}`}
                      >
                        <Calculator className="w-5 h-5" />
                        <span>Budget & Expenses</span>
                      </button>
                    </SheetClose>

                    <SheetClose asChild>
                      <button 
                        onClick={() => setActiveView('profile')}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeView === 'profile' ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'}`}
                      >
                        <User className="w-5 h-5" />
                        <span>My Profile</span>
                      </button>
                    </SheetClose>

                    <div className="h-px bg-border my-2" />
                    
                    <SheetClose asChild>
                      <button 
                        onClick={() => setShowSeedSelection(true)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors"
                      >
                        <Sprout className="w-5 h-5" />
                        <span>Smart Seed Selection</span>
                      </button>
                    </SheetClose>

                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                      Quick Actions
                    </div>

                    <SheetClose asChild>
                      <button 
                        onClick={() => setShowVoiceJournal(true)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors"
                      >
                        <Mic className="w-5 h-5" />
                        <span>Record Voice Note</span>
                      </button>
                    </SheetClose>

                    <SheetClose asChild>
                      <button 
                        onClick={() => setShowPhotoCapture(true)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors"
                      >
                        <Camera className="w-5 h-5" />
                        <span>Take Photo</span>
                      </button>
                    </SheetClose>

                    <SheetClose asChild>
                      <button 
                        onClick={() => setShowExpenseTracker(true)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors"
                      >
                        <Wallet className="w-5 h-5" />
                        <span>Add Expense</span>
                      </button>
                    </SheetClose>

                    <SheetClose asChild>
                      <button 
                        onClick={() => setShowFarmingJournal(true)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors"
                      >
                        <FileText className="w-5 h-5" />
                        <span>Daily Log</span>
                      </button>
                    </SheetClose>

                    <SheetClose asChild>
                      <button 
                        onClick={() => setShowSoilTestSelection(true)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors"
                      >
                        <FlaskConical className="w-5 h-5" />
                        <span>Soil Testing</span>
                      </button>
                    </SheetClose>

                    <div className="h-px bg-border my-2" />

                    <SheetClose asChild>
                      <button 
                        onClick={onLogout}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Log Out</span>
                      </button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="bg-muted rounded-lg p-2.5">
              <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Current Crop</div>
              <div className="text-sm font-medium text-foreground">{cropInfo.name}</div>
            </div>
            <div className="bg-muted rounded-lg p-2.5">
              <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Stage</div>
              <div className="text-sm font-medium text-foreground">Day {cropInfo.day}</div>
            </div>
            <div className="bg-muted rounded-lg p-2.5">
              <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Status</div>
              <div className="text-sm font-medium text-green-600">Healthy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Dropdown - REMOVED since we use Sheet now */}
      
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
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
            }}
          />
        )}

        {/* Budget/Expenses View */}
        {activeView === 'expenses' && (
          <>
            <div className="bg-card rounded-2xl p-6 border border-border min-h-[80vh]">
              <div className="mb-6">
                <h2 className="text-2xl text-foreground mb-4">Budget & Expenses</h2>
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-5 border border-primary/10">
                   <div className="flex justify-between items-end mb-2">
                     <div>
                       <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                       <h3 className="text-3xl font-bold text-foreground">₹{budget.used.toLocaleString()}</h3>
                     </div>
                     <div className="text-right">
                       <p className="text-xs text-muted-foreground mb-1">Budget</p>
                       <p className="font-medium">₹{budget.total.toLocaleString()}</p>
                     </div>
                   </div>
                   <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                     <div 
                       className="h-full bg-primary rounded-full transition-all duration-500" 
                       style={{ width: `${Math.min((budget.used / budget.total) * 100, 100)}%` }} 
                     />
                   </div>
                </div>
              </div>

              <button
                onClick={() => setShowExpenseTracker(true)}
                className="w-full mb-8 px-4 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 font-semibold shadow-lg shadow-primary/25"
              >
                <Plus className="w-5 h-5" />
                Record New Expense
              </button>
              
              <div className="space-y-6">
                {expenses.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-xl border border-dashed border-border">
                    <div className="text-4xl mb-3">💰</div>
                    <p>No expenses recorded yet.</p>
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
                     const getDate = (str: string) => {
                       if (str === 'Today') return new Date();
                       if (str === 'Yesterday') { const d = new Date(); d.setDate(d.getDate()-1); return d; }
                       return new Date(str + ' ' + new Date().getFullYear()); // Append year for parsing if needed
                     };
                     // Simple sort might fail if dateLabel doesn't have year.
                     // Better to rely on the FIRST item in the group for sorting.
                     return new Date(b[1][0].date).getTime() - new Date(a[1][0].date).getTime();
                  })
                  .map(([dateLabel, groupExpenses]) => (
                    <div key={dateLabel}>
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 ml-1">{dateLabel}</h3>
                      <div className="space-y-3">
                        {groupExpenses.map(expense => (
                          <ExpenseCard key={expense.id} expense={expense} />
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* Profile View */}
        {activeView === 'profile' && (
          <>
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="text-2xl text-foreground mb-6">Profile</h2>
              
              {/* Profile Info */}
              <div className="flex items-center gap-4 mb-6 p-5 bg-muted rounded-xl">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-3xl">
                  🌾
                </div>
                <div>
                  <h3 className="text-xl text-foreground mb-1">{farmerName}</h3>
                  <p className="text-sm text-muted-foreground">Farmer</p>
                </div>
              </div>

              {/* Settings Options */}
              <div className="space-y-2">
                <h3 className="text-lg text-foreground mb-3">Settings</h3>
                <button className="w-full flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <span className="text-foreground">Language</span>
                  <span className="text-muted-foreground">English</span>
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <span className="text-foreground">Notifications</span>
                  <span className="text-muted-foreground">Enabled</span>
                </button>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 p-4 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/20"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </>
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
              <button
                onClick={() => setShowFarmingJournal(true)}
                className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 hover:bg-primary/90 transition-transform hover:scale-105 active:scale-95 border-4 border-background"
              >
                <Plus className="w-7 h-7" />
              </button>
              <div className="text-[10px] text-center mt-1 text-muted-foreground font-medium">Log</div>
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