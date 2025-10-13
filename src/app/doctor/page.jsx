
import { getAppointmentsByDoctor } from '@/features/appointments/services/appointmentService';
import { getDoctorById } from '@/features/doctors';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Activity, CheckCircle, Stethoscope, Plus } from 'lucide-react';
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
    <div className="p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg animate-in fade-in slide-in-from-top-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, Dr. {doctor.name}!</h1>
            <p className="text-blue-100">Here's what's happening with your practice today.</p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200 cursor-pointer">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white hover:-translate-y-1 cursor-pointer group animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors duration-200">
                    <Icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mb-3">{stat.description}</div>
                  <div className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center group-hover:translate-x-1 transform duration-200">
                    View details →
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg bg-white animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '400ms' }}>
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Quick Actions</CardTitle>
              <CardDescription className="text-base text-muted-foreground mt-1">Common tasks for managing your practice</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button variant="outline" className="h-16 border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 justify-start group" asChild>
              <Link href={`/doctor/appointments/form?id=${doctorId}`}>
                <Plus className="mr-3 h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-left">
                  <div className="font-semibold">Book Appointment</div>
                  <div className="text-sm text-muted-foreground">Schedule new patient visit</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-16 border-2 hover:bg-green-50 hover:border-green-300 transition-all duration-200 justify-start group" asChild>
              <Link href={`/doctor/appointments?id=${doctorId}`}>
                <Calendar className="mr-3 h-6 w-6 text-green-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-left">
                  <div className="font-semibold">View Appointments</div>
                  <div className="text-sm text-muted-foreground">Check today's schedule</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-16 border-2 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 justify-start group" asChild>
              <Link href={`/doctor/patients?id=${doctorId}`}>
                <Users className="mr-3 h-6 w-6 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-left">
                  <div className="font-semibold">Manage Patients</div>
                  <div className="text-sm text-muted-foreground">Update patient records</div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today's Appointments Preview */}
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Today's Appointments</CardTitle>
                <CardDescription className="text-base text-muted-foreground mt-1">Your schedule for today</CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/doctor/appointments?id=${doctorId}`}>
                View All
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {appointments.filter(a => {
            const today = new Date().toDateString();
            return new Date(a.appointmentDate).toDateString() === today;
          }).length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-muted-foreground">No appointments scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.filter(a => {
                const today = new Date().toDateString();
                return new Date(a.appointmentDate).toDateString() === today;
              }).slice(0, 3).map((appt) => (
                <div key={appt.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {appt.patientName?.charAt(0)?.toUpperCase() || 'P'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{appt.patientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <Badge variant={appt.status === 'scheduled' ? 'default' : 'secondary'}>
                    {appt.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


export default async function DoctorDashboardPage({ searchParams }) { // eslint-disable-line react/prop-types
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
