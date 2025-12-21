import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lightbulb } from 'lucide-react';

export function DemoHelper() {
  const [show, setShow] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    {
      title: 'Try Voice Journal',
      description: 'Tap the microphone to record your daily farming observations. No typing needed!',
      action: 'voice',
    },
    {
      title: 'Capture Photos',
      description: 'Take photos of plants for AI-powered disease detection and recommendations.',
      action: 'photo',
    },
    {
      title: 'Track Expenses',
      description: 'Add expenses to see real-time budget updates and warnings.',
      action: 'expense',
    },
    {
      title: 'Complete Tasks',
      description: 'Check off daily tasks to see progress tracking in action.',
      action: 'tasks',
    },
  ];

  useEffect(() => {
    const hasSeenHelper = localStorage.getItem('hasSeenDemoHelper');
    if (!hasSeenHelper) {
      setTimeout(() => setShow(true), 2000);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenDemoHelper', 'true');
    setShow(false);
  };

  const nextTip = () => {
    if (currentTip < tips.length - 1) {
      setCurrentTip(currentTip + 1);
    } else {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-40"
        >
          <div className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-2xl border-2 border-primary">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold">{tips[currentTip].title}</h4>
                  <p className="text-xs opacity-80">Tip {currentTip + 1} of {tips.length}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm mb-6 opacity-90">
              {tips[currentTip].description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {tips.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentTip
                        ? 'w-8 bg-primary-foreground'
                        : 'w-1.5 bg-primary-foreground/30'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextTip}
                className="px-4 py-2 bg-primary-foreground text-primary rounded-lg text-sm hover:bg-primary-foreground/90 transition-colors"
              >
                {currentTip < tips.length - 1 ? 'Next' : 'Got it!'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
