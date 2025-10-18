'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <div className="border-b border-gray-100 bg-white sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 max-w-7xl">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 truncate">Schedule Manager</h1>
              </div>
            </div>
            <Link 
              href={`/doctor/appointments/form?id=${doctorId}`}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition whitespace-nowrap flex-shrink-0"
            >
              <span className="hidden sm:inline">Form Designer</span>
              <span className="sm:hidden">Form</span>
              <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-7xl">
        {/* Top Section - Info + Doctor Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6 md:mb-8">
          {/* Left: Main Title & Description */}
          <div className="lg:col-span-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              Manage Your Schedule
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
              Set your working hours and configure appointment time slots for patient bookings
            </p>
          </div>

          {/* Right: Doctor Info Card */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 sm:p-4 md:p-5">
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1 sm:mb-2">Doctor</p>
            <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-0.5 sm:mb-1 truncate">{doctor?.name}</p>
            <p className="text-xs sm:text-sm text-gray-600 truncate">{doctor?.specialization}</p>
          </div>
        </div>

        {/* Main Schedule Manager Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 md:p-6 shadow-sm mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6">
            <div className="h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Clock className="h-4.5 w-4.5 sm:h-5 sm:w-5 md:h-6 md:w-6 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">Schedule Configuration</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Configure your availability below</p>
            </div>
          </div>
          
          {/* Schedule Manager Component */}
          <div className="w-full">
            <ScheduleManager doctorId={doctorId} />
          </div>
        </div>

        {/* Quick Tips Section */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 sm:p-4 md:p-6">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-blue-900 mb-2 sm:mb-3 md:mb-4">💡 Quick Tips</h3>
          <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-blue-800">
            <li className="flex gap-2">
              <span className="font-bold flex-shrink-0">•</span>
              <span>Set your working hours to define when appointments can be booked</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold flex-shrink-0">•</span>
              <span>Configure slot duration to control appointment length and spacing</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold flex-shrink-0">•</span>
              <span>Add breaks to exclude lunch time or other unavailable periods</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold flex-shrink-0">•</span>
              <span>Save your configuration to apply changes for patient bookings</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
