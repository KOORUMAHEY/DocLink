import { getAppointmentsByDoctor } from '@/services/appointmentService';
import { getDoctorById } from '@/services/doctorService';
import { notFound } from 'next/navigation';
import { DoctorAppointmentsClient } from '@/components/doctor-appointments-client';

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


export default function DoctorAppointmentsPage({ searchParams }) {
  const doctorId = searchParams.id;

  if (!doctorId) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Doctor not specified. Please log in again.</p>
      </div>
    )
  }

  return <DoctorAppointmentsContent doctorId={doctorId} />;
}
