
import { getUniquePatients } from '@/services/patientService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default async function AdminPatientsPage() {
  const patients = await getUniquePatients();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patients</CardTitle>
        <CardDescription>A distinct list of all patients who have booked an appointment.</CardDescription>
      </CardHeader>
      <CardContent>
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
              {patients.map((patient) => (
                <TableRow key={patient.hospitalId}>
                  <TableCell className="font-medium">
                     <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarFallback>{patient.name ? patient.name.charAt(0) : 'P'}</AvatarFallback>
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
      </CardContent>
    </Card>
  );
}
