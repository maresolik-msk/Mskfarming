import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
  id: string;
  title: string;
  time: 'morning' | 'afternoon' | 'evening';
  completed: boolean;
  type: 'water' | 'pest' | 'fertilizer' | 'check' | 'other';
}

export interface JournalEntry {
  id: string;
  type: 'voice' | 'photo' | 'text';
  content: string;
  timestamp: Date;
  field: string;
  weather?: string;
  photoUrl?: string;
  aiAnalysis?: string;
}

export interface Expense {
  id: string;
  category: 'seeds' | 'fertilizer' | 'labor' | 'water' | 'pesticide' | 'other';
  amount: number;
  description: string;
  date: Date;
  field: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  language: string;
  location: string;
  onboardingComplete: boolean;
  farmSize: number;
  fieldName: string; // Deprecated, use fields array
  crop: string; // Deprecated, use cropPlans
  plantingDate: Date; // Deprecated
  budget: number;
  
  // New Profile Fields
  farmerType?: 'Small' | 'Marginal' | 'Medium' | 'Large';
  farmingSystem?: 'Irrigated' | 'Rainfed'; // Farm type
  croppingIntent?: 'Commercial' | 'Household' | 'Mixed';
}

export interface Field {
  id: string;
  name: string;
  acres: number;
  location: string; // Village/Block
  soilType: string;
  irrigationMethod?: 'Drip' | 'Flood' | 'Sprinkler' | 'Rainfed';
  waterSource?: 'Borewell' | 'Tank' | 'Canal' | 'Rainfed';
  slope?: 'Flat' | 'Gentle' | 'Steep';
  drainageIssues?: boolean;
  previousCrop?: string;
  boundary?: { lat: number; lng: number }[]; // For map/GPS
}

export interface CropPlan {
  id: string;
  fieldId: string;
  season: 'Kharif' | 'Rabi' | 'Summer';
  cropName: string;
  variety: string;
  sowingDate: Date;
  isIntercropping: boolean;
  interCropName?: string;
  
  // Auto-generated data
  harvestDateEstimated?: Date;
  riskChecklist?: string[];
  seedRate?: string;
  baseNutrients?: string;
}

interface AppState {
  // User
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  
  // Farm & Fields
  fields: Field[];
  addField: (field: Field) => void;
  updateField: (id: string, updates: Partial<Field>) => void;
  deleteField: (id: string) => void;

  // Crop Plans
  cropPlans: CropPlan[];
  addCropPlan: (plan: CropPlan) => void;
  
  // Tasks
  tasks: Task[];
  toggleTask: (id: string) => void;
  addTask: (task: Task) => void; // Added for plan generation
  
  // Journal
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => void;
  
  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  totalExpenses: () => number;
  
  // Season
  seasonDay: number;
  totalSeasonDays: number;
  
  // Alerts
  alerts: string[];
  addAlert: (alert: string) => void; // Added for plan generation
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (updates) => set((state) => ({ 
        user: state.user ? { ...state.user, ...updates } : null 
      })),

      fields: [],
      addField: (field) => set((state) => ({ fields: [...state.fields, field] })),
      updateField: (id, updates) => set((state) => ({
        fields: state.fields.map(f => f.id === id ? { ...f, ...updates } : f)
      })),
      deleteField: (id) => set((state) => ({
        fields: state.fields.filter(f => f.id !== id)
      })),

      cropPlans: [],
      addCropPlan: (plan) => set((state) => ({ cropPlans: [...state.cropPlans, plan] })),

      tasks: [
        {
          id: '1',
          title: 'Water your field between 5-7 PM (30 min/acre)',
          time: 'evening',
          completed: false,
          type: 'water',
        },
        {
          id: '2',
          title: 'Check plants for whitefly (underside of leaves)',
          time: 'morning',
          completed: false,
          type: 'pest',
        },
        {
          id: '3',
          title: 'Hot day expected - increase watering by 20%',
          time: 'afternoon',
          completed: false,
          type: 'other',
        },
      ],
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        })),
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),

      journalEntries: [],
      addJournalEntry: (entry) =>
        set((state) => ({
          journalEntries: [
            {
              ...entry,
              id: Date.now().toString(),
              timestamp: new Date(),
            },
            ...state.journalEntries,
          ],
        })),

      expenses: [],
      addExpense: (expense) =>
        set((state) => ({
          expenses: [
            {
              ...expense,
              id: Date.now().toString(),
              date: new Date(),
            },
            ...state.expenses,
          ],
        })),
      totalExpenses: () => {
        const state = get();
        return state.expenses.reduce((sum, exp) => sum + exp.amount, 0);
      },

      seasonDay: 42,
      totalSeasonDays: 120,

      alerts: [
        'Fertilizer application due in 3 days (NPK 19:19:19 - 10kg)',
        'Harvest window opens in 2 weeks',
      ],
      addAlert: (alert) => set((state) => ({ alerts: [...state.alerts, alert] })),
    }),
    {
      name: 'farm-companion-store',
    }
  )
);
