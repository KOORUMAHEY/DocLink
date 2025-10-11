import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';

/**
 * Get system settings
 * @returns {Promise<Object>} System settings
 */
export const getSystemSettings = async () => {
  try {
    const settingsDoc = doc(db, 'system', 'settings');
    const docSnap = await getDoc(settingsDoc);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }

    // Return default settings if not found
    return getDefaultSystemSettings();
  } catch (error) {
    console.error('Error fetching system settings:', error);
    return getDefaultSystemSettings();
  }
};

/**
 * Update system settings
 * @param {Object} updates - Settings to update
 * @returns {Promise<Object>} Updated settings
 */
export const updateSystemSettings = async (updates) => {
  try {
    const settingsDoc = doc(db, 'system', 'settings');
    await updateDoc(settingsDoc, {
      ...updates,
      updatedAt: new Date()
    });

    const updatedDoc = await getDoc(settingsDoc);
    return { id: updatedDoc.id, ...updatedDoc.data() };
  } catch (error) {
    console.error('Error updating system settings:', error);
    throw new Error('Failed to update system settings');
  }
};

/**
 * Get notification settings
 * @returns {Promise<Object>} Notification settings
 */
export const getNotificationSettings = async () => {
  try {
    const settings = await getSystemSettings();
    return settings.notifications || getDefaultNotificationSettings();
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return getDefaultNotificationSettings();
  }
};

/**
 * Update notification settings
 * @param {Object} notificationSettings - Notification settings to update
 * @returns {Promise<Object>} Updated settings
 */
export const updateNotificationSettings = async (notificationSettings) => {
  try {
    const currentSettings = await getSystemSettings();
    return await updateSystemSettings({
      ...currentSettings,
      notifications: {
        ...currentSettings.notifications,
        ...notificationSettings
      }
    });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw new Error('Failed to update notification settings');
  }
};

/**
 * Get security settings
 * @returns {Promise<Object>} Security settings
 */
export const getSecuritySettings = async () => {
  try {
    const settings = await getSystemSettings();
    return settings.security || getDefaultSecuritySettings();
  } catch (error) {
    console.error('Error fetching security settings:', error);
    return getDefaultSecuritySettings();
  }
};

/**
 * Update security settings
 * @param {Object} securitySettings - Security settings to update
 * @returns {Promise<Object>} Updated settings
 */
export const updateSecuritySettings = async (securitySettings) => {
  try {
    const currentSettings = await getSystemSettings();
    return await updateSystemSettings({
      ...currentSettings,
      security: {
        ...currentSettings.security,
        ...securitySettings
      }
    });
  } catch (error) {
    console.error('Error updating security settings:', error);
    throw new Error('Failed to update security settings');
  }
};

/**
 * Get backup settings
 * @returns {Promise<Object>} Backup settings
 */
export const getBackupSettings = async () => {
  try {
    const settings = await getSystemSettings();
    return settings.backup || getDefaultBackupSettings();
  } catch (error) {
    console.error('Error fetching backup settings:', error);
    return getDefaultBackupSettings();
  }
};

/**
 * Update backup settings
 * @param {Object} backupSettings - Backup settings to update
 * @returns {Promise<Object>} Updated settings
 */
export const updateBackupSettings = async (backupSettings) => {
  try {
    const currentSettings = await getSystemSettings();
    return await updateSystemSettings({
      ...currentSettings,
      backup: {
        ...currentSettings.backup,
        ...backupSettings
      }
    });
  } catch (error) {
    console.error('Error updating backup settings:', error);
    throw new Error('Failed to update backup settings');
  }
};

/**
 * Get clinic settings
 * @returns {Promise<Object>} Clinic settings
 */
export const getClinicSettings = async () => {
  try {
    const settings = await getSystemSettings();
    return settings.clinic || getDefaultClinicSettings();
  } catch (error) {
    console.error('Error fetching clinic settings:', error);
    return getDefaultClinicSettings();
  }
};

/**
 * Update clinic settings
 * @param {Object} clinicSettings - Clinic settings to update
 * @returns {Promise<Object>} Updated settings
 */
export const updateClinicSettings = async (clinicSettings) => {
  try {
    const currentSettings = await getSystemSettings();
    return await updateSystemSettings({
      ...currentSettings,
      clinic: {
        ...currentSettings.clinic,
        ...clinicSettings
      }
    });
  } catch (error) {
    console.error('Error updating clinic settings:', error);
    throw new Error('Failed to update clinic settings');
  }
};

// Default settings functions
const getDefaultSystemSettings = () => {
  return {
    id: 'settings',
    clinic: getDefaultClinicSettings(),
    notifications: getDefaultNotificationSettings(),
    security: getDefaultSecuritySettings(),
    backup: getDefaultBackupSettings(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

const getDefaultClinicSettings = () => {
  return {
    name: 'DocLink Healthcare',
    address: '123 Medical Center Dr, Healthcare City, HC 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@doclink.com',
    website: 'https://doclink.com',
    workingHours: {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '09:00', close: '13:00', closed: false },
      sunday: { open: '00:00', close: '00:00', closed: true }
    },
    emergencyContact: '+1 (555) 911-0000',
    timezone: 'America/New_York'
  };
};

const getDefaultNotificationSettings = () => {
  return {
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    systemAlerts: true,
    marketingEmails: false,
    reminderTiming: {
      appointment: 24, // hours before
      followUp: 24 // hours after
    }
  };
};

const getDefaultSecuritySettings = () => {
  return {
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false
    },
    sessionTimeout: 30, // minutes
    maxLoginAttempts: 5,
    lockoutDuration: 15, // minutes
    twoFactorAuth: false,
    ipWhitelist: [],
    encryptionEnabled: true
  };
};

const getDefaultBackupSettings = () => {
  return {
    autoBackup: true,
    backupFrequency: 'daily', // daily, weekly, monthly
    backupTime: '02:00', // 2 AM
    retentionPeriod: 30, // days
    backupLocation: 'cloud', // local, cloud, both
    lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    backupStatus: 'completed'
  };
};