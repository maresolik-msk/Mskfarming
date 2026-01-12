import { motion } from 'motion/react';
import {
  ChevronDown,
  CheckCircle2,
  Plus,
  TrendingUp,
  BookOpen,
  Wallet,
  FlaskConical,
  ClipboardList
} from 'lucide-react';
import { HomeView } from './HomeView';
import { CropSimulator } from './CropSimulator';
import { CropManager } from './CropManager';
import { BudgetOverview } from './BudgetOverview';
import { UserProfile } from './UserProfile';
import { AnimalHusbandry } from './AnimalHusbandry';
import { FarmMachinery } from './FarmMachinery';
import { FieldScouting } from './FieldScouting';
import { InputApplicationsLog } from './InputApplicationsLog';
import { HarvestRecording } from './HarvestRecording';
import { KrishiKarmaWidget } from './KrishiKarmaWidget';
import Logo from '../../imports/Logo';

interface MainDashboardContentProps {
  activeView: string;
  availableFields: any[];
  userProfile: any;
  farmerName: string;
  cropInfo: any;
  tasks: any[];
  budget: number;
  currentField: any;
  karmaPoints: number;
  karmaLevel: number;
  nextLevelPoints: number;
  currentFieldExpenses: any[];
  t: (key: string) => string;
  setShowAddFieldModal: (show: boolean) => void;
  toggleTask: (id: string) => void;
  setShowVoiceJournal: (show: boolean) => void;
  setShowPhotoCapture: (show: boolean) => void;
  setShowExpenseTracker: (show: boolean) => void;
  setShowFarmingJournal: (show: boolean) => void;
  playGuidance: () => void;
  handleTestSoil: () => void;
  setShowSeedSelection: (show: boolean) => void;
  setShowCropDetails: (show: boolean) => void;
  setActiveView: (view: string) => void;
  handleUpdateBudget: (amount: number) => void;
  setUserProfile: (profile: any) => void;
}

export function MainDashboardContent({
  activeView,
  availableFields,
  userProfile,
  farmerName,
  cropInfo,
  tasks,
  budget,
  currentField,
  karmaPoints,
  karmaLevel,
  nextLevelPoints,
  currentFieldExpenses,
  t,
  setShowAddFieldModal,
  toggleTask,
  setShowVoiceJournal,
  setShowPhotoCapture,
  setShowExpenseTracker,
  setShowFarmingJournal,
  playGuidance,
  handleTestSoil,
  setShowSeedSelection,
  setShowCropDetails,
  setActiveView,
  handleUpdateBudget,
  setUserProfile
}: MainDashboardContentProps) {
  return (
    <div className="max-w-4xl px-[16px] pb-20 py-[0px] mt-[0px] mr-[0px] mb-[44px] ml-[0px]">
      {activeView === 'dashboard' ? (
        <>
          {availableFields.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 px-6"
            >
              {/* Futuristic welcome card with glassmorphism */}
              <div className="relative max-w-2xl mx-auto">
                {/* Ambient glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#812F0F]/20 via-amber-500/10 to-orange-400/20 blur-3xl -z-10 animate-pulse" />
                
                <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 dark:from-white/5 dark:to-white/[0.02] border border-white/20 dark:border-white/10 rounded-[32px] p-12 shadow-2xl relative overflow-hidden">
                  {/* Decorative gradient overlay */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#812F0F]/20 via-amber-500/10 to-transparent rounded-full blur-3xl -z-10" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-orange-400/20 via-amber-300/10 to-transparent rounded-full blur-3xl -z-10" />
                  
                  {/* Logo with enhanced styling */}
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative w-32 h-32 mx-auto mb-8"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#812F0F] to-amber-600 rounded-3xl rotate-6 opacity-20 blur-xl animate-pulse" />
                    <div className="relative w-full h-full bg-gradient-to-br from-[#812F0F]/20 to-amber-500/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-2xl p-8">
                      <Logo />
                    </div>
                  </motion.div>
                  
                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#812F0F] via-amber-600 to-orange-500 bg-clip-text text-transparent"
                    style={{ fontFamily: 'Megrim, cursive' }}
                  >
                    {t('dashboard.welcomeMessage')}
                  </motion.h2>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-muted-foreground/80 mb-10 max-w-md mx-auto text-lg leading-relaxed"
                  >
                    {t('dashboard.welcomeSub')}
                  </motion.p>
                  
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddFieldModal(true)}
                    className="group relative px-10 py-5 bg-gradient-to-r from-[#812F0F] via-[#9a3810] to-[#812F0F] text-white rounded-3xl font-bold text-lg shadow-2xl shadow-[#812F0F]/40 flex items-center gap-3 mx-auto overflow-hidden"
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    
                    <Plus className="w-6 h-6 relative z-10" />
                    <span className="relative z-10">{t('dashboard.addNewField')}</span>
                    
                    {/* Golden hour glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/20 to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Enhanced HomeView container */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#812F0F]/10 via-amber-500/5 to-orange-400/10 rounded-[32px] blur-2xl -z-10" />
                  <HomeView 
                    farmerName={userProfile?.name || farmerName}
                    cropInfo={cropInfo}
                    tasks={tasks}
                    budget={budget}
                    soilHealth={currentField?.soilProfile ? {
                        lastTested: currentField.soilProfile.lastTested,
                        status: currentField.soilProfile.results.riskLevel === 'high' ? 'Critical' : 
                                currentField.soilProfile.results.riskLevel === 'medium' ? 'Attention' : 'Good',
                        riskLevel: currentField.soilProfile.results.riskLevel
                    } : undefined}
                    onToggleTask={toggleTask}
                    onAction={(action) => {
                      switch(action) {
                        case 'voice': setShowVoiceJournal(true); break;
                        case 'photo': setShowPhotoCapture(true); break;
                        case 'expense': setShowExpenseTracker(true); break;
                        case 'journal': setShowFarmingJournal(true); break;
                        case 'guidance': playGuidance(); break;
                        case 'soil-test': handleTestSoil(); break;
                        case 'seed-selection': setShowSeedSelection(true); break;
                        case 'crop-details': setShowCropDetails(true); break;
                      }
                    }}
                  />
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                    {/* Krishi Karma Widget with glow */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-400/10 to-[#812F0F]/20 rounded-[28px] blur-xl -z-10" />
                      <KrishiKarmaWidget 
                        points={karmaPoints} 
                        level={karmaLevel} 
                        nextLevelPoints={nextLevelPoints} 
                      />
                    </div>

                    {/* Daily Tasks with premium glassmorphism */}
                    <div className="relative group">
                      {/* Ambient glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#812F0F]/20 via-amber-500/10 to-orange-400/10 rounded-[28px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                      
                      <div className="backdrop-blur-xl bg-gradient-to-br from-white/80 to-white/60 dark:from-white/5 dark:to-white/[0.02] border border-white/30 dark:border-white/10 rounded-[28px] p-6 shadow-xl relative overflow-hidden">
                        {/* Top gradient accent */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#812F0F]/50 to-transparent" />
                        
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#812F0F] to-amber-600 flex items-center justify-center shadow-lg shadow-[#812F0F]/30">
                              <CheckCircle2 className="w-5 h-5 text-white" />
                              {/* Icon glow */}
                              <div className="absolute inset-0 bg-gradient-to-br from-[#812F0F] to-amber-600 rounded-2xl blur-md opacity-50 -z-10" />
                            </div>
                            <h3 className="font-bold text-foreground text-lg">Today's Tasks</h3>
                          </div>
                          <span className="text-sm font-bold text-muted-foreground backdrop-blur-sm bg-gradient-to-br from-muted/80 to-muted/60 px-4 py-1.5 rounded-full border border-white/20 shadow-sm">
                            {tasks.filter(t => t.completed).length}/{tasks.length}
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          {tasks.length === 0 ? (
                            <div className="text-center py-10">
                              <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center backdrop-blur-sm border border-white/20">
                                <ClipboardList className="w-10 h-10 text-muted-foreground/40" />
                              </div>
                              <p className="text-muted-foreground font-medium">No tasks yet.</p>
                              <p className="text-xs text-muted-foreground/60 mt-2">Add a field to get recommendations.</p>
                            </div>
                          ) : (
                            tasks.map((task, idx) => (
                              <motion.div 
                                key={task.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => toggleTask(task.id)}
                                className={`group/task relative flex items-start gap-3 p-4 rounded-2xl transition-all cursor-pointer border overflow-hidden ${
                                  task.completed 
                                    ? 'bg-gradient-to-br from-muted/40 to-muted/20 border-white/10 opacity-60' 
                                    : 'bg-gradient-to-br from-white/60 to-white/40 dark:from-white/5 dark:to-white/[0.02] border-white/30 dark:border-white/10 hover:border-[#812F0F]/40 hover:shadow-lg hover:shadow-[#812F0F]/10 backdrop-blur-sm'
                                }`}
                              >
                                {/* Hover gradient effect */}
                                {!task.completed && (
                                  <div className="absolute inset-0 bg-gradient-to-r from-[#812F0F]/5 via-amber-500/5 to-orange-400/5 opacity-0 group-hover/task:opacity-100 transition-opacity duration-300" />
                                )}
                                
                                <div className={`relative mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                  task.completed
                                    ? 'bg-gradient-to-br from-[#812F0F] to-amber-600 border-[#812F0F] shadow-lg shadow-[#812F0F]/30'
                                    : 'border-muted-foreground/30 group-hover/task:border-[#812F0F]/50 group-hover/task:scale-110'
                                }`}>
                                  {task.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                                </div>
                                
                                <div className="flex-1 relative z-10">
                                  <p className={`text-sm font-medium transition-all ${
                                    task.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                                  }`}>
                                    {task.text}
                                  </p>
                                  <p className="text-xs text-muted-foreground/70 mt-1.5 flex items-center gap-1">
                                    {task.time}
                                  </p>
                                </div>
                              </motion.div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                </motion.div>
              </div>
              
              {/* Premium Quick Actions Grid with glassmorphism */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative mb-20"
              >
                {/* Section ambient glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#812F0F]/10 via-amber-500/5 to-orange-400/10 rounded-3xl blur-3xl -z-10" />
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { 
                      icon: BookOpen, 
                      label: 'Log Activity', 
                      onClick: () => setShowFarmingJournal(true),
                      gradient: 'from-blue-500 to-cyan-500',
                      bgGradient: 'from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20'
                    },
                    { 
                      icon: Wallet, 
                      label: 'Add Expense', 
                      onClick: () => setActiveView('expenses'),
                      gradient: 'from-orange-500 to-amber-500',
                      bgGradient: 'from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20'
                    },
                    { 
                      icon: FlaskConical, 
                      label: 'Test Soil', 
                      onClick: handleTestSoil,
                      gradient: 'from-purple-500 to-pink-500',
                      bgGradient: 'from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20'
                    },
                    { 
                      icon: null, 
                      label: 'Seed Select', 
                      onClick: () => setShowSeedSelection(true),
                      gradient: 'from-green-500 to-emerald-500',
                      bgGradient: 'from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20',
                      isLogo: true
                    }
                  ].map((action, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={action.onClick}
                      className="group/action relative flex flex-col items-center gap-3 p-5 backdrop-blur-xl bg-gradient-to-br from-white/70 to-white/50 dark:from-white/5 dark:to-white/[0.02] border border-white/30 dark:border-white/10 rounded-3xl hover:border-white/50 dark:hover:border-white/20 transition-all overflow-hidden shadow-lg hover:shadow-xl"
                    >
                      {/* Animated gradient background on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${action.bgGradient} opacity-0 group-hover/action:opacity-100 transition-opacity duration-500`} />
                      
                      {/* Icon container with premium styling */}
                      <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${action.bgGradient} flex items-center justify-center group-hover/action:scale-110 transition-all duration-300 shadow-lg ${action.isLogo ? 'p-3' : ''}`}>
                        {action.isLogo ? (
                          <Logo />
                        ) : (
                          action.icon && <action.icon className={`w-6 h-6 bg-gradient-to-br ${action.gradient} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text', backgroundClip: 'text' }} />
                        )}
                        {/* Icon glow effect */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} rounded-2xl blur-xl opacity-0 group-hover/action:opacity-50 transition-opacity -z-10`} />
                      </div>
                      
                      <span className="relative text-xs font-bold text-center text-foreground/80 group-hover/action:text-foreground transition-colors z-10">
                        {action.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </>
      ) : activeView === 'crop_sim' ? (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 pt-2"
        >
          <div className="flex items-center gap-3 mb-8">
            <motion.button 
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveView('dashboard')} 
              className="p-2.5 hover:bg-gradient-to-br from-muted/80 to-muted/60 rounded-2xl transition-all backdrop-blur-sm border border-white/20"
            >
              <ChevronDown className="w-5 h-5 rotate-90" />
            </motion.button>
            <div className="flex-1">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#812F0F] via-amber-600 to-orange-500 bg-clip-text text-transparent" style={{ fontFamily: 'Megrim, cursive' }}>
                Crop Intelligence Engine
              </h2>
              <div className="h-1 w-32 bg-gradient-to-r from-[#812F0F] via-amber-500 to-transparent rounded-full mt-2" />
            </div>
          </div>
          <CropSimulator />
        </motion.div>
      ) : activeView === 'crop_manager' ? (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 md:p-6 min-h-screen bg-gradient-to-br from-background/50 via-background/30 to-background/50"
        >
          <motion.button 
            whileHover={{ scale: 1.02, x: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveView('dashboard')} 
            className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors mb-6 md:mb-8 group backdrop-blur-sm"
          >
            <div className="p-2 rounded-2xl bg-gradient-to-br from-muted/60 to-muted/40 group-hover:from-muted/80 group-hover:to-muted/60 transition-all backdrop-blur-sm border border-white/20 shadow-sm">
              <ChevronDown className="w-4 h-4 rotate-90" />
            </div>
            <span className="font-bold text-sm">Back to Dashboard</span>
          </motion.button>
          <CropManager />
        </motion.div>
      ) : activeView === 'expenses' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <BudgetOverview 
            budget={budget}
            expenses={currentFieldExpenses}
            onAddExpense={() => setShowExpenseTracker(true)}
            onBack={() => setActiveView('dashboard')}
            onUpdateBudget={handleUpdateBudget}
          />
        </motion.div>
      ) : activeView === 'market' ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <motion.button 
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveView('dashboard')} 
              className="p-2.5 hover:bg-gradient-to-br from-muted/80 to-muted/60 rounded-2xl transition-all backdrop-blur-sm border border-white/20"
            >
              <ChevronDown className="w-5 h-5 rotate-90" />
            </motion.button>
            <div className="flex-1">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#812F0F] via-amber-600 to-orange-500 bg-clip-text text-transparent" style={{ fontFamily: 'Megrim, cursive' }}>
                Market Prices
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-[#812F0F] via-amber-500 to-transparent rounded-full mt-2" />
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#812F0F]/20 via-amber-500/10 to-orange-400/10 rounded-3xl blur-2xl -z-10" />
            <div className="p-12 text-center backdrop-blur-xl bg-gradient-to-br from-white/70 to-white/50 dark:from-white/5 dark:to-white/[0.02] border border-white/30 dark:border-white/10 rounded-3xl shadow-xl">
              <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-[#812F0F]/20 to-amber-500/20 flex items-center justify-center backdrop-blur-sm border border-white/20">
                <TrendingUp className="w-10 h-10 text-[#812F0F]/60" />
              </div>
              <p className="text-muted-foreground font-medium">Market prices module loading...</p>
            </div>
          </div>
        </motion.div>
      ) : activeView === 'profile' ? (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <UserProfile 
            onBack={() => setActiveView('dashboard')} 
            onProfileUpdate={(updatedProfile) => {
              setUserProfile(updatedProfile);
            }}
          />
        </motion.div>
      ) : activeView === 'animals' ? (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <AnimalHusbandry onBack={() => setActiveView('dashboard')} />
        </motion.div>
      ) : activeView === 'machinery' ? (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <FarmMachinery onBack={() => setActiveView('dashboard')} />
        </motion.div>
      ) : activeView === 'scouting' ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 md:p-6"
        >
          <FieldScouting 
            fields={availableFields} 
            onClose={() => setActiveView('dashboard')} 
          />
        </motion.div>
      ) : activeView === 'inputs' ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 md:p-6"
        >
          <InputApplicationsLog 
            fields={availableFields} 
            onClose={() => setActiveView('dashboard')} 
          />
        </motion.div>
      ) : activeView === 'harvest' ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 md:p-6"
        >
          <HarvestRecording 
            fields={availableFields} 
            onClose={() => setActiveView('dashboard')} 
          />
        </motion.div>
      ) : null}
    </div>
  );
}
