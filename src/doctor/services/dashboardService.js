/**
 * Doctor Dashboard Service
 * Optimized service for doctor dashboard with caching and performance enhancements
 */

import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where,
  orderBy,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { getPatientByHospitalId } from '@/features/patients';
import { getDoctorById } from '@/features/doctors';

// Cache for doctor data and appointments
const dashboardCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Real-time listeners
const listeners = new Map();

/**
 * Get cached data if valid, otherwise return null
 */
const getCachedData = (key) => {
  const cached = dashboardCache.get(key);
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

/**
 * Set cache data with timestamp
 */
const setCacheData = (key, data) => {
  dashboardCache.set(key, {
    data,
    timestamp: Date.now()
  });
};

/**
 * Get optimized doctor dashboard data with caching
 */
export const getDoctorDashboardData = async (doctorId) => {
  const cacheKey = `dashboard_${doctorId}`;
  
  // Check cache first
  const cached = getCachedData(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Parallel queries for better performance
    const [doctorData, appointmentsData, todayStats] = await Promise.all([
      getDoctorById(doctorId),
      getAppointmentsByDoctorOptimized(doctorId),
      getTodayStatsForDoctor(doctorId)
    ]);

    const dashboardData = {
      doctor: doctorData || {},
      appointments: appointmentsData || [],
      todayStats,
      lastUpdated: new Date().toISOString()
    };

    // Cache the results
    setCacheData(cacheKey, dashboardData);

    return dashboardData;
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
    throw error;
  }
};

/**
 * Get appointments for doctor with optimized queries
 */
const getAppointmentsByDoctorOptimized = async (doctorId) => {
  try {
    const appointmentsRef = collection(db, 'appointments');
    
    // Get appointments for the next 30 days and past 7 days
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const q = query(
      appointmentsRef,
      where('doctorId', '==', doctorId),
      where('appointmentDate', '>=', Timestamp.fromDate(sevenDaysAgo)),
      where('appointmentDate', '<=', Timestamp.fromDate(thirtyDaysFromNow)),
      orderBy('appointmentDate', 'asc')
    );

    const snapshot = await getDocs(q);
    const appointments = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));

    // Batch fetch patient details for all appointments
    const enrichedAppointments = await enrichAppointmentsWithPatientData(appointments);
    
    return enrichedAppointments;
  } catch (error) {
    console.error('Error fetching optimized appointments:', error);
    return [];
  }
};

/**
 * Enrich appointments with patient data in batches
 */
const enrichAppointmentsWithPatientData = async (appointments) => {
  // Get unique patient IDs
  const patientIds = [...new Set(appointments.map(a => a.patientId).filter(Boolean))];
  
  // Batch fetch patient data
  const patientDataMap = new Map();
  
  try {
    const patientPromises = patientIds.map(async (patientId) => {
      try {
        const patientData = await getPatientByHospitalId(patientId);
        if (patientData) {
          patientDataMap.set(patientId, patientData);
        }
      } catch (error) {
        console.warn(`Could not fetch patient ${patientId}:`, error);
      }
    });

    await Promise.all(patientPromises);
  } catch (error) {
    console.warn('Error batch fetching patient data:', error);
  }

  // Enrich appointments with patient data
  return appointments.map(appointment => {
    const patientData = patientDataMap.get(appointment.patientId);
    if (patientData) {
      return {
        ...appointment,
        patientName: patientData.name || patientData.patientName || appointment.patientName,
        patientPhone: patientData.phone || appointment.patientPhone,
        patientEmail: patientData.email || appointment.patientEmail,
        patientAvatar: patientData.avatar || patientData.photoURL,
        age: patientData.age,
        gender: patientData.gender,
        hospitalId: patientData.hospitalId || appointment.patientId
      };
    }
    return appointment;
  });
};

/**
 * Get today's statistics for doctor
 */
const getTodayStatsForDoctor = async (doctorId) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointmentsRef = collection(db, 'appointments');
    const q = query(
      appointmentsRef,
      where('doctorId', '==', doctorId),
      where('appointmentDate', '>=', Timestamp.fromDate(today)),
      where('appointmentDate', '<', Timestamp.fromDate(tomorrow))
    );

    const snapshot = await getDocs(q);
    const todayAppointments = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));

    return {
      total: todayAppointments.length,
      confirmed: todayAppointments.filter(a => a.status === 'confirmed').length,
      pending: todayAppointments.filter(a => a.status === 'pending').length,
      completed: todayAppointments.filter(a => a.status === 'completed').length,
      cancelled: todayAppointments.filter(a => a.status === 'cancelled').length,
      appointments: todayAppointments
    };
  } catch (error) {
    console.error('Error fetching today stats:', error);
    return {
      total: 0,
      confirmed: 0,
      pending: 0,
      completed: 0,
      cancelled: 0,
      appointments: []
    };
  }
};

/**
 * Get recent patient interactions for doctor
 */
export const getRecentPatientInteractions = async (doctorId, limit = 10) => {
  try {
    const appointmentsRef = collection(db, 'appointments');
    const q = query(
      appointmentsRef,
      where('doctorId', '==', doctorId),
      where('status', 'in', ['completed', 'confirmed']),
      orderBy('appointmentDate', 'desc'),
      limit(limit)
    );

    const snapshot = await getDocs(q);
    const interactions = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));

    return await enrichAppointmentsWithPatientData(interactions);
  } catch (error) {
    console.error('Error fetching recent interactions:', error);
    return [];
  }
};

/**
 * Get upcoming appointments for doctor (next 24 hours)
 */
export const getUpcomingAppointments = async (doctorId, hours = 24) => {
  try {
    const now = new Date();
    const futureTime = new Date();
    futureTime.setHours(futureTime.getHours() + hours);

    const appointmentsRef = collection(db, 'appointments');
    const q = query(
      appointmentsRef,
      where('doctorId', '==', doctorId),
      where('appointmentDate', '>=', Timestamp.fromDate(now)),
      where('appointmentDate', '<=', Timestamp.fromDate(futureTime)),
      where('status', 'in', ['scheduled', 'confirmed', 'pending']),
      orderBy('appointmentDate', 'asc')
    );

    const snapshot = await getDocs(q);
    const appointments = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));

    return await enrichAppointmentsWithPatientData(appointments);
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    return [];
  }
};

/**
 * Calculate comprehensive dashboard statistics
 */
export const calculateDashboardStats = (appointments) => {
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  
  const thisWeek = new Date(today);
  thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay()); // Start of week
  
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  // Filter appointments by time periods
  const todayAppointments = appointments.filter(a => {
    const apptDate = new Date(a.appointmentDate);
    apptDate.setHours(0, 0, 0, 0);
    return apptDate.getTime() === today.getTime();
  });

  const thisWeekAppointments = appointments.filter(a => {
    const apptDate = new Date(a.appointmentDate);
    return apptDate >= thisWeek && apptDate <= now;
  });

  const thisMonthAppointments = appointments.filter(a => {
    const apptDate = new Date(a.appointmentDate);
    return apptDate >= thisMonth && apptDate <= now;
  });

  const lastMonthAppointments = appointments.filter(a => {
    const apptDate = new Date(a.appointmentDate);
    return apptDate >= lastMonth && apptDate <= lastMonthEnd;
  });

  // Status-based filtering
  const completedAppointments = appointments.filter(a => a.status === 'completed');
  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed');
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled');

  // Patient statistics
  const uniquePatients = new Set(appointments.map(a => a.patientId || a.patientEmail).filter(Boolean));
  const returningPatients = appointments.filter(a => {
    const patientId = a.patientId || a.patientEmail;
    return appointments.filter(ap => (ap.patientId || ap.patientEmail) === patientId).length > 1;
  });

  // Calculate growth rates
  let monthlyGrowth = 0;
  if (lastMonthAppointments.length > 0) {
    monthlyGrowth = ((thisMonthAppointments.length - lastMonthAppointments.length) / lastMonthAppointments.length * 100);
  } else if (thisMonthAppointments.length > 0) {
    monthlyGrowth = 100;
  }

  const completionRate = appointments.length > 0 
    ? (completedAppointments.length / appointments.length * 100)
    : 0;

  return {
    totals: {
      appointments: appointments.length,
      patients: uniquePatients.size,
      completed: completedAppointments.length,
      pending: pendingAppointments.length,
      confirmed: confirmedAppointments.length,
      cancelled: cancelledAppointments.length
    },
    today: {
      appointments: todayAppointments.length,
      confirmed: todayAppointments.filter(a => a.status === 'confirmed').length,
      pending: todayAppointments.filter(a => a.status === 'pending').length,
      completed: todayAppointments.filter(a => a.status === 'completed').length
    },
    periods: {
      thisWeek: thisWeekAppointments.length,
      thisMonth: thisMonthAppointments.length,
      lastMonth: lastMonthAppointments.length
    },
    rates: {
      completion: Math.round(completionRate),
      monthlyGrowth: Math.round(monthlyGrowth),
      patientReturn: returningPatients.length > 0 ? Math.round((returningPatients.length / uniquePatients.size) * 100) : 0
    },
    insights: {
      busiestDay: getBusiestDay(appointments),
      avgAppointmentsPerDay: getAverageAppointmentsPerDay(appointments),
      peakHours: getPeakHours(appointments)
    }
  };
};

/**
 * Helper function to find busiest day of week
 */
const getBusiestDay = (appointments) => {
  const dayCount = {};
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  for (const a of appointments) {
    const day = new Date(a.appointmentDate).getDay();
    dayCount[day] = (dayCount[day] || 0) + 1;
  }

  const busiestDay = Object.entries(dayCount).reduce((a, b) => 
    dayCount[a[0]] > dayCount[b[0]] ? a : b, [0, 0]
  );

  return {
    day: dayNames[Number.parseInt(busiestDay[0], 10)],
    count: busiestDay[1]
  };
};

/**
 * Helper function to calculate average appointments per day
 */
const getAverageAppointmentsPerDay = (appointments) => {
  if (appointments.length === 0) return 0;
  
  const dates = new Set();
  for (const a of appointments) {
    const date = new Date(a.appointmentDate).toDateString();
    dates.add(date);
  }

  return Math.round(appointments.length / dates.size);
};

/**
 * Helper function to find peak hours
 */
const getPeakHours = (appointments) => {
  const hourCount = {};
  
  for (const a of appointments) {
    if (a.timeSlot) {
      const hour = Number.parseInt(a.timeSlot.split(':')[0], 10);
      hourCount[hour] = (hourCount[hour] || 0) + 1;
    }
  }

  const peakHour = Object.entries(hourCount).reduce((a, b) => 
    hourCount[a[0]] > hourCount[b[0]] ? a : b, [9, 0]
  );

  return {
    hour: `${peakHour[0]}:00`,
    count: peakHour[1]
  };
};

/**
 * Set up real-time listener for appointment updates
 */
export const setupDashboardRealTimeUpdates = (doctorId, callback) => {
  const listenerId = `dashboard_${doctorId}`;
  
  // Clean up existing listener
  if (listeners.has(listenerId)) {
    listeners.get(listenerId)();
  }

  const appointmentsRef = collection(db, 'appointments');
  const q = query(
    appointmentsRef,
    where('doctorId', '==', doctorId),
    orderBy('appointmentDate', 'desc')
  );

  const unsubscribe = onSnapshot(q, 
    (snapshot) => {
      const appointments = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      // Clear cache when real-time update occurs
      dashboardCache.delete(`dashboard_${doctorId}`);
      
      callback(appointments);
    },
    (error) => {
      console.error('Dashboard real-time updates error:', error);
    }
  );

  listeners.set(listenerId, unsubscribe);
  return unsubscribe;
};

/**
 * Clean up real-time listeners
 */
export const cleanupDashboardListeners = (doctorId) => {
  const listenerId = `dashboard_${doctorId}`;
  if (listeners.has(listenerId)) {
    listeners.get(listenerId)();
    listeners.delete(listenerId);
  }
};

/**
 * Clear dashboard cache
 */
export const clearDashboardCache = (doctorId = null) => {
  if (doctorId) {
    dashboardCache.delete(`dashboard_${doctorId}`);
  } else {
    dashboardCache.clear();
  }
};

/**
 * Prefetch dashboard data for better performance
 */
export const prefetchDashboardData = async (doctorId) => {
  try {
    await getDoctorDashboardData(doctorId);
  } catch (error) {
    console.warn('Prefetch failed:', error);
  }
};