import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';

/**
 * Get dashboard statistics for admin overview
 * @returns {Promise<Object>} Dashboard statistics
 */
export const getDashboardStats = async () => {
  try {
    // Get current month's start and end dates
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const appointmentsRef = collection(db, 'appointments');
    const doctorsRef = collection(db, 'doctors');
    const patientsRef = collection(db, 'patients');

    // Query appointments directly from Firestore
    const appointmentsQuery = query(appointmentsRef);
    const doctorsQuery = query(doctorsRef);
    const patientsQuery = query(patientsRef);
    const newPatientsQuery = query(
      patientsRef,
      where('createdAt', '>=', Timestamp.fromDate(firstDayOfMonth)),
      where('createdAt', '<=', Timestamp.fromDate(lastDayOfMonth))
    );

    const [appointmentsSnap, doctorsSnap, patientsSnap] = await Promise.all([
      getDocs(appointmentsQuery),
      getDocs(doctorsQuery),
      getDocs(patientsQuery)
    ]);
    
    // Get new patients separately to handle potential errors
    const newPatientsSnap = await getDocs(newPatientsQuery);

    const appointments = appointmentsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date
    }));
    const doctors = doctorsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const patients = patientsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Calculate new patients
    let newPatientsCount = 0;
    try {
      const newPatientsSnap = await getDocs(newPatientsQuery);
      newPatientsCount = newPatientsSnap.docs.length;
    } catch (error) {
      console.error('Error fetching new patients:', error);
    }

    const totalAppointments = appointments.length;
    const scheduledAppointments = appointments.filter(a => a.status === 'scheduled').length;
    const completedAppointments = appointments.filter(a => a.status === 'completed').length;
    const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length;
    const activeDoctors = doctors.filter(d => d.isActive !== false).length;
    const totalDoctors = doctors.length;
    const inactiveDoctors = totalDoctors - activeDoctors;
    const totalPatients = patients.length;
    const newPatientsThisMonth = newPatientsCount;

    // Calculate clinic occupancy based on today's appointments
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const todayAppointments = appointments.filter(a => {
      if (!a.date) return false;
      const appointmentDate = a.date instanceof Timestamp ? a.date.toDate() : new Date(a.date);
      return appointmentDate >= todayStart && appointmentDate < todayEnd;
    });

    // Assuming clinic has 8 working hours and appointments are 30 minutes each
    const maxDailySlots = 16 * activeDoctors; // 16 slots per doctor
    const occupancyRate = todayAppointments.length > 0 ? 
      Math.round((todayAppointments.length / maxDailySlots) * 100) : 0;

    return {
      totalAppointments,
      scheduledAppointments,
      completedAppointments,
      cancelledAppointments,
      activeDoctors,
      totalDoctors,
      inactiveDoctors,
      totalPatients,
      newPatientsThisMonth,
      occupancyRate
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    console.error('Please ensure Firebase is properly configured with environment variables.');

    // Return default values with a warning
    return {
      totalAppointments: 0,
      scheduledAppointments: 0,
      completedAppointments: 0,
      cancelledAppointments: 0,
      activeDoctors: 0,
      totalDoctors: 0,
      inactiveDoctors: 0,
      totalPatients: 0,
      newPatientsThisMonth: 0,
      occupancyRate: 0,
      error: error.message
    };
  }
};

/**
 * Get system logs and security events
 * @param {Object} options - Query options
 * @returns {Promise<Array>} System logs
 */
export const getSystemLogs = async (options = {}) => {
  try {
    const logsCol = collection(db, 'systemLogs');
    let q = query(logsCol, orderBy('timestamp', 'desc'));

    if (options.limit) {
      q = query(q, limit(options.limit));
    }

    if (options.type) {
      q = query(q, where('type', '==', options.type));
    }

    const logsSnapshot = await getDocs(q);
    const logs = logsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || new Date(doc.data().timestamp)
    }));

    // If no logs in Firestore, return mock data
    if (logs.length === 0) {
      return getMockSystemLogs(options.limit || 10);
    }

    return logs;
  } catch (error) {
    console.error('Error fetching system logs:', error);
    return getMockSystemLogs(options.limit || 10);
  }
};

/**
 * Get recent activity feed
 * @param {number} limitCount - Number of activities to fetch
 * @returns {Promise<Array>} Recent activities
 */
export const getRecentActivities = async (limitCount = 10) => {
  try {
    const activitiesCol = collection(db, 'activities');
    const q = query(activitiesCol, orderBy('timestamp', 'desc'), limit(limitCount));
    const activitiesSnapshot = await getDocs(q);

    const activities = activitiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || new Date(doc.data().timestamp)
    }));

    // If no activities in Firestore, return mock data
    if (activities.length === 0) {
      return getMockActivities(limitCount);
    }

    return activities;
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return getMockActivities(limitCount);
  }
};

/**
 * Get upcoming appointments for dashboard
 * @param {number} limit - Number of appointments to fetch
 * @returns {Promise<Array>} Upcoming appointments
 */
export const getUpcomingAppointments = async (limit = 5) => {
  try {
    const appointments = await getAppointments();
    const now = new Date();

    const upcoming = appointments
      .filter(apt => new Date(apt.appointmentDate) > now && apt.status === 'scheduled')
      .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
      .slice(0, limit);

    return upcoming;
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    return [];
  }
};

/**
 * Get admin user profile
 * @param {string} userId - Admin user ID
 * @returns {Promise<Object|null>} Admin user data
 */
export const getAdminUser = async (userId) => {
  try {
    const adminCol = collection(db, 'adminUsers');
    const q = query(adminCol, where('userId', '==', userId));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }

    // Return default admin data if not found
    return {
      id: userId,
      name: 'Admin User',
      email: 'admin@doclink.com',
      role: 'Super Admin',
      avatar: '/placeholder-avatar.jpg'
    };
  } catch (error) {
    console.error('Error fetching admin user:', error);
    return {
      id: userId,
      name: 'Admin User',
      email: 'admin@doclink.com',
      role: 'Super Admin',
      avatar: '/placeholder-avatar.jpg'
    };
  }
};

/**
 * Get security alerts and compliance status
 * @returns {Promise<Object>} Security status
 */
export const getSecurityStatus = async () => {
  try {
    // In a real app, this would check various security metrics
    // For now, return mock compliance data
    return {
      hipaaCompliant: true,
      lastAudit: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      dataEncrypted: true,
      backupStatus: 'healthy',
      systemLoad: 45, // percentage
      lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      alerts: []
    };
  } catch (error) {
    console.error('Error fetching security status:', error);
    return {
      hipaaCompliant: true,
      lastAudit: new Date(),
      dataEncrypted: true,
      backupStatus: 'healthy',
      systemLoad: 45,
      lastBackup: new Date(),
      alerts: []
    };
  }
};

// Mock data functions for development
const getMockSystemLogs = (limit) => {
  const mockLogs = [
    {
      id: '1',
      type: 'security',
      message: 'Failed login attempt detected',
      details: 'IP: 192.168.1.100',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      severity: 'warning'
    },
    {
      id: '2',
      type: 'admin',
      message: 'Admin settings modified',
      details: 'User: admin@example.com',
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      severity: 'info'
    },
    {
      id: '3',
      type: 'system',
      message: 'Bulk patient data import completed',
      details: '150 records imported',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      severity: 'success'
    },
    {
      id: '4',
      type: 'security',
      message: 'Security audit passed',
      details: 'All systems secure',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      severity: 'success'
    }
  ];

  return mockLogs.slice(0, limit);
};

const getMockActivities = (limit) => {
  const mockActivities = [
    {
      id: '1',
      type: 'appointment',
      message: 'Dr. Smith completed appointment with John Doe',
      user: 'Dr. Smith',
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      status: 'completed'
    },
    {
      id: '2',
      type: 'patient',
      message: 'New patient Jane Smith registered',
      user: 'Jane Smith',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      status: 'registration'
    },
    {
      id: '3',
      type: 'doctor',
      message: 'Dr. Johnson was added to the system',
      user: 'Dr. Johnson',
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      status: 'new_doctor'
    },
    {
      id: '4',
      type: 'system',
      message: 'System backup completed successfully',
      user: 'System',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'backup'
    },
    {
      id: '5',
      type: 'admin',
      message: 'Emergency broadcast message sent',
      user: 'Admin',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      status: 'emergency'
    }
  ];

  return mockActivities.slice(0, limit);
};