import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, addDoc, query, orderBy, where } from 'firebase/firestore';
import { getDoctorById } from './doctorService';
import { createOrUpdatePatient } from './patientService';
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
    throw new Error("Could not fetch appointments.");
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
    const doctor = await getDoctorById(data.doctorId);

    if (!doctor) {
        throw new Error("Doctor not found");
    }
    const doctorName = doctor.name;
    
    // If it's a new patient, create an entry in the 'patients' collection
    if (data.patientType === 'new') {
        await createOrUpdatePatient(data);
    }


    const newAppointment = {
        patientType: data.patientType,
        hospitalId: data.hospitalId,
        patientName: data.patientName,
        patientPhone: data.patientPhone,
        patientEmail: data.patientEmail,
        age: data.age,
        gender: data.gender,
        healthPriority: data.healthPriority,
        description: data.description || 'N/A',
        doctorId: data.doctorId,
        doctorName,
        appointmentDate: data.appointmentDate,
        status: 'scheduled',
    };

    const docRef = await addDoc(collection(db, 'appointments'), newAppointment);
    
    return { ...newAppointment, id: docRef.id };
 } catch(error) {
    console.error("Failed to create appointment in Firestore:", error);
    throw new Error("Could not create appointment.");
 }
};

// Stub for updateAppointmentStatusInDb
export const updateAppointmentStatusInDb = async (appointmentId, status) => {
  // TODO: Implement actual update logic
  console.log(`Stub: update status for appointment ${appointmentId} to ${status}`);
  return { appointmentId, status };
};
