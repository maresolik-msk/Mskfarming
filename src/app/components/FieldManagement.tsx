import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  MapPin,
  Droplet,
  Sprout,
  ArrowLeft,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

interface Field {
  id: string;
  name: string;
  size: number;
  sizeUnit: 'acres' | 'hectares';
  crop: string;
  soilType: string;
  irrigationType: string;
  plantingDate?: string;
  expectedHarvestDate?: string;
  day?: number;
  totalDays?: number;
  progress?: number;
  location?: string;
  isActive?: boolean;
}

interface FieldManagementProps {
  fields: Field[];
  activeFieldId: string;
  onClose: () => void;
  onAddField: (field: Omit<Field, 'id'>) => void;
  onEditField: (id: string, field: Partial<Field>) => void;
  onDeleteField: (id: string) => void;
  onSetActiveField: (id: string) => void;
}

export function FieldManagement({
  fields = [],
  activeFieldId,
  onClose,
  onAddField,
  onEditField,
  onDeleteField,
  onSetActiveField,
}: FieldManagementProps) {
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleAddNew = () => {
    setEditingField(null);
    setShowAddEdit(true);
  };

  const handleEdit = (field: Field) => {
    setEditingField(field);
    setShowAddEdit(true);
  };

  const handleDelete = (id: string) => {
    if (fields.length === 1) {
      toast.error('Cannot delete the last field');
      return;
    }
    if (id === activeFieldId) {
      toast.error('Cannot delete the active field. Switch to another field first.');
      return;
    }
    setShowDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      onDeleteField(showDeleteConfirm);
      setShowDeleteConfirm(null);
      toast.success('Field deleted successfully');
    }
  };

  if (showAddEdit) {
    return (
      <AddEditFieldForm
        field={editingField}
        onSave={(field) => {
          if (editingField) {
            onEditField(editingField.id, field);
            toast.success('Field updated successfully');
          } else {
            onAddField(field);
            toast.success('Field added successfully');
          }
          setShowAddEdit(false);
        }}
        onCancel={() => setShowAddEdit(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Manage Fields</h1>
                <p className="text-sm text-muted-foreground">Add, edit, or remove your farm fields</p>
              </div>
            </div>
            <button
              onClick={handleAddNew}
              className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all flex items-center gap-2 font-semibold shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4" />
              Add Field
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-6 text-5xl">
              🌾
            </div>
            <h3 className="font-bold text-xl mb-2">No fields yet</h3>
            <p className="text-sm mb-6">Add your first field to get started</p>
            <button
              onClick={handleAddNew}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all flex items-center gap-2 font-semibold shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Your First Field
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative bg-card/40 backdrop-blur-xl border rounded-2xl p-5 transition-all hover:shadow-lg ${
                  field.id === activeFieldId
                    ? 'border-primary shadow-lg shadow-primary/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Active Badge */}
                {field.id === activeFieldId && (
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-3xl shadow-lg shrink-0">
                    🌾
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-foreground mb-2">{field.name}</h3>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <Sprout className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Crop</div>
                          <div className="font-semibold">{field.crop || 'Not planted'}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Droplet className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Size</div>
                          <div className="font-semibold">{field.size} {field.sizeUnit}</div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <div className="px-2 py-1 rounded-lg bg-muted/50 text-xs font-medium">
                        {field.soilType}
                      </div>
                      <div className="px-2 py-1 rounded-lg bg-muted/50 text-xs font-medium">
                        {field.irrigationType}
                      </div>
                      {field.location && (
                        <div className="px-2 py-1 rounded-lg bg-muted/50 text-xs font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {field.location}
                        </div>
                      )}
                    </div>

                    {/* Progress Bar (if crop is planted) */}
                    {field.progress !== undefined && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Day {field.day} of {field.totalDays}</span>
                          <span>{field.progress}%</span>
                        </div>
                        <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-emerald-600 rounded-full transition-all"
                            style={{ width: `${field.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {field.id !== activeFieldId && (
                        <button
                          onClick={() => {
                            onSetActiveField(field.id);
                            toast.success(`Switched to ${field.name}`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-semibold"
                        >
                          Set as Active
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(field)}
                        className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(field.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowDeleteConfirm(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl z-50"
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Delete Field?</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  This action cannot be undone. All data associated with this field will be permanently deleted.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

interface AddEditFieldFormProps {
  field: Field | null;
  onSave: (field: Omit<Field, 'id'>) => void;
  onCancel: () => void;
}

export function AddEditFieldForm({ field, onSave, onCancel }: AddEditFieldFormProps) {
  const [formData, setFormData] = useState({
    name: field?.name || '',
    size: field?.size ? field.size.toString() : '1',
    sizeUnit: field?.sizeUnit || 'acres',
    crop: field?.crop || '',
    soilType: field?.soilType || '',
    irrigationType: field?.irrigationType || '',
    location: field?.location || '',
    plantingDate: field?.plantingDate || '',
    expectedHarvestDate: field?.expectedHarvestDate || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter a field name');
      return;
    }
    if (!formData.soilType) {
      toast.error('Please select soil type');
      return;
    }
    if (!formData.irrigationType) {
      toast.error('Please select irrigation type');
      return;
    }

    onSave({
      ...formData,
      size: parseFloat(formData.size) || 0,
    } as any);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onCancel}
                className="w-10 h-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold">{field ? 'Edit Field' : 'Add New Field'}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 py-6 pb-24">
        <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-6">
          {/* Field Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">Field Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., North Field, Plot 5A"
              className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Size *</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Unit</label>
              <select
                value={formData.sizeUnit}
                onChange={(e) => setFormData({ ...formData, sizeUnit: e.target.value as 'acres' | 'hectares' })}
                className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="acres">Acres</option>
                <option value="hectares">Hectares</option>
              </select>
            </div>
          </div>

          {/* Soil Type */}
          <div>
            <label className="block text-sm font-semibold mb-2">Soil Type *</label>
            <select
              value={formData.soilType}
              onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
              className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            >
              <option value="">Select soil type</option>
              <option value="Alluvial Soil">Alluvial Soil</option>
              <option value="Black Soil (Regur)">Black Soil (Regur)</option>
              <option value="Red Soil">Red Soil</option>
              <option value="Laterite Soil">Laterite Soil</option>
              <option value="Arid / Desert Soil">Arid / Desert Soil</option>
              <option value="Mountain / Forest Soil">Mountain / Forest Soil</option>
              <option value="Saline Soil">Saline Soil</option>
              <option value="Alkaline Soil">Alkaline Soil</option>
              <option value="Peaty & Marshy Soil">Peaty & Marshy Soil</option>
              <option value="Coastal Sandy Soil">Coastal Sandy Soil</option>
            </select>
          </div>

          {/* Irrigation Type */}
          <div>
            <label className="block text-sm font-semibold mb-2">Irrigation Type *</label>
            <select
              value={formData.irrigationType}
              onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value })}
              className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            >
              <option value="">Select irrigation type</option>
              <option value="Drip">Drip Irrigation</option>
              <option value="Sprinkler">Sprinkler</option>
              <option value="Canal">Canal</option>
              <option value="Borewell">Borewell</option>
              <option value="Rainfed">Rainfed</option>
              <option value="Flood">Flood Irrigation</option>
            </select>
          </div>

          {/* Current Crop (Optional) */}
          <div>
            <label className="block text-sm font-semibold mb-2">Current Crop (Optional)</label>
            <input
              type="text"
              value={formData.crop}
              onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
              placeholder="e.g., Tomato, Wheat, Rice"
              className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Location (Optional) */}
          <div>
            <label className="block text-sm font-semibold mb-2">Location (Optional)</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Block A, Near River"
              className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Dates (Optional) */}
          {formData.crop && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Planting Date</label>
                <input
                  type="date"
                  value={formData.plantingDate}
                  onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Expected Harvest</label>
                <input
                  type="date"
                  value={formData.expectedHarvestDate}
                  onChange={(e) => setFormData({ ...formData, expectedHarvestDate: e.target.value })}
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-4 bg-muted hover:bg-muted/80 rounded-2xl transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-4 bg-primary text-primary-foreground hover:opacity-90 rounded-2xl transition-all font-semibold shadow-lg shadow-primary/20"
          >
            {field ? 'Save Changes' : 'Add Field'}
          </button>
        </div>
      </form>
    </div>
  );
}
