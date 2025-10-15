'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Save, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/context/theme';
import { cn } from '@/lib/utils';

const FORM_TYPES = [
  { value: 'consultation', label: 'Consultation Form' },
  { value: 'followup', label: 'Follow-up Form' },
  { value: 'prescription', label: 'Prescription Form' },
  { value: 'referral', label: 'Referral Form' },
  { value: 'custom', label: 'Custom Form' },
];

const FIELD_TYPES = [
  { value: 'text', label: 'Text Input' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'select', label: 'Dropdown' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date Picker' },
  { value: 'number', label: 'Number Input' },
];

export default function Form({ doctorId }) {
  const { toast } = useToast();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Mock data - in real app, fetch from API
  useEffect(() => {
    const loadForms = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock forms data
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
      // Simulate API call
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
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn(
            "text-3xl font-bold",
            isDark ? "text-white" : "text-gray-900"
          )}>
            Form Management
          </h1>
          <p className={cn(
            "text-sm mt-1",
            isDark ? "text-gray-400" : "text-gray-600"
          )}>
            Create and manage patient forms
          </p>
        </div>
        <Button
          onClick={handleCreateForm}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Form
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forms List */}
        <div className="lg:col-span-1">
          <Card className={cn(
            "h-fit",
            isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
          )}>
            <CardHeader>
              <CardTitle className={cn(
                "flex items-center gap-2",
                isDark ? "text-white" : "text-gray-900"
              )}>
                <FileText className="h-5 w-5" />
                Forms ({forms.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {forms.map((form) => (
                <div
                  key={form.id}
                  className={cn(
                    "p-3 rounded-lg cursor-pointer transition-all duration-200",
                    selectedForm?.id === form.id
                      ? "bg-blue-500/20 border border-blue-500/50"
                      : isDark
                        ? "bg-gray-700/50 hover:bg-gray-700 border border-gray-600"
                        : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                  )}
                  onClick={() => {
                    setSelectedForm(form);
                    setIsCreating(false);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={cn(
                        "font-medium text-sm",
                        isDark ? "text-white" : "text-gray-900"
                      )}>
                        {form.title || 'Untitled Form'}
                      </h3>
                      <p className={cn(
                        "text-xs mt-1",
                        isDark ? "text-gray-400" : "text-gray-600"
                      )}>
                        {form.description || 'No description'}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {FORM_TYPES.find(t => t.value === form.type)?.label || form.type}
                        </Badge>
                        <span className={cn(
                          "text-xs",
                          isDark ? "text-gray-400" : "text-gray-500"
                        )}>
                          {form.fields.length} fields
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {forms.length === 0 && (
                <div className="text-center py-8">
                  <FileText className={cn(
                    "h-12 w-12 mx-auto mb-4",
                    isDark ? "text-gray-600" : "text-gray-400"
                  )} />
                  <p className={cn(
                    "text-sm",
                    isDark ? "text-gray-400" : "text-gray-600"
                  )}>
                    No forms created yet
                  </p>
                  <Button
                    onClick={handleCreateForm}
                    variant="outline"
                    size="sm"
                    className="mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Form
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Form Editor */}
        <div className="lg:col-span-2">
          {selectedForm ? (
            <Card className={cn(
              "",
              isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
            )}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={cn(
                    "flex items-center gap-2",
                    isDark ? "text-white" : "text-gray-900"
                  )}>
                    <FileText className="h-5 w-5" />
                    {isCreating ? 'Create Form' : 'Edit Form'}
                  </CardTitle>
                  <Button
                    onClick={handleSaveForm}
                    disabled={saving}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Form
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Form Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="form-title">Form Title</Label>
                    <Input
                      id="form-title"
                      value={selectedForm.title}
                      onChange={(e) => setSelectedForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter form title"
                      className={cn(
                        isDark ? "bg-gray-700 border-gray-600" : ""
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="form-type">Form Type</Label>
                    <Select
                      value={selectedForm.type}
                      onValueChange={(value) => setSelectedForm(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className={cn(
                        isDark ? "bg-gray-700 border-gray-600" : ""
                      )}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FORM_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="form-description">Description</Label>
                  <Textarea
                    id="form-description"
                    value={selectedForm.description}
                    onChange={(e) => setSelectedForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter form description"
                    rows={3}
                    className={cn(
                      isDark ? "bg-gray-700 border-gray-600" : ""
                    )}
                  />
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className={cn(
                      "text-lg font-medium",
                      isDark ? "text-white" : "text-gray-900"
                    )}>
                      Form Fields ({selectedForm.fields.length})
                    </h3>
                    <Button
                      onClick={handleAddField}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Field
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {selectedForm.fields.map((field, index) => (
                      <Card key={field.id} className={cn(
                        "p-4",
                        isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
                      )}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label>Field Label</Label>
                            <Input
                              value={field.label}
                              onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                              placeholder="Field label"
                              className={cn(
                                isDark ? "bg-gray-600 border-gray-500" : ""
                              )}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Field Type</Label>
                            <Select
                              value={field.type}
                              onValueChange={(value) => handleUpdateField(field.id, { type: value })}
                            >
                              <SelectTrigger className={cn(
                                isDark ? "bg-gray-600 border-gray-500" : ""
                              )}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {FIELD_TYPES.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`required-${field.id}`}
                              checked={field.required}
                              onChange={(e) => handleUpdateField(field.id, { required: e.target.checked })}
                              className="rounded"
                            />
                            <Label htmlFor={`required-${field.id}`}>Required</Label>
                          </div>
                          <div className="flex items-center justify-end">
                            <Button
                              onClick={() => handleDeleteField(field.id)}
                              variant="destructive"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {(field.type === 'select' || field.type === 'radio') && (
                          <div className="mt-4 space-y-2">
                            <Label>Options (one per line)</Label>
                            <Textarea
                              value={field.options?.join('\n') || ''}
                              onChange={(e) => handleUpdateField(field.id, {
                                options: e.target.value.split('\n').filter(opt => opt.trim())
                              })}
                              placeholder="Option 1\nOption 2\nOption 3"
                              rows={3}
                              className={cn(
                                isDark ? "bg-gray-600 border-gray-500" : ""
                              )}
                            />
                          </div>
                        )}
                      </Card>
                    ))}

                    {selectedForm.fields.length === 0 && (
                      <div className="text-center py-8">
                        <FileText className={cn(
                          "h-12 w-12 mx-auto mb-4",
                          isDark ? "text-gray-600" : "text-gray-400"
                        )} />
                        <p className={cn(
                          "text-sm",
                          isDark ? "text-gray-400" : "text-gray-600"
                        )}>
                          No fields added yet
                        </p>
                        <Button
                          onClick={handleAddField}
                          variant="outline"
                          size="sm"
                          className="mt-4"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add First Field
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className={cn(
              "h-96 flex items-center justify-center",
              isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
            )}>
              <div className="text-center">
                <FileText className={cn(
                  "h-16 w-16 mx-auto mb-4",
                  isDark ? "text-gray-600" : "text-gray-400"
                )} />
                <h3 className={cn(
                  "text-lg font-medium mb-2",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  Select a Form to Edit
                </h3>
                <p className={cn(
                  "text-sm",
                  isDark ? "text-gray-400" : "text-gray-600"
                )}>
                  Choose a form from the list or create a new one
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}