'use server';

import { db } from '@/lib/firebase';
import { doc, updateDoc, Timestamp, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { format } from 'date-fns';

/**
 * Appointment Status Enum
 * Defines valid appointment states and transitions
 */
const APPOINTMENT_STATUS = {
  PENDING: 'pending',           // Initial state - awaiting doctor approval
  CONFIRMED: 'confirmed',       // Doctor approved
  IN_PROGRESS: 'in-progress',   // Appointment is happening
  COMPLETED: 'completed',       // Appointment finished successfully
  REJECTED: 'rejected',         // Doctor rejected the appointment
  CANCELLED: 'cancelled',       // Patient or doctor cancelled
  NO_SHOW: 'no-show',          // Patient didn't show up
  RESCHEDULED: 'rescheduled'   // Appointment rescheduled
};

/**
 * Valid status transitions
 */
const VALID_TRANSITIONS = {
  [APPOINTMENT_STATUS.PENDING]: [
    APPOINTMENT_STATUS.CONFIRMED,
    APPOINTMENT_STATUS.REJECTED,
    APPOINTMENT_STATUS.CANCELLED
  ],
  [APPOINTMENT_STATUS.CONFIRMED]: [
    APPOINTMENT_STATUS.IN_PROGRESS,
    APPOINTMENT_STATUS.CANCELLED,
    APPOINTMENT_STATUS.NO_SHOW,
    APPOINTMENT_STATUS.RESCHEDULED
  ],
  [APPOINTMENT_STATUS.IN_PROGRESS]: [
    APPOINTMENT_STATUS.COMPLETED,
    APPOINTMENT_STATUS.NO_SHOW
  ],
  [APPOINTMENT_STATUS.COMPLETED]: [],
  [APPOINTMENT_STATUS.REJECTED]: [],
  [APPOINTMENT_STATUS.CANCELLED]: [],
  [APPOINTMENT_STATUS.NO_SHOW]: [APPOINTMENT_STATUS.RESCHEDULED],
  [APPOINTMENT_STATUS.RESCHEDULED]: [
    APPOINTMENT_STATUS.CONFIRMED,
    APPOINTMENT_STATUS.PENDING
  ]
};

/**
 * Audit log entry for tracking all appointment actions
 */
const createAuditLog = async (appointmentId, action, performedBy, metadata = {}) => {
  try {
    const auditRef = collection(db, 'appointments', appointmentId, 'auditLog');
    await addDoc(auditRef, {
      action,
      performedBy,
      timestamp: Timestamp.now(),
      metadata,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Failed to create audit log for appointment ${appointmentId}:`, error);
  }
};

/**
 * Send notification about appointment action
 */
const sendNotification = async (appointmentId, type, recipientId, message) => {
  try {
    const notificationsRef = collection(db, 'notifications');
    await addDoc(notificationsRef, {
      appointmentId,
      type,
      recipientId,
      message,
      read: false,
      createdAt: Timestamp.now(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Failed to send notification for appointment ${appointmentId}:`, error);
  }
};

/**
 * Validate status transition
 */
const isValidTransition = (currentStatus, newStatus) => {
  const validStatuses = VALID_TRANSITIONS[currentStatus] || [];
  return validStatuses.includes(newStatus);
};

/**
 * Get appointment with error handling
 */
const getAppointmentById = async (appointmentId) => {
  try {
    const docRef = doc(db, 'appointments', appointmentId);
    const appointmentSnapshot = await (await import('firebase/firestore')).getDoc(docRef);
    
    if (!appointmentSnapshot.exists()) {
      throw new Error('Appointment not found');
    }

    return {
      id: appointmentSnapshot.id,
      ...appointmentSnapshot.data()
    };
  } catch (error) {
    console.error(`Error fetching appointment ${appointmentId}:`, error);
    throw error;
  }
};

/**
 * APPROVE APPOINTMENT
 * Doctor approves a pending appointment
 */
export const approveAppointmentAction = async (appointmentId, doctorId, notes = '') => {
  try {
    const appointment = await getAppointmentById(appointmentId);

    // Validate status transition
    if (!isValidTransition(appointment.status, APPOINTMENT_STATUS.CONFIRMED)) {
      throw new Error(`Cannot approve appointment with status: ${appointment.status}`);
    }

    const docRef = doc(db, 'appointments', appointmentId);
    const updateData = {
      status: APPOINTMENT_STATUS.CONFIRMED,
      approvedAt: Timestamp.now(),
      approvedBy: doctorId,
      approvalNotes: notes,
      updatedAt: Timestamp.now(),
      lastUpdated: Timestamp.now()
    };

    await updateDoc(docRef, updateData);

    // Create audit log
    await createAuditLog(appointmentId, 'APPROVED', doctorId, {
      previousStatus: appointment.status,
      newStatus: APPOINTMENT_STATUS.CONFIRMED,
      notes
    });

    // Send notifications
    await sendNotification(
      appointmentId,
      'APPOINTMENT_APPROVED',
      appointment.patientId,
      `Your appointment on ${format(appointment.appointmentDate?.toDate?.() || new Date(appointment.appointmentDate), 'MMM d, yyyy')} has been approved`
    );

    return {
      success: true,
      appointmentId,
      status: APPOINTMENT_STATUS.CONFIRMED,
      message: 'Appointment approved successfully'
    };
  } catch (error) {
    console.error(`Error approving appointment ${appointmentId}:`, error);
    throw new Error(`Failed to approve appointment: ${error.message}`);
  }
};

/**
 * REJECT APPOINTMENT
 * Doctor rejects a pending appointment with reason
 */
export const rejectAppointmentAction = async (appointmentId, doctorId, reason = '', notes = '') => {
  try {
    const appointment = await getAppointmentById(appointmentId);

    // Validate status transition
    if (!isValidTransition(appointment.status, APPOINTMENT_STATUS.REJECTED)) {
      throw new Error(`Cannot reject appointment with status: ${appointment.status}`);
    }

    const docRef = doc(db, 'appointments', appointmentId);
    const updateData = {
      status: APPOINTMENT_STATUS.REJECTED,
      rejectedAt: Timestamp.now(),
      rejectedBy: doctorId,
      rejectionReason: reason,
      rejectionNotes: notes,
      updatedAt: Timestamp.now(),
      lastUpdated: Timestamp.now()
    };

    await updateDoc(docRef, updateData);

    // Create audit log
    await createAuditLog(appointmentId, 'REJECTED', doctorId, {
      previousStatus: appointment.status,
      newStatus: APPOINTMENT_STATUS.REJECTED,
      reason,
      notes
    });

    // Send notifications
    await sendNotification(
      appointmentId,
      'APPOINTMENT_REJECTED',
      appointment.patientId,
      `Your appointment on ${format(appointment.appointmentDate?.toDate?.() || new Date(appointment.appointmentDate), 'MMM d, yyyy')} has been rejected. Reason: ${reason}`
    );

    return {
      success: true,
      appointmentId,
      status: APPOINTMENT_STATUS.REJECTED,
      message: 'Appointment rejected successfully'
    };
  } catch (error) {
    console.error(`Error rejecting appointment ${appointmentId}:`, error);
    throw new Error(`Failed to reject appointment: ${error.message}`);
  }
};

/**
 * COMPLETE APPOINTMENT
 * Mark an in-progress appointment as completed
 */
export const completeAppointmentAction = async (appointmentId, doctorId, summary = '', notes = '') => {
  try {
    const appointment = await getAppointmentById(appointmentId);

    // Validate status transition
    if (!isValidTransition(appointment.status, APPOINTMENT_STATUS.COMPLETED)) {
      throw new Error(`Cannot complete appointment with status: ${appointment.status}`);
    }

    const docRef = doc(db, 'appointments', appointmentId);
    const updateData = {
      status: APPOINTMENT_STATUS.COMPLETED,
      completedAt: Timestamp.now(),
      completedBy: doctorId,
      appointmentSummary: summary,
      completionNotes: notes,
      updatedAt: Timestamp.now(),
      lastUpdated: Timestamp.now()
    };

    await updateDoc(docRef, updateData);

    // Create audit log
    await createAuditLog(appointmentId, 'COMPLETED', doctorId, {
      previousStatus: appointment.status,
      newStatus: APPOINTMENT_STATUS.COMPLETED,
      summary,
      notes
    });

    // Send notifications
    await sendNotification(
      appointmentId,
      'APPOINTMENT_COMPLETED',
      appointment.patientId,
      `Your appointment on ${format(appointment.appointmentDate?.toDate?.() || new Date(appointment.appointmentDate), 'MMM d, yyyy')} has been completed`
    );

    return {
      success: true,
      appointmentId,
      status: APPOINTMENT_STATUS.COMPLETED,
      message: 'Appointment marked as completed'
    };
  } catch (error) {
    console.error(`Error completing appointment ${appointmentId}:`, error);
    throw new Error(`Failed to complete appointment: ${error.message}`);
  }
};

/**
 * CANCEL APPOINTMENT
 * Cancel an appointment (by doctor or patient)
 */
export const cancelAppointmentAction = async (appointmentId, cancelledBy, reason = '', notes = '') => {
  try {
    const appointment = await getAppointmentById(appointmentId);

    // Validate status transition
    if (!isValidTransition(appointment.status, APPOINTMENT_STATUS.CANCELLED)) {
      throw new Error(`Cannot cancel appointment with status: ${appointment.status}`);
    }

    const docRef = doc(db, 'appointments', appointmentId);
    const updateData = {
      status: APPOINTMENT_STATUS.CANCELLED,
      cancelledAt: Timestamp.now(),
      cancelledBy,
      cancellationReason: reason,
      cancellationNotes: notes,
      updatedAt: Timestamp.now(),
      lastUpdated: Timestamp.now()
    };

    await updateDoc(docRef, updateData);

    // Create audit log
    await createAuditLog(appointmentId, 'CANCELLED', cancelledBy, {
      previousStatus: appointment.status,
      newStatus: APPOINTMENT_STATUS.CANCELLED,
      reason,
      notes
    });

    // Send notifications to both patient and doctor
    const notificationRecipient = cancelledBy === appointment.patientId ? appointment.doctorId : appointment.patientId;
    await sendNotification(
      appointmentId,
      'APPOINTMENT_CANCELLED',
      notificationRecipient,
      `Appointment on ${format(appointment.appointmentDate?.toDate?.() || new Date(appointment.appointmentDate), 'MMM d, yyyy')} has been cancelled. Reason: ${reason}`
    );

    return {
      success: true,
      appointmentId,
      status: APPOINTMENT_STATUS.CANCELLED,
      message: 'Appointment cancelled successfully'
    };
  } catch (error) {
    console.error(`Error cancelling appointment ${appointmentId}:`, error);
    throw new Error(`Failed to cancel appointment: ${error.message}`);
  }
};

/**
 * RESCHEDULE APPOINTMENT
 * Reschedule an appointment to a new date/time
 */
export const rescheduleAppointmentAction = async (appointmentId, newDate, newTimeSlot, reason = '', notes = '') => {
  try {
    const appointment = await getAppointmentById(appointmentId);

    // Validate the new date is in the future
    const newAppointmentDate = new Date(newDate);
    if (newAppointmentDate < new Date()) {
      throw new Error('Cannot reschedule to a past date');
    }

    const docRef = doc(db, 'appointments', appointmentId);
    const updateData = {
      status: APPOINTMENT_STATUS.RESCHEDULED,
      previousAppointmentDate: appointment.appointmentDate,
      previousTimeSlot: appointment.timeSlot,
      appointmentDate: Timestamp.fromDate(newAppointmentDate),
      timeSlot: newTimeSlot,
      rescheduledAt: Timestamp.now(),
      rescheduleReason: reason,
      rescheduleNotes: notes,
      updatedAt: Timestamp.now(),
      lastUpdated: Timestamp.now()
    };

    await updateDoc(docRef, updateData);

    // Create audit log
    await createAuditLog(appointmentId, 'RESCHEDULED', appointment.doctorId, {
      previousDate: appointment.appointmentDate,
      previousTimeSlot: appointment.timeSlot,
      newDate: newAppointmentDate,
      newTimeSlot,
      reason,
      notes
    });

    // Send notifications
    await sendNotification(
      appointmentId,
      'APPOINTMENT_RESCHEDULED',
      appointment.patientId,
      `Your appointment has been rescheduled to ${format(newAppointmentDate, 'MMM d, yyyy')} at ${newTimeSlot}`
    );

    return {
      success: true,
      appointmentId,
      status: APPOINTMENT_STATUS.RESCHEDULED,
      newDate,
      newTimeSlot,
      message: 'Appointment rescheduled successfully'
    };
  } catch (error) {
    console.error(`Error rescheduling appointment ${appointmentId}:`, error);
    throw new Error(`Failed to reschedule appointment: ${error.message}`);
  }
};

/**
 * MARK NO-SHOW
 * Mark an appointment as no-show if patient doesn't arrive
 */
export const markNoShowAction = async (appointmentId, doctorId, reason = '', notes = '') => {
  try {
    const appointment = await getAppointmentById(appointmentId);

    // Validate status transition
    if (!isValidTransition(appointment.status, APPOINTMENT_STATUS.NO_SHOW)) {
      throw new Error(`Cannot mark as no-show appointment with status: ${appointment.status}`);
    }

    const docRef = doc(db, 'appointments', appointmentId);
    const updateData = {
      status: APPOINTMENT_STATUS.NO_SHOW,
      noShowAt: Timestamp.now(),
      noShowBy: doctorId,
      noShowReason: reason,
      noShowNotes: notes,
      updatedAt: Timestamp.now(),
      lastUpdated: Timestamp.now()
    };

    await updateDoc(docRef, updateData);

    // Create audit log
    await createAuditLog(appointmentId, 'MARKED_NO_SHOW', doctorId, {
      previousStatus: appointment.status,
      newStatus: APPOINTMENT_STATUS.NO_SHOW,
      reason,
      notes
    });

    // Send notifications
    await sendNotification(
      appointmentId,
      'APPOINTMENT_NO_SHOW',
      appointment.patientId,
      `You were marked as no-show for your appointment on ${format(appointment.appointmentDate?.toDate?.() || new Date(appointment.appointmentDate), 'MMM d, yyyy')}`
    );

    return {
      success: true,
      appointmentId,
      status: APPOINTMENT_STATUS.NO_SHOW,
      message: 'Appointment marked as no-show'
    };
  } catch (error) {
    console.error(`Error marking no-show for appointment ${appointmentId}:`, error);
    throw new Error(`Failed to mark no-show: ${error.message}`);
  }
};

/**
 * GET APPOINTMENT STATUS HISTORY
 * Retrieve all status changes and actions for an appointment
 */
export const getAppointmentHistory = async (appointmentId) => {
  try {
    const auditRef = collection(db, 'appointments', appointmentId, 'auditLog');
    const q = query(auditRef);
    const querySnapshot = await getDocs(q);

    const history = [];
    for (const doc of querySnapshot.docs) {
      history.push({
        id: doc.id,
        ...doc.data()
      });
    }

    // Sort by timestamp descending
    history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return history;
  } catch (error) {
    console.error(`Error fetching history for appointment ${appointmentId}:`, error);
    throw new Error(`Failed to fetch appointment history: ${error.message}`);
  }
};

/**
 * UPDATE APPOINTMENT NOTES
 * Add or update notes on an appointment (doctor)
 */
export const updateAppointmentNotes = async (appointmentId, doctorId, notes = '') => {
  try {
    const docRef = doc(db, 'appointments', appointmentId);
    const updateData = {
      doctorNotes: notes,
      notesUpdatedAt: Timestamp.now(),
      notesUpdatedBy: doctorId,
      updatedAt: Timestamp.now()
    };

    await updateDoc(docRef, updateData);

    // Create audit log
    await createAuditLog(appointmentId, 'NOTES_UPDATED', doctorId, {
      notes
    });

    return {
      success: true,
      appointmentId,
      message: 'Appointment notes updated successfully'
    };
  } catch (error) {
    console.error(`Error updating notes for appointment ${appointmentId}:`, error);
    throw new Error(`Failed to update appointment notes: ${error.message}`);
  }
};

/**
 * GET APPOINTMENT STATISTICS
 * Get stats for a doctor's appointments
 */
export const getAppointmentStats = async (doctorId, startDate = null, endDate = null) => {
  try {
    const appointmentsRef = collection(db, 'appointments');
    let q = query(appointmentsRef, where('doctorId', '==', doctorId));

    const querySnapshot = await getDocs(q);
    let appointments = [];
    for (const doc of querySnapshot.docs) {
      appointments.push({
        id: doc.id,
        ...doc.data()
      });
    }

    // Filter by date range if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      appointments = appointments.filter((apt) => {
        const aptDate = apt.appointmentDate?.toDate?.() || new Date(apt.appointmentDate);
        return aptDate >= start && aptDate <= end;
      });
    }

    const stats = {
      total: appointments.length,
      pending: appointments.filter((apt) => apt.status === APPOINTMENT_STATUS.PENDING).length,
      confirmed: appointments.filter((apt) => apt.status === APPOINTMENT_STATUS.CONFIRMED).length,
      completed: appointments.filter((apt) => apt.status === APPOINTMENT_STATUS.COMPLETED).length,
      rejected: appointments.filter((apt) => apt.status === APPOINTMENT_STATUS.REJECTED).length,
      cancelled: appointments.filter((apt) => apt.status === APPOINTMENT_STATUS.CANCELLED).length,
      noShow: appointments.filter((apt) => apt.status === APPOINTMENT_STATUS.NO_SHOW).length,
      completionRate: appointments.length > 0
        ? ((appointments.filter((apt) => apt.status === APPOINTMENT_STATUS.COMPLETED).length / appointments.length) * 100).toFixed(2)
        : 0
    };

    return stats;
  } catch (error) {
    console.error(`Error fetching stats for doctor ${doctorId}:`, error);
    throw new Error(`Failed to fetch appointment statistics: ${error.message}`);
  }
};

// All functions are already exported above with 'export const'
// No default export needed for 'use server' files
