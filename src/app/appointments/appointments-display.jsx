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
import { Calendar, Clock, Users, X, User, Phone, Mail, Hash, Stethoscope, FileText } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

function AppointmentsDisplay({ appointments }) {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [rescheduleAppointment, setRescheduleAppointment] = useState(null);
  const [cancelAppointment, setCancelAppointment] = useState(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedAppointment(null);
  };

  const handleReschedule = (appointment) => {
    setRescheduleAppointment(appointment);
    setIsRescheduleModalOpen(true);
  };

  const handleCancel = (appointment) => {
    setCancelAppointment(appointment);
    setIsCancelModalOpen(true);
  };

  const confirmReschedule = () => {
    // TODO: Implement reschedule logic
    console.log('Rescheduling appointment:', rescheduleAppointment);
    setIsRescheduleModalOpen(false);
    setRescheduleAppointment(null);
  };

  const confirmCancel = () => {
    // TODO: Implement cancel logic
    console.log('Cancelling appointment:', cancelAppointment);
    setIsCancelModalOpen(false);
    setCancelAppointment(null);
  };

  const closeRescheduleModal = () => {
    setIsRescheduleModalOpen(false);
    setRescheduleAppointment(null);
  };

  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
    setCancelAppointment(null);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (isDrawerOpen) handleCloseDrawer();
        if (isRescheduleModalOpen) closeRescheduleModal();
        if (isCancelModalOpen) closeCancelModal();
      }
    };

    if (isDrawerOpen || isRescheduleModalOpen || isCancelModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      if (isDrawerOpen || isRescheduleModalOpen || isCancelModalOpen) {
        document.body.style.overflow = 'hidden';
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isDrawerOpen, isRescheduleModalOpen, isCancelModalOpen]);

  if (!appointments || appointments.length === 0) {
    return (
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardContent className="text-center py-12 sm:py-16 px-4 sm:px-6">
          <div className="relative mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Appointments Found</h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-1">We couldn&apos;t find any appointments matching your search.</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Try adjusting your search criteria or book a new appointment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Appointment Details Modal */}
      {isDrawerOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Appointment Details
                  </h2>
                  <div className="h-1 w-14 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mt-2" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseDrawer}
                  className="h-10 w-10 p-0 hover:bg-white/20 rounded-full text-white hover:text-white transition"
                  aria-label="Close appointment details"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Patient Information */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <div className="flex items-center mb-4 gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-lg font-semibold text-gray-900">Patient Information</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">Name</span>
                      <span className="font-bold text-gray-900">{selectedAppointment.patientName}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">Hospital ID</span>
                      <span className="font-bold text-gray-900">{selectedAppointment.hospitalId}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">Email</span>
                      {selectedAppointment.patientEmail ? (
                        <a href={`mailto:${selectedAppointment.patientEmail}`} className="text-blue-700 font-bold hover:underline">
                          {selectedAppointment.patientEmail}
                        </a>
                      ) : (
                        <span className="text-gray-400 font-bold">N/A</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium text-gray-600">Phone</span>
                      {selectedAppointment.patientPhone ? (
                        <a href={`tel:${selectedAppointment.patientPhone}`} className="text-blue-700 font-bold hover:underline">
                          {selectedAppointment.patientPhone}
                        </a>
                      ) : (
                        <span className="text-gray-400 font-bold">N/A</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Healthcare Provider */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <div className="flex items-center mb-4 gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Stethoscope className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-lg font-semibold text-gray-900">Healthcare Provider</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      {selectedAppointment.doctorAvatar && (
                        <AvatarImage src={selectedAppointment.doctorAvatar} alt={selectedAppointment.doctorName} />
                      )}
                      <AvatarFallback className="bg-green-100 text-green-700 font-bold">
                        {selectedAppointment.doctorName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">Dr. {selectedAppointment.doctorName}</p>
                      <p className="text-sm text-gray-600">{selectedAppointment.specialty}</p>
                    </div>
                  </div>
                </div>

                {/* Schedule Information */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <div className="flex items-center mb-4 gap-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="text-lg font-semibold text-gray-900">Schedule Information</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">Date</span>
                      <span className="font-bold text-gray-900">{format(new Date(selectedAppointment.appointmentDate), 'PPP')}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">Time</span>
                      <span className="font-bold text-gray-900">{selectedAppointment.time}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">Room Number</span>
                      <span className="font-bold text-gray-900">{selectedAppointment.roomNumber}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium text-gray-600">Status</span>
                      <Badge
                        variant={
                          selectedAppointment.status === 'confirmed' ? 'default' :
                          selectedAppointment.status === 'pending' ? 'secondary' :
                          selectedAppointment.status === 'cancelled' ? 'destructive' : 'outline'
                        }
                        className="font-medium"
                      >
                        {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <div className="flex items-center mb-4 gap-3">
                    <div className="p-2 bg-orange-100 rounded-full">
                      <FileText className="h-5 w-5 text-orange-600" />
                    </div>
                    <span className="text-lg font-semibold text-gray-900">Medical Information</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 leading-relaxed">
                      {selectedAppointment.description || 'No description provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div className="text-center sm:text-left">
                  <p className="text-xs text-gray-500">
                    Need help? Call{' '}
                    <a href="tel:+1234567890" className="text-blue-600 hover:text-blue-700 font-medium">
                      (123) 456-7890
                    </a>
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      handleCloseDrawer();
                      handleReschedule(selectedAppointment);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Reschedule
                  </Button>
                  <Button
                    onClick={() => {
                      handleCloseDrawer();
                      handleCancel(selectedAppointment);
                    }}
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Main Card Content */}
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

      {/* Reschedule Confirmation Modal */}
      {isRescheduleModalOpen && rescheduleAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={closeRescheduleModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reschedule-modal-title"
        >
          <div
            className="relative max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6">
              <h2 id="reschedule-modal-title" className="text-xl font-bold text-gray-900 mb-4">Reschedule Appointment</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to reschedule your appointment with Dr. {rescheduleAppointment.doctorName} on {format(new Date(rescheduleAppointment.appointmentDate), 'MMM dd, yyyy')}?
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={closeRescheduleModal}>
                  Cancel
                </Button>
                <Button onClick={confirmReschedule} className="bg-blue-600 hover:bg-blue-700">
                  Confirm Reschedule
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {isCancelModalOpen && cancelAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={closeCancelModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-modal-title"
        >
          <div
            className="relative max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6">
              <h2 id="cancel-modal-title" className="text-xl font-bold text-gray-900 mb-4">Cancel Appointment</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel your appointment with Dr. {cancelAppointment.doctorName} on {format(new Date(cancelAppointment.appointmentDate), 'MMM dd, yyyy')}? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={closeCancelModal}>
                  Keep Appointment
                </Button>
                <Button onClick={confirmCancel} className="bg-red-600 hover:bg-red-700">
                  Cancel Appointment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AppointmentsDisplay;
