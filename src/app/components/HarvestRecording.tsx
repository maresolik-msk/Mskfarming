import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Wheat,
  TrendingUp,
  DollarSign,
  Package,
  MapPin,
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
  X,
  ArrowLeft,
  Plus,
  Calendar,
  Target,
  Percent,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { HarvestRecord } from '../types/farm-management';

interface HarvestRecordingProps {
  fields: any[];
  onClose?: () => void;
}

export function HarvestRecording({ fields, onClose }: HarvestRecordingProps) {
  const [view, setView] = useState<'list' | 'new' | 'detail'>('list');
  const [records, setRecords] = useState<HarvestRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<HarvestRecord | null>(null);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = () => {
    const stored = localStorage.getItem('mila_harvest_records');
    if (stored) {
      setRecords(JSON.parse(stored));
    }
  };

  const saveRecords = (newRecords: HarvestRecord[]) => {
    localStorage.setItem('mila_harvest_records', JSON.stringify(newRecords));
    setRecords(newRecords);
  };

  const totalYield = records.reduce((acc, r) => acc + r.totalYield, 0);
  const totalRevenue = records.reduce((acc, r) => acc + r.totalRevenue, 0);
  const totalProfit = records.reduce((acc, r) => acc + r.netProfit, 0);
  const avgYield =
    records.length > 0
      ? records.reduce((acc, r) => acc + r.yieldPerHectare, 0) / records.length
      : 0;

  if (view === 'new') {
    return (
      <NewHarvestForm
        fields={fields}
        onSave={(record) => {
          const updated = [...records, record];
          saveRecords(updated);
          toast.success('Harvest record saved successfully');
          setView('list');
        }}
        onCancel={() => setView('list')}
      />
    );
  }

  if (view === 'detail' && selectedRecord) {
    return (
      <HarvestDetail
        record={selectedRecord}
        fields={fields}
        onClose={() => setView('list')}
      />
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24 overflow-x-hidden">
      {/* Premium Header with Glassmorphism */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#812F0F]/10 via-amber-500/5 to-orange-400/10 rounded-3xl blur-2xl -z-10" />
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {onClose && (
              <motion.button
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#812F0F]/10 to-[#963714]/10 backdrop-blur-sm border border-[#812F0F]/20 hover:bg-[#812F0F]/20 flex items-center justify-center transition-all shadow-sm hover:shadow-[#812F0F]/20"
              >
                <ArrowLeft className="w-5 h-5 text-[#812F0F]" />
              </motion.button>
            )}
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white shadow-xl">
              <Wheat className="w-6 h-6" />
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl blur-lg opacity-50 -z-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-[Megrim] bg-gradient-to-r from-[#812F0F] via-amber-600 to-orange-500 bg-clip-text text-transparent">
                Harvest & Output Recording
              </h2>
              <p className="text-sm text-muted-foreground">
                Financial Analysis & Yield Tracking
              </p>
            </div>
          </div>
          
          <p className="text-muted-foreground text-sm ml-[68px]">
            Track yields, sales, and profitability with comprehensive financial analysis
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="ml-[68px]"
          >
            <Button
              onClick={() => setView('new')}
              className="bg-gradient-to-r from-[#812F0F] to-[#963714] hover:from-[#963714] hover:to-[#812F0F] text-white gap-3 shadow-lg shadow-[#812F0F]/30 px-8 py-6 rounded-xl transition-all hover:scale-105 text-base font-semibold"
            >
              <Plus className="w-5 h-5" />
              Record New Harvest
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Premium Summary Stats with Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-orange-400/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/80 to-white/60 dark:from-white/5 dark:to-white/[0.02] border border-white/30 dark:border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground/70 mb-1">Total Harvests</p>
                <p className="text-4xl font-bold bg-gradient-to-br from-amber-600 to-yellow-600 bg-clip-text text-transparent">{records.length}</p>
              </div>
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 flex items-center justify-center">
                <Wheat className="w-7 h-7 text-amber-600" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-teal-400/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/80 to-white/60 dark:from-white/5 dark:to-white/[0.02] border border-white/30 dark:border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground/70 mb-1">Total Yield</p>
                <p className="text-3xl font-bold bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {totalYield.toFixed(1)} <span className="text-base font-medium">quintals</span>
                </p>
              </div>
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
                <Package className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-sky-400/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/80 to-white/60 dark:from-white/5 dark:to-white/[0.02] border border-white/30 dark:border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground/70 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  ₹{(totalRevenue / 100000).toFixed(1)}L
                </p>
              </div>
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-green-400/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/80 to-white/60 dark:from-white/5 dark:to-white/[0.02] border border-white/30 dark:border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground/70 mb-1">Net Profit</p>
                <p className="text-3xl font-bold bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  ₹{(totalProfit / 100000).toFixed(1)}L
                </p>
              </div>
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-emerald-600" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Premium Records List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#812F0F]/10 via-amber-500/5 to-orange-400/10 rounded-3xl blur-2xl -z-10" />
        
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/80 to-white/60 dark:from-white/5 dark:to-white/[0.02] border border-white/30 dark:border-white/10 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-white/20 dark:border-white/10">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              Harvest History
            </h3>
          </div>
          
          <div className="p-6">
            {records.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <Wheat className="w-12 h-12 text-muted-foreground/40" />
                </div>
                <h3 className="font-bold text-xl mb-3">No Harvest Records Yet</h3>
                <p className="text-muted-foreground/70 mb-8 max-w-md mx-auto">
                  Start recording your harvests to track performance and profitability
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView('new')}
                  className="group relative px-8 py-4 bg-gradient-to-r from-[#812F0F] via-[#9a3810] to-[#812F0F] text-white rounded-2xl font-bold shadow-xl shadow-[#812F0F]/30 inline-flex items-center gap-2 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <Plus className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Record First Harvest</span>
                </motion.button>
              </div>
            ) : (
              <div className="space-y-4">
                {records
                  .sort(
                    (a, b) =>
                      new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime()
                  )
                  .map((record, idx) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <HarvestRecordCard
                        record={record}
                        fields={fields}
                        onClick={() => {
                          setSelectedRecord(record);
                          setView('detail');
                        }}
                      />
                    </motion.div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function HarvestRecordCard({
  record,
  fields,
  onClick,
}: {
  record: HarvestRecord;
  fields: any[];
  onClick: () => void;
}) {
  const field = fields.find((f) => f.id === record.fieldId);

  const gradeColors = {
    A: 'text-green-600 bg-green-100 dark:bg-green-950',
    B: 'text-blue-600 bg-blue-100 dark:bg-blue-950',
    C: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-950',
    Reject: 'text-red-600 bg-red-100 dark:bg-red-950',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="p-4 rounded-xl border bg-card hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white shrink-0">
          <Wheat className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold">{field?.name || 'Unknown Field'}</h3>
              <p className="text-sm text-muted-foreground">
                Harvested on {new Date(record.harvestDate).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${gradeColors[record.grade]}`}
            >
              Grade {record.grade}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Yield/Hectare</p>
              <p className="text-lg font-bold text-green-600">
                {record.yieldPerHectare.toFixed(1)} q
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Price/Kg</p>
              <p className="text-lg font-bold">₹{record.pricePerKg}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Revenue</p>
              <p className="text-lg font-bold text-blue-600">
                ₹{(record.totalRevenue / 1000).toFixed(1)}k
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Net Profit</p>
              <p
                className={`text-lg font-bold ${
                  record.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                ₹{(record.netProfit / 1000).toFixed(1)}k
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function NewHarvestForm({
  fields,
  onSave,
  onCancel,
}: {
  fields: any[];
  onSave: (record: HarvestRecord) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    fieldId: '',
    harvestDate: new Date().toISOString().split('T')[0],
    totalYield: '',
    moisturePercent: '14',
    grade: 'A' as 'A' | 'B' | 'C' | 'Reject',
    storageMethod: 'farm' as 'warehouse' | 'home' | 'farm' | 'cold-storage',
    bagCount: '',
    pricePerKg: '',
    buyer: '',
    mandi: '',
    transportCost: '',
    otherCosts: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fieldId) {
      toast.error('Please select a field');
      return;
    }
    if (!formData.totalYield) {
      toast.error('Please enter total yield');
      return;
    }

    const field = fields.find((f) => f.id === formData.fieldId);
    const fieldSize = field?.size || 1;
    const totalYield = parseFloat(formData.totalYield);
    const yieldPerHectare = totalYield / (fieldSize * 0.4047); // Convert acres to hectares
    const pricePerKg = parseFloat(formData.pricePerKg || '0');
    const totalRevenue = totalYield * 100 * pricePerKg; // quintals to kg
    const transportCost = parseFloat(formData.transportCost || '0');
    const otherCosts = parseFloat(formData.otherCosts || '0');
    const netProfit = totalRevenue - transportCost - otherCosts;

    const record: HarvestRecord = {
      id: `harvest_${Date.now()}`,
      fieldId: formData.fieldId,
      cropId: field?.crop || 'Unknown',
      harvestDate: formData.harvestDate,
      totalYield,
      yieldPerHectare,
      moisturePercent: parseFloat(formData.moisturePercent),
      grade: formData.grade,
      storageMethod: formData.storageMethod,
      bagCount: formData.bagCount ? parseInt(formData.bagCount) : undefined,
      pricePerKg,
      totalRevenue,
      transportCost,
      otherCosts,
      netProfit,
      buyer: formData.buyer || undefined,
      mandi: formData.mandi || undefined,
      postHarvestAdvisories: [
        'Ensure proper drying to maintain quality',
        'Store in clean, dry conditions',
        'Monitor for pest activity regularly',
        'Check moisture levels weekly',
      ],
    };

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
          <h2 className="text-2xl font-bold">Record Harvest</h2>
          <p className="text-sm text-muted-foreground">
            Document yield, quality, and financial details
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Yield Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wheat className="w-5 h-5" />
              Yield Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                    {field.name} ({field.crop || 'No crop'})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Harvest Date *
                </label>
                <input
                  type="date"
                  value={formData.harvestDate}
                  onChange={(e) =>
                    setFormData({ ...formData, harvestDate: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Total Yield (quintals) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.totalYield}
                  onChange={(e) =>
                    setFormData({ ...formData, totalYield: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Moisture %</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.moisturePercent}
                  onChange={(e) =>
                    setFormData({ ...formData, moisturePercent: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Grade</label>
                <select
                  value={formData.grade}
                  onChange={(e) =>
                    setFormData({ ...formData, grade: e.target.value as any })
                  }
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl"
                >
                  <option value="A">Grade A (Premium)</option>
                  <option value="B">Grade B (Good)</option>
                  <option value="C">Grade C (Fair)</option>
                  <option value="Reject">Reject</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Storage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Storage Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Storage Method</label>
                <select
                  value={formData.storageMethod}
                  onChange={(e) =>
                    setFormData({ ...formData, storageMethod: e.target.value as any })
                  }
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl"
                >
                  <option value="farm">Farm Storage</option>
                  <option value="home">Home Storage</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="cold-storage">Cold Storage</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Bag Count</label>
                <input
                  type="number"
                  value={formData.bagCount}
                  onChange={(e) =>
                    setFormData({ ...formData, bagCount: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sale Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Sale & Financial Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Price per Kg (₹)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.pricePerKg}
                  onChange={(e) =>
                    setFormData({ ...formData, pricePerKg: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Buyer</label>
                <input
                  type="text"
                  value={formData.buyer}
                  onChange={(e) => setFormData({ ...formData, buyer: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Mandi/Market</label>
              <input
                type="text"
                value={formData.mandi}
                onChange={(e) => setFormData({ ...formData, mandi: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Transport Cost (₹)
                </label>
                <input
                  type="number"
                  value={formData.transportCost}
                  onChange={(e) =>
                    setFormData({ ...formData, transportCost: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Other Costs (₹)</label>
                <input
                  type="number"
                  value={formData.otherCosts}
                  onChange={(e) =>
                    setFormData({ ...formData, otherCosts: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1 gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Save Harvest Record
          </Button>
        </div>
      </form>
    </div>
  );
}

function HarvestDetail({
  record,
  fields,
  onClose,
}: {
  record: HarvestRecord;
  fields: any[];
  onClose: () => void;
}) {
  const field = fields.find((f) => f.id === record.fieldId);
  const roi = ((record.netProfit / (record.totalRevenue - record.netProfit)) * 100).toFixed(1);

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
          <h2 className="text-2xl font-bold">{field?.name || 'Unknown Field'}</h2>
          <p className="text-sm text-muted-foreground">
            Harvested on {new Date(record.harvestDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Performance Summary */}
        <Card className="border-2 border-primary/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Yield/Hectare</p>
                <p className="text-3xl font-bold text-green-600">
                  {record.yieldPerHectare.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground">quintals</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Revenue</p>
                <p className="text-3xl font-bold text-blue-600">
                  ₹{(record.totalRevenue / 100000).toFixed(1)}L
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Net Profit</p>
                <p
                  className={`text-3xl font-bold ${
                    record.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  ₹{(record.netProfit / 100000).toFixed(1)}L
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">ROI</p>
                <p className="text-3xl font-bold text-purple-600">{roi}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Post-Harvest Advisories */}
        {record.postHarvestAdvisories && record.postHarvestAdvisories.length > 0 && (
          <Card className="border-amber-200 bg-gradient-to-br from-amber-50/50 to-white dark:from-amber-950/10 dark:to-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-500">
                <AlertCircle className="w-5 h-5" />
                Post-Harvest Advisories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {record.postHarvestAdvisories.map((advisory, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <span>{advisory}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}