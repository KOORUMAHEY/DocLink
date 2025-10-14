'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
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
import { Calendar, Clock, Users, RefreshCw, Trash2, User, Phone, Mail, MapPin, Stethoscope, FileText, Info } from 'lucide-react';
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
    // Implement reschedule logic
    console.log('Rescheduling appointment:', actionAppointment);
    setIsRescheduleOpen(false);
    setActionAppointment(null);
  };

  const confirmCancel = () => {
    // Implement cancel logic
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

        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                <Calendar className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                Appointment Results
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-muted-foreground mt-1">
                Found {appointments.length} appointment{appointments.length !== 1 ? 's' : ''} matching your search criteria
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Welcome Card */}
          {appointments.length > 0 && (
            <div className="p-6 lg:p-8 bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                    {appointments[0].patientAvatar ? (
                      <AvatarImage src={appointments[0].patientAvatar} alt={appointments[0].patientName} />
                    ) : null}
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white font-bold text-xl">
                      {appointments[0].patientName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Welcome, {appointments[0].patientName}</h2>
                    <p className="text-gray-600 text-lg">Patient ID: {appointments[0].patientId || 'J1234M'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Upcoming Appointments</p>
                  <p className="text-3xl font-bold text-blue-600">{appointments.length}</p>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200">
                  <TableHead className="font-semibold text-gray-900 py-3 sm:py-4 px-3 sm:px-6 text-left">Patient Details</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-3 sm:py-4 px-3 sm:px-6 hidden sm:table-cell text-left">Healthcare Provider</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-3 sm:py-4 px-3 sm:px-6 text-left">Schedule Information</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-3 sm:py-4 px-3 sm:px-6 hidden md:table-cell text-center">Status</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-3 sm:py-4 px-3 sm:px-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id} className="hover:bg-blue-50/50 transition-colors duration-200 border-b border-gray-100">
                    <TableCell className="py-3 sm:py-4 px-3 sm:px-6">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                          {appointment.patientAvatar ? (
                            <AvatarImage src={appointment.patientAvatar} alt={appointment.patientName} />
                          ) : null}
                          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 font-medium text-xs sm:text-sm">
                            {appointment.patientName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 text-sm sm:text-base">{appointment.patientName}</p>
                          <p className="text-xs text-muted-foreground">{appointment.patientEmail}</p>
                          <p className="text-xs text-muted-foreground">{appointment.patientPhone}</p>
                          <div className="sm:hidden mt-1">
                            <p className="text-xs text-gray-600">Dr. {appointment.doctorName} • {appointment.specialty}</p>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 sm:py-4 px-3 sm:px-6 hidden sm:table-cell">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          {appointment.doctorAvatar ? (
                            <AvatarImage src={appointment.doctorAvatar} alt={appointment.doctorName} />
                          ) : null}
                          <AvatarFallback className="bg-gradient-to-br from-green-100 to-green-200 text-green-700 font-medium text-xs">
                            {appointment.doctorName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 text-sm">Dr. {appointment.doctorName}</p>
                          <p className="text-xs text-muted-foreground">{appointment.specialty}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 sm:py-4 px-3 sm:px-6">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-blue-500 flex-shrink-0" />
                          {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-blue-500 flex-shrink-0" />
                          {appointment.time}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Users className="h-3 w-3 mr-1 flex-shrink-0" />
                          Room {appointment.roomNumber}
                        </div>
                        <div className="md:hidden mt-2">
                          <Badge
                            variant={
                              appointment.status === 'confirmed' ? 'default' :
                                appointment.status === 'pending' ? 'secondary' :
                                  appointment.status === 'cancelled' ? 'destructive' : 'outline'
                            }
                            className="text-xs"
                          >
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 sm:py-4 px-3 sm:px-6 hidden md:table-cell text-center">
                      <Badge
                        variant={
                          appointment.status === 'confirmed' ? 'default' :
                            appointment.status === 'pending' ? 'secondary' :
                              appointment.status === 'cancelled' ? 'destructive' : 'outline'
                        }
                        className="text-xs font-medium"
                      >
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 sm:py-4 px-3 sm:px-6 text-right">
                      <div className="flex flex-col sm:flex-row gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 text-blue-600 hover:text-blue-700"
                          onClick={() => handleViewDetails(appointment)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs border-2 hover:bg-green-50 hover:border-green-300 transition-all duration-200 text-green-600 hover:text-green-700"
                          onClick={() => handleReschedule(appointment)}
                        >
                          Reschedule
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs border-2 hover:bg-red-50 hover:border-red-300 transition-all duration-200 text-red-600 hover:text-red-700"
                          onClick={() => handleCancel(appointment)}
                        >
                          Cancel
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
      </Card>
    </>
  );
}

AppointmentsDisplay.propTypes = {
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      patientName: PropTypes.string,
      patientId: PropTypes.string,
      patientAvatar: PropTypes.string,
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      status: PropTypes.string,
      doctorName: PropTypes.string,
      type: PropTypes.string,
    })
  ),
};

export default AppointmentsDisplay;
