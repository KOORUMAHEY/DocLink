
import { DoctorForm } from '@/components/doctor-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function NewDoctorPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/doctors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Doctors
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Add New Doctor</h1>
                    <p className="text-muted-foreground mt-1">Register a new healthcare professional to your team</p>
                </div>
            </div>

            {/* Form Card */}
            <Card className="border-0 shadow-lg">
                <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <UserPlus className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Doctor Information</CardTitle>
                            <CardDescription>Fill out the form below to add a new doctor to the system</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <DoctorForm />
                </CardContent>
            </Card>

            {/* Help Section */}
            <Card className="border-0 shadow-sm bg-blue-50/50">
                <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg mt-1">
                            <UserPlus className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-blue-900">Need Help?</h3>
                            <p className="text-sm text-blue-700">
                                Make sure to provide accurate information for the doctor. The email address will be used for login credentials,
                                and the specialization will help patients find the right healthcare professional.
                            </p>
                            <div className="flex gap-4 text-sm">
                                <Link href="/admin/doctors" className="text-blue-600 hover:underline">
                                    View existing doctors →
                                </Link>
                                <Link href="/admin" className="text-blue-600 hover:underline">
                                    Back to dashboard →
                                </Link>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
