import { NextResponse } from 'next/server';
import {
  approveAppointmentAction,
  rejectAppointmentAction,
  completeAppointmentAction,
  cancelAppointmentAction,
  rescheduleAppointmentAction,
  markNoShowAction,
  getAppointmentHistory,
  updateAppointmentNotes,
  getAppointmentStats
} from './route';

/**
 * POST /api/appointments/actions/approve
 * Approve an appointment
 */
export async function handleApprove(request) {
  try {
    const { appointmentId, doctorId, notes } = await request.json();

    if (!appointmentId || !doctorId) {
      return NextResponse.json(
        { error: 'Missing required fields: appointmentId, doctorId' },
        { status: 400 }
      );
    }

    const result = await approveAppointmentAction(appointmentId, doctorId, notes || '');
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error approving appointment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to approve appointment' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/appointments/actions/reject
 * Reject an appointment
 */
export async function handleReject(request) {
  try {
    const { appointmentId, doctorId, reason, notes } = await request.json();

    if (!appointmentId || !doctorId) {
      return NextResponse.json(
        { error: 'Missing required fields: appointmentId, doctorId' },
        { status: 400 }
      );
    }

    const result = await rejectAppointmentAction(appointmentId, doctorId, reason || '', notes || '');
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error rejecting appointment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to reject appointment' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/appointments/actions/complete
 * Complete an appointment
 */
export async function handleComplete(request) {
  try {
    const { appointmentId, doctorId, summary, notes } = await request.json();

    if (!appointmentId || !doctorId) {
      return NextResponse.json(
        { error: 'Missing required fields: appointmentId, doctorId' },
        { status: 400 }
      );
    }

    const result = await completeAppointmentAction(appointmentId, doctorId, summary || '', notes || '');
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error completing appointment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to complete appointment' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/appointments/actions/cancel
 * Cancel an appointment
 */
export async function handleCancel(request) {
  try {
    const { appointmentId, cancelledBy, reason, notes } = await request.json();

    if (!appointmentId || !cancelledBy) {
      return NextResponse.json(
        { error: 'Missing required fields: appointmentId, cancelledBy' },
        { status: 400 }
      );
    }

    const result = await cancelAppointmentAction(appointmentId, cancelledBy, reason || '', notes || '');
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to cancel appointment' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/appointments/actions/reschedule
 * Reschedule an appointment
 */
export async function handleReschedule(request) {
  try {
    const { appointmentId, newDate, newTimeSlot, reason, notes } = await request.json();

    if (!appointmentId || !newDate || !newTimeSlot) {
      return NextResponse.json(
        { error: 'Missing required fields: appointmentId, newDate, newTimeSlot' },
        { status: 400 }
      );
    }

    const result = await rescheduleAppointmentAction(appointmentId, newDate, newTimeSlot, reason || '', notes || '');
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to reschedule appointment' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/appointments/actions/no-show
 * Mark appointment as no-show
 */
export async function handleNoShow(request) {
  try {
    const { appointmentId, doctorId, reason, notes } = await request.json();

    if (!appointmentId || !doctorId) {
      return NextResponse.json(
        { error: 'Missing required fields: appointmentId, doctorId' },
        { status: 400 }
      );
    }

    const result = await markNoShowAction(appointmentId, doctorId, reason || '', notes || '');
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error marking no-show:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to mark as no-show' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/appointments/actions/history/:appointmentId
 * Get appointment action history
 */
export async function handleGetHistory(request, appointmentId) {
  try {
    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Missing required field: appointmentId' },
        { status: 400 }
      );
    }

    const history = await getAppointmentHistory(appointmentId);
    return NextResponse.json({ history }, { status: 200 });
  } catch (error) {
    console.error('Error fetching appointment history:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch appointment history' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/appointments/actions/notes
 * Update appointment doctor notes
 */
export async function handleUpdateNotes(request) {
  try {
    const { appointmentId, doctorId, notes } = await request.json();

    if (!appointmentId || !doctorId) {
      return NextResponse.json(
        { error: 'Missing required fields: appointmentId, doctorId' },
        { status: 400 }
      );
    }

    const result = await updateAppointmentNotes(appointmentId, doctorId, notes || '');
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error updating appointment notes:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update appointment notes' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/appointments/actions/stats/:doctorId
 * Get appointment statistics for a doctor
 */
export async function handleGetStats(request, doctorId) {
  try {
    if (!doctorId) {
      return NextResponse.json(
        { error: 'Missing required field: doctorId' },
        { status: 400 }
      );
    }

    // Optional query params for date range
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const stats = await getAppointmentStats(doctorId, startDate, endDate);
    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error('Error fetching appointment stats:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch appointment statistics' },
      { status: 500 }
    );
  }
}
