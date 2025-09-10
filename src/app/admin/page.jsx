
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Stethoscope, Users, Activity, TrendingUp, TrendingDown, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAppointments } from '@/services/appointmentService';
import { getDoctors } from '@/services/doctorService';
import { getUniquePatients } from '@/services/patientService';

async function getDashboardStats() {
  try {
    const [appointments, doctors, patients] = await Promise.all([
      getAppointments(),
      getDoctors(),
      getUniquePatients()
    ]);

    const totalAppointments = appointments.length;
    const scheduledAppointments = appointments.filter(a => a.status === 'scheduled').length;
    const completedAppointments = appointments.filter(a => a.status === 'completed').length;
    const activeDoctors = doctors.filter(d => d.isActive !== false).length;
    const totalPatients = patients.length;

    // Calculate clinic occupancy (simplified)
    const occupancyRate = totalAppointments > 0 ? Math.round((scheduledAppointments / totalAppointments) * 100) : 0;

    return {
      totalAppointments,
      scheduledAppointments,
      completedAppointments,
      activeDoctors,
      totalPatients,
      occupancyRate
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalAppointments: 0,
      scheduledAppointments: 0,
      completedAppointments: 0,
      activeDoctors: 0,
      totalPatients: 0,
      occupancyRate: 0
    };
  }
}

const stats = [
  {
    title: "Total Appointments",
    value: "1,250",
    icon: Calendar,
    description: "+20.1% from last month",
    href: "/admin/appointments",
    trend: "up",
    color: "blue"
  },
  {
    title: "Active Doctors",
    value: "24",
    icon: Stethoscope,
    description: "Currently available specialists",
    href: "/admin/doctors",
    trend: "up",
    color: "green"
  },
  {
    title: "New Patients",
    value: "89",
    icon: Users,
    description: "+15.2% this month",
    href: "/admin/patients",
    trend: "up",
    color: "purple"
  },
  {
    title: "Clinic Occupancy",
    value: "72%",
    icon: Activity,
    description: "Based on scheduled appointments",
    href: "#",
    trend: "neutral",
    color: "orange"
  }
]

export default async function AdminDashboardPage() {
  const dashboardData = await getDashboardStats();

  const enhancedStats = stats.map(stat => ({
    ...stat,
    value: stat.title === "Total Appointments" ? dashboardData.totalAppointments.toLocaleString() :
           stat.title === "Active Doctors" ? dashboardData.activeDoctors.toString() :
           stat.title === "New Patients" ? dashboardData.totalPatients.toString() :
           stat.title === "Clinic Occupancy" ? `${dashboardData.occupancyRate}%` :
           stat.value
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="space-y-6 md:space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-start sm:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground mt-1">Welcome back! Here's what's happening with your clinic.</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button variant="outline" className="border-2 hover:bg-gray-50 transition-all duration-200 shadow-sm w-full sm:w-auto" asChild>
              <Link href="/admin/appointments">
                <Calendar className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">View Appointments</span>
                <span className="sm:hidden">Appointments</span>
              </Link>
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto" asChild>
              <Link href="/admin/doctors/new">
                <Stethoscope className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Add Doctor</span>
                <span className="sm:hidden">Add Doctor</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {enhancedStats.map(stat => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === 'up' ? TrendingUp : stat.trend === 'down' ? TrendingDown : Clock;

            return (
              <Card key={stat.title} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50 hover:-translate-y-1">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
                  stat.color === 'blue' ? 'from-blue-500 to-blue-600' :
                  stat.color === 'green' ? 'from-green-500 to-green-600' :
                  stat.color === 'purple' ? 'from-purple-500 to-purple-600' :
                  'from-orange-500 to-orange-600'
                }`} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 sm:p-3 rounded-xl shadow-lg ${
                    stat.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' :
                    stat.color === 'green' ? 'bg-gradient-to-br from-green-500 to-green-600 text-white' :
                    stat.color === 'purple' ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white' :
                    'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
                  }`}>
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0 p-4 sm:p-6">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="flex items-center gap-2 text-xs mb-3">
                    <Badge variant={stat.trend === 'up' ? 'default' : stat.trend === 'down' ? 'destructive' : 'secondary'} className="text-xs px-2 py-1">
                      <TrendIcon className="w-3 h-3 mr-1" />
                      {stat.description}
                    </Badge>
                  </div>
                  {stat.href !== '#' && (
                    <Link href={stat.href} className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors inline-block">
                      View details →
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Quick Actions */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50 border-b border-gray-200 p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Quick Actions</CardTitle>
                  <CardDescription className="text-sm sm:text-base text-muted-foreground mt-1">Common administrative tasks</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <Button variant="outline" className="w-full justify-start h-10 sm:h-12 border-2 hover:bg-green-50 hover:border-green-300 transition-all duration-200" asChild>
                <Link href="/admin/doctors/new">
                  <Stethoscope className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">Add New Doctor</span>
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start h-10 sm:h-12 border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200" asChild>
                <Link href="/admin/appointments">
                  <Calendar className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">Manage Appointments</span>
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start h-10 sm:h-12 border-2 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200" asChild>
                <Link href="/admin/patients">
                  <Users className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">View Patient Records</span>
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-gray-200 p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">System Status</CardTitle>
                  <CardDescription className="text-sm sm:text-base text-muted-foreground mt-1">Current system health and metrics</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-sm font-medium text-gray-900">Server Status</span>
                <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300 px-2 sm:px-3 py-1">Online</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-sm font-medium text-gray-900">Database</span>
                <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300 px-2 sm:px-3 py-1">Connected</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-sm font-medium text-gray-900">Last Backup</span>
                <span className="text-sm text-muted-foreground font-medium">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-sm font-medium text-gray-900">Active Sessions</span>
                <span className="text-sm font-bold text-blue-600">12</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
