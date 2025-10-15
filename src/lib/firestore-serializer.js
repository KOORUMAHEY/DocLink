/**
 * Utility functions for serializing Firestore data for client components
 */

/**
 * Converts Firestore Timestamp to ISO string
 * @param {any} value - The value to convert
 * @returns {string|null} ISO string or original value
 */
export const serializeTimestamp = (value) => {
  if (!value) return value;
  
  // Firestore Timestamp with toDate method
  if (value.toDate && typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }
  
  // JavaScript Date object
  if (value instanceof Date) {
    return value.toISOString();
  }
  
  // Already a string
  return value;
};

/**
 * Recursively serializes an object, converting all Firestore Timestamps to ISO strings
 * @param {any} obj - The object to serialize
 * @returns {any} Serialized object
 */
export const serializeFirestoreData = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(serializeFirestoreData);
  }
  
  // Handle objects
  const serialized = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Known timestamp fields
    const timestampFields = [
      'appointmentDate',
      'createdAt', 
      'updatedAt',
      'lastUpdated',
      'approvedAt',
      'rejectedAt',
      'rescheduledAt',
      'completedAt',
      'cancelledAt'
    ];
    
    if (timestampFields.includes(key)) {
      serialized[key] = serializeTimestamp(value);
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Recursively serialize nested objects
      serialized[key] = serializeFirestoreData(value);
    } else if (Array.isArray(value)) {
      // Serialize arrays
      serialized[key] = value.map(serializeFirestoreData);
    } else {
      serialized[key] = value;
    }
  }
  
  return serialized;
};

/**
 * Serializes an array of appointments for client components
 * @param {Array} appointments - Array of appointment objects
 * @returns {Array} Serialized appointments
 */
export const serializeAppointments = (appointments) => {
  if (!Array.isArray(appointments)) {
    return appointments;
  }
  
  return appointments.map(serializeFirestoreData);
};

/**
 * Deserializes ISO strings back to Date objects for date manipulation
 * @param {any} obj - The object to deserialize
 * @returns {any} Object with Date objects
 */
export const deserializeDates = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(deserializeDates);
  }
  
  const deserialized = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const timestampFields = [
      'appointmentDate',
      'createdAt', 
      'updatedAt',
      'lastUpdated',
      'approvedAt',
      'rejectedAt',
      'rescheduledAt',
      'completedAt',
      'cancelledAt'
    ];
    
    if (timestampFields.includes(key) && typeof value === 'string') {
      try {
        deserialized[key] = new Date(value);
      } catch {
        deserialized[key] = value;
      }
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      deserialized[key] = deserializeDates(value);
    } else if (Array.isArray(value)) {
      deserialized[key] = value.map(deserializeDates);
    } else {
      deserialized[key] = value;
    }
  }
  
  return deserialized;
};