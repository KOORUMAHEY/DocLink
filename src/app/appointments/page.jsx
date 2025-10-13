import { getAppointments } from '@/features/appointments/services/appointmentService';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AppointmentSearch } from '@/features/appointments/components/AppointmentSearch';
import { IconBookAppointment } from '@/components/icons/icon-book-appointment';
import { IconDoctorAccess } from '@/components/icons/icon-doctor-access';
import { Calendar, Clock, Plus, Search, TrendingUp, Users } from 'lucide-react';
import { AppointmentsPageClient } from '@/features/appointments/components/AppointmentsPageClient';
import { ROUTES } from '@/config/routes';

export default async function AppointmentsPage({ searchParams }) {
  const params = await searchParams;
  const searchQuery = params?.query;

  let appointments = [];
  let hasSearchQuery = false;

  if (searchQuery) {
    hasSearchQuery = true;
    appointments = await getAppointments({ searchQuery });
  }

  // Convert Firestore Timestamps to plain objects for client components
  const serializedAppointments = appointments.map(appointment => ({
    ...appointment,
    appointmentDate: appointment.appointmentDate?.toDate?.() || appointment.appointmentDate,
    createdAt: appointment.createdAt?.toDate?.() || appointment.createdAt,
    lastUpdated: appointment.lastUpdated?.toDate?.() || appointment.lastUpdated,
  }));

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Enhanced Page Header */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        <div className="relative p-8 lg:p-12">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
            {/* Left Content */}
            <div className="space-y-6 flex-1">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-2">
                    Your Appointments
                  </h1>
                  <p className="text-blue-100 text-lg leading-relaxed max-w-2xl mb-4">
                    <span className="font-semibold text-white">Search your existing appointments</span> using the form below or{' '}
                    <span className="font-semibold text-white">book a new appointment</span> with our expert doctors.
                  </p>
                  {/* <div className="flex flex-col sm:flex-row gap-3 text-sm">
                    <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-green-400/30">
                      <Search className="h-4 w-4 text-green-300" />
                      <span className="text-green-100 font-medium">Search existing appointments below ↓</span>
                    </div>
                    <div className="flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-yellow-400/30">
                      <Plus className="h-4 w-4 text-yellow-300" />
                      <span className="text-yellow-100 font-medium">Book new appointment here →</span>
                    </div>
                  </div> */}
                </div>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <Clock className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">Real-time Updates</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <IconDoctorAccess className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">Expert Care</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <Search className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">Easy Search</span>
                </div>
              </div>
            </div>

            {/* Right Action */}
            <div className="w-full xl:w-auto flex flex-col gap-4">
              <Button 
                asChild 
                size="lg"
                className="w-full xl:w-auto bg-white hover:bg-gray-50 text-blue-700 shadow-2xl hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg font-bold rounded-xl border-2 border-white/20 hover:scale-105"
              >
                <Link href="/appointments/book" className="flex items-center justify-center gap-3">
                  <IconBookAppointment className="h-6 w-6" />
                  <span>Book New Appointment</span>
                  <Plus className="h-5 w-5" />
                </Link>
              </Button>
              <p className="text-center text-white/80 text-sm">
                Click here to schedule with our doctors
              </p>
            </div>
          </div>

          {/* Search Section - Integrated in Header */}
          <div className="mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20">
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Search className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Search Your Appointments Here</h2>
                    <p className="text-sm text-gray-600">Enter patient name, phone number, or Hospital ID to find appointments</p>
                  </div>
                </div>
                <AppointmentSearch />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">Total Patients</p>
                  <p className="text-2xl font-bold text-white">2,500+</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <IconDoctorAccess className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">Expert Doctors</p>
                  <p className="text-2xl font-bold text-white">150+</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">Success Rate</p>
                  <p className="text-2xl font-bold text-white">98%</p>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Results Section with Auto-Scroll */}
      <AppointmentsPageClient 
        appointments={serializedAppointments}
        hasSearchQuery={hasSearchQuery}
      />

      {/* Empty State - Show when no search query */}
      {!hasSearchQuery && (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
          <CardContent className="text-center py-16 px-6">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Search className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Find Your Appointments?</h3>
              <p className="text-gray-600 mb-2 leading-relaxed">
                Use the search form above to find your existing appointments
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Enter patient name, phone number (10 digits), or Hospital ID to search
              </p>
              
              <div className="flex flex-col gap-4 justify-center">
                <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                  <div className="flex items-center justify-center gap-2 text-blue-700 mb-2">
                    <Search className="h-5 w-5" />
                    <span className="font-semibold">Quick Search Tips:</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1 text-left">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      Try searching: "Alice Johnson" or "Bob Williams"
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      Use 10-digit phone: "1234567890"
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      Hospital ID format: "1232" (4 digits)
                    </li>
                  </ul>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">Or start fresh with a new appointment</p>
                  <Button 
                    asChild 
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Link href={ROUTES.APPOINTMENTS.BOOK} className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Book New Appointment
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Features List */}
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                  <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Quick Booking</p>
                    <p className="text-sm text-gray-600">Schedule in minutes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Expert Doctors</p>
                    <p className="text-sm text-gray-600">Qualified specialists</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
