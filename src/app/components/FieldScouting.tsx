import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Camera,
  Mic,
  AlertTriangle,
  Bug,
  Droplets,
  Leaf,
  TrendingUp,
  MapPin,
  X,
  ChevronRight,
  CircleCheck,
  CircleAlert,
  Info,
  Upload,
  Trash2,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { ScoutingRecord, ScoutingCategory, ScoutingPhoto } from '../types/farm-management';

interface FieldScoutingProps {
  fields: any[];
  onClose?: () => void;
}

export function FieldScouting({ fields, onClose }: FieldScoutingProps) {
  const [view, setView] = useState<'list' | 'new' | 'detail'>('list');
  const [scoutingRecords, setScoutingRecords] = useState<ScoutingRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<ScoutingRecord | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadScoutingRecords();
  }, []);

  const loadScoutingRecords = async () => {
    try {
      // Load from backend/localStorage
      const stored = localStorage.getItem('mila_scouting_records');
      if (stored) {
        setScoutingRecords(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load scouting records:', error);
    }
  };

  const saveScoutingRecords = (records: ScoutingRecord[]) => {
    localStorage.setItem('mila_scouting_records', JSON.stringify(records));
    setScoutingRecords(records);
  };

  if (view === 'new') {
    return (
      <NewScoutingForm
        fields={fields}
        onSave={(record) => {
          const updated = [...scoutingRecords, record];
          saveScoutingRecords(updated);
          toast.success('Scouting record saved successfully');
          setView('list');
        }}
        onCancel={() => setView('list')}
      />
    );
  }

  if (view === 'detail' && selectedRecord) {
    return (
      <ScoutingDetail
        record={selectedRecord}
        onClose={() => setView('list')}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4">
        {/* Top Row: Back Button + Title */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            {onClose && (
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#812F0F]/10 to-[#963714]/10 backdrop-blur-sm border border-[#812F0F]/20 hover:bg-[#812F0F]/20 flex items-center justify-center transition-all hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5 text-[#812F0F]" />
              </button>
            )}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
              <Search className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-[Megrim] text-foreground">
                Field Scouting
              </h2>
              <p className="text-sm text-muted-foreground">
                AI-Powered Issue Detection
              </p>
            </div>
          </div>
        </div>
        
        {/* Middle Row: Description */}
        <p className="text-muted-foreground text-sm ml-[58px]">
          Track pest, disease, and crop health issues in real-time with photo documentation
        </p>

        {/* Bottom Row: Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="ml-[58px]"
        >
          <Button
            onClick={() => setView('new')}
            className="bg-gradient-to-r from-[#812F0F] to-[#963714] hover:from-[#963714] hover:to-[#812F0F] text-white gap-3 shadow-lg shadow-[#812F0F]/30 px-8 py-6 rounded-xl transition-all hover:scale-105 text-base font-semibold"
          >
            <Camera className="w-5 h-5" />
            Create New Scout Report
          </Button>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-background">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Scouts</p>
                <p className="text-3xl font-bold text-orange-600">{scoutingRecords.length}</p>
              </div>
              <Search className="w-8 h-8 text-orange-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-background">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Issues</p>
                <p className="text-3xl font-bold text-red-600">
                  {scoutingRecords.filter(r => r.severity >= 4).length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-3xl font-bold text-blue-600">
                  {scoutingRecords.filter(r => {
                    const recordDate = new Date(r.scoutedAt);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return recordDate > weekAgo;
                  }).length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Severity</p>
                <p className="text-3xl font-bold text-green-600">
                  {scoutingRecords.length > 0
                    ? (scoutingRecords.reduce((acc, r) => acc + r.severity, 0) / scoutingRecords.length).toFixed(1)
                    : '0'}
                </p>
              </div>
              <Leaf className="w-8 h-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scouting Records List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Scouting Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {scoutingRecords.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4" />
              <h3 className="font-bold text-lg mb-2">No Scouting Reports Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start scouting your fields to track pest, disease, and crop health
              </p>
              <Button onClick={() => setView('new')} className="gap-2">
                <Camera className="w-4 h-4" />
                Create First Report
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {scoutingRecords
                .sort((a, b) => new Date(b.scoutedAt).getTime() - new Date(a.scoutedAt).getTime())
                .map((record) => (
                  <ScoutingRecordCard
                    key={record.id}
                    record={record}
                    fields={fields}
                    onClick={() => {
                      setSelectedRecord(record);
                      setView('detail');
                    }}
                  />
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ScoutingRecordCard({
  record,
  fields,
  onClick,
}: {
  record: ScoutingRecord;
  fields: any[];
  onClick: () => void;
}) {
  const field = fields.find((f) => f.id === record.fieldId);
  const severityColors = {
    1: 'text-green-600 bg-green-100 dark:bg-green-950',
    2: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-950',
    3: 'text-orange-600 bg-orange-100 dark:bg-orange-950',
    4: 'text-red-600 bg-red-100 dark:bg-red-950',
    5: 'text-red-700 bg-red-200 dark:bg-red-900',
  };

  const categoryIcons: Record<ScoutingCategory, any> = {
    pest: Bug,
    disease: AlertTriangle,
    weed: Leaf,
    'nutrient-deficiency': Droplets,
    'water-stress': Droplets,
    lodging: TrendingUp,
    other: Info,
  };

  const Icon = categoryIcons[record.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="p-4 rounded-xl border bg-card hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shrink-0">
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold capitalize">{record.category.replace('-', ' ')}</h3>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  severityColors[record.severity]
                }`}
              >
                Severity {record.severity}/5
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {field?.name || 'Unknown Field'} • {record.affectedAreaPercent}% affected
            </p>
            <p className="text-sm line-clamp-2">{record.notes}</p>
            {record.diagnosis && (
              <div className="mt-3 flex items-center gap-2 text-xs text-primary">
                <CircleCheck className="w-4 h-4" />
                <span className="font-semibold">
                  {record.diagnosis.likelyIssues.length} diagnosis • {record.diagnosis.immediateActions.length} actions
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-muted-foreground mb-1">
            {new Date(record.scoutedAt).toLocaleDateString()}
          </p>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>
    </motion.div>
  );
}

function NewScoutingForm({
  fields,
  onSave,
  onCancel,
}: {
  fields: any[];
  onSave: (record: ScoutingRecord) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    fieldId: '',
    category: '' as ScoutingCategory,
    severity: 3,
    affectedAreaPercent: 10,
    notes: '',
  });
  const [photos, setPhotos] = useState<ScoutingPhoto[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fieldId) {
      toast.error('Please select a field');
      return;
    }
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }
    if (!formData.notes.trim()) {
      toast.error('Please add your observations');
      return;
    }

    // Simulate AI diagnosis
    setAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const record: ScoutingRecord = {
      id: `scout_${Date.now()}`,
      ...formData,
      severity: formData.severity as 1 | 2 | 3 | 4 | 5,
      photos,
      scoutedAt: new Date().toISOString(),
      diagnosis: {
        likelyIssues: [
          {
            name: formData.category === 'pest' ? 'Aphid Infestation' : 'Common Issue',
            confidence: 85,
            description: 'Based on your observations and photos, this appears to be a common issue for this stage.',
          },
        ],
        immediateActions: [
          'Monitor affected area daily',
          'Consider organic pest control methods',
          'Ensure proper irrigation',
        ],
        safeAlternatives: ['Neem oil spray', 'Manual removal', 'Biological control'],
        whenToCallExpert: 'If severity increases or spreads beyond 25% of field',
        estimatedLoss: formData.severity * 5,
      },
    };

    setAnalyzing(false);
    onSave(record);
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onCancel}
          className="w-10 h-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold">New Scouting Report</h2>
          <p className="text-sm text-muted-foreground">Document and diagnose field issues</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Field & Issue Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Field Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2">Select Field *</label>
              <select
                value={formData.fieldId}
                onChange={(e) => setFormData({ ...formData, fieldId: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary"
              >
                <option value="">Choose a field...</option>
                {fields.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name} ({field.crop || 'No crop'})
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold mb-2">Issue Category *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['pest', 'disease', 'weed', 'nutrient-deficiency', 'water-stress', 'lodging'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat as ScoutingCategory })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.category === cat
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="font-semibold capitalize text-sm">{cat.replace('-', ' ')}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Severity */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Severity: {formData.severity}/5
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Minor</span>
                <span>Moderate</span>
                <span>Critical</span>
              </div>
            </div>

            {/* Affected Area */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Affected Area: {formData.affectedAreaPercent}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={formData.affectedAreaPercent}
                onChange={(e) =>
                  setFormData({ ...formData, affectedAreaPercent: parseInt(e.target.value) })
                }
                className="w-full"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold mb-2">Observations *</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Describe what you're seeing in detail..."
                rows={4}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={analyzing} className="flex-1 gap-2">
            {analyzing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 className="w-4 h-4" />
                </motion.div>
                Analyzing...
              </>
            ) : (
              <>
                <CircleCheck className="w-4 h-4" />
                Submit & Get Diagnosis
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function ScoutingDetail({ record, onClose }: { record: ScoutingRecord; onClose: () => void }) {
  const severityLabels = ['', 'Minor', 'Low', 'Moderate', 'High', 'Critical'];

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold capitalize">{record.category.replace('-', ' ')}</h2>
          <p className="text-sm text-muted-foreground">
            Scouted on {new Date(record.scoutedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Quick Info */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Severity</p>
                <p className="text-2xl font-bold text-red-600">
                  {severityLabels[record.severity]}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Affected Area</p>
                <p className="text-2xl font-bold">{record.affectedAreaPercent}%</p>
              </div>
              {record.diagnosis && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Likely Issues</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {record.diagnosis.likelyIssues.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Est. Loss</p>
                    <p className="text-2xl font-bold text-red-600">
                      {record.diagnosis.estimatedLoss}%
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Observations */}
        <Card>
          <CardHeader>
            <CardTitle>Your Observations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{record.notes}</p>
          </CardContent>
        </Card>

        {/* AI Diagnosis */}
        {record.diagnosis && (
          <>
            <Card className="border-orange-200 bg-gradient-to-br from-orange-50/50 to-white dark:from-orange-950/10 dark:to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <CircleAlert className="w-5 h-5" />
                  Likely Issues
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {record.diagnosis.likelyIssues.map((issue, idx) => (
                  <div key={idx} className="p-4 bg-background rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold">{issue.name}</h4>
                      <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950 font-semibold">
                        {issue.confidence}% confidence
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{issue.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-gradient-to-br from-green-50/50 to-white dark:from-green-950/10 dark:to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CircleCheck className="w-5 h-5" />
                  Immediate Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {record.diagnosis.immediateActions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CircleCheck className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {record.diagnosis.safeAlternatives && (
              <Card>
                <CardHeader>
                  <CardTitle>Safe Alternatives</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {record.diagnosis.safeAlternatives.map((alt, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Leaf className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                        <span>{alt}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50/50 to-white dark:from-yellow-950/10 dark:to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-500">
                  <AlertTriangle className="w-5 h-5" />
                  When to Call an Expert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{record.diagnosis.whenToCallExpert}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}