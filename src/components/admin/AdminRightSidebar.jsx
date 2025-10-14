'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  User, 
  Activity, 
  Bell, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Plus,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import PropTypes from 'prop-types';

export default function AdminRightSidebar({
  upcomingAppointments = [],
  recentActivities = [],
  stats = {},
  notifications = []
}) {
  return (
    <aside className="hidden xl:block fixed right-0 top-0 h-screen w-80 bg-white border-l border-gray-200 overflow-y-auto pt-20 pb-6 px-4 space-y-4 z-30">
      {/* Quick Actions */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Plus className="h-4 w-4 text-white" />
            </div>
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            asChild 
            className="w-full justify-start bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Link href="/admin/appointments/book">
              <Calendar className="mr-2 h-4 w-4" />
              New Appointment
            </Link>
          </Button>
          <Button 
            asChild 
            variant="outline" 
            className="w-full justify-start border-2"
          >
            <Link href="/admin/doctors/new">
              <User className="mr-2 h-4 w-4" />
              Add Doctor
            </Link>
          </Button>
          <Button 
            asChild 
            variant="outline" 
            className="w-full justify-start border-2"
          >
            <Link href="/admin/patients/new">
              <User className="mr-2 h-4 w-4" />
              Add Patient
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Today's Overview */}
      <Card className="border-0 shadow-xl bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-2 bg-green-600 rounded-lg">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            Today&apos;s Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-50 to-green-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayCompleted || 0}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-600 rounded-lg">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayPending || 0}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card className="border-0 shadow-xl bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Clock className="h-4 w-4 text-white" />
              </div>
              Upcoming
            </CardTitle>
            <Badge variant="secondary">{upcomingAppointments.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No upcoming appointments</p>
            </div>
          ) : (
            upcomingAppointments.slice(0, 3).map((appointment, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={appointment.patientAvatar} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                    {appointment.patientName?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {appointment.patientName}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="h-3 w-3" />
                    {appointment.time}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            ))
          )}
          {upcomingAppointments.length > 3 && (
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/admin/appointments">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-0 shadow-xl bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-2 bg-orange-600 rounded-lg">
              <Activity className="h-4 w-4 text-white" />
            </div>
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivities.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent activities</p>
            </div>
          ) : (
            recentActivities.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'appointment' ? 'bg-blue-100' :
                  activity.type === 'doctor' ? 'bg-green-100' :
                  activity.type === 'patient' ? 'bg-purple-100' :
                  'bg-gray-100'
                }`}>
                  {activity.type === 'appointment' && <Calendar className="h-3 w-3 text-blue-600" />}
                  {activity.type === 'doctor' && <User className="h-3 w-3 text-green-600" />}
                  {activity.type === 'patient' && <User className="h-3 w-3 text-purple-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-900 leading-relaxed">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.time || 'Just now'}
                  </p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Notifications */}
      {notifications.length > 0 && (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-red-50 to-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 bg-red-600 rounded-lg">
                <Bell className="h-4 w-4 text-white" />
              </div>
              Alerts
              <Badge variant="destructive" className="ml-auto">{notifications.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {notifications.map((notification, index) => (
              <div 
                key={index} 
                className="flex items-start gap-2 p-3 rounded-lg bg-white border border-red-200"
              >
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-900">{notification.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* System Status */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-2 bg-green-600 rounded-lg">
              <Activity className="h-4 w-4 text-white" />
            </div>
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Database</span>
            <Badge className="bg-green-100 text-green-700">
              <CheckCircle className="h-3 w-3 mr-1" />
              Healthy
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">API</span>
            <Badge className="bg-green-100 text-green-700">
              <CheckCircle className="h-3 w-3 mr-1" />
              Online
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Storage</span>
            <Badge className="bg-green-100 text-green-700">
              <TrendingUp className="h-3 w-3 mr-1" />
              45% Used
            </Badge>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}

AdminRightSidebar.propTypes = {
  upcomingAppointments: PropTypes.arrayOf(PropTypes.shape({
    patientName: PropTypes.string,
    patientAvatar: PropTypes.string,
    time: PropTypes.string,
  })),
  recentActivities: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
    description: PropTypes.string,
    time: PropTypes.string,
  })),
  stats: PropTypes.shape({
    todayAppointments: PropTypes.number,
    todayCompleted: PropTypes.number,
    todayPending: PropTypes.number,
  }),
  notifications: PropTypes.arrayOf(PropTypes.shape({
    message: PropTypes.string,
  })),
};
