/**
 * Doctors Feature Module
 * Central export point for all doctors-related functionality
 * @module features/doctors
 */

// Services
export {
  getDoctors,
  getDoctorById,
  getDoctorByEmail,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorsBySpecialization,
  getDoctorStats,
} from './services/doctorService';

// Actions
export {
  createDoctor as createDoctorAction,
  updateDoctor as updateDoctorAction,
  deleteDoctor as deleteDoctorAction,
  updateDoctorStatus,
  submitDoctorForm,
} from './actions/doctorActions';

// Components
export { DoctorCard } from './components/DoctorCard';
export { DoctorForm } from './components/DoctorForm';
export { DoctorNav } from './components/DoctorNav';
export { DoctorSidebar } from './components/DoctorSidebar';
export { DoctorHeader } from './components/DoctorHeader';
export { DoctorFooter } from './components/DoctorFooter';
export { DoctorAppointmentsClient } from './components/DoctorAppointmentsClient';

// Hooks
export { useDoctors } from './hooks/useDoctors';
export { useDoctorDetails } from './hooks/useDoctorDetails';

// Constants
export {
  DOCTOR_STATUS,
  DOCTOR_STATUS_LABELS,
  SPECIALIZATIONS,
  EXPERIENCE_LEVELS,
  EXPERIENCE_LABELS,
  WORKING_DAYS,
  DEFAULT_CONSULTATION_DURATION,
  MAX_PATIENTS_PER_DAY,
  PROFILE_FIELDS,
  DOCTOR_SORT_OPTIONS,
  DOCTOR_FILTER_OPTIONS,
  TIME_SLOTS,
  ALL_TIME_SLOTS,
} from './constants/doctorConstants';

// Utilities
export {
  formatDoctorName,
  getDoctorInitials,
  isDoctorAvailable,
  getDoctorStatusColor,
  filterDoctorsBySpecialization,
  filterDoctorsByStatus,
  searchDoctors,
  sortDoctors,
  isValidDoctorEmail,
  isValidSpecialization,
  getExperienceLevel,
  getDoctorAvatar,
  truncateBio,
  isDoctorProfileComplete,
  getProfileCompletion,
  groupDoctorsBySpecialization,
  getDoctorStatistics,
} from './utils/doctorHelpers';
