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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, Clock, Users, Eye, RefreshCw, Trash2, User, Phone, Mail, MapPin, Stethoscope, FileText, Info } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

function AppointmentsDisplay({ appointments }) {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [actionAppointment, setActionAppointment] = useState(null);

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsOpen(true);
  };

  const handleReschedule = (appointment) => {
    setActionAppointment(appointment);
    setIsRescheduleOpen(true);
  };

  const handleCancel = (appointment) => {
    setActionAppointment(appointment);
    setIsCancelOpen(true);
  };

  const confirmReschedule = () => {
    // TODO: Implement reschedule logic
    console.log('Rescheduling appointment:', actionAppointment);
    setIsRescheduleOpen(false);
    setActionAppointment(null);
  };

  const confirmCancel = () => {
    // TODO: Implement cancel logic
    console.log('Cancelling appointment:', actionAppointment);
    setIsCancelOpen(false);
    setActionAppointment(null);
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'default';
      case 'scheduled':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'scheduled':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (!appointments || appointments.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="text-center py-16 px-6">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mb-6">
              <Calendar className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Appointments Found</h3>
            <p className="text-base text-gray-600 mb-1">We couldn&apos;t find any appointments matching your search.</p>
            <p className="text-sm text-gray-500">Try adjusting your search criteria or book a new appointment.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Appointment Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Appointment Details
            </DialogTitle>
            <DialogDescription>
              View comprehensive information about this appointment
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-6 py-4">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <Badge 
                  variant={getStatusVariant(selectedAppointment.status)}
                  className="text-sm px-4 py-1"
                >
                  {selectedAppointment.status?.charAt(0).toUpperCase() + selectedAppointment.status?.slice(1)}
                </Badge>
                <span className="text-sm text-gray-500">
                  ID: {selectedAppointment.id}
                </span>
              </div>

              <Separator />

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Patient Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      Patient Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-16 w-16 border-2 border-gray-200">
                        {selectedAppointment.patientAvatar && (
                          <AvatarImage src={selectedAppointment.patientAvatar} alt={selectedAppointment.patientName} />
                        )}
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg font-bold">
                          {selectedAppointment.patientName?.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-lg text-gray-900">{selectedAppointment.patientName}</p>
                        <p className="text-sm text-gray-500">ID: {selectedAppointment.hospitalId}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {selectedAppointment.patientEmail ? (
                          <a href={`mailto:${selectedAppointment.patientEmail}`} className="text-blue-600 hover:underline text-sm">
                            {selectedAppointment.patientEmail}
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">No email provided</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {selectedAppointment.patientPhone ? (
                          <a href={`tel:${selectedAppointment.patientPhone}`} className="text-blue-600 hover:underline text-sm">
                            {selectedAppointment.patientPhone}
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">No phone provided</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Healthcare Provider */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Stethoscope className="h-5 w-5 text-green-600" />
                      </div>
                      Healthcare Provider
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-16 w-16 border-2 border-gray-200">
                        {selectedAppointment.doctorAvatar && (
                          <AvatarImage src={selectedAppointment.doctorAvatar} alt={selectedAppointment.doctorName} />
                        )}
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white text-lg font-bold">
                          {selectedAppointment.doctorName?.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-lg text-gray-900">Dr. {selectedAppointment.doctorName}</p>
                        <p className="text-sm text-gray-500">{selectedAppointment.specialty || 'General Practitioner'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Schedule Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-purple-600" />
                      </div>
                      Schedule Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date
                      </span>
                      <span className="font-semibold text-gray-900">
                        {format(new Date(selectedAppointment.appointmentDate), 'EEEE, MMMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Time
                      </span>
                      <span className="font-semibold text-gray-900">
                        {selectedAppointment.time || format(new Date(selectedAppointment.appointmentDate), 'h:mm a')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Room
                      </span>
                      <span className="font-semibold text-gray-900">
                        {selectedAppointment.roomNumber || 'To Be Assigned'}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Medical Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <FileText className="h-5 w-5 text-orange-600" />
                      </div>
                      Medical Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {selectedAppointment.description || selectedAppointment.reason || 'No additional medical information provided for this appointment.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Help Information */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">Need Assistance?</p>
                      <p className="text-sm text-blue-700">
                        For any questions or to make changes to your appointment, please call{' '}
                        <a href="tel:+1234567890" className="font-semibold underline">
                          (123) 456-7890
                        </a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsDetailsOpen(false);
                handleReschedule(selectedAppointment);
              }}
              className="flex-1 sm:flex-none"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reschedule
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setIsDetailsOpen(false);
                handleCancel(selectedAppointment);
              }}
              className="flex-1 sm:flex-none"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-blue-600" />
              Reschedule Appointment
            </DialogTitle>
            <DialogDescription>
              Request to reschedule your appointment
            </DialogDescription>
          </DialogHeader>
          {actionAppointment && (
            <div className="space-y-4 py-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-600">Current Appointment</p>
                <p className="font-semibold text-gray-900">Dr. {actionAppointment.doctorName}</p>
                <p className="text-sm text-gray-600">
                  {format(new Date(actionAppointment.appointmentDate), 'EEEE, MMMM dd, yyyy')} at {actionAppointment.time || format(new Date(actionAppointment.appointmentDate), 'h:mm a')}
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Are you sure you want to reschedule this appointment? Our team will contact you shortly to arrange a new date and time.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRescheduleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmReschedule} className="bg-blue-600 hover:bg-blue-700">
              Confirm Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Cancel Appointment
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone
            </DialogDescription>
          </DialogHeader>
          {actionAppointment && (
            <div className="space-y-4 py-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                <p className="text-sm text-red-600 font-medium">Appointment Details</p>
                <p className="font-semibold text-gray-900">Dr. {actionAppointment.doctorName}</p>
                <p className="text-sm text-gray-600">
                  {format(new Date(actionAppointment.appointmentDate), 'EEEE, MMMM dd, yyyy')} at {actionAppointment.time || format(new Date(actionAppointment.appointmentDate), 'h:mm a')}
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Are you sure you want to cancel this appointment? This action cannot be undone and you will need to book a new appointment if you change your mind.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelOpen(false)}>
              Keep Appointment
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Main Appointments List */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                Your Appointments
              </CardTitle>
              <CardDescription className="mt-1">
                {appointments.length} {appointments.length === 1 ? 'appointment' : 'appointments'} scheduled
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Stats Overview */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-gray-50/50 border-b">
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(a => new Date(a.appointmentDate) > new Date()).length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Doctors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(appointments.map(a => a.doctorId)).size}
                </p>
              </div>
            </div>
          </div> */}

          {/* Appointments Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">Patient</TableHead>
                  <TableHead className="font-semibold text-gray-900 hidden lg:table-cell">Doctor</TableHead>
                  <TableHead className="font-semibold text-gray-900">Appointment</TableHead>
                  <TableHead className="font-semibold text-gray-900 hidden md:table-cell text-center">Status</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow 
                    key={appointment.id} 
                    className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                    onClick={() => handleViewDetails(appointment)}
                  >
                    {/* Patient Column */}
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-gray-100">
                          {appointment.patientAvatar && (
                            <AvatarImage src={appointment.patientAvatar} alt={appointment.patientName} />
                          )}
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                            {appointment.patientName?.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900">{appointment.patientName}</p>
                          <p className="text-sm text-gray-500">ID: {appointment.hospitalId}</p>
                          {appointment.patientPhone && (
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {appointment.patientPhone}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Doctor Column - Hidden on mobile */}
                    <TableCell className="py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-gray-100">
                          {appointment.doctorAvatar && (
                            <AvatarImage src={appointment.doctorAvatar} alt={appointment.doctorName} />
                          )}
                          <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white font-semibold text-sm">
                            {appointment.doctorName?.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900">Dr. {appointment.doctorName}</p>
                          <p className="text-sm text-gray-500">{appointment.specialty || 'General'}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Appointment Details Column */}
                    <TableCell className="py-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4 text-gray-400" />
                          {appointment.time || format(new Date(appointment.appointmentDate), 'h:mm a')}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <MapPin className="h-3 w-3" />
                          Room {appointment.roomNumber || 'TBA'}
                        </div>
                        {/* Show doctor on mobile */}
                        <div className="lg:hidden pt-1 border-t mt-2">
                          <p className="text-xs text-gray-500">Dr. {appointment.doctorName}</p>
                        </div>
                        {/* Show status on mobile */}
                        <div className="md:hidden pt-1">
                          <Badge 
                            variant={getStatusVariant(appointment.status)}
                            className="text-xs"
                          >
                            {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>

                    {/* Status Column - Hidden on mobile */}
                    <TableCell className="py-4 hidden md:table-cell text-center">
                      <Badge 
                        variant={getStatusVariant(appointment.status)}
                        className="font-medium"
                      >
                        {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)}
                      </Badge>
                    </TableCell>

                    {/* Actions Column */}
                    <TableCell className="py-4 text-right">
                      <div className="flex flex-col sm:flex-row gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(appointment);
                          }}
                        >
                          <Eye className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-green-50 hover:border-green-300 hover:text-green-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReschedule(appointment);
                          }}
                        >
                          <RefreshCw className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">Reschedule</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default AppointmentsDisplay;
