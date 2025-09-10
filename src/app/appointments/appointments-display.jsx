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
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardContent className="text-center py-16">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-10 w-10 text-slate-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Appointments Found</h3>
          <p className="text-gray-600 mb-1">We couldn't find any appointments matching your search.</p>
          <p className="text-gray-500 text-sm">Try adjusting your search criteria or book a new appointment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardHeader className="bg-slate-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-slate-600" />
                Appointment Results
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
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
                  <TableHead className="font-semibold text-gray-900 py-4 px-6 text-left">Patient Details</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4 px-6 hidden sm:table-cell text-left">Healthcare Provider</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4 px-6 text-left">Schedule Information</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4 px-6 hidden md:table-cell text-center">Status</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4 px-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id} className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100">
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={appointment.patientAvatar} alt={appointment.patientName} />
                          <AvatarFallback className="bg-slate-100 text-slate-600 font-medium text-sm">
                            {appointment.patientName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 text-sm">{appointment.patientName}</p>
                          <p className="text-xs text-gray-500">{appointment.patientEmail}</p>
                          <p className="text-xs text-gray-500">{appointment.patientPhone}</p>
                          <div className="sm:hidden mt-1">
                            <p className="text-xs text-gray-600">Dr. {appointment.doctorName} • {appointment.specialty}</p>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6 hidden sm:table-cell">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={appointment.doctorAvatar} alt={appointment.doctorName} />
                          <AvatarFallback className="bg-slate-100 text-slate-600 font-medium text-xs">
                            {appointment.doctorName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 text-sm">Dr. {appointment.doctorName}</p>
                          <p className="text-xs text-gray-500">{appointment.specialty}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="h-4 w-4 mr-2 text-slate-500 flex-shrink-0" />
                          {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <Clock className="h-4 w-4 mr-2 text-slate-500 flex-shrink-0" />
                          {appointment.time}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
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
                    <TableCell className="py-4 px-6 hidden md:table-cell text-center">
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
                    <TableCell className="py-4 px-6 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs border-gray-300 hover:bg-gray-50"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="relative max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-lg shadow-xl border border-gray-200">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 id="modal-title" className="text-lg font-semibold text-gray-900">Appointment Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseModal}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[70vh]">
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
