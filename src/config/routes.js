/**
 * Application Route Constants
 * Centralized route definitions for type-safety and easy refactoring
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  
  // Appointment routes
  APPOINTMENTS: {
    ROOT: '/appointments',
    BOOK: '/appointments/book',
    DETAIL: (id) => `/appointments/${id}`,
  },
  
  // Doctor routes
  DOCTOR: {
    ROOT: '/doctor',
    DASHBOARD: (id) => `/doctor?id=${id}`,
    APPOINTMENTS: (id) => `/doctor/appointments?id=${id}`,
    PATIENTS: (id) => `/doctor/patients?id=${id}`,
    APPOINTMENT_FORM: (id) => `/doctor/appointments/form?id=${id}`,
  },
  
  // Admin routes
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin',
    APPOINTMENTS: '/admin/appointments',
    DOCTORS: '/admin/doctors',
    DOCTORS_NEW: '/admin/doctors/new',
    PATIENTS: '/admin/patients',
    SETTINGS: '/admin/settings',
  },
};

/**
 * Check if route is protected (requires authentication)
 */
export function isProtectedRoute(pathname) {
  const protectedPrefixes = ['/doctor', '/admin'];
  return protectedPrefixes.some(prefix => pathname.startsWith(prefix));
}

/**
 * Get role-specific home route
 */
export function getRoleHomeRoute(role) {
  const roleRoutes = {
    admin: ROUTES.ADMIN.ROOT,
    doctor: ROUTES.DOCTOR.ROOT,
    patient: ROUTES.APPOINTMENTS.ROOT,
  };
  return roleRoutes[role] || ROUTES.HOME;
}

/**
 * Navigation items for different roles
 */
export const NAVIGATION = {
  PUBLIC: [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'My Appointments', href: ROUTES.APPOINTMENTS.ROOT },
    { label: 'Book Appointment', href: ROUTES.APPOINTMENTS.BOOK },
  ],
  DOCTOR: [
    { label: 'Dashboard', href: ROUTES.DOCTOR.ROOT },
    { label: 'Appointments', href: ROUTES.DOCTOR.APPOINTMENTS() },
    { label: 'Patients', href: ROUTES.DOCTOR.PATIENTS() },
  ],
  ADMIN: [
    { label: 'Dashboard', href: ROUTES.ADMIN.DASHBOARD },
    { label: 'Appointments', href: ROUTES.ADMIN.APPOINTMENTS },
    { label: 'Doctors', href: ROUTES.ADMIN.DOCTORS },
    { label: 'Patients', href: ROUTES.ADMIN.PATIENTS },
  ],
};
