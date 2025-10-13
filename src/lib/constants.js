/**
 * Global Application Constants
 */

// App metadata
export const APP_NAME = 'DocLink';
export const APP_TAGLINE = 'Your Health, Connected';
export const APP_DESCRIPTION = 'Seamlessly book and manage your doctor appointments';

// Business rules
export const APPOINTMENT_RULES = {
  AVAILABLE_DAYS: ['Friday'], // Only Fridays
  BOOKING_ADVANCE_DAYS: 7, // Book up to 7 days in advance
  CANCELLATION_HOURS: 24, // Cancel at least 24 hours before
  SLOTS_PER_DAY: 12,
  SLOT_DURATION_MINUTES: 30,
};

// Date/Time formats
export const DATE_FORMATS = {
  DISPLAY: 'PPP', // e.g., "April 29, 2023"
  SHORT: 'PP', // e.g., "Apr 29, 2023"
  TIME: 'p', // e.g., "5:00 PM"
  DATETIME: 'PPp', // e.g., "Apr 29, 2023, 5:00 PM"
  ISO: "yyyy-MM-dd'T'HH:mm:ss",
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

// File upload
export const FILE_UPLOAD = {
  MAX_SIZE_MB: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
};

// Form validation
export const VALIDATION = {
  PHONE_PATTERN: /^[0-9]{10}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_PASSWORD_LENGTH: 8,
  HOSPITAL_ID_PATTERN: /^[A-Z0-9]{6,10}$/,
};

// Toast messages
export const TOAST_MESSAGES = {
  APPOINTMENTS: {
    CREATE_SUCCESS: 'Appointment booked successfully!',
    CREATE_ERROR: 'Failed to book appointment. Please try again.',
    UPDATE_SUCCESS: 'Appointment updated successfully!',
    UPDATE_ERROR: 'Failed to update appointment. Please try again.',
    CANCEL_SUCCESS: 'Appointment cancelled successfully!',
    CANCEL_ERROR: 'Failed to cancel appointment. Please try again.',
    DELETE_SUCCESS: 'Appointment deleted successfully!',
    DELETE_ERROR: 'Failed to delete appointment. Please try again.',
  },
  DOCTORS: {
    CREATE_SUCCESS: 'Doctor added successfully!',
    CREATE_ERROR: 'Failed to add doctor. Please try again.',
    UPDATE_SUCCESS: 'Doctor updated successfully!',
    UPDATE_ERROR: 'Failed to update doctor. Please try again.',
    DELETE_SUCCESS: 'Doctor removed successfully!',
    DELETE_ERROR: 'Failed to remove doctor. Please try again.',
  },
  PATIENTS: {
    CREATE_SUCCESS: 'Patient added successfully!',
    CREATE_ERROR: 'Failed to add patient. Please try again.',
    UPDATE_SUCCESS: 'Patient updated successfully!',
    UPDATE_ERROR: 'Failed to update patient. Please try again.',
    DELETE_SUCCESS: 'Patient removed successfully!',
    DELETE_ERROR: 'Failed to remove patient. Please try again.',
  },
  ERROR: {
    GENERIC: 'Something went wrong. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION: 'Please check your input and try again.',
  },
};

// User roles
export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
};

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  LANGUAGE: 'language',
  THEME: 'theme',
};
