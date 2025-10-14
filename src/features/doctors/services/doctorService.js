/**
 * Doctor Service
 * Handles all Firestore operations for doctors
 * @module features/doctors/services/doctorService
 */

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { doctors as mockDoctors } from '@/lib/mock-data';

/**
 * Fetch all doctors from Firestore
 * Falls back to mock data if Firestore is empty or fails
 * @returns {Promise<Array>} Array of doctor objects
 */
export const getDoctors = async () => {
  try {
    const doctorsCol = collection(db, 'doctors');
    const doctorSnapshot = await getDocs(doctorsCol);
    
    if (doctorSnapshot.empty) {
      console.log("No doctors found in Firestore, using mock data.");
      return mockDoctors;
    }
    
    const doctorList = doctorSnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    return doctorList;
  } catch (error) {
    console.error("Failed to fetch doctors from Firestore:", error);
    console.log("Falling back to mock data.");
    return mockDoctors;
  }
};

/**
 * Fetch a single doctor by ID
 * @param {string} id - Doctor ID
 * @returns {Promise<Object|null>} Doctor object or null if not found
 */
export const getDoctorById = async (id) => {
  try {
    const docRef = doc(db, 'doctors', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log(`Doctor ${id} not found in Firestore.`);
      return null;
    }
  } catch (error) {
    console.error(`Failed to fetch doctor ${id} from Firestore:`, error);
    throw new Error("Could not fetch doctor details.");
  }
};

/**
 * Fetch a doctor by email address
 * @param {string} email - Doctor email
 * @returns {Promise<Object|null>} Doctor object or null if not found
 */
export const getDoctorByEmail = async (email) => {
  try {
    const doctorsCol = collection(db, 'doctors');
    const q = query(doctorsCol, where('email', '==', email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }
    
    // Assuming email is unique, return the first match
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error(`Failed to fetch doctor with email ${email}:`, error);
    throw new Error("Could not fetch doctor by email.");
  }
};

/**
 * Create a new doctor in Firestore
 * @param {Object} data - Doctor data
 * @returns {Promise<Object>} Created doctor object with ID
 */
export const createDoctor = async (data) => {
  try {
    console.log('🔵 Attempting to create doctor in Firestore...');
    console.log('🔵 Firebase DB instance:', db ? 'Connected' : 'Not connected');
    
    // Note: In production, passwords should be hashed and handled by authentication service
    const doctorData = {
      name: data.name,
      email: data.email,
      password: data.password, // WARNING: This is for demo only - hash passwords in production
      specialization: data.specialization,
      bio: data.bio || '',
      imageUrl: data.imageUrl,
      createdAt: new Date().toISOString(),
      status: 'active', // active, inactive, on-leave
    };
    
    const docRef = await addDoc(collection(db, 'doctors'), doctorData);
    console.log('✅ Doctor successfully created in Firestore with ID:', docRef.id);
    return { ...doctorData, id: docRef.id };
  } catch (error) {
    console.error("❌ Failed to create doctor in Firestore:", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      name: error.name
    });
    console.log("⚠️ Falling back to mock data creation.");
    // Fallback to mock creation
    const mockId = `mock-${Date.now()}`;
    const newDoctor = { 
      ...data, 
      id: mockId, 
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    mockDoctors.push(newDoctor);
    console.log('✅ Doctor created in mock data with ID:', mockId);
    return newDoctor;
  }
};

/**
 * Update an existing doctor
 * @param {string} id - Doctor ID
 * @param {Object} data - Updated doctor data
 * @returns {Promise<Object>} Updated doctor object
 */
export const updateDoctor = async (id, data) => {
  try {
    const docRef = doc(db, 'doctors', id);
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    await updateDoc(docRef, updateData);
    return { id, ...updateData };
  } catch (error) {
    console.error(`Failed to update doctor ${id}:`, error);
    throw new Error("Could not update doctor.");
  }
};

/**
 * Delete a doctor
 * @param {string} id - Doctor ID
 * @returns {Promise<void>}
 */
export const deleteDoctor = async (id) => {
  try {
    const docRef = doc(db, 'doctors', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Failed to delete doctor ${id}:`, error);
    throw new Error("Could not delete doctor.");
  }
};

/**
 * Search doctors by specialization
 * @param {string} specialization - Specialization to search for
 * @returns {Promise<Array>} Array of matching doctors
 */
export const getDoctorsBySpecialization = async (specialization) => {
  try {
    const doctorsCol = collection(db, 'doctors');
    const q = query(doctorsCol, where('specialization', '==', specialization));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
  } catch (error) {
    console.error(`Failed to fetch doctors by specialization ${specialization}:`, error);
    throw new Error("Could not search doctors.");
  }
};

/**
 * Get doctor statistics
 * @param {string} doctorId - Doctor ID
 * @returns {Promise<Object>} Doctor statistics
 */
export const getDoctorStats = async (doctorId) => {
  try {
    // This would typically fetch from appointments collection
    // Placeholder implementation
    return {
      totalAppointments: 0,
      upcomingAppointments: 0,
      completedAppointments: 0,
      cancelledAppointments: 0,
      totalPatients: 0,
    };
  } catch (error) {
    console.error(`Failed to fetch stats for doctor ${doctorId}:`, error);
    throw new Error("Could not fetch doctor statistics.");
  }
};
