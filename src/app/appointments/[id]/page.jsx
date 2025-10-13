
import { getAppointmentById } from '@/services/appointmentService';
import { notFound } from 'next/navigation';
import { AppointmentDetailsClient } from '@/components/appointment-details-client';

export default async function AppointmentDetailsPage({ params }) {
  const appointment = await getAppointmentById(params.id);

  if (!appointment) {
    notFound();
  }

  // Convert Firestore Timestamps to plain objects for client components
  const serializedAppointment = {
    ...appointment,
    appointmentDate: appointment.appointmentDate?.toDate?.() || appointment.appointmentDate,
    createdAt: appointment.createdAt?.toDate?.() || appointment.createdAt,
    lastUpdated: appointment.lastUpdated?.toDate?.() || appointment.lastUpdated,
  };

  // Pass role="user" for the public-facing page
  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-6 lg:mb-8">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">
            Appointment Details
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
            View and manage your appointment information
          </p>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="max-w-4xl mx-auto">
        <AppointmentDetailsClient appointment={serializedAppointment} role="user" />
      </div>
    </div>
  );
}
