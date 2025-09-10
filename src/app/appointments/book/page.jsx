
import { getDoctors } from '@/services/doctorService';
import { Suspense } from 'react';
import { BookAppointmentClient } from './client';
import { AppointmentForm } from '@/components/appointment-form';

export default async function BookAppointmentPage() {
    const doctors = await getDoctors();
    
    return (
        <div className="w-full bg-gradient-to-br from-purple-100 to-pink-100 via-white">
            <div className="container max-w-4xl py-12">
                <Suspense fallback={<div className="text-center">Loading form...</div>}>
                    <BookAppointmentClient>
                        <AppointmentForm doctors={doctors} />
                    </BookAppointmentClient>
                </Suspense>
            </div>
        </div>
    );
}
