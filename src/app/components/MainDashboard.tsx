import { useState, useEffect, CSSProperties } from 'react';
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
  Leaf,
  PawPrint,
  Wrench,
  Search,
  ClipboardList,
  Droplets,
  ScanLine,
  Wheat,
  MapPin,
  X
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
import { KrishiKarmaWidget } from './KrishiKarmaWidget';
import { CropSimulator } from './CropSimulator';
import { AnimalHusbandry } from './AnimalHusbandry';
import { FarmMachinery } from './FarmMachinery';
import { CropManager } from './CropManager';
import { CropCycleTracker } from './CropCycleTracker';
import { FieldScouting } from './FieldScouting';
import { InputApplicationsLog } from './InputApplicationsLog';
import { HarvestRecording } from './HarvestRecording';
import { EnhancedFieldManagement } from './EnhancedFieldManagement';
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
  triggerHeartbeat,
} from '../../lib/api';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import Logo from '../../imports/Logo';
import navSvgPaths from '../../imports/svg-3v74inh3nv';

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
  type: 'voice' | 'photo' | 'log';
  details?: any;
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
  const { t } = useTranslation();
  const [showVoiceJournal, setShowVoiceJournal] = useState(false);
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [showExpenseTracker, setShowExpenseTracker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'expenses' | 'profile' | 'crop_manager' | 'crop_cycle' | 'scouting' | 'inputs' | 'harvest'>('dashboard'); // Launch features only

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
  const [displayedSoilResult, setDisplayedSoilResult] = useState<any>(null);
  const [viewingStoredProfile, setViewingStoredProfile] = useState(false);
  const [showSoilSummary, setShowSoilSummary] = useState(false);
  const [accumulatedTests, setAccumulatedTests] = useState<Record<string, string>>({});

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
  
  const [selectedJournalEntry, setSelectedJournalEntry] = useState<any>(null);

  const [tasks, setTasks] = useState<Task[]>([]);

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  
  // Computed view for backward compatibility and helper components
  const farmingJournalEntries = journalEntries
    .filter(e => e.type === 'log' && e.details)
    .map(e => e.details);

  const [expenses, setExpenses] = useState<Expense[]>([]);

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
    
    // Trigger Simulation Heartbeat (Update GDD/Weather for fields)
    triggerHeartbeat().then((res) => {
        if (res && res.updates_count > 0) {
            toast.success(`Updated ${res.updates_count} fields with live weather data`);
            // Reload fields to show new status
            loadFields();
        }
    });

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

  // Calculate budget derived from selected field
  const currentFieldExpenses = selectedFieldId 
    ? expenses.filter(e => e.field === selectedFieldId)
    : [];
    
  const currentBudgetTotal = currentField?.budgetTotal || 18000;
  const currentBudgetUsed = currentFieldExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  
  const budget = {
    total: currentBudgetTotal,
    used: currentBudgetUsed
  };

  const handleUpdateBudget = async (newTotal: number) => {
    if (!selectedFieldId || !currentField) {
        toast.error('Please select a field to update budget');
        return;
    }

    // Optimistically update local state
    const updatedFields = availableFields.map(f => 
        f.id === selectedFieldId ? { ...f, budgetTotal: newTotal } : f
    );
    setAvailableFields(updatedFields);

    try {
        await updateField(selectedFieldId, { ...currentField, budgetTotal: newTotal });
        toast.success('Budget updated');
    } catch (error) {
        console.error('Failed to update budget:', error);
        toast.error('Failed to save budget to cloud');
        // Revert (reload fields)
        loadFields();
    }
  };
  
  const [userProfile, setUserProfile] = useState<any>(null);

  // Load User Profile
  useEffect(() => {
    getUserProfile().then(profile => {
      if (profile) setUserProfile(profile);
    });
  }, []);

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
    soilProfile: currentField.soilProfile,
  } : {
    name: '',
    field: 'No Field Selected',
    day: 0,
    totalDays: 120,
    progress: 0,
    boundary: null,
    soilType: '',
  };

  // Calculate Krishi Karma Points
  const karmaPoints = (journalEntries.length * 10) + 
                      (tasks.filter(t => t.completed).length * 5) + 
                      (expenses.length * 5) + 
                      (selfTestResults.length * 50);

  const getKarmaLevel = (points: number) => {
    if (points >= 1000) return { level: 'Master Farmer', next: 2000 };
    if (points >= 500) return { level: 'Expert Farmer', next: 1000 };
    if (points >= 100) return { level: 'Intermediate Farmer', next: 500 };
    return { level: 'Beginner Farmer', next: 100 };
  };

  const { level: karmaLevel, next: nextLevelPoints } = getKarmaLevel(karmaPoints);

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
    if (currentField?.soilProfile?.results) {
        setDisplayedSoilResult(currentField.soilProfile.results);
        setViewingStoredProfile(true);
        setShowSoilSummary(true);
    } else {
        setShowSoilTestSelection(true);
    }
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
    const updated = [...selfTestResults, result];
    setSelfTestResults(updated);
    // Accumulate test observations into a flat map for composite analysis
    const newAccumulated = { ...accumulatedTests };
    if (result.testType && result.observation) {
      newAccumulated[result.testType] = result.observation;
    }
    setAccumulatedTests(newAccumulated);
    setDisplayedSoilResult(result);
    setViewingStoredProfile(false);
    setShowGuidedSoilTest(false);
    setShowSoilSummary(true);
  };

  const handleSaveSoilProfile = async (fieldId: string, result: any) => {
    if (!fieldId) {
        toast.error('Please select a field');
        return;
    }
    
    try {
        // Find the field to update
        const field = availableFields.find(f => f.id === fieldId);
        if (!field) {
            toast.error('Field not found');
            return;
        }

        // Use the interpreted result passed from SoilHealthSummary
        const soilProfileData = {
            lastTested: new Date().toISOString(),
            testType: 'self-test',
            results: result, // This now contains riskLevel, actions, etc.
            history: [
                ...(field.soilProfile?.history || []),
                { date: new Date().toISOString(), ...result }
            ]
        };
        
        // Update the field with soil profile data
        await updateField(fieldId, {
            ...field,
            soilProfile: soilProfileData
        });

        // Refresh fields
        await loadFields();
        
        setShowSoilSummary(false);
        toast.success('Soil profile saved! You can view it anytime in your dashboard.');
    } catch (error) {
        console.error('Error saving soil profile:', error);
        toast.error('Failed to save soil profile');
    }
  };

  // Farming Journal Handlers
  const handleFarmingJournalSave = async (entry: any) => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      text: entry.activities ? `Activities: ${entry.activities.join(', ')}` : 'Daily Log',
      timestamp: new Date(),
      type: 'log',
      details: entry
    };

    setJournalEntries([newEntry, ...journalEntries]);
    setShowFarmingJournal(false);
    
    try {
      await createJournalEntry(newEntry);
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
          <h3 className="font-bold text-lg mb-2">{t('dashboard.welcomeMessage')}</h3>
          <p>{t('dashboard.welcomeSub')}</p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '#tour-field-selector',
      content: (
        <div className="text-left">
          <h3 className="font-bold mb-1">{t('dashboard.manageFields')}</h3>
          <p>{t('dashboard.manageFieldsSub')}</p>
        </div>
      ),
    },
    {
      target: '#tour-menu-button',
      content: (
        <div className="text-left">
          <h3 className="font-bold mb-1">{t('dashboard.moreFeatures')}</h3>
          <p>{t('dashboard.moreFeaturesSub')}</p>
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
    <div className="min-h-screen bg-background pt-[0px] pr-[0px] pb-[24px] pl-[0px] overflow-x-hidden">
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showSkipButton
        showProgress
        callback={handleTourCallback}
        styles={{
          options: {
            primaryColor: '#812F0F',
            zIndex: 1000,
          },
          tooltipContainer: {
            textAlign: 'left',
          },
          buttonNext: {
            backgroundColor: '#812F0F',
          },
          buttonBack: {
            color: '#812F0F',
          }
        }}
      />

      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="bg-white w-full">
            <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between relative">
              {/* Left Section: Logo + Field Selector */}
              <div className="flex items-center gap-[5px]">
                {/* Logo */}
                <div className="flex flex-col gap-[4px] items-center justify-center relative w-[39px] shrink-0">
                  <div className="h-[17.265px] w-[14.695px] relative">
                    <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 14.695 17.265">
                      <g transform="translate(0.000 0.000)">
                         <path d="M8.47307 0.00687398C10.6232 -0.183865 13.1844 3.64264 13.4181 5.53753C13.9513 9.86155 11.871 13.7255 7.29343 14.426C5.19323 14.7476 3.13356 14.0508 1.46492 12.8014C0.767548 12.3046 -0.713274 11.0509 0.404062 10.2155C1.41972 9.45563 3.46445 10.683 4.642 10.8669C6.47118 11.149 8.33714 10.6867 9.82376 9.58385C12.3498 7.7109 12.8524 4.21924 10.2571 2.19374C9.72616 1.77944 6.26667 1.159 8.47307 0.00687398ZM3.0006 12.8116C3.70479 13.1825 4.43828 13.5444 5.23667 13.6639C7.84382 14.053 11.0959 12.5237 12.3441 10.1766C13.0618 8.82763 13.2623 7.01038 12.9693 5.52649C12.9346 5.34626 12.8033 5.14032 12.6259 5.07144C12.4362 5.75658 12.3085 6.56631 12.1152 7.18992C11.698 8.53448 10.3891 9.95609 9.16762 10.653C8.1748 11.2289 7.04454 11.5257 5.89693 11.5103C5.34948 11.5081 5.16613 11.4678 4.66032 11.4128C3.9291 11.3344 2.28741 10.5958 1.87792 11.3688C1.8873 11.9697 2.50922 12.5398 3.0006 12.8116Z" fill="#8C3412" transform="translate(1.194 0.000)" />
                         <path d="M4.76191 0.0035675C5.33043 -0.0428909 5.82877 0.370096 5.63758 0.910364C5.35057 1.72117 4.09449 1.67266 3.35961 2.08279C1.83572 2.93324 0.865114 4.49613 0.333363 6.16978C0.275566 6.45998 0.262747 6.55966 0.128692 6.83517L0.0457726 6.80361C-0.160949 5.64805 0.366842 4.04346 0.940707 3.05078C1.84085 1.49394 3.02272 0.478106 4.76191 0.0035675Z" fill="#8C3412" transform="translate(2.346 0.000) rotate(10)" />
                         <path d="M0.939117 0.00162399C1.47784 -0.0203292 1.96725 0.17821 2.1562 0.724158C2.25407 1.01428 2.22485 1.33233 2.07569 1.6005C1.85978 1.98887 1.6421 2.05994 1.25282 2.17211C-0.162721 2.26074 -0.528326 0.579747 0.939117 0.00162399Z" fill="#8C3412" transform="translate(6.088 7.355)" />
                         <path d="M0.438896 0.0111797C0.731748 -0.048614 1.01863 0.137289 1.08379 0.429076C1.14908 0.720935 0.968568 1.01133 0.678116 1.08198C0.485328 1.12887 0.282251 1.06791 0.147073 0.922672C0.0118945 0.777438 -0.0343304 0.570503 0.0260918 0.381449C0.0865826 0.192469 0.244462 0.0508956 0.438896 0.0111797Z" fill="#8C3412" transform="translate(0.000 16.167)" />
                      </g>
                    </svg>
                  </div>
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[15px] not-italic relative shrink-0 text-[#8c3412] text-[10px] tracking-[1px] uppercase">mila</p>
                </div>
                
                {/* Field Selector */}
                <div className="relative group">
                  <button 
                     type="button"
                     id="tour-field-selector"
                     onClick={() => setShowFieldSelector(!showFieldSelector)}
                     className="flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer select-none touch-manipulation outline-none focus:outline-none active:scale-95 duration-100"
                     style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <span className="font-['Inter:Bold',sans-serif] font-bold text-[#2a0f05] text-[18px] text-center">
                      {currentField?.name || t('dashboard.selectField')}
                    </span>
                    <div className="bg-[#ebe6df] flex items-center justify-center rounded-full w-[20px] h-[20px]">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.99781 4.49671L5.99561 7.49451L8.99342 4.49671" stroke="#6B5C5C" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
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
                                ? 'bg-[#812F0F] text-white shadow-lg shadow-[#812F0F]/20' 
                                : 'hover:bg-muted/80 text-foreground'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFieldId(field.id);
                              setShowFieldSelector(false);
                              toast.success(`Switched to ${field.name}`);
                            }}
                            className="flex-1 text-left flex items-center gap-3 cursor-pointer select-none touch-manipulation outline-none focus:outline-none"
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                          >
                            {/* Crop Image */}
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-white/10">
                              {field.image_url ? (
                                <img src={field.image_url} alt={field.crop} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#812F0F]/10 text-[#812F0F] font-bold text-xs">
                                  {field.crop?.charAt(0)}
                                </div>
                              )}
                            </div>

                            <div className="flex-1">
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
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFieldToEdit(field);
                                setShowEditFieldModal(true);
                                setShowFieldSelector(false);
                              }}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer select-none touch-manipulation outline-none focus:outline-none ${
                                selectedFieldId === field.id
                                  ? 'hover:bg-white/20 text-white'
                                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                              }`}
                              style={{ WebkitTapHighlightColor: 'transparent' }}
                              title="Edit field"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              type="button"
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
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer select-none touch-manipulation outline-none focus:outline-none ${
                                selectedFieldId === field.id
                                  ? 'hover:bg-white/20 text-white'
                                  : 'hover:bg-destructive/10 text-muted-foreground hover:text-destructive'
                              }`}
                              style={{ WebkitTapHighlightColor: 'transparent' }}
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
                          type="button"
                          onClick={() => {
                            setShowAddFieldModal(true);
                            setShowFieldSelector(false);
                          }}
                          className="w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-2 hover:bg-[#812F0F]/10 text-[#812F0F] group cursor-pointer select-none touch-manipulation outline-none focus:outline-none"
                          style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                          <Plus className="w-4 h-4" />
                          <span className="font-medium text-sm">{t('dashboard.addNewField')}</span>
                        </button>
                      </div>
                    </motion.div>
                    </>
                  )}
                  </AnimatePresence>
                </div>
              </div>
            
              {/* Right Section: Menu */}
              <div className="flex items-center gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    id="tour-menu-button"
                    className="w-10 h-10 flex items-center justify-center text-[#893211] hover:bg-muted/50 rounded-full transition-colors cursor-pointer select-none touch-manipulation outline-none focus:outline-none active:scale-95 duration-100"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M4 18H20C20.55 18 21 17.55 21 17C21 16.45 20.55 16 20 16H4C3.45 16 3 16.45 3 17C3 17.55 3.45 18 4 18ZM4 13H20C20.55 13 21 12.55 21 12C21 11.45 20.55 11 20 11H4C3.45 11 3 11.45 3 12C3 12.55 3.45 13 4 13ZM3 7C3 7.55 3.45 8 4 8H20C20.55 8 21 7.55 21 7C21 6.45 20.55 6 20 6H4C3.45 6 3 6.45 3 7Z" fill="#893211"/>
                    </svg>
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 bg-[rgba(255,255,255,0.98)] backdrop-blur-xl border-l border-white/10 shadow-2xl">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    Access dashboard features and settings
                  </SheetDescription>
                  {/* Header */}
                  <div className="h-[75px] flex items-center justify-between px-[20px] pt-[12px] pb-[12px] border-b border-transparent">
                    <div className="flex items-center gap-[12px]">
                       {/* Logo Icon */}
                       <div className="relative w-[19.59px] h-[23px]">
                           <div className="absolute inset-0">
                                <svg className="block" fill="none" viewBox="0 0 17.9997 19.3422" style={{ position: 'absolute', top: 0, left: 0, width: '18px', height: '19.34px' }}>
                                    <path d="M11.2974 0.00916691C14.1643 -0.245196 17.5792 4.85771 17.8908 7.38467C18.6017 13.151 15.8281 18.3038 9.72458 19.238C6.92431 19.667 4.17808 18.7376 1.95323 17.0716C1.0234 16.409 -0.951032 14.7371 0.538749 13.623C1.89297 12.6097 4.61927 14.2465 6.18933 14.4918C8.62825 14.868 11.1162 14.2514 13.0983 12.7807C16.4664 10.283 17.1366 5.62665 13.6761 2.9255C12.9682 2.373 8.35556 1.54561 11.2974 0.00916691ZM4.00081 17.0852C4.93973 17.5797 5.91771 18.0624 6.98223 18.2217C10.4584 18.7406 14.7946 16.7012 16.4589 13.5712C17.4157 11.7722 17.683 9.34882 17.2924 7.36994C17.2461 7.1296 17.0711 6.85496 16.8345 6.76311C16.5817 7.67679 16.4114 8.75662 16.1536 9.58824C15.5974 11.3813 13.8521 13.2771 12.2235 14.2064C10.8997 14.9745 9.39273 15.3703 7.86258 15.3498C7.13264 15.3468 6.88817 15.293 6.21375 15.2198C5.2388 15.1152 3.04988 14.1302 2.5039 15.1611C2.5164 15.9625 3.34563 16.7227 4.00081 17.0852Z" fill="#812F0F" />
                                </svg>
                                <svg className="block" fill="none" viewBox="0 0 7.57222 9.11516" style={{ position: 'absolute', top: '15.97%', left: 0, width: '7.57px', height: '9.12px' }}>
                                    <path d="M6.34921 0.00475751C7.10724 -0.0571979 7.77169 0.493548 7.51677 1.21403C7.1341 2.2953 5.45932 2.23061 4.47948 2.77755C2.44763 3.91167 1.15349 5.99589 0.444484 8.22782C0.367422 8.61481 0.350329 8.74775 0.17159 9.11516L0.0610302 9.07308C-0.214598 7.53206 0.489122 5.39223 1.25428 4.06842C2.45446 1.99227 4.0303 0.637587 6.34921 0.00475751Z" fill="#812F0F" />
                                </svg>
                                <svg className="block" fill="none" viewBox="0 0 2.95086 2.90115" style={{ position: 'absolute', top: '41.43%', left: '42.6%', width: '2.95px', height: '2.9px' }}>
                                    <path d="M1.25216 0.0021657C1.97046 -0.0271104 2.62301 0.237655 2.87494 0.965713C3.00543 1.35261 2.96647 1.77675 2.76758 2.13438C2.47971 2.65229 2.18947 2.74707 1.67042 2.89665C-0.216961 3.01485 -0.704435 0.773132 1.25216 0.0021657Z" fill="#812F0F" />
                                </svg>
                                <svg className="block" fill="none" viewBox="0 0 1.46284 1.46362" style={{ position: 'absolute', top: 0, left: '45.5%', width: '1.46px', height: '1.46px' }}>
                                    <path d="M0.585195 0.0149089C0.975665 -0.0648301 1.35818 0.183084 1.44505 0.572202C1.53211 0.961416 1.29142 1.34868 0.904155 1.44289C0.647104 1.50543 0.376335 1.42412 0.196097 1.23044C0.0158593 1.03677 -0.0457739 0.760805 0.0347891 0.508689C0.115443 0.25667 0.325949 0.0678727 0.585195 0.0149089Z" fill="#812F0F" />
                                </svg>
                           </div>
                       </div>
                       <span className="font-['Megrim'] font-medium text-[24px] leading-[32px] text-[#2a0f05]">MILA</span>
                    </div>
                    <SheetClose className="opacity-70 hover:opacity-100 transition-opacity">
                       <X className="w-5 h-5 text-[#332c2c]" />
                    </SheetClose>
                  </div>

                  <div className="h-[calc(100vh-75px)] overflow-y-auto">
                    {/* Navigation Header */}
                    <div className="bg-[#eed5cb] px-[12px] py-[4px] h-[24px] flex items-center mb-4">
                         <span className="text-[10px] font-['Inter'] font-bold tracking-[1.5px] text-[#332c2c]/70 uppercase">Navigation</span>
                    </div>

                    {/* Navigation Items */}
                    <div className="px-0 space-y-2">
                         {/* Home */}
                         <SheetClose asChild>
                         <button 
                             onClick={() => setActiveView('dashboard')}
                             className={`w-full flex items-center gap-[16px] px-[20px] py-[14px] transition-colors ${activeView === 'dashboard' ? 'bg-[#812f0f]' : 'hover:bg-[#812f0f]/5'}`}
                         >
                             <div className="w-[24px] h-[24px]">
                                 <svg viewBox="0 0 21 18.7683" fill="none">
                                     <path d="M19.4859 18H0.75V9C2.52232 8.99969 4.28926 9.19493 6.01875 9.58219L6 9.57562V5.25L12 0.75L18 5.25V9.10406C16.7345 9.22278 15.4806 9.44222 14.25 9.76031V6.75H9.75V10.7447C13.5619 12.2916 16.9138 14.7895 19.4859 18Z" fill={activeView === 'dashboard' ? "white" : "#2A0F05"} opacity="0.2" />
                                     <path d="M20.25 12.75C20.4489 12.75 20.6397 12.671 20.7803 12.5303C20.921 12.3897 21 12.1989 21 12C21 11.8011 20.921 11.6103 20.7803 11.4697C20.6397 11.329 20.4489 11.25 20.25 11.25C18.1618 11.2485 16.0843 11.5475 14.0812 12.1378C13.5187 11.7766 12.9419 11.4397 12.3506 11.1272C14.8833 10.2109 17.5567 9.74486 20.25 9.75C20.4489 9.75 20.6397 9.67098 20.7803 9.53033C20.921 9.38968 21 9.19891 21 9C21 8.80109 20.921 8.61032 20.7803 8.46967C20.6397 8.32902 20.4489 8.25 20.25 8.25C19.7475 8.25 19.2478 8.26687 18.75 8.29594V5.25C18.75 5.13357 18.7229 5.01873 18.6708 4.91459C18.6187 4.81045 18.5431 4.71986 18.45 4.65L12.45 0.15C12.3202 0.0526334 12.1623 0 12 0C11.8377 0 11.6798 0.0526334 11.55 0.15L5.55 4.65C5.45685 4.71986 5.38125 4.81045 5.32918 4.91459C5.27711 5.01873 5.25 5.13357 5.25 5.25V8.65969C3.76547 8.38738 2.2593 8.25026 0.75 8.25C0.551088 8.25 0.360322 8.32902 0.21967 8.46967C0.0790176 8.61032 0 8.80109 0 9C0 9.19891 0.0790176 9.38968 0.21967 9.53033C0.360322 9.67098 0.551088 9.75 0.75 9.75C4.23666 9.743 7.6799 10.5235 10.8228 12.0331C13.9657 13.5428 16.7271 15.7427 18.9009 18.4688C18.9613 18.5491 19.0371 18.6165 19.124 18.6669C19.2109 18.7173 19.307 18.7498 19.4067 18.7624C19.5064 18.775 19.6076 18.7674 19.7043 18.7401C19.8009 18.7128 19.8912 18.6664 19.9696 18.6036C20.048 18.5407 20.1129 18.4628 20.1606 18.3744C20.2083 18.286 20.2378 18.1889 20.2473 18.0889C20.2567 17.9888 20.246 17.888 20.2157 17.7922C20.1854 17.6964 20.1362 17.6076 20.0709 17.5312C19.5966 16.9375 19.0984 16.3706 18.5766 15.8306C19.1316 15.7772 19.6912 15.75 20.25 15.75C20.4489 15.75 20.6397 15.671 20.7803 15.5303C20.921 15.3897 21 15.1989 21 15C21 14.8011 20.921 14.6103 20.7803 14.4697C20.6397 14.329 20.4489 14.25 20.25 14.25C19.2265 14.2499 18.2047 14.333 17.1947 14.4984C16.7103 14.0659 16.2103 13.6547 15.6947 13.2647C17.1888 12.9216 18.717 12.749 20.25 12.75ZM10.5 10.2413V7.5H13.5V9.18188C12.4804 9.47111 11.4805 9.82591 10.5066 10.2441L10.5 10.2413ZM6.75 5.625L12 1.6875L17.25 5.625V8.43094C16.4925 8.52156 15.7425 8.64656 15 8.80594V6.75C15 6.55109 14.921 6.36032 14.7803 6.21967C14.6397 6.07902 14.4489 6 14.25 6H9.75C9.55109 6 9.36032 6.07902 9.21967 6.21967C9.07902 6.36032 9 6.55109 9 6.75V9.65625C8.26312 9.39688 7.51313 9.1725 6.75 8.98312V5.625ZM11.3278 18.4153C11.2176 18.5809 11.0462 18.6959 10.8513 18.7351C10.6563 18.7743 10.4537 18.7345 10.2881 18.6244C7.46266 16.7447 4.14356 15.7445 0.75 15.75C0.551088 15.75 0.360322 15.671 0.21967 15.5303C0.0790176 15.3897 0 15.1989 0 15C0 14.8011 0.0790176 14.6103 0.21967 14.4697C0.360322 14.329 0.551088 14.25 0.75 14.25C4.43919 14.2443 8.04733 15.332 11.1188 17.3756C11.2843 17.4858 11.3994 17.6572 11.4386 17.8522C11.4778 18.0471 11.4379 18.2497 11.3278 18.4153ZM15.9722 17.4647C16.0452 17.533 16.1038 17.6152 16.1446 17.7065C16.1854 17.7978 16.2075 17.8963 16.2097 17.9963C16.2119 18.0962 16.194 18.1956 16.1572 18.2886C16.1204 18.3815 16.0653 18.4662 15.9953 18.5376C15.9253 18.609 15.8417 18.6656 15.7495 18.7043C15.6573 18.7429 15.5583 18.7626 15.4583 18.7624C15.3583 18.7622 15.2594 18.742 15.1673 18.703C15.0752 18.664 14.9919 18.607 14.9222 18.5353C11.1438 14.8166 6.05142 12.7378 0.75 12.75C0.551088 12.75 0.360322 12.671 0.21967 12.5303C0.0790176 12.3897 0 12.1989 0 12C0 11.8011 0.0790176 11.6103 0.21967 11.4697C0.360322 11.329 0.551088 11.25 0.75 11.25C6.44433 11.2369 11.9141 13.47 15.9722 17.4647Z" fill={activeView === 'dashboard' ? "white" : "#2A0F05"} />
                                 </svg>
                             </div>
                             <span className={`font-['Inter'] font-semibold text-[15px] ${activeView === 'dashboard' ? 'text-white' : 'text-[#2a0f05]'}`}>Home</span>
                         </button>
                         </SheetClose>

                         {/* Crop Manager */}
                         <SheetClose asChild>
                         <button 
                             onClick={() => setActiveView('crop_manager')}
                             className={`w-full flex items-center gap-[16px] px-[20px] py-[14px] transition-colors ${activeView === 'crop_manager' ? 'bg-[#812f0f]' : 'hover:bg-[#812f0f]/5'}`}
                         >
                             <div className="w-[24px] h-[24px]">
                                 <svg viewBox="0 0 24 24" fill="none">
                                     <path d="M3.51758 13.5166C7.80078 13.772 11.2261 17.1759 11.4824 21.4814C9.41697 21.3555 7.46085 20.4823 5.98926 19.0107C4.51742 17.5389 3.64331 15.5824 3.51758 13.5166ZM20.4814 13.5166C20.3557 15.5824 19.4826 17.5389 18.0107 19.0107C16.5389 20.4826 14.5824 21.3557 12.5166 21.4814C12.771 17.1743 16.1743 13.771 20.4814 13.5166ZM12 1.5C12.5304 1.5 13.039 1.71086 13.4141 2.08594C13.7891 2.46101 14 2.96957 14 3.5V4.67969L14.7969 4.09277C15.0853 3.88026 15.4699 3.75 15.9004 3.75C16.4307 3.7501 16.9395 3.96096 17.3145 4.33594C17.6894 4.71099 17.9004 5.21966 17.9004 5.75C17.9004 6.53712 17.43 7.22734 16.7549 7.54883L15.8066 8L16.7549 8.45117C17.4311 8.77317 17.9004 9.45402 17.9004 10.25C17.9004 10.7803 17.6894 11.289 17.3145 11.6641C16.9395 12.039 16.4307 12.2499 15.9004 12.25C15.4766 12.25 15.0873 12.1135 14.79 11.9023L14 11.3418V12.5C14 13.0304 13.7891 13.539 13.4141 13.9141C13.039 14.2891 12.5304 14.5 12 14.5C11.4696 14.5 10.961 14.2891 10.5859 13.9141C10.2109 13.539 10 13.0304 10 12.5V11.3418L9.20996 11.9023C8.9127 12.1135 8.52339 12.25 8.09961 12.25C7.56932 12.2499 7.06053 12.039 6.68555 11.6641C6.3106 11.289 6.09961 10.7803 6.09961 10.25L6.10547 10.1025C6.15932 9.37056 6.61108 8.75309 7.24512 8.45117L8.19336 8L7.24512 7.54883C6.57 7.22734 6.09961 6.53712 6.09961 5.75C6.09961 5.21966 6.3106 4.71099 6.68555 4.33594C7.06053 3.96096 7.56932 3.7501 8.09961 3.75C8.53005 3.75 8.91469 3.88026 9.20312 4.09277L10 4.67969V3.5C10 2.96957 10.2109 2.46101 10.5859 2.08594C10.961 1.71086 11.4696 1.5 12 1.5ZM12 5C11.2044 5 10.4415 5.3163 9.87891 5.87891C9.3163 6.44152 9 7.20435 9 8C9 8.79565 9.3163 9.55848 9.87891 10.1211C10.4415 10.6837 11.2044 11 12 11C12.7956 11 13.5585 10.6837 14.1211 10.1211C14.6837 9.55848 15 8.79565 15 8C15 7.20435 14.6837 6.44152 14.1211 5.87891C13.5585 5.3163 12.7956 5 12 5Z" stroke={activeView === 'crop_manager' ? "white" : "black"} />
                                 </svg>
                             </div>
                             <span className={`font-['Inter'] font-semibold text-[15px] ${activeView === 'crop_manager' ? 'text-white' : 'text-[#2a0f05]'}`}>Crop Manager</span>
                         </button>
                         </SheetClose>

                         {/* Crop Cycle Tracker */}
                         <SheetClose asChild>
                         <button 
                             onClick={() => setActiveView('crop_cycle')}
                             className={`w-full flex items-center gap-[16px] px-[20px] py-[14px] transition-colors ${activeView === 'crop_cycle' ? 'bg-[#812f0f]' : 'hover:bg-[#812f0f]/5'}`}
                         >
                             <div className="w-[24px] h-[24px]">
                                 <svg viewBox="0 0 24 24" fill="none">
                                     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" fill={activeView === 'crop_cycle' ? "white" : "#2A0F05"} />
                                 </svg>
                             </div>
                             <span className={`font-['Inter'] font-semibold text-[15px] ${activeView === 'crop_cycle' ? 'text-white' : 'text-[#2a0f05]'}`}>Crop Cycle</span>
                         </button>
                         </SheetClose>

                         {/* Expenses */}
                         <SheetClose asChild>
                         <button 
                             onClick={() => setActiveView('expenses')}
                             className={`w-full flex items-center gap-[16px] px-[20px] py-[14px] transition-colors ${activeView === 'expenses' ? 'bg-[#812f0f]' : 'hover:bg-[#812f0f]/5'}`}
                         >
                             <div className="w-[24px] h-[24px]">
                                 <svg viewBox="0 0 24 24" fill="none">
                                     <path d="M5.75 7C5.55109 7 5.36032 7.07902 5.21967 7.21967C5.07902 7.36032 5 7.55109 5 7.75C5 7.94891 5.07902 8.13968 5.21967 8.28033C5.36032 8.42098 5.55109 8.5 5.75 8.5H9.75C9.94891 8.5 10.1397 8.42098 10.2803 8.28033C10.421 8.13968 10.5 7.94891 10.5 7.75C10.5 7.55109 10.421 7.36032 10.2803 7.21967C10.1397 7.07902 9.94891 7 9.75 7H5.75Z" fill={activeView === 'expenses' ? "white" : "#2A0F05"} />
                                     <path clipRule="evenodd" d="M21.188 8.004C21.1253 8.00067 21.0587 7.99933 20.988 8H18.215C15.944 8 14 9.736 14 12C14 14.264 15.944 16 18.215 16H20.988C21.0587 16.0007 21.1253 15.9993 21.188 15.996C22.111 15.94 22.927 15.239 22.996 14.259C23 14.195 23 14.126 23 14.062V9.938C23 9.874 23 9.805 22.996 9.741C22.927 8.761 22.111 8.061 21.188 8.004ZM17.971 13.067C18.555 13.067 19.029 12.589 19.029 12C19.029 11.41 18.555 10.933 17.971 10.933C17.387 10.933 16.911 11.411 16.911 12C16.911 12.59 17.386 13.067 17.971 13.067Z" fill={activeView === 'expenses' ? "white" : "#2A0F05"} fillRule="evenodd" />
                                     <path d="M21.14 8.002C21.14 6.821 21.096 5.554 20.342 4.647C20.2681 4.55834 20.1903 4.47293 20.109 4.391C19.36 3.643 18.411 3.311 17.239 3.153C16.099 3 14.644 3 12.806 3H10.694C8.856 3 7.4 3 6.26 3.153C5.088 3.311 4.139 3.643 3.39 4.391C2.642 5.14 2.31 6.089 2.152 7.261C2 8.401 2 9.856 2 11.694V11.806C2 13.644 2 15.1 2.153 16.239C2.311 17.411 2.643 18.36 3.391 19.109C4.14 19.857 5.089 20.189 6.261 20.347C7.401 20.5 8.856 20.5 10.694 20.5H12.806C14.644 20.5 16.1 20.5 17.239 20.347C18.411 20.189 19.36 19.857 20.109 19.109C20.3123 18.9037 20.4877 18.6837 20.635 18.449C21.085 17.729 21.139 16.847 21.139 15.999L20.989 16H18.215C15.944 16 14 14.264 14 12C14 9.736 15.944 8 18.215 8H20.988C21.0407 8 21.092 8.00067 21.14 8.002Z" fill={activeView === 'expenses' ? "white" : "#2A0F05"} opacity="0.5" />
                                 </svg>
                             </div>
                             <span className={`font-['Inter'] font-semibold text-[15px] ${activeView === 'expenses' ? 'text-white' : 'text-[#2a0f05]'}`}>Expenses</span>
                         </button>
                         </SheetClose>

                         {/* Profile */}
                         <SheetClose asChild>
                         <button 
                             onClick={() => setActiveView('profile')}
                             className={`w-full flex items-center gap-[16px] px-[20px] py-[14px] transition-colors ${activeView === 'profile' ? 'bg-[#812f0f]' : 'hover:bg-[#812f0f]/5'}`}
                         >
                             <div className="w-[24px] h-[24px]">
                                 <svg viewBox="0 0 24 24" fill="none">
                                     <path d="M6.75 12.5H17.25C17.7141 12.5 18.1591 12.6845 18.4873 13.0127C18.8155 13.3409 19 13.7859 19 14.25V15C19 17.6217 16.4965 20.5 12 20.5C7.50353 20.5 5 17.6217 5 15V14.25C5 13.7859 5.18451 13.3409 5.5127 13.0127C5.84088 12.6845 6.28587 12.5 6.75 12.5ZM12 2.75C12.9614 2.75 13.8837 3.1317 14.5635 3.81152C15.2433 4.49134 15.625 5.41359 15.625 6.375C15.625 7.33641 15.2433 8.25866 14.5635 8.93848C13.8837 9.6183 12.9614 10 12 10C11.0386 10 10.1163 9.6183 9.43652 8.93848C8.7567 8.25866 8.375 7.33641 8.375 6.375C8.375 5.41359 8.7567 4.49134 9.43652 3.81152C10.1163 3.1317 11.0386 2.75 12 2.75Z" stroke={activeView === 'profile' ? "white" : "#2A0F05"} />
                                 </svg>
                             </div>
                             <span className={`font-['Inter'] font-semibold text-[15px] ${activeView === 'profile' ? 'text-white' : 'text-[#2a0f05]'}`}>Profile</span>
                         </button>
                         </SheetClose>
                    </div>

                    {/* Divider */}
                    <div className="my-[12px] h-[1px] bg-gradient-to-r from-transparent via-[#812f0f]/15 to-transparent" />

                    {/* Farming Tools Header */}
                    <div className="px-[12px] h-[15px] mb-4">
                         <span className="text-[10px] font-['Inter'] font-bold tracking-[1.5px] text-[#6b5c5c]/70 uppercase pl-[12px]">farming tools</span>
                    </div>

                    {/* Farming Tools Items */}
                    <div className="px-0 space-y-2">
                         {/* Field Scouting */}
                         <SheetClose asChild>
                         <button 
                             onClick={() => setActiveView('scouting')}
                             className={`w-full flex items-center gap-[16px] px-[20px] py-[14px] transition-colors ${activeView === 'scouting' ? 'bg-[#812f0f]' : 'hover:bg-[#812f0f]/5'}`}
                         >
                             <div className="w-[24px] h-[24px]">
                                 <svg viewBox="0 0 19.5 19.5" fill="none">
                                     <path d="M8.75 16.75C10.8717 16.75 12.9066 15.9071 14.4069 14.4069C15.9071 12.9066 16.75 10.8717 16.75 8.75C16.75 6.62827 15.9071 4.59344 14.4069 3.09315C12.9066 1.59285 10.8717 0.75 8.75 0.75C6.62827 0.75 4.59344 1.59285 3.09315 3.09315C1.59285 4.59344 0.75 6.62827 0.75 8.75C0.75 10.8717 1.59285 12.9066 3.09315 14.4069C4.59344 15.9071 6.62827 16.75 8.75 16.75Z" fill={activeView === 'scouting' ? "white" : "#2A0F05"} fillOpacity="0.16" />
                                     <path d="M18.75 18.75L14.75 14.75M16.75 8.75C16.75 10.8717 15.9071 12.9066 14.4069 14.4069C12.9066 15.9071 10.8717 16.75 8.75 16.75C6.62827 16.75 4.59344 15.9071 3.09315 14.4069C1.59285 12.9066 0.75 10.8717 0.75 8.75C0.75 6.62827 1.59285 4.59344 3.09315 3.09315C4.59344 1.59285 6.62827 0.75 8.75 0.75C10.8717 0.75 12.9066 1.59285 14.4069 3.09315C15.9071 4.59344 16.75 6.62827 16.75 8.75Z" stroke={activeView === 'scouting' ? "white" : "#2A0F05"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                 </svg>
                             </div>
                             <span className={`font-['Inter'] font-semibold text-[15px] ${activeView === 'scouting' ? 'text-white' : 'text-[#2a0f05]'}`}>Field Scouting</span>
                         </button>
                         </SheetClose>

                         {/* Input Applications */}
                         <SheetClose asChild>
                         <button 
                             onClick={() => setActiveView('inputs')}
                             className={`w-full flex items-center gap-[16px] px-[20px] py-[14px] transition-colors ${activeView === 'inputs' ? 'bg-[#812f0f]' : 'hover:bg-[#812f0f]/5'}`}
                         >
                             <div className="w-[20px] h-[20px]">
                                 <svg viewBox="0 0 19.9935 19.9935" fill="none">
                                     <path d="M12.4959 1.66612H7.49755C7.03746 1.66612 6.66448 2.0391 6.66448 2.49918V4.1653C6.66448 4.62539 7.03746 4.99836 7.49755 4.99836H12.4959C12.956 4.99836 13.329 4.62539 13.329 4.1653V2.49918C13.329 2.0391 12.956 1.66612 12.4959 1.66612Z" stroke={activeView === 'inputs' ? "white" : "#2A0F05"} strokeWidth="1.66612" strokeLinecap="round" strokeLinejoin="round" />
                                     <path d="M13.329 3.33224H14.9951C15.437 3.33224 15.8608 3.50778 16.1732 3.82024C16.4857 4.1327 16.6612 4.55648 16.6612 4.99836V16.6612C16.6612 17.1031 16.4857 17.5269 16.1732 17.8393C15.8608 18.1518 15.437 18.3273 14.9951 18.3273H4.99836C4.55648 18.3273 4.1327 18.1518 3.82024 17.8393C3.50778 17.5269 3.33224 17.1031 3.33224 16.6612V4.99836C3.33224 4.55648 3.50778 4.1327 3.82024 3.82024C4.1327 3.50778 4.55648 3.33224 4.99836 3.33224H6.66448" stroke={activeView === 'inputs' ? "white" : "#2A0F05"} strokeWidth="1.66612" strokeLinecap="round" strokeLinejoin="round" />
                                     <path d="M9.99673 9.16367H13.329" stroke={activeView === 'inputs' ? "white" : "#2A0F05"} strokeWidth="1.66612" strokeLinecap="round" strokeLinejoin="round" />
                                     <path d="M9.99673 13.329H13.329" stroke={activeView === 'inputs' ? "white" : "#2A0F05"} strokeWidth="1.66612" strokeLinecap="round" strokeLinejoin="round" />
                                     <path d="M6.66448 9.16367H6.67282" stroke={activeView === 'inputs' ? "white" : "#2A0F05"} strokeWidth="1.66612" strokeLinecap="round" strokeLinejoin="round" />
                                     <path d="M6.66448 13.329H6.67282" stroke={activeView === 'inputs' ? "white" : "#2A0F05"} strokeWidth="1.66612" strokeLinecap="round" strokeLinejoin="round" />
                                 </svg>
                             </div>
                             <span className={`font-['Inter'] font-semibold text-[15px] ${activeView === 'inputs' ? 'text-white' : 'text-[#2a0f05]'}`}>Input Applications</span>
                         </button>
                         </SheetClose>

                         {/* Harvest Records */}
                         <SheetClose asChild>
                         <button 
                             onClick={() => setActiveView('harvest')}
                             className={`w-full flex items-center gap-[16px] px-[20px] py-[14px] transition-colors ${activeView === 'harvest' ? 'bg-[#812f0f]' : 'hover:bg-[#812f0f]/5'}`}
                         >
                             <div className="w-[20px] h-[20px]">
                                 <svg viewBox="0 0 19.9935 19.9935" fill="none">
                                     <path d="M1.66612 18.3273L13.329 6.66448" stroke={activeView === 'harvest' ? "white" : "#2A0F05"} strokeWidth="1.66612" strokeLinecap="round" strokeLinejoin="round" />
                                     <path d="M2.89072 10.4382L4.1653 9.16367L5.43989 10.4382C5.98421 10.9847 6.28983 11.7246 6.28983 12.4959C6.28983 13.2672 5.98421 14.0071 5.43989 14.5536L4.1653 15.8282L2.89072 14.5536C2.3464 14.0071 2.04078 13.2672 2.04078 12.4959C2.04078 11.7246 2.3464 10.9847 2.89072 10.4382Z" stroke={activeView === 'harvest' ? "white" : "#2A0F05"} strokeWidth="1.66612" strokeLinecap="round" strokeLinejoin="round" />
                                     <path d="M6.22296 7.10601L7.49755 5.83142L8.77213 7.10601C9.31645 7.65248 9.62207 8.39236 9.62207 9.16367C9.62207 9.93497 9.31645 10.6749 8.77213 11.2213L7.49755 12.4959L6.22296 11.2213C5.67864 10.6749 5.37302 9.93497 5.37302 9.16367C5.37302 8.39236 5.67864 7.65248 6.22296 7.10601Z" stroke={activeView === 'harvest' ? "white" : "#2A0F05"} strokeWidth="1.66612" strokeLinecap="round" strokeLinejoin="round" />
                                     <path d="M9.5552 3.77376L10.8298 2.49918L12.1044 3.77376C12.6487 4.32023 12.9543 5.06012 12.9543 5.83142C12.9543 6.60273 12.6487 7.34262 12.1044 7.88908L10.8298 9.16367L9.5552 7.88908C9.01088 7.34262 8.70526 6.60273 8.70526 5.83142C8.70526 5.06012 9.01088 4.32023 9.5552 3.77376Z" stroke={activeView === 'harvest' ? "white" : "#2A0F05"} strokeWidth="1.66612" strokeLinecap="round" strokeLinejoin="round" />
                                     <path d="M16.6612 1.66612H18.3273V3.33224C18.3273 4.21601 17.9763 5.06358 17.3513 5.68849C16.7264 6.31341 15.8789 6.66448 14.9951 6.66448H13.329V4.99836C13.329 4.1146 13.68 3.26703 14.305 2.64211C14.9299 2.0172 15.7774 1.66612 16.6612 1.66612Z" stroke={activeView === 'harvest' ? "white" : "#2A0F05"} strokeWidth="1.66612" strokeLinecap="round" strokeLinejoin="round" />
                                     <path d="M9.55521 14.5536L10.8298 15.8282L9.55521 17.1027C9.00874 17.6471 8.26885 17.9527 7.49755 17.9527C6.72624 17.9527 5.98635 17.6471 5.43989 17.1027L4.1653 15.8282L5.43989 14.5536C5.98635 14.0092 6.72624 13.7036 7.49755 13.7036C8.26885 13.7036 9.00874 14.0092 9.55521 14.5536Z" stroke={activeView === 'harvest' ? "white" : "#2A0F05"} strokeWidth="1.66612" strokeLinecap="round" strokeLinejoin="round" />
                                     <path d="M12.8874 11.2213L14.162 12.4959L12.8874 13.7705C12.341 14.3148 11.6011 14.6204 10.8298 14.6204C10.0585 14.6204 9.3186 14.3148 8.77213 13.7705L7.49755 12.4959L8.77213 11.2213C9.3186 10.677 10.0585 10.3714 10.8298 10.3714C11.6011 10.3714 12.341 10.677 12.8874 11.2213Z" stroke={activeView === 'harvest' ? "white" : "#2A0F05"} strokeWidth="1.66612" strokeLinecap="round" strokeLinejoin="round" />
                                     <path d="M16.2197 7.88908L17.4943 9.16367L16.2197 10.4382C15.6732 10.9826 14.9333 11.2882 14.162 11.2882C13.3907 11.2882 12.6508 10.9826 12.1044 10.4382L10.8298 9.16367L12.1044 7.88908C12.6508 7.34476 13.3907 7.03914 14.162 7.03914C14.9333 7.03914 15.6732 7.34476 16.2197 7.88908Z" stroke={activeView === 'harvest' ? "white" : "#2A0F05"} strokeWidth="1.66612" strokeLinecap="round" strokeLinejoin="round" />
                                 </svg>
                             </div>
                             <span className={`font-['Inter'] font-semibold text-[15px] ${activeView === 'harvest' ? 'text-white' : 'text-[#2a0f05]'}`}>Harvest Records</span>
                         </button>
                         </SheetClose>
                    </div>

                    {/* Logout */}
                    <div className="mt-8 px-0 mb-8">
                      <SheetClose asChild>
                         <button 
                             onClick={onLogout}
                             className="w-full flex items-center gap-[12px] px-[20px] py-[12px] transition-colors hover:bg-red-50"
                         >
                             <div className="w-[16px] h-[16px]">
                                 <svg viewBox="0 0 15.9923 15.9923" fill="none">
                                     <path d="M5.99713 13.9933H3.33174C2.97828 13.9933 2.63931 13.8529 2.38938 13.603C2.13945 13.353 1.99904 13.0141 1.99904 12.6606V3.33174C1.99904 2.97828 2.13945 2.63931 2.38938 2.38938C2.63931 2.13945 2.97828 1.99904 3.33174 1.99904H5.99713" stroke="#FB2C36" strokeWidth="1.33269" strokeLinecap="round" strokeLinejoin="round" />
                                     <path d="M10.6616 11.3279L13.9933 7.99617L10.6616 4.66443" stroke="#FB2C36" strokeWidth="1.33269" strokeLinecap="round" strokeLinejoin="round" />
                                     <path d="M13.9933 7.99617H5.99713" stroke="#FB2C36" strokeWidth="1.33269" strokeLinecap="round" strokeLinejoin="round" />
                                 </svg>
                             </div>
                             <span className="font-['Inter'] font-medium text-[16px] leading-[24px] text-[#fb2c36]">Log Out</span>
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
      <div className="max-w-4xl px-[16px] pt-[0px] pb-[32px] mx-[0px] mt-[0px] mb-[32px]">
        {activeView === 'dashboard' ? (
          <>
            {availableFields.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 px-6"
              >
                {/* Futuristic welcome card with glassmorphism */}
                <div className="relative max-w-2xl mx-auto">
                  {/* Ambient glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#812F0F]/20 via-amber-500/10 to-orange-400/20 blur-3xl -z-10 animate-pulse" />
                  
                  <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 dark:from-white/5 dark:to-white/[0.02] border border-white/20 dark:border-white/10 rounded-[32px] p-12 shadow-2xl relative overflow-hidden">
                    {/* Decorative gradient overlay */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#812F0F]/20 via-amber-500/10 to-transparent rounded-full blur-3xl -z-10" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-orange-400/20 via-amber-300/10 to-transparent rounded-full blur-3xl -z-10" />
                    
                    {/* Logo with enhanced styling */}
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="relative w-32 h-32 mx-auto mb-8"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#812F0F] to-amber-600 rounded-3xl rotate-6 opacity-20 blur-xl animate-pulse" />
                      <div className="relative w-full h-full bg-gradient-to-br from-[#812F0F]/20 to-amber-500/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-2xl p-8">
                        <Logo />
                      </div>
                    </motion.div>
                    
                    <motion.h2 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#812F0F] via-amber-600 to-orange-500 bg-clip-text text-transparent"
                      style={{ fontFamily: 'Megrim, cursive' }}
                    >
                      {t('dashboard.welcomeMessage')}
                    </motion.h2>
                    
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-muted-foreground/80 mb-10 max-w-md mx-auto text-lg leading-relaxed"
                    >
                      {t('dashboard.welcomeSub')}
                    </motion.p>
                    
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAddFieldModal(true)}
                      className="group relative px-10 py-5 bg-gradient-to-r from-[#812F0F] via-[#9a3810] to-[#812F0F] text-white rounded-3xl font-bold text-lg shadow-2xl shadow-[#812F0F]/40 flex items-center gap-3 mx-auto overflow-hidden"
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      
                      <Plus className="w-6 h-6 relative z-10" />
                      <span className="relative z-10">{t('dashboard.addNewField')}</span>
                      
                      {/* Golden hour glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/20 to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Enhanced HomeView container */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#812F0F]/10 via-amber-500/5 to-orange-400/10 rounded-[32px] blur-2xl -z-10" />
                    <HomeView 
                    farmerName={userProfile?.name || farmerName}
                    cropInfo={cropInfo}
                    tasks={tasks}
                    budget={budget}
                    soilHealth={currentField?.soilProfile ? {
                        lastTested: currentField.soilProfile.lastTested,
                        status: currentField.soilProfile.results.riskLevel === 'high' ? 'Critical' : 
                                currentField.soilProfile.results.riskLevel === 'medium' ? 'Attention' : 'Good',
                        riskLevel: currentField.soilProfile.results.riskLevel
                    } : undefined}
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
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                      {/* Krishi Karma Widget with glow */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-400/10 to-[#812F0F]/20 rounded-[28px] blur-xl -z-10" />
                        <KrishiKarmaWidget 
                          points={karmaPoints} 
                          level={karmaLevel} 
                          nextLevelPoints={nextLevelPoints} 
                        />
                      </div>

                      {/* Daily Tasks with premium glassmorphism */}
                      <div className="relative group">
                        {/* Ambient glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#812F0F]/20 via-amber-500/10 to-orange-400/10 rounded-[28px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                        
                        <div className="backdrop-blur-xl bg-gradient-to-br from-white/80 to-white/60 dark:from-white/5 dark:to-white/[0.02] border border-white/30 dark:border-white/10 rounded-[28px] p-6 shadow-xl relative overflow-hidden">
                          {/* Top gradient accent */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#812F0F]/50 to-transparent" />
                          
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#812F0F] to-amber-600 flex items-center justify-center shadow-lg shadow-[#812F0F]/30">
                                <CheckCircle2 className="w-5 h-5 text-white" />
                                {/* Icon glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#812F0F] to-amber-600 rounded-2xl blur-md opacity-50 -z-10" />
                              </div>
                              <h3 className="font-bold text-foreground text-lg">Today's Tasks</h3>
                            </div>
                            <span className="text-sm font-bold text-muted-foreground backdrop-blur-sm bg-gradient-to-br from-muted/80 to-muted/60 px-4 py-1.5 rounded-full border border-white/20 shadow-sm">
                              {tasks.filter(t => t.completed).length}/{tasks.length}
                            </span>
                          </div>
                          
                          <div className="space-y-3">
                            {tasks.length === 0 ? (
                              <div className="text-center py-10">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center backdrop-blur-sm border border-white/20">
                                  <ClipboardList className="w-10 h-10 text-muted-foreground/40" />
                                </div>
                                <p className="text-muted-foreground font-medium">No tasks yet.</p>
                                <p className="text-xs text-muted-foreground/60 mt-2">Add a field to get recommendations.</p>
                              </div>
                            ) : (
                              tasks.map((task, idx) => (
                                <motion.div 
                                  key={task.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                  onClick={() => toggleTask(task.id)}
                                  className={`group/task relative flex items-start gap-3 p-4 rounded-2xl transition-all cursor-pointer border overflow-hidden ${
                                    task.completed 
                                      ? 'bg-gradient-to-br from-muted/40 to-muted/20 border-white/10 opacity-60' 
                                      : 'bg-gradient-to-br from-white/60 to-white/40 dark:from-white/5 dark:to-white/[0.02] border-white/30 dark:border-white/10 hover:border-[#812F0F]/40 hover:shadow-lg hover:shadow-[#812F0F]/10 backdrop-blur-sm'
                                  }`}
                                >
                                  {/* Hover gradient effect */}
                                  {!task.completed && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#812F0F]/5 via-amber-500/5 to-orange-400/5 opacity-0 group-hover/task:opacity-100 transition-opacity duration-300" />
                                  )}
                                  
                                  <div className={`relative mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                    task.completed
                                      ? 'bg-gradient-to-br from-[#812F0F] to-amber-600 border-[#812F0F] shadow-lg shadow-[#812F0F]/30'
                                      : 'border-muted-foreground/30 group-hover/task:border-[#812F0F]/50 group-hover/task:scale-110'
                                  }`}>
                                    {task.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                                  </div>
                                  
                                  <div className="flex-1 relative z-10">
                                    <p className={`text-sm font-medium transition-all ${
                                      task.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                                    }`}>
                                      {task.text}
                                    </p>
                                    <p className="text-xs text-muted-foreground/70 mt-1.5 flex items-center gap-1">
                                      {task.time}
                                    </p>
                                  </div>
                                </motion.div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                  </motion.div>
                </div>
                
                {/* Premium Quick Actions Grid with glassmorphism */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative mb-20"
                >
                  {/* Section ambient glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#812F0F]/10 via-amber-500/5 to-orange-400/10 rounded-3xl blur-3xl -z-10" />
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { 
                        icon: ScanLine, 
                        label: 'Scout Field', 
                        onClick: () => setActiveView('scouting'),
                        gradient: 'from-emerald-500 to-green-500',
                        bgGradient: 'from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20',
                        iconColor: 'text-emerald-600 dark:text-emerald-400'
                      },
                      { 
                        icon: Droplets, 
                        label: 'Log Input', 
                        onClick: () => setActiveView('inputs'),
                        gradient: 'from-blue-500 to-cyan-500',
                        bgGradient: 'from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20',
                        iconColor: 'text-blue-600 dark:text-blue-400'
                      },
                      { 
                        icon: Wheat, 
                        label: 'Harvest', 
                        onClick: () => setActiveView('harvest'),
                        gradient: 'from-amber-500 to-orange-500',
                        bgGradient: 'from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20',
                        iconColor: 'text-amber-600 dark:text-amber-400'
                      },
                      { 
                        icon: Wallet, 
                        label: 'Add Expense', 
                        onClick: () => setActiveView('expenses'),
                        gradient: 'from-[#812F0F] to-rose-600',
                        bgGradient: 'from-rose-100 to-red-100 dark:from-rose-900/20 dark:to-red-900/20',
                        iconColor: 'text-[#812F0F] dark:text-rose-400'
                      }
                    ].map((action, idx) => {
                      const Icon = action.icon;
                      return (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={action.onClick}
                        className="group/action relative flex flex-col items-center gap-3 p-5 backdrop-blur-xl bg-gradient-to-br from-white/70 to-white/50 dark:from-white/5 dark:to-white/[0.02] border border-white/30 dark:border-white/10 rounded-3xl hover:border-white/50 dark:hover:border-white/20 transition-all overflow-hidden shadow-lg hover:shadow-xl"
                      >
                        {/* Animated gradient background on hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${action.bgGradient} opacity-0 group-hover/action:opacity-100 transition-opacity duration-500`} />
                        
                        {/* Icon container with premium styling */}
                        <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${action.bgGradient} flex items-center justify-center group-hover/action:scale-110 transition-all duration-300 shadow-lg`}>
                          {Icon && <Icon className={`w-6 h-6 ${action.iconColor}`} />}
                          {/* Icon glow effect */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} rounded-2xl blur-xl opacity-0 group-hover/action:opacity-50 transition-opacity -z-10`} />
                        </div>
                        
                        <span className="relative text-xs font-bold text-center text-foreground/80 group-hover/action:text-foreground transition-colors z-10">
                          {action.label}
                        </span>
                      </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )}
          </>
        ) : activeView === 'crop_manager' ? (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 md:p-6 min-h-screen bg-gradient-to-br from-background/50 via-background/30 to-background/50"
          >
            <motion.button 
              whileHover={{ scale: 1.02, x: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveView('dashboard')} 
              className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors mb-6 md:mb-8 group backdrop-blur-sm"
            >
              <div className="p-2 rounded-2xl bg-gradient-to-br from-muted/60 to-muted/40 group-hover:from-muted/80 group-hover:to-muted/60 transition-all backdrop-blur-sm border border-white/20 shadow-sm">
                <ChevronDown className="w-4 h-4 rotate-90" />
              </div>
              <span className="font-bold text-sm">Back to Dashboard</span>
            </motion.button>
            <CropManager />
          </motion.div>
        ) : activeView === 'crop_cycle' ? (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="min-h-screen bg-gradient-to-br from-background/50 via-background/30 to-background/50"
          >
            <div className="px-4 pt-4 md:px-6 md:pt-6">
              <motion.button 
                whileHover={{ scale: 1.02, x: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveView('dashboard')} 
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors mb-4 group backdrop-blur-sm"
              >
                <div className="p-2 rounded-2xl bg-gradient-to-br from-muted/60 to-muted/40 group-hover:from-muted/80 group-hover:to-muted/60 transition-all backdrop-blur-sm border border-white/20 shadow-sm">
                  <ChevronDown className="w-4 h-4 rotate-90" />
                </div>
                <span className="font-bold text-sm">Back to Dashboard</span>
              </motion.button>
            </div>
            <CropCycleTracker />
          </motion.div>
        ) : activeView === 'expenses' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <BudgetOverview 
              budget={budget}
              expenses={currentFieldExpenses}
              onAddExpense={() => setShowExpenseTracker(true)}
              onBack={() => setActiveView('dashboard')}
              onUpdateBudget={handleUpdateBudget}
              fields={availableFields}
            />
          </motion.div>
        ) : activeView === 'profile' ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <UserProfile 
              onBack={() => setActiveView('dashboard')} 
              onProfileUpdate={(updatedProfile) => {
                setUserProfile(updatedProfile);
              }}
            />
          </motion.div>
        ) : activeView === 'scouting' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 md:p-6"
          >
            <FieldScouting 
              fields={availableFields} 
              onClose={() => setActiveView('dashboard')} 
            />
          </motion.div>
        ) : activeView === 'inputs' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 md:p-6"
          >
            <InputApplicationsLog 
              fields={availableFields} 
              onClose={() => setActiveView('dashboard')} 
            />
          </motion.div>
        ) : activeView === 'harvest' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 md:p-6"
          >
            <HarvestRecording 
              fields={availableFields} 
              onClose={() => setActiveView('dashboard')} 
            />
          </motion.div>
        ) : null}
      </div>

      {/* Bottom Navigation Bar - Only show when NOT in a full-screen modal mode like Expense Tracker */}
      {true && (
      <>
      <div className="fixed bottom-0 left-0 right-0 bg-[rgba(247,246,242,0.8)] backdrop-blur-xl border-t border-[rgba(129,47,15,0.15)] pl-[13.652px] pr-[13.677px] pt-[0.776px] pb-6 z-40 flex justify-between items-center content-stretch" data-name="Container">
        <button 
          type="button"
          onClick={() => setActiveView('dashboard')}
          className="h-[58.962px] relative rounded-[20px] shrink-0 w-[63.994px] flex flex-col items-center justify-center gap-[3.989px] py-[7.99px] cursor-pointer select-none touch-manipulation outline-none focus:outline-none active:scale-95 transition-transform duration-100"
          style={{ WebkitTapHighlightColor: 'transparent' }}
          data-name="Button"
        >
          <div className="relative shrink-0 size-[24px]" data-name="ph:farm-duotone">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
              <div className="absolute inset-[9.38%_6.25%_12.42%_6.25%]" data-name="Group">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 18.7683">
                  <g id="Group">
                    <path d={navSvgPaths.p3eec5a00} fill={activeView === 'dashboard' ? "#812F0F" : "#6b5c5c"} id="Vector" opacity="0.2" />
                    <path d={navSvgPaths.p20707f00} fill={activeView === 'dashboard' ? "#812F0F" : "#6b5c5c"} id="Vector_2" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <div className="h-[14.998px] relative shrink-0 w-[28.226px]" data-name="Text">
             <p className={`-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[14.5px] not-italic text-[10px] text-center top-[0.55px] ${activeView === 'dashboard' ? 'text-[#812f0f]' : 'text-[#6b5c5c]'}`}>Home</p>
          </div>
        </button>

        <button 
          type="button"
          onClick={() => setActiveView('expenses')}
          className="h-[58.962px] relative rounded-[20px] shrink-0 w-[63.994px] flex flex-col items-center justify-center gap-[3.989px] py-[7.99px] cursor-pointer select-none touch-manipulation outline-none focus:outline-none active:scale-95 transition-transform duration-100"
          style={{ WebkitTapHighlightColor: 'transparent' }}
          data-name="Button"
        >
          <div className="relative shrink-0 size-[24px]" data-name="solar:wallet-bold-duotone">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
              <g id="solar:wallet-bold-duotone">
                <path d={navSvgPaths.p5a56000} fill={activeView === 'expenses' ? "#812F0F" : "#6b5c5c"} id="Vector" />
                <path clipRule="evenodd" d={navSvgPaths.pefb70} fill={activeView === 'expenses' ? "#812F0F" : "#6b5c5c"} fillRule="evenodd" id="Vector_2" />
                <path d={navSvgPaths.p7fc9480} fill={activeView === 'expenses' ? "#812F0F" : "#6b5c5c"} id="Vector_3" opacity="0.5" />
              </g>
            </svg>
          </div>
          <div className="h-[14.998px] relative shrink-0 w-[46.304px]" data-name="Text">
             <p className={`-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[23.5px] not-italic text-[10px] text-center top-[0.55px] ${activeView === 'expenses' ? 'text-[#812f0f]' : 'text-[#6b5c5c]'}`}>Expenses</p>
          </div>
        </button>

        {/* Spacer for FAB */}
        <div className="h-0 shrink-0 w-[63.994px]" data-name="Container" />

        <button 
          type="button"
          onClick={() => setActiveView('scouting')}
          className="h-[58.962px] relative rounded-[20px] shrink-0 w-[63.994px] flex flex-col items-center justify-center gap-[3.989px] py-[7.99px] cursor-pointer select-none touch-manipulation outline-none focus:outline-none active:scale-95 transition-transform duration-100"
          style={{ WebkitTapHighlightColor: 'transparent' }}
          data-name="Button"
        >
          <div className="relative shrink-0 size-[24px]" data-name="si:search-duotone">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
              <div className="absolute inset-[12.5%]" data-name="Group">
                <div className="absolute inset-[-4.17%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.5 19.5">
                    <g id="Group">
                      <path d={navSvgPaths.p37f6d900} fill={activeView === 'scouting' ? "#812F0F" : "#6b5c5c"} fillOpacity="0.16" id="Vector" />
                      <path d={navSvgPaths.p35b6400} id="Vector_2" stroke={activeView === 'scouting' ? "#812F0F" : "#6b5c5c"} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[14.998px] relative shrink-0 w-[42.4px]" data-name="Text">
             <p className={`-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[21.5px] not-italic text-[10px] text-center top-[0.55px] ${activeView === 'scouting' ? 'text-[#812f0f]' : 'text-[#6b5c5c]'}`}>Scouting</p>
          </div>
        </button>

        <button 
          type="button"
          onClick={() => setActiveView('profile')}
          className="h-[58.962px] relative rounded-[20px] shrink-0 w-[63.994px] flex flex-col items-center justify-center gap-[3.989px] py-[7.99px] cursor-pointer select-none touch-manipulation outline-none focus:outline-none active:scale-95 transition-transform duration-100"
          style={{ WebkitTapHighlightColor: 'transparent' }}
          data-name="Button"
        >
          <div className="relative shrink-0 size-[24px]" data-name="fluent:person-16-filled">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
              <g id="fluent:person-16-filled">
                <path d={navSvgPaths.p195e7ef0} fill={activeView === 'profile' ? "#E4D6CE" : "#E4D6CE"} id="Vector" stroke={activeView === 'profile' ? "#812F0F" : "#6b5c5c"} />
              </g>
            </svg>
          </div>
          <div className="h-[14.998px] relative shrink-0 w-[30.857px]" data-name="Text">
             <p className={`-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[15.5px] not-italic text-[10px] text-center top-[0.55px] ${activeView === 'profile' ? 'text-[#812f0f]' : 'text-[#6b5c5c]'}`}>Profile</p>
          </div>
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
              <div className="bg-card/95 backdrop-blur-md border border-border shadow-2xl rounded-3xl p-4 flex flex-col gap-3">
               {/* Scout Field */}
               <button 
                 onClick={() => { setShowQuickAddMenu(false); setActiveView('scouting'); }}
                 className="flex flex-row items-center justify-start gap-4 p-3 hover:bg-muted/50 rounded-2xl transition-all group w-full relative overflow-hidden"
               >
                 <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm relative z-10">
                    <ScanLine className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                 </div>
                 <div className="flex flex-col items-start relative z-10">
                    <span className="text-base font-semibold text-foreground">Scout Field</span>
                    <span className="text-xs text-muted-foreground">AI Crop Diagnosis</span>
                 </div>
               </button>

               {/* Log Input */}
               <button 
                 onClick={() => { setShowQuickAddMenu(false); setActiveView('inputs'); }}
                 className="flex flex-row items-center justify-start gap-4 p-3 hover:bg-muted/50 rounded-2xl transition-all group w-full relative overflow-hidden"
               >
                 <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm relative z-10">
                    <Droplets className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                 </div>
                 <div className="flex flex-col items-start relative z-10">
                    <span className="text-base font-semibold text-foreground">Log Input</span>
                    <span className="text-xs text-muted-foreground">Fertilizer & Sprays</span>
                 </div>
               </button>

               {/* Record Harvest */}
               <button 
                 onClick={() => { setShowQuickAddMenu(false); setActiveView('harvest'); }}
                 className="flex flex-row items-center justify-start gap-4 p-3 hover:bg-muted/50 rounded-2xl transition-all group w-full relative overflow-hidden"
               >
                 <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm relative z-10">
                    <Wheat className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                 </div>
                 <div className="flex flex-col items-start relative z-10">
                    <span className="text-base font-semibold text-foreground">Record Harvest</span>
                    <span className="text-xs text-muted-foreground">Yield & Production</span>
                 </div>
               </button>

               {/* Add Expense */}
               <button 
                 onClick={() => { setShowQuickAddMenu(false); setShowExpenseTracker(true); }}
                 className="flex flex-row items-center justify-start gap-4 p-3 hover:bg-muted/50 rounded-2xl transition-all group w-full relative overflow-hidden"
               >
                 <div className="absolute inset-0 bg-gradient-to-r from-[#812F0F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="w-12 h-12 rounded-full bg-[#812F0F]/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm relative z-10">
                    <Wallet className="w-6 h-6 text-[#812F0F]" />
                 </div>
                 <div className="flex flex-col items-start relative z-10">
                    <span className="text-base font-semibold text-foreground">Add Expense</span>
                    <span className="text-xs text-muted-foreground">Costs & Revenue</span>
                 </div>
               </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setShowQuickAddMenu(!showQuickAddMenu)}
          className={`w-16 h-16 bg-[#812F0F] text-white rounded-full shadow-xl shadow-[#812F0F]/30 ring-4 ring-background flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 ${showQuickAddMenu ? 'rotate-45 bg-red-500 from-red-500 to-rose-600' : ''}`}
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
              initialFieldId={selectedFieldId || undefined}
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
          currentFieldName={currentField?.name}
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
          testResults={displayedSoilResult || selfTestResults[selfTestResults.length - 1]}
          onSaveProfile={handleSaveSoilProfile}
          fields={availableFields}
          isSaved={viewingStoredProfile}
          accumulatedTests={accumulatedTests}
          onRunAnotherTest={() => { setShowSoilSummary(false); setShowSelfSoilTesting(true); }}
        />
      )}

      {/* Farming Journal Flow */}
      {showFarmingJournal && (
        <FarmingJournal 
          onClose={() => setShowFarmingJournal(false)} 
          onSave={handleFarmingJournalSave}
          currentFieldId={selectedFieldId || undefined}
          fields={availableFields}
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
          fields={availableFields}
          onUpdateField={async (id, updates) => {
             await updateField(id, updates);
             await loadFields();
          }}
          onCreateField={async (field) => {
              await createField(field);
              await loadFields();
          }}
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

      {/* MSChatbot - Hidden for now */}
      {/* <MSChatbot /> */}
      
      {/* Demo Helper - Shows prototype hints */}
      <DemoHelper />
    </div>
  );
}