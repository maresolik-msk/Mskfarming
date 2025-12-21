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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <div>
            <h3 className="text-xl text-foreground mb-1">Farming Journal</h3>
            <p className="text-sm text-muted-foreground">Log your daily farm activities</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Date */}
        <div className="mb-6">
          <label className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Field & Crop Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Field
            </label>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Field</option>
              {fields.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Crop</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Crop</option>
              {crops.map((crop) => (
                <option key={crop.id} value={crop.id}>
                  {crop.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Activities */}
        <div className="mb-6">
          <label className="text-sm font-medium text-foreground mb-3 block">
            🧑‍🌾 What did you do today?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {activities.map((activity) => (
              <button
                key={activity.id}
                onClick={() => toggleActivity(activity.id)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedActivities.includes(activity.id)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-2xl mb-1">{activity.emoji}</div>
                <div className="text-xs text-foreground">{activity.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Observations */}
        <div className="mb-6">
          <label className="text-sm font-medium text-foreground mb-3 block">
            👀 What did you observe?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {observations.map((observation) => (
              <button
                key={observation.id}
                onClick={() => toggleObservation(observation.id)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedObservations.includes(observation.id)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-2xl mb-1">{observation.emoji}</div>
                <div className="text-xs text-foreground">{observation.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Weather */}
        <div className="mb-6">
          <label className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            🌦️ Weather Today
            <span className="text-xs text-muted-foreground font-normal">(Auto-detected: 32°C)</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {weatherOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => setWeather(option.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    weather === option.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-1 ${option.color}`} />
                  <div className="text-xs text-foreground">{option.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Water Status */}
        <div className="mb-6">
          <label className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Droplets className="w-4 h-4" />
            Water Status
          </label>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm text-foreground">Canal water available?</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCanalWater(true)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    canalWater === true
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border border-border'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setCanalWater(false)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    canalWater === false
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border border-border'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm text-foreground">Borewell used?</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setBorewellUsed(true)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    borewellUsed === true
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border border-border'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setBorewellUsed(false)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    borewellUsed === false
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border border-border'
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="text-sm font-medium text-foreground mb-3 block">
            📝 Your Notes (Optional)
          </label>
          
          {/* Voice & Photo Buttons */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={handleVoiceNote}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all ${
                isRecording
                  ? 'border-red-500 bg-red-500/10 text-red-500'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Mic className="w-5 h-5" />
              <span className="text-sm">{isRecording ? 'Stop Recording' : 'Voice Note'}</span>
            </button>

            <button
              onClick={handlePhotoCapture}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-border hover:border-primary/50 transition-all"
            >
              <Camera className="w-5 h-5" />
              <span className="text-sm">Add Photo</span>
            </button>
          </div>

          {/* Text Note */}
          <textarea
            value={textNote}
            onChange={(e) => setTextNote(e.target.value)}
            placeholder="Type your observations here..."
            className="w-full px-4 py-3 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={3}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Save className="w-5 h-5" />
          Save Journal Entry
        </button>
      </motion.div>
    </div>
  );
}
