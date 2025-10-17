'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppointmentForm } from '@/components/appointment-form';
import AdvancedTemplateDesigner from '@/components/advanced-template-designer';
import { getDoctorById } from '@/features/doctors';
import { getDynamicFormConfig } from '@/services/templateService';
import { formTemplates } from '@/services/templateService';
import { 
  Settings, 
  Wand2, 
  Eye, 
  BookOpen,
  Loader2,
  User,
  ArrowRight,
  Sparkles,
  Grid3x3,
  FileText,
  Zap,
  CheckCircle2,
  Clock,
  Monitor,
  Palette,
  Download,
  Share2,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function AppointmentFormPage() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('id');
  const [doctor, setDoctor] = useState(null);
  const [formConfig, setFormConfig] = useState(null);
  const [loading, setLoading] = useState(true);
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
    <div className="min-h-screen bg-white">
      {/* Professional Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4 max-w-7xl">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Logo & Branding */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="h-8 sm:h-10 w-8 sm:w-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0">
                <FileText className="h-4 sm:h-5 w-4 sm:w-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">Form Designer</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Appointment Management</p>
              </div>
            </div>

            {/* Center: Doctor Info - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{doctor.name}</p>
                  <p className="text-xs text-gray-500">{doctor.specialization}</p>
                </div>
              </div>
              <div className="w-px h-6 bg-gray-200" />
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                Active
              </Badge>
            </div>

            {/* Right: Navigation */}
            <Link 
              href={`/doctor/appointments/schedule?id=${doctorId}`}
              className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition whitespace-nowrap"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Schedule</span>
              <span className="sm:hidden">Schedule</span>
              <ArrowRight className="h-3 w-3 hidden sm:inline" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
        {/* Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Appointment Form</h2>
            <p className="text-xs sm:text-sm text-gray-600">Manage and customize your appointment form</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button className="inline-flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* Template Info Card */}
        {formConfig && (
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg sm:rounded-xl">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                <div className="text-2xl sm:text-3xl flex-shrink-0">{currentTemplate.icon}</div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                    {currentTemplate.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">{currentTemplate.description}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                    <span className="inline-flex items-center gap-1">
                      <Grid3x3 className="h-4 w-4 text-blue-600" />
                      <strong className="text-gray-900">{formConfig.customSections?.length || currentTemplate.sections.length}</strong> Sections
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <strong className="text-gray-900">{formConfig.customSections?.reduce((acc, sec) => acc + sec.fields.length, 0) || 0}</strong> Fields
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <Badge className="bg-green-100 text-green-700 border border-green-200 mb-2 text-xs">Published</Badge>
                <p className="text-xs text-gray-500">Last updated today</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid: Designer */}
        <div className="mb-12">
          {/* Designer Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 sm:h-10 w-8 sm:w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Wand2 className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Form Customization</h3>
                <p className="text-xs text-gray-500">Drag & drop to customize fields</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs w-fit">v2.0</Badge>
          </div>

          {/* Designer Component */}
          <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 overflow-x-auto">
            <AdvancedTemplateDesigner 
              doctorId={doctorId} 
              onFormConfigChange={handleFormConfigChange}
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-8 sm:mb-12">
          <div className="mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Key Features</h3>
            <p className="text-xs sm:text-sm text-gray-600">Powerful tools to create the perfect appointment form</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition">
              <div className="flex items-start gap-3">
                <div className="h-8 sm:h-10 w-8 sm:w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Wand2 className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">Drag & Drop Editor</h4>
                  <p className="text-xs text-gray-600">Intuitively design forms without coding</p>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition">
              <div className="flex items-start gap-3">
                <div className="h-8 sm:h-10 w-8 sm:w-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Monitor className="h-4 sm:h-5 w-4 sm:w-5 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">Real-time Preview</h4>
                  <p className="text-xs text-gray-600">See changes instantly as patients see them</p>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition">
              <div className="flex items-start gap-3">
                <div className="h-8 sm:h-10 w-8 sm:w-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Palette className="h-4 sm:h-5 w-4 sm:w-5 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">Pre-built Templates</h4>
                  <p className="text-xs text-gray-600">Professional templates for every specialty</p>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition">
              <div className="flex items-start gap-3">
                <div className="h-8 sm:h-10 w-8 sm:w-10 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-4 sm:h-5 w-4 sm:w-5 text-pink-600" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">Validation Rules</h4>
                  <p className="text-xs text-gray-600">Set required fields and data validation</p>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition">
              <div className="flex items-start gap-3">
                <div className="h-8 sm:h-10 w-8 sm:w-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Share2 className="h-4 sm:h-5 w-4 sm:w-5 text-orange-600" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">Multi-channel Sync</h4>
                  <p className="text-xs text-gray-600">Synchronize across all booking channels</p>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition">
              <div className="flex items-start gap-3">
                <div className="h-8 sm:h-10 w-8 sm:w-10 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                  <Download className="h-4 sm:h-5 w-4 sm:w-5 text-cyan-600" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">Data Export</h4>
                  <p className="text-xs text-gray-600">Export form responses in multiple formats</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg sm:rounded-xl p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
            <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 sm:h-6 w-5 sm:w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">Getting Started with Your Form</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-semibold text-blue-600 uppercase mb-2">Step 1</p>
                  <p className="text-xs sm:text-sm text-gray-700">Select a template that matches your specialty and appointment type</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-blue-600 uppercase mb-2">Step 2</p>
                  <p className="text-xs sm:text-sm text-gray-700">Customize fields, add sections, and configure validation rules as needed</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-blue-600 uppercase mb-2">Step 3</p>
                  <p className="text-xs sm:text-sm text-gray-700">Review the live preview, then save to deploy your form immediately</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}} />
    </div>
  );
}
