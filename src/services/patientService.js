
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, doc, getDoc, setDoc, addDoc } from 'firebase/firestore';

export const getPatientByHospitalId = async (hospitalId) => {
    try {
        const patientRef = doc(db, 'patients', hospitalId);
        const docSnap = await getDoc(patientRef);
        if (docSnap.exists()) {
            return { hospitalId: docSnap.id, ...docSnap.data() };
        }
        
        // Fallback to searching appointments if not in patients collection
        // This is for backward compatibility with old data
        const appointmentsCol = collection(db, 'appointments');
        const q = query(
            appointmentsCol,
            where('hospitalId', '==', hospitalId)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return null;
        }
            
        // Sort documents by date descending to find the latest one
        const appointments = snapshot.docs.map(doc => doc.data());
        appointments.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
        const latestAppointment = appointments[0];
        
        return {
            name: latestAppointment.patientName,
            phone: latestAppointment.patientPhone,
            email: latestAppointment.patientEmail,
            age: latestAppointment.age,
            gender: latestAppointment.gender,
            doctorId: latestAppointment.doctorId, // Include doctor info
            doctorName: latestAppointment.doctorName,
        };

    } catch (error) {
        console.error("Failed to fetch patient by Hospital ID:", error);
        throw new Error("Could not fetch patient details.");
    }
};


export const createOrUpdatePatient = async (patientData) => {
    try {
        const patientRef = doc(db, 'patients', patientData.hospitalId);
        // Using setDoc with merge: true to create or update.
        await setDoc(patientRef, {
            name: patientData.patientName,
            phone: patientData.patientPhone,
            email: patientData.patientEmail,
            age: patientData.age,
            gender: patientData.gender,
            hospitalId: patientData.hospitalId,
            doctorId: patientData.doctorId || null,
            doctorName: patientData.doctorName || null,
        }, { merge: true });

        return { success: true };
    } catch(error) {
        console.error("Failed to create or update patient:", error);
        return { success: false, error: "Could not save patient data."};
    }
};

export const getUniquePatients = async () => {
    const patientsMap = new Map();
    try {
        // Prioritize fetching from the new 'patients' collection
        const patientsCol = collection(db, 'patients');
        const patientsSnapshot = await getDocs(patientsCol);
        patientsSnapshot.forEach(doc => {
            const patient = doc.data();
            if (!patientsMap.has(patient.hospitalId)) {
                patientsMap.set(patient.hospitalId, patient);
            }
        });

        // Fallback to appointments for any patients not in the patients collection
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
        console.error("Failed to fetch unique patients", error);
    }
    return Array.from(patientsMap.values());
}

export const savePatientForDoctor = async (doctorId, doctorName, hospitalId) => {
    try {
        // 1. Create a record in the doctor-patient relationship collection
        const docPatientRef = doc(db, "doctorPatients", `${doctorId}_${hospitalId}`);
        const docSnap = await getDoc(docPatientRef);

        if (docSnap.exists()) {
             // Patient already saved, but we'll ensure the main patient record is up-to-date.
        } else {
             await setDoc(docPatientRef, {
                doctorId,
                hospitalId,
                savedAt: new Date().toISOString(),
            });
        }
        
        // 2. Update the patient's main record to include the doctor's info
        const patientRef = doc(db, 'patients', hospitalId);
        await setDoc(patientRef, {
            doctorId: doctorId,
            doctorName: doctorName
        }, { merge: true });

        return { success: true };
    } catch (error) {
        console.error("Failed to save patient for doctor:", error);
        return { success: false, error: "Could not save patient." };
    }
}

export const getSavedPatientsForDoctor = async (doctorId) => {
    try {
        const doctorPatientsCol = collection(db, 'doctorPatients');
        const q = query(doctorPatientsCol, where('doctorId', '==', doctorId));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return [];
        }

        const patientIds = snapshot.docs.map(doc => doc.data().hospitalId);

        // Fetch details for each saved patient
        const patientPromises = patientIds.map(id => getPatientByHospitalId(id));
        const patients = await Promise.all(patientPromises);
        
        // Filter out any null results if a patient wasn't found
        return patients.filter(p => p !== null);

    } catch (error) {
        console.error("Failed to get saved patients for doctor:", error);
        throw new Error("Could not fetch saved patients.");
    }
}
