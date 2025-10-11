import { getAppointments } from '@/services/appointmentService';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AppointmentSearch } from '@/components/appointment-search';
import { IconBookAppointment } from '@/components/icons/icon-book-appointment';
import { IconDoctorAccess } from '@/components/icons/icon-doctor-access';
import { Calendar, Clock, Plus } from 'lucide-react';
import AppointmentsDisplay from './appointments-display';

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
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 rounded-xl border border-gray-200 shadow-lg p-8 lg:p-10">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div className="space-y-6 w-full xl:w-auto">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-4xl lg:text-5xl font-bold text-white">Appointments</h1>
                <p className="text-blue-100 mt-2 text-lg">Manage and track your healthcare appointments with ease</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span className="font-medium">Real-time updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <IconDoctorAccess className="h-5 w-5" />
                <span className="font-medium">Expert care</span>
              </div>
            </div>
          </div>
          <div className="w-full xl:w-auto flex justify-center xl:justify-end">
            <Button asChild className="w-full xl:w-auto bg-white hover:bg-blue-50 text-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg font-bold rounded-xl border-2 border-white">
              <Link href="/appointments/book" className="flex items-center justify-center font-bold">
                <IconBookAppointment className="mr-3 h-5 w-5" />
                <span>Book New Appointment</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

        {/* Search Section */}
        <div className="rounded-xl border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
          <div className="p-4 sm:p-6">
            <AppointmentSearch />
          </div>
        </div>

        {/* Results Section */}
        {hasSearchQuery ? (
          <AppointmentsDisplay appointments={serializedAppointments} />
        ) : (
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardContent className="text-center py-12 sm:py-16 px-4 sm:px-6">
              <div className="relative mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconBookAppointment className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Search Your Appointments</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-1">Find your appointments by patient name, doctor, or date</p>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">Use the search bar above to get started</p>
              <Button asChild variant="outline" className="border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-blue-600 hover:text-blue-700 shadow-lg hover:shadow-xl">
                <Link href="/appointments/book" className="flex items-center font-medium">
                  <Plus className="mr-3 h-5 w-5" />
                  <span className="hidden sm:inline">Book Your First Appointment</span>
                  <span className="sm:hidden">Book Appointment</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
  );
}
