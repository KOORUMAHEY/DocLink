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
  CheckCircle2,
  Monitor,
  Palette,
  Download,
  Share2
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30">
      {/* Clean Header */}
      <div className="border-b border-gray-100 bg-white sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 max-w-7xl">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 truncate">Form Designer</h1>
              </div>
            </div>
            <Link 
              href={`/doctor/appointments/schedule?id=${doctorId}`}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition whitespace-nowrap flex-shrink-0"
            >
              <span className="hidden sm:inline">Schedule</span>
              <span className="sm:hidden">Schedule</span>
              <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-10 max-w-7xl">
        {/* Page Header with Actions */}
        <div className="flex flex-col gap-2 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <div className="h-1 w-6 sm:w-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
              <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-slate-900">Appointment Form</h2>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-slate-600">Design and customize your patient appointment collection form</p>
          </div>
        </div>

        {/* Enhanced Template Info Card */}
        {formConfig && (
          <div className="mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 rounded-2xl p-4 sm:p-6 md:p-8 text-white relative overflow-hidden shadow-lg">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-20 sm:w-40 h-20 sm:h-40 bg-white/10 rounded-full -mr-10 sm:-mr-20 -mt-10 sm:-mt-20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-20 sm:w-40 h-20 sm:h-40 bg-white/10 rounded-full -ml-10 sm:-ml-20 -mb-10 sm:-mb-20 blur-3xl" />
            
            <div className="relative z-10 flex flex-col gap-3 sm:gap-4">
              <div className="flex items-start gap-2 sm:gap-4 min-w-0">
                <div className="text-3xl sm:text-4xl md:text-5xl flex-shrink-0">{currentTemplate?.icon}</div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg md:text-2xl font-bold mb-0.5 sm:mb-1 leading-tight">
                    {currentTemplate?.name}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-blue-100 mb-2 sm:mb-3 md:mb-4">{currentTemplate?.description}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 md:gap-6 text-xs sm:text-sm">
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/20 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 w-fit">
                      <Grid3x3 className="h-3 sm:h-4 w-3 sm:w-4 text-blue-200" />
                      <span className="font-semibold">{formConfig?.customSections?.length || currentTemplate?.sections?.length || 0} Sections</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/20 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 w-fit">
                      <FileText className="h-3 sm:h-4 w-3 sm:w-4 text-blue-200" />
                      <span className="font-semibold">{formConfig?.customSections?.reduce((acc, sec) => acc + (sec?.fields?.length || 0), 0) || 0} Fields</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sm:text-right">
                <Badge className="bg-green-400 text-green-900 border-0 font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">✓ Published</Badge>
                <p className="text-xs text-blue-100">Last updated today</p>
              </div>
            </div>
          </div>
        )}

        {/* Designer Section */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          {/* Section Header */}
          <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
              <div className="flex items-center justify-center h-9 sm:h-10 md:h-12 w-9 sm:w-10 md:w-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200 flex-shrink-0">
                <Wand2 className="h-4 sm:h-5 md:h-6 w-4 sm:w-5 md:w-6 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900">Form Designer</h3>
                <p className="text-xs sm:text-sm text-slate-500">Customize and arrange your form fields</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs font-semibold border-blue-200 bg-blue-50 text-blue-700 w-fit sm:text-sm">v2.0 Pro</Badge>
          </div>

          {/* Designer Component Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 md:p-8 shadow-sm hover:shadow-md transition w-full">
            <AdvancedTemplateDesigner 
              doctorId={doctorId} 
              onFormConfigChange={handleFormConfigChange}
            />
          </div>
        </div>

        {/* Features Grid Section */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="mb-3 sm:mb-4 md:mb-6">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
              <Sparkles className="h-4 sm:h-5 w-4 sm:w-5 text-yellow-500" />
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900">Powerful Features</h3>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-slate-600">Everything you need to create professional appointment forms</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {[
              { icon: Wand2, color: 'blue', title: 'Drag & Drop Editor', desc: 'Intuitive form builder without coding' },
              { icon: Monitor, color: 'emerald', title: 'Real-time Preview', desc: 'See your form instantly as you design' },
              { icon: Palette, color: 'purple', title: 'Custom Templates', desc: 'Professional templates for all specialties' },
              { icon: CheckCircle2, color: 'pink', title: 'Validation Rules', desc: 'Set required fields and constraints' },
              { icon: Share2, color: 'orange', title: 'Multi-channel Sync', desc: 'Synchronize across all platforms' },
              { icon: Download, color: 'cyan', title: 'Data Export', desc: 'Export responses in multiple formats' },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              const colorClasses = {
                blue: 'from-blue-100 to-blue-50 text-blue-600 border-blue-200',
                emerald: 'from-emerald-100 to-emerald-50 text-emerald-600 border-emerald-200',
                purple: 'from-purple-100 to-purple-50 text-purple-600 border-purple-200',
                pink: 'from-pink-100 to-pink-50 text-pink-600 border-pink-200',
                orange: 'from-orange-100 to-orange-50 text-orange-600 border-orange-200',
                cyan: 'from-cyan-100 to-cyan-50 text-cyan-600 border-cyan-200',
              };
              const classes = colorClasses[feature.color];
              return (
                <div key={feature.title} className="group p-3 sm:p-4 md:p-6 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition">
                  <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                    <div className={`h-9 sm:h-10 md:h-12 w-9 sm:w-10 md:w-12 rounded-lg bg-gradient-to-br ${classes} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition`}>
                      <Icon className="h-4 sm:h-5 md:h-6 w-4 sm:w-5 md:w-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-slate-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1">{feature.title}</h4>
                      <p className="text-xs md:text-sm text-slate-600">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-6">
            <div className="flex items-start gap-2 sm:gap-4 md:gap-6">
              <div className="flex-shrink-0">
                <div className="h-10 sm:h-12 md:h-14 w-10 sm:w-12 md:w-14 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md">
                  <Sparkles className="h-5 sm:h-6 md:h-7 w-5 sm:w-6 md:w-7 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 mb-3 sm:mb-4 md:mb-6">Quick Start Guide</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  {[
                    { num: '1', title: 'Choose Template', desc: 'Select a pre-built template for your specialty' },
                    { num: '2', title: 'Customize Fields', desc: 'Add, remove, or modify fields to your needs' },
                    { num: '3', title: 'Deploy Form', desc: 'Review and publish your form instantly' },
                  ].map((step) => (
                    <div key={step.num} className="flex gap-2 sm:gap-3">
                      <div className="h-7 sm:h-8 w-7 sm:w-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0 text-white font-bold text-xs sm:text-sm shadow-md">
                        {step.num}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-slate-900 text-xs sm:text-sm md:text-base mb-0.5">{step.title}</h4>
                        <p className="text-xs md:text-sm text-slate-600">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 sm:mt-10 md:mt-12 text-center">
          <p className="text-xs sm:text-sm text-slate-600 inline-flex items-center justify-center gap-2">
            <span className="inline-block w-1 h-1 rounded-full bg-blue-600" />
            <span>Powered by DocLink • Professional Appointment Management</span>
            <span className="inline-block w-1 h-1 rounded-full bg-blue-600" />
          </p>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { 
          background: #cbd5e1; 
          border-radius: 4px; 
        }
        ::-webkit-scrollbar-thumb:hover { 
          background: #94a3b8; 
        }
      `}} />
    </div>
  );
}
