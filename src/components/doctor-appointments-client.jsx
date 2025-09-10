
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
import { AppointmentDetailsClient } from './appointment-details-client';
import { FileText } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

export function DoctorAppointmentsClient({ doctor, initialAppointments }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formattedDates, setFormattedDates] = useState({});
  const [isClient, setIsClient] = useState(false);

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
  
  // Find the appointment from the list to ensure we have the latest data
  const currentlySelectedAppointment = appointments.find(a => a.id === selectedAppointment?.id) || selectedAppointment;


  return (
    <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                <CardTitle>Appointments for {doctor.name}</CardTitle>
                <CardDescription>A list of your scheduled appointments.</CardDescription>
                </CardHeader>
                <CardContent>
                {appointments.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-muted-foreground">You have no appointments scheduled.</p>
                    </div>
                ) : (
                    <div className="relative w-full overflow-auto">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead className="hidden sm:table-cell">Date & Time</TableHead>
                            <TableHead className="hidden md:table-cell">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {appointments.map((appt) => (
                            <TableRow key={appt.id} className="cursor-pointer" onClick={() => handleViewDetails(appt)}>
                            <TableCell className="font-medium">{appt.patientName}</TableCell>
                            <TableCell className="hidden sm:table-cell">
                                {isClient && formattedDates[appt.id] ? formattedDates[appt.id] : <Skeleton className="h-4 w-[200px]" />}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                <Badge variant={appt.status === 'scheduled' ? 'default' : 'secondary'}>
                                {appt.status}
                                </Badge>
                            </TableCell>
                             <TableCell className="text-right">
                                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleViewDetails(appt);}}>
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
                 <Card className="sticky top-20 flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
                    <CardContent className="text-center">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold">Select an Appointment</h3>
                        <p className="text-muted-foreground">Click on an appointment from the list to view its details.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    </div>
  );
}
