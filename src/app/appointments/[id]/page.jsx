
import { getAppointmentById } from '@/services/appointmentService';
import { notFound } from 'next/navigation';
import { AppointmentDetailsClient } from '@/components/appointment-details-client';

export default async function AppointmentDetailsPage({ params }) {
  const appointment = await getAppointmentById(params.id);

  if (!appointment) {
    notFound();
  }

  // Pass role="user" for the public-facing page
  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Details</h2>
        <p className="text-gray-600">View and manage your appointment information</p>
      </div>

      {/* Appointment Details */}
      <AppointmentDetailsClient appointment={appointment} role="user" />
    </div>
  );
}
