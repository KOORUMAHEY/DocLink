'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  Users, 
  Activity, 
  CheckCircle, 
  Clock, 
  Bell, 
  Plus, 
  Stethoscope,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  FileText,
  Phone,
  MessageSquare,
  AlertCircle,
  Star,
  CalendarCheck,
  UserCheck,
  Heart
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getAppointmentsByDoctor } from '@/features/appointments/services/appointmentService';
import { getDoctorById } from '@/features/doctors';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={`stats-skeleton-${i}`} className="h-36 w-full rounded-2xl" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-96 lg:col-span-2 rounded-2xl" />
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalAppointments = appointments.length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayAppointments = appointments.filter(a => {
    const apptDate = new Date(a.appointmentDate);
    apptDate.setHours(0, 0, 0, 0);
    return apptDate.getTime() === today.getTime();
  });

  const upcomingAppointments = appointments.filter(a => {
    const apptDate = new Date(a.appointmentDate);
    return apptDate >= today && (a.status === 'scheduled' || a.status === 'confirmed');
  }).sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length;
  
  const uniquePatients = new Set(appointments.map(a => a.patientId || a.patientEmail)).size;
  
  // Calculate weekly comparison
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastWeekAppointments = appointments.filter(a => {
    const apptDate = new Date(a.appointmentDate);
    return apptDate >= lastWeek && apptDate < today;
  }).length;
  
  const thisWeekAppointments = appointments.filter(a => {
    const apptDate = new Date(a.appointmentDate);
    return apptDate >= today;
  }).length;
  
  const weeklyChange = lastWeekAppointments > 0 
    ? ((thisWeekAppointments - lastWeekAppointments) / lastWeekAppointments * 100).toFixed(1)
    : 0;

  const completionRate = totalAppointments > 0 
    ? Math.round((completedAppointments / totalAppointments) * 100)
    : 0;

  const stats = [
    {
      title: "Today's Appointments",
      value: todayAppointments.length,
      change: weeklyChange,
      changeType: weeklyChange >= 0 ? 'increase' : 'decrease',
      icon: Calendar,
      description: `${upcomingAppointments.length} upcoming`,
      href: `/doctor/appointments?id=${doctorId}`,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50/50",
      iconBg: "bg-blue-500",
      textColor: "text-blue-700"
    },
    {
      title: "Total Patients",
      value: uniquePatients,
      change: "+12.5",
      changeType: 'increase',
      icon: Users,
      description: "Active patients",
      href: `/doctor/patients?id=${doctorId}`,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50/50",
      iconBg: "bg-purple-500",
      textColor: "text-purple-700"
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      change: "+5.2",
      changeType: 'increase',
      icon: CheckCircle,
      description: `${completedAppointments} completed`,
      href: `/doctor/appointments?id=${doctorId}`,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50/50",
      iconBg: "bg-green-500",
      textColor: "text-green-700"
    },
    {
      title: "Pending Reviews",
      value: pendingAppointments,
      change: "-3.1",
      changeType: 'decrease',
      icon: Clock,
      description: "Awaiting confirmation",
      href: `/doctor/appointments?id=${doctorId}`,
      gradient: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-50 to-amber-50/50",
      iconBg: "bg-orange-500",
      textColor: "text-orange-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-2xl">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.1))]" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
        
        <div className="relative p-6 sm:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Welcome Message */}
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 ring-4 ring-white/30 shadow-2xl">
                  <AvatarImage src={doctor?.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-white to-blue-100 text-blue-600 text-2xl font-bold">
                    {doctor?.name?.charAt(0) || 'D'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                      Welcome back, Dr. {doctor?.name}!
                    </h1>
                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm hidden sm:inline-flex">
                      <Heart className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-blue-100">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" />
                      <span className="text-sm sm:text-base font-medium">{doctor?.specialty || 'General Practice'}</span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                      <span className="text-sm sm:text-base font-medium">4.9 Rating</span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm sm:text-base">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <Link href={`/doctor/appointments/form?id=${doctorId}`}>
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1">
                    <Plus className="w-5 h-5 mr-2" />
                    New Appointment
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm">
                  <Bell className="w-5 h-5 mr-2" />
                  Notifications
                  {pendingAppointments > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white">{pendingAppointments}</Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const isIncrease = stat.changeType === 'increase';
              
              return (
                <Link key={stat.title} href={stat.href}>
                  <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50 group-hover:opacity-70 transition-opacity`} />
                    
                    <CardContent className="relative p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${stat.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        {stat.change && (
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                            isIncrease ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {isIncrease ? (
                              <ArrowUpRight className="w-3 h-3" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3" />
                            )}
                            {stat.change}%
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                        <p className={`text-3xl font-bold ${stat.textColor} mb-2`}>
                          {stat.value}
                        </p>
                        <p className="text-xs text-gray-500">{stat.description}</p>
                      </div>

                      <div className="mt-4 flex items-center text-xs font-medium text-blue-600 group-hover:translate-x-2 transition-transform">
                        View details
                        <ArrowUpRight className="w-3 h-3 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Upcoming Appointments - Takes 2 columns */}
            <Card className="lg:col-span-2 border-0 shadow-xl overflow-hidden">
              <CardHeader className="border-b bg-gradient-to-r from-white to-gray-50/50 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      Upcoming Appointments
                    </CardTitle>
                    <CardDescription className="mt-2 text-base">
                      Next {upcomingAppointments.slice(0, 5).length} scheduled appointments
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 px-4 py-2 text-lg font-semibold">
                    {upcomingAppointments.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-6">
                      <Calendar className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No upcoming appointments</h3>
                    <p className="text-gray-500 mb-6">Your schedule is clear. Take some time to relax!</p>
                    <Link href={`/doctor/appointments?id=${doctorId}`}>
                      <Button className="bg-gradient-to-r from-blue-500 to-cyan-500">
                        <Plus className="w-4 h-4 mr-2" />
                        Schedule New Appointment
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingAppointments.slice(0, 5).map((appointment) => {
                      const apptDate = new Date(appointment.appointmentDate);
                      const isToday = apptDate.toDateString() === today.toDateString();
                      
                      return (
                        <div
                          key={appointment.id}
                          className="group relative flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-white to-gray-50/50 border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
                        >
                          {isToday && (
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse">
                                Today
                              </Badge>
                            </div>
                          )}
                          
                          <Avatar className="h-14 w-14 ring-4 ring-white shadow-lg group-hover:ring-blue-200 transition-all">
                            <AvatarImage src={appointment.patientAvatar} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-lg">
                              {appointment.patientName?.charAt(0) || 'P'}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-gray-900 truncate text-lg group-hover:text-blue-600 transition-colors">
                                {appointment.patientName}
                              </p>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  appointment.status === 'confirmed' 
                                    ? 'bg-green-50 text-green-700 border-green-200' 
                                    : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                }`}
                              >
                                {appointment.status}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-blue-500" />
                                <span className="font-medium">{appointment.timeSlot || '10:00 AM'}</span>
                              </div>
                              <span className="text-gray-300">•</span>
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-purple-500" />
                                <span>{apptDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              </div>
                              {appointment.reason && (
                                <>
                                  <span className="text-gray-300">•</span>
                                  <span className="truncate max-w-xs">{appointment.reason}</span>
                                </>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" className="hover:bg-green-50 hover:text-green-700">
                              <Phone className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="hover:bg-blue-50 hover:text-blue-700">
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {upcomingAppointments.length > 5 && (
                  <div className="mt-6">
                    <Separator className="mb-4" />
                    <Link href={`/doctor/appointments?id=${doctorId}`}>
                      <Button variant="outline" className="w-full border-2 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all">
                        View All {upcomingAppointments.length} Appointments
                        <ArrowUpRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sidebar - Quick Overview and Actions */}
            <div className="space-y-6">
              {/* Performance Overview */}
              <Card className="border-0 shadow-xl overflow-hidden">
                <CardHeader className="border-b bg-gradient-to-r from-white to-gray-50/50">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Completion Rate */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">Completion Rate</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {completionRate}%
                      </span>
                    </div>
                    <Progress value={completionRate} className="h-3" />
                    <p className="text-xs text-gray-500 mt-2">{completedAppointments} of {totalAppointments} completed</p>
                  </div>

                  <Separator />

                  {/* Stats List */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <CalendarCheck className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Total Appointments</p>
                          <p className="text-xl font-bold text-gray-900">{totalAppointments}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/10">
                          <UserCheck className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Active Patients</p>
                          <p className="text-xl font-bold text-gray-900">{uniquePatients}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-500/10">
                          <Clock className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Pending</p>
                          <p className="text-xl font-bold text-gray-900">{pendingAppointments}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-xl overflow-hidden">
                <CardHeader className="border-b bg-gradient-to-r from-white to-gray-50/50">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-3">
                    <Link href={`/doctor/appointments?id=${doctorId}`}>
                      <Button className="w-full h-auto flex-col gap-2 py-4 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                        <Calendar className="w-6 h-6" />
                        <span className="text-xs font-medium">Schedule</span>
                      </Button>
                    </Link>
                    
                    <Link href={`/doctor/patients?id=${doctorId}`}>
                      <Button className="w-full h-auto flex-col gap-2 py-4 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                        <Users className="w-6 h-6" />
                        <span className="text-xs font-medium">Patients</span>
                      </Button>
                    </Link>
                    
                    <Link href={`/doctor/profile?id=${doctorId}`}>
                      <Button className="w-full h-auto flex-col gap-2 py-4 bg-gradient-to-br from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                        <Stethoscope className="w-6 h-6" />
                        <span className="text-xs font-medium">Profile</span>
                      </Button>
                    </Link>
                    
                    <Link href={`/doctor/appointments/form?id=${doctorId}`}>
                      <Button className="w-full h-auto flex-col gap-2 py-4 bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                        <FileText className="w-6 h-6" />
                        <span className="text-xs font-medium">Forms</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts */}
              {(pendingAppointments > 0 || cancelledAppointments > 0) && (
                <Card className="border-0 shadow-xl overflow-hidden border-l-4 border-l-orange-500">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-orange-100">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">Attention Required</h4>
                        <p className="text-sm text-gray-600">
                          {pendingAppointments > 0 && `${pendingAppointments} pending appointment${pendingAppointments > 1 ? 's' : ''}`}
                          {pendingAppointments > 0 && cancelledAppointments > 0 && ' and '}
                          {cancelledAppointments > 0 && `${cancelledAppointments} cancelled`}
                        </p>
                        <Link href={`/doctor/appointments?id=${doctorId}`}>
                          <Button size="sm" variant="link" className="px-0 mt-2 text-orange-600 hover:text-orange-700">
                            Review now →
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

DoctorDashboard.propTypes = {
  doctorId: PropTypes.string.isRequired,
};
