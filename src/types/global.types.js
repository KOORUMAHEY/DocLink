/**
 * Global Type Definitions (JSDoc)
 * Use these for better IDE autocomplete and type checking
 */

/**
 * @typedef {Object} Appointment
 * @property {string} id - Appointment ID
 * @property {string} patientName - Patient's full name
 * @property {string} patientPhone - Patient's phone number
 * @property {string} patientEmail - Patient's email
 * @property {string} hospitalId - Hospital/Appointment ID
 * @property {string} doctorId - Doctor's ID
 * @property {string} doctorName - Doctor's name
 * @property {string} specialty - Doctor's specialty
 * @property {string} appointmentDate - ISO date string
 * @property {'scheduled'|'confirmed'|'completed'|'cancelled'|'no-show'|'rescheduled'} status
 * @property {string} [reason] - Appointment reason
 * @property {string} [notes] - Additional notes
 * @property {string} [roomNumber] - Room number
 * @property {string} [medicalInfo] - Medical information
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} [updatedAt] - Update timestamp
 */

/**
 * @typedef {Object} Doctor
 * @property {string} id - Doctor ID
 * @property {string} name - Doctor's full name
 * @property {string} specialty - Medical specialty
 * @property {string} qualification - Educational qualifications
 * @property {string} email - Email address
 * @property {string} phone - Phone number
 * @property {number} experience - Years of experience
 * @property {string} [imageUrl] - Profile image URL
 * @property {'active'|'inactive'} status - Doctor status
 * @property {string[]} [availableDays] - Available days of week
 * @property {string} [bio] - Biography
 * @property {Date} createdAt - Creation timestamp
 */

/**
 * @typedef {Object} Patient
 * @property {string} id - Patient ID
 * @property {string} name - Patient's full name
 * @property {string} email - Email address
 * @property {string} phone - Phone number
 * @property {string} [dateOfBirth] - Date of birth (ISO string)
 * @property {string} [address] - Physical address
 * @property {string} [emergencyContact] - Emergency contact number
 * @property {string[]} [medicalHistory] - Medical history
 * @property {Date} createdAt - Creation timestamp
 */

/**
 * @typedef {Object} DashboardStats
 * @property {number} totalAppointments - Total appointments count
 * @property {number} totalDoctors - Total doctors count
 * @property {number} totalPatients - Total patients count
 * @property {number} activeDoctors - Active doctors count
 * @property {number} inactiveDoctors - Inactive doctors count
 * @property {number} scheduledAppointments - Scheduled appointments count
 * @property {number} completedAppointments - Completed appointments count
 * @property {number} cancelledAppointments - Cancelled appointments count
 */

/**
 * @typedef {Object} FormTemplate
 * @property {string} id - Template ID
 * @property {string} name - Template name
 * @property {string} description - Template description
 * @property {Object[]} fields - Form fields configuration
 * @property {Date} createdAt - Creation timestamp
 */

/**
 * @typedef {Object} ActivityLog
 * @property {string} id - Log ID
 * @property {string} userId - User ID who performed action
 * @property {string} action - Action performed
 * @property {string} entityType - Type of entity (appointment, doctor, etc.)
 * @property {string} entityId - ID of affected entity
 * @property {Object} [metadata] - Additional metadata
 * @property {Date} timestamp - When action occurred
 */

/**
 * @typedef {Object} APIResponse
 * @property {boolean} success - Whether request was successful
 * @property {*} [data] - Response data
 * @property {string} [error] - Error message if failed
 * @property {string} [message] - Success message
 */

export {};
