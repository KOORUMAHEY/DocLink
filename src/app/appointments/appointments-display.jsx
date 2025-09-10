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
import { Calendar, Clock, Users, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AppointmentDetailsClient } from '@/components/appointment-details-client';
import { format } from 'date-fns';

function AppointmentsDisplay({ appointments }) {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  // Add keyboard support for closing modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isModalOpen) {
        handleCloseModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  if (appointments.length === 0) {
    return (
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardContent className="text-center py-12 sm:py-16 px-4 sm:px-6">
          <div className="relative mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Appointments Found</h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-1">We couldn't find any appointments matching your search.</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Try adjusting your search criteria or book a new appointment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
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
                          <AvatarImage src={appointment.patientAvatar} alt={appointment.patientName} />
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
                          <AvatarImage src={appointment.doctorAvatar} alt={appointment.doctorName} />
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
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                        onClick={() => handleViewDetails(appointment)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {isModalOpen && selectedAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="relative max-w-2xl w-full max-h-[90vh] overflow-hidden rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-xl border-0 shadow-xl overflow-hidden">
              <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100/50">
                <h2 id="modal-title" className="text-lg sm:text-xl font-bold text-gray-900">Appointment Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseModal}
                  className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[70vh]">
                <AppointmentDetailsClient appointment={selectedAppointment} role="user" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AppointmentsDisplay;
