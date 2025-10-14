// Authentication Service for DocLink
// Handles both Doctor and Admin authentication

import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { validateAdminCredentials, initializeSuperAdmin } from '@/features/admin/services/adminService';

// Hardcoded admin credentials (fallback)
const ADMIN_CREDENTIALS = {
  email: 'admin@doclink.in',
  password: '12345678',
  role: 'admin',
  name: 'Admin',
};

/**
 * Authenticate user (Doctor or Admin)
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User object with role
 */
export async function authenticateUser(email, password) {
  try {
    // Initialize super admin if needed (ensures default admin exists)
    await initializeSuperAdmin();

    // First, try to authenticate as admin from Firestore
    try {
      const adminAuth = await validateAdminCredentials(email, password);
      
      if (adminAuth.success) {
        return {
          success: true,
          user: {
            email: adminAuth.admin.email,
            name: adminAuth.admin.name,
            role: 'admin',
            id: adminAuth.admin.id,
            isSuperAdmin: adminAuth.admin.isSuperAdmin,
          },
          message: 'Admin login successful',
        };
      }
    } catch (adminError) {
      // If Firestore admin check fails, continue to fallback
      console.warn('Firestore admin check failed, using fallback:', adminError);
    }

    // Fallback to hardcoded admin credentials
    if (email.toLowerCase() === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      return {
        success: true,
        user: {
          email: ADMIN_CREDENTIALS.email,
          name: ADMIN_CREDENTIALS.name,
          role: ADMIN_CREDENTIALS.role,
          id: 'admin-001',
          isSuperAdmin: true,
        },
        message: 'Admin login successful (fallback)',
      };
    }

    // Check if doctor login
    const doctorsRef = collection(db, 'doctors');
    const q = query(doctorsRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    const doctorDoc = querySnapshot.docs[0];
    const doctor = { id: doctorDoc.id, ...doctorDoc.data() };

    // Verify password (in production, use proper password hashing)
    if (doctor.password === password) {
      return {
        success: true,
        user: {
          email: doctor.email,
          name: doctor.name,
          role: 'doctor',
          id: doctor.id,
          specialization: doctor.specialization,
          avatar: doctor.avatar,
        },
        message: 'Doctor login successful',
      };
    } else {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      error: 'Authentication failed. Please try again.',
    };
  }
}

/**
 * Get user role from email
 * @param {string} email - User email
 * @returns {Promise<string>} 'admin' or 'doctor'
 */
export async function getUserRole(email) {
  try {
    // Check Firestore admins first
    const adminsRef = collection(db, 'admins');
    const q = query(adminsRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return 'admin';
    }
  } catch (error) {
    console.warn('Error checking admin role:', error);
  }

  // Fallback to hardcoded admin
  if (email.toLowerCase() === ADMIN_CREDENTIALS.email) {
    return 'admin';
  }
  
  return 'doctor';
}

/**
 * Validate admin credentials
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Promise<boolean>} True if valid admin
 */
export async function isValidAdmin(email, password) {
  try {
    const result = await validateAdminCredentials(email, password);
    return result.success;
  } catch (error) {
    // Fallback to hardcoded credentials
    return email.toLowerCase() === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password;
  }
}

/**
 * Check if user is admin by email
 * @param {string} email - User email
 * @returns {boolean} True if admin
 */
export function isAdmin(email) {
  return email.toLowerCase() === ADMIN_CREDENTIALS.email;
}

/**
 * Get redirect path based on user role
 * @param {string} role - User role ('admin' or 'doctor')
 * @returns {string} Redirect path
 */
export function getRedirectPath(role) {
  return role === 'admin' ? '/admin' : '/doctor';
}

// Export admin credentials for reference (read-only)
export const ADMIN_EMAIL = ADMIN_CREDENTIALS.email;
