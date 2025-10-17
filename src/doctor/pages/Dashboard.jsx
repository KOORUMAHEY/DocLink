'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
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
} from 'lucide-react';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
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

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

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

// ============================================================================
// SKELETON COMPONENT
// ============================================================================

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((key) => (
            <Skeleton key={key} className="h-32 w-full rounded-2xl" />
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

// ============================================================================
// ERROR STATE COMPONENT
// ============================================================================

function ErrorState({ isDark }) {
  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center p-4",
      isDark 
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" 
        : "bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20"
    )}>
      <div className="text-center">
        <div className={cn(
          "inline-flex items-center justify-center w-24 h-24 rounded-full mb-6",
          isDark ? "bg-red-500/20" : "bg-red-100"
        )}>
          <AlertCircle className="w-12 h-12 text-red-600" />
        </div>
        <h2 className={cn(
          "text-3xl font-bold mb-2",
          isDark ? "text-white" : "text-gray-900"
        )}>Doctor ID Required</h2>
        <p className={cn(
          "mb-8",
          isDark ? "text-slate-400" : "text-gray-600"
        )}>Please log in to access your dashboard.</p>
        <Link href="/login">
          <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            Go to Login
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

function StatCard({ title, value, change, changeType, description, icon: Icon, gradient, isDark, href }) {
  const isIncrease = changeType === 'increase';
  
  return (
    <Link href={href} className="group">
      <Card className={cn(
        "relative overflow-hidden border-0 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer",
        isDark ? "bg-slate-800 hover:bg-slate-800/90" : "bg-white hover:bg-slate-50"
      )}>
        <div className={cn(
          "absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity",
          `bg-gradient-to-br ${gradient}`
        )} />
        
        <CardContent className="relative p-6 md:p-8">
          <div className="flex items-start justify-between mb-6">
            <div className={cn(
              "p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300",
              `bg-gradient-to-br ${gradient}`
            )}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            {change !== undefined && (
              <div className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold",
                isIncrease ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              )}>
                {isIncrease ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {Math.abs(change)}%
              </div>
            )}
          </div>
          
          <div>
            <p className={cn(
              "text-sm font-medium mb-1",
              isDark ? "text-slate-400" : "text-gray-600"
            )}>
              {title}
            </p>
            <h3 className={cn(
              "text-3xl md:text-4xl font-bold mb-2",
              isDark ? "text-white" : "text-gray-900"
            )}>
              {value}
            </h3>
            <p className={cn(
              "text-sm",
              isDark ? "text-slate-500" : "text-gray-500"
            )}>
              {description}
            </p>
          </div>

          <div className={cn(
            "mt-6 flex items-center gap-2 font-semibold group-hover:translate-x-2 transition-transform",
            `text-gradient-to-r ${gradient.replace('from', 'from').replace('to', 'to')}`
          )}>
            <span>View Details</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// ============================================================================
// QUICK NAV ITEM COMPONENT
// ============================================================================

function QuickNavItem({ href, icon: Icon, label, description, color, isDark }) {
  return (
    <Link href={href}>
      <div className={cn(
        "group p-4 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        isDark 
          ? "bg-slate-800 hover:bg-slate-700 border border-slate-700" 
          : "bg-white hover:bg-slate-50 border border-gray-200 hover:border-gray-300"
      )}>
        <div className={cn(
          "p-2.5 rounded-lg mb-3 w-fit",
          `bg-gradient-to-br ${color}`
        )}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h4 className={cn(
          "font-semibold mb-1",
          isDark ? "text-white" : "text-gray-900"
        )}>
          {label}
        </h4>
        <p className={cn(
          "text-xs",
          isDark ? "text-slate-400" : "text-gray-600"
        )}>
          {description}
        </p>
      </div>
    </Link>
  );
}

// ============================================================================
// APPOINTMENT ITEM COMPONENT
// ============================================================================

function AppointmentItem({ appointment, isDark }) {
  return (
    <div className={cn(
      "group flex items-center gap-4 p-4 rounded-lg border-l-4 transition-all duration-300 hover:shadow-md hover:bg-opacity-80",
      isDark
        ? "bg-slate-800/50 border-l-blue-500 hover:bg-slate-800/80 border border-slate-700/50"
        : "bg-white border-l-blue-500 border border-gray-200 hover:bg-slate-50"
    )}>
      <Avatar className="w-12 h-12 flex-shrink-0 ring-2 ring-blue-100">
        <AvatarImage src={appointment.patientAvatar} />
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white font-bold">
          {appointment.patientName?.charAt(0) || 'P'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className="font-semibold truncate text-gray-900 dark:text-white">
            {appointment.patientName || 'Patient'}
          </p>
          {appointment.status && (
            <Badge className={cn("text-xs flex-shrink-0", getStatusBadgeStyle(appointment.status))}>
              {appointment.status}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock3 className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-medium">{appointment.timeSlot || 'TBD'}</span>
          </div>
          {appointment.reason && (
            <>
              <span className="hidden sm:inline">•</span>
              <span className="truncate hidden sm:inline max-w-[150px]">{appointment.reason}</span>
            </>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/30"
        >
          <Phone className="w-4 h-4" />
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/30"
        >
          <MessageSquare className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

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
  const [appointmentFilter, setAppointmentFilter] = useState('today'); // 'today' or '24h'
  const unsubscribeRef = useRef(null);

  // Memoized stats calculation
  const stats = useMemo(() => {
    if (!dashboardData?.appointments) return null;
    return calculateDashboardStats(dashboardData.appointments);
  }, [dashboardData?.appointments]);

  // Filter appointments by today
  const filteredAppointments = useMemo(() => {
    if (appointmentFilter !== 'today') return upcomingAppointments;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return upcomingAppointments.filter(apt => {
      if (!apt.date) return false;
      const aptDate = new Date(apt.date);
      aptDate.setHours(0, 0, 0, 0);
      return aptDate.getTime() === today.getTime();
    });
  }, [upcomingAppointments, appointmentFilter]);

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
    },
    {
      title: "Pending Reviews",
      value: stats.totals.pending,
      change: stats.totals.pending > 0 ? stats.totals.pending : 0,
      changeType: stats.totals.pending > 0 ? 'increase' : 'decrease',
      icon: Clock,
      description: "Awaiting action",
      href: `/doctor/appointments?id=${doctorId}`,
      gradient: "from-orange-500 to-amber-500",
    }
  ] : [];

  const quickNavItems = [
    { href: `/doctor/appointments?id=${doctorId}`, icon: Calendar, label: 'View Appointments', description: 'Manage all appointments', color: 'from-blue-500 to-cyan-500' },
    { href: `/doctor/appointments/form?id=${doctorId}`, icon: Plus, label: 'New Appointment', description: 'Schedule a new appointment', color: 'from-green-500 to-emerald-500' },
    { href: `/doctor/patients?id=${doctorId}`, icon: Users, label: 'Patients', description: 'View patient records', color: 'from-purple-500 to-pink-500' },
    { href: `/doctor/profile?id=${doctorId}`, icon: Stethoscope, label: 'Profile', description: 'Update your profile', color: 'from-orange-500 to-amber-500' },
  ];

  return (
    <div className={cn(
      "min-h-screen",
      isDark 
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" 
        : "bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20"
    )}>
      {/* HEADER / HERO SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-xl">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.1))]" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
        
        <div className="relative p-6 sm:p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between gap-4 mb-8">
              <div className="flex items-start gap-4 flex-1">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 ring-4 ring-white/30 shadow-2xl flex-shrink-0">
                  <AvatarImage src={doctor?.avatar || doctor?.photoURL} />
                  <AvatarFallback className="bg-gradient-to-br from-white to-blue-100 text-blue-600 text-2xl font-bold">
                    {doctor?.name?.charAt(0) || 'D'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
                    Welcome back, Dr. {doctor?.name || 'Doctor'}!
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-blue-100">
                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                      <Heart className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                    <div className="flex items-center gap-1.5">
                      <Stethoscope className="w-4 h-4" />
                      <span className="text-sm font-medium">{doctor?.specialty || 'General Practice'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-yellow-300" />
                      <span className="text-sm font-medium">4.9 Rating</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleRefresh}
                disabled={refreshing}
                size="lg"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm flex-shrink-0"
              >
                <RefreshCw className={`w-5 h-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* STATS GRID */}
          <div>
            <h2 className={cn("text-lg sm:text-xl font-semibold mb-4", isDark ? "text-white" : "text-gray-900")}>
              Performance Metrics
            </h2>
            <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {statCards.map((stat) => (
                <StatCard
                  key={stat.title}
                  {...stat}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>

          {/* QUICK NAVIGATION */}
          <div>
            <h2 className={cn("text-lg sm:text-xl font-semibold mb-4", isDark ? "text-white" : "text-gray-900")}>
              Quick Navigation
            </h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {quickNavItems.map((item) => (
                <QuickNavItem
                  key={item.label}
                  {...item}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>

          {/* MAIN GRID: APPOINTMENTS + SIDEBAR */}
          <div className="grid gap-6 lg:grid-cols-3">
            
            {/* UPCOMING APPOINTMENTS */}
            <Card className={cn(
              "lg:col-span-2 border-0 shadow-lg overflow-hidden",
              isDark ? "bg-slate-800" : "bg-white"
            )}>
              <CardHeader className={cn(
                "border-b p-6 md:p-8",
                isDark ? "bg-slate-800/50 border-slate-700" : "bg-gradient-to-r from-white to-gray-50/50 border-gray-200"
              )}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl md:text-2xl flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <span>{appointmentFilter === 'today' ? 'Today' : 'Next 24 Hours'}</span>
                    </CardTitle>
                    <CardDescription>
                      {appointmentFilter === 'today' ? "Today's appointments" : 'Upcoming appointments'}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 items-center flex-shrink-0">
                    <div className="flex gap-2 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                      <Button
                        size="sm"
                        variant={appointmentFilter === 'today' ? 'default' : 'ghost'}
                        className="h-7 text-xs"
                        onClick={() => setAppointmentFilter('today')}
                      >
                        Today
                      </Button>
                      <Button
                        size="sm"
                        variant={appointmentFilter === '24h' ? 'default' : 'ghost'}
                        className="h-7 text-xs"
                        onClick={() => setAppointmentFilter('24h')}
                      >
                        All
                      </Button>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 px-4 py-2 text-base font-semibold flex-shrink-0">
                      {filteredAppointments.length}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 md:p-8">
                {filteredAppointments.length === 0 ? (
                  <div className="text-center py-16">
                    <div className={cn(
                      "inline-flex items-center justify-center w-20 h-20 rounded-full mb-6",
                      isDark ? "bg-slate-700" : "bg-gray-100"
                    )}>
                      <Calendar className={cn("w-10 h-10", isDark ? "text-slate-500" : "text-gray-400")} />
                    </div>
                    <h3 className={cn("text-lg font-semibold mb-2", isDark ? "text-white" : "text-gray-900")}>
                      No {appointmentFilter === 'today' ? "today's" : "upcoming"} appointments
                    </h3>
                    <p className={cn("mb-6", isDark ? "text-slate-400" : "text-gray-600")}>
                      {appointmentFilter === 'today' ? "You're all set for today!" : "You're all caught up!"}
                    </p>
                    <Link href={`/doctor/appointments?id=${doctorId}`}>
                      <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Schedule New
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredAppointments.slice(0, 6).map((appointment, idx) => (
                      <AppointmentItem
                        key={appointment.id || idx}
                        appointment={appointment}
                        isDark={isDark}
                      />
                    ))}
                    
                    {filteredAppointments.length > 6 && (
                      <>
                        <Separator className={isDark ? "bg-slate-700" : ""} />
                        <Link href={`/doctor/appointments?id=${doctorId}`}>
                          <Button variant="outline" className="w-full">
                            View All {filteredAppointments.length} Appointments
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SIDEBAR */}
            <div className="space-y-6">
              
              {/* PERFORMANCE OVERVIEW */}
              <Card className={cn(
                "border-0 shadow-lg overflow-hidden",
                isDark ? "bg-slate-800" : "bg-white"
              )}>
                <CardHeader className={cn(
                  "border-b p-6",
                  isDark ? "bg-slate-800/50 border-slate-700" : "bg-gradient-to-r from-white to-gray-50/50 border-gray-200"
                )}>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <span>Performance</span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6 space-y-6">
                  {/* Completion Rate */}
                  <div className={cn(
                    "p-4 rounded-lg",
                    isDark ? "bg-slate-700/30" : "bg-gray-50"
                  )}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={cn("text-sm font-semibold", isDark ? "text-slate-300" : "text-gray-700")}>
                        Completion Rate
                      </span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {stats?.rates.completion || 0}%
                      </span>
                    </div>
                    <Progress value={stats?.rates.completion || 0} className="h-2" />
                    <p className={cn("text-xs mt-2", isDark ? "text-slate-400" : "text-gray-600")}>
                      {stats?.totals.completed || 0} of {stats?.totals.appointments || 0} completed
                    </p>
                  </div>

                  <Separator className={isDark ? "bg-slate-700" : ""} />

                  {/* Stats List */}
                  <div className="space-y-3">
                    {[
                      { label: 'Total Appointments', value: stats?.totals.appointments || 0, icon: CalendarCheck, color: 'from-blue-500 to-cyan-500' },
                      { label: 'Active Patients', value: stats?.totals.patients || 0, icon: UserCheck, color: 'from-purple-500 to-pink-500' },
                      { label: 'Pending', value: stats?.totals.pending || 0, icon: Clock, color: 'from-orange-500 to-amber-500' },
                    ].map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <div key={item.label} className={cn(
                          "p-3 rounded-lg flex items-center justify-between",
                          isDark ? "bg-slate-700/30" : "bg-gray-50"
                        )}>
                          <div className="flex items-center gap-2.5">
                            <div className={cn(
                              "p-2 rounded-lg",
                              `bg-gradient-to-br ${item.color}`
                            )}>
                              <ItemIcon className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className={cn("text-xs font-medium", isDark ? "text-slate-400" : "text-gray-600")}>
                                {item.label}
                              </p>
                              <p className={cn("text-lg font-bold", isDark ? "text-white" : "text-gray-900")}>
                                {item.value}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* ALERT - Pending Appointments */}
              {stats?.totals.pending > 0 && (
                <Card className={cn(
                  "border-0 shadow-lg overflow-hidden border-l-4 border-l-orange-500",
                  isDark ? "bg-slate-800" : "bg-white"
                )}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-2.5 rounded-lg flex-shrink-0",
                        isDark ? "bg-orange-900/30" : "bg-orange-100"
                      )}>
                        <AlertCircle className={cn("h-5 w-5", isDark ? "text-orange-400" : "text-orange-600")} />
                      </div>
                      <div className="flex-1">
                        <h4 className={cn("font-semibold mb-1", isDark ? "text-white" : "text-gray-900")}>
                          Action Required
                        </h4>
                        <p className={cn("text-sm mb-3", isDark ? "text-slate-400" : "text-gray-600")}>
                          {stats.totals.pending} pending appointment{stats.totals.pending > 1 ? 's' : ''} need your attention
                        </p>
                        <Link href={`/doctor/appointments?id=${doctorId}`}>
                          <Button size="sm" variant="link" className="px-0 h-auto text-orange-600 hover:text-orange-700">
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
