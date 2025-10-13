import { ADMIN_ROLES, ROLE_PERMISSIONS, ADMIN_ROLE_LABELS } from '../constants/adminConstants';

/**
 * Check if user has specific permission
 * @param {Object} user - User object with role and permissions
 * @param {string} permission - Permission to check
 * @returns {boolean} Whether user has permission
 */
export const hasPermission = (user, permission) => {
  if (!user) return false;
  
  // Super admin has all permissions
  if (user.role === ADMIN_ROLES.SUPER_ADMIN) return true;
  
  // Check explicit permissions
  if (user.permissions && Array.isArray(user.permissions)) {
    return user.permissions.includes(permission);
  }
  
  // Check role-based permissions
  const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
  return rolePermissions.includes(permission);
};

/**
 * Get user's role label
 * @param {string} role - Role key
 * @returns {string} Human-readable role label
 */
export const getRoleLabel = (role) => {
  return ADMIN_ROLE_LABELS[role] || role;
};

/**
 * Format dashboard stat value
 * @param {number} value - Stat value
 * @param {string} type - Stat type for formatting context
 * @returns {string} Formatted value
 */
export const formatStatValue = (value, type = 'number') => {
  if (typeof value !== 'number') return '0';
  
  if (type === 'percentage') {
    return `${value}%`;
  }
  
  if (type === 'currency') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }
  
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  
  return value.toString();
};

/**
 * Calculate percentage change between two values
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} Percentage change
 */
export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

/**
 * Format activity log timestamp
 * @param {Date|string} timestamp - Activity timestamp
 * @returns {string} Formatted relative time
 */
export const formatActivityTime = (timestamp) => {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

/**
 * Get activity icon color by type
 * @param {string} activityType - Activity type
 * @returns {string} Color class
 */
export const getActivityIconColor = (activityType) => {
  const colorMap = {
    appointment_created: 'text-green-600',
    appointment_updated: 'text-blue-600',
    appointment_cancelled: 'text-red-600',
    doctor_added: 'text-purple-600',
    doctor_updated: 'text-indigo-600',
    patient_registered: 'text-teal-600',
    user_login: 'text-gray-600',
    system_update: 'text-orange-600'
  };
  
  return colorMap[activityType] || 'text-gray-500';
};

/**
 * Get log level badge variant
 * @param {string} level - Log level
 * @returns {string} Badge variant class
 */
export const getLogLevelVariant = (level) => {
  const variantMap = {
    info: 'default',
    warning: 'warning',
    error: 'destructive',
    critical: 'destructive'
  };
  
  return variantMap[level] || 'default';
};

/**
 * Parse and sanitize system log message
 * @param {string} message - Raw log message
 * @returns {string} Sanitized message
 */
export const sanitizeLogMessage = (message) => {
  if (!message) return '';
  
  // Remove sensitive information patterns
  return message
    .replace(/password[=:]\s*\S+/gi, 'password=***')
    .replace(/token[=:]\s*\S+/gi, 'token=***')
    .replace(/api[_-]?key[=:]\s*\S+/gi, 'api_key=***');
};

/**
 * Generate export filename with timestamp
 * @param {string} prefix - Filename prefix
 * @param {string} format - File format
 * @returns {string} Generated filename
 */
export const generateExportFilename = (prefix, format) => {
  const timestamp = new Date().toISOString().split('T')[0];
  return `${prefix}_${timestamp}.${format}`;
};

/**
 * Calculate system health score
 * @param {Object} stats - Dashboard statistics
 * @returns {number} Health score (0-100)
 */
export const calculateSystemHealth = (stats) => {
  let score = 100;
  
  // Penalize high cancellation rate
  if (stats.totalAppointments > 0) {
    const cancellationRate = (stats.cancelledAppointments / stats.totalAppointments) * 100;
    if (cancellationRate > 20) score -= 15;
    else if (cancellationRate > 10) score -= 8;
  }
  
  // Penalize low occupancy
  if (stats.occupancyRate < 30) score -= 20;
  else if (stats.occupancyRate < 50) score -= 10;
  
  // Penalize high inactive doctor ratio
  if (stats.totalDoctors > 0) {
    const inactiveRatio = (stats.inactiveDoctors / stats.totalDoctors) * 100;
    if (inactiveRatio > 30) score -= 15;
    else if (inactiveRatio > 15) score -= 8;
  }
  
  return Math.max(0, Math.min(100, score));
};

/**
 * Group activities by date
 * @param {Array} activities - List of activities
 * @returns {Object} Activities grouped by date
 */
export const groupActivitiesByDate = (activities) => {
  const grouped = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  activities.forEach(activity => {
    const activityDate = activity.timestamp instanceof Date 
      ? activity.timestamp 
      : new Date(activity.timestamp);
    activityDate.setHours(0, 0, 0, 0);
    
    let key;
    if (activityDate.getTime() === today.getTime()) {
      key = 'Today';
    } else if (activityDate.getTime() === yesterday.getTime()) {
      key = 'Yesterday';
    } else {
      key = activityDate.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(activity);
  });
  
  return grouped;
};

/**
 * Validate admin email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export const isValidAdminEmail = (email) => {
  const adminDomains = ['doclink.com', 'admin.doclink.com'];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) return false;
  
  const domain = email.split('@')[1];
  return adminDomains.includes(domain);
};

/**
 * Generate dashboard summary text
 * @param {Object} stats - Dashboard statistics
 * @returns {string} Summary text
 */
export const generateDashboardSummary = (stats) => {
  const healthScore = calculateSystemHealth(stats);
  const healthStatus = healthScore >= 80 ? 'excellent' : healthScore >= 60 ? 'good' : 'needs attention';
  
  return `System health is ${healthStatus}. ${stats.scheduledAppointments} appointments scheduled, ` +
         `${stats.activeDoctors} active doctors serving ${stats.totalPatients} patients. ` +
         `Current occupancy: ${stats.occupancyRate}%.`;
};
