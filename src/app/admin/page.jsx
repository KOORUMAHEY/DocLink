
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Stethoscope, Users, Activity, TrendingUp, TrendingDown, Clock, CheckCircle, Bell, FileText, MessageSquare, Settings, Plus, Home, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getDashboardStats, getSystemLogs, getRecentActivities, getUpcomingAppointments } from '@/features/admin';
import DataVisualizations from '@/components/data-visualizations';
import { useState, useEffect } from 'react';
import { ROUTES } from '@/config/routes';

function Sparkline({ data, color }) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 20;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
}

const formatStatsData = (dashboardData) => {
  if (!dashboardData) return [];
  
  return [
    {
      title: "Total Doctors",
      value: dashboardData.totalDoctors.toString(),
      icon: Stethoscope,
      description: `Active: ${dashboardData.activeDoctors} / Inactive: ${dashboardData.inactiveDoctors}`,
      href: "/admin/doctors",
      trend: dashboardData.activeDoctors > dashboardData.inactiveDoctors ? "up" : "down",
      color: "green"
    },
    {
      title: "Total Appointments",
      value: dashboardData.totalAppointments.toString(),
      icon: Calendar,
      description: `Scheduled: ${dashboardData.scheduledAppointments} / Completed: ${dashboardData.completedAppointments} / Cancelled: ${dashboardData.cancelledAppointments}`,
      href: "/admin/appointments",
      trend: dashboardData.scheduledAppointments > dashboardData.cancelledAppointments ? "up" : "down",
      color: "blue"
    },
    {
      title: "Total Patients",
      value: dashboardData.totalPatients.toString(),
      icon: Users,
      description: `New this month: ${dashboardData.newPatientsThisMonth}`,
      href: "/admin/patients",
      trend: dashboardData.newPatientsThisMonth > 0 ? "up" : "neutral",
      color: "purple"
    },
    {
      title: "Clinic Occupancy",
      value: `${dashboardData.occupancyRate}%`,
      icon: Activity,
      description: "Based on today's appointments",
      href: "#",
      trend: dashboardData.occupancyRate >= 70 ? "up" : dashboardData.occupancyRate >= 50 ? "neutral" : "down",
      color: "orange"
    }
  ];
};

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load dashboard data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [stats, appointments, activities, logs] = await Promise.all([
          getDashboardStats(),
          getUpcomingAppointments(5),
          getRecentActivities(10),
          getSystemLogs(20)
        ]);
        
        setDashboardData(stats);
        setUpcomingAppointments(appointments);
        setRecentActivities(activities);
        setSystemLogs(logs);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
        // Set default values
        setDashboardData({
          totalAppointments: 0,
          scheduledAppointments: 0,
          completedAppointments: 0,
          cancelledAppointments: 0,
          activeDoctors: 0,
          totalDoctors: 0,
          inactiveDoctors: 0,
          totalPatients: 0,
          newPatientsThisMonth: 0,
          occupancyRate: 0
        });
        setUpcomingAppointments([]);
        setRecentActivities([]);
        setSystemLogs([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center max-w-lg">
          <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Activity className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700 text-white">
            Retry Loading
          </Button>
        </div>
      </div>
    );
  }

  const stats = formatStatsData(dashboardData);
  const enhancedStats = stats.map(stat => ({
    ...stat,
    value: stat.title === "Total Doctors" ? dashboardData.totalDoctors.toString() :
           stat.title === "Total Appointments" ? dashboardData.totalAppointments.toLocaleString() :
           stat.title === "Total Patients" ? dashboardData.totalPatients.toString() :
           stat.title === "Clinic Occupancy" ? `${dashboardData.occupancyRate}%` :
           stat.value,
    description: stat.title === "Total Doctors" ? `Active: ${dashboardData.activeDoctors} / Inactive: ${dashboardData.inactiveDoctors}` :
                stat.title === "Total Appointments" ? `Scheduled: ${dashboardData.scheduledAppointments} / Completed: ${dashboardData.completedAppointments} / Cancelled: ${dashboardData.cancelledAppointments}` :
                stat.title === "Total Patients" ? `New this month: ${dashboardData.newPatientsThisMonth}` :
                stat.description
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 transition-colors">
      <div className="space-y-6 md:space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-start sm:space-y-0" role="banner">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent" id="main-heading">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button variant="outline" className="border-2 hover:bg-gray-50 transition-all duration-200 shadow-sm w-full sm:w-auto" asChild>
                <Link href={ROUTES.ADMIN.APPOINTMENTS}>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">View Appointments</span>
                  <span className="sm:hidden">Appointments</span>
                </Link>
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto" asChild>
                <Link href={ROUTES.ADMIN.DOCTORS_NEW}>
                  <Stethoscope className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Add Doctor</span>
                  <span className="sm:hidden">Add Doctor</span>
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Modern Filters and Controls */}
        <section className="bg-gradient-to-r from-white via-blue-50/30 to-white backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 shadow-lg" aria-labelledby="filters-heading">
          <h2 id="filters-heading" className="sr-only">Dashboard Filters and Controls</h2>

          {/* Filter Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Dashboard Controls</h3>
              <p className="text-sm text-gray-600">Filter and customize your view</p>
            </div>
          </div>

          {/* Filter Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Date Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                Date Range
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:border-blue-400 transition-colors" aria-label="Select date range">
                <option>Today</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Last 6 months</option>
                <option>Last year</option>
                <option>Custom range</option>
              </select>
            </div>

            {/* Custom Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-500" />
                Custom Dates
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="flex-1 px-3 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  placeholder="From"
                  aria-label="Start date"
                />
                <input
                  type="date"
                  className="flex-1 px-3 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  placeholder="To"
                  aria-label="End date"
                />
              </div>
            </div>

            {/* Search Filter */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                Search & Filter
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search patients, doctors, appointments..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    aria-label="Search patients and doctors"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <Button variant="outline" className="px-6 py-3 border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 rounded-xl shadow-sm" aria-label="Apply filters">
                  <Settings className="mr-2 h-4 w-4" />
                  Apply
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
            <Button variant="outline" size="sm" className="border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl shadow-sm" aria-label="Export dashboard data">
              <FileText className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button variant="outline" size="sm" className="border-2 border-green-200 hover:border-green-400 hover:bg-green-50 rounded-xl shadow-sm" aria-label="Save current filter settings">
              <CheckCircle className="mr-2 h-4 w-4" />
              Save View
            </Button>
            <Button variant="outline" size="sm" className="border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 rounded-xl shadow-sm" aria-label="Reset all filters">
              <Activity className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
            <Button variant="outline" size="sm" className="border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50 rounded-xl shadow-sm" aria-label="Schedule automated reports">
              <MessageSquare className="mr-2 h-4 w-4" />
              Schedule Report
            </Button>
          </div>
        </section>

        {/* Stats Grid */}
        <section aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">Dashboard Statistics</h2>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {enhancedStats.map(stat => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === 'up' ? TrendingUp : stat.trend === 'down' ? TrendingDown : Clock;

            return (
              <Card key={stat.title} className="relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white via-gray-50/30 to-white hover:-translate-y-2 hover:scale-[1.02] cursor-pointer group animate-in fade-in-0 slide-in-from-bottom-4" role="button" tabIndex={0} aria-label={`${stat.title}: ${stat.value}. ${stat.description}. Trend: ${stat.trendValue || 'stable'}`} style={{ animationDelay: `${enhancedStats.indexOf(stat) * 100}ms` }}>
                {/* Animated gradient border */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
                  stat.color === 'blue' ? 'from-blue-500 via-blue-600 to-blue-700' :
                  stat.color === 'green' ? 'from-green-500 via-green-600 to-green-700' :
                  stat.color === 'purple' ? 'from-purple-500 via-purple-600 to-purple-700' :
                  'from-orange-500 via-orange-600 to-orange-700'
                } group-hover:animate-pulse`} aria-hidden="true" />

                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500" style={{
                  backgroundImage: `radial-gradient(circle at 20% 80%, ${stat.color === 'blue' ? '#3b82f6' : stat.color === 'green' ? '#10b981' : stat.color === 'purple' ? '#8b5cf6' : '#f97316'} 0%, transparent 50%)`
                }} aria-hidden="true" />

                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 relative z-10">
                  <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-gray-700 transition-colors duration-300">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 sm:p-3 rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 ${
                    stat.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' :
                    stat.color === 'green' ? 'bg-gradient-to-br from-green-500 to-green-600 text-white' :
                    stat.color === 'purple' ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white' :
                    'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
                  }`} aria-hidden="true">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-pulse" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0 p-4 sm:p-6 relative z-10">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors duration-300" aria-label={`Current value: ${stat.value}`}>{stat.value}</div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant={stat.trend === 'up' ? 'default' : stat.trend === 'down' ? 'destructive' : 'secondary'} className="text-xs px-2 py-1 group-hover:scale-105 transition-transform duration-300" aria-label={`Trend indicator: ${stat.trendValue || 'stable'}`}>
                      <TrendIcon className="w-3 h-3 mr-1" aria-hidden="true" />
                      {stat.description}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="group-hover:scale-105 transition-transform duration-300">
                      <Sparkline
                        data={stat.trendData}
                        color={stat.color === 'blue' ? '#3b82f6' : stat.color === 'green' ? '#10b981' : stat.color === 'purple' ? '#8b5cf6' : '#f97316'}
                      />
                    </div>
                  </div>
                  {stat.href !== '#' && (
                    <Link href={stat.href} className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-all duration-300 inline-flex items-center gap-1 group-hover:gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded" aria-label={`View ${stat.title} details`}>
                      View details
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
          </div>
        </section>

        {/* Data Visualizations */}
        <DataVisualizations />

        {/* Quick Actions & Recent Activity */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden relative">
            {/* Floating background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-100/50 to-transparent rounded-full -translate-y-16 translate-x-16" aria-hidden="true"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-100/50 to-transparent rounded-full translate-y-12 -translate-x-12" aria-hidden="true"></div>

            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50 border-b border-gray-200 p-4 sm:p-6 relative z-10">
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
            <CardContent className="p-4 sm:p-6 space-y-4 relative z-10">
              {/* Floating Action Pills */}
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="h-12 px-4 bg-gradient-to-r from-green-50 to-green-100/50 border-2 border-green-200 hover:border-green-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-full font-medium" asChild>
                  <Link href={ROUTES.ADMIN.DOCTORS_NEW} className="flex items-center gap-2">
                    <div className="p-1.5 bg-green-500 rounded-full">
                      <Plus className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm">Add Doctor</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-12 px-4 bg-gradient-to-r from-blue-50 to-blue-100/50 border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-full font-medium" asChild>
                  <Link href={ROUTES.ADMIN.APPOINTMENTS} className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-500 rounded-full">
                      <Calendar className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm">Book Appointment</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-12 px-4 bg-gradient-to-r from-purple-50 to-purple-100/50 border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-full font-medium" asChild>
                  <Link href={ROUTES.ADMIN.PATIENTS} className="flex items-center gap-2">
                    <div className="p-1.5 bg-purple-500 rounded-full">
                      <Users className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm">Add Patient</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-12 px-4 bg-gradient-to-r from-orange-50 to-orange-100/50 border-2 border-orange-200 hover:border-orange-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-full font-medium" asChild>
                  <Link href="#" className="flex items-center gap-2">
                    <div className="p-1.5 bg-orange-500 rounded-full">
                      <FileText className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm">Export Reports</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-12 px-4 bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-200 hover:border-red-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-full font-medium" asChild>
                  <Link href="#" className="flex items-center gap-2">
                    <div className="p-1.5 bg-red-500 rounded-full">
                      <MessageSquare className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm">Broadcast Message</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-12 px-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-2 border-gray-200 hover:border-gray-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-full font-medium" asChild>
                  <Link href="#" className="flex items-center gap-2">
                    <div className="p-1.5 bg-gray-500 rounded-full">
                      <Settings className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm">System Settings</span>
                  </Link>
                </Button>
              </div>

              {/* Role-Based Actions */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Super Admin Actions
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="ghost" size="sm" className="h-8 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 hover:border-indigo-300 rounded-full text-xs font-medium transition-all duration-200" asChild>
                    <Link href="#" className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      Audit Logs
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 hover:border-indigo-300 rounded-full text-xs font-medium transition-all duration-200" asChild>
                    <Link href="#" className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Analytics
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 hover:border-indigo-300 rounded-full text-xs font-medium transition-all duration-200" asChild>
                    <Link href="#" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      User Management
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 hover:border-indigo-300 rounded-full text-xs font-medium transition-all duration-200" asChild>
                    <Link href="#" className="flex items-center gap-1">
                      <Settings className="h-3 w-3" />
                      System Config
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Upcoming Appointments</CardTitle>
                    <CardDescription className="text-sm sm:text-base text-muted-foreground mt-1">Next scheduled appointments</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/appointments" className="text-blue-600 hover:text-blue-700">
                    See All →
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.slice(0, 4).map((appointment, index) => {
                  const statusColors = {
                    scheduled: 'border-green-500',
                    confirmed: 'border-blue-500',
                    pending: 'border-yellow-500',
                    cancelled: 'border-red-500'
                  };
                  
                  const badgeColors = {
                    scheduled: 'bg-green-100 text-green-800',
                    confirmed: 'bg-blue-100 text-blue-800',
                    pending: 'bg-yellow-100 text-yellow-800',
                    cancelled: 'bg-red-100 text-red-800'
                  };

                  return (
                    <div key={appointment.id || index} className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border-l-4 ${statusColors[appointment.status] || 'border-gray-500'}`}>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {appointment.doctorName} - {appointment.patientName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(appointment.appointmentDate).toLocaleDateString()}, {appointment.time || 'TBD'}
                        </p>
                      </div>
                      <Badge className={badgeColors[appointment.status] || 'bg-gray-100 text-gray-800'}>
                        {appointment.status || 'Unknown'}
                      </Badge>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No upcoming appointments</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden relative">
            {/* Timeline background */}
            <div className="absolute left-8 top-24 bottom-8 w-0.5 bg-gradient-to-b from-purple-200 via-purple-300 to-purple-200" aria-hidden="true"></div>

            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50 border-b border-gray-200 p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Recent Activity</CardTitle>
                  <CardDescription className="text-sm sm:text-base text-muted-foreground mt-1">Latest system events and updates</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-6 relative">
              {/* Timeline Items with Avatars */}
              {recentActivities.length > 0 ? (
                recentActivities.slice(0, 4).map((activity, index) => {
                  const getActivityIcon = (type) => {
                    switch (type) {
                      case 'appointment_completed':
                        return <CheckCircle className="h-2.5 w-2.5 text-white" />;
                      case 'patient_registered':
                        return <Users className="h-2.5 w-2.5 text-white" />;
                      case 'doctor_added':
                        return <Stethoscope className="h-2.5 w-2.5 text-white" />;
                      case 'system_backup':
                        return <Activity className="h-2.5 w-2.5 text-white" />;
                      case 'emergency_broadcast':
                        return <MessageSquare className="h-2.5 w-2.5 text-white" />;
                      default:
                        return <Activity className="h-2.5 w-2.5 text-white" />;
                    }
                  };

                  const getActivityColor = (type) => {
                    switch (type) {
                      case 'appointment_completed':
                        return 'bg-green-500';
                      case 'patient_registered':
                        return 'bg-blue-500';
                      case 'doctor_added':
                        return 'bg-orange-500';
                      case 'system_backup':
                        return 'bg-yellow-500';
                      case 'emergency_broadcast':
                        return 'bg-red-500';
                      default:
                        return 'bg-gray-500';
                    }
                  };

                  const getBadgeColor = (type) => {
                    switch (type) {
                      case 'appointment_completed':
                        return 'bg-green-100 text-green-700';
                      case 'patient_registered':
                        return 'bg-blue-100 text-blue-700';
                      case 'doctor_added':
                        return 'bg-orange-100 text-orange-700';
                      case 'system_backup':
                        return 'bg-yellow-100 text-yellow-700';
                      case 'emergency_broadcast':
                        return 'bg-red-100 text-red-700';
                      default:
                        return 'bg-gray-100 text-gray-700';
                    }
                  };

                  const getBadgeText = (type) => {
                    switch (type) {
                      case 'appointment_completed':
                        return 'Completed';
                      case 'patient_registered':
                        return 'Registration';
                      case 'doctor_added':
                        return 'New Doctor';
                      case 'system_backup':
                        return 'System';
                      case 'emergency_broadcast':
                        return 'Emergency';
                      default:
                        return 'Activity';
                    }
                  };

                  return (
                    <div key={activity.id || index} className="flex items-start gap-4 relative">
                      <div className="relative z-10">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-lg">
                          <AvatarImage src={activity.avatar || ""} alt={activity.user || "User"} />
                          <AvatarFallback className={`${getActivityColor(activity.type)} text-white font-semibold`}>
                            {activity.initials || activity.user?.slice(0, 2).toUpperCase() || 'UN'}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getActivityColor(activity.type)} rounded-full border-2 border-white flex items-center justify-center`}>
                          {getActivityIcon(activity.type)}
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                          <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className={`text-xs ${getBadgeColor(activity.type)}`}>
                              {getBadgeText(activity.type)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {activity.timestamp instanceof Date 
                                ? (() => {
                                    const now = new Date();
                                    const diff = now - activity.timestamp;
                                    const minutes = Math.floor(diff / (1000 * 60));
                                    const hours = Math.floor(diff / (1000 * 60 * 60));
                                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                                    
                                    if (minutes < 60) return `${minutes} minutes ago`;
                                    if (hours < 24) return `${hours} hours ago`;
                                    return `${days} days ago`;
                                  })()
                                : activity.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent activities</p>
                </div>
              )}

              <Button variant="ghost" size="sm" className="w-full mt-6 bg-purple-50 hover:bg-purple-100 text-purple-600 hover:text-purple-700 rounded-lg py-3 font-medium" asChild>
                <Link href="#" className="flex items-center justify-center gap-2">
                  View Full Activity Log
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Logs and Security Monitoring */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                <Activity className="h-5 w-5 text-red-500" />
                System Logs
              </CardTitle>
              <CardDescription>Security events and admin actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {systemLogs.length > 0 ? (
                systemLogs.slice(0, 4).map((log, index) => {
                  const getLogIcon = (level) => {
                    switch (level) {
                      case 'error':
                        return <Activity className="h-3 w-3 text-red-600" />;
                      case 'warning':
                        return <Settings className="h-3 w-3 text-yellow-600" />;
                      case 'info':
                        return <Users className="h-3 w-3 text-blue-600" />;
                      case 'success':
                        return <CheckCircle className="h-3 w-3 text-green-600" />;
                      default:
                        return <Activity className="h-3 w-3 text-gray-600" />;
                    }
                  };

                  const getLogBgColor = (level) => {
                    switch (level) {
                      case 'error':
                        return 'bg-red-50 border-red-200';
                      case 'warning':
                        return 'bg-yellow-50 border-yellow-200';
                      case 'info':
                        return 'bg-blue-50 border-blue-200';
                      case 'success':
                        return 'bg-green-50 border-green-200';
                      default:
                        return 'bg-gray-50 border-gray-200';
                    }
                  };

                  const getLogIconBgColor = (level) => {
                    switch (level) {
                      case 'error':
                        return 'bg-red-100';
                      case 'warning':
                        return 'bg-yellow-100';
                      case 'info':
                        return 'bg-blue-100';
                      case 'success':
                        return 'bg-green-100';
                      default:
                        return 'bg-gray-100';
                    }
                  };

                  const getLogTextColor = (level) => {
                    switch (level) {
                      case 'error':
                        return 'text-red-900';
                      case 'warning':
                        return 'text-yellow-900';
                      case 'info':
                        return 'text-blue-900';
                      case 'success':
                        return 'text-green-900';
                      default:
                        return 'text-gray-900';
                    }
                  };

                  const getLogDetailColor = (level) => {
                    switch (level) {
                      case 'error':
                        return 'text-red-700';
                      case 'warning':
                        return 'text-yellow-700';
                      case 'info':
                        return 'text-blue-700';
                      case 'success':
                        return 'text-green-700';
                      default:
                        return 'text-gray-700';
                    }
                  };

                  return (
                    <div key={log.id || index} className={`flex items-start gap-3 p-3 rounded-lg border ${getLogBgColor(log.level)}`}>
                      <div className={`p-1 rounded-full ${getLogIconBgColor(log.level)}`}>
                        {getLogIcon(log.level)}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${getLogTextColor(log.level)}`}>{log.message}</p>
                        <p className={`text-xs ${getLogDetailColor(log.level)}`}>
                          {log.details} • {log.timestamp instanceof Date 
                            ? (() => {
                                const now = new Date();
                                const diff = now - log.timestamp;
                                const minutes = Math.floor(diff / (1000 * 60));
                                const hours = Math.floor(diff / (1000 * 60 * 60));
                                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                                
                                if (minutes < 60) return `${minutes} minutes ago`;
                                if (hours < 24) return `${hours} hours ago`;
                                return `${days} days ago`;
                              })()
                            : log.timestamp}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No system logs available</p>
                </div>
              )}
              <Button variant="ghost" size="sm" className="w-full mt-4" asChild>
                <Link href="#" className="text-purple-600 hover:text-purple-700">
                  View Security Logs →
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Analytics & Export Hub */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100/50 border-b border-gray-200 p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Analytics & Export Hub</CardTitle>
                  <CardDescription className="text-sm sm:text-base text-muted-foreground mt-1">Custom reports and actionable exports</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Button variant="outline" className="justify-start h-12 border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200" asChild>
                  <Link href="#" className="flex flex-col items-start p-3">
                    <FileText className="h-5 w-5 mb-2 text-blue-600" />
                    <span className="font-medium">Patient Reports</span>
                    <span className="text-xs text-muted-foreground">Demographics & history</span>
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start h-12 border-2 hover:bg-green-50 hover:border-green-300 transition-all duration-200" asChild>
                  <Link href="#" className="flex flex-col items-start p-3">
                    <Calendar className="h-5 w-5 mb-2 text-green-600" />
                    <span className="font-medium">Appointment Analytics</span>
                    <span className="text-xs text-muted-foreground">Utilization & trends</span>
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start h-12 border-2 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200" asChild>
                  <Link href="#" className="flex flex-col items-start p-3">
                    <Users className="h-5 w-5 mb-2 text-purple-600" />
                    <span className="font-medium">Doctor Performance</span>
                    <span className="text-xs text-muted-foreground">Ratings & activity</span>
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start h-12 border-2 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200" asChild>
                  <Link href="#" className="flex flex-col items-start p-3">
                    <Activity className="h-5 w-5 mb-2 text-orange-600" />
                    <span className="font-medium">System Audit Logs</span>
                    <span className="text-xs text-muted-foreground">Security & changes</span>
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start h-12 border-2 hover:bg-red-50 hover:border-red-300 transition-all duration-200" asChild>
                  <Link href="#" className="flex flex-col items-start p-3">
                    <CheckCircle className="h-5 w-5 mb-2 text-red-600" />
                    <span className="font-medium">Compliance Reports</span>
                    <span className="text-xs text-muted-foreground">HIPAA & standards</span>
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start h-12 border-2 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200" asChild>
                  <Link href="#" className="flex flex-col items-start p-3">
                    <Settings className="h-5 w-5 mb-2 text-gray-600" />
                    <span className="font-medium">Custom Exports</span>
                    <span className="text-xs text-muted-foreground">Build your own reports</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Professional Footer */}
      <footer className="mt-16 pt-12 border-t border-gray-200/60 bg-gradient-to-r from-gray-50/50 to-white/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Stethoscope className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">DocLink</h3>
                  <p className="text-sm text-gray-600">Healthcare Management System</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Streamlining healthcare administration with modern technology and exceptional user experience.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Quick Links</h4>
              <div className="grid grid-cols-2 gap-3">
                <Link href={ROUTES.ADMIN.APPOINTMENTS} className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  <Calendar className="h-4 w-4" />
                  Appointments
                </Link>
                <Link href={ROUTES.ADMIN.DOCTORS} className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  <Stethoscope className="h-4 w-4" />
                  Doctors
                </Link>
                <Link href={ROUTES.ADMIN.PATIENTS} className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  <Users className="h-4 w-4" />
                  Patients
                </Link>
                <Link href={ROUTES.ADMIN.DASHBOARD} className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
              </div>
            </div>

            {/* Contact & Status */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">System Status</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">System Online</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-blue-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">HIPAA Compliant</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-purple-600">
                    <Activity className="h-4 w-4" />
                    <span className="text-sm font-medium">99.9% Uptime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-gray-200/60">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span>© 2025 DocLink. All rights reserved.</span>
                <span className="hidden md:block">•</span>
                <Link href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
                <span className="hidden md:block">•</span>
                <Link href="#" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">v2.1.0</span>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-gray-100 rounded-full" aria-label="Help documentation">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-gray-100 rounded-full" aria-label="System settings">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-gray-100 rounded-full" aria-label="Contact support">
                    <Bell className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
