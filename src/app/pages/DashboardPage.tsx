import { motion } from 'motion/react';
import { Sprout, Plus, AlertCircle, Mic, Camera, IndianRupee } from 'lucide-react';

export function DashboardPage() {
  const todayGuidance = [
    'Water your north field in the evening',
    'Check for pest signs on tomato plants',
    'Weather forecast: Light rain expected tomorrow',
  ];

  const alerts = [
    'Fertilizer application due in 3 days',
    'Harvest window opens in 2 weeks',
  ];

  return (
    <div className="min-h-screen py-12 px-4 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl sm:text-4xl mb-2 text-foreground">
            Welcome back, Farmer
          </h1>
          <p className="text-xl text-muted-foreground">
            Here's what needs your attention today
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Guidance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sprout className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl text-foreground">Today's Guidance</h2>
              </div>
              <div className="space-y-4">
                {todayGuidance.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-lg text-foreground/90">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl p-8 shadow-sm"
            >
              <h2 className="text-2xl mb-6 text-foreground">Quick Actions</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <button className="flex flex-col items-center gap-3 p-6 bg-primary/5 hover:bg-primary/10 rounded-xl transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Mic className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-foreground">Add Journal Entry</span>
                </button>

                <button className="flex flex-col items-center gap-3 p-6 bg-primary/5 hover:bg-primary/10 rounded-xl transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <IndianRupee className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-foreground">Add Expense</span>
                </button>

                <button className="flex flex-col items-center gap-3 p-6 bg-primary/5 hover:bg-primary/10 rounded-xl transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-foreground">Take Photo</span>
                </button>
              </div>
            </motion.div>

            {/* Recent Journal Entries */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-2xl p-8 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-foreground">Recent Journal</h2>
                <button className="text-primary hover:text-primary/80 transition-colors">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Today, 9:30 AM</span>
                    <Mic className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-foreground">
                    Watered north field. Plants looking healthy, good color.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Yesterday, 4:15 PM</span>
                    <Mic className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-foreground">
                    Applied organic fertilizer as recommended by the app.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-xl text-foreground">Alerts</h3>
              </div>
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className="p-4 bg-accent/5 border border-accent/20 rounded-lg"
                  >
                    <p className="text-sm text-foreground/90">{alert}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* This Season Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-xl mb-6 text-foreground">This Season</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Days In</p>
                  <p className="text-2xl text-foreground">42</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
                  <p className="text-2xl text-foreground">₹12,450</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Estimated Harvest</p>
                  <p className="text-2xl text-foreground">48 days</p>
                </div>
              </div>
            </motion.div>

            {/* Quick Help */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-primary/5 rounded-2xl p-6"
            >
              <h3 className="text-xl mb-3 text-foreground">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We're here to support you. Ask questions anytime.
              </p>
              <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Contact Support
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
