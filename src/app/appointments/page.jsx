
import { getAppointments } from '@/services/appointmentService';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AppointmentSearch } from '@/components/appointment-search';
import { IconBookAppointment } from '@/components/icons/icon-book-appointment';
import { IconDoctorAccess } from '@/components/icons/icon-doctor-access';
import { Calendar, Clock } from 'lucide-react';
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

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:p-8">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div className="space-y-4 w-full xl:w-auto">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="h-6 w-6 text-slate-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Appointments</h1>
                <p className="text-gray-600 mt-1">Manage and track your healthcare appointments</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Real-time updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <IconDoctorAccess className="h-4 w-4" />
                <span>Expert care</span>
              </div>
            </div>
          </div>
          <div className="w-full xl:w-auto flex justify-center xl:justify-end">
            <Button asChild className="w-full xl:w-auto bg-slate-900 hover:bg-slate-800 text-white shadow-sm px-6 py-3 block xl:hidden">
              <Link href="/appointments/book" className="flex items-center justify-center font-medium">
                <IconBookAppointment className="mr-2 h-4 w-4" />
                <span>Book New Appointment</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <AppointmentSearch />
      </div>

      {/* Results Section */}
      {hasSearchQuery ? (
        <AppointmentsDisplay appointments={appointments} />
      ) : (
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="text-center py-16">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconBookAppointment className="h-10 w-10 text-slate-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Search Your Appointments</h3>
            <p className="text-gray-600 mb-1">Find your appointments by patient name, doctor, or date</p>
            <p className="text-gray-500 text-sm mb-6">Use the search bar above to get started</p>
            <Button asChild variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
              <Link href="/appointments/book" className="flex items-center font-medium">
                <IconBookAppointment className="mr-2 h-4 w-4" />
                Book Your First Appointment
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
