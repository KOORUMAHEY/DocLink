
import { getDoctors } from '@/features/doctors';
import { Suspense } from 'react';
import { BookAppointmentClient } from './client';
import { AppointmentForm } from '@/features/appointments/components/AppointmentForm';
import { Calendar, Sparkles, Clock, CheckCircle2, Stethoscope, Shield, Zap } from 'lucide-react';
import BookAppointmentPageWrapper from './client-wrapper';

export default async function BookAppointmentPage() {
    const doctors = await getDoctors();
    
    return (
        <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            <BookAppointmentPageWrapper />

            {/* Efficient Form Section */}
            <div className="w-full">
                <Suspense fallback={
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 sm:p-12 border border-blue-100/50 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100"></div>
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-600 border-r-indigo-600 absolute top-0 left-0"></div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <Calendar className="w-6 h-6 text-blue-600 animate-pulse" />
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-900 font-bold">Loading Appointment Form</p>
                                <p className="text-gray-600 text-sm">Preparing your booking experience...</p>
                            </div>
                        </div>
                    </div>
                }>
                    <BookAppointmentClient>
                        <AppointmentForm doctors={doctors} />
                    </BookAppointmentClient>
                </Suspense>
            </div>

            {/* Trust Indicators */}
            <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border-2 border-blue-200/50">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div className="flex flex-col items-center sm:items-start gap-2">
                        <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                            <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="font-semibold text-gray-900 text-sm">Instant Confirmation</p>
                            <p className="text-xs text-gray-600 mt-0.5">Get notified immediately</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center sm:items-start gap-2">
                        <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                            <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="font-semibold text-gray-900 text-sm">100% Secure</p>
                            <p className="text-xs text-gray-600 mt-0.5">HIPAA Compliant</p>
                        </div>
                    </div>

                    <div className="col-span-2 sm:col-span-1 flex flex-col items-center sm:items-start gap-2">
                        <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                            <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="font-semibold text-gray-900 text-sm">Fast Booking</p>
                            <p className="text-xs text-gray-600 mt-0.5">5 minutes max</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
