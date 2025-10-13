
import { DoctorForm } from '@/features/doctors';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/config/routes';

export default function NewDoctorPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
            <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <Button variant="ghost" size="sm" asChild className="w-fit">
                        <Link href={ROUTES.ADMIN.DOCTORS}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Back to Doctors</span>
                            <span className="sm:hidden">Back</span>
                        </Link>
                    </Button>
                    <div className="space-y-1">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Add New Doctor
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground">Register a new healthcare professional to your team</p>
                    </div>
                </div>

                {/* Form Card */}
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                                <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Doctor Information</CardTitle>
                                <CardDescription className="text-sm sm:text-base text-muted-foreground mt-1">
                                    Fill out the form below to add a new doctor to the system
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 lg:p-8">
                        <DoctorForm />
                    </CardContent>
                </Card>

                {/* Help Section */}
                <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50/80 to-blue-100/60 backdrop-blur-sm">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg flex-shrink-0">
                                <UserPlus className="h-4 w-4 text-white" />
                            </div>
                            <div className="space-y-3 flex-1">
                                <h3 className="font-bold text-blue-900 text-base sm:text-lg">Need Help?</h3>
                                <p className="text-sm sm:text-base text-blue-700 leading-relaxed">
                                    Make sure to provide accurate information for the doctor. The email address will be used for login credentials,
                                    and the specialization will help patients find the right healthcare professional.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
                                    <Link href={ROUTES.ADMIN.DOCTORS} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium">
                                        View existing doctors →
                                    </Link>
                                    <Link href={ROUTES.ADMIN.DASHBOARD} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium">
                                        Back to dashboard →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
