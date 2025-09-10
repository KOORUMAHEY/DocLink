
import { DoctorForm } from '@/components/doctor-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewDoctorPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Add a New Doctor</CardTitle>
                <CardDescription>Fill out the form below to add a new doctor to the system.</CardDescription>
            </CardHeader>
            <CardContent>
                <DoctorForm />
            </CardContent>
        </Card>
    );
}
