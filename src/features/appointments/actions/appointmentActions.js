
'use server';

import { createAppointment as createAppointmentService, updateAppointmentStatusInDb } from '../services/appointmentService';
import { revalidatePath } from 'next/cache';
import { ROUTES } from '@/config/routes';
import { TOAST_MESSAGES } from '@/lib/constants';

export async function createAppointment(data) {
  try {
    const newAppointment = await createAppointmentService(data);
    revalidatePath(ROUTES.APPOINTMENTS.ROOT);
    revalidatePath(ROUTES.ADMIN.APPOINTMENTS);
    return { 
      success: true, 
      appointmentId: newAppointment.id,
      message: TOAST_MESSAGES.SUCCESS.APPOINTMENT_CREATED
    };
  } catch (error) {
    console.error('Failed to create appointment:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : TOAST_MESSAGES.ERROR.GENERIC
    };
  }
}

export async function updateAppointmentStatus(appointmentId, status) {
    try {
        await updateAppointmentStatusInDb(appointmentId, status);
        revalidatePath(ROUTES.ADMIN.APPOINTMENTS);
        revalidatePath(ROUTES.DOCTOR.APPOINTMENTS());
        revalidatePath(ROUTES.APPOINTMENTS.DETAIL(appointmentId));
        return { 
          success: true, 
          message: TOAST_MESSAGES.SUCCESS.APPOINTMENT_UPDATED
        };
    } catch (error) {
        console.error('Failed to update appointment status:', error);
        return { 
          success: false, 
          error: error instanceof Error ? error.message : TOAST_MESSAGES.ERROR.GENERIC
        };
    }
}
