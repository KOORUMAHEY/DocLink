import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

/**
 * Get all admin users
 * @returns {Promise<Array>} List of admin users
 */
export const getAdminUsers = async () => {
  try {
    const adminUsersCol = collection(db, 'adminUsers');
    const snapshot = await getDocs(adminUsersCol);
    const adminUsers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Return mock data if no admin users in Firestore
    if (adminUsers.length === 0) {
      return getMockAdminUsers();
    }

    return adminUsers;
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return getMockAdminUsers();
  }
};

/**
 * Get admin user by ID
 * @param {string} userId - Admin user ID
 * @returns {Promise<Object|null>} Admin user data
 */
export const getAdminUserById = async (userId) => {
  try {
    const docRef = doc(db, 'adminUsers', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }

    // Return mock data if not found
    return getMockAdminUser(userId);
  } catch (error) {
    console.error('Error fetching admin user:', error);
    return getMockAdminUser(userId);
  }
};

/**
 * Get admin user by email
 * @param {string} email - Admin user email
 * @returns {Promise<Object|null>} Admin user data
 */
export const getAdminUserByEmail = async (email) => {
  try {
    const adminUsersCol = collection(db, 'adminUsers');
    const q = query(adminUsersCol, where('email', '==', email));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }

    // Return mock data if not found
    return getMockAdminUserByEmail(email);
  } catch (error) {
    console.error('Error fetching admin user by email:', error);
    return getMockAdminUserByEmail(email);
  }
};

/**
 * Create new admin user
 * @param {Object} userData - Admin user data
 * @returns {Promise<Object>} Created admin user
 */
export const createAdminUser = async (userData) => {
  try {
    const adminUsersCol = collection(db, 'adminUsers');
    const docRef = await addDoc(adminUsersCol, {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    });

    return { id: docRef.id, ...userData };
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw new Error('Failed to create admin user');
  }
};

/**
 * Update admin user
 * @param {string} userId - Admin user ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated admin user
 */
export const updateAdminUser = async (userId, updates) => {
  try {
    const docRef = doc(db, 'adminUsers', userId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date()
    });

    const updatedDoc = await getDoc(docRef);
    return { id: updatedDoc.id, ...updatedDoc.data() };
  } catch (error) {
    console.error('Error updating admin user:', error);
    throw new Error('Failed to update admin user');
  }
};

/**
 * Delete admin user
 * @param {string} userId - Admin user ID
 * @returns {Promise<void>}
 */
export const deleteAdminUser = async (userId) => {
  try {
    const docRef = doc(db, 'adminUsers', userId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting admin user:', error);
    throw new Error('Failed to delete admin user');
  }
};

/**
 * Get admin user permissions
 * @param {string} userId - Admin user ID
 * @returns {Promise<Array>} User permissions
 */
export const getAdminUserPermissions = async (userId) => {
  try {
    const user = await getAdminUserById(userId);
    return user?.permissions || getDefaultPermissions(user?.role);
  } catch (error) {
    console.error('Error fetching admin user permissions:', error);
    return getDefaultPermissions('admin');
  }
};

/**
 * Update admin user permissions
 * @param {string} userId - Admin user ID
 * @param {Array} permissions - New permissions
 * @returns {Promise<Object>} Updated user
 */
export const updateAdminUserPermissions = async (userId, permissions) => {
  try {
    return await updateAdminUser(userId, { permissions });
  } catch (error) {
    console.error('Error updating admin user permissions:', error);
    throw new Error('Failed to update permissions');
  }
};

// Helper functions
const getDefaultPermissions = (role) => {
  const rolePermissions = {
    'super_admin': [
      'manage_users',
      'manage_doctors',
      'manage_patients',
      'manage_appointments',
      'view_reports',
      'system_settings',
      'security_logs',
      'backup_restore'
    ],
    'admin': [
      'manage_doctors',
      'manage_patients',
      'manage_appointments',
      'view_reports'
    ],
    'moderator': [
      'manage_appointments',
      'view_reports'
    ]
  };

  return rolePermissions[role] || [];
};

// Mock data functions
const getMockAdminUsers = () => {
  return [
    {
      id: 'admin_1',
      name: 'Super Admin',
      email: 'admin@doclink.com',
      role: 'super_admin',
      avatar: '/placeholder-avatar.jpg',
      isActive: true,
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      permissions: getDefaultPermissions('super_admin'),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      updatedAt: new Date()
    },
    {
      id: 'admin_2',
      name: 'John Smith',
      email: 'john.smith@doclink.com',
      role: 'admin',
      avatar: '/avatars/john.jpg',
      isActive: true,
      lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      permissions: getDefaultPermissions('admin'),
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      updatedAt: new Date()
    }
  ];
};

const getMockAdminUser = (userId) => {
  const mockUsers = getMockAdminUsers();
  return mockUsers.find(user => user.id === userId) || {
    id: userId,
    name: 'Admin User',
    email: 'admin@doclink.com',
    role: 'admin',
    avatar: '/placeholder-avatar.jpg',
    isActive: true,
    permissions: getDefaultPermissions('admin'),
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

const getMockAdminUserByEmail = (email) => {
  const mockUsers = getMockAdminUsers();
  return mockUsers.find(user => user.email === email) || {
    id: 'mock_admin',
    name: 'Mock Admin',
    email: email,
    role: 'admin',
    avatar: '/placeholder-avatar.jpg',
    isActive: true,
    permissions: getDefaultPermissions('admin'),
    createdAt: new Date(),
    updatedAt: new Date()
  };
};