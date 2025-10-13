/**
 * Admin role definitions
 */
export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
};

/**
 * Admin role labels for display
 */
export const ADMIN_ROLE_LABELS = {
  [ADMIN_ROLES.SUPER_ADMIN]: 'Super Admin',
  [ADMIN_ROLES.ADMIN]: 'Admin',
  [ADMIN_ROLES.MODERATOR]: 'Moderator'
};

/**
 * Admin permissions
 */
export const ADMIN_PERMISSIONS = {
  MANAGE_USERS: 'manage_users',
  MANAGE_DOCTORS: 'manage_doctors',
  MANAGE_PATIENTS: 'manage_patients',
  MANAGE_APPOINTMENTS: 'manage_appointments',
  VIEW_REPORTS: 'view_reports',
  SYSTEM_SETTINGS: 'system_settings',
  SECURITY_LOGS: 'security_logs',
  BACKUP_RESTORE: 'backup_restore'
};

/**
 * Default permissions by role
 */
export const ROLE_PERMISSIONS = {
  [ADMIN_ROLES.SUPER_ADMIN]: [
    ADMIN_PERMISSIONS.MANAGE_USERS,
    ADMIN_PERMISSIONS.MANAGE_DOCTORS,
    ADMIN_PERMISSIONS.MANAGE_PATIENTS,
    ADMIN_PERMISSIONS.MANAGE_APPOINTMENTS,
    ADMIN_PERMISSIONS.VIEW_REPORTS,
    ADMIN_PERMISSIONS.SYSTEM_SETTINGS,
    ADMIN_PERMISSIONS.SECURITY_LOGS,
    ADMIN_PERMISSIONS.BACKUP_RESTORE
  ],
  [ADMIN_ROLES.ADMIN]: [
    ADMIN_PERMISSIONS.MANAGE_DOCTORS,
    ADMIN_PERMISSIONS.MANAGE_PATIENTS,
    ADMIN_PERMISSIONS.MANAGE_APPOINTMENTS,
    ADMIN_PERMISSIONS.VIEW_REPORTS
  ],
  [ADMIN_ROLES.MODERATOR]: [
    ADMIN_PERMISSIONS.MANAGE_APPOINTMENTS,
    ADMIN_PERMISSIONS.VIEW_REPORTS
  ]
};

/**
 * Dashboard stat card types
 */
export const STAT_CARD_TYPES = {
  APPOINTMENTS: 'appointments',
  DOCTORS: 'doctors',
  PATIENTS: 'patients',
  OCCUPANCY: 'occupancy'
};

/**
 * Activity log types
 */
export const ACTIVITY_TYPES = {
  APPOINTMENT_CREATED: 'appointment_created',
  APPOINTMENT_UPDATED: 'appointment_updated',
  APPOINTMENT_CANCELLED: 'appointment_cancelled',
  DOCTOR_ADDED: 'doctor_added',
  DOCTOR_UPDATED: 'doctor_updated',
  PATIENT_REGISTERED: 'patient_registered',
  USER_LOGIN: 'user_login',
  SYSTEM_UPDATE: 'system_update'
};

/**
 * System log levels
 */
export const LOG_LEVELS = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical'
};

/**
 * Chart time periods
 */
export const CHART_PERIODS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
};

/**
 * Chart period options for selects
 */
export const CHART_PERIOD_OPTIONS = [
  { value: CHART_PERIODS.DAILY, label: 'Daily' },
  { value: CHART_PERIODS.WEEKLY, label: 'Weekly' },
  { value: CHART_PERIODS.MONTHLY, label: 'Monthly' }
];

/**
 * Dashboard refresh intervals (in milliseconds)
 */
export const REFRESH_INTERVALS = {
  REAL_TIME: 5000,    // 5 seconds
  FREQUENT: 30000,    // 30 seconds
  NORMAL: 60000,      // 1 minute
  SLOW: 300000        // 5 minutes
};

/**
 * Export formats
 */
export const EXPORT_FORMATS = {
  CSV: 'csv',
  PDF: 'pdf',
  EXCEL: 'excel'
};
