/**
 * Patient Utility Functions
 * @module features/patients/utils/patientHelpers
 */

/**
 * Format patient name
 */
export const formatPatientName = (patient) => {
  if (!patient || !patient.name) return 'Unknown Patient';
  return patient.name;
};

/**
 * Get patient initials
 */
export const getPatientInitials = (patient) => {
  if (!patient || !patient.name) return '??';
  const names = patient.name.trim().split(' ');
  if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};

/**
 * Get age group
 */
export const getAgeGroup = (age) => {
  if (age <= 12) return 'child';
  if (age <= 19) return 'teen';
  if (age <= 64) return 'adult';
  return 'senior';
};

/**
 * Format patient contact
 */
export const formatPatientContact = (patient) => {
  if (!patient) return '';
  const parts = [];
  if (patient.phone) parts.push(patient.phone);
  if (patient.email) parts.push(patient.email);
  return parts.join(' • ');
};

/**
 * Search patients
 */
export const searchPatients = (patients, searchTerm) => {
  if (!searchTerm) return patients;
  const term = searchTerm.toLowerCase();
  return patients.filter(p => 
    p.name?.toLowerCase().includes(term) ||
    p.hospitalId?.toLowerCase().includes(term) ||
    p.phone?.includes(term) ||
    p.email?.toLowerCase().includes(term)
  );
};

/**
 * Sort patients
 */
export const sortPatients = (patients, sortBy) => {
  const sorted = [...patients];
  
  switch (sortBy) {
    case 'name-asc':
      return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    case 'name-desc':
      return sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    case 'age':
      return sorted.sort((a, b) => (b.age || 0) - (a.age || 0));
    default:
      return sorted;
  }
};

/**
 * Filter patients by gender
 */
export const filterPatientsByGender = (patients, gender) => {
  if (!gender || gender === 'all') return patients;
  return patients.filter(p => p.gender === gender);
};

/**
 * Get patient avatar
 */
export const getPatientAvatar = (patient) => {
  if (patient?.imageUrl) return patient.imageUrl;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(patient?.name || 'Patient')}&background=22c55e&color=fff`;
};
