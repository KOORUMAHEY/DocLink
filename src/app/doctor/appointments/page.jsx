import { getAppointmentsByDoctor } from '@/services/appointmentService';
import { getDoctorById } from '@/services/doctorService';
import { notFound } from 'next/navigation';
import { DoctorAppointmentsClient } from '@/components/doctor-appointments-client';
import { Suspense } from 'react';
import { Calendar, Users } from 'lucide-react';

async function DoctorAppointmentsContent({ doctorId }) {
  const [doctor, appointments] = await Promise.all([
    getDoctorById(doctorId),
    getAppointmentsByDoctor(doctorId)
  ]);

  if (!doctor) {
    notFound();
  }

  return <DoctorAppointmentsClient doctor={doctor} initialAppointments={appointments} />;
}

export default async function DoctorAppointmentsPage({ searchParams }) {
  const params = await searchParams;
  const doctorId = params.id;

  if (!doctorId) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="p-3 sm:p-4 bg-gradient-to-br from-red-100 to-red-200 rounded-full mb-4 sm:mb-6">
            <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-red-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Doctor Not Specified</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md">
            Please log in again to access your appointments. The doctor ID is required to load your appointments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-white animate-pulse" />
          </div>
          <div>
            <div className="h-6 sm:h-8 bg-gray-300 rounded w-32 sm:w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-48 sm:w-64 animate-pulse mt-2"></div>
          </div>
        </div>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="h-24 sm:h-32 bg-white rounded-xl shadow-lg animate-pulse"></div>
          <div className="h-24 sm:h-32 bg-white rounded-xl shadow-lg animate-pulse"></div>
          <div className="h-24 sm:h-32 bg-white rounded-xl shadow-lg animate-pulse"></div>
          <div className="h-24 sm:h-32 bg-white rounded-xl shadow-lg animate-pulse"></div>
        </div>
        <div className="h-80 sm:h-96 bg-white rounded-xl shadow-lg animate-pulse"></div>
      </div>
    }>
      <DoctorAppointmentsContent doctorId={doctorId} />
    </Suspense>
  );
}
