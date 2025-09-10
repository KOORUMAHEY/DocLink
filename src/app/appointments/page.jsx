
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
import { AppointmentSearch } from '@/components/appointment-search';
import { Suspense } from 'react';

async function AppointmentsList({ searchQuery }) {
  const appointments = await getAppointments({ searchQuery });

  if (appointments.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No appointments found for the provided details.</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Appointments</CardTitle>
        <CardDescription>Here is a list of your upcoming and past appointments.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead className="hidden sm:table-cell">Doctor</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appt) => (
                <TableRow key={appt.id}>
                  <TableCell className="font-medium">{appt.patientName}</TableCell>
                  <TableCell className="hidden sm:table-cell">{appt.doctorName}</TableCell>
                  <TableCell>{format(new Date(appt.appointmentDate), 'PPp')}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant={appt.status === 'scheduled' ? 'default' : appt.status === 'completed' ? 'secondary' : 'destructive'}>
                      {appt.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/appointments/${appt.id}`}>View Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AppointmentsPage({ searchParams }) {
  const searchQuery = searchParams?.query;

  return (
    <div className="container py-6 md:py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">My Appointments</h1>
        <Button asChild>
          <Link href="/appointments/book">New Appointment</Link>
        </Button>
      </div>

      <AppointmentSearch />

      {searchQuery && (
        <Suspense fallback={<div className="text-center py-10">Loading appointments...</div>}>
            <div className="mt-8">
                <AppointmentsList searchQuery={searchQuery} />
            </div>
        </Suspense>
      )}
    </div>
  );
}
