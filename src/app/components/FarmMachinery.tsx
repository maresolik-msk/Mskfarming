import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  Wrench, 
  Calendar, 
  Trash2, 
  AlertTriangle,
  CheckCircle2,
  Hammer,
  Droplets,
  Tractor,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface Machinery {
  id: string;
  name: string;
  type: 'Tractor' | 'Sprayer' | 'Irrigation' | 'Harvester' | 'Hand Tool' | 'Other';
  brand?: string;
  model?: string;
  purchaseDate?: string;
  quantity: number;
  status: 'Operational' | 'Maintenance Needed' | 'Broken';
  lastMaintenance?: string;
  nextMaintenance?: string;
  notes?: string;
}

interface FarmMachineryProps {
  onBack: () => void;
}

export function FarmMachinery({ onBack }: FarmMachineryProps) {
  const [machinery, setMachinery] = useState<Machinery[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('All');

  // Load from localStorage on mount
  useEffect(() => {
    const savedMachinery = localStorage.getItem('farm_machinery');
    if (savedMachinery) {
      try {
        setMachinery(JSON.parse(savedMachinery));
      } catch (e) {
        console.error('Failed to parse machinery', e);
      }
    } else {
        // Add some dummy data if empty
        const dummyData: Machinery[] = [
            {
                id: '1',
                name: 'Knapsack Sprayer',
                type: 'Sprayer',
                brand: 'KisanCraft',
                quantity: 2,
                status: 'Operational',
                purchaseDate: '2023-05-15',
                lastMaintenance: '2024-01-10'
            },
            {
                id: '2',
                name: 'Drip Irrigation Pipes',
                type: 'Irrigation',
                brand: 'Jain Irrigation',
                quantity: 500, // meters or bundles
                status: 'Maintenance Needed',
                notes: 'Leaking in sector 4',
                purchaseDate: '2022-11-20'
            },
            {
                id: '3',
                name: 'Rotavator',
                type: 'Tractor',
                brand: 'Mahindra',
                quantity: 1,
                status: 'Operational',
                purchaseDate: '2021-08-05',
                nextMaintenance: new Date(Date.now() + 86400000 * 15).toISOString()
            }
        ];
        setMachinery(dummyData);
        localStorage.setItem('farm_machinery', JSON.stringify(dummyData));
    }
  }, []);

  const saveMachinery = (items: Machinery[]) => {
    setMachinery(items);
    localStorage.setItem('farm_machinery', JSON.stringify(items));
  };

  const handleAddMachinery = (data: any) => {
    const newItem: Machinery = {
        id: Date.now().toString(),
        ...data
    };
    const updated = [newItem, ...machinery];
    saveMachinery(updated);
    setShowAddModal(false);
    toast.success(`${newItem.name} added successfully`);
  };

  const handleDelete = (id: string) => {
    if(confirm('Are you sure you want to remove this item?')) {
        const updated = machinery.filter(m => m.id !== id);
        saveMachinery(updated);
        toast.success('Item removed');
    }
  };

  const filteredMachinery = filterType === 'All' 
    ? machinery 
    : machinery.filter(m => m.type === filterType);

  const stats = {
    total: machinery.reduce((acc, curr) => acc + (curr.quantity || 1), 0),
    maintenance: machinery.filter(m => m.status === 'Maintenance Needed').length,
    broken: machinery.filter(m => m.status === 'Broken').length,
    operational: machinery.filter(m => m.status === 'Operational').length
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
            >
              <svg className="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div>
                <h1 className="font-bold text-lg leading-tight">Farm Machinery</h1>
                <p className="text-xs text-muted-foreground">Equipment & Tools</p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-primary-foreground p-2 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-card border border-border p-3 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-sm">
                <span className="text-2xl font-black text-foreground">{stats.total}</span>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Total Items</span>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 p-3 rounded-2xl flex flex-col items-center justify-center gap-1">
                <span className="text-2xl font-black text-green-600 dark:text-green-400">{stats.operational}</span>
                <span className="text-xs text-green-600/70 dark:text-green-400/70 font-medium uppercase tracking-wide">Working</span>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 p-3 rounded-2xl flex flex-col items-center justify-center gap-1">
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats.maintenance}</span>
                <span className="text-xs text-amber-600/70 dark:text-amber-400/70 font-medium uppercase tracking-wide">Need Service</span>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-3 rounded-2xl flex flex-col items-center justify-center gap-1">
                <span className="text-2xl font-black text-red-600 dark:text-red-400">{stats.broken}</span>
                <span className="text-xs text-red-600/70 dark:text-red-400/70 font-medium uppercase tracking-wide">Broken</span>
            </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {['All', 'Tractor', 'Sprayer', 'Irrigation', 'Harvester', 'Hand Tool', 'Other'].map(type => (
                <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                        filterType === type 
                            ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20' 
                            : 'bg-card text-muted-foreground border-border hover:bg-muted'
                    }`}
                >
                    {type}
                </button>
            ))}
        </div>

        {/* List */}
        <div className="space-y-3">
            {filteredMachinery.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Wrench className="w-8 h-8 opacity-50" />
                    </div>
                    <p>No equipment found in this category.</p>
                </div>
            ) : (
                filteredMachinery.map(item => (
                    <MachineryCard 
                        key={item.id} 
                        item={item} 
                        onDelete={() => handleDelete(item.id)}
                    />
                ))
            )}
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
            <AddMachineryModal 
                onClose={() => setShowAddModal(false)}
                onSave={handleAddMachinery}
            />
        )}
      </AnimatePresence>
    </div>
  );
}

function MachineryCard({ item, onDelete }: { item: Machinery, onDelete: () => void }) {
    const statusColor = {
        'Operational': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        'Maintenance Needed': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        'Broken': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    }[item.status];

    const StatusIcon = {
        'Operational': CheckCircle2,
        'Maintenance Needed': Wrench,
        'Broken': AlertTriangle,
    }[item.status];

    const TypeIcon = {
        'Tractor': Tractor,
        'Sprayer': Droplets,
        'Irrigation': Droplets,
        'Hand Tool': Hammer,
        'Harvester': Settings,
        'Other': Settings
    }[item.type] || Wrench;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-start gap-4 relative group"
        >
            <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center shrink-0">
                <TypeIcon className="w-7 h-7 text-foreground/70" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-bold text-foreground truncate">{item.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {item.brand} {item.model} • Qty: {item.quantity}
                        </p>
                    </div>
                    <div className={`text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 ${statusColor}`}>
                        <StatusIcon className="w-3 h-3" />
                        {item.status === 'Maintenance Needed' ? 'Service Due' : item.status}
                    </div>
                </div>

                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    {item.lastMaintenance && (
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Last Service: {new Date(item.lastMaintenance).toLocaleDateString()}</span>
                        </div>
                    )}
                    {!item.lastMaintenance && item.purchaseDate && (
                         <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Purchased: {new Date(item.purchaseDate).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>
            </div>

            <button 
                onClick={onDelete}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </motion.div>
    );
}

function AddMachineryModal({ onClose, onSave }: { onClose: () => void, onSave: (data: any) => void }) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'Sprayer',
        brand: '',
        model: '',
        quantity: 1,
        status: 'Operational',
        purchaseDate: '',
        lastMaintenance: '',
        notes: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-card w-full max-w-md rounded-3xl shadow-2xl border border-border overflow-hidden max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
                    <h2 className="text-xl font-bold">Add Equipment</h2>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Equipment Name</label>
                        <input 
                            required
                            className="w-full p-3 bg-muted/30 border border-border rounded-xl"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            placeholder="e.g. Backpack Sprayer"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Type</label>
                            <select 
                                className="w-full p-3 bg-muted/30 border border-border rounded-xl"
                                value={formData.type}
                                onChange={e => setFormData({...formData, type: e.target.value})}
                            >
                                <option>Sprayer</option>
                                <option>Irrigation</option>
                                <option>Tractor</option>
                                <option>Harvester</option>
                                <option>Hand Tool</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Quantity</label>
                            <input 
                                type="number"
                                min="1"
                                className="w-full p-3 bg-muted/30 border border-border rounded-xl"
                                value={formData.quantity}
                                onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Brand</label>
                            <input 
                                className="w-full p-3 bg-muted/30 border border-border rounded-xl"
                                value={formData.brand}
                                onChange={e => setFormData({...formData, brand: e.target.value})}
                                placeholder="e.g. John Deere"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Model</label>
                            <input 
                                className="w-full p-3 bg-muted/30 border border-border rounded-xl"
                                value={formData.model}
                                onChange={e => setFormData({...formData, model: e.target.value})}
                                placeholder="e.g. 2024"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Current Status</label>
                        <select 
                            className="w-full p-3 bg-muted/30 border border-border rounded-xl"
                            value={formData.status}
                            onChange={e => setFormData({...formData, status: e.target.value})}
                        >
                            <option>Operational</option>
                            <option>Maintenance Needed</option>
                            <option>Broken</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Purchase Date</label>
                            <input 
                                type="date"
                                className="w-full p-3 bg-muted/30 border border-border rounded-xl"
                                value={formData.purchaseDate}
                                onChange={e => setFormData({...formData, purchaseDate: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Last Service</label>
                            <input 
                                type="date"
                                className="w-full p-3 bg-muted/30 border border-border rounded-xl"
                                value={formData.lastMaintenance}
                                onChange={e => setFormData({...formData, lastMaintenance: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Notes</label>
                        <textarea 
                            className="w-full p-3 bg-muted/30 border border-border rounded-xl min-h-[80px]"
                            value={formData.notes}
                            onChange={e => setFormData({...formData, notes: e.target.value})}
                            placeholder="Additional details..."
                        />
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold mt-4 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                    >
                        Save Equipment
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
