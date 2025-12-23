import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, MapPin, Sprout, Target, Calendar, CheckCircle2, 
  ChevronRight, ChevronLeft, Droplets, Sun
} from 'lucide-react';
import { updateUserProfile } from '../../lib/api';
import { toast } from 'sonner';

interface OnboardingFlowProps {
  onComplete: (profileData: any) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal
    name: '',
    phone: '',
    language: 'English',
    voicePreference: 'female',
    
    // Step 2: Farm Profile
    location: '',
    totalLand: '',
    numberOfFields: '1',
    waterAccess: 'borewell',
    
    // Step 3: Experience
    yearsOfFarming: '',
    previousCrops: '',
    
    // Step 4: Field Details
    fieldName: '',
    fieldSize: '',
    soilType: 'loamy',
    irrigation: 'flood',
    
    // Step 5: Crop Selection
    selectedCrop: '',
    plantingDate: '',
    budget: '',
  });

  const totalSteps = 5;

  const languages = ['English', 'हिंदी', 'मराठी', 'தமிழ்'];
  const soilTypes = ['Sandy', 'Loamy', 'Clay', 'Black Cotton'];
  const crops = [
    { name: 'Tomato', season: 'Rabi', budget: '₹18,000' },
    { name: 'Cotton', season: 'Kharif', budget: '₹25,000' },
    { name: 'Wheat', season: 'Rabi', budget: '₹15,000' },
    { name: 'Rice', season: 'Kharif', budget: '₹22,000' },
  ];

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = async () => {
    // Save data and complete onboarding
    try {
      // Import and check auth token
      const { getAuthToken } = await import('../../lib/api');
      
      // Wait a moment and retry if token isn't available yet
      let currentToken = getAuthToken();
      let retries = 0;
      while (!currentToken && retries < 5) {
        console.log(`Waiting for auth token... attempt ${retries + 1}/5`);
        await new Promise(resolve => setTimeout(resolve, 500));
        currentToken = getAuthToken();
        retries++;
      }
      
      console.log('=== ONBOARDING COMPLETE - DEBUG ===');
      console.log('Has auth token:', !!currentToken);
      console.log('Token preview:', currentToken ? currentToken.substring(0, 30) + '...' : 'NONE');
      console.log('LocalStorage token:', localStorage.getItem('authToken') ? 'EXISTS' : 'NONE');
      
      if (!currentToken) {
        console.error('NO AUTH TOKEN FOUND! User is not authenticated.');
        toast.error('Authentication error. Please log in again.');
        return;
      }
      
      console.log('Starting profile update with data:', formData);
      const response = await updateUserProfile(formData);
      console.log('Profile update response:', response);
      
      if (response && response.success) {
        toast.success('Profile updated successfully!');
        onComplete(formData);
      } else {
        console.error('Profile update failed - no success flag in response:', response);
        toast.error(`Failed to update profile: ${response?.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Profile update exception:', error);
      toast.error(`An error occurred: ${error instanceof Error ? error.message : 'Please try again.'}`);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-muted-foreground">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round((step / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-2xl p-8 sm:p-12 shadow-lg"
          >
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div>
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl mb-3 text-foreground">Welcome!</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Let's get to know you better
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block mb-2 text-foreground">Your Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-foreground">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                      placeholder="+91 "
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-foreground">Preferred Language *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {languages.map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setFormData({ ...formData, language: lang })}
                          className={`p-4 rounded-lg border-2 transition-colors ${
                            formData.language === lang
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Farm Profile */}
            {step === 2 && (
              <div>
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl mb-3 text-foreground">Your Farm</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Tell us about your land
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block mb-2 text-foreground">Location *</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                      placeholder="Village, District, State"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-foreground">Total Land (acres) *</label>
                      <input
                        type="number"
                        value={formData.totalLand}
                        onChange={(e) => setFormData({ ...formData, totalLand: e.target.value })}
                        className="w-full px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                        placeholder="e.g., 5"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-foreground">Number of Fields *</label>
                      <input
                        type="number"
                        value={formData.numberOfFields}
                        onChange={(e) => setFormData({ ...formData, numberOfFields: e.target.value })}
                        className="w-full px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                        placeholder="e.g., 2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-foreground">Water Access *</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Borewell', 'Canal', 'Rain-fed'].map((access) => (
                        <button
                          key={access}
                          onClick={() => setFormData({ ...formData, waterAccess: access.toLowerCase() })}
                          className={`p-4 rounded-lg border-2 transition-colors ${
                            formData.waterAccess === access.toLowerCase()
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <Droplets className="w-6 h-6 mx-auto mb-2 text-primary" />
                          <span className="text-sm">{access}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Experience */}
            {step === 3 && (
              <div>
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl mb-3 text-foreground">Your Experience</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  This helps us guide you better
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block mb-2 text-foreground">Years of Farming</label>
                    <input
                      type="number"
                      value={formData.yearsOfFarming}
                      onChange={(e) => setFormData({ ...formData, yearsOfFarming: e.target.value })}
                      className="w-full px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                      placeholder="e.g., 10"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-foreground">Crops You've Grown</label>
                    <textarea
                      value={formData.previousCrops}
                      onChange={(e) => setFormData({ ...formData, previousCrops: e.target.value })}
                      className="w-full px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                      rows={3}
                      placeholder="e.g., Tomato, Cotton, Wheat..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Field Setup */}
            {step === 4 && (
              <div>
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Sprout className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl mb-3 text-foreground">Field Details</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Let's set up your first field
                </p>

                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-foreground">Field Name *</label>
                      <input
                        type="text"
                        value={formData.fieldName}
                        onChange={(e) => setFormData({ ...formData, fieldName: e.target.value })}
                        className="w-full px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                        placeholder="e.g., North Field"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-foreground">Field Size (acres) *</label>
                      <input
                        type="number"
                        value={formData.fieldSize}
                        onChange={(e) => setFormData({ ...formData, fieldSize: e.target.value })}
                        className="w-full px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                        placeholder="e.g., 2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-foreground">Soil Type *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {soilTypes.map((soil) => (
                        <button
                          key={soil}
                          onClick={() => setFormData({ ...formData, soilType: soil.toLowerCase() })}
                          className={`p-4 rounded-lg border-2 transition-colors ${
                            formData.soilType === soil.toLowerCase()
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          {soil}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Crop Selection */}
            {step === 5 && (
              <div>
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl mb-3 text-foreground">Choose Your Crop</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Based on season and your soil
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block mb-2 text-foreground">Recommended Crops *</label>
                    <div className="space-y-3">
                      {crops.map((crop) => (
                        <button
                          key={crop.name}
                          onClick={() => setFormData({ ...formData, selectedCrop: crop.name, budget: crop.budget })}
                          className={`w-full p-6 rounded-xl border-2 transition-colors text-left ${
                            formData.selectedCrop === crop.name
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-xl mb-1 text-foreground">{crop.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {crop.season} Season • Est. Budget: {crop.budget}
                              </p>
                            </div>
                            {formData.selectedCrop === crop.name && (
                              <CheckCircle2 className="w-6 h-6 text-primary" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-foreground">When do you want to start? *</label>
                    <input
                      type="date"
                      value={formData.plantingDate}
                      onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
                      className="w-full px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
              <button
                onClick={prevStep}
                disabled={step === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                  step === 1
                    ? 'text-muted-foreground cursor-not-allowed'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>

              {step < totalSteps ? (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Complete Setup
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}