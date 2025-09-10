
import { getDoctors } from '@/services/doctorService';
import { Suspense } from 'react';
import { BookAppointmentClient } from './client';
import { AppointmentForm } from '@/components/appointment-form';

export default async function BookAppointmentPage() {
    const doctors = await getDoctors();
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 sm:p-6 lg:p-8">
            {/* Page Header */}
            <div className="mb-6 lg:mb-8">
                <div className="text-center lg:text-left">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">
                        Book New Appointment
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                        Schedule your next medical appointment with ease
                    </p>
                </div>
            </div>

            {/* Form Content */}
            <div className="max-w-4xl mx-auto">
                <Suspense fallback={
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading form...</p>
                    </div>
                }>
                    <BookAppointmentClient>
                        <AppointmentForm doctors={doctors} />
                    </BookAppointmentClient>
                </Suspense>
            </div>
        </div>
    );
}
