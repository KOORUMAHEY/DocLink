
'use server';

import { createAppointment as createAppointmentService, updateAppointmentStatusInDb } from '@/services/appointmentService';
import { revalidatePath } from 'next/cache';

export async function createAppointment(data) {
  try {
    const newAppointment = await createAppointmentService(data);
    revalidatePath('/appointments');
    revalidatePath('/admin/appointments');
    return { success: true, appointmentId: newAppointment.id };
  } catch (error) {
    console.error('Failed to create appointment:', error);
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred.' };
  }
}

export async function updateAppointmentStatus(appointmentId, status) {
    try {
        await updateAppointmentStatusInDb(appointmentId, status);
        revalidatePath('/admin/appointments');
        revalidatePath('/doctor/appointments');
        revalidatePath(`/appointments/${appointmentId}`);
        return { success: true, message: `Appointment status updated to ${status}.` };
    } catch (error) {
        console.error('Failed to update appointment status:', error);
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred.' };
    }
}
