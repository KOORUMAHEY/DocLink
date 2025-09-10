
import { getDoctors } from '@/services/doctorService';
import { Suspense } from 'react';
import { BookAppointmentClient } from './client';
import { AppointmentForm } from '@/components/appointment-form';

export default async function BookAppointmentPage() {
    const doctors = await getDoctors();
    
    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Book New Appointment</h2>
                <p className="text-gray-600">Schedule your next medical appointment</p>
            </div>

            {/* Form Content */}
            <div className="max-w-2xl">
                <Suspense fallback={<div className="text-center">Loading form...</div>}>
                    <BookAppointmentClient>
                        <AppointmentForm doctors={doctors} />
                    </BookAppointmentClient>
                </Suspense>
            </div>
        </div>
    );
}
