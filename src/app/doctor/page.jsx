
import { getAppointmentsByDoctor } from '@/services/appointmentService';
import { getDoctorById } from '@/services/doctorService';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Activity, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

async function DoctorDashboardContent({ doctorId }) {
  const doctor = await getDoctorById(doctorId);
  if (!doctor) {
    notFound();
  }

  const appointments = await getAppointmentsByDoctor(doctorId);
  const totalAppointments = appointments.length;
  const scheduledAppointments = appointments.filter(a => a.status === 'scheduled').length;
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  // This is a placeholder for unique patients from appointments
  const uniquePatientIds = new Set(appointments.map(a => a.hospitalId));
  const totalPatients = uniquePatientIds.size;


  const stats = [
    {
      title: "Total Appointments",
      value: totalAppointments,
      icon: Calendar,
      description: "All time appointments",
      href: `/doctor/appointments?id=${doctorId}`
    },
    {
      title: "Upcoming Appointments",
      value: scheduledAppointments,
      icon: Activity,
      description: "Appointments that are scheduled.",
      href: `/doctor/appointments?id=${doctorId}`
    },
    {
      title: "Total Patients Seen",
      value: totalPatients,
      icon: Users,
      description: "Unique patients from appointments",
      href: `/doctor/patients?id=${doctorId}`
    },
    {
      title: "Completed Appointments",
      value: completedAppointments,
      icon: CheckCircle,
      description: "Past appointments that are completed.",
      href: `/doctor/appointments?id=${doctorId}`
    }
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome, {doctor.name}</h1>
      <p className="text-muted-foreground mb-6">Here's a summary of your activity.</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <Link href={stat.href} className="text-sm font-medium text-primary hover:underline mt-2 inline-block">View</Link>
              </CardContent>
            </Card>
        ))}
      </div>
       {/* TODO: Add more dashboard components like recent appointments table */}
    </div>
  )
}


export default function DoctorDashboardPage({ searchParams }) {
    const doctorId = searchParams.id;
    if (!doctorId) {
        return <p>Doctor ID is missing. Please login again.</p>
    }
    return (
      <Suspense fallback={<p className="text-center">Loading dashboard...</p>}>
        <DoctorDashboardContent doctorId={doctorId} />
      </Suspense>
    )
}
