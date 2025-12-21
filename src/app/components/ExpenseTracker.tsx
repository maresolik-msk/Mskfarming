import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Check, Mic } from 'lucide-react';
import { toast } from 'sonner';

interface ExpenseTrackerProps {
  onSave: (expense: {
    category: string;
    amount: number;
    description: string;
    date: Date;
    field: string;
  }) => void;
  onClose: () => void;
  currentBudget: {
    used: number;
    total: number;
  };
}

export function ExpenseTracker({ onSave, onClose, currentBudget }: ExpenseTrackerProps) {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [useVoice, setUseVoice] = useState(false);

  const categories = [
    { id: 'seeds', label: 'Seeds', icon: '🌱' },
    { id: 'fertilizer', label: 'Fertilizer', icon: '🧪' },
    { id: 'labor', label: 'Labor', icon: '👷' },
    { id: 'water', label: 'Water/Electricity', icon: '💧' },
    { id: 'pesticide', label: 'Pesticide', icon: '🛡️' },
    { id: 'other', label: 'Other', icon: '📦' },
  ];

  const handleVoiceInput = () => {
    setUseVoice(true);
    // Simulate voice recognition
    setTimeout(() => {
      const samples = [
        { cat: 'fertilizer', amt: '500', desc: 'NPK fertilizer for tomato field' },
        { cat: 'labor', amt: '1500', desc: 'Hired 3 workers for weeding' },
        { cat: 'pesticide', amt: '350', desc: 'Neem spray for pest control' },
      ];
      const sample = samples[Math.floor(Math.random() * samples.length)];
      setCategory(sample.cat);
      setAmount(sample.amt);
      setDescription(sample.desc);
      setUseVoice(false);
      toast.success('Voice recognized');
    }, 2000);
  };

  const handleSave = () => {
    if (!category || !amount) {
      toast.error('Please fill required fields');
      return;
    }

    const numAmount = parseFloat(amount);
    const newUsed = currentBudget.used + numAmount;
    
    onSave({
      category,
      amount: numAmount,
      description,
      date: new Date(),
      field: 'North Field',
    });

    // Show budget warning if needed
    const percentUsed = (newUsed / currentBudget.total) * 100;
    if (percentUsed > 90) {
      toast.warning('Budget almost exhausted!');
    } else if (percentUsed > 75) {
      toast.info('75% of budget used');
    } else {
      toast.success('Expense added');
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl p-6 max-w-lg w-full shadow-2xl px-[27px] py-[16px] max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl text-foreground">Add Expense</h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voice Input Option */}
        <div className="mb-6 p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
          <button
            onClick={handleVoiceInput}
            disabled={useVoice}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            <Mic className="w-5 h-5" />
            {useVoice ? 'Listening...' : 'Speak to Add Expense'}
          </button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Say: "Spent 500 rupees on fertilizer today"
          </p>
        </div>

        {/* Category Selection */}
        <div className="mb-6">
          <label className="block mb-3 text-foreground">Category *</label>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  category === cat.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-2xl mb-1">{cat.icon}</div>
                <div className="text-xs">{cat.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div className="mb-6">
          <label className="block mb-2 text-foreground">Amount (₹) *</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors text-2xl"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block mb-2 text-foreground">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What did you buy?"
            className="w-full px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
            rows={3}
          />
        </div>

        {/* Budget Preview */}
        {amount && (
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Budget Used</span>
              <span className="text-sm text-foreground">
                ₹{(currentBudget.used + parseFloat(amount || '0')).toLocaleString()} / ₹{currentBudget.total.toLocaleString()}
              </span>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  ((currentBudget.used + parseFloat(amount || '0')) / currentBudget.total) * 100 > 90
                    ? 'bg-red-500'
                    : ((currentBudget.used + parseFloat(amount || '0')) / currentBudget.total) * 100 > 75
                    ? 'bg-orange-500'
                    : 'bg-primary'
                }`}
                style={{
                  width: `${Math.min(
                    ((currentBudget.used + parseFloat(amount || '0')) / currentBudget.total) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Remaining: ₹{(currentBudget.total - currentBudget.used - parseFloat(amount || '0')).toLocaleString()}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg border-2 border-border hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!category || !amount}
            className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Save Expense
          </button>
        </div>
      </motion.div>
    </div>
  );
}