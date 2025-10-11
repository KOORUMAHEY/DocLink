import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit, Timestamp, where } from 'firebase/firestore';

/**
 * Get recent activities across the system
 * @param {number} limit Number of activities to fetch
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
      timestamp: doc.data().timestamp?.toDate()
    }));
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return [];
  }
};

/**
 * Get system logs
 * @param {number} limit Number of logs to fetch
 * @returns {Promise<Array>} System logs
 */
export const getSystemLogs = async (limitCount = 20) => {
  try {
    const logsRef = collection(db, 'systemLogs');
    const q = query(
      logsRef,
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }));
  } catch (error) {
    console.error('Error fetching system logs:', error);
    return [];
  }
};

/**
 * Get upcoming appointments
 * @param {number} limit Number of appointments to fetch
 * @returns {Promise<Array>} Upcoming appointments
 */
export const getAppointmentTrends = async (period = 'daily', days = 7) => {
  try {
    const appointmentsRef = collection(db, 'appointments');
    const now = new Date();
    const queryStartDate = new Date();
    queryStartDate.setDate(now.getDate() - days);
    
    const q = query(
      appointmentsRef,
      where('date', '>=', Timestamp.fromDate(queryStartDate)),
      where('date', '<=', Timestamp.fromDate(now)),
      orderBy('date', 'asc')
    );

    const snapshot = await getDocs(q);
    const appointments = snapshot.docs.map(doc => ({
      ...doc.data(),
      date: doc.data().date?.toDate()
    }));

    // Create date buckets for the entire range
    const dateBuckets = new Map();
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    // Initialize buckets based on period
    let current = new Date(startDate);
    while (current <= endDate) {
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

    // Convert Map to array format for chart
    const chartData = Array.from(dateBuckets.entries()).map(([date, count]) => ({
      date,
      appointments: count
    }));

    // Sort by date
    chartData.sort((a, b) => {
      const dateA = new Date(a.date.replace('Week of ', ''));
      const dateB = new Date(b.date.replace('Week of ', ''));
      return dateA - dateB;
    });

    return chartData;
  } catch (error) {
    console.error('Error fetching appointment trends:', error);
    return [];
  }
};

export const getUpcomingAppointments = async (limitCount = 5) => {
  try {
    const appointmentsRef = collection(db, 'appointments');
    const now = Timestamp.now();
    
    const q = query(
      appointmentsRef,
      where('date', '>=', now),
      orderBy('date', 'asc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate()
    }));
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    return [];
  }
};