import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  ChevronRight, 
  Truck, 
  MapPin, 
  Mail, 
  Home,
  Check,
  Calendar,
  Clock,
  User,
  Phone,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface SampleSubmissionProps {
  onClose: () => void;
  onSubmit: (method: string, details: any) => void;
  testType: string;
}

interface SubmissionMethod {
  id: string;
  name: string;
  icon: any;
  description: string;
  duration: string;
  cost: string;
  recommended?: boolean;
  available: boolean;
  features: string[];
}

export function SampleSubmission({ onClose, onSubmit, testType }: SampleSubmissionProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('pickup');
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    landmark: '',
    fieldName: 'North Field',
    cropType: 'Tomato',
    pickupDate: '',
    pickupTime: '',
  });

  const submissionMethods: SubmissionMethod[] = [
    {
      id: 'pickup',
      name: 'Lab Pickup',
      icon: Truck,
      description: 'Lab partner sends person to your farm to collect sample',
      duration: 'Same day pickup',
      cost: 'Free',
      recommended: true,
      available: true,
      features: [
        'Free pickup from your farm',
        'No need to go anywhere',
        'Sample reaches lab safely',
        'Track pickup status',
        'Most farmers choose this',
      ],
    },
    {
      id: 'drop',
      name: 'Drop at Center',
      icon: MapPin,
      description: 'Drop sample at nearest collection center',
      duration: 'Drop anytime',
      cost: 'Free',
      available: true,
      features: [
        'Nearest center: 5 km away',
        'Open 9 AM - 6 PM',
        'Drop box available',
        'Get directions on map',
      ],
    },
    {
      id: 'post',
      name: 'Send by Post',
      icon: Mail,
      description: 'Send sample by post/courier to lab',
      duration: '2-3 extra days',
      cost: '₹50-100',
      available: true,
      features: [
        'Get lab address',
        'Pack sample securely',
        'Send via registered post',
        'Enter tracking number',
      ],
    },
    {
      id: 'diy',
      name: 'Home Test Kit',
      icon: Home,
      description: 'DIY test kit delivered to you',
      duration: 'Kit in 2 days',
      cost: '₹50',
      available: testType === 'home',
      features: [
        'Kit delivered to farm',
        'Test yourself at home',
        'Upload results via app',
        'Instant results',
      ],
    },
  ];

  const timeSlots = [
    '9:00 AM - 11:00 AM',
    '11:00 AM - 1:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM',
  ];

  const handleMethodSelect = (methodId: string) => {
    const method = submissionMethods.find(m => m.id === methodId);
    if (!method?.available) {
      toast.error('This method is not available for selected test type');
      return;
    }
    setSelectedMethod(methodId);
  };

  const handleContinue = () => {
    const method = submissionMethods.find(m => m.id === selectedMethod);
    if (!method) return;

    if (selectedMethod === 'pickup') {
      setShowBookingForm(true);
    } else if (selectedMethod === 'drop') {
      toast.info('Opening collection centers map...');
      // In production, open map with centers
      onSubmit('drop', {});
    } else if (selectedMethod === 'post') {
      toast.info('Getting lab address...');
      // In production, show lab address and packing instructions
      onSubmit('post', {});
    } else if (selectedMethod === 'diy') {
      toast.success('Ordering home test kit...');
      onSubmit('diy', {});
    }
  };

  const handleBookPickup = () => {
    // Validate form
    if (!formData.name || !formData.phone || !formData.address || !formData.pickupDate || !formData.pickupTime) {
      toast.error('Please fill all required fields');
      return;
    }

    if (formData.phone.length !== 10) {
      toast.error('Please enter valid 10-digit phone number');
      return;
    }

    toast.success('Pickup booked successfully!');
    onSubmit('pickup', formData);
  };

  if (showBookingForm) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div>
              <h3 className="text-2xl text-foreground mb-1">Book Pickup</h3>
              <p className="text-sm text-muted-foreground">We'll come to collect your sample</p>
            </div>
            <button
              onClick={() => setShowBookingForm(false)}
              className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block mb-2 text-foreground">Your Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full pl-10 pr-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-2 text-foreground">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  placeholder="10-digit mobile number"
                  className="w-full pl-10 pr-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block mb-2 text-foreground">Farm Address *</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Village, Taluka, District"
                rows={3}
                className="w-full px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
              />
            </div>

            {/* Landmark */}
            <div>
              <label className="block mb-2 text-foreground">
                Landmark <span className="text-muted-foreground">(optional)</span>
              </label>
              <input
                type="text"
                value={formData.landmark}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                placeholder="Near school, temple, etc."
                className="w-full px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
              />
            </div>

            {/* Field & Crop */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-2 text-foreground">Field Name</label>
                <input
                  type="text"
                  value={formData.fieldName}
                  onChange={(e) => setFormData({ ...formData, fieldName: e.target.value })}
                  placeholder="North Field"
                  className="w-full px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block mb-2 text-foreground">Crop Type</label>
                <input
                  type="text"
                  value={formData.cropType}
                  onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                  placeholder="Tomato"
                  className="w-full px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                />
              </div>
            </div>

            {/* Pickup Date */}
            <div>
              <label className="block mb-2 text-foreground">Pickup Date *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="date"
                  value={formData.pickupDate}
                  onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                />
              </div>
            </div>

            {/* Pickup Time */}
            <div>
              <label className="block mb-2 text-foreground">Pickup Time Slot *</label>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setFormData({ ...formData, pickupTime: slot })}
                    className={`p-3 rounded-lg border-2 transition-colors text-sm ${
                      formData.pickupTime === slot
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Clock className="w-4 h-4 mx-auto mb-1" />
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-foreground">
                  Our lab partner will call you before arriving. Please keep your soil sample ready.
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-4 border-t border-border">
            <button
              onClick={() => setShowBookingForm(false)}
              className="flex-1 py-3 rounded-lg border-2 border-border hover:bg-muted transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleBookPickup}
              className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Book Pickup
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl p-6 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <div>
            <h3 className="text-2xl text-foreground mb-1">Submit Your Sample</h3>
            <p className="text-sm text-muted-foreground">Choose how you want to submit your soil sample</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Methods */}
        <div className="space-y-4 mb-6">
          {submissionMethods.map((method) => {
            const Icon = method.icon;
            return (
              <motion.button
                key={method.id}
                onClick={() => handleMethodSelect(method.id)}
                disabled={!method.available}
                whileHover={{ scale: method.available ? 1.01 : 1 }}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                  selectedMethod === method.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                } ${!method.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    selectedMethod === method.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-lg text-foreground">{method.name}</h4>
                          {method.recommended && (
                            <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                              Most Popular
                            </span>
                          )}
                          {!method.available && (
                            <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                              Not Available
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                      </div>
                      {selectedMethod === method.id && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{method.duration}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-primary font-medium">{method.cost}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-1">
                      {method.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Help */}
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <div className="text-sm text-foreground mb-1">
            💡 <strong>Most farmers choose Lab Pickup</strong>
          </div>
          <div className="text-sm text-muted-foreground">
            It's free, convenient, and ensures your sample reaches the lab safely without any effort from your side.
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 sticky bottom-0 bg-card pt-4 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg border-2 border-border hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            disabled={!selectedMethod}
            className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <span>Continue</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
