
import { getAppointmentById } from '@/services/appointmentService';
import { notFound } from 'next/navigation';
import { AppointmentDetailsClient } from '@/components/appointment-details-client';

export default async function AppointmentDetailsPage({ params }) {
  const appointment = await getAppointmentById(params.id);

  if (!appointment) {
    notFound();
  }

  // Pass role="user" for the public-facing page
  return <AppointmentDetailsClient appointment={appointment} role="user" />;
}
