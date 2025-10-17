import { getAppointments } from '@/features/appointments/services/appointmentService';
import { serializeAppointments } from '@/lib/firestore-serializer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AppointmentSearch } from '@/features/appointments/components/AppointmentSearch';
import { IconBookAppointment } from '@/components/icons/icon-book-appointment';
import { IconDoctorAccess } from '@/components/icons/icon-doctor-access';
import { Calendar, Clock, Plus, Search, TrendingUp, Users, CheckCircle2, AlertCircle, Zap, Phone, Stethoscope, Shield } from 'lucide-react';
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
  const serializedAppointments = serializeAppointments(appointments);

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-gray-900 font-semibold">Appointments</span>
      </div>

      {/* Main Header Section */}
      <div className="space-y-6">
        {/* Creative Hero Section - Compact */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl">
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full -mr-24 sm:-mr-32 -mt-24 sm:-mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/5 rounded-full -ml-24 sm:-ml-32 -mb-24 sm:-mb-32 blur-3xl"></div>
          
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center">
            {/* Left Content */}
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-block">
                <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-semibold backdrop-blur-sm border border-white/30">
                  ✨ Appointment Management
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white leading-tight">
                Your Health,
                <span className="block text-blue-100">Our Commitment</span>
              </h1>
              
              <p className="text-xs sm:text-sm lg:text-base text-blue-100 leading-relaxed max-w-md">
                Search your existing appointments or book with our healthcare professionals.
              </p>

              {/* Stats Line */}
              <div className="flex flex-wrap gap-3 sm:gap-4 lg:gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white/80 text-xs">Trusted by</p>
                    <p className="text-white font-bold text-xs sm:text-sm">10,000+</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-300" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white/80 text-xs">Success Rate</p>
                    <p className="text-white font-bold text-xs sm:text-sm">98%</p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <Button 
                  asChild 
                  size="sm"
                  className="bg-white hover:bg-gray-50 text-blue-600 font-bold px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
                >
                  <Link href={ROUTES.APPOINTMENTS.BOOK} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Book Appointment</span>
                    <span className="sm:hidden">Book Now</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Visual Element - Hidden on Mobile, Responsive on Desktop */}
            <div className="relative hidden sm:block">
              <div className="space-y-2 sm:space-y-3">
                {/* Floating Card 1 */}
                <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20 transform hover:scale-105 transition-transform hover:shadow-2xl group">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-green-400/20 rounded-lg group-hover:bg-green-400/40 transition-colors flex-shrink-0">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-green-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white/80 text-xs">Quick Booking</p>
                      <p className="text-white font-bold text-xs sm:text-sm truncate">In 5 Minutes</p>
                    </div>
                  </div>
                </div>

                {/* Floating Card 2 */}
                <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20 transform hover:scale-105 transition-transform hover:shadow-2xl group sm:ml-4 lg:ml-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-blue-400/20 rounded-lg group-hover:bg-blue-400/40 transition-colors flex-shrink-0">
                      <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white/80 text-xs">Expert Doctors</p>
                      <p className="text-white font-bold text-xs sm:text-sm truncate">150+ Specialists</p>
                    </div>
                  </div>
                </div>

                {/* Floating Card 3 */}
                <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20 transform hover:scale-105 transition-transform hover:shadow-2xl group">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-purple-400/20 rounded-lg group-hover:bg-purple-400/40 transition-colors flex-shrink-0">
                      <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-purple-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white/80 text-xs">100% Secure</p>
                      <p className="text-white font-bold text-xs sm:text-sm truncate">HIPAA Compliant</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section - Prominent and Clear */}
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 lg:p-10 border-2 border-blue-200/50 shadow-lg">
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-blue-600 rounded-lg flex-shrink-0">
                <Search className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Find Your Appointments</h2>
                <p className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1">Enter patient name, phone number, or Hospital ID</p>
              </div>
            </div>
          </div>

          {/* Search Form */}
          {/* <div className="bg-white/30 rounded-xl sm:rounded-2xl sm:p-6 shadow-sm"> */}
            <AppointmentSearch />
          {/* </div> */}
        </div>
      </div>

      {/* Results Section with Auto-Scroll */}
      <AppointmentsPageClient 
        appointments={serializedAppointments}
        hasSearchQuery={hasSearchQuery}
      />

      {/* Empty State - Show when no search query */}
      {!hasSearchQuery && (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden rounded-2xl">
          <CardContent className="text-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
              {/* Icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg">
                <Calendar className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
              </div>

              {/* Heading */}
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                No Appointments Yet
              </h3>

              {/* Description */}
              <p className="text-base sm:text-lg text-gray-600 mb-2 leading-relaxed">
                Use the search form above to find your existing appointments or create a new one.
              </p>

              {/* Stats */}
              {/* <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 my-8 sm:my-12">
                <div className="p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">1000+</div>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Monthly Appointments</p>
                </div>
                <div className="p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-xl sm:text-2xl font-bold text-green-600 mb-1">98%</div>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Patient Satisfaction</p>
                </div>
                <div className="p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 col-span-2 sm:col-span-1">
                  <div className="text-xl sm:text-2xl font-bold text-purple-600 mb-1">24/7</div>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Support Available</p>
                </div>
              </div> */}

              {/* CTA Section */}
              <div className="space-y-4 mb-8">
                <div className="p-4 sm:p-6 bg-blue-50 border-2 border-blue-200 rounded-xl sm:rounded-2xl">
                  <div className="flex items-center justify-center gap-2 text-blue-700 mb-3">
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="font-bold text-sm sm:text-base lg:text-lg">Quick Start</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 mb-4 leading-relaxed">
                    Don't have an existing appointment? Book one now with our experienced healthcare professionals.
                  </p>
                  <Button 
                    asChild 
                    size="sm"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-bold text-xs sm:text-sm"
                  >
                    <Link href={ROUTES.APPOINTMENTS.BOOK} className="flex items-center justify-center gap-2">
                      <Plus className="h-4 w-4" />
                      Book Your First Appointment
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Features */}
              {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-left">
                <div className="flex flex-col items-center sm:items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
                  <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Quick Booking</p>
                    <p className="text-xs text-gray-600 mt-0.5 sm:mt-1">Schedule in under 5 minutes</p>
                  </div>
                </div>

                <div className="flex flex-col items-center sm:items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
                  <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Expert Doctors</p>
                    <p className="text-xs text-gray-600 mt-0.5 sm:mt-1">Verified healthcare professionals</p>
                  </div>
                </div>

                <div className="flex flex-col items-center sm:items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
                  <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Instant Confirmation</p>
                    <p className="text-xs text-gray-600 mt-0.5 sm:mt-1">Get confirmations via SMS & email</p>
                  </div>
                </div>
              </div> */}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
