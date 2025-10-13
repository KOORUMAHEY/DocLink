/**
 * Patients Feature Module
 * Central export point for all patients-related functionality
 * @module features/patients
 */

// Services
export {
  getPatientByHospitalId,
  createOrUpdatePatient,
  getUniquePatients,
  savePatientForDoctor,
  getSavedPatientsForDoctor,
  deletePatient,
  updatePatient,
} from './services/patientService';

// Actions
export {
  getPatientDetails,
  createOrUpdatePatient as createOrUpdatePatientAction,
  deletePatient as deletePatientAction,
  updatePatient as updatePatientAction,
} from './actions/patientActions';

// Hooks
export { usePatients } from './hooks/usePatients';

// Constants
export {
  PATIENT_STATUS,
  GENDER_OPTIONS,
  AGE_GROUPS,
  PATIENT_SORT_OPTIONS,
} from './constants/patientConstants';

// Utilities
export {
  formatPatientName,
  getPatientInitials,
  getAgeGroup,
  formatPatientContact,
  searchPatients,
  sortPatients,
  filterPatientsByGender,
  getPatientAvatar,
} from './utils/patientHelpers';
