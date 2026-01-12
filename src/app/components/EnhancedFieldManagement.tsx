import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
  History,
  Target,
  Leaf,
  Bug,
  Droplets,
  Activity,
  ArrowLeft,
  Plus,
  Edit,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';
import {
  EnhancedField,
  CropHistoryEntry,
  FieldHealthMetrics,
} from '../types/farm-management';

interface EnhancedFieldManagementProps {
  field: EnhancedField;
  onClose: () => void;
  onUpdate: (field: Partial<EnhancedField>) => void;
}

export function EnhancedFieldManagement({
  field,
  onClose,
  onUpdate,
}: EnhancedFieldManagementProps) {
  const [view, setView] = useState<'overview' | 'history' | 'health'>('overview');

  // Calculate field health if not present
  const healthMetrics = field.healthMetrics || calculateFieldHealth(field);

  return (
    <div className="max-w-6xl mx-auto pb-24 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#812F0F]/10 to-[#963714]/10 backdrop-blur-sm border border-[#812F0F]/20 hover:bg-[#812F0F]/20 flex items-center justify-center transition-all hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 text-[#812F0F]" />
          </button>
          <div>
            <h2 className="text-2xl font-bold font-[Megrim]">{field.name}</h2>
            <p className="text-sm text-muted-foreground">
              {field.size} {field.sizeUnit} • {field.soilType} • {field.irrigationType}
            </p>
          </div>
        </div>
        <div className="ml-[58px]">
          <Button variant="outline" className="gap-2">
            <Edit className="w-4 h-4" />
            Edit Field
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-muted/30 rounded-xl w-fit">
        <button
          onClick={() => setView('overview')}
          className={`px-6 py-2 rounded-lg transition-all font-semibold ${
            view === 'overview'
              ? 'bg-background shadow-md text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setView('health')}
          className={`px-6 py-2 rounded-lg transition-all font-semibold ${
            view === 'health'
              ? 'bg-background shadow-md text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Health Score
        </button>
        <button
          onClick={() => setView('history')}
          className={`px-6 py-2 rounded-lg transition-all font-semibold ${
            view === 'history'
              ? 'bg-background shadow-md text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Crop History
        </button>
      </div>

      {/* Content */}
      {view === 'overview' && <FieldOverview field={field} health={healthMetrics} />}
      {view === 'health' && <FieldHealthView field={field} health={healthMetrics} />}
      {view === 'history' && <CropHistoryView field={field} onUpdate={onUpdate} />}
    </div>
  );
}

function FieldOverview({
  field,
  health,
}: {
  field: EnhancedField;
  health: FieldHealthMetrics;
}) {
  return (
    <div className="space-y-6">
      {/* Field Health Summary */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Field Health Overview</span>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold text-primary">{health.overallScore}</span>
              <div className="text-sm">
                <div className="text-muted-foreground">Overall</div>
                <div className="flex items-center gap-1 text-xs">
                  {health.trend === 'improving' && (
                    <>
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <span className="text-green-600">Improving</span>
                    </>
                  )}
                  {health.trend === 'stable' && (
                    <>
                      <Minus className="w-3 h-3 text-blue-600" />
                      <span className="text-blue-600">Stable</span>
                    </>
                  )}
                  {health.trend === 'declining' && (
                    <>
                      <TrendingDown className="w-3 h-3 text-red-600" />
                      <span className="text-red-600">Declining</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <HealthMetric
              label="Soil Health"
              value={health.soilHealth}
              icon={Leaf}
              color="green"
            />
            <HealthMetric
              label="Crop Performance"
              value={health.cropPerformance}
              icon={Activity}
              color="blue"
            />
            <HealthMetric
              label="Pest Pressure"
              value={100 - health.pestPressure}
              icon={Bug}
              color="orange"
            />
            <HealthMetric
              label="Water Management"
              value={health.waterManagement}
              icon={Droplets}
              color="cyan"
            />
          </div>
        </CardContent>
      </Card>

      {/* Current Crop Status */}
      {field.currentCrop && (
        <Card>
          <CardHeader>
            <CardTitle>Current Crop: {field.currentCrop}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-950 text-sm font-semibold">
                  Growing
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Expected Performance</span>
                <span className="font-semibold">Good</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Crop History Summary */}
      {field.cropHistory && field.cropHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Recent Crops
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {field.cropHistory.slice(0, 3).map((crop) => (
                <div
                  key={crop.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div>
                    <p className="font-semibold">{crop.cropType}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(crop.sowingDate).toLocaleDateString()} -{' '}
                      {crop.harvestDate
                        ? new Date(crop.harvestDate).toLocaleDateString()
                        : 'Growing'}
                    </p>
                  </div>
                  {crop.yield && (
                    <div className="text-right">
                      <p className="font-bold text-green-600">{crop.yield} kg/ha</p>
                      {crop.quality && (
                        <p className="text-xs text-muted-foreground">Grade {crop.quality}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function HealthMetric({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: any;
  color: string;
}) {
  const colorClasses = {
    green: 'text-green-600 bg-green-100 dark:bg-green-950',
    blue: 'text-blue-600 bg-blue-100 dark:bg-blue-950',
    orange: 'text-orange-600 bg-orange-100 dark:bg-orange-950',
    cyan: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-950',
  };

  const progressColors = {
    green: 'bg-green-600',
    blue: 'bg-blue-600',
    orange: 'bg-orange-600',
    cyan: 'bg-cyan-600',
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-8 h-8 rounded-lg ${
            colorClasses[color as keyof typeof colorClasses]
          } flex items-center justify-center`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="font-bold">{value}/100</p>
        </div>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${progressColors[color as keyof typeof progressColors]} transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function FieldHealthView({
  field,
  health,
}: {
  field: EnhancedField;
  health: FieldHealthMetrics;
}) {
  const getHealthStatus = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-green-600' };
    if (score >= 60) return { label: 'Good', color: 'text-blue-600' };
    if (score >= 40) return { label: 'Fair', color: 'text-yellow-600' };
    return { label: 'Poor', color: 'text-red-600' };
  };

  const overallStatus = getHealthStatus(health.overallScore);

  return (
    <div className="space-y-6">
      {/* Overall Health Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-8 text-center">
          <div className="mb-4">
            <div className="text-7xl font-bold text-primary mb-2">
              {health.overallScore}
            </div>
            <div className={`text-2xl font-bold ${overallStatus.color}`}>
              {overallStatus.label}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              Last updated: {new Date(health.lastUpdated).toLocaleDateString()}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            {health.trend === 'improving' && (
              <>
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-green-600 font-semibold">Improving Trend</span>
              </>
            )}
            {health.trend === 'stable' && (
              <>
                <Minus className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600 font-semibold">Stable</span>
              </>
            )}
            {health.trend === 'declining' && (
              <>
                <TrendingDown className="w-5 h-5 text-red-600" />
                <span className="text-red-600 font-semibold">Needs Attention</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Leaf className="w-5 h-5" />
              Soil Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="text-3xl font-bold mb-2">{health.soilHealth}/100</div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600 transition-all"
                  style={{ width: `${health.soilHealth}%` }}
                />
              </div>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Organic matter content adequate</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>pH levels balanced</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Nutrient levels sufficient</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Activity className="w-5 h-5" />
              Crop Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="text-3xl font-bold mb-2">{health.cropPerformance}/100</div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{ width: `${health.cropPerformance}%` }}
                />
              </div>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Historical yields above average</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Crop rotation practiced</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Variety selection optimal</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <Bug className="w-5 h-5" />
              Pest Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="text-3xl font-bold mb-2">
                {100 - health.pestPressure}/100
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-600 transition-all"
                  style={{ width: `${100 - health.pestPressure}%` }}
                />
              </div>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Low pest incidence this season</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Regular scouting conducted</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>IPM practices followed</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-600">
              <Droplets className="w-5 h-5" />
              Water Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="text-3xl font-bold mb-2">{health.waterManagement}/100</div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-600 transition-all"
                  style={{ width: `${health.waterManagement}%` }}
                />
              </div>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Efficient irrigation system</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Water conservation practiced</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Good drainage system</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50/50 to-white dark:from-amber-950/10 dark:to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-500">
            <Target className="w-5 h-5" />
            Improvement Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {health.soilHealth < 70 && (
              <li className="flex items-start gap-3 p-3 rounded-lg bg-background">
                <Leaf className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Improve Soil Health</p>
                  <p className="text-sm text-muted-foreground">
                    Consider adding organic matter and conducting soil test for detailed
                    nutrient analysis
                  </p>
                </div>
              </li>
            )}
            {health.pestPressure > 30 && (
              <li className="flex items-start gap-3 p-3 rounded-lg bg-background">
                <Bug className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Monitor Pest Pressure</p>
                  <p className="text-sm text-muted-foreground">
                    Increase scouting frequency and consider preventive measures
                  </p>
                </div>
              </li>
            )}
            {health.waterManagement < 70 && (
              <li className="flex items-start gap-3 p-3 rounded-lg bg-background">
                <Droplets className="w-5 h-5 text-cyan-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Optimize Water Usage</p>
                  <p className="text-sm text-muted-foreground">
                    Consider upgrading to drip or sprinkler irrigation for better efficiency
                  </p>
                </div>
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function CropHistoryView({
  field,
  onUpdate,
}: {
  field: EnhancedField;
  onUpdate: (field: Partial<EnhancedField>) => void;
}) {
  const cropHistory = field.cropHistory || [];

  // Calculate statistics
  const avgYield =
    cropHistory.length > 0
      ? cropHistory.reduce((acc, c) => acc + (c.yield || 0), 0) / cropHistory.length
      : 0;

  const avgProfitability =
    cropHistory.length > 0
      ? cropHistory.reduce((acc, c) => acc + (c.profitability || 0), 0) / cropHistory.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Crops Grown</p>
              <p className="text-3xl font-bold text-primary">{cropHistory.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg Yield (kg/ha)</p>
              <p className="text-3xl font-bold text-green-600">
                {avgYield > 0 ? avgYield.toFixed(0) : '—'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg Profitability (₹/ha)</p>
              <p className="text-3xl font-bold text-blue-600">
                {avgProfitability > 0 ? `₹${avgProfitability.toFixed(0)}` : '—'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crop History Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Crop Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cropHistory.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4" />
              <h3 className="font-bold text-lg mb-2">No Crop History</h3>
              <p className="text-muted-foreground">
                Crop history will be automatically recorded as you harvest
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cropHistory
                .sort(
                  (a, b) =>
                    new Date(b.sowingDate).getTime() - new Date(a.sowingDate).getTime()
                )
                .map((crop, idx) => (
                  <motion.div
                    key={crop.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative pl-8 pb-4 border-l-2 border-primary/30 last:border-l-0 last:pb-0"
                  >
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                    <div className="bg-muted/30 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{crop.cropType}</h3>
                          {crop.variety && (
                            <p className="text-sm text-muted-foreground">{crop.variety}</p>
                          )}
                        </div>
                        {crop.quality && (
                          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-950 text-xs font-bold">
                            Grade {crop.quality}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Sowing</p>
                          <p className="text-sm font-semibold">
                            {new Date(crop.sowingDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Harvest</p>
                          <p className="text-sm font-semibold">
                            {crop.harvestDate
                              ? new Date(crop.harvestDate).toLocaleDateString()
                              : 'Growing'}
                          </p>
                        </div>
                        {crop.yield && (
                          <div>
                            <p className="text-xs text-muted-foreground">Yield</p>
                            <p className="text-sm font-semibold text-green-600">
                              {crop.yield} kg/ha
                            </p>
                          </div>
                        )}
                        {crop.profitability && (
                          <div>
                            <p className="text-xs text-muted-foreground">Profit</p>
                            <p className="text-sm font-semibold text-blue-600">
                              ₹{crop.profitability.toLocaleString()}/ha
                            </p>
                          </div>
                        )}
                      </div>
                      {crop.notes && (
                        <p className="text-sm text-muted-foreground italic">{crop.notes}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to calculate field health
function calculateFieldHealth(field: EnhancedField): FieldHealthMetrics {
  // Simple calculation based on available data
  const cropHistory = field.cropHistory || [];
  
  // Base scores
  let soilHealth = 70;
  let cropPerformance = 70;
  let pestPressure = 20;
  let waterManagement = 70;

  // Adjust based on irrigation type
  if (field.irrigationType === 'Drip') waterManagement += 20;
  else if (field.irrigationType === 'Sprinkler') waterManagement += 15;
  else if (field.irrigationType === 'Rainfed') waterManagement -= 10;

  // Adjust based on crop history
  if (cropHistory.length > 0) {
    const recentCrops = cropHistory.slice(0, 3);
    const avgQuality =
      recentCrops.filter((c) => c.quality === 'A').length / recentCrops.length;
    cropPerformance = Math.min(100, cropPerformance + avgQuality * 20);
  }

  const overallScore = Math.round(
    (soilHealth + cropPerformance + (100 - pestPressure) + waterManagement) / 4
  );

  return {
    overallScore,
    soilHealth,
    cropPerformance,
    pestPressure,
    waterManagement,
    lastUpdated: new Date().toISOString(),
    trend: overallScore >= 75 ? 'improving' : overallScore >= 60 ? 'stable' : 'declining',
  };
}