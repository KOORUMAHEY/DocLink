/**
 * Patient Actions
 * Server actions for patient-related operations
 * @module features/patients/actions/patientActions
 */

'use server';

import { getPatientByHospitalId, createOrUpdatePatient as createOrUpdatePatientService, deletePatient as deletePatientService, updatePatient as updatePatientService } from '@/features/patients/services/patientService';
import { revalidatePath } from 'next/cache';
import { ROUTES } from '@/config/routes';
import { TOAST_MESSAGES } from '@/lib/constants';

/**
 * Get patient details
 */
export async function getPatientDetails(hospitalId) {
  try {
    const patient = await getPatientByHospitalId(hospitalId);
    
    if (patient) {
      const patientDetails = {
        patientName: patient.name,
        patientPhone: patient.phone,
        patientEmail: patient.email,
        age: patient.age,
        gender: patient.gender,
        doctorId: patient.doctorId,
        doctorName: patient.doctorName,
      };
      return { success: true, patient: patientDetails };
    }
    
    return { success: false, error: 'Patient not found.' };
  } catch (error) {
    console.error('Failed to get patient details:', error);
    return { success: false, error: TOAST_MESSAGES.PATIENTS.CREATE_ERROR };
  }
}

/**
 * Create or update patient
 */
export async function createOrUpdatePatient(patientData) {
  try {
    await createOrUpdatePatientService(patientData);
    
    revalidatePath(ROUTES.ADMIN.PATIENTS);
    revalidatePath(ROUTES.DOCTOR.PATIENTS());
    
    return {
      success: true,
      message: TOAST_MESSAGES.PATIENTS.CREATE_SUCCESS
    };
  } catch (error) {
    console.error('Failed to save patient:', error);
    return {
      success: false,
      error: TOAST_MESSAGES.PATIENTS.CREATE_ERROR
    };
  }
}

/**
 * Delete patient
 */
export async function deletePatient(hospitalId) {
  try {
    await deletePatientService(hospitalId);
    
    revalidatePath(ROUTES.ADMIN.PATIENTS);
    
    return {
      success: true,
      message: TOAST_MESSAGES.PATIENTS.DELETE_SUCCESS
    };
  } catch (error) {
    console.error('Failed to delete patient:', error);
    return {
      success: false,
      error: TOAST_MESSAGES.PATIENTS.DELETE_ERROR
    };
  }
}

/**
 * Update patient
 */
export async function updatePatient(hospitalId, data) {
  try {
    await updatePatientService(hospitalId, data);
    
    revalidatePath(ROUTES.ADMIN.PATIENTS);
    revalidatePath(`/patients/${hospitalId}`);
    
    return {
      success: true,
      message: TOAST_MESSAGES.PATIENTS.UPDATE_SUCCESS
    };
  } catch (error) {
    console.error('Failed to update patient:', error);
    return {
      success: false,
      error: TOAST_MESSAGES.PATIENTS.UPDATE_ERROR
    };
  }
}
