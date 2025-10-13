/**
 * Patient Constants
 * @module features/patients/constants/patientConstants
 */

export const PATIENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
};

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

export const AGE_GROUPS = {
  CHILD: 'child',        // 0-12
  TEEN: 'teen',          // 13-19
  ADULT: 'adult',        // 20-64
  SENIOR: 'senior',      // 65+
};

export const PATIENT_SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'age', label: 'Age' },
  { value: 'recent', label: 'Most Recent' },
];
