/**
 * Doctor Utility Functions
 * @module features/doctors/utils/doctorHelpers
 */

import { DOCTOR_STATUS, SPECIALIZATIONS } from '../constants/doctorConstants';

/**
 * Format doctor name for display
 * @param {Object} doctor - Doctor object
 * @returns {string} Formatted name with title
 */
export const formatDoctorName = (doctor) => {
  if (!doctor || !doctor.name) return 'Unknown Doctor';
  return `Dr. ${doctor.name}`;
};

/**
 * Get doctor initials
 * @param {Object} doctor - Doctor object
 * @returns {string} Doctor initials
 */
export const getDoctorInitials = (doctor) => {
  if (!doctor || !doctor.name) return '??';
  const names = doctor.name.trim().split(' ');
  if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};

/**
 * Check if doctor is available
 * @param {Object} doctor - Doctor object
 * @returns {boolean} True if doctor is active
 */
export const isDoctorAvailable = (doctor) => {
  return doctor && doctor.status === DOCTOR_STATUS.ACTIVE;
};

/**
 * Get doctor status badge color
 * @param {string} status - Doctor status
 * @returns {string} Tailwind color class
 */
export const getDoctorStatusColor = (status) => {
  switch (status) {
    case DOCTOR_STATUS.ACTIVE:
      return 'bg-green-100 text-green-800 border-green-200';
    case DOCTOR_STATUS.INACTIVE:
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case DOCTOR_STATUS.ON_LEAVE:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Filter doctors by specialization
 * @param {Array} doctors - Array of doctors
 * @param {string} specialization - Specialization to filter by
 * @returns {Array} Filtered doctors
 */
export const filterDoctorsBySpecialization = (doctors, specialization) => {
  if (!specialization || specialization === 'all') return doctors;
  return doctors.filter(doc => doc.specialization === specialization);
};

/**
 * Filter doctors by status
 * @param {Array} doctors - Array of doctors
 * @param {string} status - Status to filter by
 * @returns {Array} Filtered doctors
 */
export const filterDoctorsByStatus = (doctors, status) => {
  if (!status || status === 'all') return doctors;
  return doctors.filter(doc => doc.status === status);
};

/**
 * Search doctors by name
 * @param {Array} doctors - Array of doctors
 * @param {string} searchTerm - Search term
 * @returns {Array} Matching doctors
 */
export const searchDoctors = (doctors, searchTerm) => {
  if (!searchTerm) return doctors;
  const term = searchTerm.toLowerCase();
  return doctors.filter(doc => 
    doc.name.toLowerCase().includes(term) ||
    doc.specialization?.toLowerCase().includes(term) ||
    doc.email?.toLowerCase().includes(term)
  );
};

/**
 * Sort doctors by field
 * @param {Array} doctors - Array of doctors
 * @param {string} sortBy - Sort field
 * @returns {Array} Sorted doctors
 */
export const sortDoctors = (doctors, sortBy) => {
  const sorted = [...doctors];
  
  switch (sortBy) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'specialization':
      return sorted.sort((a, b) => 
        (a.specialization || '').localeCompare(b.specialization || '')
      );
    case 'experience':
      return sorted.sort((a, b) => 
        (b.yearsOfExperience || 0) - (a.yearsOfExperience || 0)
      );
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    default:
      return sorted;
  }
};

/**
 * Validate doctor email
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidDoctorEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate specialization
 * @param {string} specialization - Specialization to validate
 * @returns {boolean} True if valid
 */
export const isValidSpecialization = (specialization) => {
  return SPECIALIZATIONS.includes(specialization);
};

/**
 * Calculate experience level
 * @param {number} years - Years of experience
 * @returns {string} Experience level
 */
export const getExperienceLevel = (years) => {
  if (years <= 5) return 'junior';
  if (years <= 10) return 'mid-level';
  if (years <= 20) return 'senior';
  return 'expert';
};

/**
 * Get doctor avatar URL or placeholder
 * @param {Object} doctor - Doctor object
 * @returns {string} Image URL
 */
export const getDoctorAvatar = (doctor) => {
  if (doctor?.imageUrl) return doctor.imageUrl;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor?.name || 'Doctor')}&background=3b82f6&color=fff`;
};

/**
 * Format doctor bio with character limit
 * @param {string} bio - Doctor bio
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated bio
 */
export const truncateBio = (bio, maxLength = 150) => {
  if (!bio || bio.length <= maxLength) return bio || '';
  return bio.substring(0, maxLength).trim() + '...';
};

/**
 * Check if doctor profile is complete
 * @param {Object} doctor - Doctor object
 * @returns {boolean} True if profile is complete
 */
export const isDoctorProfileComplete = (doctor) => {
  const requiredFields = ['name', 'email', 'specialization', 'bio'];
  return requiredFields.every(field => doctor?.[field]);
};

/**
 * Calculate profile completion percentage
 * @param {Object} doctor - Doctor object
 * @returns {number} Completion percentage (0-100)
 */
export const getProfileCompletion = (doctor) => {
  const allFields = ['name', 'email', 'specialization', 'bio', 'imageUrl', 'phone', 'qualifications'];
  const completedFields = allFields.filter(field => doctor?.[field]).length;
  return Math.round((completedFields / allFields.length) * 100);
};

/**
 * Group doctors by specialization
 * @param {Array} doctors - Array of doctors
 * @returns {Object} Doctors grouped by specialization
 */
export const groupDoctorsBySpecialization = (doctors) => {
  return doctors.reduce((groups, doctor) => {
    const spec = doctor.specialization || 'Other';
    if (!groups[spec]) groups[spec] = [];
    groups[spec].push(doctor);
    return groups;
  }, {});
};

/**
 * Get doctor statistics summary
 * @param {Array} doctors - Array of doctors
 * @returns {Object} Statistics summary
 */
export const getDoctorStatistics = (doctors) => {
  return {
    total: doctors.length,
    active: doctors.filter(d => d.status === DOCTOR_STATUS.ACTIVE).length,
    inactive: doctors.filter(d => d.status === DOCTOR_STATUS.INACTIVE).length,
    onLeave: doctors.filter(d => d.status === DOCTOR_STATUS.ON_LEAVE).length,
    specializations: new Set(doctors.map(d => d.specialization)).size,
  };
};
