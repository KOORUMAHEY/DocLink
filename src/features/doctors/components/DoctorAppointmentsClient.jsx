
'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppointmentDetailsClient } from '@/components/appointment-details-client';
import { FileText, Calendar, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, Activity, Search, Filter, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function DoctorAppointmentsClient({ doctor, initialAppointments }) { // eslint-disable-line react/prop-types
  const [appointments, setAppointments] = useState(initialAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formattedDates, setFormattedDates] = useState({});
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    setIsClient(true);
    const newFormattedDates = {};
    initialAppointments.forEach(appt => {
      const date = new Date(appt.appointmentDate);
      if (!isNaN(date)) {
        newFormattedDates[appt.id] = format(date, 'PPp');
      }
    });
    setFormattedDates(newFormattedDates);
    setAppointments(initialAppointments);
  }, [initialAppointments]);

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
  };

  // Filter and search appointments
  const filteredAppointments = appointments.filter(appt => {
    const matchesSearch = searchTerm === '' ||
      appt.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.hospitalId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || appt.status === statusFilter;

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'date':
        aValue = new Date(a.appointmentDate);
        bValue = new Date(b.appointmentDate);
        break;
      case 'patient':
        aValue = a.patientName || '';
        bValue = b.patientName || '';
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        return 0;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Find the appointment from the list to ensure we have the latest data
  const currentlySelectedAppointment = filteredAppointments.find(a => a.id === selectedAppointment?.id) || selectedAppointment;

  const getStatusBadge = (status) => {
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
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                My Appointments
              </h1>
              <p className="text-lg text-muted-foreground mt-1">Manage your scheduled appointments</p>
            </div>
          </div>
        </div>
      </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search patients or IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="patient">Sort by Patient</option>
              <option value="status">Sort by Status</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredAppointments.length} of {appointments.length} appointments
          </div>
        </div>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1 sm:space-y-2">
                  <p className="text-xs sm:text-sm font-semibold text-blue-700 uppercase tracking-wide">Total</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-900">{appointments.length}</p>
                  <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-blue-600">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>All appointments</span>
                  </div>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-blue-200/20 rounded-full -mr-6 sm:-mr-8 -mt-6 sm:-mt-8"></div>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-indigo-50 to-indigo-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-indigo-700 uppercase tracking-wide">Scheduled</p>
                  <p className="text-3xl font-bold text-indigo-900">
                    {appointments.filter(a => a.status === 'scheduled').length}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-indigo-600">
                    <Clock className="h-4 w-4" />
                    <span>Upcoming</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-200/20 rounded-full -mr-8 -mt-8"></div>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-green-700 uppercase tracking-wide">Completed</p>
                  <p className="text-3xl font-bold text-green-900">
                    {appointments.filter(a => a.status === 'completed').length}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Finished</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-16 h-16 bg-green-200/20 rounded-full -mr-8 -mt-8"></div>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-red-50 to-red-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-red-700 uppercase tracking-wide">Cancelled</p>
                  <p className="text-3xl font-bold text-red-900">
                    {appointments.filter(a => a.status === 'cancelled').length}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <XCircle className="h-4 w-4" />
                    <span>No shows</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-16 h-16 bg-red-200/20 rounded-full -mr-8 -mt-8"></div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Appointments for {doctor.name}</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground mt-2">
                      A list of your scheduled appointments. Showing {filteredAppointments.length} of {appointments.length} appointments.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-5 w-5" />
                    <span className="font-semibold">{appointments.length} total</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {filteredAppointments.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="flex flex-col items-center gap-6">
                      <div className="relative">
                        <div className="h-20 w-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                          <Calendar className="h-10 w-10 text-blue-600" />
                        </div>
                        <div className="absolute -top-2 -right-2 h-8 w-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                          <Activity className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-gray-900">No appointments scheduled</h3>
                        <p className="text-lg text-muted-foreground max-w-md">
                          You don&apos;t have any appointments scheduled at the moment. New appointments will appear here.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full overflow-auto">
                    <Table>
                      <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                        <TableRow className="hover:bg-gray-100/50 border-b border-gray-200">
                          <TableHead className="font-bold text-gray-900 py-6 px-8">Patient</TableHead>
                          <TableHead className="hidden sm:table-cell font-bold text-gray-900 py-6 px-8 text-center">Date & Time</TableHead>
                          <TableHead className="hidden md:table-cell font-bold text-gray-900 py-6 px-8 text-center">Status</TableHead>
                          <TableHead className="text-right font-bold text-gray-900 py-6 px-8">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAppointments.map((appt) => (
                          <TableRow key={appt.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200 border-b border-gray-100 group cursor-pointer" onClick={() => handleViewDetails(appt)}>
                            <TableCell className="py-6 px-8">
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                  <span className="text-white font-semibold text-sm">
                                    {appt.patientName ? appt.patientName.charAt(0).toUpperCase() : 'P'}
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">
                                    {appt.patientName}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    ID: {appt.hospitalId}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-center py-6 px-8">
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-900">
                                  {isClient && formattedDates[appt.id] ? format(new Date(appt.appointmentDate), 'MMM dd, yyyy') : <Skeleton className="h-4 w-20" />}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {isClient && formattedDates[appt.id] ? format(new Date(appt.appointmentDate), 'h:mm a') : <Skeleton className="h-3 w-16" />}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-center py-6 px-8">
                              {getStatusBadge(appt.status)}
                            </TableCell>
                            <TableCell className="text-right py-6 px-8">
                              <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-lg" onClick={(e) => { e.stopPropagation(); handleViewDetails(appt);}}>
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            {currentlySelectedAppointment ? (
              <div className="sticky top-20">
                <AppointmentDetailsClient
                  key={currentlySelectedAppointment.id}
                  appointment={currentlySelectedAppointment}
                  role="doctor"
                />
              </div>
            ) : (
              <Card className="sticky top-20 border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
                <CardContent className="flex flex-col items-center justify-center h-[calc(100vh-15rem)] text-center p-8">
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="h-20 w-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                        <FileText className="h-10 w-10 text-blue-600" />
                      </div>
                      <div className="absolute -top-2 -right-2 h-8 w-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                        <Activity className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-gray-900">Select an Appointment</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Click on an appointment from the list to view its details and manage the appointment.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
    </div>
  );
}
