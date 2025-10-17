'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ScheduleManager from '@/components/schedule-manager';
import { getDoctorById } from '@/features/doctors';
import { 
  Calendar, 
  Loader2,
  User,
  ArrowRight,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function SchedulePage() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('id');
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (doctorId) {
          const doctorData = await getDoctorById(doctorId);
          setDoctor(doctorData);
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading schedule manager...</p>
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
              <Calendar className="h-5 w-5" />
              Doctor ID Required
            </CardTitle>
            <CardDescription>
              Please provide a doctor ID to access the schedule manager.
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section - Full Width */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Calendar className="h-8 w-8 text-emerald-600" />
                </div>
                Schedule Manager
              </h1>
              <p className="text-gray-600 mt-1 text-sm">
                Configure your availability and appointment time slots
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-gray-900">{doctor.name}</span>
              </div>
              <Badge variant="outline" className="text-xs px-2 py-1">
                {doctor.specialization}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Navigation to Form Page */}
        <div className="mb-8 flex justify-end">
          <Link 
            href={`/doctor/appointments/form?id=${doctorId}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-medium"
          >
            <span>Go to Form Designer</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Schedule Info Banner */}
        <Card className="mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl">📅</div>
                <div>
                  <h3 className="font-semibold text-emerald-900">
                    Availability Management
                  </h3>
                  <p className="text-emerald-700 text-sm">Set your working hours, breaks, and holidays</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-emerald-700">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Configure time slots</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Manager - Full Width */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Calendar className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Configure Your Schedule</h2>
              <p className="text-sm text-gray-600">Set working hours, breaks, and holidays for your appointments</p>
            </div>
          </div>

          <ScheduleManager doctorId={doctorId} />
        </div>

        {/* Help Section - Full Width */}
        <Card className="mt-12 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-900">
              <Clock className="h-5 w-5 text-emerald-600" />
              Schedule Setup Guide
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded-lg p-4 border border-emerald-100">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1 bg-emerald-100 rounded">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">1. Set Working Hours</h4>
                    <p className="text-xs text-gray-600">Define your availability for each day of the week</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-emerald-100">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1 bg-emerald-100 rounded">
                    <Clock className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">2. Add Time Slots</h4>
                    <p className="text-xs text-gray-600">Configure slot duration and spacing between appointments</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-emerald-100">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1 bg-emerald-100 rounded">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">3. Configure Breaks</h4>
                    <p className="text-xs text-gray-600">Add lunch breaks and other unavailable times</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
