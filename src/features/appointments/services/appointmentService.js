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
  query, 
  where,
  orderBy
} from 'firebase/firestore';
import { getPatientByHospitalId, createOrUpdatePatient } from '@/features/patients';
import { getDoctorById } from '@/features/doctors';
import { appointments as mockAppointments } from '@/lib/mock-data';

// Helper function to merge patient data into appointment
const mergePatientData = async (appointmentData) => {
  if (!appointmentData.patientId) return appointmentData;

  try {
    const patientData = await getPatientByHospitalId(appointmentData.patientId);
    if (patientData) {
      appointmentData.patientName = patientData.name || patientData.patientName;
      appointmentData.patientPhone = patientData.phone || patientData.patientPhone;
      appointmentData.patientEmail = patientData.email || patientData.patientEmail;
      appointmentData.age = patientData.age;
      appointmentData.gender = patientData.gender;
      appointmentData.hospitalId = patientData.hospitalId || appointmentData.patientId;
    }
  } catch (patientError) {
    console.warn('Could not fetch patient details for appointment:', patientError);
  }

  return appointmentData;
};

// Helper function to merge doctor data into appointment
const mergeDoctorData = async (appointmentData) => {
  if (!appointmentData.doctorId) return appointmentData;

  try {
    const doctorData = await getDoctorById(appointmentData.doctorId);
    if (doctorData) {
      appointmentData.doctorName = doctorData.name || doctorData.doctorName;
      appointmentData.specialty = doctorData.specialty || doctorData.specialization;
      appointmentData.doctorEmail = doctorData.email;
      appointmentData.doctorPhone = doctorData.phone;
    }
  } catch (doctorError) {
    console.warn('Could not fetch doctor details for appointment:', doctorError);
  }

  return appointmentData;
};

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
    
    // Fetch patient and doctor details for each appointment
    const enrichedAppointments = await Promise.all(
      appointmentList.map(async (appointment) => {
        const enriched = { ...appointment };
        
        // Fetch patient details if patientId exists and patientName is missing
        if (appointment.patientId && !appointment.patientName) {
          try {
            const patientData = await getPatientByHospitalId(appointment.patientId);
            if (patientData) {
              enriched.patientName = patientData.name || patientData.patientName;
              enriched.patientPhone = patientData.phone || appointment.patientPhone;
              enriched.patientEmail = patientData.email || appointment.patientEmail;
              enriched.age = patientData.age;
              enriched.gender = patientData.gender;
              enriched.hospitalId = patientData.hospitalId || appointment.patientId;
            }
          } catch (patientError) {
            console.warn('Could not fetch patient details for appointment:', appointment.id, patientError);
          }
        }
        
        // Fetch doctor details if doctorId exists and doctorName is missing
        if (appointment.doctorId && !appointment.doctorName) {
          try {
            const doctorData = await getDoctorById(appointment.doctorId);
            if (doctorData) {
              enriched.doctorName = doctorData.name || appointment.doctorName;
              enriched.specialization = doctorData.specialty || doctorData.specialization;
              enriched.doctorEmail = doctorData.email;
              enriched.doctorPhone = doctorData.phone;
            }
          } catch (doctorError) {
            console.warn('Could not fetch doctor details for appointment:', appointment.id, doctorError);
          }
        }
        
        return enriched;
      })
    );
    
    // Sort all results by date
    enrichedAppointments.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
    
    // If no appointments found in Firestore, use mock data for testing
    if (enrichedAppointments.length === 0) {
      console.log('No appointments found in Firestore, using mock data');
      if (filters.searchQuery) {
        appointmentList = mockAppointments.filter(appointment => 
          appointment.patientPhone === filters.searchQuery || 
          appointment.hospitalId === filters.searchQuery
        );
      } else {
        appointmentList = mockAppointments;
      }
      return appointmentList;
    }
    
    return enrichedAppointments;
  } catch (error) {
    console.error("Failed to fetch appointments from Firestore:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Check if it's a Firebase configuration error
    if (error.message?.includes('Firebase')) {
      throw new Error("Firebase is not configured properly. Please check your environment variables.");
    }
    
    throw new Error(`Could not fetch appointments: ${error.message}`);
  }
};

export const getAppointmentsByDoctor = async (doctorId) => {
  try {
    console.log(`Fetching appointments for doctor: ${doctorId}`);
    
    // Try to fetch from Firebase first
    const appointmentsCol = collection(db, 'appointments');
    const q = query(
      appointmentsCol, 
      where('doctorId', '==', doctorId),
      orderBy('appointmentDate', 'desc')
    );
    const appointmentSnapshot = await getDocs(q);
    
    let appointments = [];
    
    if (!appointmentSnapshot.empty) {
      appointments = appointmentSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Ensure consistent date formatting
          appointmentDate: data.appointmentDate?.toDate?.() || new Date(data.appointmentDate),
          createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
          updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt),
          // Map timeSlot from time if needed
          timeSlot: data.timeSlot || data.time,
          // Ensure reason field
          reason: data.reason || data.description
        };
      });
      
      // Enrich with patient and doctor data
      for (const appointment of appointments) {
        await mergePatientData(appointment);
        await mergeDoctorData(appointment);
      }
      
      console.log(`Fetched ${appointments.length} appointments from Firebase`);
      return appointments;
    }
    
    // Fallback to mock data if no appointments found in Firebase
    console.log('No appointments found in Firebase, using mock data');
    const mockAppointmentsForDoctor = mockAppointments.filter(apt => apt.doctorId === doctorId);
    
    // Format mock data to match expected structure
    const formattedMockAppointments = mockAppointmentsForDoctor.map(appointment => ({
      ...appointment,
      appointmentDate: new Date(appointment.appointmentDate),
      createdAt: new Date(),
      updatedAt: new Date(),
      timeSlot: appointment.time,
      reason: appointment.description,
      // Add additional fields that might be expected
      healthPriority: appointment.healthPriority || 'normal',
      allergies: appointment.allergies || 'None known',
      medications: appointment.medications || 'None',
      bloodType: appointment.bloodType || 'Unknown'
    }));
    
    console.log(`Using ${formattedMockAppointments.length} mock appointments`);
    return formattedMockAppointments;

  } catch (error) {
    console.error(`Failed to get appointments for doctor ${doctorId}:`, error);
    
    // If Firebase fails, try to return mock data
    try {
      console.log('Firebase failed, falling back to mock data');
      const mockAppointmentsForDoctor = mockAppointments.filter(apt => apt.doctorId === doctorId);
      
      const formattedMockAppointments = mockAppointmentsForDoctor.map(appointment => ({
        ...appointment,
        appointmentDate: new Date(appointment.appointmentDate),
        createdAt: new Date(),
        updatedAt: new Date(),
        timeSlot: appointment.time,
        reason: appointment.description,
        healthPriority: appointment.healthPriority || 'normal',
        allergies: appointment.allergies || 'None known',
        medications: appointment.medications || 'None',
        bloodType: appointment.bloodType || 'Unknown'
      }));
      
      console.log(`Fallback: Using ${formattedMockAppointments.length} mock appointments`);
      return formattedMockAppointments;
    } catch (mockError) {
      console.error('Even mock data failed:', mockError);
      throw new Error("Could not fetch doctor's appointments from any source.");
    }
  }
};

export const getAppointmentById = async (id) => {
  try {
    const docRef = doc(db, 'appointments', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log(`Appointment ${id} not found in Firestore.`);
      return null;
    }

    const appointmentData = { id: docSnap.id, ...docSnap.data() };
    console.log('Retrieved appointment data:', appointmentData);
    console.log('Appointment date from Firestore:', appointmentData.appointmentDate);
    console.log('Appointment date type:', typeof appointmentData.appointmentDate);

    // Merge patient and doctor data
    await mergePatientData(appointmentData);
    await mergeDoctorData(appointmentData);

    return appointmentData;
  } catch(error) {
    console.error(`Failed to fetch appointment ${id}:`, error);
    throw new Error("Could not fetch appointment details.");
  }
};

export const createAppointment = async (data) => {
  try {
    // Convert the date string to a Firestore timestamp
    const appointmentDate = new Date(data.appointmentDate);
    console.log('Original appointmentDate string:', data.appointmentDate);
    console.log('Parsed appointmentDate:', appointmentDate);
    if (isNaN(appointmentDate.getTime())) {
      throw new Error('Invalid appointment date');
    }

    const timeSlot = data.timeSlot.split('-')[0].trim(); // Get start time
    console.log('Time slot:', timeSlot);
    // Parse time like "9:15 AM" or "2:30 PM"
    const timeMatch = timeSlot.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!timeMatch) {
      throw new Error('Invalid time slot format');
    }
    
    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const ampm = timeMatch[3].toUpperCase();
    
    if (ampm === 'PM' && hours !== 12) {
      hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
      hours = 0;
    }
    
    console.log('Setting hours:', hours, 'minutes:', minutes);
    appointmentDate.setHours(hours, minutes, 0, 0);
    console.log('Final appointmentDate:', appointmentDate);

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
};// Update appointment status in database
export const updateAppointmentStatusInDb = async (appointmentId, status) => {
  try {
    const docRef = doc(db, 'appointments', appointmentId);
    await updateDoc(docRef, {
      status: status,
      updatedAt: new Date()
    });
    return { appointmentId, status };
  } catch (error) {
    console.error(`Failed to update appointment ${appointmentId} status:`, error);
    throw new Error('Failed to update appointment status. Please try again.');
  }
};

// Reschedule appointment with new date and time
export const rescheduleAppointment = async (appointmentId, newDate, newTimeSlot, reason = '') => {
  try {
    const docRef = doc(db, 'appointments', appointmentId);
    await updateDoc(docRef, {
      appointmentDate: newDate,
      timeSlot: newTimeSlot,
      status: 'confirmed',
      rescheduleReason: reason,
      rescheduledAt: new Date(),
      updatedAt: new Date()
    });
    return { appointmentId, newDate, newTimeSlot };
  } catch (error) {
    console.error(`Failed to reschedule appointment ${appointmentId}:`, error);
    throw new Error('Failed to reschedule appointment. Please try again.');
  }
};

// Approve appointment
export const approveAppointment = async (appointmentId) => {
  return await updateAppointmentStatusInDb(appointmentId, 'confirmed');
};

// Reject appointment with reason
export const rejectAppointment = async (appointmentId, reason = '') => {
  try {
    const docRef = doc(db, 'appointments', appointmentId);
    await updateDoc(docRef, {
      status: 'rejected',
      rejectionReason: reason,
      rejectedAt: new Date(),
      updatedAt: new Date()
    });
    return { appointmentId, status: 'rejected' };
  } catch (error) {
    console.error(`Failed to reject appointment ${appointmentId}:`, error);
    throw new Error('Failed to reject appointment. Please try again.');
  }
};
