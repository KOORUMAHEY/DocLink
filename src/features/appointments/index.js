/**
 * Appointments Feature - Main Export
 * Central export point for all appointment-related modules
 */

// Components
export { AppointmentSearch } from './components/AppointmentSearch';
export { AppointmentForm } from './components/AppointmentForm';
export { AppointmentsDisplay } from './components/AppointmentsDisplay';
export { AppointmentsPageClient } from './components/AppointmentsPageClient';

// Hooks
export { useAppointments } from './hooks/useAppointments';

// Services
export {
  getAppointments,
  getAppointmentsByDoctor,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatusInDb,
} from './services/appointmentService';

// Actions
export {
  createAppointment as createAppointmentAction,
  updateAppointmentStatus,
} from './actions/appointmentActions';

// Constants
export {
  APPOINTMENT_STATUS,
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_COLORS,
  APPOINTMENT_STATUS_VARIANTS,
} from './constants/appointmentStatus';

// Utilities
export {
  formatAppointmentDate,
  formatAppointmentTime,
  getStatusVariant,
  getStatusColor,
  isUpcoming,
  isPast,
  isValidAppointmentDay,
  groupAppointmentsByDate,
  calculateAppointmentStats,
} from './utils/appointmentHelpers';
