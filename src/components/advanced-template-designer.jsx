import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Plus, 
  Settings, 
  Eye, 
  Save, 
  Copy, 
  Trash2, 
  Edit3, 
  Move, 
  GripVertical,
  Wand2
} from 'lucide-react';
import { formTemplates, getDynamicFormConfig, saveDynamicFormConfig, saveFormTemplate } from '@/services/templateService';

const fieldTypes = [
  { value: 'text', label: 'Text Input', icon: '📝' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'tel', label: 'Phone', icon: '📞' },
  { value: 'number', label: 'Number', icon: '🔢' },
  { value: 'date', label: 'Date', icon: '📅' },
  { value: 'textarea', label: 'Long Text', icon: '📄' },
  { value: 'select', label: 'Dropdown', icon: '📋' },
  { value: 'radio', label: 'Radio Buttons', icon: '🔘' },
  { value: 'checkbox', label: 'Checkbox', icon: '☑️' },
  { value: 'checkbox-group', label: 'Multiple Choice', icon: '✅' }
];

export default function AdvancedTemplateDesigner({ doctorId, onFormConfigChange }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formConfig, setFormConfig] = useState(null);
  const [customSections, setCustomSections] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [draggedField, setDraggedField] = useState(null);
  const [draggedSection, setDraggedSection] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState({
    name: 'Blue Professional',
    gradient: 'from-blue-600 to-blue-700',
    primaryColor: 'blue'
  });

  const loadFormConfig = async () => {
    try {
      const config = await getDynamicFormConfig(doctorId);
      setFormConfig(config);
      if (config.templateId && formTemplates[config.templateId]) {
        setSelectedTemplate(formTemplates[config.templateId]);
      } else {
        // Set minimal template as default if no template is configured
        setSelectedTemplate(formTemplates.minimal);
      }
      if (config.customSections) {
        setCustomSections(config.customSections);
      } else if (!config.templateId) {
        // Initialize with minimal template sections if no config exists
        setCustomSections([...formTemplates.minimal.sections]);
      }
    } catch (error) {
      console.error('Error loading form config:', error);
      // Set minimal template as default on error
      setSelectedTemplate(formTemplates.minimal);
      setCustomSections([...formTemplates.minimal.sections]);
    }
  };

  useEffect(() => {
    loadFormConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId]);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setCustomSections([...template.sections]);
    saveConfiguration();
  };

  const saveConfiguration = async () => {
    const config = {
      templateId: selectedTemplate?.id || 'minimal',
      customSections
    };

    try {
      await saveDynamicFormConfig(doctorId, config);
      onFormConfigChange && onFormConfigChange(config);
      console.log('Configuration saved successfully');
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  };

  const addCustomSection = () => {
    const newSection = {
      id: `custom_${Date.now()}`,
      title: 'New Section',
      fields: []
    };
    setCustomSections([...customSections, newSection]);
  };

  const updateSection = (sectionId, updates) => {
    setCustomSections(sections =>
      sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    );
  };

  const addFieldToSection = (sectionId, fieldType) => {
    const newField = {
      id: `field_${Date.now()}`,
      type: fieldType,
      label: `New ${fieldType} Field`,
      required: false,
      placeholder: '',
      options: fieldType.includes('select') || fieldType.includes('radio') || fieldType.includes('checkbox') ? ['Option 1', 'Option 2'] : undefined
    };

    setCustomSections(sections =>
      sections.map(section =>
        section.id === sectionId
          ? { ...section, fields: [...section.fields, newField] }
          : section
      )
    );
  };

  const updateField = (sectionId, fieldId, updates) => {
    setCustomSections(sections =>
      sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map(field =>
                field.id === fieldId ? { ...field, ...updates } : field
              )
            }
          : section
      )
    );
  };

  const removeField = (sectionId, fieldId) => {
    setCustomSections(sections =>
      sections.map(section =>
        section.id === sectionId
          ? { ...section, fields: section.fields.filter(field => field.id !== fieldId) }
          : section
      )
    );
  };

  const removeSection = (sectionId) => {
    setCustomSections(sections => sections.filter(section => section.id !== sectionId));
  };

  const duplicateSection = (section) => {
    const duplicated = {
      ...section,
      id: `${section.id}_copy_${Date.now()}`,
      title: `${section.title} (Copy)`,
      fields: section.fields.map(field => ({ ...field, id: `${field.id}_copy_${Date.now()}` }))
    };
    setCustomSections([...customSections, duplicated]);
  };

  const handleDragStart = (e, field, sectionId) => {
    setDraggedField({ field, sectionId });
  };

  const handleDrop = (e, targetSectionId) => {
    e.preventDefault();
    if (!draggedField) return;

    // Remove from original section
    setCustomSections(sections =>
      sections.map(section => {
        if (section.id === draggedField.sectionId) {
          return {
            ...section,
            fields: section.fields.filter(f => f.id !== draggedField.field.id)
          };
        }
        if (section.id === targetSectionId) {
          return {
            ...section,
            fields: [...section.fields, draggedField.field]
          };
        }
        return section;
      })
    );

    setDraggedField(null);
  };

  const FieldEditor = ({ section, field }) => (
    <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical 
            className="h-4 w-4 text-gray-400 cursor-move" 
            draggable
            onDragStart={(e) => handleDragStart(e, field, section.id)}
          />
          <span className="text-sm font-medium">{fieldTypes.find(ft => ft.value === field.type)?.icon}</span>
          <span className="text-sm text-gray-600">{fieldTypes.find(ft => ft.value === field.type)?.label}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeField(section.id, field.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Field Label</Label>
          <Input
            value={field.label}
            onChange={(e) => updateField(section.id, field.id, { label: e.target.value })}
            className="h-8"
          />
        </div>
        <div>
          <Label className="text-xs">Placeholder</Label>
          <Input
            value={field.placeholder || ''}
            onChange={(e) => updateField(section.id, field.id, { placeholder: e.target.value })}
            className="h-8"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`required-${field.id}`}
            checked={field.required || false}
            onChange={(e) => updateField(section.id, field.id, { required: e.target.checked })}
            className="h-3 w-3"
          />
          <Label htmlFor={`required-${field.id}`} className="text-xs">Required</Label>
        </div>
        
        <Select 
          value={field.type} 
          onValueChange={(value) => updateField(section.id, field.id, { type: value })}
        >
          <SelectTrigger className="h-8 w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fieldTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <span className="flex items-center gap-2">
                  <span>{type.icon}</span>
                  <span>{type.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox-group') && (
        <div>
          <Label className="text-xs">Options (one per line)</Label>
          <Textarea
            value={field.options?.join('\n') || ''}
            onChange={(e) => updateField(section.id, field.id, { 
              options: e.target.value.split('\n').filter(opt => opt.trim()) 
            })}
            className="h-20 text-xs"
            placeholder="Option 1&#10;Option 2&#10;Option 3"
          />
        </div>
      )}
    </div>
  );

  if (previewMode) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Form Preview</h2>
            <p className="text-sm text-slate-600 mt-1">Review your form as patients will see it</p>
          </div>
          <Button 
            onClick={() => setPreviewMode(false)}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Edit Mode</span>
            <span className="sm:hidden">Edit</span>
          </Button>
        </div>
        
        <div className={`bg-gradient-to-r ${selectedTheme.gradient} p-6 rounded-lg text-white`}>
          <h3 className="text-xl font-semibold">Appointment Booking Form</h3>
          <p className="opacity-90">Preview of your customized form</p>
        </div>

        <div className="space-y-6">
          {customSections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label className="text-sm font-medium">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {field.type === 'textarea' ? (
                      <Textarea placeholder={field.placeholder} disabled />
                    ) : field.type === 'select' ? (
                      <Select disabled>
                        <SelectTrigger>
                          <SelectValue placeholder={field.placeholder || "Select an option"} />
                        </SelectTrigger>
                      </Select>
                    ) : field.type === 'radio' ? (
                      <div className="space-y-2">
                        {field.options?.map((option, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <input type="radio" disabled />
                            <Label className="text-sm">{option}</Label>
                          </div>
                        ))}
                      </div>
                    ) : field.type === 'checkbox-group' ? (
                      <div className="space-y-2">
                        {field.options?.map((option, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <input type="checkbox" disabled />
                            <Label className="text-sm">{option}</Label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Input 
                        type={field.type} 
                        placeholder={field.placeholder} 
                        disabled 
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Wand2 className="h-6 w-6" />
            Form Template Designer
          </h2>
          <p className="text-gray-600">Create and customize appointment forms with professional templates</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Button 
            variant="outline" 
            onClick={() => setPreviewMode(true)}
            className="border-2 border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 font-semibold transition-all hover:shadow-md w-full sm:w-auto"
          >
            <Eye className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Preview Form</span>
            <span className="sm:hidden">Preview</span>
          </Button>
          <Button 
            onClick={saveConfiguration}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
          >
            <Save className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Save Configuration</span>
            <span className="sm:hidden">Save</span>
          </Button>
        </div>
      </div>

      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Choose Template
          </CardTitle>
          <CardDescription>
            Start with a professional template designed for your specialty
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(formTemplates).map((template) => (
              <div
                key={template.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedTemplate?.id === template.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="text-center space-y-2">
                  <div className="text-3xl">{template.icon}</div>
                  <h3 className="font-semibold">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                  <Badge variant={selectedTemplate?.id === template.id ? "default" : "outline"}>
                    {template.sections.length} sections
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>



      {/* Form Builder */}
      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                Customize Form Sections
              </span>
              <Button onClick={addCustomSection} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {customSections.map((section) => (
              <div key={section.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Input
                    value={section.title}
                    onChange={(e) => updateSection(section.id, { title: e.target.value })}
                    className="font-semibold text-lg border-none p-0 h-auto"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => duplicateSection(section)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSection(section.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div 
                  className="min-h-20 border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3"
                  onDrop={(e) => handleDrop(e, section.id)}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {section.fields.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Drag fields here or click to add fields
                    </p>
                  ) : (
                    section.fields.map((field) => (
                      <FieldEditor key={field.id} section={section} field={field} />
                    ))
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {fieldTypes.map((fieldType) => (
                    <Button
                      key={fieldType.value}
                      variant="outline"
                      size="sm"
                      onClick={() => addFieldToSection(section.id, fieldType.value)}
                      className="text-xs"
                    >
                      <span className="mr-1">{fieldType.icon}</span>
                      {fieldType.label}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
