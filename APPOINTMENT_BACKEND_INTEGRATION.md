# Appointment Backend Integration Guide

## Quick Start

The appointment backend is now fully implemented with a comprehensive approval system, status management, audit logging, and notifications.

## Files Created/Modified

### New Files

1. **`/src/app/api/appointments/actions/route.js`** (571 lines)

   - Server-side actions for appointment management
   - Core business logic with status transition validation
   - Audit logging and notification system

2. **`/src/app/api/appointments/actions/handlers.js`**

   - HTTP request handlers for API endpoints
   - Request validation and error handling
   - Response formatting

3. **`/APPOINTMENT_BACKEND_API.md`**
   - Comprehensive API documentation
   - Status workflow diagrams
   - Code examples and best practices

### Modified Files

1. **`/src/features/appointments/services/appointmentService.js`**
   - Updated `approveAppointment()` and `rejectAppointment()`
   - Added new functions:
     - `completeAppointment()`
     - `cancelAppointment()`
     - `rescheduleAppointmentWithDetails()`
     - `markNoShow()`
     - `getAppointmentAuditLog()`
     - `updateDoctorNotes()`
     - `getDoctorAppointmentStats()`

## Key Features

### 1. Status Management

- **PENDING** → Initial state (awaiting approval)
- **CONFIRMED** → Doctor approved
- **IN_PROGRESS** → Appointment occurring
- **COMPLETED** → Successfully finished
- **REJECTED** → Doctor rejected
- **CANCELLED** → Cancelled by doctor/patient
- **NO_SHOW** → Patient didn't arrive
- **RESCHEDULED** → Appointment rescheduled

### 2. Approval Workflow

```javascript
// Frontend usage in React component
import {
  approveAppointment,
  rejectAppointment,
} from "@/features/appointments/services/appointmentService";

// Approve with optional notes
const handleApprove = async (appointmentId, doctorId) => {
  try {
    const result = await approveAppointment(
      appointmentId,
      doctorId,
      "Approved"
    );
    console.log("Success:", result);
    // Update UI, show success message
  } catch (error) {
    console.error("Failed:", error.message);
  }
};

// Reject with reason
const handleReject = async (appointmentId, doctorId) => {
  try {
    const result = await rejectAppointment(
      appointmentId,
      doctorId,
      "Schedule conflict", // reason
      "Doctor has another appointment at that time" // notes
    );
    console.log("Success:", result);
  } catch (error) {
    console.error("Failed:", error.message);
  }
};
```

### 3. Audit Logging

Every action is automatically logged with:

- Action type (APPROVED, REJECTED, COMPLETED, etc.)
- Who performed the action
- Timestamp
- Relevant metadata (previous status, new status, reason, notes)

```javascript
// Get complete action history
import { getAppointmentAuditLog } from "@/features/appointments/services/appointmentService";

const history = await getAppointmentAuditLog(appointmentId);
// Returns array of audit entries sorted by timestamp (newest first)
```

### 4. Notifications

Automatic notifications sent when:

- Appointment is approved
- Appointment is rejected
- Appointment is completed
- Appointment is cancelled
- Appointment is rescheduled
- Appointment marked as no-show

### 5. Statistics

Track appointment performance:

```javascript
import { getDoctorAppointmentStats } from "@/features/appointments/services/appointmentService";

const stats = await getDoctorAppointmentStats(
  doctorId,
  "2024-01-01", // startDate (optional)
  "2024-01-31" // endDate (optional)
);

// Returns:
// {
//   total: 50,
//   pending: 5,
//   confirmed: 15,
//   completed: 25,
//   rejected: 2,
//   cancelled: 3,
//   noShow: 0,
//   completionRate: "50.00"
// }
```

## Integration Examples

### Example 1: Complete Appointment After Visit

```javascript
import { completeAppointment } from "@/features/appointments/services/appointmentService";

const handleCompleteAppointment = async (appointmentId, doctorId) => {
  try {
    const result = await completeAppointment(
      appointmentId,
      doctorId,
      "Patient checkup completed successfully", // summary
      "Prescribed antibiotics for infection. Follow-up in 1 week." // notes
    );

    console.log("Appointment completed:", result);
    // Update UI state
    setAppointmentStatus("completed");
  } catch (error) {
    toast.error(`Failed to complete appointment: ${error.message}`);
  }
};
```

### Example 2: Reschedule Appointment

```javascript
import { rescheduleAppointmentWithDetails } from "@/features/appointments/services/appointmentService";

const handleReschedule = async (appointmentId, newDate, newTime) => {
  try {
    const result = await rescheduleAppointmentWithDetails(
      appointmentId,
      newDate, // e.g., '2024-02-15' or Date object
      newTime, // e.g., '3:00 PM - 3:30 PM'
      "Patient requested", // reason
      "Patient had emergency" // notes
    );

    console.log("Appointment rescheduled:", result);
  } catch (error) {
    toast.error(`Failed to reschedule: ${error.message}`);
  }
};
```

### Example 3: Mark No-Show

```javascript
import { markNoShow } from "@/features/appointments/services/appointmentService";

const handleMarkNoShow = async (appointmentId, doctorId) => {
  try {
    const result = await markNoShow(
      appointmentId,
      doctorId,
      "Patient did not arrive", // reason
      "No call to reschedule or cancel" // notes
    );

    console.log("Marked as no-show:", result);
  } catch (error) {
    toast.error(`Failed to mark no-show: ${error.message}`);
  }
};
```

### Example 4: Update Doctor Notes

```javascript
import { updateDoctorNotes } from "@/features/appointments/services/appointmentService";

const handleSaveNotes = async (appointmentId, doctorId, notes) => {
  try {
    const result = await updateDoctorNotes(
      appointmentId,
      doctorId,
      notes // Doctor's clinical notes
    );

    console.log("Notes updated:", result);
  } catch (error) {
    toast.error(`Failed to save notes: ${error.message}`);
  }
};
```

### Example 5: View Appointment Timeline

```javascript
import { getAppointmentAuditLog } from "@/features/appointments/services/appointmentService";

const handleViewHistory = async (appointmentId) => {
  try {
    const history = await getAppointmentAuditLog(appointmentId);

    console.log("Appointment history:");
    history.forEach((entry) => {
      console.log(
        `${entry.action} by ${entry.performedBy} at ${entry.createdAt}`
      );
      if (entry.metadata.notes) {
        console.log(`  Notes: ${entry.metadata.notes}`);
      }
    });
  } catch (error) {
    console.error("Failed to fetch history:", error);
  }
};
```

## Integration in Appointments Component

The existing Appointments.jsx component already has the approval buttons in the table. Here's how the backend hooks up:

```javascript
// In /src/doctor/pages/Appointments.jsx

const handleApproveAppointment = useCallback(
  async (appointment) => {
    try {
      setActionLoading(true);
      // Uses the new backend action with full features
      await approveAppointment(appointment.id, doctorId, "Approved");

      // Update local state
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointment.id ? { ...apt, status: "confirmed" } : apt
        )
      );

      toast({ title: "Success", description: "Appointment approved" });
    } catch (err) {
      console.error("Approve error:", err);
      toast({
        title: "Error",
        description: "Failed to approve appointment",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  },
  [doctorId, toast]
);

const handleRejectAppointment = useCallback(
  async (appointment) => {
    if (!confirm("Are you sure you want to reject this appointment?")) {
      return;
    }

    try {
      setActionLoading(true);
      // Pass rejection reason
      await rejectAppointment(
        appointment.id,
        doctorId,
        "Rejected by doctor",
        "Schedule conflict"
      );

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointment.id ? { ...apt, status: "rejected" } : apt
        )
      );

      toast({ title: "Success", description: "Appointment rejected" });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to reject appointment",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  },
  [doctorId, toast]
);
```

## Status Transition Rules

Valid transitions are enforced by the backend:

| From        | To                                           | Allowed |
| ----------- | -------------------------------------------- | ------- |
| PENDING     | CONFIRMED, REJECTED, CANCELLED               | ✅      |
| CONFIRMED   | IN_PROGRESS, CANCELLED, NO_SHOW, RESCHEDULED | ✅      |
| IN_PROGRESS | COMPLETED, NO_SHOW                           | ✅      |
| COMPLETED   | (none)                                       | ✅      |
| REJECTED    | (none)                                       | ✅      |
| CANCELLED   | (none)                                       | ✅      |
| NO_SHOW     | RESCHEDULED                                  | ✅      |
| RESCHEDULED | CONFIRMED, PENDING                           | ✅      |

## Error Handling

All actions include comprehensive error handling:

```javascript
try {
  const result = await approveAppointment(appointmentId, doctorId);
  // Handle success
} catch (error) {
  // Error messages include context:
  // - "Cannot approve appointment with status: rejected"
  // - "Appointment not found"
  // - "Failed to approve appointment: [specific reason]"
}
```

## Database Schema

Appointments now store additional fields:

```firestore
appointments/{id}
├── status: string
├── doctorId: string
├── patientId: string
├── appointmentDate: Timestamp
├── timeSlot: string
│
├── approvedAt: Timestamp (if approved)
├── approvedBy: string
├── approvalNotes: string
│
├── rejectedAt: Timestamp (if rejected)
├── rejectedBy: string
├── rejectionReason: string
├── rejectionNotes: string
│
├── completedAt: Timestamp (if completed)
├── completedBy: string
├── appointmentSummary: string
├── completionNotes: string
│
├── doctorNotes: string (updated anytime)
├── notesUpdatedAt: Timestamp
├── notesUpdatedBy: string
│
└── auditLog/{id}
    ├── action: string
    ├── performedBy: string
    ├── timestamp: Timestamp
    ├── metadata: object
    └── createdAt: string
```

## Next Steps

1. **Test the approval system** in the doctor dashboard
2. **Monitor audit logs** to ensure actions are being tracked
3. **Check notifications** to verify status change messages
4. **Review statistics** to track completion rates
5. **Implement UI enhancements** for viewing action history

## Troubleshooting

### Actions not taking effect

- Check browser console for errors
- Verify doctor/appointment IDs are correct
- Ensure user has permission to modify appointment

### Missing notifications

- Check Firestore `notifications` collection
- Verify notification recipient IDs
- Check if notification system is properly initialized

### Status transition errors

- Review valid transitions table above
- Check current appointment status
- Ensure target status is valid from current status

## Support

Refer to:

- `/APPOINTMENT_BACKEND_API.md` - Full API documentation
- `/src/app/api/appointments/actions/route.js` - Implementation details
- `/src/features/appointments/services/appointmentService.js` - Service wrapper

---

**Last Updated**: October 17, 2025
