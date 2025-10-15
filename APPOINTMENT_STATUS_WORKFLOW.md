# Appointment Status Workflow

## 📋 Appointment Status Flow

### Initial Status: **PENDING**
- When a patient registers for an appointment, it is automatically created with `status: "pending"`
- This requires doctor approval before the appointment is confirmed
- Patients cannot directly schedule confirmed appointments

### Status Transitions:

```
PENDING → CONFIRMED (Doctor approves)
PENDING → REJECTED (Doctor rejects)
PENDING → RESCHEDULED → CONFIRMED (Doctor reschedules)
CONFIRMED → COMPLETED (After appointment)
CONFIRMED → CANCELLED (By patient or doctor)
```

## 🔄 Status Definitions

| Status | Description | Actions Available |
|--------|-------------|-------------------|
| **pending** | Initial status when appointment is created | ✅ Approve, ❌ Reject, 🔄 Reschedule |
| **confirmed** | Doctor has approved the appointment | ✅ Complete, ❌ Cancel, 🔄 Reschedule |
| **rejected** | Doctor has rejected the appointment | 🔄 Allow patient to request new appointment |
| **completed** | Appointment has been finished | 📝 Add notes, 📊 View history |
| **cancelled** | Appointment was cancelled | 🔄 Allow rebooking |

## 👨‍⚕️ Doctor Dashboard Features

### For PENDING Appointments:
- **View Details**: Complete patient information modal
- **Approve**: One-click approval → status becomes `confirmed`
- **Reject**: Reject with optional reason → status becomes `rejected`
- **Reschedule**: Choose new date/time → status becomes `confirmed`

### For CONFIRMED Appointments:
- **View Details**: Patient information and appointment details
- **Mark Complete**: After appointment is finished
- **Reschedule**: If needed (maintains `confirmed` status)

### For COMPLETED Appointments:
- **View Details**: Historical data and notes
- **View Reports**: Patient history and outcomes

## 🏥 Implementation Details

### Database Schema:
```javascript
{
  id: "appointment_id",
  patientId: "patient_ref",
  doctorId: "doctor_ref", 
  appointmentDate: Date,
  timeSlot: "10:00 AM",
  status: "pending", // Initial status
  reason: "Patient's reason for visit",
  createdAt: Date,
  updatedAt: Date,
  
  // Optional tracking fields
  approvedAt: Date,
  rejectedAt: Date,
  rejectionReason: String,
  rescheduledAt: Date,
  rescheduleReason: String,
  completedAt: Date
}
```

### API Functions:
- `createAppointment()` → Creates with `status: "pending"`
- `approveAppointment(id)` → Updates to `status: "confirmed"`
- `rejectAppointment(id, reason)` → Updates to `status: "rejected"`
- `rescheduleAppointment(id, date, time)` → Updates date/time, sets `status: "confirmed"`

## 📊 Benefits of Pending-First Workflow

### For Doctors:
1. **Control**: Doctors review all appointments before confirmation
2. **Quality**: Ensures appropriate scheduling and patient preparation
3. **Efficiency**: Can batch approve/reject multiple appointments
4. **Flexibility**: Can suggest alternative times through reschedule

### For Patients:
1. **Transparency**: Clear status tracking of appointment requests
2. **Communication**: Receive notifications about approval/rejection
3. **Planning**: Know exact appointment status before planning
4. **Reliability**: Confirmed appointments are guaranteed

### For System:
1. **Audit Trail**: Complete tracking of all appointment changes
2. **Analytics**: Data on approval rates, rejection reasons, etc.
3. **Resource Management**: Better control of doctor availability
4. **Patient Experience**: Manages expectations appropriately

## 🔧 Configuration

### Filter Options in UI:
- **All**: Show all appointments regardless of status
- **Pending**: Show only appointments awaiting approval
- **Confirmed**: Show only approved appointments
- **Completed**: Show finished appointments
- **Rejected**: Show rejected appointments

### Status Colors:
- 🟡 **Pending**: Yellow (requires attention)
- 🔵 **Confirmed**: Blue (scheduled)
- 🟢 **Completed**: Green (finished)
- 🔴 **Rejected**: Red (declined)
- ⚪ **Cancelled**: Gray (cancelled)

This workflow ensures proper appointment management with doctor oversight while maintaining a smooth patient experience.