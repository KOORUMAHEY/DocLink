
'use server';

import { createDoctor as createDoctorService } from '@/services/doctorService';
import { revalidatePath } from 'next/cache';

export async function createDoctor(data) {
  try {
    await createDoctorService(data);
    revalidatePath('/admin/doctors');
    revalidatePath('/doctors');
    return { success: true };
  } catch (error) {
    console.error('Failed to create doctor:', error);
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred.' };
  }
}
