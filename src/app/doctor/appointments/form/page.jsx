'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getDoctorById } from '@/services/doctorService';
import { AppointmentForm } from '@/components/appointment-form';
import { getDoctors } from '@/services/doctorService';
import { getDynamicFormConfig, saveDynamicFormConfig } from '@/services/formService';
import { Loader2, Settings, Save, Plus, Trash2, GripVertical, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

function AppointmentFormPage() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('id');
  const [doctor, setDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [formConfig, setFormConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [tempConfig, setTempConfig] = useState(null);
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const { toast } = useToast();

  // New field form state
  const [newField, setNewField] = useState({
    id: '',
    label: '',
    type: 'text',
    placeholder: '',
    required: false,
    options: [],
    validation: {}
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (doctorId) {
          const [doctorData, config] = await Promise.all([
            getDoctorById(doctorId),
            getDynamicFormConfig(doctorId)
          ]);
          setDoctor(doctorData);
          setFormConfig(config);
          setTempConfig(config);
        }
        const doctorsList = await getDoctors();
        setDoctors(doctorsList);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [doctorId]);

  const handleSaveConfig = async () => {
    try {
      await saveDynamicFormConfig(doctorId, tempConfig);
      setFormConfig(tempConfig);
      setIsCustomizing(false);
      toast({
        title: 'Success',
        description: 'Form configuration saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save form configuration.',
        variant: 'destructive',
      });
    }
  };

  const updateFieldConfig = (fieldName, property, value) => {
    setTempConfig(prev => ({
      ...prev,
      [property]: prev[property].includes(fieldName)
        ? prev[property].filter(f => f !== fieldName)
        : [...prev[property], fieldName]
    }));
  };

  const addCustomField = () => {
    if (!newField.label || !newField.id) {
      toast({
        title: 'Error',
        description: 'Field label and ID are required.',
        variant: 'destructive',
      });
      return;
    }

    const fieldId = `custom_${newField.id}`;
    const customField = {
      id: fieldId,
      label: newField.label,
      type: newField.type,
      placeholder: newField.placeholder,
      required: newField.required,
      options: newField.options,
      validation: newField.validation
    };

    setTempConfig(prev => ({
      ...prev,
      customFields: [...(prev.customFields || []), customField],
      fieldOrder: [...(prev.fieldOrder || []), fieldId]
    }));

    // Reset form
    setNewField({
      id: '',
      label: '',
      type: 'text',
      placeholder: '',
      required: false,
      options: [],
      validation: {}
    });
    setIsAddingField(false);

    toast({
      title: 'Success',
      description: 'Custom field added successfully.',
    });
  };

  const deleteCustomField = (fieldId) => {
    setTempConfig(prev => ({
      ...prev,
      customFields: prev.customFields.filter(f => f.id !== fieldId),
      fieldOrder: prev.fieldOrder.filter(id => id !== fieldId),
      requiredFields: prev.requiredFields.filter(id => id !== fieldId),
      optionalFields: prev.optionalFields.filter(id => id !== fieldId)
    }));

    toast({
      title: 'Success',
      description: 'Field deleted successfully.',
    });
  };

  const updateCustomField = (fieldId, updates) => {
    setTempConfig(prev => ({
      ...prev,
      customFields: prev.customFields.map(f =>
        f.id === fieldId ? { ...f, ...updates } : f
      )
    }));
  };

  const addOptionToField = () => {
    setNewField(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const updateOption = (index, value) => {
    setNewField(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const removeOption = (index) => {
    setNewField(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Doctor not found.</p>
      </div>
    );
  }

  const standardFields = [
    { name: 'patientName', label: 'Patient Name', required: true },
    { name: 'patientPhone', label: 'Patient Phone', required: true },
    { name: 'patientEmail', label: 'Patient Email' },
    { name: 'age', label: 'Age', required: true },
    { name: 'gender', label: 'Gender', required: true },
    { name: 'healthPriority', label: 'Health Priority' },
    { name: 'description', label: 'Description' },
  ];

  const fieldTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'number', label: 'Number Input' },
    { value: 'email', label: 'Email Input' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'select', label: 'Select Dropdown' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'date', label: 'Date Picker' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {isCustomizing ? 'Customize Form' : 'Create Appointment'} for {doctor.name}
        </h1>
        <Button
          onClick={() => setIsCustomizing(!isCustomizing)}
          variant={isCustomizing ? 'outline' : 'default'}
        >
          <Settings className="h-4 w-4 mr-2" />
          {isCustomizing ? 'Back to Form' : 'Customize Form'}
        </Button>
      </div>

      {isCustomizing ? (
        <div className="space-y-6">
          {/* Standard Fields Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Standard Fields</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {standardFields.map(field => (
                <div key={field.name} className="flex items-center justify-between p-4 border rounded">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`enable-${field.name}`}
                      checked={tempConfig?.requiredFields?.includes(field.name) || tempConfig?.optionalFields?.includes(field.name)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          if (field.required) {
                            updateFieldConfig(field.name, 'requiredFields', true);
                          } else {
                            updateFieldConfig(field.name, 'optionalFields', true);
                          }
                        } else {
                          setTempConfig(prev => ({
                            ...prev,
                            requiredFields: prev.requiredFields.filter(f => f !== field.name),
                            optionalFields: prev.optionalFields.filter(f => f !== field.name),
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={`enable-${field.name}`}>{field.label}</Label>
                  </div>
                  {(tempConfig?.requiredFields?.includes(field.name) || tempConfig?.optionalFields?.includes(field.name)) && !field.required && (
                    <Select
                      value={tempConfig?.requiredFields?.includes(field.name) ? 'required' : 'optional'}
                      onValueChange={(value) => {
                        if (value === 'required') {
                          updateFieldConfig(field.name, 'requiredFields', true);
                          updateFieldConfig(field.name, 'optionalFields', false);
                        } else {
                          updateFieldConfig(field.name, 'optionalFields', true);
                          updateFieldConfig(field.name, 'requiredFields', false);
                        }
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="required">Required</SelectItem>
                        <SelectItem value="optional">Optional</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Custom Fields Configuration */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Custom Fields</CardTitle>
              <Dialog open={isAddingField} onOpenChange={setIsAddingField}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Field
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Custom Field</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="field-id">Field ID</Label>
                        <Input
                          id="field-id"
                          value={newField.id}
                          onChange={(e) => setNewField(prev => ({ ...prev, id: e.target.value }))}
                          placeholder="unique_field_id"
                        />
                      </div>
                      <div>
                        <Label htmlFor="field-label">Field Label</Label>
                        <Input
                          id="field-label"
                          value={newField.label}
                          onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
                          placeholder="Field Label"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="field-type">Field Type</Label>
                        <Select
                          value={newField.type}
                          onValueChange={(value) => setNewField(prev => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fieldTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="field-placeholder">Placeholder</Label>
                        <Input
                          id="field-placeholder"
                          value={newField.placeholder}
                          onChange={(e) => setNewField(prev => ({ ...prev, placeholder: e.target.value }))}
                          placeholder="Enter placeholder text"
                        />
                      </div>
                    </div>

                    {(newField.type === 'select' || newField.type === 'radio') && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Options</Label>
                          <Button type="button" size="sm" onClick={addOptionToField}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Option
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {newField.options.map((option, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={option}
                                onChange={(e) => updateOption(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => removeOption(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="field-required"
                        checked={newField.required}
                        onCheckedChange={(checked) => setNewField(prev => ({ ...prev, required: checked }))}
                      />
                      <Label htmlFor="field-required">Required field</Label>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsAddingField(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addCustomField}>
                        Add Field
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {tempConfig?.customFields?.map(field => (
                <div key={field.id} className="flex items-center justify-between p-4 border rounded">
                  <div className="flex items-center space-x-4">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="font-medium">{field.label}</div>
                      <div className="text-sm text-gray-500">
                        Type: {field.type} {field.required ? '(Required)' : '(Optional)'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingField(field)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteCustomField(field.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {(!tempConfig?.customFields || tempConfig.customFields.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No custom fields added yet. Click "Add Field" to create your first custom field.
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setTempConfig(formConfig)}>
              Reset
            </Button>
            <Button onClick={handleSaveConfig}>
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </div>
      ) : (
        <AppointmentForm
          doctors={doctors}
          preselectedDoctorId={doctorId}
          formConfig={formConfig}
          doctor={doctor}
        />
      )}
    </div>
  );
}

export default AppointmentFormPage;