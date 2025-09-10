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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="p-4 bg-gradient-to-br from-red-100 to-red-200 rounded-full mb-6">
              <Calendar className="h-12 w-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Doctor Not Specified</h2>
            <p className="text-muted-foreground max-w-md">
              Please log in again to access your appointments. The doctor ID is required to load your appointments.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30 p-6 lg:p-8">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
              <Calendar className="h-8 w-8 text-white animate-pulse" />
            </div>
            <div>
              <div className="h-8 bg-gray-300 rounded w-48 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-64 animate-pulse mt-2"></div>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-white rounded-xl shadow-lg animate-pulse"></div>
            ))}
          </div>
          <div className="h-96 bg-white rounded-xl shadow-lg animate-pulse"></div>
        </div>
      </div>
    }>
      <DoctorAppointmentsContent doctorId={doctorId} />
    </Suspense>
  );
}
