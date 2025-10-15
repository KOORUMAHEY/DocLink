# Patient Details & Appointment Management

This implementation provides a comprehensive patient details view with appointment approval, rejection, and rescheduling functionality for the doctor dashboard.

## Features

### 🏥 Patient Details Modal
- **Comprehensive Patient Information**: View complete patient details including personal info, health data, and contact information
- **Appointment Management**: Three-tab interface for patient info, appointment details, and available actions
- **Health Priority Indicators**: Visual badges showing appointment priority levels (critical, urgent, normal, routine)

### ✅ Appointment Actions
1. **Approve Appointments**: One-click approval for pending appointments
2. **Reject Appointments**: Rejection with optional reason tracking
3. **Reschedule Appointments**: Date/time picker for rescheduling with available time slots

### 🔧 Implementation

#### Components Added:
- `PatientDetailsModal` - Main modal component for patient details and appointment management
- `Calendar` - Date picker component using react-day-picker
- `Popover` - Popover component for date picker

#### Services Enhanced:
- `approveAppointment()` - Approve appointment and set status to 'confirmed'
- `rejectAppointment(appointmentId, reason)` - Reject with optional reason
- `rescheduleAppointment(appointmentId, newDate, newTimeSlot, reason)` - Reschedule with new date/time

#### Updated Files:
- `/src/doctor/pages/Appointments.jsx` - Added action buttons and modal integration
- `/src/components/patient-details-modal.jsx` - New comprehensive modal component
- `/src/features/appointments/services/appointmentService.js` - Enhanced with new functions
- `/src/components/ui/calendar.jsx` - New date picker component
- `/src/components/ui/popover.jsx` - New popover component

## Usage

### In Doctor Dashboard
1. Navigate to the doctor appointments page
2. Each appointment card now shows:
   - **View Details** button (for all appointments)
   - **Approve** button (for pending appointments)
   - **Reject** button (for pending appointments)

### Patient Details Modal
The modal opens with three tabs:

#### 1. Patient Info Tab
- **Personal Information**: Name, age, gender, contact details
- **Health Information**: Priority level, allergies, medications
- **Additional Information**: Reason for visit, description

#### 2. Appointment Tab
- **Appointment Details**: Date, time, status
- **Booking Information**: When the appointment was created

#### 3. Actions Tab
For pending appointments:
- **Approve**: Instantly confirm the appointment
- **Reschedule**: Choose new date and time from available slots
- **Reject**: Reject with optional reason

### State Management
- Real-time updates to appointment list after actions
- Optimistic UI updates for better user experience
- Error handling with toast notifications

## Data Structure

### Appointment Object
```javascript
{
  id: "appointment_id",
  patientName: "John Doe",
  patientPhone: "+1234567890",
  patientEmail: "john@example.com",
  age: 35,
  gender: "male",
  hospitalId: "P001",
  bloodType: "O+",
  healthPriority: "normal", // critical, urgent, normal, routine
  allergies: "None",
  medications: "Vitamin D",
  description: "Regular checkup",
  appointmentDate: "2025-01-15T10:00:00Z",
  timeSlot: "10:00 AM",
  status: "pending", // pending, confirmed, rejected, completed, cancelled
  doctorId: "doctor_id",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  // Optional fields for tracking actions
  rescheduleReason: "Patient request",
  rescheduledAt: Timestamp,
  rejectionReason: "Doctor unavailable",
  rejectedAt: Timestamp
}
```

### Available Time Slots
The modal accepts an array of available time slots:
```javascript
availableTimeSlots={[
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
  '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', 
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
]}
```

## Dependencies Added
- `react-day-picker` - For the calendar component
- `@radix-ui/react-popover` - For popover functionality

## Benefits

### For Doctors
1. **Complete Patient View**: All patient information in one place
2. **Quick Actions**: Approve, reject, or reschedule with one click
3. **Better Organization**: Tab-based interface for different information types
4. **Real-time Updates**: Immediate feedback on actions

### For Patients
1. **Transparent Process**: Clear appointment status tracking
2. **Better Communication**: Rejection reasons and rescheduling notifications
3. **Flexible Scheduling**: Easy rescheduling options

### For System
1. **Audit Trail**: Complete tracking of appointment changes
2. **Data Integrity**: Proper status management and timestamps
3. **Scalable Architecture**: Modular components for easy enhancement

## Future Enhancements
- Email/SMS notifications for status changes
- Bulk actions for multiple appointments
- Doctor availability integration
- Patient communication portal
- Analytics and reporting dashboard