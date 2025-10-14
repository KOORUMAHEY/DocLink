'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Stethoscope, Users, Activity, TrendingUp, TrendingDown, Clock, CheckCircle, Bell, FileText, MessageSquare, Settings, Plus, Home, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getDashboardStats, getSystemLogs, getRecentActivities, getUpcomingAppointments } from '@/features/admin';
import DataVisualizations from '@/components/data-visualizations';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
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

export default function Dashboard() {
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
          getUpcomingAppointments(),
          getRecentActivities(),
          getSystemLogs()
        ]);
        
        setDashboardData(stats);
        setUpcomingAppointments(appointments);
        setRecentActivities(activities);
        setSystemLogs(logs);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const [stats, appointments, activities, logs] = await Promise.all([
        getDashboardStats(),
        getUpcomingAppointments(),
        getRecentActivities(),
        getSystemLogs()
      ]);
      
      setDashboardData(stats);
      setUpcomingAppointments(appointments);
      setRecentActivities(activities);
      setSystemLogs(logs);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !dashboardData) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Error Loading Dashboard</CardTitle>
            <CardDescription className="text-red-600">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleRefresh} variant="outline" className="border-red-300">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statsData = formatStatsData(dashboardData);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <AdminPageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening with your clinic today."
        icon={Home}
        gradient="from-blue-500 to-purple-500"
        stats={statsData}
        actions={[
          <Button
            key="refresh"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="border-2 hover:bg-gray-50"
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
            <span className="sm:hidden">Refresh</span>
          </Button>,
          <Button
            key="reports"
            size="sm"
            asChild
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Link href="/admin/reports">
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">View Reports</span>
              <span className="sm:hidden">Reports</span>
            </Link>
          </Button>
        ]}
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Calendar className="w-8 h-8 text-blue-600" />
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">Today</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold text-gray-900 mb-1">Manage Appointments</h3>
            <p className="text-sm text-gray-600 mb-4">View and manage today's schedule</p>
            <Link href={ROUTES.ADMIN.APPOINTMENTS}>
              <Button className="w-full" variant="outline">View Schedule</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Users className="w-8 h-8 text-green-600" />
              <Badge variant="secondary" className="bg-green-100 text-green-700">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold text-gray-900 mb-1">Patient Records</h3>
            <p className="text-sm text-gray-600 mb-4">Access patient information</p>
            <Link href={ROUTES.ADMIN.PATIENTS}>
              <Button className="w-full" variant="outline">View Patients</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Stethoscope className="w-8 h-8 text-purple-600" />
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">Staff</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold text-gray-900 mb-1">Doctor Management</h3>
            <p className="text-sm text-gray-600 mb-4">Manage doctor profiles</p>
            <Link href={ROUTES.ADMIN.DOCTORS}>
              <Button className="w-full" variant="outline">View Doctors</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-orange-200 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Settings className="w-8 h-8 text-orange-600" />
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">System</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold text-gray-900 mb-1">System Settings</h3>
            <p className="text-sm text-gray-600 mb-4">Configure system options</p>
            <Link href={ROUTES.ADMIN.SETTINGS}>
              <Button className="w-full" variant="outline">Open Settings</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Data Visualizations */}
      {dashboardData && (
        <div className="space-y-6">
          <DataVisualizations 
            data={dashboardData}
            className="w-full"
          />
        </div>
      )}

      {/* Two Column Layout for Appointments and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card className="border-blue-100">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
                  <CardDescription>Next 5 scheduled appointments</CardDescription>
                </div>
              </div>
              <Link href={ROUTES.ADMIN.APPOINTMENTS}>
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {upcomingAppointments.slice(0, 5).map((apt) => (
                <div key={apt.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                  <div className="flex-shrink-0">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={apt.patient?.avatar} alt={apt.patient?.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {apt.patient?.name?.split(' ').map(n => n[0]).join('') || 'P'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-gray-900 truncate">{apt.patient?.name}</p>
                        <p className="text-sm text-gray-600">Dr. {apt.doctor?.name}</p>
                      </div>
                      <Badge 
                        variant="secondary"
                        className={
                          apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                          apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }
                      >
                        {apt.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {apt.time}
                      </span>
                      <span>{apt.date}</span>
                    </div>
                  </div>
                </div>
              ))}
              {(!upcomingAppointments || upcomingAppointments.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No upcoming appointments</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="border-purple-100">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Recent Activities</CardTitle>
                  <CardDescription>Latest system activities</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                  <div className={`flex-shrink-0 p-2 rounded-full ${
                    activity.type === 'appointment' ? 'bg-blue-100' :
                    activity.type === 'patient' ? 'bg-green-100' :
                    activity.type === 'doctor' ? 'bg-purple-100' :
                    'bg-gray-100'
                  }`}>
                    {activity.type === 'appointment' ? <Calendar className="w-4 h-4 text-blue-600" /> :
                     activity.type === 'patient' ? <Users className="w-4 h-4 text-green-600" /> :
                     activity.type === 'doctor' ? <Stethoscope className="w-4 h-4 text-purple-600" /> :
                     <Bell className="w-4 h-4 text-gray-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-2">{activity.time}</p>
                  </div>
                </div>
              ))}
              {(!recentActivities || recentActivities.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No recent activities</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Logs */}
      <Card className="border-orange-100">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-lg">System Logs</CardTitle>
                <CardDescription>Recent system events and notifications</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm">View All Logs</Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {systemLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="secondary"
                    className={
                      log.level === 'error' ? 'bg-red-100 text-red-700' :
                      log.level === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                      log.level === 'success' ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'
                    }
                  >
                    {log.level}
                  </Badge>
                  <span className="text-sm font-medium text-gray-900">{log.message}</span>
                </div>
                <span className="text-xs text-gray-400">{log.timestamp}</span>
              </div>
            ))}
            {(!systemLogs || systemLogs.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No system logs available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
