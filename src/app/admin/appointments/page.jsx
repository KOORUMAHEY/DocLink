
import { getAppointments } from '@/services/appointmentService';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Appointments
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mt-1">Manage and monitor all scheduled appointments</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button variant="outline" className="border-2 hover:bg-gray-50 transition-all duration-200 shadow-sm w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">New Appointment</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Total</p>
                  <p className="text-4xl font-bold text-blue-900">{appointments.length}</p>
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>+8% from last week</span>
                  </div>
                </div>
                <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/20 rounded-full -mr-10 -mt-10"></div>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-indigo-50 to-indigo-100/50">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-indigo-700 uppercase tracking-wide">Scheduled</p>
                  <p className="text-4xl font-bold text-indigo-900">
                    {appointments.filter(a => a.status === 'scheduled').length}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-indigo-600">
                    <Clock className="h-4 w-4" />
                    <span>Pending confirmation</span>
                  </div>
                </div>
                <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-200/20 rounded-full -mr-10 -mt-10"></div>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100/50">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-green-700 uppercase tracking-wide">Completed</p>
                  <p className="text-4xl font-bold text-green-900">
                    {appointments.filter(a => a.status === 'completed').length}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>95% success rate</span>
                  </div>
                </div>
                <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/20 rounded-full -mr-10 -mt-10"></div>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-red-50 to-red-100/50">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-red-700 uppercase tracking-wide">Cancelled</p>
                  <p className="text-4xl font-bold text-red-900">
                    {appointments.filter(a => a.status === 'cancelled').length}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <XCircle className="h-4 w-4" />
                    <span>5% cancellation rate</span>
                  </div>
                </div>
                <div className="h-16 w-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <XCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-200/20 rounded-full -mr-10 -mt-10"></div>
          </Card>
        </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search appointments by patient name or doctor..."
                  className="pl-10"
                />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="patient">Patient Name</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">All Appointments</CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-2">
                Complete list of all appointments in the system
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-5 w-5" />
              <span className="font-semibold">{appointments.length} total</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Suspense fallback={<AppointmentsTableSkeleton />}>
            <div className="relative w-full overflow-auto">
              <Table>
                <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                  <TableRow className="hover:bg-gray-100/50 border-b border-gray-200">
                    <TableHead className="font-bold text-gray-900 py-6 px-8">Patient</TableHead>
                    <TableHead className="hidden sm:table-cell font-bold text-gray-900 py-6 px-8 text-center">Doctor</TableHead>
                    <TableHead className="font-bold text-gray-900 py-6 px-8 text-center">Date & Time</TableHead>
                    <TableHead className="hidden md:table-cell font-bold text-gray-900 py-6 px-8 text-center">Status</TableHead>
                    <TableHead className="text-right font-bold text-gray-900 py-6 px-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-16">
                        <div className="flex flex-col items-center gap-6">
                          <div className="relative">
                            <div className="h-24 w-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                              <Calendar className="h-12 w-12 text-blue-600" />
                            </div>
                            <div className="absolute -top-2 -right-2 h-8 w-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                              <Plus className="h-4 w-4 text-white" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-gray-900">No appointments found</h3>
                            <p className="text-lg text-muted-foreground max-w-md">
                              Appointment records will appear here once appointments are scheduled. Start by booking your first appointment.
                            </p>
                          </div>
                          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3 text-lg">
                            <Plus className="mr-2 h-5 w-5" />
                            Book First Appointment
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    appointments.map((appt) => (
                      <TableRow key={appt.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200 border-b border-gray-100 group">
                        <TableCell className="py-6 px-8">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">
                              {appt.patientName}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ID: {appt.hospitalId}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-center py-6 px-8">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{appt.doctorName}</span>
                            <span className="text-sm text-muted-foreground">{appt.specialization}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center py-6 px-8">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">
                              {format(new Date(appt.appointmentDate), 'MMM dd, yyyy')}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(appt.appointmentDate), 'h:mm a')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-center py-6 px-8">
                          {getStatusBadge(appt.status)}
                        </TableCell>
                        <TableCell className="text-right py-6 px-8">
                          <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-lg">
                            <Eye className="h-5 w-5" />
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
    </div>
  );
}
