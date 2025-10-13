import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';

/**
 * Get comprehensive dashboard statistics for admin overview
 * @returns {Promise<Object>} Dashboard statistics
 */
export const getDashboardStats = async () => {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const appointmentsRef = collection(db, 'appointments');
    const doctorsRef = collection(db, 'doctors');
    const patientsRef = collection(db, 'patients');

    // Parallel queries for better performance
    const [appointmentsSnap, doctorsSnap, patientsSnap, newPatientsSnap] = await Promise.all([
      getDocs(query(appointmentsRef)),
      getDocs(query(doctorsRef)),
      getDocs(query(patientsRef)),
      getDocs(query(
        patientsRef,
        where('createdAt', '>=', Timestamp.fromDate(firstDayOfMonth)),
        where('createdAt', '<=', Timestamp.fromDate(lastDayOfMonth))
      )).catch(() => ({ docs: [] })) // Fallback for indexing issues
    ]);

    const appointments = appointmentsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date
    }));
    const doctors = doctorsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const patients = patientsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Calculate appointment statistics
    const totalAppointments = appointments.length;
    const scheduledAppointments = appointments.filter(a => a.status === 'scheduled').length;
    const completedAppointments = appointments.filter(a => a.status === 'completed').length;
    const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length;

    // Calculate doctor statistics
    const activeDoctors = doctors.filter(d => d.isActive !== false).length;
    const totalDoctors = doctors.length;
    const inactiveDoctors = totalDoctors - activeDoctors;

    // Calculate patient statistics
    const totalPatients = patients.length;
    const newPatientsThisMonth = newPatientsSnap.docs.length;

    // Calculate clinic occupancy rate
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const todayAppointments = appointments.filter(a => {
      if (!a.date) return false;
      const appointmentDate = a.date instanceof Timestamp ? a.date.toDate() : new Date(a.date);
      return appointmentDate >= todayStart && appointmentDate < todayEnd;
    });

    // Assuming 8 working hours with 30-minute slots (16 slots per doctor)
    const maxDailySlots = 16 * activeDoctors;
    const occupancyRate = maxDailySlots > 0 
      ? Math.round((todayAppointments.length / maxDailySlots) * 100) 
      : 0;

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
    
    // Return fallback data structure
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
 * Get recent activities across the system
 * @param {number} limitCount - Number of activities to fetch
 * @returns {Promise<Array>} Recent activities
 */
export const getRecentActivities = async (limitCount = 10) => {
  try {
    const activitiesRef = collection(db, 'activities');
    const q = query(
      activitiesRef,
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || new Date(doc.data().timestamp)
    }));
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return [];
  }
};

/**
 * Get system logs for monitoring
 * @param {Object} options - Query options (limit, type)
 * @returns {Promise<Array>} System logs
 */
export const getSystemLogs = async (options = {}) => {
  try {
    const logsRef = collection(db, 'systemLogs');
    let q = query(logsRef, orderBy('timestamp', 'desc'));

    if (options.limit) {
      q = query(q, limit(options.limit));
    }

    if (options.type) {
      q = query(q, where('type', '==', options.type));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || new Date(doc.data().timestamp)
    }));
  } catch (error) {
    console.error('Error fetching system logs:', error);
    return [];
  }
};

/**
 * Get upcoming appointments for dashboard widget
 * @param {number} limitCount - Number of appointments to fetch
 * @returns {Promise<Array>} Upcoming appointments
 */
export const getUpcomingAppointments = async (limitCount = 5) => {
  try {
    const appointmentsRef = collection(db, 'appointments');
    const now = Timestamp.now();
    
    const q = query(
      appointmentsRef,
      where('date', '>=', now),
      where('status', '==', 'scheduled'),
      orderBy('date', 'asc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate?.() || new Date(doc.data().date)
    }));
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    
    // Fallback: query without compound index
    try {
      const allAppointments = await getDocs(collection(db, 'appointments'));
      const now = new Date();
      
      return allAppointments.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate?.() || new Date(doc.data().date)
        }))
        .filter(apt => apt.date > now && apt.status === 'scheduled')
        .sort((a, b) => a.date - b.date)
        .slice(0, limitCount);
    } catch (fallbackError) {
      console.error('Fallback query also failed:', fallbackError);
      return [];
    }
  }
};

/**
 * Get appointment trends for analytics
 * @param {string} period - Time period ('daily', 'weekly', 'monthly')
 * @param {number} days - Number of days to analyze
 * @returns {Promise<Array>} Trend data for charts
 */
export const getAppointmentTrends = async (period = 'daily', days = 7) => {
  try {
    const appointmentsRef = collection(db, 'appointments');
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - days);
    
    const q = query(
      appointmentsRef,
      where('date', '>=', Timestamp.fromDate(startDate)),
      where('date', '<=', Timestamp.fromDate(now)),
      orderBy('date', 'asc')
    );

    const snapshot = await getDocs(q);
    const appointments = snapshot.docs.map(doc => ({
      ...doc.data(),
      date: doc.data().date?.toDate?.() || new Date(doc.data().date)
    }));

    // Initialize date buckets
    const dateBuckets = new Map();
    let current = new Date(startDate);
    
    while (current <= now) {
      let key;
      if (period === 'daily') {
        key = current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (period === 'weekly') {
        const weekStart = new Date(current);
        weekStart.setDate(current.getDate() - current.getDay());
        key = `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      } else if (period === 'monthly') {
        key = current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }
      
      dateBuckets.set(key, 0);
      
      // Increment by period
      if (period === 'daily') {
        current.setDate(current.getDate() + 1);
      } else if (period === 'weekly') {
        current.setDate(current.getDate() + 7);
      } else {
        current.setMonth(current.getMonth() + 1);
      }
    }

    // Count appointments in each bucket
    appointments.forEach(appointment => {
      const date = appointment.date;
      if (!date) return;

      let key;
      if (period === 'daily') {
        key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (period === 'weekly') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      } else if (period === 'monthly') {
        key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }

      if (dateBuckets.has(key)) {
        dateBuckets.set(key, dateBuckets.get(key) + 1);
      }
    });

    // Convert to chart data format
    const chartData = Array.from(dateBuckets.entries()).map(([date, count]) => ({
      date,
      appointments: count
    }));

    return chartData;
  } catch (error) {
    console.error('Error fetching appointment trends:', error);
    return [];
  }
};
