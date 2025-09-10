
'use server';

import { getPatientByHospitalId } from '@/services/patientService';

export async function getPatientDetails(hospitalId) {
    try {
        const patient = await getPatientByHospitalId(hospitalId);
        if (patient) {
            // Standardize the output from getPatientByHospitalId
            const patientDetails = {
                patientName: patient.name,
                patientPhone: patient.phone,
                patientEmail: patient.email,
                age: patient.age,
                gender: patient.gender,
                doctorId: patient.doctorId, // Pass this along
                doctorName: patient.doctorName, // Pass this along
            };
            return { success: true, patient: patientDetails };
        }
        return { success: false, error: 'Patient not found.' };
    } catch (error) {
        console.error('Failed to get patient details:', error);
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred.' };
    }
}
