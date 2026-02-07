import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, MapPin, Sprout, Target, Calendar, CheckCircle2, 
  ChevronRight, ChevronLeft, Droplets, Sun, Map as MapIcon, 
  Navigation, Plus, Trash2, AlertTriangle, FileText
} from 'lucide-react';
import { updateUserProfile, createField, createTask } from '../../lib/api';
import { toast } from 'sonner';
import { useAppStore, Field, CropPlan } from '../store/appStore';
import { v4 as uuidv4 } from 'uuid';

// Mock Data for Selections
const FARMER_TYPES = ['Small', 'Marginal', 'Medium', 'Large'];
const FARM_TYPES = ['Irrigated', 'Rainfed'];
const CROPPING_INTENTS = ['Commercial', 'Household', 'Mixed'];
const SOIL_TYPES = ['Red', 'Black', 'Alluvial', 'Sandy', 'Loamy', 'Clay'];
const IRRIGATION_METHODS = ['Drip', 'Flood', 'Sprinkler', 'Rainfed'];
const WATER_SOURCES = ['Borewell', 'Tank', 'Canal', 'Rainfed'];
const SEASONS = ['Kharif', 'Rabi', 'Summer'];
const CROPS = [
  { name: 'Paddy', varieties: ['MTU 1010', 'BPT 5204', 'Sona Masoori'], duration: 120, seedRate: 25 },
  { name: 'Cotton', varieties: ['Bt Cotton', 'Desi Cotton'], duration: 150, seedRate: 2 },
  { name: 'Maize', varieties: ['Hybrid', 'Local'], duration: 100, seedRate: 8 },
  { name: 'Groundnut', varieties: ['Kadiri-6', 'JL-24'], duration: 110, seedRate: 60 },
  { name: 'Chilli', varieties: ['Guntur Sannam', 'Byadgi'], duration: 160, seedRate: 0.3 },
];

interface OnboardingFlowProps {
  onComplete: (profileData: any) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { setUser, addField, addCropPlan, addTask, addAlert } = useAppStore();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form States
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    language: 'English',
    location: '', // District/State
    farmerType: 'Small',
    farmingSystem: 'Irrigated',
    croppingIntent: 'Commercial',
  });

  const [fields, setFields] = useState<Field[]>([]);
  const [currentField, setCurrentField] = useState<Partial<Field>>({
    name: '',
    acres: 0,
    soilType: 'Red',
    irrigationMethod: 'Drip',
    waterSource: 'Borewell',
    slope: 'Flat',
    drainageIssues: false,
    previousCrop: '',
  });
  const [fieldInputMode, setFieldInputMode] = useState<'simple' | 'map' | 'gps'>('simple');

  const [plans, setPlans] = useState<Partial<CropPlan>[]>([]);
  const [currentPlan, setCurrentPlan] = useState<Partial<CropPlan>>({
    season: 'Kharif',
    isIntercropping: false,
  });

  // Steps Configuration
  const totalSteps = 4;

  // --- Handlers ---

  const handleProfileChange = (key: string, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const addFieldToList = () => {
    if (!currentField.name || !currentField.acres) {
      toast.error("Please enter field name and acreage");
      return;
    }
    const newField: Field = {
      id: uuidv4(),
      name: currentField.name,
      acres: Number(currentField.acres),
      location: profile.location,
      soilType: currentField.soilType || 'Red',
      irrigationMethod: currentField.irrigationMethod as any,
      waterSource: currentField.waterSource as any,
      slope: currentField.slope as any,
      drainageIssues: currentField.drainageIssues,
      previousCrop: currentField.previousCrop,
    };
    setFields([...fields, newField]);
    setCurrentField({
      name: '',
      acres: 0,
      soilType: 'Red',
      irrigationMethod: 'Drip',
      waterSource: 'Borewell',
      slope: 'Flat',
      drainageIssues: false,
      previousCrop: '',
    });
    toast.success("Field added successfully");
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const generatePlanDetails = (plan: Partial<CropPlan>) => {
    const crop = CROPS.find(c => c.name === plan.cropName);
    if (!crop || !plan.sowingDate || !plan.fieldId) return null;

    const field = fields.find(f => f.id === plan.fieldId);
    const acres = field?.acres || 1;
    
    const sowingDate = new Date(plan.sowingDate);
    const harvestDate = new Date(sowingDate);
    harvestDate.setDate(harvestDate.getDate() + crop.duration);

    const totalSeed = crop.seedRate * acres;
    
    return {
      harvestDateEstimated: harvestDate,
      seedRate: `${totalSeed} kg total (${crop.seedRate} kg/acre)`,
      baseNutrients: `Basal Dose: Urea 20kg + DAP 50kg per acre`,
      riskChecklist: [
        'Check for early season pests (Aphids/Jassids)',
        'Ensure proper drainage if heavy rains expected',
        'Weed management required at Day 20',
      ]
    };
  };

  const addPlanToList = () => {
    if (!currentPlan.fieldId || !currentPlan.cropName || !currentPlan.variety || !currentPlan.sowingDate) {
      toast.error("Please fill all crop details");
      return;
    }
    
    const generated = generatePlanDetails(currentPlan);
    
    const newPlan: CropPlan = {
      id: uuidv4(),
      fieldId: currentPlan.fieldId,
      season: currentPlan.season as any,
      cropName: currentPlan.cropName,
      variety: currentPlan.variety,
      sowingDate: new Date(currentPlan.sowingDate),
      isIntercropping: currentPlan.isIntercropping || false,
      interCropName: currentPlan.interCropName,
      ...generated,
    };
    
    setPlans([...plans, newPlan]);
    setCurrentPlan({
      season: 'Kharif',
      isIntercropping: false,
      fieldId: '', // Reset for next entry
      cropName: '',
      variety: '',
    });
    toast.success("Crop plan generated");
  };

  const removePlan = (id: string) => {
    setPlans(plans.filter(p => p.id !== id));
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    try {
      // 1. Update User Profile
      // For now we map it to the simple UserProfile but keep extended data in store
      const userProfileData = {
        name: profile.name,
        phone: profile.phone,
        language: profile.language,
        location: profile.location,
        onboardingComplete: true, // Legacy support
        profile_complete: true,   // Standard flag for auth service
        farmSize: fields.reduce((acc, f) => acc + f.acres, 0),
        fieldName: fields[0]?.name || 'Main Farm', // Legacy support
        crop: plans[0]?.cropName || '', // Legacy support
        plantingDate: plans[0]?.sowingDate || new Date(), // Legacy support
        budget: 0, // Placeholder
        farmerType: profile.farmerType as any,
        farmingSystem: profile.farmingSystem as any,
        croppingIntent: profile.croppingIntent as any,
      };

      // Call API (mocked for now in terms of backend persistence of detailed fields)
      const response = await updateUserProfile(userProfileData);

      if (response?.success || true) { // Assuming success for demo if API mock is limited
        // 2. Sync with Backend API
        // We need to create these fields on the server so MainDashboard can fetch them
        const createdFieldIds = new Map<string, string>(); // Map local ID to server ID

        for (const field of fields) {
          try {
            // Find plan for this field
            const plan = plans.find(p => p.fieldId === field.id);
            
            const fieldPayload = {
              name: field.name,
              area: field.acres,
              area_unit: 'acres',
              location: field.location || profile.location,
              soilType: field.soilType,
              irrigationType: field.irrigationMethod,
              // If plan exists, add crop details
              crop: plan ? plan.cropName : undefined,
              plantingDate: plan ? plan.sowingDate : undefined,
              // Additional metadata
              metadata: {
                waterSource: field.waterSource,
                slope: field.slope,
                drainageIssues: field.drainageIssues,
                previousCrop: field.previousCrop
              }
            };

            const createdField = await createField(fieldPayload);
            if (createdField && createdField.id) {
              createdFieldIds.set(field.id, createdField.id);
            }
          } catch (err) {
            console.error("Failed to create field on server:", err);
            // Continue with other fields...
          }
        }

        // 3. Update Local Store
        setUser(userProfileData);
        fields.forEach(f => {
            // Update with server ID if available, otherwise keep local
            const serverId = createdFieldIds.get(f.id) || f.id;
            addField({ ...f, id: serverId });
        });
        
        for (const p of plans) {
          if (p.id) {
             // Update fieldId in plan to match server ID
             const serverFieldId = createdFieldIds.get(p.fieldId) || p.fieldId;
             addCropPlan({ ...p, fieldId: serverFieldId } as CropPlan);
          }
          
          // Generate initial tasks based on plan
          const taskTitle = `Sowing ${p.cropName} in ${fields.find(f => f.id === p.fieldId)?.name}`;
          const newTask = {
            id: uuidv4(),
            title: taskTitle,
            time: 'morning',
            completed: false,
            type: 'other'
          };
          
          addTask(newTask as any);
          
          // Sync task to backend
          createTask({
            text: taskTitle, // API expects 'text', store expects 'title'
            time: 'morning',
            completed: false
          }).catch(err => console.error("Failed to create task on server:", err));
          
          // Generate alerts
          if (p.riskChecklist) {
            p.riskChecklist.forEach(risk => addAlert(risk));
          }
        }

        toast.success("Farm setup complete!");
        onComplete(userProfileData);
      } else {
        toast.error("Failed to save profile");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render Steps ---

  const renderStep1_Profile = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-light font-['Megrim'] text-[#812F0F]">Farmer Profile</h2>
        <p className="text-muted-foreground">Tell us about yourself</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input 
            value={profile.name} 
            onChange={(e) => handleProfileChange('name', e.target.value)}
            className="w-full p-3 rounded-lg border bg-white/50 backdrop-blur-sm focus:ring-2 ring-[#812F0F]/20 outline-none" 
            placeholder="Enter your name" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <input 
            value={profile.phone} 
            onChange={(e) => handleProfileChange('phone', e.target.value)}
            className="w-full p-3 rounded-lg border bg-white/50 backdrop-blur-sm focus:ring-2 ring-[#812F0F]/20 outline-none" 
            placeholder="Enter phone number" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Location (District/State)</label>
          <input 
            value={profile.location} 
            onChange={(e) => handleProfileChange('location', e.target.value)}
            className="w-full p-3 rounded-lg border bg-white/50 backdrop-blur-sm focus:ring-2 ring-[#812F0F]/20 outline-none" 
            placeholder="e.g. Kurnool, Andhra Pradesh" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Preferred Language</label>
          <select 
            value={profile.language}
            onChange={(e) => handleProfileChange('language', e.target.value)}
            className="w-full p-3 rounded-lg border bg-white/50 backdrop-blur-sm focus:ring-2 ring-[#812F0F]/20 outline-none"
          >
            <option>English</option>
            <option>Telugu</option>
            <option>Hindi</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div>
          <label className="block text-sm font-medium mb-2">Farmer Type</label>
          <div className="flex flex-col gap-2">
            {FARMER_TYPES.map(type => (
              <button
                key={type}
                onClick={() => handleProfileChange('farmerType', type)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  profile.farmerType === type 
                    ? 'bg-[#812F0F] text-white border-[#812F0F]' 
                    : 'bg-white hover:bg-[#812F0F]/5'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Farm Type</label>
          <div className="flex flex-col gap-2">
            {FARM_TYPES.map(type => (
              <button
                key={type}
                onClick={() => handleProfileChange('farmingSystem', type)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  profile.farmingSystem === type 
                    ? 'bg-[#812F0F] text-white border-[#812F0F]' 
                    : 'bg-white hover:bg-[#812F0F]/5'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Intent</label>
          <div className="flex flex-col gap-2">
            {CROPPING_INTENTS.map(type => (
              <button
                key={type}
                onClick={() => handleProfileChange('croppingIntent', type)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  profile.croppingIntent === type 
                    ? 'bg-[#812F0F] text-white border-[#812F0F]' 
                    : 'bg-white hover:bg-[#812F0F]/5'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2_Fields = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-light font-['Megrim'] text-[#812F0F]">Farm & Fields</h2>
        <p className="text-muted-foreground">Map out your land</p>
      </div>

      {/* Added Fields List */}
      {fields.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {fields.map(field => (
            <motion.div 
              key={field.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-white border shadow-sm flex justify-between items-start"
            >
              <div>
                <h4 className="font-bold text-[#812F0F]">{field.name}</h4>
                <p className="text-sm text-gray-600">{field.acres} acres • {field.soilType}</p>
                <p className="text-xs text-gray-500 mt-1">{field.irrigationMethod} • {field.waterSource}</p>
              </div>
              <button onClick={() => removeField(field.id)} className="text-red-500 hover:text-red-700">
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add New Field Form */}
      <div className="bg-white/50 backdrop-blur-md border rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-[#812F0F]" /> Add New Field
        </h3>

        {/* Input Mode Tabs */}
        <div className="flex gap-4 mb-6 border-b pb-2">
          <button 
            onClick={() => setFieldInputMode('simple')}
            className={`flex items-center gap-2 pb-2 transition-colors ${fieldInputMode === 'simple' ? 'text-[#812F0F] border-b-2 border-[#812F0F]' : 'text-gray-500'}`}
          >
            <FileText size={18} /> Simple
          </button>
          <button 
            onClick={() => setFieldInputMode('map')}
            className={`flex items-center gap-2 pb-2 transition-colors ${fieldInputMode === 'map' ? 'text-[#812F0F] border-b-2 border-[#812F0F]' : 'text-gray-500'}`}
          >
            <MapIcon size={18} /> Map Draw
          </button>
          <button 
            onClick={() => setFieldInputMode('gps')}
            className={`flex items-center gap-2 pb-2 transition-colors ${fieldInputMode === 'gps' ? 'text-[#812F0F] border-b-2 border-[#812F0F]' : 'text-gray-500'}`}
          >
            <Navigation size={18} /> GPS Walk
          </button>
        </div>

        {fieldInputMode === 'simple' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">Field Name</label>
                <input 
                  value={currentField.name}
                  onChange={e => setCurrentField({...currentField, name: e.target.value})}
                  className="w-full p-2 rounded border focus:ring-1 focus:ring-[#812F0F]"
                  placeholder="e.g. North Plot"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">Acres</label>
                <input 
                  type="number"
                  value={currentField.acres || ''}
                  onChange={e => setCurrentField({...currentField, acres: parseFloat(e.target.value)})}
                  className="w-full p-2 rounded border focus:ring-1 focus:ring-[#812F0F]"
                  placeholder="0.0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">Soil Type</label>
                <select 
                  value={currentField.soilType}
                  onChange={e => setCurrentField({...currentField, soilType: e.target.value})}
                  className="w-full p-2 rounded border"
                >
                  {SOIL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">Slope</label>
                <select 
                  value={currentField.slope}
                  onChange={e => setCurrentField({...currentField, slope: e.target.value as any})}
                  className="w-full p-2 rounded border"
                >
                  <option value="Flat">Flat</option>
                  <option value="Gentle">Gentle</option>
                  <option value="Steep">Steep</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">Irrigation</label>
                <select 
                  value={currentField.irrigationMethod}
                  onChange={e => setCurrentField({...currentField, irrigationMethod: e.target.value as any})}
                  className="w-full p-2 rounded border"
                >
                  {IRRIGATION_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">Water Source</label>
                <select 
                  value={currentField.waterSource}
                  onChange={e => setCurrentField({...currentField, waterSource: e.target.value as any})}
                  className="w-full p-2 rounded border"
                >
                  {WATER_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <input 
                type="checkbox"
                checked={currentField.drainageIssues}
                onChange={e => setCurrentField({...currentField, drainageIssues: e.target.checked})}
                id="drainage"
              />
              <label htmlFor="drainage" className="text-sm text-gray-700">Has Drainage Issues?</label>
            </div>

            <button 
              onClick={addFieldToList}
              className="w-full py-3 bg-[#812F0F] text-white rounded-lg hover:bg-[#6b260b] transition-colors font-medium"
            >
              Save Field
            </button>
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
            <MapIcon className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-gray-500 font-medium">Interactive Map Mode Coming Soon</p>
            <p className="text-xs text-gray-400">Use 'Simple' mode for now</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3_CropPlan = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-light font-['Megrim'] text-[#812F0F]">Crop Plan</h2>
        <p className="text-muted-foreground">What are you growing this season?</p>
      </div>

      {fields.length === 0 ? (
        <div className="text-center p-8 bg-orange-50 rounded-xl text-orange-800">
          <AlertTriangle className="w-10 h-10 mx-auto mb-2" />
          <p>Please add at least one field in the previous step.</p>
        </div>
      ) : (
        <>
          {/* Plans List */}
          {plans.length > 0 && (
            <div className="space-y-3 mb-8">
              {plans.map(plan => (
                <div key={plan.id} className="p-4 bg-green-50 border border-green-200 rounded-xl flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-green-800">{plan.cropName} ({plan.season})</h4>
                    <p className="text-sm text-green-700">
                      {fields.find(f => f.id === plan.fieldId)?.name} • {plan.variety}
                    </p>
                    <p className="text-xs text-green-600 mt-1">Sowing: {new Date(plan.sowingDate!).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => removePlan(plan.id!)} className="text-red-500 hover:text-red-700 p-2">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Plan Form */}
          <div className="bg-white/50 backdrop-blur-md border rounded-xl p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">Select Field</label>
              <select 
                value={currentPlan.fieldId || ''}
                onChange={e => setCurrentPlan({...currentPlan, fieldId: e.target.value})}
                className="w-full p-2 rounded border"
              >
                <option value="">-- Choose Field --</option>
                {fields.map(f => <option key={f.id} value={f.id}>{f.name} ({f.acres} ac)</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">Season</label>
                <select 
                  value={currentPlan.season}
                  onChange={e => setCurrentPlan({...currentPlan, season: e.target.value as any})}
                  className="w-full p-2 rounded border"
                >
                  {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">Sowing Date</label>
                <input 
                  type="date"
                  value={currentPlan.sowingDate ? new Date(currentPlan.sowingDate).toISOString().split('T')[0] : ''}
                  onChange={e => setCurrentPlan({...currentPlan, sowingDate: new Date(e.target.value)})}
                  className="w-full p-2 rounded border"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">Crop</label>
                <select 
                  value={currentPlan.cropName || ''}
                  onChange={e => setCurrentPlan({...currentPlan, cropName: e.target.value, variety: ''})}
                  className="w-full p-2 rounded border"
                >
                  <option value="">-- Choose Crop --</option>
                  {CROPS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">Variety</label>
                <select 
                  value={currentPlan.variety || ''}
                  onChange={e => setCurrentPlan({...currentPlan, variety: e.target.value})}
                  className="w-full p-2 rounded border"
                  disabled={!currentPlan.cropName}
                >
                  <option value="">-- Choose Variety --</option>
                  {currentPlan.cropName && CROPS.find(c => c.name === currentPlan.cropName)?.varieties.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox"
                checked={currentPlan.isIntercropping}
                onChange={e => setCurrentPlan({...currentPlan, isIntercropping: e.target.checked})}
                id="intercrop"
              />
              <label htmlFor="intercrop" className="text-sm text-gray-700">Enable Intercropping / Mixed Cropping</label>
            </div>
            
            {currentPlan.isIntercropping && (
              <input 
                value={currentPlan.interCropName || ''}
                onChange={e => setCurrentPlan({...currentPlan, interCropName: e.target.value})}
                placeholder="Enter Intercrop Name"
                className="w-full p-2 rounded border mt-2"
              />
            )}

            <button 
              onClick={addPlanToList}
              className="w-full py-3 bg-[#812F0F] text-white rounded-lg hover:bg-[#6b260b] transition-colors font-medium mt-4"
            >
              Add to Plan
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderStep4_Summary = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-light font-['Megrim'] text-[#812F0F]">Review Plan</h2>
        <p className="text-muted-foreground">Generated insights for your season</p>
      </div>

      <div className="space-y-6">
        {plans.map((plan, index) => {
          const field = fields.find(f => f.id === plan.fieldId);
          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border rounded-xl overflow-hidden shadow-lg"
            >
              <div className="bg-[#812F0F] text-white p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{plan.cropName} - {plan.season}</h3>
                  <p className="text-white/80 text-sm">{field?.name} ({field?.acres} acres)</p>
                </div>
                <div className="text-right">
                  <div className="text-xs opacity-75">Harvest Est.</div>
                  <div className="font-bold">{plan.harvestDateEstimated ? new Date(plan.harvestDateEstimated).toLocaleDateString() : 'N/A'}</div>
                </div>
              </div>
              
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-green-600" /> Seed & Nutrients
                  </h4>
                  <div className="bg-green-50 p-3 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Seed Rate:</span>
                      <span className="font-medium">{plan.seedRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nutrients:</span>
                      <span className="font-medium text-right">{plan.baseNutrients}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" /> Risk Checklist
                  </h4>
                  <ul className="text-sm space-y-1">
                    {plan.riskChecklist?.map((risk, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-orange-500">•</span>
                        <span className="text-gray-700">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-xl font-bold text-[#812F0F] tracking-widest font-['Megrim']">MILA</h1>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Crop Intelligence Engine</p>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(s => (
              <div 
                key={s} 
                className={`w-3 h-3 rounded-full transition-all ${
                  step >= s ? 'bg-[#812F0F]' : 'bg-gray-200'
                }`} 
              />
            ))}
          </div>
        </div>

        {/* Content Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 sm:p-10 shadow-xl border border-white/20 min-h-[500px]"
          >
            {step === 1 && renderStep1_Profile()}
            {step === 2 && renderStep2_Fields()}
            {step === 3 && renderStep3_CropPlan()}
            {step === 4 && renderStep4_Summary()}

            {/* Navigation Footer */}
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
              <button
                onClick={() => setStep(s => Math.max(1, s - 1))}
                disabled={step === 1}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                  step === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              {step < totalSteps ? (
                <button
                  onClick={() => setStep(s => Math.min(totalSteps, s + 1))}
                  className="flex items-center gap-2 px-8 py-3 bg-[#812F0F] text-white rounded-lg hover:bg-[#6b260b] shadow-lg shadow-[#812F0F]/20 transition-all transform hover:scale-105"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinalSubmit}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-8 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 shadow-lg shadow-green-700/20 transition-all transform hover:scale-105 disabled:opacity-70"
                >
                  {isLoading ? 'Setting up...' : 'Start Farming'} <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}