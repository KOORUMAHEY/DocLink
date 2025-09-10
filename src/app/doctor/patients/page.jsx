
'use client';
import { getSavedPatientsForDoctor } from '@/services/patientService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function DoctorPatientsContent() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('id');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (doctorId) {
      const fetchPatients = async () => {
        setLoading(true);
        try {
            const savedPatients = await getSavedPatientsForDoctor(doctorId);
            setPatients(savedPatients);
        } catch(e) {
            console.error(e);
            setPatients([]);
        }
        setLoading(false);
      };
      fetchPatients();
    }
  }, [doctorId]);

  if (loading) {
    return (
        <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
        </div>
    )
  }

  if (patients.length === 0) {
    return (
        <div className="text-center py-10">
            <p className="text-muted-foreground">You have not saved any patients yet. Save a patient from the appointment details view.</p>
        </div>
    )
  }

  return (
    <div className="relative w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead className="hidden sm:table-cell">Hospital ID</TableHead>
            <TableHead className="hidden md:table-cell">Contact</TableHead>
            <TableHead className="hidden md:table-cell">Gender</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient, index) => (
            <TableRow key={`${patient.hospitalId}-${index}`}>
              <TableCell className="font-medium">
                 <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarFallback>{patient.name ? patient.name.charAt(0) : '?'}</AvatarFallback>
                    </Avatar>
                    <span>{patient.name}</span>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">{patient.hospitalId}</TableCell>
              <TableCell className="hidden md:table-cell">{patient.phone}</TableCell>
               <TableCell className="hidden md:table-cell capitalize">{patient.gender}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}


export default function DoctorPatientsPage() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Patients</CardTitle>
          <CardDescription>A list of your saved patients.</CardDescription>
        </CardHeader>
        <CardContent>
            <Suspense fallback={<p>Loading patients...</p>}>
                <DoctorPatientsContent />
            </Suspense>
        </CardContent>
      </Card>
    );
}
