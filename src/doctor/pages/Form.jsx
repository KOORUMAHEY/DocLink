'use client';

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Trash2, ArrowLeft, Check, Grid3x3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/context/theme';
import { cn } from '@/lib/utils';

const FORM_TYPES = [
  { value: 'consultation', label: 'Consultation Form', icon: '📋' },
  { value: 'followup', label: 'Follow-up Form', icon: '🔄' },
  { value: 'prescription', label: 'Prescription Form', icon: '💊' },
  { value: 'referral', label: 'Referral Form', icon: '📤' },
  { value: 'custom', label: 'Custom Form', icon: '⚙️' },
];

const FIELD_TYPES = [
  { value: 'text', label: 'Text Input', icon: '📝' },
  { value: 'textarea', label: 'Text Area', icon: '📄' },
  { value: 'select', label: 'Dropdown', icon: '��' },
  { value: 'radio', label: 'Radio Buttons', icon: '🔘' },
  { value: 'checkbox', label: 'Checkbox', icon: '☑️' },
  { value: 'date', label: 'Date Picker', icon: '📅' },
  { value: 'number', label: 'Number Input', icon: '🔢' },
];

export default function Form({ doctorId }) {
  const { toast } = useToast();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const loadForms = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockForms = [
          {
            id: '1',
            type: 'consultation',
            title: 'Initial Consultation Form',
            description: 'Standard form for new patient consultations',
            fields: [
              { id: '1', type: 'text', label: 'Patient Name', required: true },
              { id: '2', type: 'date', label: 'Date of Birth', required: true },
              { id: '3', type: 'textarea', label: 'Chief Complaint', required: true },
              { id: '4', type: 'select', label: 'Urgency Level', required: true, options: ['Low', 'Medium', 'High', 'Emergency'] },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '2',
            type: 'followup',
            title: 'Follow-up Visit Form',
            description: 'Form for follow-up appointments',
            fields: [
              { id: '1', type: 'text', label: 'Patient Name', required: true },
              { id: '2', type: 'textarea', label: 'Progress Notes', required: true },
              { id: '3', type: 'select', label: 'Follow-up Required', required: true, options: ['Yes', 'No'] },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        setForms(mockForms);
      } catch (error) {
        console.error('Failed to load forms:', error);
        toast({
          title: "Error",
          description: "Failed to load forms data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadForms();
  }, [doctorId, toast]);

  const handleCreateForm = () => {
    const newForm = {
      id: Date.now().toString(),
      type: 'consultation',
      title: '',
      description: '',
      fields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setForms(prev => [...prev, newForm]);
    setSelectedForm(newForm);
    setIsCreating(true);
  };

  const handleSaveForm = async () => {
    try {
      setSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Success",
        description: "Form saved successfully",
      });
      setIsCreating(false);
      setSelectedForm(null);
    } catch (error) {
      console.error('Failed to save form:', error);
      toast({
        title: "Error",
        description: "Failed to save form",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddField = () => {
    if (!selectedForm) return;
    const newField = {
      id: Date.now().toString(),
      type: 'text',
      label: '',
      required: false,
      options: [],
    };
    setSelectedForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
  };

  const handleUpdateField = (fieldId, updates) => {
    if (!selectedForm) return;
    setSelectedForm(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      ),
    }));
  };

  const handleDeleteField = (fieldId) => {
    if (!selectedForm) return;
    setSelectedForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId),
    }));
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={`skeleton-${index}`} className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const templateCount = forms.length;
  const templateLabel = templateCount > 0 ? `${templateCount} template${templateCount > 1 ? 's' : ''}` : 'No templates yet';

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-200",
      isDark ? "bg-gray-900" : "bg-gradient-to-br from-slate-50 via-white to-slate-50"
    )}>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className={cn(
          "absolute top-0 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20",
          isDark ? "bg-blue-900" : "bg-blue-200"
        )}></div>
        <div className={cn(
          "absolute bottom-0 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20",
          isDark ? "bg-purple-900" : "bg-purple-200"
        )}></div>
      </div>

      <div className={cn(
        "sticky top-0 z-40 border-b backdrop-blur-lg transition-colors duration-200",
        isDark ? "bg-gray-800/80 border-gray-700/50" : "bg-white/70 border-gray-200/50"
      )}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                <Grid3x3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className={cn(
                  "text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent",
                  isDark && "from-blue-400 to-cyan-400"
                )}>
                  Form Builder
                </h1>
                <p className={cn(
                  "text-xs mt-1 font-medium",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  {templateLabel}
                </p>
              </div>
            </div>
            <Button
              onClick={handleCreateForm}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {selectedForm ? (
          <FormEditor 
            selectedForm={selectedForm}
            setSelectedForm={setSelectedForm}
            isCreating={isCreating}
            saving={saving}
            isDark={isDark}
            onSave={handleSaveForm}
            onAddField={handleAddField}
            onUpdateField={handleUpdateField}
            onDeleteField={handleDeleteField}
          />
        ) : (
          <FormsList 
            forms={forms}
            isDark={isDark}
            onSelectForm={(form) => {
              setSelectedForm(form);
              setIsCreating(false);
            }}
            onCreateForm={handleCreateForm}
          />
        )}
      </div>
    </div>
  );
}

function FormEditor({ selectedForm, setSelectedForm, isCreating, saving, isDark, onSave, onAddField, onUpdateField, onDeleteField }) {
  return (
    <div className="space-y-6">
      <button
        onClick={() => setSelectedForm(null)}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 group",
          isDark
            ? "text-gray-300 hover:bg-gray-700/50"
            : "text-gray-600 hover:bg-gray-200/50"
        )}
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Templates
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className={cn(
          "lg:col-span-1 rounded-2xl border transition-all duration-200 backdrop-blur-sm",
          isDark
            ? "bg-gray-800/40 border-gray-700/50 hover:border-gray-600/50"
            : "bg-white/40 border-white/50 hover:border-white/70 shadow-sm"
        )}>
          <div className="p-6 space-y-6">
            <div>
              <h2 className={cn(
                "text-lg font-bold mb-4",
                isDark ? "text-white" : "text-gray-900"
              )}>
                {isCreating ? '✨ Create Template' : '📝 Edit Template'}
              </h2>
              <div className="space-y-4">
                <div>
                  <Label className={cn("text-sm font-semibold block mb-2", isDark ? "text-gray-300" : "text-gray-700")}>
                    Template Title
                  </Label>
                  <Input
                    value={selectedForm.title}
                    onChange={(e) => setSelectedForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Initial Consultation"
                    className={cn(
                      "text-sm font-medium transition-all duration-200",
                      isDark
                        ? "bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:bg-gray-700 focus:border-blue-500"
                        : "bg-white/50 border-gray-300 focus:bg-white focus:border-blue-500"
                    )}
                  />
                </div>
                <div>
                  <Label className={cn("text-sm font-semibold block mb-2", isDark ? "text-gray-300" : "text-gray-700")}>
                    Form Type
                  </Label>
                  <Select
                    value={selectedForm.type}
                    onValueChange={(value) => setSelectedForm(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className={cn(
                      "text-sm transition-all duration-200",
                      isDark
                        ? "bg-gray-700/50 border-gray-600 text-white focus:border-blue-500 focus:bg-gray-700"
                        : "bg-white/50 border-gray-300 focus:bg-white focus:border-blue-500"
                    )}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FORM_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className={cn(
              "p-4 rounded-xl border-2",
              isDark
                ? "bg-gradient-to-br from-gray-700/50 to-gray-800/30 border-gray-600/30"
                : "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/30"
            )}>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className={cn("text-xs font-medium", isDark ? "text-gray-400" : "text-gray-600")}>
                    Total Fields
                  </p>
                  <p className={cn("text-3xl font-bold mt-2", isDark ? "text-blue-400" : "text-blue-600")}>
                    {selectedForm.fields.length}
                  </p>
                </div>
                <div className="text-center">
                  <p className={cn("text-xs font-medium", isDark ? "text-gray-400" : "text-gray-600")}>
                    Required
                  </p>
                  <p className={cn("text-3xl font-bold mt-2", isDark ? "text-orange-400" : "text-orange-600")}>
                    {selectedForm.fields.filter(f => f.required).length}
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={onSave}
              disabled={saving}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Save Template
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className={cn(
            "rounded-2xl border transition-all duration-200 p-6 backdrop-blur-sm",
            isDark
              ? "bg-gray-800/40 border-gray-700/50 hover:border-gray-600/50"
              : "bg-white/40 border-white/50 hover:border-white/70 shadow-sm"
          )}>
            <Label className={cn("text-sm font-semibold block mb-3", isDark ? "text-gray-300" : "text-gray-700")}>
              Description
            </Label>
            <Textarea
              value={selectedForm.description}
              onChange={(e) => setSelectedForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this form is for and its purpose..."
              rows={3}
              className={cn(
                "text-sm resize-none transition-all duration-200",
                isDark
                  ? "bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:bg-gray-700 focus:border-blue-500"
                  : "bg-white/50 border-gray-300 focus:bg-white focus:border-blue-500"
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={cn(
                  "text-lg font-bold",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  📋 Form Fields
                </h3>
                <p className={cn(
                  "text-xs mt-1 font-medium",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  {selectedForm.fields.length} field configured
                </p>
              </div>
              <Button
                onClick={onAddField}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>

            {selectedForm.fields.length > 0 ? (
              <FieldsList 
                fields={selectedForm.fields}
                isDark={isDark}
                onUpdateField={onUpdateField}
                onDeleteField={onDeleteField}
              />
            ) : (
              <div className={cn(
                "rounded-xl border-2 border-dashed p-12 text-center transition-all duration-200",
                isDark
                  ? "bg-gray-800/20 border-gray-600/30"
                  : "bg-blue-50/30 border-blue-300/30"
              )}>
                <FileText className={cn(
                  "h-12 w-12 mx-auto mb-3 opacity-40",
                  isDark ? "text-gray-600" : "text-blue-400"
                )} />
                <p className={cn(
                  "font-medium mb-3",
                  isDark ? "text-gray-400" : "text-gray-600"
                )}>
                  No fields yet
                </p>
                <p className={cn(
                  "text-sm mb-6",
                  isDark ? "text-gray-500" : "text-gray-600"
                )}>
                  Start by adding your first field to the form
                </p>
                <Button
                  onClick={onAddField}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold mx-auto"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Field
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldsList({ fields, isDark, onUpdateField, onDeleteField }) {
  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className={cn(
            "rounded-xl border-2 p-5 transition-all duration-200 group backdrop-blur-sm",
            isDark
              ? "bg-gray-800/40 border-gray-700/50 hover:border-blue-500/30 hover:bg-gray-800/60"
              : "bg-white/50 border-white/50 hover:border-blue-400/50 hover:bg-white/70 shadow-sm"
          )}
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <span className={cn(
                "text-xs font-bold px-3 py-1.5 rounded-full",
                isDark ? "bg-gray-700/50 text-blue-400" : "bg-blue-100/50 text-blue-700"
              )}>
                Field {index + 1}
              </span>
              <Badge className={cn(
                "text-xs font-semibold",
                field.required
                  ? "bg-red-500/20 text-red-700 dark:text-red-300"
                  : "bg-gray-400/20 text-gray-700 dark:text-gray-300"
              )}>
                {field.required ? '● Required' : '○ Optional'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className={cn("text-xs font-semibold block mb-2", isDark ? "text-gray-400" : "text-gray-600")}>
                  Label
                </Label>
                <Input
                  value={field.label}
                  onChange={(e) => onUpdateField(field.id, { label: e.target.value })}
                  placeholder="Field label"
                  className={cn(
                    "text-sm transition-all duration-200",
                    isDark
                      ? "bg-gray-700/50 border-gray-600 text-white focus:border-blue-500"
                      : "bg-white/50 border-gray-300 focus:border-blue-500"
                  )}
                />
              </div>
              <div>
                <Label className={cn("text-xs font-semibold block mb-2", isDark ? "text-gray-400" : "text-gray-600")}>
                  Type
                </Label>
                <Select
                  value={field.type}
                  onValueChange={(value) => onUpdateField(field.id, { type: value })}
                >
                  <SelectTrigger className={cn(
                    "text-sm transition-all duration-200",
                    isDark
                      ? "bg-gray-700/50 border-gray-600 text-white focus:border-blue-500"
                      : "bg-white/50 border-gray-300 focus:border-blue-500"
                  )}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELD_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2">
                <label className="flex items-center gap-2 cursor-pointer flex-1 p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/30 transition-colors">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => onUpdateField(field.id, { required: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 accent-blue-600"
                  />
                  <span className={cn("text-sm font-medium", isDark ? "text-gray-300" : "text-gray-700")}>
                    Required
                  </span>
                </label>
                <Button
                  onClick={() => onDeleteField(field.id)}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "hover:bg-red-500/20 text-red-500 hover:text-red-600 transition-colors",
                    isDark ? "hover:bg-red-900/30" : ""
                  )}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {(field.type === 'select' || field.type === 'radio') && (
              <div>
                <Label className={cn("text-xs font-semibold block mb-2", isDark ? "text-gray-400" : "text-gray-600")}>
                  Options (one per line)
                </Label>
                <Textarea
                  value={field.options?.join('\n') || ''}
                  onChange={(e) => onUpdateField(field.id, {
                    options: e.target.value.split('\n').filter(opt => opt.trim())
                  })}
                  placeholder="Option 1\nOption 2\nOption 3"
                  rows={3}
                  className={cn(
                    "text-sm resize-none transition-all duration-200",
                    isDark
                      ? "bg-gray-700/50 border-gray-600 text-white focus:border-blue-500"
                      : "bg-white/50 border-gray-300 focus:border-blue-500"
                  )}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function FormsList({ forms, isDark, onSelectForm, onCreateForm }) {
  return (
    <div className="space-y-6">
      <div>
        <p className={cn(
          "text-sm font-medium",
          isDark ? "text-gray-400" : "text-gray-600"
        )}>
          {forms.length > 0
            ? `You have ${forms.length} template${forms.length > 1 ? 's' : ''}`
            : 'No templates created yet. Start by creating your first template.'}
        </p>
      </div>

      {forms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forms.map((form) => {
            const formType = FORM_TYPES.find(t => t.value === form.type);
            return (
              <button
                key={form.id}
                onClick={() => onSelectForm(form)}
                className={cn(
                  "text-left rounded-2xl border-2 p-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 group backdrop-blur-sm",
                  isDark
                    ? "bg-gray-800/40 border-gray-700/50 hover:border-blue-500/30 hover:bg-gray-800/60"
                    : "bg-white/50 border-white/50 hover:border-blue-400/50 hover:bg-white/70 shadow-sm"
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform">
                    {formType?.icon}
                  </div>
                  <Badge className={cn(
                    "text-xs font-semibold px-3 py-1",
                    form.type === 'consultation' && 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
                    form.type === 'followup' && 'bg-green-500/20 text-green-700 dark:text-green-300',
                    form.type === 'prescription' && 'bg-purple-500/20 text-purple-700 dark:text-purple-300',
                    form.type === 'referral' && 'bg-orange-500/20 text-orange-700 dark:text-orange-300',
                    form.type === 'custom' && 'bg-gray-500/20 text-gray-700 dark:text-gray-300'
                  )}>
                    {formType?.label || form.type}
                  </Badge>
                </div>

                <h3 className={cn(
                  "text-lg font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  {form.title || 'Untitled Template'}
                </h3>
                <p className={cn(
                  "text-sm line-clamp-2 mb-4",
                  isDark ? "text-gray-400" : "text-gray-600"
                )}>
                  {form.description || 'No description provided'}
                </p>

                <div className="flex items-center gap-2 text-sm font-medium pt-3 border-t border-gray-200/30 dark:border-gray-700/30">
                  <FileText className="h-4 w-4" />
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                    {form.fields.length} field{form.fields.length > 1 ? 's' : ''}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className={cn(
          "rounded-2xl border-2 border-dashed p-16 text-center transition-all duration-200 backdrop-blur-sm",
          isDark
            ? "bg-gray-800/20 border-gray-600/30"
            : "bg-blue-50/30 border-blue-300/30"
        )}>
          <div className="mb-4 text-6xl">📝</div>
          <h3 className={cn(
            "text-2xl font-bold mb-2",
            isDark ? "text-white" : "text-gray-900"
          )}>
            Create Your First Template
          </h3>
          <p className={cn(
            "text-base mb-8",
            isDark ? "text-gray-400" : "text-gray-600"
          )}>
            Build custom form templates to streamline patient data collection
          </p>
          <Button
            onClick={onCreateForm}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-6 text-base font-semibold"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Template
          </Button>
        </div>
      )}
    </div>
  );
}

Form.propTypes = {
  doctorId: PropTypes.string,
};
