/**
 * Appointment Service
 * Handles all appointment-related database operations
 */

import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { getDoctorById } from '@/features/doctors';
import { createOrUpdatePatient } from '@/features/patients';
import { appointments as mockAppointments } from '@/lib/mock-data';

export const getAppointments = async (filters = {}) => {
  try {
    const appointmentsCol = collection(db, 'appointments');
    let appointmentList = [];
    let q;

    if (filters.searchQuery) {
        // Since Firestore doesn't support OR queries on different fields,
        // we perform two separate queries and merge the results.
        const phoneQuery = query(appointmentsCol, where('patientPhone', '==', filters.searchQuery));
        const hospitalIdQuery = query(appointmentsCol, where('hospitalId', '==', filters.searchQuery));

        const [phoneSnapshot, hospitalIdSnapshot] = await Promise.all([
            getDocs(phoneQuery),
            getDocs(hospitalIdQuery)
        ]);
        
        const appointmentsByPhone = phoneSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const appointmentsById = hospitalIdSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Merge and remove duplicates
        const combined = [...appointmentsByPhone, ...appointmentsById];
        appointmentList = Array.from(new Map(combined.map(item => [item.id, item])).values());

    } else {
        q = query(appointmentsCol, orderBy('appointmentDate', 'desc'));
        const appointmentSnapshot = await getDocs(q);
        if (!appointmentSnapshot.empty) {
            appointmentList = appointmentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
    }
    
    // Sort all results by date
    appointmentList.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
    
    // If no appointments found in Firestore, use mock data for testing
    if (appointmentList.length === 0) {
      console.log('No appointments found in Firestore, using mock data');
      if (filters.searchQuery) {
        appointmentList = mockAppointments.filter(appointment => 
          appointment.patientPhone === filters.searchQuery || 
          appointment.hospitalId === filters.searchQuery
        );
      } else {
        appointmentList = mockAppointments;
      }
    }
    
    return appointmentList;
  } catch (error) {
    console.error("Failed to fetch appointments from Firestore:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Check if it's a Firebase configuration error
    if (error.message && error.message.includes('Firebase')) {
      throw new Error("Firebase is not configured properly. Please check your environment variables.");
    }
    
    throw new Error(`Could not fetch appointments: ${error.message}`);
  }
};

export const getAppointmentsByDoctor = async (doctorId) => {
    try {
        const appointmentsCol = collection(db, 'appointments');
        const q = query(appointmentsCol, where('doctorId', '==', doctorId));
        const appointmentSnapshot = await getDocs(q);
        
        if (appointmentSnapshot.empty) {
            return [];
        }
        
        const appointments = appointmentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Sort appointments by date in descending order
        appointments.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
        
        return appointments;

    } catch(error) {
        console.error(`Failed to get appointments for doctor ${doctorId}:`, error);
        throw new Error("Could not fetch doctor's appointments.");
    }
};

export const getAppointmentById = async (id) => {
  try {
    const docRef = doc(db, 'appointments', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        console.log(`Appointment ${id} not found in Firestore.`);
        return null;
    }
  } catch(error) {
    console.error(`Failed to fetch appointment ${id}:`, error);
    throw new Error("Could not fetch appointment details.");
  }
};

export const createAppointment = async (data) => {
  try {
    // Convert the date string to a Firestore timestamp
    const appointmentDate = new Date(data.appointmentDate);
    if (isNaN(appointmentDate.getTime())) {
      throw new Error('Invalid appointment date');
    }

    const timeSlot = data.timeSlot.split('-')[0].trim(); // Get start time
    const [hours, minutes] = timeSlot.split(':').map(Number);
    appointmentDate.setHours(hours, minutes, 0, 0);

    // First create or update the patient
    let patientData = {
      hospitalId: data.hospitalId,
      patientName: data.patientName,
      patientPhone: data.patientPhone,
      patientEmail: data.patientEmail,
      age: data.age,
      gender: data.gender,
    };
    
    const patientRef = await createOrUpdatePatient(patientData);

    // Prepare appointment data
    const appointmentData = {
      ...data,
      appointmentDate: appointmentDate,
      createdAt: new Date(),
      status: 'scheduled',
      patientId: patientRef.id,
      lastUpdated: new Date()
    };

    // Remove redundant patient data from appointment
    delete appointmentData.patientName;
    delete appointmentData.patientPhone;
    delete appointmentData.patientEmail;
    delete appointmentData.age;
    delete appointmentData.gender;

    // Create the appointment
    const appointmentsCol = collection(db, 'appointments');
    const docRef = await addDoc(appointmentsCol, appointmentData);

    // Get doctor details for confirmation
    const doctorDetails = await getDoctorById(data.doctorId);

    return { 
      id: docRef.id,
      doctor: doctorDetails,
      date: appointmentDate,
      timeSlot: data.timeSlot,
      patientId: patientRef.id
    };
  } catch (error) {
    console.error('Error creating appointment:', error);
    if (error.code === 'permission-denied') {
      throw new Error('You do not have permission to create appointments.');
    }
    if (error.message.includes('Firebase')) {
      throw new Error('System is temporarily unavailable. Please try again later.');
    }
    throw new Error(error.message || 'Failed to create appointment. Please try again.');
  }
};// Stub for updateAppointmentStatusInDb
export const updateAppointmentStatusInDb = async (appointmentId, status) => {
  // TODO: Implement actual update logic
  console.log(`Stub: update status for appointment ${appointmentId} to ${status}`);
  return { appointmentId, status };
};
