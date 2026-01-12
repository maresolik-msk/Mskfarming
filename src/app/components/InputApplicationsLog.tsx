import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ClipboardList,
  Plus,
  Droplets,
  Sprout,
  Bug,
  Users,
  Tractor,
  Calendar,
  DollarSign,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  X,
  ArrowLeft,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';
import {
  InputApplicationLog,
  InputApplication,
  FertilizerApplication,
  PesticideApplication,
  IrrigationEvent,
  LaborMachineryEvent,
} from '../types/farm-management';

interface InputApplicationsLogProps {
  fields: any[];
  onClose?: () => void;
}

export function InputApplicationsLog({ fields, onClose }: InputApplicationsLogProps) {
  const [view, setView] = useState<'list' | 'new'>('list');
  const [logs, setLogs] = useState<InputApplicationLog[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedField, setSelectedField] = useState<string>('all');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    const stored = localStorage.getItem('mila_input_logs');
    if (stored) {
      setLogs(JSON.parse(stored));
    }
  };

  const saveLogs = (newLogs: InputApplicationLog[]) => {
    localStorage.setItem('mila_input_logs', JSON.stringify(newLogs));
    setLogs(newLogs);
  };

  const filteredLogs = logs.filter((log) => {
    if (selectedField !== 'all' && log.fieldId !== selectedField) return false;
    if (filterType !== 'all' && log.application.type !== filterType) return false;
    return true;
  });

  // Calculate summary stats
  const totalCost = filteredLogs.reduce((acc, log) => {
    const cost =
      'cost' in log.application ? (log.application as any).cost : 0;
    return acc + cost;
  }, 0);

  const typeCount = (type: string) =>
    logs.filter((l) => l.application.type === type).length;

  if (view === 'new') {
    return (
      <NewApplicationForm
        fields={fields}
        onSave={(log) => {
          const updated = [...logs, log];
          saveLogs(updated);
          toast.success('Application logged successfully');
          setView('list');
        }}
        onCancel={() => setView('list')}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#812F0F]/10 to-[#963714]/10 backdrop-blur-sm border border-[#812F0F]/20 hover:bg-[#812F0F]/20 flex items-center justify-center transition-all hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 text-[#812F0F]" />
            </button>
          )}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <ClipboardList className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-[Megrim]">
              Input Applications Log
            </h2>
            <p className="text-sm text-muted-foreground">
              Compliance Tracking System
            </p>
          </div>
        </div>
        <p className="text-muted-foreground text-sm ml-[58px]">
          Track all inputs, operations, and compliance records with detailed documentation
        </p>
        <div className="ml-[58px]">
          <Button 
            onClick={() => setView('new')} 
            className="bg-gradient-to-r from-[#812F0F] to-[#963714] hover:from-[#963714] hover:to-[#812F0F] text-white gap-3 shadow-lg shadow-[#812F0F]/30 px-8 py-6 rounded-xl transition-all hover:scale-105 text-base font-semibold"
          >
            <Plus className="w-5 h-5" />
            Log New Application
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Logs</p>
                <p className="text-3xl font-bold text-blue-600">{logs.length}</p>
              </div>
              <ClipboardList className="w-8 h-8 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fertilizers</p>
                <p className="text-3xl font-bold text-green-600">
                  {typeCount('fertilizer')}
                </p>
              </div>
              <Sprout className="w-8 h-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-background">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pesticides</p>
                <p className="text-3xl font-bold text-orange-600">
                  {typeCount('pesticide') +
                    typeCount('fungicide') +
                    typeCount('herbicide') +
                    typeCount('insecticide')}
                </p>
              </div>
              <Bug className="w-8 h-8 text-orange-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-cyan-200 bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-950/20 dark:to-background">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Irrigation</p>
                <p className="text-3xl font-bold text-cyan-600">
                  {typeCount('irrigation')}
                </p>
              </div>
              <Droplets className="w-8 h-8 text-cyan-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-2xl font-bold text-purple-600">₹{totalCost.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold mb-2">Filter by Field</label>
              <select
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-xl"
              >
                <option value="all">All Fields</option>
                {fields.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold mb-2">Filter by Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-xl"
              >
                <option value="all">All Types</option>
                <option value="fertilizer">Fertilizer</option>
                <option value="pesticide">Pesticide</option>
                <option value="fungicide">Fungicide</option>
                <option value="herbicide">Herbicide</option>
                <option value="insecticide">Insecticide</option>
                <option value="irrigation">Irrigation</option>
                <option value="labor">Labor</option>
                <option value="machinery">Machinery</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      <Card>
        <CardHeader>
          <CardTitle>Application Records</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4" />
              <h3 className="font-bold text-lg mb-2">No Records Found</h3>
              <p className="text-muted-foreground mb-6">
                {logs.length === 0
                  ? 'Start logging your farm operations for better tracking and compliance'
                  : 'Try adjusting your filters'}
              </p>
              {logs.length === 0 && (
                <Button onClick={() => setView('new')} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Log First Application
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLogs
                .sort(
                  (a, b) =>
                    new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
                )
                .map((log) => (
                  <ApplicationLogCard key={log.id} log={log} fields={fields} />
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ApplicationLogCard({ log, fields }: { log: InputApplicationLog; fields: any[] }) {
  const field = fields.find((f) => f.id === log.fieldId);

  const typeIcons = {
    fertilizer: Sprout,
    pesticide: Bug,
    fungicide: Bug,
    herbicide: Bug,
    insecticide: Bug,
    irrigation: Droplets,
    labor: Users,
    machinery: Tractor,
  };

  const typeColors = {
    fertilizer: 'from-green-500 to-emerald-600',
    pesticide: 'from-orange-500 to-red-600',
    fungicide: 'from-orange-500 to-red-600',
    herbicide: 'from-yellow-500 to-orange-600',
    insecticide: 'from-red-500 to-pink-600',
    irrigation: 'from-blue-500 to-cyan-600',
    labor: 'from-purple-500 to-pink-600',
    machinery: 'from-gray-500 to-slate-600',
  };

  const Icon = typeIcons[log.application.type as keyof typeof typeIcons] || ClipboardList;
  const colorClass =
    typeColors[log.application.type as keyof typeof typeColors] ||
    'from-gray-500 to-slate-600';

  const complianceColors = {
    compliant: 'text-green-600 bg-green-100 dark:bg-green-950',
    warning: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-950',
    violation: 'text-red-600 bg-red-100 dark:bg-red-950',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl border bg-card hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white shrink-0`}
        >
          <Icon className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold capitalize">{log.application.type.replace('-', ' ')}</h3>
              <p className="text-sm text-muted-foreground">
                {field?.name || 'Unknown Field'}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                complianceColors[log.complianceStatus]
              }`}
            >
              {log.complianceStatus}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
            {/* Product/Activity Name */}
            {'productName' in log.application && (
              <div>
                <p className="text-xs text-muted-foreground">Product</p>
                <p className="text-sm font-semibold">{log.application.productName}</p>
              </div>
            )}
            {'activity' in log.application && (
              <div>
                <p className="text-xs text-muted-foreground">Activity</p>
                <p className="text-sm font-semibold">{log.application.activity}</p>
              </div>
            )}

            {/* Dose/Duration */}
            {'dose' in log.application && (
              <div>
                <p className="text-xs text-muted-foreground">Dose</p>
                <p className="text-sm font-semibold">{log.application.dose} kg/ha</p>
              </div>
            )}
            {'duration' in log.application && (
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-semibold">{log.application.duration} hours</p>
              </div>
            )}

            {/* Cost */}
            {'cost' in log.application && (
              <div>
                <p className="text-xs text-muted-foreground">Cost</p>
                <p className="text-sm font-semibold">₹{log.application.cost}</p>
              </div>
            )}

            {/* Date */}
            <div>
              <p className="text-xs text-muted-foreground">Applied On</p>
              <p className="text-sm font-semibold">
                {new Date(log.appliedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {log.notes && (
            <p className="text-sm text-muted-foreground italic">{log.notes}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function NewApplicationForm({
  fields,
  onSave,
  onCancel,
}: {
  fields: any[];
  onSave: (log: InputApplicationLog) => void;
  onCancel: () => void;
}) {
  const [applicationType, setApplicationType] = useState<string>('');
  const [formData, setFormData] = useState<any>({
    fieldId: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fieldId) {
      toast.error('Please select a field');
      return;
    }

    let application: InputApplication;

    switch (applicationType) {
      case 'fertilizer':
        application = {
          type: 'fertilizer',
          productName: formData.productName,
          nutrientContent: {
            nitrogen: parseFloat(formData.nitrogen || 0),
            phosphorus: parseFloat(formData.phosphorus || 0),
            potassium: parseFloat(formData.potassium || 0),
          },
          dose: parseFloat(formData.dose),
          method: formData.method,
          cost: parseFloat(formData.cost),
        };
        break;

      case 'pesticide':
        application = {
          type: 'pesticide',
          productName: formData.productName,
          activeIngredient: formData.activeIngredient,
          concentration: formData.concentration,
          dilution: formData.dilution,
          coverage: parseFloat(formData.coverage),
          reEntryPeriod: parseFloat(formData.reEntryPeriod || 24),
          preHarvestInterval: parseFloat(formData.preHarvestInterval || 7),
          cost: parseFloat(formData.cost),
        };
        break;

      case 'irrigation':
        application = {
          type: 'irrigation',
          method: formData.method,
          duration: parseFloat(formData.duration),
          waterVolume: parseFloat(formData.waterVolume || 0),
          energyCost: parseFloat(formData.cost),
        };
        break;

      case 'labor':
      case 'machinery':
        application = {
          type: applicationType,
          activity: formData.activity,
          workers: applicationType === 'labor' ? parseInt(formData.workers) : undefined,
          hours: parseFloat(formData.hours),
          machineryUsed: applicationType === 'machinery' ? formData.machineryUsed : undefined,
          fuelConsumed: applicationType === 'machinery' ? parseFloat(formData.fuelConsumed || 0) : undefined,
          cost: parseFloat(formData.cost),
        };
        break;

      default:
        toast.error('Invalid application type');
        return;
    }

    const log: InputApplicationLog = {
      id: `log_${Date.now()}`,
      fieldId: formData.fieldId,
      application,
      appliedAt: new Date().toISOString(),
      notes: formData.notes,
      complianceStatus: 'compliant',
    };

    onSave(log);
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
          <h2 className="text-2xl font-bold">Log New Application</h2>
          <p className="text-sm text-muted-foreground">Record farm operations and inputs</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Field Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2">Select Field *</label>
              <select
                value={formData.fieldId}
                onChange={(e) => setFormData({ ...formData, fieldId: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl"
              >
                <option value="">Choose a field...</option>
                {fields.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Application Type */}
            <div>
              <label className="block text-sm font-semibold mb-2">Application Type *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { type: 'fertilizer', label: 'Fertilizer', icon: Sprout },
                  { type: 'pesticide', label: 'Pesticide', icon: Bug },
                  { type: 'irrigation', label: 'Irrigation', icon: Droplets },
                  { type: 'labor', label: 'Labor', icon: Users },
                  { type: 'machinery', label: 'Machinery', icon: Tractor },
                ].map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setApplicationType(item.type)}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      applicationType === item.type
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <item.icon className="w-6 h-6" />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Form Fields Based on Type */}
            {applicationType === 'fertilizer' && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-2">Product Name *</label>
                  <input
                    type="text"
                    value={formData.productName || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, productName: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">N %</label>
                    <input
                      type="number"
                      value={formData.nitrogen || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, nitrogen: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">P %</label>
                    <input
                      type="number"
                      value={formData.phosphorus || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, phosphorus: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">K %</label>
                    <input
                      type="number"
                      value={formData.potassium || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, potassium: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Dose (kg/ha) *</label>
                    <input
                      type="number"
                      value={formData.dose || ''}
                      onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Method</label>
                    <select
                      value={formData.method || ''}
                      onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl"
                    >
                      <option value="broadcast">Broadcast</option>
                      <option value="spot">Spot Application</option>
                      <option value="fertigation">Fertigation</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {applicationType === 'irrigation' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Method</label>
                  <input
                    type="text"
                    value={formData.method || ''}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                    placeholder="e.g., Drip, Sprinkler"
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Duration (hours) *</label>
                  <input
                    type="number"
                    value={formData.duration || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* Cost - Common for all types */}
            {applicationType && (
              <div>
                <label className="block text-sm font-semibold mb-2">Cost (₹) *</label>
                <input
                  type="number"
                  value={formData.cost || ''}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl"
                />
              </div>
            )}

            {/* Notes */}
            {applicationType && (
              <div>
                <label className="block text-sm font-semibold mb-2">Notes</label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl resize-none"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1 gap-2" disabled={!applicationType}>
            <CheckCircle2 className="w-4 h-4" />
            Save Application Log
          </Button>
        </div>
      </form>
    </div>
  );
}