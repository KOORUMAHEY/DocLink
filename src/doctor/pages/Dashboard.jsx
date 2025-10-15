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
  Heart,
  RefreshCw,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAppointmentsByDoctor } from '@/features/appointments/services/appointmentService';
import { getDoctorById } from '@/features/doctors';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export default function DoctorDashboard() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('id');
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (!doctorId) {
          console.error('No doctor ID provided');
          return;
        }

        const [doctorData, appointmentsData] = await Promise.all([
          getDoctorById(doctorId),
          getAppointmentsByDoctor(doctorId)
        ]);
        
        setDoctor(doctorData || {});
        setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setDoctor({});
        setAppointments([]);
        if (toast) {
          toast({
            title: "Error loading dashboard",
            description: "Could not load your dashboard data. Please try again.",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      loadData();
    }
  }, [doctorId, toast]);

  // Show error if no doctorId
  if (!doctorId && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="text-center p-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Doctor ID Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access your dashboard.</p>
          <Link href="/login">
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const refreshData = async () => {
    setRefreshing(true);
    try {
      const [doctorData, appointmentsData] = await Promise.all([
        getDoctorById(doctorId),
        getAppointmentsByDoctor(doctorId)
      ]);
      
      setDoctor(doctorData || {});
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      
      if (toast) {
        toast({
          title: "Data refreshed",
          description: "Your dashboard has been updated.",
        });
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
      if (toast) {
        toast({
          title: "Refresh failed",
          description: "Could not refresh dashboard data.",
          variant: "destructive",
        });
      }
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
          <Skeleton className="h-32 sm:h-36 md:h-40 w-full rounded-xl sm:rounded-2xl" />
          <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
            {['stat-1', 'stat-2', 'stat-3', 'stat-4'].map((key) => (
              <Skeleton key={key} className="h-32 sm:h-36 w-full rounded-xl sm:rounded-2xl" />
            ))}
          </div>
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            <Skeleton className="h-80 sm:h-96 lg:col-span-2 rounded-xl sm:rounded-2xl" />
            <Skeleton className="h-80 sm:h-96 rounded-xl sm:rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics dynamically
  const totalAppointments = appointments?.length || 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayAppointments = appointments?.filter(a => {
    if (!a?.appointmentDate) return false;
    const apptDate = new Date(a.appointmentDate);
    apptDate.setHours(0, 0, 0, 0);
    return apptDate.getTime() === today.getTime();
  }) || [];

  const upcomingAppointments = appointments?.filter(a => {
    if (!a?.appointmentDate) return false;
    const apptDate = new Date(a.appointmentDate);
    return apptDate >= today && (a.status === 'scheduled' || a.status === 'confirmed' || a.status === 'pending');
  }).sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)) || [];

  const completedAppointments = appointments?.filter(a => a?.status === 'completed').length || 0;
  const pendingAppointments = appointments?.filter(a => a?.status === 'pending').length || 0;
  const cancelledAppointments = appointments?.filter(a => a?.status === 'cancelled').length || 0;
  
  const uniquePatients = new Set(appointments?.map(a => a?.patientId || a?.patientEmail).filter(Boolean)).size || 0;
  
  // Calculate weekly comparison with safety checks
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  const lastWeekAppointments = appointments?.filter(a => {
    if (!a?.appointmentDate) return false;
    const apptDate = new Date(a.appointmentDate);
    return apptDate >= lastWeek && apptDate < today;
  }).length || 0;
  
  const thisWeekAppointments = appointments?.filter(a => {
    if (!a?.appointmentDate) return false;
    const apptDate = new Date(a.appointmentDate);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return apptDate >= today && apptDate < nextWeek;
  }).length || 0;
  
  let weeklyChangeValue = 0;
  if (lastWeekAppointments > 0) {
    weeklyChangeValue = ((thisWeekAppointments - lastWeekAppointments) / lastWeekAppointments * 100).toFixed(1);
  } else if (thisWeekAppointments > 0) {
    weeklyChangeValue = 100;
  }
  const weeklyChange = weeklyChangeValue;

  const completionRate = totalAppointments > 0 
    ? Math.round((completedAppointments / totalAppointments) * 100)
    : 0;

  // Calculate patient growth
  const lastMonthPatients = appointments?.filter(a => {
    if (!a?.appointmentDate) return false;
    const apptDate = new Date(a.appointmentDate);
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return apptDate >= lastMonth && apptDate < today;
  }) || [];
  
  const lastMonthUniquePatients = new Set(lastMonthPatients.map(a => a?.patientId || a?.patientEmail).filter(Boolean)).size || 0;
  let patientGrowthValue = 0;
  if (lastMonthUniquePatients > 0) {
    patientGrowthValue = (((uniquePatients - lastMonthUniquePatients) / lastMonthUniquePatients) * 100).toFixed(1);
  } else if (uniquePatients > 0) {
    patientGrowthValue = 100;
  }
  const patientGrowth = patientGrowthValue;

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
      change: patientGrowth,
      changeType: patientGrowth >= 0 ? 'increase' : 'decrease',
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
      change: completionRate >= 80 ? "+5.2" : "-2.1",
      changeType: completionRate >= 80 ? 'increase' : 'decrease',
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
      change: pendingAppointments > 0 ? "+3.1" : "-3.1",
      changeType: pendingAppointments > 0 ? 'increase' : 'decrease',
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
      {/* Hero Section - Mobile Optimized */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-xl sm:shadow-2xl">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.1))]" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
        
        <div className="relative p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-4 sm:gap-6">
              {/* Welcome Message - Mobile Optimized */}
              <div className="flex items-start gap-3 sm:gap-4">
                <Avatar className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 ring-4 ring-white/30 shadow-2xl flex-shrink-0">
                  <AvatarImage src={doctor?.avatar || doctor?.photoURL} />
                  <AvatarFallback className="bg-gradient-to-br from-white to-blue-100 text-blue-600 text-xl sm:text-2xl font-bold">
                    {doctor?.name?.charAt(0) || 'D'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                      Welcome back, Dr. {doctor?.name || 'Doctor'}!
                    </h1>
                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm hidden sm:inline-flex flex-shrink-0">
                      <Heart className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3 text-blue-100">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm md:text-base font-medium truncate">
                        {doctor?.specialty || doctor?.specialization || 'General Practice'}
                      </span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center gap-2">
                      <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-300 text-yellow-300 flex-shrink-0" />
                      <span className="text-xs sm:text-sm md:text-base font-medium">4.9 Rating</span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm md:text-base truncate">
                        {new Date().toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions - Mobile Optimized */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Link href={`/doctor/appointments/form?id=${doctorId}`} className="flex-1 sm:flex-none">
                  <Button 
                    size="default" 
                    className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5 sm:hover:-translate-y-1 text-sm sm:text-base"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="hidden sm:inline">New Appointment</span>
                    <span className="sm:hidden">New Appt</span>
                  </Button>
                </Link>
                <Button 
                  size="default" 
                  variant="outline" 
                  className="flex-1 sm:flex-none bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm text-sm sm:text-base"
                  onClick={refreshData}
                  disabled={refreshing}
                >
                  <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                  {pendingAppointments > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white text-xs">{pendingAppointments}</Badge>
                  )}
                </Button>
                <Button 
                  size="default" 
                  variant="outline" 
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm text-sm sm:text-base sm:hidden"
                >
                  <Bell className="w-4 h-4" />
                  {pendingAppointments > 0 && (
                    <Badge className="ml-1.5 bg-red-500 text-white text-xs">{pendingAppointments}</Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Stats Grid - Mobile Optimized */}
          <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const isIncrease = stat.changeType === 'increase';
              
              return (
                <Link key={stat.title} href={stat.href}>
                  <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 cursor-pointer bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm h-full">
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50 group-hover:opacity-70 transition-opacity`} />
                    
                    <CardContent className="relative p-4 sm:p-5 md:p-6">
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${stat.iconBg} shadow-md sm:shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                        </div>
                        {stat.change && (
                          <div className={`flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                            isIncrease ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {isIncrease ? (
                              <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            ) : (
                              <ArrowDownRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            )}
                            {stat.change}%
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 line-clamp-1">{stat.title}</p>
                        <p className={`text-2xl sm:text-3xl font-bold ${stat.textColor} mb-1 sm:mb-2`}>
                          {stat.value}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-1">{stat.description}</p>
                      </div>

                      <div className="mt-3 sm:mt-4 flex items-center text-[10px] sm:text-xs font-medium text-blue-600 group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform">
                        View details
                        <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-0.5 sm:ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Main Content Grid - Mobile Optimized */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            {/* Upcoming Appointments - Takes 2 columns on desktop */}
            <Card className="lg:col-span-2 border-0 shadow-lg sm:shadow-xl overflow-hidden">
              <CardHeader className="border-b bg-gradient-to-r from-white to-gray-50/50 p-4 sm:p-5 md:pb-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg sm:text-xl md:text-2xl flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex-shrink-0">
                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                      </div>
                      <span className="truncate">Upcoming Appointments</span>
                    </CardTitle>
                    <CardDescription className="mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base">
                      Next {Math.min(upcomingAppointments.length, 5)} scheduled appointments
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-sm sm:text-base md:text-lg font-semibold flex-shrink-0">
                    {upcomingAppointments.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 md:p-6">
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-12 sm:py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4 sm:mb-6">
                      <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No upcoming appointments</h3>
                    <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 px-4">Your schedule is clear. Take some time to relax!</p>
                    <Link href={`/doctor/appointments?id=${doctorId}`}>
                      <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-sm sm:text-base">
                        <Plus className="w-4 h-4 mr-2" />
                        Schedule New Appointment
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {upcomingAppointments.slice(0, 5).map((appointment) => {
                      const apptDate = new Date(appointment.appointmentDate);
                      const isToday = apptDate.toDateString() === today.toDateString();
                      
                      return (
                        <div
                          key={appointment.id}
                          className="group relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-white to-gray-50/50 border border-gray-100 sm:border-2 hover:border-blue-200 hover:shadow-md sm:hover:shadow-lg transition-all duration-300 cursor-pointer"
                        >
                          {isToday && (
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse text-xs">
                                Today
                              </Badge>
                            </div>
                          )}
                          
                          <Avatar className="h-12 w-12 sm:h-14 sm:w-14 ring-2 sm:ring-4 ring-white shadow-md sm:shadow-lg group-hover:ring-blue-200 transition-all flex-shrink-0">
                            <AvatarImage src={appointment.patientAvatar} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-base sm:text-lg">
                              {appointment.patientName?.charAt(0) || 'P'}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <p className="font-bold text-gray-900 text-base sm:text-lg group-hover:text-blue-600 transition-colors truncate">
                                {appointment.patientName || 'Patient'}
                              </p>
                              <Badge 
                                variant="outline" 
                                className={`text-[10px] sm:text-xs flex-shrink-0 ${
                                  appointment.status === 'confirmed' 
                                    ? 'bg-green-50 text-green-700 border-green-200' 
                                    : appointment.status === 'pending'
                                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                                }`}
                              >
                                {appointment.status || 'scheduled'}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                              <div className="flex items-center gap-1 sm:gap-1.5">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                                <span className="font-medium">{appointment.timeSlot || '10:00 AM'}</span>
                              </div>
                              <span className="text-gray-300 hidden sm:inline">•</span>
                              <div className="flex items-center gap-1 sm:gap-1.5">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                                <span className="whitespace-nowrap">
                                  {apptDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                              {appointment.reason && (
                                <>
                                  <span className="text-gray-300 hidden md:inline">•</span>
                                  <span className="truncate max-w-[200px] hidden md:inline">{appointment.reason}</span>
                                </>
                              )}
                            </div>
                            {appointment.reason && (
                              <p className="text-xs text-gray-500 mt-1 truncate sm:hidden">{appointment.reason}</p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-700">
                              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-700">
                              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-purple-50 hover:text-purple-700 hidden sm:flex">
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {upcomingAppointments.length > 5 && (
                  <div className="mt-4 sm:mt-6">
                    <Separator className="mb-3 sm:mb-4" />
                    <Link href={`/doctor/appointments?id=${doctorId}`}>
                      <Button variant="outline" className="w-full border sm:border-2 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all text-sm sm:text-base">
                        View All {upcomingAppointments.length} Appointments
                        <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sidebar - Quick Overview and Actions - Mobile Optimized */}
            <div className="space-y-4 sm:space-y-6">
              {/* Performance Overview */}
              <Card className="border-0 shadow-lg sm:shadow-xl overflow-hidden">
                <CardHeader className="border-b bg-gradient-to-r from-white to-gray-50/50 p-4 sm:p-5 md:p-6">
                  <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0">
                      <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-6">
                  {/* Completion Rate */}
                  <div>
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Completion Rate</span>
                      <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {completionRate}%
                      </span>
                    </div>
                    <Progress value={completionRate} className="h-2 sm:h-3" />
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-1.5 sm:mt-2">
                      {completedAppointments} of {totalAppointments} completed
                    </p>
                  </div>

                  <Separator />

                  {/* Stats List */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/10 flex-shrink-0">
                          <CalendarCheck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs text-gray-600">Total Appointments</p>
                          <p className="text-lg sm:text-xl font-bold text-gray-900">{totalAppointments}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/10 flex-shrink-0">
                          <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs text-gray-600">Active Patients</p>
                          <p className="text-lg sm:text-xl font-bold text-gray-900">{uniquePatients}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 rounded-lg bg-orange-500/10 flex-shrink-0">
                          <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs text-gray-600">Pending</p>
                          <p className="text-lg sm:text-xl font-bold text-gray-900">{pendingAppointments}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-lg sm:shadow-xl overflow-hidden">
                <CardHeader className="border-b bg-gradient-to-r from-white to-gray-50/50 p-4 sm:p-5 md:p-6">
                  <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex-shrink-0">
                      <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-5 md:p-6">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <Link href={`/doctor/appointments?id=${doctorId}`}>
                      <Button className="w-full h-auto flex-col gap-1.5 sm:gap-2 py-3 sm:py-4 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all hover:-translate-y-0.5 sm:hover:-translate-y-1">
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="text-[10px] sm:text-xs font-medium">Schedule</span>
                      </Button>
                    </Link>
                    
                    <Link href={`/doctor/patients?id=${doctorId}`}>
                      <Button className="w-full h-auto flex-col gap-1.5 sm:gap-2 py-3 sm:py-4 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all hover:-translate-y-0.5 sm:hover:-translate-y-1">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="text-[10px] sm:text-xs font-medium">Patients</span>
                      </Button>
                    </Link>
                    
                    <Link href={`/doctor/profile?id=${doctorId}`}>
                      <Button className="w-full h-auto flex-col gap-1.5 sm:gap-2 py-3 sm:py-4 bg-gradient-to-br from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all hover:-translate-y-0.5 sm:hover:-translate-y-1">
                        <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="text-[10px] sm:text-xs font-medium">Profile</span>
                      </Button>
                    </Link>
                    
                    <Link href={`/doctor/appointments/form?id=${doctorId}`}>
                      <Button className="w-full h-auto flex-col gap-1.5 sm:gap-2 py-3 sm:py-4 bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all hover:-translate-y-0.5 sm:hover:-translate-y-1">
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="text-[10px] sm:text-xs font-medium">Forms</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts */}
              {(pendingAppointments > 0 || cancelledAppointments > 0) && (
                <Card className="border-0 shadow-lg sm:shadow-xl overflow-hidden border-l-4 border-l-orange-500">
                  <CardContent className="p-4 sm:p-5 md:p-6">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-orange-100 flex-shrink-0">
                        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Attention Required</h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {pendingAppointments > 0 && `${pendingAppointments} pending appointment${pendingAppointments > 1 ? 's' : ''}`}
                          {pendingAppointments > 0 && cancelledAppointments > 0 && ' and '}
                          {cancelledAppointments > 0 && `${cancelledAppointments} cancelled`}
                        </p>
                        <Link href={`/doctor/appointments?id=${doctorId}`}>
                          <Button size="sm" variant="link" className="px-0 mt-1.5 sm:mt-2 text-orange-600 hover:text-orange-700 h-auto text-xs sm:text-sm">
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
