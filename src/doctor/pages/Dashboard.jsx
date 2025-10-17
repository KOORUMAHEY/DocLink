'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock, 
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
  Clock3,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/context/theme';
import { cn } from '@/lib/utils';

// Import optimized dashboard service
import {
  getDoctorDashboardData,
  calculateDashboardStats,
  getUpcomingAppointments,
  setupDashboardRealTimeUpdates,
  cleanupDashboardListeners,
  clearDashboardCache
} from '../services/dashboardService';

// Helper to get badge styles
const getStatusBadgeStyle = (status) => {
  const styles = {
    confirmed: 'bg-green-50 text-green-700 border-green-200',
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    completed: 'bg-blue-50 text-blue-700 border-blue-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
    scheduled: 'bg-purple-50 text-purple-700 border-purple-200',
  };
  return styles[status] || 'bg-gray-50 text-gray-700 border-gray-200';
};

// Loading skeleton component
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
        <Skeleton className="h-32 sm:h-36 md:h-40 w-full rounded-xl sm:rounded-2xl" />
        <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((key) => (
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

// Error state component
function ErrorState({ isDark }) {
  const doctorId = null;
  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center",
      isDark 
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" 
        : "bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20"
    )}>
      <div className="text-center p-8">
        <div className={cn(
          "inline-flex items-center justify-center w-20 h-20 rounded-full mb-6",
          isDark ? "bg-red-500/20" : "bg-red-100"
        )}>
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>
        <h2 className={cn(
          "text-2xl font-bold mb-2",
          isDark ? "text-white" : "text-gray-900"
        )}>Doctor ID Required</h2>
        <p className={cn(
          "mb-6",
          isDark ? "text-slate-400" : "text-gray-600"
        )}>Please log in to access your dashboard.</p>
        <Link href="/login">
          <Button className="bg-gradient-to-r from-blue-500 to-cyan-500">
            Go to Login
          </Button>
        </Link>
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function DoctorDashboard() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('id');
  const { toast } = useToast();
  const { isDark } = useTheme();
  
  // State management
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const unsubscribeRef = useRef(null);

  // Memoized stats calculation
  const stats = useMemo(() => {
    if (!dashboardData?.appointments) return null;
    return calculateDashboardStats(dashboardData.appointments);
  }, [dashboardData?.appointments]);

  // Load dashboard data
  const loadDashboardData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      if (!doctorId) return;

      const [dashboardResult, upcomingResult] = await Promise.all([
        getDoctorDashboardData(doctorId),
        getUpcomingAppointments(doctorId, 24)
      ]);
      
      setDashboardData(dashboardResult);
      setUpcomingAppointments(upcomingResult);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      toast?.({
        title: "Error",
        description: "Could not load dashboard. Please try again.",
        variant: "destructive",
      });
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [doctorId, toast]);

  // Initialize and setup real-time updates
  useEffect(() => {
    if (!doctorId) return;

    loadDashboardData();

    // Setup real-time listener
    const unsubscribe = setupDashboardRealTimeUpdates(doctorId, (updatedAppointments) => {
      setDashboardData(prev => ({
        ...prev,
        appointments: updatedAppointments
      }));
    });

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        cleanupDashboardListeners(doctorId);
      }
    };
  }, [doctorId, loadDashboardData]);

  // Refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      clearDashboardCache(doctorId);
      await loadDashboardData(false);
      toast?.({
        title: "Refreshed",
        description: "Dashboard updated with latest data.",
      });
    } catch (error) {
      console.error('Refresh failed:', error);
      toast?.({
        title: "Error",
        description: "Could not refresh dashboard.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Error and loading states
  if (!doctorId && !loading) {
    return <ErrorState isDark={isDark} />;
  }

  if (loading) {
    return <DashboardSkeleton />;
  }

  const doctor = dashboardData?.doctor || {};

  // Prepare stat cards
  const statCards = stats ? [
    {
      title: "Today's Appointments",
      value: stats.today.appointments,
      change: stats.rates.monthlyGrowth,
      changeType: stats.rates.monthlyGrowth >= 0 ? 'increase' : 'decrease',
      icon: Calendar,
      description: `${stats.today.confirmed} confirmed`,
      href: `/doctor/appointments?id=${doctorId}`,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50/50",
      iconBg: "bg-blue-500",
      textColor: "text-blue-700"
    },
    {
      title: "Total Patients",
      value: stats.totals.patients,
      change: stats.rates.patientReturn,
      changeType: stats.rates.patientReturn >= 50 ? 'increase' : 'decrease',
      icon: Users,
      description: `${stats.rates.patientReturn}% returning`,
      href: `/doctor/patients?id=${doctorId}`,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50/50",
      iconBg: "bg-purple-500",
      textColor: "text-purple-700"
    },
    {
      title: "Completion Rate",
      value: `${stats.rates.completion}%`,
      change: stats.rates.completion,
      changeType: stats.rates.completion >= 80 ? 'increase' : 'decrease',
      icon: CheckCircle,
      description: `${stats.totals.completed} completed`,
      href: `/doctor/appointments?id=${doctorId}`,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50/50",
      iconBg: "bg-green-500",
      textColor: "text-green-700"
    },
    {
      title: "Pending Reviews",
      value: stats.totals.pending,
      change: stats.totals.pending,
      changeType: stats.totals.pending > 0 ? 'increase' : 'decrease',
      icon: Clock,
      description: "Awaiting action",
      href: `/doctor/appointments?id=${doctorId}`,
      gradient: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-50 to-amber-50/50",
      iconBg: "bg-orange-500",
      textColor: "text-orange-700"
    }
  ] : [];

  return (
    <div className={cn(
      "min-h-screen",
      isDark 
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" 
        : "bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20"
    )}>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-xl sm:shadow-2xl">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.1))]" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
        
        <div className="relative p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-4 sm:gap-6">
              {/* Welcome Section */}
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
                        {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Link href={`/doctor/appointments/form?id=${doctorId}`} className="flex-1 sm:flex-none">
                  <Button className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5 sm:hover:-translate-y-1 text-sm sm:text-base">
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="hidden sm:inline">New Appointment</span>
                    <span className="sm:hidden">New Appt</span>
                  </Button>
                </Link>
                <Button 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex-1 sm:flex-none bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm text-sm sm:text-base"
                >
                  <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                  {stats?.totals.pending > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white text-xs">{stats.totals.pending}</Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          
          {/* Stats Grid */}
          <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              const isIncrease = stat.changeType === 'increase';
              
              return (
                <Link key={stat.title} href={stat.href}>
                  <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 cursor-pointer bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm h-full">
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
                            {Math.abs(stat.change)}%
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
                        <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-0.5 sm:ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            
            {/* Appointments List */}
            <Card className="lg:col-span-2 border-0 shadow-lg sm:shadow-xl overflow-hidden">
              <CardHeader className="border-b bg-gradient-to-r from-white to-gray-50/50 p-4 sm:p-5 md:pb-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg sm:text-xl md:text-2xl flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex-shrink-0">
                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                      </div>
                      <span className="truncate">Next 24 Hours</span>
                    </CardTitle>
                    <CardDescription className="mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base">
                      Upcoming appointments
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
                    <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">You're all caught up!</p>
                    <Link href={`/doctor/appointments?id=${doctorId}`}>
                      <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-sm sm:text-base">
                        <Plus className="w-4 h-4 mr-2" />
                        Schedule New
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {upcomingAppointments.slice(0, 5).map((appointment, idx) => (
                      <div
                        key={appointment.id || idx}
                        className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-white to-gray-50/50 border border-gray-100 sm:border-2 hover:border-blue-200 hover:shadow-md sm:hover:shadow-lg transition-all duration-300 cursor-pointer"
                      >
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
                              className={`text-[10px] sm:text-xs flex-shrink-0 ${getStatusBadgeStyle(appointment.status)}`}
                            >
                              {appointment.status || 'scheduled'}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                            <div className="flex items-center gap-1 sm:gap-1.5">
                              <Clock3 className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                              <span className="font-medium">{appointment.timeSlot || '10:00 AM'}</span>
                            </div>
                            {appointment.reason && (
                              <>
                                <span className="text-gray-300 hidden sm:inline">•</span>
                                <span className="truncate max-w-[200px] hidden md:inline">{appointment.reason}</span>
                              </>
                            )}
                          </div>
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
                    ))}
                  </div>
                )}
                
                {upcomingAppointments.length > 5 && (
                  <div className="mt-4 sm:mt-6">
                    <Separator className="mb-3 sm:mb-4" />
                    <Link href={`/doctor/appointments?id=${doctorId}`}>
                      <Button variant="outline" className="w-full border sm:border-2 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all text-sm sm:text-base">
                        View All {upcomingAppointments.length} Appointments
                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              
              {/* Performance Overview */}
              <Card className="border-0 shadow-lg sm:shadow-xl overflow-hidden">
                <CardHeader className="border-b bg-gradient-to-r from-white to-gray-50/50 p-4 sm:p-5 md:p-6">
                  <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0">
                      <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <span className="truncate">Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-6">
                  {/* Completion Rate */}
                  <div>
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Completion Rate</span>
                      <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {stats?.rates.completion || 0}%
                      </span>
                    </div>
                    <Progress value={stats?.rates.completion || 0} className="h-2 sm:h-3" />
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-1.5 sm:mt-2">
                      {stats?.totals.completed || 0} of {stats?.totals.appointments || 0} completed
                    </p>
                  </div>

                  <Separator />

                  {/* Stats List */}
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      { id: 'total-appts', label: 'Total Appointments', value: stats?.totals.appointments || 0, icon: CalendarCheck, color: 'bg-blue-500/10 text-blue-600' },
                      { id: 'active-patients', label: 'Active Patients', value: stats?.totals.patients || 0, icon: UserCheck, color: 'bg-purple-500/10 text-purple-600' },
                      { id: 'pending', label: 'Pending', value: stats?.totals.pending || 0, icon: Clock, color: 'bg-orange-500/10 text-orange-600' },
                    ].map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <div key={item.id} className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-gray-200 transition-all">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className={`p-1.5 sm:p-2 rounded-lg ${item.color} flex-shrink-0`}>
                              <ItemIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                            <div>
                              <p className="text-[10px] sm:text-xs text-gray-600">{item.label}</p>
                              <p className="text-lg sm:text-xl font-bold text-gray-900">{item.value}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-lg sm:shadow-xl overflow-hidden">
                <CardHeader className="border-b bg-gradient-to-r from-white to-gray-50/50 p-4 sm:p-5 md:p-6">
                  <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex-shrink-0">
                      <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <span className="truncate">Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-5 md:p-6">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {[
                      { href: `/doctor/appointments?id=${doctorId}`, label: 'Schedule', icon: Calendar, color: 'from-blue-500 to-cyan-500' },
                      { href: `/doctor/patients?id=${doctorId}`, label: 'Patients', icon: Users, color: 'from-purple-500 to-pink-500' },
                      { href: `/doctor/profile?id=${doctorId}`, label: 'Profile', icon: Stethoscope, color: 'from-orange-500 to-amber-500' },
                      { href: `/doctor/appointments/form?id=${doctorId}`, label: 'New Appt', icon: FileText, color: 'from-green-500 to-emerald-500' },
                    ].map((action) => {
                      const ActionIcon = action.icon;
                      return (
                        <Link key={action.label} href={action.href}>
                          <Button className={`w-full h-auto flex-col gap-1.5 sm:gap-2 py-3 sm:py-4 bg-gradient-to-br ${action.color} hover:opacity-90 shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all hover:-translate-y-0.5 sm:hover:-translate-y-1`}>
                            <ActionIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                            <span className="text-[10px] sm:text-xs font-medium">{action.label}</span>
                          </Button>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Alert */}
              {stats?.totals.pending > 0 && (
                <Card className="border-0 shadow-lg sm:shadow-xl overflow-hidden border-l-4 border-l-orange-500">
                  <CardContent className="p-4 sm:p-5 md:p-6">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-orange-100 flex-shrink-0">
                        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Action Required</h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {stats.totals.pending} pending appointment{stats.totals.pending > 1 ? 's' : ''} need your attention
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