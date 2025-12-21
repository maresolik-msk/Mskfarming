import { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, X, Check, AlertTriangle, Leaf } from 'lucide-react';
import { toast } from 'sonner';

interface PhotoCaptureProps {
  onSave: (photo: {
    category: string;
    notes: string;
    analysis: any;
    timestamp: Date;
  }) => void;
  onClose: () => void;
}

export function PhotoCapture({ onSave, onClose }: PhotoCaptureProps) {
  const [hasPhoto, setHasPhoto] = useState(false);
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const categories = [
    { id: 'plant-health', label: 'Plant Health', icon: Leaf },
    { id: 'pest', label: 'Pest/Disease', icon: AlertTriangle },
    { id: 'soil', label: 'Soil Condition', icon: Leaf },
    { id: 'harvest', label: 'Harvest Quality', icon: Check },
  ];

  const takePhoto = () => {
    setHasPhoto(true);
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const analyses = [
        {
          detected: 'Tomato Plant',
          issue: 'Early Blight',
          severity: 'Medium',
          recommendations: [
            'Remove affected leaves',
            'Apply copper fungicide',
            'Improve air circulation',
            'Reduce overhead watering',
          ],
          urgency: 'Act in 2 days',
        },
        {
          detected: 'Healthy Tomato Plant',
          issue: null,
          severity: 'None',
          recommendations: [
            'Continue current care routine',
            'Monitor for any changes',
            'Maintain watering schedule',
          ],
          urgency: 'Regular monitoring',
        },
        {
          detected: 'Nutrient Deficiency',
          issue: 'Nitrogen Deficiency',
          severity: 'Low',
          recommendations: [
            'Apply nitrogen-rich fertilizer',
            'Use organic compost',
            'Monitor leaf color improvement',
          ],
          urgency: 'Act within week',
        },
      ];
      
      setAnalysis(analyses[Math.floor(Math.random() * analyses.length)]);
      setIsAnalyzing(false);
      toast.success('Photo analyzed');
    }, 2000);
  };

  const savePhoto = () => {
    onSave({
      category,
      notes,
      analysis,
      timestamp: new Date(),
    });
    toast.success('Photo saved to journal');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl text-foreground">Photo Documentation</h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!hasPhoto ? (
          <div className="text-center py-8">
            <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
              <Camera className="w-16 h-16 text-muted-foreground" />
            </div>
            <h4 className="text-xl mb-2 text-foreground">Take a Photo</h4>
            <p className="text-muted-foreground mb-6">
              Capture plant, pest, soil, or harvest
            </p>
            <button
              onClick={takePhoto}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 mx-auto"
            >
              <Camera className="w-5 h-5" />
              Open Camera
            </button>
            <p className="mt-4 text-sm text-muted-foreground">
              Demo: Simulated photo capture
            </p>
          </div>
        ) : (
          <div>
            {/* Photo Preview */}
            <div className="mb-6">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <Camera className="w-16 h-16 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Photo Captured</p>
                </div>
              </div>
            </div>

            {/* Category Selection */}
            <div className="mb-6">
              <label className="block mb-3 text-foreground">What's this photo about? *</label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      category === cat.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <cat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <span className="text-sm">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Analysis */}
            {isAnalyzing ? (
              <div className="bg-muted rounded-lg p-6 mb-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-foreground">Analyzing photo...</p>
              </div>
            ) : analysis && (
              <div className="bg-muted rounded-lg p-6 mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    analysis.issue ? 'bg-orange-500/10' : 'bg-green-500/10'
                  }`}>
                    {analysis.issue ? (
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                    ) : (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-foreground mb-1">
                      ✓ Detected: {analysis.detected}
                    </h4>
                    {analysis.issue && (
                      <p className="text-orange-600 mb-2">
                        ⚠️ Issue Found: {analysis.issue}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="text-sm mb-2 text-foreground">Recommendations:</h5>
                  <ul className="space-y-1">
                    {analysis.recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        {idx + 1}. {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-sm">
                  <span className="text-muted-foreground">Urgency: </span>
                  <span className={analysis.issue ? 'text-orange-600' : 'text-green-600'}>
                    {analysis.urgency}
                  </span>
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="mb-6">
              <label className="block mb-2 text-foreground">Add notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                rows={3}
                placeholder="Any additional observations..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setHasPhoto(false);
                  setCategory('');
                  setNotes('');
                  setAnalysis(null);
                }}
                className="flex-1 py-3 rounded-lg border-2 border-border hover:bg-muted transition-colors"
              >
                Retake
              </button>
              <button
                onClick={savePhoto}
                disabled={!category}
                className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Save Photo
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
