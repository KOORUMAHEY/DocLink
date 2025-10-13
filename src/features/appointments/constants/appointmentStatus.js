/**
 * Appointment Status Constants
 * Centralized status definitions for appointments
 */

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no-show',
  RESCHEDULED: 'rescheduled',
};

export const APPOINTMENT_STATUS_LABELS = {
  [APPOINTMENT_STATUS.SCHEDULED]: 'Scheduled',
  [APPOINTMENT_STATUS.CONFIRMED]: 'Confirmed',
  [APPOINTMENT_STATUS.COMPLETED]: 'Completed',
  [APPOINTMENT_STATUS.CANCELLED]: 'Cancelled',
  [APPOINTMENT_STATUS.NO_SHOW]: 'No Show',
  [APPOINTMENT_STATUS.RESCHEDULED]: 'Rescheduled',
};

export const APPOINTMENT_STATUS_COLORS = {
  [APPOINTMENT_STATUS.SCHEDULED]: 'blue',
  [APPOINTMENT_STATUS.CONFIRMED]: 'green',
  [APPOINTMENT_STATUS.COMPLETED]: 'gray',
  [APPOINTMENT_STATUS.CANCELLED]: 'red',
  [APPOINTMENT_STATUS.NO_SHOW]: 'orange',
  [APPOINTMENT_STATUS.RESCHEDULED]: 'yellow',
};

export const APPOINTMENT_STATUS_VARIANTS = {
  [APPOINTMENT_STATUS.SCHEDULED]: 'default',
  [APPOINTMENT_STATUS.CONFIRMED]: 'success',
  [APPOINTMENT_STATUS.COMPLETED]: 'secondary',
  [APPOINTMENT_STATUS.CANCELLED]: 'destructive',
  [APPOINTMENT_STATUS.NO_SHOW]: 'warning',
  [APPOINTMENT_STATUS.RESCHEDULED]: 'outline',
};
