
import { getAppointmentsByDoctor } from '@/services/appointmentService';
import { getDoctorById } from '@/services/doctorService';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Activity, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="space-y-8 p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Welcome, {doctor.name}
                </h1>
                <p className="text-lg text-muted-foreground mt-1">Here's a summary of your activity.</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-2 hover:bg-gray-50 transition-all duration-200 shadow-sm" asChild>
              <Link href={`/doctor/appointments?id=${doctorId}`}>
                <Calendar className="mr-2 h-4 w-4" />
                View Appointments
              </Link>
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200" asChild>
              <Link href={`/doctor/patients?id=${doctorId}`}>
                <Users className="mr-2 h-4 w-4" />
                View Patients
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map(stat => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50 hover:-translate-y-1">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className="p-3 rounded-xl shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mb-3">{stat.description}</div>
                  <Link href={stat.href} className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors inline-block">
                    View details →
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Quick Actions</CardTitle>
                  <CardDescription className="text-base text-muted-foreground mt-1">Common tasks for doctors</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Button variant="outline" className="w-full justify-start h-12 border-2 hover:bg-green-50 hover:border-green-300 transition-all duration-200" asChild>
                <Link href={`/doctor/appointments?id=${doctorId}`}>
                  <Calendar className="mr-3 h-5 w-5" />
                  Manage Appointments
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start h-12 border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200" asChild>
                <Link href={`/doctor/patients?id=${doctorId}`}>
                  <Users className="mr-3 h-5 w-5" />
                  View Patients
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Doctor Credentials */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Doctor Credentials</CardTitle>
                  <CardDescription className="text-base text-muted-foreground mt-1">Your profile and credentials</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-900">Name: <span className="font-bold">{doctor.name}</span></span>
                <span className="text-sm font-medium text-gray-900">Specialization: <span className="font-bold">{doctor.specialization}</span></span>
                <span className="text-sm font-medium text-gray-900">Email: <span className="font-bold">{doctor.email}</span></span>
                <span className="text-sm font-medium text-gray-900">Phone: <span className="font-bold">{doctor.phone}</span></span>
                {/* Add more credentials as needed */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


export default async function DoctorDashboardPage({ searchParams }) {
    const params = await searchParams;
    const doctorId = params.id;
    if (!doctorId) {
        return <p>Doctor ID is missing. Please login again.</p>
    }
    return (
      <Suspense fallback={<p className="text-center">Loading dashboard...</p>}>
        <DoctorDashboardContent doctorId={doctorId} />
      </Suspense>
    )
}
