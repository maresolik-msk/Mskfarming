import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Mic,
  Camera,
  Wallet,
  HelpCircle,
  Volume2,
  CheckCircle2,
  Circle,
  Sun,
  Droplets,
  Sprout,
  TrendingUp,
  Calendar,
  BarChart3,
  Menu,
  LogOut,
  User,
  Settings,
} from 'lucide-react';
import { VoiceJournalEntry } from './VoiceJournalEntry';
import { PhotoCapture } from './PhotoCapture';
import { ExpenseTracker } from './ExpenseTracker';
import { DemoHelper } from './DemoHelper';
import { WeatherForecast } from './WeatherForecast';
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
}

export function MainDashboard({ farmerName, onLogout }: MainDashboardProps) {
  const [showVoiceJournal, setShowVoiceJournal] = useState(false);
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [showExpenseTracker, setShowExpenseTracker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'journal' | 'expenses' | 'field' | 'market'>('dashboard');

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

  const [cropInfo] = useState({
    name: 'Tomato',
    field: 'North Field',
    day: 42,
    totalDays: 120,
    progress: 35,
  });

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

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-xl">
                🌾
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Good Morning</div>
                <div className="text-foreground">{farmerName}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="bg-muted rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Day</div>
              <div className="text-foreground">{cropInfo.day}/{cropInfo.totalDays}</div>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Budget</div>
              <div className="text-foreground">{Math.round((budget.used/budget.total)*100)}%</div>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Progress</div>
              <div className="text-foreground">{cropInfo.progress}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Dropdown */}
      {showMenu && (
        <div className="absolute right-4 top-16 bg-card rounded-lg shadow-lg border border-border p-2 z-50">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-lg transition-colors text-red-600"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Field Info */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 border border-primary/20">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sprout className="w-5 h-5 text-primary" />
                <span className="text-lg text-foreground">{cropInfo.field}</span>
              </div>
              <h3 className="text-2xl mb-1 text-foreground">{cropInfo.name}</h3>
              <p className="text-muted-foreground">Day {cropInfo.day} of {cropInfo.totalDays}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl mb-1">{cropInfo.progress}%</div>
              <div className="text-xs text-muted-foreground">to harvest</div>
            </div>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${cropInfo.progress}%` }}
            />
          </div>
        </div>

        {/* Today's Guidance */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl text-foreground">Today's Guidance</h3>
            <button
              onClick={playGuidance}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              Play
            </button>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                className="flex items-start gap-3 p-4 bg-muted rounded-lg"
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className="mt-0.5"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                <div className="flex-1">
                  <div className={`text-sm mb-1 ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {task.text}
                  </div>
                  <div className="text-xs text-muted-foreground">{task.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h3 className="text-xl mb-4 text-foreground">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowVoiceJournal(true)}
              className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Mic className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-foreground">Voice Entry</span>
            </button>

            <button
              onClick={() => setShowPhotoCapture(true)}
              className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Camera className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-foreground">Photo</span>
            </button>

            <button
              onClick={() => setShowExpenseTracker(true)}
              className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-foreground">Add Expense</span>
            </button>

            <button
              onClick={() => toast.info('AI assistant coming soon!')}
              className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-foreground">Ask</span>
            </button>
          </div>
        </div>

        {/* Weather Forecast */}
        <WeatherForecast />

        {/* Alerts */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl text-foreground">Alerts</h3>
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {/* Budget Alert */}
            {(budget.used / budget.total) > 0.9 && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <div className="text-xl">🚨</div>
                <div className="flex-1">
                  <div className="text-foreground mb-1">Budget Critical - {Math.round((budget.used / budget.total) * 100)}% Used!</div>
                  <div className="text-sm text-muted-foreground">
                    Only ₹{(budget.total - budget.used).toLocaleString()} remaining of ₹{budget.total.toLocaleString()} budget
                  </div>
                </div>
              </div>
            )}
            {(budget.used / budget.total) > 0.75 && (budget.used / budget.total) <= 0.9 && (
              <div className="flex items-start gap-3 p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <div className="text-xl">⚠️</div>
                <div className="flex-1">
                  <div className="text-foreground mb-1">Budget Alert - {Math.round((budget.used / budget.total) * 100)}% Used</div>
                  <div className="text-sm text-muted-foreground">
                    ₹{(budget.total - budget.used).toLocaleString()} remaining of ₹{budget.total.toLocaleString()} budget
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <div className="text-xl">⚠️</div>
              <div className="flex-1">
                <div className="text-foreground mb-1">Fertilizer due in 3 days</div>
                <div className="text-sm text-muted-foreground">NPK 19:19:19 - 10kg needed</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="text-xl">📅</div>
              <div className="flex-1">
                <div className="text-foreground mb-1">Harvest window opens in 2 weeks</div>
                <div className="text-sm text-muted-foreground">Prepare storage & transport</div>
              </div>
            </div>
          </div>
        </div>

        {/* This Season */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h3 className="text-xl mb-4 text-foreground">This Season</h3>
          
          <div className="space-y-4">
            {/* Budget */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Budget</span>
                <span className="text-foreground">
                  ₹{budget.used.toLocaleString()} / ₹{budget.total.toLocaleString()}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    (budget.used / budget.total) * 100 > 90
                      ? 'bg-red-500'
                      : (budget.used / budget.total) * 100 > 75
                      ? 'bg-orange-500'
                      : 'bg-primary'
                  }`}
                  style={{ width: `${Math.min((budget.used / budget.total) * 100, 100)}%` }}
                />
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {Math.round((budget.used / budget.total) * 100)}% used • ₹{(budget.total - budget.used).toLocaleString()} remaining
              </div>
            </div>

            {/* Expected Yield */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Est. Yield</div>
                <div className="text-2xl text-foreground">8 tons</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Est. Revenue</div>
                <div className="text-2xl text-primary">₹48,000</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl text-foreground">Recent Expenses</h3>
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>
          {expenses.length > 0 ? (
            <div className="space-y-3">
              {expenses.slice(0, 5).map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {expense.category === 'seeds' && '🌱'}
                      {expense.category === 'fertilizer' && '🧪'}
                      {expense.category === 'labor' && '👷'}
                      {expense.category === 'water' && '💧'}
                      {expense.category === 'pesticide' && '🛡️'}
                      {expense.category === 'other' && '📦'}
                    </div>
                    <div>
                      <div className="text-foreground capitalize">{expense.category}</div>
                      <div className="text-xs text-muted-foreground">
                        {expense.description || 'No description'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {expense.date.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-lg text-foreground">₹{expense.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No expenses recorded yet
            </div>
          )}
        </div>
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
        />
      )}

      {/* Demo Helper */}
      <DemoHelper />
    </div>
  );
}