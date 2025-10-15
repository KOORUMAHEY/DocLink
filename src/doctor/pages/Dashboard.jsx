'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Activity, CheckCircle, TrendingUp, Clock, Bell, Plus, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';
import { getAppointmentsByDoctor } from '@/features/appointments/services/appointmentService';
import { getDoctorById } from '@/features/doctors';
import { Skeleton } from '@/components/ui/skeleton';

export default function DoctorDashboard({ doctorId }) {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [doctorData, appointmentsData] = await Promise.all([
          getDoctorById(doctorId),
          getAppointmentsByDoctor(doctorId)
        ]);
        
        setDoctor(doctorData);
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      loadData();
    }
  }, [doctorId]);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const totalAppointments = appointments.length;
  const scheduledAppointments = appointments.filter(a => a.status === 'scheduled').length;
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  const uniquePatients = new Set(appointments.map(a => a.hospitalId)).size;

  const stats = [
    {
      title: "Total Appointments",
      value: totalAppointments,
      icon: Calendar,
      description: "All time appointments",
      href: `/doctor/appointments?id=${doctorId}`,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600"
    },
    {
      title: "Upcoming",
      value: scheduledAppointments,
      icon: Clock,
      description: "Scheduled appointments",
      href: `/doctor/appointments?id=${doctorId}`,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600"
    },
    {
      title: "Total Patients",
      value: uniquePatients,
      icon: Users,
      description: "Unique patients",
      href: `/doctor/patients?id=${doctorId}`,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600"
    },
    {
      title: "Completed",
      value: completedAppointments,
      icon: CheckCircle,
      description: "Finished appointments",
      href: `/doctor/appointments?id=${doctorId}`,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/10 to-red-500/10",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-600"
    }
  ];

  const upcomingAppointments = appointments
    .filter(a => a.status === 'scheduled')
    .slice(0, 5)
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 p-8 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-4 ring-white/30">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  Welcome back, Dr. {doctor?.name}!
                </h1>
                <p className="text-blue-100 text-lg">{doctor?.specialization}</p>
              </div>
            </div>
            <Link href={`/doctor/appointments?id=${doctorId}`}>
              <Button className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                New Appointment
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.title} href={stat.href}>
                <Card className={`relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm hover:-translate-y-2 cursor-pointer group`}>
                  {/* Animated gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-700">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2.5 rounded-xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-4xl font-bold bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <p className="text-xs text-gray-600">{stat.description}</p>
                    <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:translate-x-1 transition-transform">
                      View details →
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2 mt-8 pb-8">
          {/* Upcoming Appointments */}
          <Card className="shadow-xl border-0">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Upcoming Appointments
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Next {upcomingAppointments.length} scheduled appointments
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {scheduledAppointments} Total
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No upcoming appointments</p>
                  <p className="text-sm text-gray-400 mt-1">Your schedule is clear</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment, index) => (
                    <div
                      key={appointment.id || index}
                      className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
                    >
                      <Avatar className="h-12 w-12 ring-2 ring-white shadow-md group-hover:ring-blue-200 transition-all">
                        <AvatarImage src={appointment.patientAvatar} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold">
                          {appointment.patientName?.charAt(0) || 'P'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                          {appointment.patientName}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.timeSlot}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                        {appointment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
              {upcomingAppointments.length > 0 && (
                <Link href={`/doctor/appointments?id=${doctorId}`}>
                  <Button variant="outline" className="w-full mt-6 border-2 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all">
                    View All Appointments
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats & Actions */}
          <div className="space-y-6">
            {/* Today's Overview */}
            <Card className="shadow-xl border-0">
              <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  Today's Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Appointments Today</p>
                        <p className="text-sm text-gray-500">Scheduled for today</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                      {appointments.filter(a => {
                        const today = new Date().setHours(0,0,0,0);
                        const apptDate = new Date(a.appointmentDate).setHours(0,0,0,0);
                        return apptDate === today;
                      }).length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-500/10">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Success Rate</p>
                        <p className="text-sm text-gray-500">Completed appointments</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      {totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-xl border-0">
              <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
                <CardTitle className="text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-3">
                  <Link href={`/doctor/appointments?id=${doctorId}`}>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule
                    </Button>
                  </Link>
                  <Link href={`/doctor/patients?id=${doctorId}`}>
                    <Button variant="outline" className="w-full border-2 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all">
                      <Users className="w-4 h-4 mr-2" />
                      Patients
                    </Button>
                  </Link>
                  <Link href={`/doctor/profile?id=${doctorId}`}>
                    <Button variant="outline" className="w-full border-2 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 transition-all">
                      <Stethoscope className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                  <Link href={`/doctor/settings?id=${doctorId}`}>
                    <Button variant="outline" className="w-full border-2 hover:bg-gray-100 hover:border-gray-300 transition-all">
                      <Activity className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
