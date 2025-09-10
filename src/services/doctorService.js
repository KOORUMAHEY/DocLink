
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, addDoc, query, where } from 'firebase/firestore';

export const getDoctors = async () => {
  try {
    const doctorsCol = collection(db, 'doctors');
    const doctorSnapshot = await getDocs(doctorsCol);
    if (doctorSnapshot.empty) {
        console.log("No doctors found in Firestore.");
        return [];
    }
    const doctorList = doctorSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return doctorList;
  } catch (error) {
    console.error("Failed to fetch doctors from Firestore:", error);
    throw new Error("Could not fetch doctors.");
  }
};

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
    } catch(error) {
        console.error(`Failed to fetch doctor ${id} from Firestore:`, error);
        throw new Error("Could not fetch doctor details.");
    }
};

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

    } catch(error) {
        console.error(`Failed to fetch doctor with email ${email}:`, error);
        throw new Error("Could not fetch doctor by email.");
    }
}

export const createDoctor = async (data) => {
    try {
        // Don't save password in plain text in a real app!
        // This is for demonstration purposes only.
        const doctorData = {
            name: data.name,
            email: data.email,
            password: data.password, // In a real app, hash this password
            specialization: data.specialization,
            bio: data.bio,
            imageUrl: data.imageUrl,
        };
        const docRef = await addDoc(collection(db, 'doctors'), doctorData);
        return { ...doctorData, id: docRef.id };
    } catch (error) {
        console.error("Failed to create doctor in Firestore:", error);
        throw new Error("Could not create doctor.");
    }
};
