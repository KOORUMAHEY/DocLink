/**
 * Doctor Actions
 * Server actions for doctor-related operations
 * @module features/doctors/actions/doctorActions
 */

'use server';

import { 
  createDoctor as createDoctorService,
  updateDoctor as updateDoctorService,
  deleteDoctor as deleteDoctorService 
} from '@/features/doctors/services/doctorService';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/config/routes';
import { TOAST_MESSAGES } from '@/lib/constants';

/**
 * Create a new doctor
 * @param {Object} data - Doctor form data
 * @returns {Promise<Object>} Success/error response
 */
export async function createDoctor(data) {
  try {
    const doctor = await createDoctorService(data);
    
    // Revalidate relevant paths
    revalidatePath(ROUTES.ADMIN.DOCTORS);
    revalidatePath('/doctors'); // Public doctors list
    
    return { 
      success: true,
      doctor,
      message: TOAST_MESSAGES.DOCTORS.CREATE_SUCCESS
    };
  } catch (error) {
    console.error('Failed to create doctor:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : TOAST_MESSAGES.DOCTORS.CREATE_ERROR
    };
  }
}

/**
 * Update an existing doctor
 * @param {string} id - Doctor ID
 * @param {Object} data - Updated doctor data
 * @returns {Promise<Object>} Success/error response
 */
export async function updateDoctor(id, data) {
  try {
    const doctor = await updateDoctorService(id, data);
    
    // Revalidate relevant paths
    revalidatePath(ROUTES.ADMIN.DOCTORS);
    revalidatePath(`${ROUTES.ADMIN.DOCTORS}/${id}`);
    revalidatePath(`/doctors/${id}`);
    revalidatePath(ROUTES.DOCTOR.DASHBOARD);
    
    return { 
      success: true,
      doctor,
      message: TOAST_MESSAGES.DOCTORS.UPDATE_SUCCESS
    };
  } catch (error) {
    console.error(`Failed to update doctor ${id}:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : TOAST_MESSAGES.DOCTORS.UPDATE_ERROR
    };
  }
}

/**
 * Delete a doctor
 * @param {string} id - Doctor ID
 * @returns {Promise<Object>} Success/error response
 */
export async function deleteDoctor(id) {
  try {
    await deleteDoctorService(id);
    
    // Revalidate relevant paths
    revalidatePath(ROUTES.ADMIN.DOCTORS);
    revalidatePath('/doctors');
    
    return { 
      success: true,
      message: TOAST_MESSAGES.DOCTORS.DELETE_SUCCESS
    };
  } catch (error) {
    console.error(`Failed to delete doctor ${id}:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : TOAST_MESSAGES.DOCTORS.DELETE_ERROR
    };
  }
}

/**
 * Update doctor status (active/inactive/on-leave)
 * @param {string} id - Doctor ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Success/error response
 */
export async function updateDoctorStatus(id, status) {
  try {
    const doctor = await updateDoctorService(id, { status });
    
    revalidatePath(ROUTES.ADMIN.DOCTORS);
    revalidatePath(`${ROUTES.ADMIN.DOCTORS}/${id}`);
    
    return { 
      success: true,
      doctor,
      message: `Doctor status updated to ${status}`
    };
  } catch (error) {
    console.error(`Failed to update doctor status ${id}:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update doctor status'
    };
  }
}

/**
 * Submit doctor form with redirect
 * @param {FormData} formData - Form data
 */
export async function submitDoctorForm(formData) {
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    specialization: formData.get('specialization'),
    bio: formData.get('bio'),
    imageUrl: formData.get('imageUrl'),
  };

  const result = await createDoctor(data);
  
  if (result.success) {
    redirect(ROUTES.ADMIN.DOCTORS);
  }
  
  return result;
}
