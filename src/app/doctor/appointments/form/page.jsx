'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AppointmentForm } from '@/components/appointment-form';
import AdvancedTemplateDesigner from '@/components/advanced-template-designer';
import ScheduleManager from '@/components/schedule-manager';
import { getDoctorById } from '@/features/doctors';
import { getDynamicFormConfig } from '@/services/templateService';
import { formTemplates } from '@/services/templateService';
import { 
  Settings, 
  Calendar, 
  Wand2, 
  Eye, 
  BookOpen,
  Loader2,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AppointmentFormPage() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('id');
  const [doctor, setDoctor] = useState(null);
  const [formConfig, setFormConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('designer');
  const { toast } = useToast();

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
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load doctor information.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [doctorId, toast]);

  const handleFormConfigChange = (config) => {
    setFormConfig(config);
    toast({
      title: 'Success',
      description: 'Form configuration updated successfully.',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading form designer...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!doctorId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Settings className="h-5 w-5" />
              Doctor ID Required
            </CardTitle>
            <CardDescription>
              Please provide a doctor ID to access the form designer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Add <code className="bg-gray-100 px-2 py-1 rounded">?id=doctor-id</code> to the URL to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <User className="h-5 w-5" />
              Doctor Not Found
            </CardTitle>
            <CardDescription>
              The specified doctor could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Please check the doctor ID and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getCurrentTemplate = () => {
    if (formConfig?.templateId && formTemplates[formConfig.templateId]) {
      return formTemplates[formConfig.templateId];
    }
    return formTemplates.general;
  };

  const currentTemplate = getCurrentTemplate();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wand2 className="h-8 w-8 text-blue-600" />
              </div>
              Form Designer
            </h1>
            <p className="text-gray-600 mt-2">
              Customize your appointment forms with professional templates
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{doctor.name}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {doctor.specialization}
            </Badge>
          </div>
        </div>

        {/* Current Template Info */}
        {formConfig && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{currentTemplate.icon}</div>
                  <div>
                    <h3 className="font-semibold text-blue-900">
                      Current Template: {currentTemplate.name}
                    </h3>
                    <p className="text-blue-700 text-sm">{currentTemplate.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-blue-700">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{formConfig.customSections?.length || currentTemplate.sections.length} sections</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Settings className="h-4 w-4" />
                    <span>Template: {currentTemplate.name}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="designer" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Form Designer
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Live Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="designer" className="space-y-6">
          <AdvancedTemplateDesigner 
            doctorId={doctorId} 
            onFormConfigChange={handleFormConfigChange}
          />
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <ScheduleManager doctorId={doctorId} />
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Form Preview
              </CardTitle>
              <CardDescription>
                This is how patients will see your appointment form
              </CardDescription>
            </CardHeader>
            <CardContent>
              {formConfig ? (
                <div className="max-w-2xl mx-auto">
                  <AppointmentForm 
                    doctors={doctor ? [doctor] : []}
                    preselectedDoctorId={doctorId}
                    formConfig={formConfig}
                    doctor={doctor}
                    previewMode={true}
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Form Configuration</h3>
                  <p className="text-gray-600 mb-4">
                    Design your form using the Template Designer to see the preview here.
                  </p>
                  <Button 
                    onClick={() => setActiveTab('designer')}
                    className="flex items-center gap-2"
                  >
                    <Wand2 className="h-4 w-4" />
                    Start Designing
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Help Section */}
      <Card className="mt-8 bg-gray-50 border-gray-200">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-gray-600" />
            Quick Start Guide
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">1. Choose Template</h4>
              <p>Start with a professionally designed template that matches your medical specialty.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">2. Customize Fields</h4>
              <p>Add, remove, or modify form fields to collect exactly the information you need.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">3. Preview & Save</h4>
              <p>Test your form in the preview mode and save your configuration when ready.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
