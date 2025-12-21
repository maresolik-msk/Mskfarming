import { motion } from 'motion/react';
import { User, Users2, Globe } from 'lucide-react';
import { useState } from 'react';

export function GetStartedPage() {
  const [userType, setUserType] = useState<'farmer' | 'partner' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    language: 'English',
    farmSize: '',
    organization: '',
    role: '',
  });

  const languages = ['English', 'हिंदी', 'मराठी', 'தமிழ்', 'తెలుగు', 'ગુજરાતી', 'ਪੰਜਾਬੀ'];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl mb-6 text-foreground">
            Get Started
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Choose your path to begin.
          </p>
        </motion.div>

        {!userType ? (
          <div className="grid md:grid-cols-2 gap-8">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setUserType('farmer')}
              className="p-12 bg-card rounded-2xl shadow-sm hover:shadow-lg transition-all text-left group"
            >
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl mb-4 text-foreground">I am a farmer</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Start your journey with personalized farming guidance
              </p>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => setUserType('partner')}
              className="p-12 bg-card rounded-2xl shadow-sm hover:shadow-lg transition-all text-left group"
            >
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Users2 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl mb-4 text-foreground">I am a partner</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Collaborate with us to support farmers in your community
              </p>
            </motion.button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-8 sm:p-12 shadow-lg"
          >
            <button
              onClick={() => setUserType(null)}
              className="text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              ← Back
            </button>

            <h2 className="text-3xl mb-8 text-foreground">
              {userType === 'farmer' ? 'Farmer Registration' : 'Partner Registration'}
            </h2>

            <form className="space-y-6">
              <div>
                <label className="block mb-2 text-foreground">Name *</label>
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
                <label className="block mb-2 text-foreground">Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                  placeholder="Village, District, State"
                />
              </div>

              <div>
                <label className="block mb-2 text-foreground">
                  <Globe className="w-5 h-5 inline mr-2" />
                  Preferred Language *
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {userType === 'farmer' ? (
                <div>
                  <label className="block mb-2 text-foreground">Farm Size (acres) *</label>
                  <input
                    type="text"
                    value={formData.farmSize}
                    onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                    placeholder="e.g., 2"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block mb-2 text-foreground">Organization Name *</label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                      placeholder="NGO / FPO / Institution name"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-foreground">Your Role *</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                      placeholder="e.g., Program Manager"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors mt-8"
              >
                Continue to Dashboard
              </button>
            </form>

            <p className="text-sm text-muted-foreground text-center mt-6">
              By registering, you agree to our terms of service and privacy policy.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
