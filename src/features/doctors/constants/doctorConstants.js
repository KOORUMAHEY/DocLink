/**
 * Doctor Constants
 * @module features/doctors/constants/doctorConstants
 */

/**
 * Doctor status values
 */
export const DOCTOR_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ON_LEAVE: 'on-leave',
};

/**
 * Doctor status labels for display
 */
export const DOCTOR_STATUS_LABELS = {
  [DOCTOR_STATUS.ACTIVE]: 'Active',
  [DOCTOR_STATUS.INACTIVE]: 'Inactive',
  [DOCTOR_STATUS.ON_LEAVE]: 'On Leave',
};

/**
 * Common medical specializations
 */
export const SPECIALIZATIONS = [
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'General Practice',
  'Gynecology',
  'Neurology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Radiology',
  'Surgery',
  'Urology',
];

/**
 * Doctor experience levels
 */
export const EXPERIENCE_LEVELS = {
  JUNIOR: 'junior',
  MID_LEVEL: 'mid-level',
  SENIOR: 'senior',
  EXPERT: 'expert',
};

/**
 * Experience level labels
 */
export const EXPERIENCE_LABELS = {
  [EXPERIENCE_LEVELS.JUNIOR]: '0-5 years',
  [EXPERIENCE_LEVELS.MID_LEVEL]: '6-10 years',
  [EXPERIENCE_LEVELS.SENIOR]: '11-20 years',
  [EXPERIENCE_LEVELS.EXPERT]: '20+ years',
};

/**
 * Working days
 */
export const WORKING_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

/**
 * Default consultation duration in minutes
 */
export const DEFAULT_CONSULTATION_DURATION = 30;

/**
 * Maximum patients per day
 */
export const MAX_PATIENTS_PER_DAY = 20;

/**
 * Doctor profile completeness fields
 */
export const PROFILE_FIELDS = {
  BASIC: ['name', 'email', 'specialization'],
  COMPLETE: ['name', 'email', 'specialization', 'bio', 'imageUrl', 'phone', 'qualifications'],
};

/**
 * Sort options for doctor lists
 */
export const DOCTOR_SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'specialization', label: 'Specialization' },
  { value: 'experience', label: 'Experience' },
  { value: 'rating', label: 'Rating' },
];

/**
 * Filter options for doctor lists
 */
export const DOCTOR_FILTER_OPTIONS = {
  STATUS: [
    { value: 'all', label: 'All Status' },
    { value: DOCTOR_STATUS.ACTIVE, label: 'Active' },
    { value: DOCTOR_STATUS.INACTIVE, label: 'Inactive' },
    { value: DOCTOR_STATUS.ON_LEAVE, label: 'On Leave' },
  ],
  SPECIALIZATION: [
    { value: 'all', label: 'All Specializations' },
    ...SPECIALIZATIONS.map(spec => ({ value: spec, label: spec })),
  ],
};

/**
 * Doctor availability time slots
 */
export const TIME_SLOTS = {
  MORNING: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'],
  AFTERNOON: ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
  EVENING: ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30'],
};

/**
 * All available time slots
 */
export const ALL_TIME_SLOTS = [
  ...TIME_SLOTS.MORNING,
  ...TIME_SLOTS.AFTERNOON,
  ...TIME_SLOTS.EVENING,
];
