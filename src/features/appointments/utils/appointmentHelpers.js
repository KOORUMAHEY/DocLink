/**
 * Helper utilities for appointment operations
 */

import { format, parseISO, isBefore, isAfter, isFriday } from 'date-fns';
import { APPOINTMENT_STATUS, APPOINTMENT_STATUS_COLORS, APPOINTMENT_STATUS_VARIANTS } from '../constants/appointmentStatus';

/**
 * Format appointment date to display format
 */
export function formatAppointmentDate(dateString, formatStr = 'PPP') {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Format appointment time
 */
export function formatAppointmentTime(dateString) {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'p'); // e.g., "2:30 PM"
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'TBD';
  }
}

/**
 * Get status badge variant
 */
export function getStatusVariant(status) {
  return APPOINTMENT_STATUS_VARIANTS[status] || 'default';
}

/**
 * Get status badge color
 */
export function getStatusColor(status) {
  return APPOINTMENT_STATUS_COLORS[status] || 'gray';
}

/**
 * Check if appointment is upcoming
 */
export function isUpcoming(dateString) {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return isAfter(date, new Date());
  } catch (error) {
    return false;
  }
}

/**
 * Check if appointment is past
 */
export function isPast(dateString) {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return isBefore(date, new Date());
  } catch (error) {
    return false;
  }
}

/**
 * Validate if date is a Friday
 */
export function isValidAppointmentDay(date) {
  const appointmentDate = typeof date === 'string' ? parseISO(date) : date;
  return isFriday(appointmentDate);
}

/**
 * Group appointments by date
 */
export function groupAppointmentsByDate(appointments) {
  return appointments.reduce((groups, appointment) => {
    const dateKey = formatAppointmentDate(appointment.appointmentDate, 'yyyy-MM-dd');
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(appointment);
    return groups;
  }, {});
}

/**
 * Calculate appointment statistics
 */
export function calculateAppointmentStats(appointments) {
  return {
    total: appointments.length,
    upcoming: appointments.filter(a => isUpcoming(a.appointmentDate) && a.status === APPOINTMENT_STATUS.SCHEDULED).length,
    completed: appointments.filter(a => a.status === APPOINTMENT_STATUS.COMPLETED).length,
    cancelled: appointments.filter(a => a.status === APPOINTMENT_STATUS.CANCELLED).length,
    uniqueDoctors: new Set(appointments.map(a => a.doctorId)).size,
  };
}
