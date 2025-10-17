# Appointment Management Backend API

This document describes the comprehensive backend API for managing appointments in the DocLink system.

## Overview

The appointment backend system provides a complete workflow for managing doctor-patient appointments with:

- **Approval System**: Doctor approval/rejection of appointments
- **Status Management**: Full lifecycle management (pending → confirmed → completed)
- **Audit Logging**: Track all actions and changes
- **Notifications**: Automatic notifications for status changes
- **Statistics**: Dashboard analytics for doctors
- **Notes & Documentation**: Appointment-related notes and summaries

## Architecture

### Core Components

1. **Appointment Actions** (`/src/app/api/appointments/actions/route.js`)

   - Server-side actions handling appointment operations
   - Firestore database interactions
   - Audit logging and notifications
   - Status transition validation

2. **Appointment Service** (`/src/features/appointments/services/appointmentService.js`)

   - Client-side wrapper for backend actions
   - Fallback mechanisms for offline functionality
   - Enhanced API with additional features

3. **API Handlers** (`/src/app/api/appointments/actions/handlers.js`)
   - HTTP endpoint handlers
   - Request validation
   - Response formatting

## Appointment Status Workflow

```
PENDING (initial state)
├── CONFIRMED (approved by doctor)
│   ├── IN_PROGRESS (appointment occurring)
│   │   ├── COMPLETED (successful completion)
│   │   └── NO_SHOW (patient didn't arrive)
│   ├── CANCELLED (cancelled before start)
│   └── NO_SHOW (patient didn't show up)
├── REJECTED (doctor rejected)
└── CANCELLED (appointment cancelled)
```

## API Endpoints

### 1. Approve Appointment

**Endpoint**: `POST /api/appointments/actions`  
**Action**: `approveAppointmentAction`

**Request**:

```javascript
{
  appointmentId: string,      // required
  doctorId: string,           // required
  notes: string              // optional
}
```

**Response**:

```javascript
{
  success: true,
  appointmentId: string,
  status: 'confirmed',
  message: 'Appointment approved successfully'
}
```

**Error Cases**:

- Invalid status transition
- Appointment not found
- Permission denied

---

### 2. Reject Appointment

**Endpoint**: `POST /api/appointments/actions`  
**Action**: `rejectAppointmentAction`

**Request**:

```javascript
{
  appointmentId: string,      // required
  doctorId: string,           // required
  reason: string,             // optional (e.g., "Schedule conflict")
  notes: string              // optional
}
```

**Response**:

```javascript
{
  success: true,
  appointmentId: string,
  status: 'rejected',
  message: 'Appointment rejected successfully'
}
```

**Features**:

- Automatic patient notification with rejection reason
- Audit log entry with reason
- Status transition validation

---

### 3. Complete Appointment

**Endpoint**: `POST /api/appointments/actions`  
**Action**: `completeAppointmentAction`

**Request**:

```javascript
{
  appointmentId: string,      // required
  doctorId: string,           // required
  summary: string,            // optional (appointment summary)
  notes: string              // optional (doctor's notes)
}
```

**Response**:

```javascript
{
  success: true,
  appointmentId: string,
  status: 'completed',
  message: 'Appointment marked as completed'
}
```

---

### 4. Cancel Appointment

**Endpoint**: `POST /api/appointments/actions`  
**Action**: `cancelAppointmentAction`

**Request**:

```javascript
{
  appointmentId: string,      // required
  cancelledBy: string,        // required (doctor or patient ID)
  reason: string,             // optional (cancellation reason)
  notes: string              // optional
}
```

**Response**:

```javascript
{
  success: true,
  appointmentId: string,
  status: 'cancelled',
  message: 'Appointment cancelled successfully'
}
```

---

### 5. Reschedule Appointment

**Endpoint**: `POST /api/appointments/actions`  
**Action**: `rescheduleAppointmentAction`

**Request**:

```javascript
{
  appointmentId: string,      // required
  newDate: Date|string,       // required (YYYY-MM-DD format or Date object)
  newTimeSlot: string,        // required (e.g., "2:30 PM - 3:00 PM")
  reason: string,             // optional (reschedule reason)
  notes: string              // optional
}
```

**Response**:

```javascript
{
  success: true,
  appointmentId: string,
  status: 'rescheduled',
  newDate: Date,
  newTimeSlot: string,
  message: 'Appointment rescheduled successfully'
}
```

**Validation**:

- New date must be in the future
- Validates time slot format
- Maintains appointment context

---

### 6. Mark No-Show

**Endpoint**: `POST /api/appointments/actions`  
**Action**: `markNoShowAction`

**Request**:

```javascript
{
  appointmentId: string,      // required
  doctorId: string,           // required
  reason: string,             // optional (no-show reason)
  notes: string              // optional
}
```

**Response**:

```javascript
{
  success: true,
  appointmentId: string,
  status: 'no-show',
  message: 'Appointment marked as no-show'
}
```

---

### 7. Get Appointment History

**Endpoint**: `GET /api/appointments/actions/history/:appointmentId`  
**Action**: `getAppointmentHistory`

**Response**:

```javascript
[
  {
    id: string,
    action: string,            // 'APPROVED', 'REJECTED', 'COMPLETED', etc.
    performedBy: string,       // user ID who performed action
    timestamp: Timestamp,
    metadata: {                // action-specific data
      previousStatus: string,
      newStatus: string,
      reason?: string,
      notes?: string
    },
    createdAt: string         // ISO timestamp
  },
  ...
]
```

**Example Metadata**:

```javascript
// APPROVE action
{ previousStatus: 'pending', newStatus: 'confirmed', notes: 'Approved' }

// REJECT action
{ previousStatus: 'pending', newStatus: 'rejected', reason: 'Schedule conflict' }

// COMPLETE action
{ previousStatus: 'confirmed', newStatus: 'completed', summary: 'Successful checkup' }
```

---

### 8. Update Appointment Notes

**Endpoint**: `POST /api/appointments/actions/notes`  
**Action**: `updateAppointmentNotes`

**Request**:

```javascript
{
  appointmentId: string,      // required
  doctorId: string,           // required
  notes: string              // required (doctor's notes)
}
```

**Response**:

```javascript
{
  success: true,
  appointmentId: string,
  message: 'Appointment notes updated successfully'
}
```

**Features**:

- Tracks who updated notes and when
- Creates audit log entry
- Supports rich text (if frontend allows)

---

### 9. Get Appointment Statistics

**Endpoint**: `GET /api/appointments/actions/stats/:doctorId`  
**Query Parameters**:

- `startDate` (optional): YYYY-MM-DD format
- `endDate` (optional): YYYY-MM-DD format

**Action**: `getAppointmentStats`

**Response**:

```javascript
{
  total: number,             // total appointments
  pending: number,           // pending approval
  confirmed: number,         // confirmed/approved
  completed: number,         // completed successfully
  rejected: number,          // rejected by doctor
  cancelled: number,         // cancelled
  noShow: number,            // no-show
  completionRate: string     // percentage (e.g., "85.50")
}
```

**Example**:

```javascript
{
  total: 50,
  pending: 5,
  confirmed: 15,
  completed: 25,
  rejected: 2,
  cancelled: 3,
  noShow: 0,
  completionRate: "50.00"
}
```

---

## Client-Side Integration

### Using the Appointment Service

```javascript
import {
  approveAppointment,
  rejectAppointment,
  completeAppointment,
  cancelAppointment,
  rescheduleAppointmentWithDetails,
  markNoShow,
  getAppointmentAuditLog,
  updateDoctorNotes,
  getDoctorAppointmentStats,
} from "@/features/appointments/services/appointmentService";

// Approve appointment
const result = await approveAppointment(appointmentId, doctorId, "Approved");

// Reject appointment
const result = await rejectAppointment(
  appointmentId,
  doctorId,
  "Schedule conflict",
  "Doctor has another appointment"
);

// Complete appointment
const result = await completeAppointment(
  appointmentId,
  doctorId,
  "Patient checkup completed successfully",
  "Prescribed antibiotics and painkillers"
);

// Get appointment history
const history = await getAppointmentAuditLog(appointmentId);
console.log(history);

// Get statistics
const stats = await getDoctorAppointmentStats(
  doctorId,
  "2024-01-01",
  "2024-01-31"
);
console.log(stats);
```

---

## Data Models

### Appointment Object (Extended)

```javascript
{
  id: string,
  doctorId: string,
  patientId: string,
  appointmentDate: Timestamp,
  timeSlot: string,
  status: string,

  // Approval workflow
  approvedAt?: Timestamp,
  approvedBy?: string,
  approvalNotes?: string,

  // Rejection workflow
  rejectedAt?: Timestamp,
  rejectedBy?: string,
  rejectionReason?: string,
  rejectionNotes?: string,

  // Completion workflow
  completedAt?: Timestamp,
  completedBy?: string,
  appointmentSummary?: string,
  completionNotes?: string,

  // Cancellation workflow
  cancelledAt?: Timestamp,
  cancelledBy?: string,
  cancellationReason?: string,
  cancellationNotes?: string,

  // Rescheduling
  previousAppointmentDate?: Timestamp,
  previousTimeSlot?: string,
  rescheduledAt?: Timestamp,
  rescheduleReason?: string,
  rescheduleNotes?: string,

  // No-show workflow
  noShowAt?: Timestamp,
  noShowBy?: string,
  noShowReason?: string,
  noShowNotes?: string,

  // General
  doctorNotes?: string,
  notesUpdatedAt?: Timestamp,
  notesUpdatedBy?: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  lastUpdated: Timestamp
}
```

### Audit Log Entry

```javascript
{
  id: string,
  action: string,            // APPROVED, REJECTED, COMPLETED, etc.
  performedBy: string,       // user ID
  timestamp: Timestamp,
  metadata: object,          // action-specific data
  createdAt: string         // ISO format
}
```

### Notification Object

```javascript
{
  id: string,
  appointmentId: string,
  type: string,              // APPOINTMENT_APPROVED, APPOINTMENT_REJECTED, etc.
  recipientId: string,
  message: string,
  read: boolean,
  createdAt: Timestamp,
  timestamp: string
}
```

---

## Error Handling

### Common Errors

| Error              | Status | Message                                                 |
| ------------------ | ------ | ------------------------------------------------------- |
| Invalid transition | 400    | `Cannot approve appointment with status: rejected`      |
| Not found          | 404    | `Appointment not found`                                 |
| Missing fields     | 400    | `Missing required fields: appointmentId, doctorId`      |
| Permission denied  | 403    | `You do not have permission to modify this appointment` |
| Invalid date       | 400    | `Cannot reschedule to a past date`                      |
| Server error       | 500    | `Failed to [action] appointment`                        |

---

## Best Practices

### 1. Always Validate Status Transitions

- Don't allow invalid state changes
- Use the `VALID_TRANSITIONS` mapping
- Inform user of invalid actions

### 2. Provide Context in Actions

- Include notes explaining actions
- Document reasons for rejections/cancellations
- Add summaries for completions

### 3. Track Audit Logs

- Review action history for disputes
- Identify patterns (frequent no-shows, rejections)
- Improve service quality

### 4. Use Notifications Effectively

- Inform patients of status changes
- Provide actionable information
- Include relevant appointment details

### 5. Handle Errors Gracefully

- Catch specific error types
- Provide user-friendly error messages
- Log errors for debugging

---

## Future Enhancements

- [ ] Email/SMS notifications
- [ ] Bulk appointment operations
- [ ] Appointment reminders
- [ ] Resource/room availability checking
- [ ] Doctor availability calendar integration
- [ ] Patient rescheduling requests
- [ ] Appointment series handling
- [ ] Multi-doctor appointment workflows

---

## References

- Firestore Documentation: https://firebase.google.com/docs/firestore
- Next.js Server Actions: https://nextjs.org/docs/app/api-reference/functions/server-actions
- Date-fns Library: https://date-fns.org/

---

**Last Updated**: October 17, 2025  
**Version**: 1.0
