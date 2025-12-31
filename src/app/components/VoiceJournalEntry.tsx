import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Square, Play, Pause, X, Check, Camera } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceJournalEntryProps {
  onSave: (entry: {
    text: string;
    timestamp: Date;
    duration: number;
    location: string;
    weather: string;
  }) => void;
  onClose: () => void;
  currentFieldName?: string;
}

export function VoiceJournalEntry({ onSave, onClose, currentFieldName }: VoiceJournalEntryProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [transcribedText, setTranscribedText] = useState('');
  const [hasRecording, setHasRecording] = useState(false);

  // Simulate recording timer
  useState(() => {
    let interval: number;
    if (isRecording && !isPaused) {
      interval = window.setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  });

  const startRecording = () => {
    setIsRecording(true);
    setDuration(0);
    toast.success('Recording started');
  };

  const pauseRecording = () => {
    setIsPaused(!isPaused);
    toast.info(isPaused ? 'Resumed' : 'Paused');
  };

  const stopRecording = () => {
    setIsRecording(false);
    setHasRecording(true);
    // Simulate transcription
    const sampleTexts = [
      'Watered the field today morning. Plants looking healthy. Some yellow leaves on north corner.',
      'Applied fertilizer to all tomato plants. Weather is good. Need to check for pests tomorrow.',
      'Harvested first batch of tomatoes. Quality looks excellent. Market price is favorable.',
    ];
    setTranscribedText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
    toast.success('Recording stopped');
  };

  const saveEntry = () => {
    onSave({
      text: transcribedText,
      timestamp: new Date(),
      duration,
      location: currentFieldName || 'Unknown Location',
      weather: '28°C, Clear',
    });
    toast.success('Journal entry saved');
    onClose();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl p-6 max-w-lg w-full shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl text-foreground">Voice Journal</h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Recording Interface */}
        {!hasRecording ? (
          <div className="text-center py-8">
            <div className="relative inline-block mb-8">
              {isRecording && !isPaused && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/20"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                {isRecording ? (
                  <Square className="w-10 h-10 text-white" />
                ) : (
                  <Mic className="w-10 h-10 text-white" />
                )}
              </button>
            </div>

            <div className="mb-6">
              <div className="text-4xl mb-2 text-foreground">
                {formatDuration(duration)}
              </div>
              <p className="text-muted-foreground">
                {isRecording
                  ? isPaused
                    ? 'Paused - Tap to resume'
                    : 'Recording...'
                  : 'Tap to start recording'}
              </p>
            </div>

            {isRecording && (
              <div className="flex gap-3 justify-center">
                <button
                  onClick={pauseRecording}
                  className="px-6 py-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors flex items-center gap-2"
                >
                  {isPaused ? (
                    <>
                      <Play className="w-4 h-4" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4" />
                      Pause
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Transcribed Text */}
            <div className="bg-muted rounded-lg p-4 mb-6">
              <label className="block mb-2 text-sm text-muted-foreground">
                Transcribed Text
              </label>
              <textarea
                value={transcribedText}
                onChange={(e) => setTranscribedText(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-foreground resize-none"
                rows={5}
              />
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-muted rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Duration</div>
                <div className="text-foreground">{formatDuration(duration)}</div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Location</div>
                <div className="text-foreground">{currentFieldName || 'Unknown Location'}</div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Date & Time</div>
                <div className="text-foreground">{new Date().toLocaleString()}</div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Weather</div>
                <div className="text-foreground">28°C, Clear</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setHasRecording(false);
                  setTranscribedText('');
                  setDuration(0);
                }}
                className="flex-1 py-3 rounded-lg border-2 border-border hover:bg-muted transition-colors"
              >
                Re-record
              </button>
              <button
                onClick={saveEntry}
                className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Save Entry
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
