
import { getAppointments } from '@/features/appointments/services/appointmentService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Search, Filter, Eye, Clock, CheckCircle, XCircle, AlertCircle, Plus, TrendingUp, Activity } from 'lucide-react';
import { Suspense } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

function AppointmentsTableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-6 border border-gray-100 rounded-xl bg-gradient-to-r from-gray-50 to-white animate-pulse">
          <div className="h-12 w-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full"></div>
          <div className="space-y-3 flex-1">
            <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
          </div>
          <div className="space-y-2">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function getStatusBadge(status) {
  switch (status) {
    case 'scheduled':
      return <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300 hover:from-blue-200 hover:to-blue-300 transition-all duration-200 px-3 py-1"><Clock className="w-4 h-4 mr-2" />Scheduled</Badge>;
    case 'completed':
      return <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300 hover:from-green-200 hover:to-green-300 transition-all duration-200 px-3 py-1"><CheckCircle className="w-4 h-4 mr-2" />Completed</Badge>;
    case 'cancelled':
      return <Badge className="bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300 hover:from-red-200 hover:to-red-300 transition-all duration-200 px-3 py-1"><XCircle className="w-4 h-4 mr-2" />Cancelled</Badge>;
    default:
      return <Badge variant="secondary" className="bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 px-3 py-1"><AlertCircle className="w-4 h-4 mr-2" />{status}</Badge>;
  }
}

export default async function AdminAppointmentsPage() {
  const appointments = await getAppointments();

  // Serialize Firestore Timestamps for client compatibility
  const serializedAppointments = appointments.map(appt => ({
    ...appt,
    appointmentDate: appt.appointmentDate?.toDate?.() || new Date(appt.appointmentDate),
    createdAt: appt.createdAt?.toDate?.() || new Date(appt.createdAt),
    lastUpdated: appt.lastUpdated?.toDate?.() || new Date(appt.lastUpdated),
  }));

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Appointments"
        description="Manage and monitor all scheduled appointments"
        icon={Calendar}
        gradient="from-green-500 to-emerald-500"
        actions={[
          <Button 
            key="filter"
            variant="outline" 
            size="sm"
            className="border-2 hover:bg-gray-50 transition-all duration-200 shadow-sm"
          >
            <Filter className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>,
          <Button 
            key="new"
            size="sm"
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">New Appointment</span>
            <span className="sm:hidden">New</span>
          </Button>
        ]}
        stats={[
          {
            label: "Total",
            value: serializedAppointments.length,
            icon: Calendar,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600"
          },
          {
            label: "Scheduled",
            value: serializedAppointments.filter(a => a.status === 'scheduled').length,
            icon: Clock,
            iconBg: "bg-indigo-50",
            iconColor: "text-indigo-600"
          },
          {
            label: "Completed",
            value: serializedAppointments.filter(a => a.status === 'completed').length,
            icon: CheckCircle,
            iconBg: "bg-green-50",
            iconColor: "text-green-600"
          },
          {
            label: "Cancelled",
            value: serializedAppointments.filter(a => a.status === 'cancelled').length,
            icon: XCircle,
            iconBg: "bg-red-50",
            iconColor: "text-red-600"
          }
        ]}
      />

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search appointments..."
                  className="pl-10 h-9 sm:h-10 text-sm"
                />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-full sm:w-36 h-9 sm:h-10 text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full sm:w-32 h-9 sm:h-10 text-sm">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="patient">Patient</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card className="border-0 shadow-xl bg-white overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">All Appointments</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Complete list of all appointments
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="font-semibold">{serializedAppointments.length} total</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Suspense fallback={<AppointmentsTableSkeleton />}>
            <div className="relative w-full overflow-auto">
              <Table>
                <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                  <TableRow className="hover:bg-gray-100/50 border-b border-gray-200">
                    <TableHead className="font-bold text-gray-900 py-3 sm:py-4 px-3 sm:px-6">Patient</TableHead>
                    <TableHead className="hidden md:table-cell font-bold text-gray-900 py-3 sm:py-4 px-3 sm:px-6">Doctor</TableHead>
                    <TableHead className="font-bold text-gray-900 py-3 sm:py-4 px-3 sm:px-6">Date</TableHead>
                    <TableHead className="hidden sm:table-cell font-bold text-gray-900 py-3 sm:py-4 px-3 sm:px-6">Status</TableHead>
                    <TableHead className="text-right font-bold text-gray-900 py-3 sm:py-4 px-3 sm:px-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serializedAppointments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 sm:py-16">
                        <div className="flex flex-col items-center gap-4 sm:gap-6">
                          <div className="relative">
                            <div className="h-16 w-16 sm:h-20 sm:w-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                              <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
                            </div>
                          </div>
                          <div className="space-y-1 sm:space-y-2 px-4">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900">No appointments found</h3>
                            <p className="text-sm text-muted-foreground max-w-md">
                              Appointment records will appear here once scheduled.
                            </p>
                          </div>
                          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                            <Plus className="mr-2 h-4 w-4" />
                            Book First Appointment
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    serializedAppointments.map((appt) => (
                      <TableRow key={appt.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200 border-b border-gray-100 group">
                        <TableCell className="py-3 sm:py-4 px-3 sm:px-6">
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm sm:text-base text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                              {appt.patientName}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                              {appt.hospitalId}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell py-3 sm:py-4 px-3 sm:px-6">
                          <div className="flex flex-col">
                            <span className="font-medium text-sm text-gray-900 truncate">{appt.doctorName}</span>
                            <span className="text-xs text-muted-foreground truncate">{appt.specialization}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 sm:py-4 px-3 sm:px-6">
                          <div className="flex flex-col">
                            <span className="font-medium text-xs sm:text-sm text-gray-900">
                              {format(new Date(appt.appointmentDate), 'MMM dd, yyyy')}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(appt.appointmentDate), 'h:mm a')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell py-3 sm:py-4 px-3 sm:px-6">
                          {getStatusBadge(appt.status)}
                        </TableCell>
                        <TableCell className="text-right py-3 sm:py-4 px-3 sm:px-6">
                          <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-lg h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
