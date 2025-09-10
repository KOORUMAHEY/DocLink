import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const getDynamicFormConfig = async (doctorId) => {
  try {
    // Default config with custom fields support
    const defaultConfig = {
      requiredFields: ['patientName', 'patientPhone', 'age', 'gender', 'doctorId', 'appointmentDate', 'timeSlot'],
      optionalFields: ['patientEmail', 'description', 'healthPriority'],
      customFields: [],
      fieldOrder: ['patientName', 'patientPhone', 'patientEmail', 'age', 'gender', 'healthPriority', 'description'],
      customValidations: {},
    };

    // Fetch from doctor's document if it has a formConfig field
    const doctorRef = doc(db, 'doctors', doctorId);
    const doctorSnap = await getDoc(doctorRef);
    if (doctorSnap.exists()) {
      const doctorData = doctorSnap.data();
      if (doctorData.formConfig) {
        return { ...defaultConfig, ...doctorData.formConfig };
      }
    }

    return defaultConfig;
  } catch (error) {
    console.error('Error fetching dynamic form config:', error);
    throw new Error('Could not fetch form configuration.');
  }
};

export const saveDynamicFormConfig = async (doctorId, config) => {
  try {
    const doctorRef = doc(db, 'doctors', doctorId);
    await updateDoc(doctorRef, {
      formConfig: config
    });
    console.log('Form config saved for doctor', doctorId);
  } catch (error) {
    console.error('Error saving dynamic form config:', error);
    throw new Error('Could not save form configuration.');
  }
};
