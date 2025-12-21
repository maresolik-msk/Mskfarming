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
  fieldName: string;
  crop: string;
  plantingDate: Date;
  budget: number;
}

interface AppState {
  // User
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  
  // Tasks
  tasks: Task[];
  toggleTask: (id: string) => void;
  
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
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),

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
    }),
    {
      name: 'farm-companion-store',
    }
  )
);
