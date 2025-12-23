import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Calendar, 
  Mic, 
  Camera, 
  Save, 
  MapPin,
  Droplets,
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

interface FarmingJournalProps {
  onClose: () => void;
  onSave: (entry: any) => void;
}

interface Activity {
  id: string;
  label: string;
  emoji: string;
}

interface Observation {
  id: string;
  label: string;
  emoji: string;
}

export function FarmingJournal({ onClose, onSave }: FarmingJournalProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedField, setSelectedField] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedObservations, setSelectedObservations] = useState<string[]>([]);
  const [weather, setWeather] = useState('sunny');
  const [canalWater, setCanalWater] = useState<boolean | null>(null);
  const [borewellUsed, setBorewellUsed] = useState<boolean | null>(null);
  const [textNote, setTextNote] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const fields = [
    { id: 'field-a', name: 'Field A (2 acres)' },
    { id: 'field-b', name: 'Field B (3 acres)' },
    { id: 'field-c', name: 'Field C (1.5 acres)' },
  ];

  const crops = [
    { id: 'rice', name: 'Rice' },
    { id: 'cotton', name: 'Cotton' },
    { id: 'wheat', name: 'Wheat' },
    { id: 'chilli', name: 'Chilli' },
    { id: 'tomato', name: 'Tomato' },
    { id: 'sugarcane', name: 'Sugarcane' },
  ];

  const activities: Activity[] = [
    { id: 'sowing', label: 'Sowing', emoji: '🌱' },
    { id: 'irrigation', label: 'Irrigation', emoji: '💧' },
    { id: 'weeding', label: 'Weeding', emoji: '🌿' },
    { id: 'fertilizer', label: 'Fertilizer', emoji: '🧪' },
    { id: 'pesticide', label: 'Pest Control', emoji: '🐛' },
    { id: 'ploughing', label: 'Ploughing', emoji: '🚜' },
    { id: 'pruning', label: 'Pruning', emoji: '✂️' },
    { id: 'harvesting', label: 'Harvesting', emoji: '🌾' },
    { id: 'no-work', label: 'No Work Today', emoji: '❌' },
  ];

  const observations: Observation[] = [
    { id: 'healthy', label: 'Plant Healthy', emoji: '🌿' },
    { id: 'yellowing', label: 'Yellowing Leaves', emoji: '🍂' },
    { id: 'pest', label: 'Pest Seen', emoji: '🐛' },
    { id: 'disease', label: 'Disease Spots', emoji: '🍄' },
    { id: 'new-growth', label: 'New Growth', emoji: '🌱' },
    { id: 'flowering', label: 'Flowering Started', emoji: '🌸' },
    { id: 'unusual', label: 'Something Unusual', emoji: '⚠️' },
  ];

  const weatherOptions = [
    { id: 'sunny', label: 'Sunny', icon: Sun, color: 'text-yellow-500' },
    { id: 'cloudy', label: 'Cloudy', icon: Cloud, color: 'text-gray-500' },
    { id: 'rain', label: 'Rained', icon: CloudRain, color: 'text-blue-500' },
    { id: 'windy', label: 'Windy', icon: Wind, color: 'text-cyan-500' },
  ];

  const toggleActivity = (id: string) => {
    if (id === 'no-work') {
      setSelectedActivities(['no-work']);
    } else {
      setSelectedActivities(prev => {
        const filtered = prev.filter(a => a !== 'no-work');
        if (filtered.includes(id)) {
          return filtered.filter(a => a !== id);
        }
        return [...filtered, id];
      });
    }
  };

  const toggleObservation = (id: string) => {
    setSelectedObservations(prev =>
      prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
    );
  };

  const handleVoiceNote = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.success('Recording voice note...');
      // In production, start actual voice recording
    } else {
      toast.success('Voice note saved!');
    }
  };

  const handlePhotoCapture = () => {
    toast.success('Photo captured and added!');
    // In production, open camera/file picker
  };

  const handleSave = () => {
    if (!selectedField || !selectedCrop) {
      toast.error('Please select field and crop');
      return;
    }

    if (selectedActivities.length === 0) {
      toast.error('Please select at least one activity');
      return;
    }

    const entry = {
      id: Date.now().toString(),
      date,
      field: selectedField,
      crop: selectedCrop,
      activities: selectedActivities,
      observations: selectedObservations,
      weather,
      waterStatus: {
        canal: canalWater,
        borewell: borewellUsed,
      },
      notes: textNote,
      timestamp: new Date(),
    };

    onSave(entry);
    toast.success('Journal entry saved!');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // Close when clicking on backdrop
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
        className="bg-background/95 backdrop-blur-xl rounded-3xl max-w-2xl w-full shadow-2xl max-h-[90vh] border border-white/10 dark:border-white/5 ring-1 ring-black/5 flex flex-col"
      >
        {/* Header - Sticky */}
        <div className="flex-shrink-0 bg-background/80 backdrop-blur-md flex items-center justify-between px-6 py-5 border-b border-border/40">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center text-green-600 shadow-inner">
                <Calendar className="w-5 h-5" />
             </div>
             <div>
                <h3 className="text-lg font-bold text-foreground tracking-tight">Farming Journal</h3>
                <p className="text-xs text-muted-foreground font-medium">Log daily activities & observations</p>
             </div>
           </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-muted/80 flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
            {/* Date & Field Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">Date</label>
                    <div className="relative">
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-background/50 border border-border/60 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        />
                    </div>
                </div>
                 <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">Field</label>
                    <div className="relative">
                        <select
                            value={selectedField}
                            onChange={(e) => setSelectedField(e.target.value)}
                            className="w-full bg-background/50 border border-border/60 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none"
                        >
                            <option value="">Select Field</option>
                            {fields.map((field) => (
                                <option key={field.id} value={field.id}>{field.name}</option>
                            ))}
                        </select>
                        <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                </div>
            </div>
            
             <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">Crop</label>
                 <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full bg-background/50 border border-border/60 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                >
                    <option value="">Select Crop</option>
                    {crops.map((crop) => (
                        <option key={crop.id} value={crop.id}>{crop.name}</option>
                    ))}
                </select>
            </div>

            {/* Activities */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">Activities</label>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {activities.map((activity) => (
                    <button
                        key={activity.id}
                        onClick={() => toggleActivity(activity.id)}
                        className={`p-3 rounded-2xl border transition-all duration-200 flex flex-col items-center gap-2 group relative overflow-hidden ${
                        selectedActivities.includes(activity.id)
                            ? 'bg-green-500/10 border-green-500/50 text-green-700 shadow-sm'
                            : 'bg-card hover:bg-muted/50 border-border/60 hover:border-border text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{activity.emoji}</span>
                        <span className="text-[11px] font-semibold text-center leading-tight">{activity.label}</span>
                        {selectedActivities.includes(activity.id) && (
                            <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full shadow-sm" />
                        )}
                    </button>
                    ))}
                </div>
            </div>

            {/* Observations */}
            <div className="space-y-3">
                <label className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">Observations</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {observations.map((observation) => (
                    <button
                        key={observation.id}
                        onClick={() => toggleObservation(observation.id)}
                        className={`p-3 rounded-2xl border transition-all duration-200 flex flex-col items-center gap-2 group relative overflow-hidden ${
                        selectedObservations.includes(observation.id)
                            ? 'bg-amber-500/10 border-amber-500/50 text-amber-700 shadow-sm'
                            : 'bg-card hover:bg-muted/50 border-border/60 hover:border-border text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{observation.emoji}</span>
                        <span className="text-[11px] font-semibold text-center leading-tight">{observation.label}</span>
                         {selectedObservations.includes(observation.id) && (
                            <div className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full shadow-sm" />
                        )}
                    </button>
                    ))}
                </div>
            </div>

            {/* Weather */}
            <div className="space-y-3">
                 <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">Weather Condition</label>
                    <span className="text-[10px] bg-blue-500/10 text-blue-600 px-2 py-1 rounded-full font-medium border border-blue-500/20">
                        32°C Detected
                    </span>
                 </div>
                 <div className="grid grid-cols-4 gap-3">
                    {weatherOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = weather === option.id;
                    return (
                        <button
                        key={option.id}
                        onClick={() => setWeather(option.id)}
                        className={`p-3 rounded-2xl border transition-all duration-200 flex flex-col items-center gap-2 ${
                            isSelected
                            ? 'bg-blue-500/10 border-blue-500/50 text-blue-700 shadow-sm ring-1 ring-blue-500/20'
                            : 'bg-card hover:bg-muted/50 border-border/60 hover:border-border text-muted-foreground hover:text-foreground'
                        }`}
                        >
                        <Icon className={`w-6 h-6 ${isSelected ? option.color : 'text-muted-foreground'}`} />
                        <span className="text-[10px] font-bold">{option.label}</span>
                        </button>
                    );
                    })}
                </div>
            </div>

             {/* Water Status */}
             <div className="p-5 rounded-3xl bg-card/50 border border-border/40 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                     <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                        <Droplets className="w-4 h-4" />
                     </div>
                     <h4 className="font-bold text-sm text-foreground">Water Management</h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                         <span className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">Canal Water</span>
                         <div className="flex bg-muted/40 p-1 rounded-xl border border-border/40 relative">
                            <button
                                onClick={() => setCanalWater(true)}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${canalWater ? 'bg-background text-blue-600 shadow-sm ring-1 ring-black/5' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Available
                            </button>
                            <button
                                onClick={() => setCanalWater(false)}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${!canalWater ? 'bg-background text-foreground shadow-sm ring-1 ring-black/5' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                No
                            </button>
                         </div>
                    </div>
                     <div className="space-y-2">
                         <span className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">Borewell Usage</span>
                         <div className="flex bg-muted/40 p-1 rounded-xl border border-border/40 relative">
                            <button
                                onClick={() => setBorewellUsed(true)}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${borewellUsed ? 'bg-background text-blue-600 shadow-sm ring-1 ring-black/5' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Used
                            </button>
                            <button
                                onClick={() => setBorewellUsed(false)}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${!borewellUsed ? 'bg-background text-foreground shadow-sm ring-1 ring-black/5' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Not Used
                            </button>
                         </div>
                    </div>
                </div>
             </div>

             {/* Notes */}
             <div className="space-y-3">
                <label className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">Notes & Media</label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                    onClick={handleVoiceNote}
                    className={`flex items-center justify-center gap-2 py-4 rounded-xl border transition-all ${
                        isRecording
                        ? 'bg-red-500 text-white border-red-600 animate-pulse'
                        : 'bg-background hover:bg-muted border-border/60 hover:border-primary/30 text-foreground'
                    }`}
                    >
                        <Mic className={`w-5 h-5 ${isRecording ? 'animate-bounce' : ''}`} />
                        <span className="text-sm font-semibold">{isRecording ? 'Stop Rec' : 'Voice Note'}</span>
                    </button>
                     <button
                        onClick={handlePhotoCapture}
                        className="flex items-center justify-center gap-2 py-4 rounded-xl border border-border/60 bg-background hover:bg-muted transition-all hover:border-primary/30 text-foreground"
                    >
                        <Camera className="w-5 h-5" />
                        <span className="text-sm font-semibold">Add Photo</span>
                    </button>
                </div>
                 <textarea
                    value={textNote}
                    onChange={(e) => setTextNote(e.target.value)}
                    placeholder="Type detailed observations here..."
                    className="w-full px-4 py-3 bg-background/50 rounded-xl border border-border/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none min-h-[100px] text-sm placeholder:text-muted-foreground/50"
                />
             </div>
        </div>
        
        {/* Footer */}
        <div className="flex-shrink-0 p-6 border-t border-border/40 bg-background/95 backdrop-blur-xl z-50 relative">
            <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all"
            >
            <Save className="w-5 h-5" />
            Save Entry
            </button>
        </div>
      </motion.div>
    </div>
  );
}