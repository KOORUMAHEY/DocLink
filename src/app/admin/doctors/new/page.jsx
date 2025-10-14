
import { DoctorForm } from '@/features/doctors';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/config/routes';

export default function NewDoctorPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Simple Back Button and Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={ROUTES.ADMIN.DOCTORS} className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                </div>

                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Add New Doctor
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Fill in the information below to register a new healthcare professional
                    </p>
                </div>

                {/* Simple Form Card */}
                <Card className="shadow-lg">
                    <CardContent className="p-6 md:p-8">
                        <DoctorForm />
                    </CardContent>
                </Card>

                {/* Help Text */}
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-6">
                        <h3 className="font-semibold text-blue-900 mb-2">Quick Tips</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Use a valid email address for login credentials</li>
                            <li>• Password must be at least 6 characters</li>
                            <li>• Specialization helps patients find the right doctor</li>
                            <li>• Bio field is optional but recommended</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
