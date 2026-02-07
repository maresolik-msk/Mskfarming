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
  MapPin
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
  const [activeView, setActiveView] = useState<'dashboard' | 'expenses' | 'profile' | 'crop_manager' | 'scouting' | 'inputs' | 'harvest'>('dashboard'); // Launch features only

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
    setSelfTestResults([...selfTestResults, result]);
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
                              toast.success(t('common.switch_field_success', { fieldName: field.name }));
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
                <SheetContent side="right" className="w-[300px] sm:w-[350px] border-l border-white/10 bg-card/95 backdrop-blur-xl overflow-y-auto">
                  <SheetHeader className="mb-8">
                    <SheetTitle className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#812F0F] to-[#963714] flex items-center justify-center text-2xl text-white shadow-xl shadow-[#812F0F]/25">
                           <div className="w-8 h-8" style={{ '--fill-0': '#ffffff' } as CSSProperties}>
                             <Logo />
                           </div>
                        </div>
                        <span className="text-2xl font-bold font-[Megrim]">{t('MILA')}</span>
                      </div>
                      <LanguageSwitcher />
                    </SheetTitle>
                    <SheetDescription className="hidden">
                      Access dashboard navigation and quick actions
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="flex flex-col gap-2 pb-8">
                    <div className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-[0.15em] mb-4 px-3">
                      {t('menu.navigation')}
                    </div>
                    
                    <SheetClose asChild>
                      <button 
                        onClick={() => setActiveView('dashboard')}
                        className={`flex items-center gap-4 px-5 py-4 rounded-0px transition-all duration-300 group ${activeView === 'dashboard' ? 'bg-[#812F0F] text-white shadow-lg shadow-[#812F0F]/20' : 'hover:bg-muted/60 text-foreground hover:scale-[1.02]'}`}
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-semibold text-[15px]">{t('menu.dashboard')}</span>
                        {activeView === 'dashboard' && <div className="w-2 h-2 rounded-full bg-white ml-auto shadow-sm" />}
                      </button>
                    </SheetClose>

                    <SheetClose asChild>
                      <button 
                        onClick={() => setActiveView('crop_manager')}
                        className={`flex items-center gap-4 px-5 py-4 rounded-0px transition-all duration-300 group ${activeView === 'crop_manager' ? 'bg-[#812F0F] text-white shadow-lg shadow-[#812F0F]/20' : 'hover:bg-muted/60 text-foreground hover:scale-[1.02]'}`}
                      >
                        <Leaf className="w-5 h-5" />
                        <span className="font-semibold text-[15px]">Crop Manager</span>
                      </button>
                    </SheetClose>

                    <SheetClose asChild>
                      <button 
                        onClick={() => setActiveView('expenses')}
                        className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${activeView === 'expenses' ? 'bg-[#812F0F] text-white shadow-lg shadow-[#812F0F]/20' : 'hover:bg-muted/60 text-foreground hover:scale-[1.02]'}`}
                      >
                        <Calculator className="w-5 h-5" />
                        <span className="font-semibold text-[15px]">{t('menu.expenses')}</span>
                        {activeView === 'expenses' && <div className="w-2 h-2 rounded-full bg-white ml-auto shadow-sm" />}
                      </button>
                    </SheetClose>

                    <SheetClose asChild>
                      <button 
                        onClick={() => setActiveView('profile')}
                        className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${activeView === 'profile' ? 'bg-[#812F0F] text-white shadow-lg shadow-[#812F0F]/20' : 'hover:bg-muted/60 text-foreground hover:scale-[1.02]'}`}
                      >
                        <User className="w-5 h-5" />
                        <span className="font-semibold text-[15px]">{t('menu.profile')}</span>
                        {activeView === 'profile' && <div className="w-2 h-2 rounded-full bg-white ml-auto shadow-sm" />}
                      </button>
                    </SheetClose>

                    {/* HIDDEN FOR LAUNCH: Journal History, Market Prices */}

                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-6" />
                    
                    <div className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-[0.15em] mb-4 px-3">
                      {t('farming tools')}
                    </div>

                    <SheetClose asChild>
                      <button 
                        onClick={() => setActiveView('scouting')}
                        className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${activeView === 'scouting' ? 'bg-[#812F0F] text-white shadow-lg shadow-[#812F0F]/20' : 'hover:bg-muted/60 text-foreground hover:scale-[1.02]'}`}
                      >
                        <Search className="w-5 h-5" />
                        <span className="font-semibold text-[15px]">Field Scouting</span>
                      </button>
                    </SheetClose>

                    <SheetClose asChild>
                      <button 
                        onClick={() => setActiveView('inputs')}
                        className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${activeView === 'inputs' ? 'bg-[#812F0F] text-white shadow-lg shadow-[#812F0F]/20' : 'hover:bg-muted/60 text-foreground hover:scale-[1.02]'}`}
                      >
                        <ClipboardList className="w-5 h-5" />
                        <span className="font-semibold text-[15px]">Input Applications</span>
                      </button>
                    </SheetClose>

                    <SheetClose asChild>
                      <button 
                        onClick={() => setActiveView('harvest')}
                        className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${activeView === 'harvest' ? 'bg-[#812F0F] text-white shadow-lg shadow-[#812F0F]/20' : 'hover:bg-muted/60 text-foreground hover:scale-[1.02]'}`}
                      >
                        <Wheat className="w-5 h-5" />
                        <span className="font-semibold text-[15px]">Harvest Records</span>
                      </button>
                    </SheetClose>

                    {/* HIDDEN FOR LAUNCH: Crop Simulator, Animal Husbandry, Machinery, Seed Selection, Soil Testing, Satellite Monitoring */}
                    
                    <div className="mt-auto pt-8">
                      <SheetClose asChild>
                        <button 
                          onClick={onLogout}
                          className="flex items-center gap-2 px-5 py-3 text-red-500 hover:bg-red-500/10 rounded-[0px] transition-colors w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="font-medium">{t('menu.logout')}</span>
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
                        bgGradient: 'from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20'
                      },
                      { 
                        icon: Droplets, 
                        label: 'Log Input', 
                        onClick: () => setActiveView('inputs'),
                        gradient: 'from-blue-500 to-cyan-500',
                        bgGradient: 'from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20'
                      },
                      { 
                        icon: Wheat, 
                        label: 'Harvest', 
                        onClick: () => setActiveView('harvest'),
                        gradient: 'from-amber-500 to-orange-500',
                        bgGradient: 'from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20'
                      },
                      { 
                        icon: Wallet, 
                        label: 'Add Expense', 
                        onClick: () => setActiveView('expenses'),
                        gradient: 'from-[#812F0F] to-rose-600',
                        bgGradient: 'from-rose-100 to-red-100 dark:from-rose-900/20 dark:to-red-900/20'
                      }
                    ].map((action, idx) => (
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
                          {action.icon && <action.icon className={`w-6 h-6 bg-gradient-to-br ${action.gradient} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text', backgroundClip: 'text' }} />}
                          {/* Icon glow effect */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} rounded-2xl blur-xl opacity-0 group-hover/action:opacity-50 transition-opacity -z-10`} />
                        </div>
                        
                        <span className="relative text-xs font-bold text-center text-foreground/80 group-hover/action:text-foreground transition-colors z-10">
                          {action.label}
                        </span>
                      </motion.button>
                    ))}
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