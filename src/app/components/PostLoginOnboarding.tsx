import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Square, 
  Sprout, 
  ChevronRight, 
  Check, 
  CloudRain,
  Sun,
  Droplets,
  Wind,
  ArrowRight,
  Leaf,
  SkipForward
} from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { DebugPanel } from './DebugPanel';

type OnboardingStep = 'welcome' | 'location' | 'field' | 'season' | 'crop' | 'value';
type SeasonStatus = 'planted' | 'planning' | 'exploring';
type IrrigationType = 'rainfed' | 'borewell' | 'canal' | 'other';

interface PostLoginOnboardingProps {
  user: any;
  onComplete: (data: any) => void;
}

// Indian states and districts (simplified - can be expanded)
const INDIAN_STATES = [
  { value: 'andhra_pradesh', label: 'Andhra Pradesh' },
  { value: 'telangana', label: 'Telangana' },
  { value: 'karnataka', label: 'Karnataka' },
  { value: 'tamil_nadu', label: 'Tamil Nadu' },
  { value: 'maharashtra', label: 'Maharashtra' },
  { value: 'punjab', label: 'Punjab' },
  { value: 'haryana', label: 'Haryana' },
  { value: 'uttar_pradesh', label: 'Uttar Pradesh' },
  { value: 'bihar', label: 'Bihar' },
  { value: 'west_bengal', label: 'West Bengal' },
  { value: 'gujarat', label: 'Gujarat' },
  { value: 'rajasthan', label: 'Rajasthan' },
  { value: 'madhya_pradesh', label: 'Madhya Pradesh' },
];

const COMMON_CROPS = [
  { value: 'rice', label: 'Rice (Paddy)', emoji: '🌾', season: 'kharif' },
  { value: 'wheat', label: 'Wheat', emoji: '🌾', season: 'rabi' },
  { value: 'cotton', label: 'Cotton', emoji: '🌿', season: 'kharif' },
  { value: 'sugarcane', label: 'Sugarcane', emoji: '🎋', season: 'both' },
  { value: 'maize', label: 'Maize (Corn)', emoji: '🌽', season: 'both' },
  { value: 'groundnut', label: 'Groundnut', emoji: '🥜', season: 'kharif' },
  { value: 'soybean', label: 'Soybean', emoji: '🌱', season: 'kharif' },
  { value: 'chickpea', label: 'Chickpea (Chana)', emoji: '🫘', season: 'rabi' },
  { value: 'pigeon_pea', label: 'Pigeon Pea (Tur)', emoji: '🫘', season: 'kharif' },
  { value: 'tomato', label: 'Tomato', emoji: '🍅', season: 'both' },
  { value: 'onion', label: 'Onion', emoji: '🧅', season: 'both' },
  { value: 'potato', label: 'Potato', emoji: '🥔', season: 'rabi' },
];

const AREA_UNITS = ['acres', 'hectares', 'guntas'];

export function PostLoginOnboarding({ user, onComplete }: PostLoginOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [loading, setLoading] = useState(false);

  // Onboarding data
  const [location, setLocation] = useState({
    village: '',
    district: '',
    state: '',
    lat: null as number | null,
    long: null as number | null,
  });

  const [field, setField] = useState({
    name: 'Main Field',
    area: '',
    area_unit: 'acres' as string,
    irrigation_type: '' as IrrigationType | '',
  });

  const [seasonStatus, setSeasonStatus] = useState<SeasonStatus | ''>('');
  
  const [crop, setCrop] = useState({
    crop_id: '',
    crop_name: '',
    season: '',
  });

  const [availableCrops, setAvailableCrops] = useState<any[]>(COMMON_CROPS);

  const [skippedSteps, setSkippedSteps] = useState<string[]>([]);

  const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-6fdef95d`;

  // Get user's language from auth
  const userLanguage = user?.language || 'english';

  // Fetch supported crops from database
  React.useEffect(() => {
    async function fetchCrops() {
      try {
        const response = await fetch(`${SERVER_URL}/crops`);
        if (response.ok) {
          const data = await response.json();
          if (data.crops && Array.isArray(data.crops) && data.crops.length > 0) {
            const mappedCrops = data.crops.map((c: any) => ({
              value: c.id,
              label: c.name,
              emoji: c.emoji,
              season: c.season
            }));
            setAvailableCrops(mappedCrops);
          }
        }
      } catch (e) {
        console.error("Failed to fetch crops", e);
      }
    }
    fetchCrops();
  }, []);

  console.log('=== ONBOARDING COMPONENT INITIALIZED ===');
  console.log('Project ID:', projectId);
  console.log('Server URL:', SERVER_URL);
  console.log('User:', user);

  // Handle location detection via browser geolocation
  const handleDetectLocation = () => {
    if ('geolocation' in navigator) {
      toast.info('Detecting your location...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            ...location,
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
          toast.success('Location detected!');
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Could not detect location. Please enter manually.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  // Skip current step
  const handleSkipStep = () => {
    const stepName = currentStep;
    setSkippedSteps([...skippedSteps, stepName]);
    toast.info('Skipped - you can add this later');
    goToNextStep();
  };

  // Navigate to next step
  const goToNextStep = () => {
    const steps: OnboardingStep[] = ['welcome', 'location', 'field', 'season', 'crop', 'value'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  // Save onboarding data to backend
  const saveOnboardingData = async () => {
    setLoading(true);

    try {
      console.log('=== PREPARING TO SAVE ONBOARDING ===');
      console.log('Checking localStorage for auth_token...');
      console.log('All localStorage keys:', Object.keys(localStorage));
      console.log('All localStorage data:', {
        auth_token: localStorage.getItem('auth_token'),
        refresh_token: localStorage.getItem('refresh_token'),
        user: localStorage.getItem('user') ? 'EXISTS' : 'MISSING',
        currentUser: localStorage.getItem('currentUser') ? 'EXISTS' : 'MISSING',
      });
      
      const authToken = localStorage.getItem('auth_token');
      
      if (!authToken) {
        console.error('❌ NO AUTH TOKEN FOUND! User is not authenticated.');
        console.error('localStorage keys:', Object.keys(localStorage));
        console.error('User object passed to onboarding:', user);
        console.error('This might happen if:');
        console.error('1. OTP verification failed to return session data');
        console.error('2. MobileAuthScreen did not save the token');
        console.error('3. You used email/password login instead of OTP');
        toast.error('Authentication error. Please login again with Mobile OTP.');
        
        // Try to redirect to login after 3 seconds
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
        return;
      }
      
      console.log('✅ Auth token found in localStorage');
      console.log('Token starts with:', authToken.substring(0, 20));
      console.log('Token length:', authToken.length);
      console.log('Full token (first 50 chars):', authToken.substring(0, 50) + '...');
      
      // Check if token format is valid (should start with "access_" or "session_")
      if (!authToken.startsWith('access_') && !authToken.startsWith('session_')) {
        console.error('❌ INVALID TOKEN FORMAT!');
        console.error('Token appears to be from old system. Please log out and log in again.');
        toast.error('Your session is outdated. Please log out and log in again.', {
          duration: 6000,
        });
        
        // Clear old token
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        return;
      }
      
      const onboardingData = {
        location: location.village || location.district ? location : null,
        field: field.name && field.area ? field : null,
        season_status: seasonStatus || null,
        crop: crop.crop_id ? crop : null,
        skipped_steps: skippedSteps,
        completed_steps: ['welcome', 'location', 'field', 'season', 'crop'].filter(
          step => !skippedSteps.includes(step)
        ),
        completed: true,
      };

      console.log('\n📦 Onboarding data to send:');
      console.log(JSON.stringify(onboardingData, null, 2));
      
      console.log('\n🚀 Making API request...');
      console.log('URL:', `${SERVER_URL}/onboarding/complete`);
      console.log('Method: POST');
      console.log('Auth header will be: Bearer ' + authToken.substring(0, 20) + '...');

      const response = await fetch(`${SERVER_URL}/onboarding/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(onboardingData),
      });

      const responseText = await response.text();
      console.log('\n===== RESPONSE RECEIVED =====');
      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      console.log('Response body (full):', responseText);
      console.log('============================\n');

      if (!response.ok) {
        let errorMessage = 'Failed to save onboarding data';
        let detailedError = '';
        
        try {
          const error = JSON.parse(responseText);
          errorMessage = error.error || errorMessage;
          detailedError = JSON.stringify(error, null, 2);
          console.error('❌ Server returned error:', errorMessage);
          console.error('❌ Full error object:', detailedError);
        } catch (e) {
          errorMessage = responseText || errorMessage;
          detailedError = responseText;
          console.error('❌ Could not parse error response:', e);
          console.error('❌ Raw error text:', responseText);
        }
        
        // Show more helpful error message
        if (response.status === 401) {
          toast.error('Your session has expired. Please log out and log in again.', {
            duration: 6000,
          });
          
          // Clear tokens
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          
          // Redirect after delay
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          toast.error(`${errorMessage} (Status: ${response.status})`, {
            duration: 6000,
          });
        }
        
        throw new Error(`${errorMessage} (HTTP ${response.status})`);
      }

      const result = JSON.parse(responseText);
      console.log('✅ ✅ ✅ Onboarding saved successfully!');
      console.log('Result:', result);

      toast.success('Profile setup complete!');
      
      // Update user in localStorage with the updated profile
      if (result.user) {
        localStorage.setItem('currentUser', JSON.stringify(result.user));
      }
      
      // Call parent callback with the complete data
      onComplete(result);

    } catch (error: any) {
      console.error('Save onboarding error:', error);
      toast.error(error.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Leaf className="w-12 h-12 text-primary" />
            </div>
            
            <h2 className="text-3xl mb-4 text-foreground">
              Welcome{user?.mobile_number ? `, ${user.mobile_number.slice(-4)}` : ''}! 🌱
            </h2>
            
            <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto">
              I'll help you manage your farm, step by step.
            </p>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-8 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Language:</span>
                <span className="text-sm font-semibold text-foreground capitalize">{userLanguage}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              This will take just 30-60 seconds. You can skip any question.
            </p>

            <button
              onClick={goToNextStep}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              Let's Start
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        );

      case 'location':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl text-foreground">Where is your farm?</h2>
                  <p className="text-sm text-muted-foreground">Used for weather, soil type, and crop advice</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Village/Mandal */}
              <div>
                <label className="block mb-2 text-sm text-foreground">
                  Village / Mandal (Optional)
                </label>
                <input
                  type="text"
                  value={location.village}
                  onChange={(e) => setLocation({ ...location, village: e.target.value })}
                  placeholder="Enter village name"
                  className="w-full px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                />
              </div>

              {/* District */}
              <div>
                <label className="block mb-2 text-sm text-foreground">
                  District *
                </label>
                <input
                  type="text"
                  value={location.district}
                  onChange={(e) => setLocation({ ...location, district: e.target.value })}
                  placeholder="Enter district"
                  className="w-full px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                />
              </div>

              {/* State */}
              <div>
                <label className="block mb-2 text-sm text-foreground">
                  State *
                </label>
                <select
                  value={location.state}
                  onChange={(e) => setLocation({ ...location, state: e.target.value })}
                  className="w-full px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* GPS Detection */}
              <button
                type="button"
                onClick={handleDetectLocation}
                className="w-full py-3 bg-muted/50 text-foreground rounded-lg border-2 border-border hover:border-primary transition-colors flex items-center justify-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                Detect Location (GPS)
              </button>

              {location.lat && location.long && (
                <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg">
                  <p className="text-xs text-foreground">
                    📍 GPS: {location.lat.toFixed(4)}, {location.long.toFixed(4)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSkipStep}
                className="flex-1 py-3 bg-muted/50 text-muted-foreground rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-2"
              >
                <SkipForward className="w-5 h-5" />
                Skip
              </button>
              <button
                onClick={goToNextStep}
                disabled={!location.district || !location.state}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        );

      case 'field':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Square className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl text-foreground">Add your first field</h2>
                  <p className="text-sm text-muted-foreground">This helps us organize your farm data</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Field Name */}
              <div>
                <label className="block mb-2 text-sm text-foreground">
                  Field Name
                </label>
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) => setField({ ...field, name: e.target.value })}
                  placeholder="e.g., Main Field, North Plot"
                  className="w-full px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                />
              </div>

              {/* Field Area */}
              <div>
                <label className="block mb-2 text-sm text-foreground">
                  Approximate Size *
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={field.area}
                    onChange={(e) => setField({ ...field, area: e.target.value })}
                    placeholder="Enter area"
                    min="0"
                    step="0.1"
                    className="flex-1 px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                  />
                  <select
                    value={field.area_unit}
                    onChange={(e) => setField({ ...field, area_unit: e.target.value })}
                    className="w-32 px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                  >
                    {AREA_UNITS.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Irrigation Type */}
              <div>
                <label className="block mb-2 text-sm text-foreground">
                  Irrigation Type (Optional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'rainfed', label: 'Rainfed', icon: '🌧️' },
                    { value: 'borewell', label: 'Borewell', icon: '💧' },
                    { value: 'canal', label: 'Canal', icon: '🌊' },
                    { value: 'other', label: 'Other', icon: '💦' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setField({ ...field, irrigation_type: option.value as IrrigationType })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        field.irrigation_type === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{option.icon}</div>
                      <div className="text-xs text-foreground">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSkipStep}
                className="flex-1 py-3 bg-muted/50 text-muted-foreground rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-2"
              >
                <SkipForward className="w-5 h-5" />
                Skip
              </button>
              <button
                onClick={goToNextStep}
                disabled={!field.name || !field.area}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        );

      case 'season':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sprout className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl text-foreground">What are you planning this season?</h2>
                  <p className="text-sm text-muted-foreground">This helps us time our advice perfectly</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  value: 'planted',
                  emoji: '🌱',
                  title: 'Already Planted',
                  description: 'I have crops growing now',
                },
                {
                  value: 'planning',
                  emoji: '🌾',
                  title: 'Planning to Plant',
                  description: 'I\'m preparing for the next season',
                },
                {
                  value: 'exploring',
                  emoji: '📖',
                  title: 'Just Exploring',
                  description: 'Learning about the platform',
                },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSeasonStatus(option.value as SeasonStatus);
                    // Auto-advance after selection with a slight delay
                    setTimeout(() => goToNextStep(), 500);
                  }}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    seasonStatus === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{option.emoji}</div>
                    <div className="flex-1">
                      <div className="text-foreground mb-1">{option.title}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    </div>
                    {seasonStatus === option.value && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleSkipStep}
              className="w-full py-3 bg-muted/50 text-muted-foreground rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-2"
            >
              <SkipForward className="w-5 h-5" />
              Skip
            </button>
          </motion.div>
        );

      case 'crop':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sprout className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl text-foreground">Which crop?</h2>
                  <p className="text-sm text-muted-foreground">
                    {seasonStatus === 'planted' 
                      ? 'Tell us what you\'re growing'
                      : 'What are you planning to grow?'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Search */}
              <input
                type="text"
                placeholder="Search for a crop..."
                className="w-full px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
              />

              {/* Popular Crops */}
              <div>
                <p className="text-sm text-muted-foreground mb-3">Popular crops in your region:</p>
                <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                  {availableCrops.map((cropOption) => (
                    <button
                      key={cropOption.value}
                      onClick={() => {
                        setCrop({
                          crop_id: cropOption.value,
                          crop_name: cropOption.label,
                          season: cropOption.season,
                        });
                      }}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        crop.crop_id === cropOption.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{cropOption.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-foreground truncate">{cropOption.label}</div>
                        </div>
                        {crop.crop_id === cropOption.value && (
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSkipStep}
                className="flex-1 py-3 bg-muted/50 text-muted-foreground rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-2"
              >
                <SkipForward className="w-5 h-5" />
                Skip for now
              </button>
              <button
                onClick={goToNextStep}
                disabled={!crop.crop_id}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        );

      case 'value':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <Check className="w-10 h-10 text-primary" />
              </motion.div>
              <h2 className="text-2xl mb-2 text-foreground">All Set! 🎉</h2>
              <p className="text-sm text-muted-foreground">
                Here's what you can do today
              </p>
            </div>

            {/* Immediate Value - Weather Forecast */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <CloudRain className="w-6 h-6 text-primary" />
                <h3 className="text-foreground">7-Day Weather Forecast</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {[
                  { day: 'Today', temp: '28°C', condition: '☀️', rain: '10%' },
                  { day: 'Tomorrow', temp: '29°C', condition: '⛅', rain: '30%' },
                  { day: 'Sat', temp: '26°C', condition: '🌧️', rain: '70%' },
                ].map((forecast, i) => (
                  <div key={i} className="bg-background/50 rounded-lg p-3 text-center">
                    <div className="text-xs text-muted-foreground mb-1">{forecast.day}</div>
                    <div className="text-2xl mb-1">{forecast.condition}</div>
                    <div className="text-sm text-foreground mb-1">{forecast.temp}</div>
                    <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <Droplets className="w-3 h-3" />
                      {forecast.rain}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Suggestion */}
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  💡
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Today's Suggestion</h4>
                  <p className="text-sm text-muted-foreground">
                    {seasonStatus === 'planted' 
                      ? 'Rain expected in 2 days. Consider skipping irrigation today to save water and prevent waterlogging.'
                      : seasonStatus === 'planning'
                      ? 'Good soil moisture conditions expected. Ideal for land preparation this week.'
                      : 'Explore the crop calendar to see what grows best in your region and season.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">Your Profile</h4>
              <div className="space-y-2 text-sm">
                {location.district && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{location.district}, {location.state}</span>
                  </div>
                )}
                {field.name && field.area && (
                  <div className="flex items-center gap-2">
                    <Square className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{field.name} - {field.area} {field.area_unit}</span>
                  </div>
                )}
                {crop.crop_name && (
                  <div className="flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{crop.crop_name}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={saveOnboardingData}
              disabled={loading}
              className="w-full py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-lg"
            >
              {loading ? 'Setting up...' : 'Go to Dashboard'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // Progress indicator
  const steps: OnboardingStep[] = ['welcome', 'location', 'field', 'season', 'crop', 'value'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Step {currentStepIndex + 1} of {steps.length}
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-card rounded-2xl p-8 shadow-xl border border-border">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Help text */}
        {currentStep !== 'welcome' && currentStep !== 'value' && (
          <p className="text-center mt-4 text-xs text-muted-foreground">
            You can skip any step and add details later from your profile
          </p>
        )}
      </motion.div>
    </div>
  );
}