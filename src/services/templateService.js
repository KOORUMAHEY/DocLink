import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, collection, getDocs, addDoc } from 'firebase/firestore';

// Predefined form templates
export const formTemplates = {
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'No additional details required',
    icon: '✅',
    sections: []
  },

  general: {
    id: 'general',
    name: 'General Practice',
    description: 'Standard appointment form for general practitioners',
    icon: '🩺',
    sections: [
      {
        id: 'medical_info',
        title: 'Medical Information',
        fields: [
          { id: 'symptoms', type: 'textarea', label: 'Current Symptoms', required: true, placeholder: 'Describe your symptoms...' },
          { id: 'medications', type: 'textarea', label: 'Current Medications', required: false, placeholder: 'List any medications...' },
          { id: 'allergies', type: 'text', label: 'Allergies', required: false, placeholder: 'Any known allergies' }
        ]
      }
    ]
  },
  
  cardiology: {
    id: 'cardiology',
    name: 'Cardiology',
    description: 'Specialized form for heart specialists',
    icon: '❤️',
    sections: [
      {
        id: 'cardiac_history',
        title: 'Cardiac History',
        fields: [
          { id: 'chest_pain', type: 'radio', label: 'Chest Pain', required: true, options: ['None', 'Mild', 'Moderate', 'Severe'] },
          { id: 'heart_rate', type: 'number', label: 'Resting Heart Rate', required: false, placeholder: '70' },
          { id: 'blood_pressure', type: 'text', label: 'Blood Pressure', required: false, placeholder: '120/80' },
          { id: 'family_history', type: 'checkbox', label: 'Family History of Heart Disease', required: false },
          { id: 'previous_procedures', type: 'textarea', label: 'Previous Cardiac Procedures', required: false, placeholder: 'List any previous procedures...' }
        ]
      }
    ]
  },

  pediatrics: {
    id: 'pediatrics',
    name: 'Pediatrics',
    description: 'Child-friendly form for pediatric appointments',
    icon: '👶',
    sections: [
      {
        id: 'child_info',
        title: 'Child Information',
        fields: [
          { id: 'childName', type: 'text', label: 'Child\'s Name', required: true, placeholder: 'Enter child\'s name' },
          { id: 'parentName', type: 'text', label: 'Parent/Guardian Name', required: true, placeholder: 'Enter parent name' },
          { id: 'parentPhone', type: 'tel', label: 'Parent Phone', required: true, placeholder: '+1 (555) 123-4567' },
          { id: 'birthDate', type: 'date', label: 'Date of Birth', required: true },
          { id: 'gender', type: 'select', label: 'Gender', required: true, options: ['Male', 'Female'] }
        ]
      },
      {
        id: 'medical_info',
        title: 'Medical Information',
        fields: [
          { id: 'vaccination_status', type: 'select', label: 'Vaccination Status', required: true, options: ['Up to date', 'Missing some', 'Not vaccinated'] },
          { id: 'allergies', type: 'text', label: 'Allergies', required: false, placeholder: 'Food, medicine, or other allergies' },
          { id: 'symptoms', type: 'textarea', label: 'Current Concerns', required: true, placeholder: 'What brings you in today?' },
          { id: 'developmental_concerns', type: 'textarea', label: 'Developmental Concerns', required: false, placeholder: 'Any developmental concerns...' }
        ]
      }
    ]
  },

  dermatology: {
    id: 'dermatology',
    name: 'Dermatology',
    description: 'Skin condition assessment form',
    icon: '🔬',
    sections: [
      {
        id: 'skin_concerns',
        title: 'Skin Concerns',
        fields: [
          { id: 'primary_concern', type: 'textarea', label: 'Primary Skin Concern', required: true, placeholder: 'Describe your main concern...' },
          { id: 'affected_areas', type: 'checkbox-group', label: 'Affected Areas', required: true, options: ['Face', 'Scalp', 'Arms', 'Legs', 'Torso', 'Hands', 'Feet'] },
          { id: 'duration', type: 'select', label: 'How long have you had this condition?', required: true, options: ['Less than 1 week', '1-4 weeks', '1-6 months', '6+ months', 'Years'] },
          { id: 'previous_treatments', type: 'textarea', label: 'Previous Treatments', required: false, placeholder: 'What treatments have you tried?' }
        ]
      }
    ]
  },

  orthopedic: {
    id: 'orthopedic',
    name: 'Orthopedic',
    description: 'Bone and joint specialist form',
    icon: '🦴',
    sections: [
      {
        id: 'orthopedic_concerns',
        title: 'Orthopedic Assessment',
        fields: [
          { id: 'pain_location', type: 'checkbox-group', label: 'Pain Location', required: true, options: ['Neck', 'Shoulder', 'Elbow', 'Wrist', 'Back', 'Hip', 'Knee', 'Ankle', 'Foot'] },
          { id: 'pain_scale', type: 'radio', label: 'Pain Level (1-10)', required: true, options: ['1-2 (Mild)', '3-4', '5-6 (Moderate)', '7-8', '9-10 (Severe)'] },
          { id: 'injury_cause', type: 'select', label: 'How did the injury occur?', required: false, options: ['Sudden injury', 'Gradual onset', 'Sports injury', 'Work-related', 'Motor vehicle accident', 'Fall', 'Unknown'] },
          { id: 'symptoms_description', type: 'textarea', label: 'Describe your symptoms', required: true, placeholder: 'Pain, stiffness, swelling, etc.' }
        ]
      }
    ]
  }
};

export const getDynamicFormConfig = async (doctorId) => {
  try {
    const defaultConfig = {
      templateId: 'minimal',
      customSections: [],
      fieldOrder: []
    };

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

export const saveFormTemplate = async (doctorId, template) => {
  try {
    const templatesCol = collection(db, 'formTemplates');
    const templateData = {
      ...template,
      doctorId,
      createdAt: new Date().toISOString(),
      isCustom: true
    };
    
    const docRef = await addDoc(templatesCol, templateData);
    return { ...templateData, id: docRef.id };
  } catch (error) {
    console.error('Error saving form template:', error);
    throw new Error('Could not save template.');
  }
};

export const getCustomTemplates = async (doctorId) => {
  try {
    const templatesCol = collection(db, 'formTemplates');
    const snapshot = await getDocs(templatesCol);
    
    if (snapshot.empty) {
      return [];
    }
    
    const templates = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(template => template.doctorId === doctorId);
    
    return templates;
  } catch (error) {
    console.error('Error fetching custom templates:', error);
    return [];
  }
};
