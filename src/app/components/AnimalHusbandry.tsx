import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Milk, 
  Egg, 
  Activity, 
  Calendar, 
  ChevronRight, 
  Trash2, 
  Edit2, 
  Syringe, 
  Baby, 
  CircleAlert,
  Stethoscope
} from 'lucide-react';
import { toast } from 'sonner';

interface Animal {
  id: string;
  type: 'Cow' | 'Buffalo' | 'Chicken' | 'Goat' | 'Sheep' | 'Other';
  tagId: string;
  name?: string;
  breed?: string;
  age: string; // e.g. "2 years"
  count: number; // For flocks
  status: 'Healthy' | 'Sick' | 'Pregnant' | 'Lactating' | 'Dry' | 'Young';
  production: {
    type: 'Milk' | 'Eggs' | 'Wool' | 'Meat' | 'None';
    avgDaily: string; // e.g. "10L"
  };
  lastCheckup?: string;
  image?: string;
}

interface AnimalHusbandryProps {
  onBack: () => void;
}

export function AnimalHusbandry({ onBack }: AnimalHusbandryProps) {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('All');
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedAnimals = localStorage.getItem('farm_animals');
    if (savedAnimals) {
      try {
        setAnimals(JSON.parse(savedAnimals));
      } catch (e) {
        console.error('Failed to parse animals', e);
      }
    } else {
        // Add some dummy data if empty
        const dummyData: Animal[] = [
            {
                id: '1',
                type: 'Cow',
                tagId: 'C-101',
                name: 'Gauri',
                breed: 'Gir',
                age: '4 years',
                count: 1,
                status: 'Lactating',
                production: { type: 'Milk', avgDaily: '12L' },
                lastCheckup: new Date().toISOString()
            },
            {
                id: '2',
                type: 'Buffalo',
                tagId: 'B-204',
                name: 'Kaali',
                breed: 'Murrah',
                age: '5 years',
                count: 1,
                status: 'Pregnant',
                production: { type: 'Milk', avgDaily: '8L' },
                lastCheckup: new Date(Date.now() - 86400000 * 10).toISOString()
            },
            {
                id: '3',
                type: 'Chicken',
                tagId: 'FLOCK-A',
                name: 'Layer Flock A',
                breed: 'Rhode Island Red',
                age: '12 weeks',
                count: 50,
                status: 'Healthy',
                production: { type: 'Eggs', avgDaily: '45' },
                lastCheckup: new Date(Date.now() - 86400000 * 2).toISOString()
            }
        ];
        setAnimals(dummyData);
        localStorage.setItem('farm_animals', JSON.stringify(dummyData));
    }
  }, []);

  const saveAnimals = (newAnimals: Animal[]) => {
    setAnimals(newAnimals);
    localStorage.setItem('farm_animals', JSON.stringify(newAnimals));
  };

  const handleAddAnimal = (animalData: any) => {
    const newAnimal: Animal = {
        id: Date.now().toString(),
        ...animalData,
        lastCheckup: new Date().toISOString()
    };
    const updated = [newAnimal, ...animals];
    saveAnimals(updated);
    setShowAddModal(false);
    toast.success(`${newAnimal.type} added successfully`);
  };

  const handleDelete = (id: string) => {
    if(confirm('Are you sure you want to remove this animal?')) {
        const updated = animals.filter(a => a.id !== id);
        saveAnimals(updated);
        toast.success('Animal removed');
    }
  };

  const filteredAnimals = filterType === 'All' 
    ? animals 
    : animals.filter(a => a.type === filterType);

  const stats = {
    total: animals.reduce((acc, curr) => acc + (curr.count || 1), 0),
    sick: animals.filter(a => a.status === 'Sick').length,
    lactating: animals.filter(a => a.status === 'Lactating').length,
    pregnant: animals.filter(a => a.status === 'Pregnant').length
  };

  return (
    <div className="min-h-screen bg-background pb-20 overflow-x-hidden">
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
                <h1 className="font-bold text-lg leading-tight">Animal Husbandry</h1>
                <p className="text-xs text-muted-foreground">Manage your livestock</p>
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
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Total Animals</span>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 p-3 rounded-2xl flex flex-col items-center justify-center gap-1">
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{stats.lactating}</span>
                <span className="text-xs text-blue-600/70 dark:text-blue-400/70 font-medium uppercase tracking-wide">Lactating</span>
            </div>
            <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-900/30 p-3 rounded-2xl flex flex-col items-center justify-center gap-1">
                <span className="text-2xl font-black text-pink-600 dark:text-pink-400">{stats.pregnant}</span>
                <span className="text-xs text-pink-600/70 dark:text-pink-400/70 font-medium uppercase tracking-wide">Pregnant</span>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-3 rounded-2xl flex flex-col items-center justify-center gap-1">
                <span className="text-2xl font-black text-red-600 dark:text-red-400">{stats.sick}</span>
                <span className="text-xs text-red-600/70 dark:text-red-400/70 font-medium uppercase tracking-wide">Needs Care</span>
            </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {['All', 'Cow', 'Buffalo', 'Chicken', 'Goat', 'Sheep'].map(type => (
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

        {/* Animals List */}
        <div className="space-y-3">
            {filteredAnimals.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 opacity-50" />
                    </div>
                    <p>No animals found in this category.</p>
                </div>
            ) : (
                filteredAnimals.map(animal => (
                    <AnimalCard 
                        key={animal.id} 
                        animal={animal} 
                        onDelete={() => handleDelete(animal.id)}
                    />
                ))
            )}
        </div>
      </div>

      {/* Add Animal Modal */}
      <AnimatePresence>
        {showAddModal && (
            <AddAnimalModal 
                onClose={() => setShowAddModal(false)}
                onSave={handleAddAnimal}
            />
        )}
      </AnimatePresence>
    </div>
  );
}

function AnimalCard({ animal, onDelete }: { animal: Animal, onDelete: () => void }) {
    const statusColor = {
        'Healthy': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        'Sick': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        'Pregnant': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
        'Lactating': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        'Dry': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        'Young': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    }[animal.status] || 'bg-gray-100 text-gray-700';

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-start gap-4 relative group"
        >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                animal.type === 'Chicken' ? 'bg-orange-100 dark:bg-orange-900/20' : 
                animal.type === 'Cow' ? 'bg-emerald-100 dark:bg-emerald-900/20' : 
                'bg-blue-100 dark:bg-blue-900/20'
            }`}>
                {animal.type === 'Cow' && '🐄'}
                {animal.type === 'Buffalo' && '🐃'}
                {animal.type === 'Chicken' && '🐔'}
                {animal.type === 'Goat' && '🐐'}
                {animal.type === 'Sheep' && '🐑'}
                {animal.type === 'Other' && '🐾'}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-foreground truncate">{animal.name || animal.tagId}</h3>
                            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md border border-border font-mono">
                                {animal.tagId}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {animal.breed} • {animal.age} • {animal.count > 1 ? `${animal.count} count` : 'Individual'}
                        </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusColor}`}>
                        {animal.status}
                    </span>
                </div>

                <div className="mt-3 flex items-center gap-4 text-sm">
                    {animal.production.type !== 'None' && (
                        <div className="flex items-center gap-1.5 text-foreground/80">
                            {animal.production.type === 'Milk' ? <Milk className="w-4 h-4 text-blue-500" /> : 
                             animal.production.type === 'Eggs' ? <Egg className="w-4 h-4 text-orange-500" /> :
                             <Activity className="w-4 h-4 text-primary" />
                            }
                            <span className="font-medium">{animal.production.avgDaily} / day</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Stethoscope className="w-4 h-4" />
                        <span className="text-xs">Last Check: {new Date(animal.lastCheckup || '').toLocaleDateString()}</span>
                    </div>
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

function AddAnimalModal({ onClose, onSave }: { onClose: () => void, onSave: (data: any) => void }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        type: 'Cow',
        tagId: '',
        name: '',
        breed: '',
        age: '',
        count: 1,
        status: 'Healthy',
        productionType: 'Milk',
        avgDaily: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            production: {
                type: formData.productionType,
                avgDaily: formData.avgDaily || '0'
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-card w-full max-w-md rounded-3xl shadow-2xl border border-border overflow-hidden"
            >
                <div className="p-6 border-b border-border flex justify-between items-center">
                    <h2 className="text-xl font-bold">Add Livestock</h2>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Type</label>
                            <select 
                                className="w-full p-3 bg-muted/30 border border-border rounded-xl"
                                value={formData.type}
                                onChange={e => setFormData({...formData, type: e.target.value})}
                            >
                                <option>Cow</option>
                                <option>Buffalo</option>
                                <option>Chicken</option>
                                <option>Goat</option>
                                <option>Sheep</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tag ID / Batch ID</label>
                            <input 
                                required
                                className="w-full p-3 bg-muted/30 border border-border rounded-xl"
                                value={formData.tagId}
                                onChange={e => setFormData({...formData, tagId: e.target.value})}
                                placeholder="e.g. C-101"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name (Optional)</label>
                        <input 
                            className="w-full p-3 bg-muted/30 border border-border rounded-xl"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            placeholder="e.g. Gauri"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Breed</label>
                            <input 
                                className="w-full p-3 bg-muted/30 border border-border rounded-xl"
                                value={formData.breed}
                                onChange={e => setFormData({...formData, breed: e.target.value})}
                                placeholder="e.g. Gir"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Age</label>
                            <input 
                                className="w-full p-3 bg-muted/30 border border-border rounded-xl"
                                value={formData.age}
                                onChange={e => setFormData({...formData, age: e.target.value})}
                                placeholder="e.g. 4 years"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <select 
                                className="w-full p-3 bg-muted/30 border border-border rounded-xl"
                                value={formData.status}
                                onChange={e => setFormData({...formData, status: e.target.value})}
                            >
                                <option>Healthy</option>
                                <option>Sick</option>
                                <option>Pregnant</option>
                                <option>Lactating</option>
                                <option>Dry</option>
                                <option>Young</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Count</label>
                            <input 
                                type="number"
                                min="1"
                                className="w-full p-3 bg-muted/30 border border-border rounded-xl"
                                value={formData.count}
                                onChange={e => setFormData({...formData, count: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>

                    <div className="border-t border-border pt-4 mt-2">
                        <h4 className="font-medium text-sm mb-3">Production Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Product</label>
                                <select 
                                    className="w-full p-3 bg-muted/30 border border-border rounded-xl"
                                    value={formData.productionType}
                                    onChange={e => setFormData({...formData, productionType: e.target.value})}
                                >
                                    <option>Milk</option>
                                    <option>Eggs</option>
                                    <option>Wool</option>
                                    <option>Meat</option>
                                    <option>None</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Daily Avg</label>
                                <input 
                                    className="w-full p-3 bg-muted/30 border border-border rounded-xl"
                                    value={formData.avgDaily}
                                    onChange={e => setFormData({...formData, avgDaily: e.target.value})}
                                    placeholder="e.g. 10L"
                                />
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold mt-4 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                    >
                        Save Animal
                    </button>
                </form>
            </motion.div>
        </div>
    );
}