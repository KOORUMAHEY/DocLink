/**
 * Patient Service
 * Handles all Firestore operations for patients
 * @module features/patients/services/patientService
 */

import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

/**
 * Get patient by hospital ID
 */
export const getPatientByHospitalId = async (hospitalId) => {
  try {
    const patientRef = doc(db, 'patients', hospitalId);
    const docSnap = await getDoc(patientRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, hospitalId: docSnap.id, ...docSnap.data() };
    }
    
    // Fallback to appointments for backward compatibility
    const appointmentsCol = collection(db, 'appointments');
    const q = query(appointmentsCol, where('hospitalId', '==', hospitalId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;
      
    const appointments = snapshot.docs.map(doc => doc.data());
    appointments.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
    const latest = appointments[0];
    
    return {
      id: hospitalId,
      hospitalId: hospitalId,
      name: latest.patientName,
      phone: latest.patientPhone,
      email: latest.patientEmail,
      age: latest.age,
      gender: latest.gender,
      doctorId: latest.doctorId,
      doctorName: latest.doctorName,
    };
  } catch (error) {
    console.error("Failed to fetch patient:", error);
    throw new Error("Could not fetch patient details.");
  }
};

/**
 * Create or update patient
 */
export const createOrUpdatePatient = async (patientData) => {
  try {
    const patientRef = doc(db, 'patients', patientData.hospitalId);
    
    const patientDoc = {
      hospitalId: patientData.hospitalId,
      ...(patientData.patientName && { name: patientData.patientName }),
      ...(patientData.patientPhone && { phone: patientData.patientPhone }),
      ...(patientData.patientEmail && { email: patientData.patientEmail }),
      ...(patientData.age && { age: patientData.age }),
      ...(patientData.gender && { gender: patientData.gender }),
      ...(patientData.doctorId && { doctorId: patientData.doctorId }),
      ...(patientData.doctorName && { doctorName: patientData.doctorName }),
    };
    
    await setDoc(patientRef, patientDoc, { merge: true });
    return patientRef;
  } catch(error) {
    console.error("Failed to create/update patient:", error);
    throw new Error("Could not save patient data.");
  }
};

/**
 * Get all unique patients
 */
export const getUniquePatients = async () => {
  const patientsMap = new Map();
  
  try {
    const patientsCol = collection(db, 'patients');
    const patientsSnapshot = await getDocs(patientsCol);
    
    patientsSnapshot.forEach(doc => {
      const patient = doc.data();
      if (!patientsMap.has(patient.hospitalId)) {
        patientsMap.set(patient.hospitalId, patient);
      }
    });

    // Fallback to appointments
    const appointmentsCol = collection(db, 'appointments');
    const appointmentsSnapshot = await getDocs(appointmentsCol);
    
    appointmentsSnapshot.forEach(doc => {
      const appt = doc.data();
      if (!patientsMap.has(appt.hospitalId)) {
        patientsMap.set(appt.hospitalId, {
          hospitalId: appt.hospitalId,
          name: appt.patientName,
          phone: appt.patientPhone,
          email: appt.patientEmail,
          gender: appt.gender,
          age: appt.age,
        });
      }
    });
  } catch(error) {
    console.error("Failed to fetch patients:", error);
  }
  
  return Array.from(patientsMap.values());
};

/**
 * Save patient for doctor
 */
export const savePatientForDoctor = async (doctorId, doctorName, hospitalId) => {
  try {
    const docPatientRef = doc(db, "doctorPatients", `${doctorId}_${hospitalId}`);
    const docSnap = await getDoc(docPatientRef);

    if (!docSnap.exists()) {
      await setDoc(docPatientRef, {
        doctorId,
        hospitalId,
        savedAt: new Date().toISOString(),
      });
    }
    
    const patientRef = doc(db, 'patients', hospitalId);
    await setDoc(patientRef, {
      doctorId,
      doctorName
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error("Failed to save patient:", error);
    return { success: false, error: "Could not save patient." };
  }
};

/**
 * Get saved patients for doctor
 */
export const getSavedPatientsForDoctor = async (doctorId) => {
  try {
    const doctorPatientsCol = collection(db, 'doctorPatients');
    const q = query(doctorPatientsCol, where('doctorId', '==', doctorId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return [];

    const patientIds = snapshot.docs.map(doc => doc.data().hospitalId);
    const patientPromises = patientIds.map(id => getPatientByHospitalId(id));
    const patients = await Promise.all(patientPromises);
    
    return patients.filter(p => p !== null);
  } catch (error) {
    console.error("Failed to get saved patients:", error);
    throw new Error("Could not fetch saved patients.");
  }
};

/**
 * Delete patient
 */
export const deletePatient = async (hospitalId) => {
  try {
    const patientRef = doc(db, 'patients', hospitalId);
    await deleteDoc(patientRef);
  } catch (error) {
    console.error("Failed to delete patient:", error);
    throw new Error("Could not delete patient.");
  }
};

/**
 * Update patient
 */
export const updatePatient = async (hospitalId, data) => {
  try {
    const patientRef = doc(db, 'patients', hospitalId);
    await updateDoc(patientRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return { hospitalId, ...data };
  } catch (error) {
    console.error("Failed to update patient:", error);
    throw new Error("Could not update patient.");
  }
};
