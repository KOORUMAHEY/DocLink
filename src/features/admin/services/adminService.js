// Admin Management Service
// Handles CRUD operations for admin users

import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ADMINS_COLLECTION = 'admins';

/**
 * Get all admins from Firestore
 * @returns {Promise<Array>} Array of admin users
 */
export async function getAllAdmins() {
  try {
    const adminsRef = collection(db, ADMINS_COLLECTION);
    const q = query(adminsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting admins:', error);
    throw error;
  }
}

/**
 * Get admin by email
 * @param {string} email - Admin email
 * @returns {Promise<Object|null>} Admin object or null
 */
export async function getAdminByEmail(email) {
  try {
    const adminsRef = collection(db, ADMINS_COLLECTION);
    const q = query(adminsRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const adminDoc = querySnapshot.docs[0];
    return {
      id: adminDoc.id,
      ...adminDoc.data(),
    };
  } catch (error) {
    console.error('Error getting admin by email:', error);
    throw error;
  }
}

/**
 * Create a new admin
 * @param {Object} adminData - Admin data
 * @returns {Promise<Object>} Created admin object
 */
export async function createAdmin(adminData) {
  try {
    // Check if email already exists
    const existingAdmin = await getAdminByEmail(adminData.email);
    if (existingAdmin) {
      throw new Error('Admin with this email already exists');
    }

    const adminsRef = collection(db, ADMINS_COLLECTION);
    const newAdmin = {
      ...adminData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: 'admin',
      status: adminData.status || 'active',
    };

    const docRef = await addDoc(adminsRef, newAdmin);
    
    return {
      id: docRef.id,
      ...newAdmin,
    };
  } catch (error) {
    console.error('Error creating admin:', error);
    throw error;
  }
}

/**
 * Update an admin
 * @param {string} adminId - Admin ID
 * @param {Object} updates - Updated admin data
 * @returns {Promise<Object>} Updated admin object
 */
export async function updateAdmin(adminId, updates) {
  try {
    const adminRef = doc(db, ADMINS_COLLECTION, adminId);
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(adminRef, updateData);
    
    return {
      id: adminId,
      ...updateData,
    };
  } catch (error) {
    console.error('Error updating admin:', error);
    throw error;
  }
}

/**
 * Delete an admin
 * @param {string} adminId - Admin ID
 * @returns {Promise<void>}
 */
export async function deleteAdmin(adminId) {
  try {
    const adminRef = doc(db, ADMINS_COLLECTION, adminId);
    await deleteDoc(adminRef);
  } catch (error) {
    console.error('Error deleting admin:', error);
    throw error;
  }
}

/**
 * Toggle admin status (active/inactive)
 * @param {string} adminId - Admin ID
 * @param {string} status - New status ('active' or 'inactive')
 * @returns {Promise<Object>} Updated admin
 */
export async function toggleAdminStatus(adminId, status) {
  try {
    return await updateAdmin(adminId, { status });
  } catch (error) {
    console.error('Error toggling admin status:', error);
    throw error;
  }
}

/**
 * Validate admin credentials
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Promise<Object|null>} Admin object if valid, null otherwise
 */
export async function validateAdminCredentials(email, password) {
  try {
    const admin = await getAdminByEmail(email);
    
    if (!admin) {
      return null;
    }

    // Check if admin is active
    if (admin.status !== 'active') {
      throw new Error('Admin account is inactive');
    }

    // Verify password (in production, use proper password hashing)
    if (admin.password === password) {
      return admin;
    }

    return null;
  } catch (error) {
    console.error('Error validating admin credentials:', error);
    throw error;
  }
}

/**
 * Initialize default super admin if no admins exist
 * @returns {Promise<Object|null>} Created admin or null
 */
export async function initializeSuperAdmin() {
  try {
    const admins = await getAllAdmins();
    
    if (admins.length === 0) {
      // Create default super admin
      const superAdmin = await createAdmin({
        email: 'admin@doclink.in',
        password: '12345678', // In production, use hashed password
        name: 'Super Admin',
        phone: '',
        isSuperAdmin: true,
        status: 'active',
      });
      
      console.log('Super admin created:', superAdmin.email);
      return superAdmin;
    }
    
    return null;
  } catch (error) {
    console.error('Error initializing super admin:', error);
    throw error;
  }
}

/**
 * Check if admin is super admin
 * @param {string} adminId - Admin ID
 * @returns {Promise<boolean>} True if super admin
 */
export async function isSuperAdmin(adminId) {
  try {
    const adminsRef = collection(db, ADMINS_COLLECTION);
    const q = query(adminsRef, where('__name__', '==', adminId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return false;
    }
    
    const admin = querySnapshot.docs[0].data();
    return admin.isSuperAdmin === true;
  } catch (error) {
    console.error('Error checking super admin:', error);
    return false;
  }
}
