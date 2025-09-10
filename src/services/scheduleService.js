import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

// Default schedule configuration
const defaultScheduleConfig = {
  availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
  timeSlots: {
    startTime: '09:00',
    endTime: '12:00',
    slotDuration: 60, // in minutes
    breakDuration: 0, // in minutes between slots
    customBreaks: [] // { start: '10:30', end: '10:45', label: 'Tea Break' }
  },
  unavailableDates: [], // ['2024-12-25', '2024-01-01']
  workingHours: {
    monday: { start: '09:00', end: '12:00', enabled: true },
    tuesday: { start: '09:00', end: '12:00', enabled: true },
    wednesday: { start: '09:00', end: '12:00', enabled: true },
    thursday: { start: '09:00', end: '12:00', enabled: true },
    friday: { start: '09:00', end: '12:00', enabled: true },
    saturday: { start: '09:00', end: '12:00', enabled: true },
    sunday: { start: '09:00', end: '12:00', enabled: false }
  }
};

export const getDoctorSchedule = async (doctorId) => {
  try {
    const doctorRef = doc(db, 'doctors', doctorId);
    const doctorSnap = await getDoc(doctorRef);
    
    if (doctorSnap.exists()) {
      const doctorData = doctorSnap.data();
      if (doctorData.scheduleConfig) {
        return { ...defaultScheduleConfig, ...doctorData.scheduleConfig };
      }
    }

    return defaultScheduleConfig;
  } catch (error) {
    console.error('Error fetching doctor schedule:', error);
    return defaultScheduleConfig;
  }
};

export const saveDoctorSchedule = async (doctorId, scheduleConfig) => {
  try {
    const doctorRef = doc(db, 'doctors', doctorId);
    await updateDoc(doctorRef, {
      scheduleConfig: scheduleConfig
    });
    console.log('Schedule config saved for doctor', doctorId);
  } catch (error) {
    console.error('Error saving doctor schedule:', error);
    throw new Error('Could not save schedule configuration.');
  }
};

// Generate time slots based on configuration
export const generateTimeSlots = (scheduleConfig, selectedDate) => {
  const dayName = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const dayConfig = scheduleConfig.workingHours[dayName];
  
  if (!dayConfig || !dayConfig.enabled) {
    return [];
  }

  const slots = [];
  const [startHour, startMinute] = dayConfig.start.split(':').map(Number);
  const [endHour, endMinute] = dayConfig.end.split(':').map(Number);
  
  const startTime = startHour * 60 + startMinute; // Convert to minutes
  const endTime = endHour * 60 + endMinute;
  const duration = scheduleConfig.timeSlots.slotDuration;
  const breakDuration = scheduleConfig.timeSlots.breakDuration;

  for (let time = startTime; time + duration <= endTime; time += duration + breakDuration) {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    
    // Check if this time conflicts with custom breaks
    const isBreakTime = scheduleConfig.timeSlots.customBreaks?.some(breakTime => {
      const [breakStartHour, breakStartMinute] = breakTime.start.split(':').map(Number);
      const [breakEndHour, breakEndMinute] = breakTime.end.split(':').map(Number);
      const breakStart = breakStartHour * 60 + breakStartMinute;
      const breakEnd = breakEndHour * 60 + breakEndMinute;
      
      return time >= breakStart && time < breakEnd;
    });

    if (!isBreakTime) {
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      const displayTime = formatTime12Hour(timeString);
      slots.push({
        value: displayTime,
        label: displayTime,
        time: timeString
      });
    }
  }

  return slots;
};

// Get available dates based on doctor's configuration
export const getAvailableDates = (scheduleConfig, numberOfDays = 30) => {
  const dates = [];
  const today = new Date();
  
  for (let i = 1; i <= numberOfDays; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const dateString = date.toISOString().split('T')[0];
    
    // Check if day is enabled and not in unavailable dates
    const isDayEnabled = scheduleConfig.workingHours[dayName]?.enabled;
    const isDateUnavailable = scheduleConfig.unavailableDates?.some(holiday => {
      // Handle both old format (string) and new format (object with date property)
      const holidayDate = typeof holiday === 'string' ? holiday : holiday.date;
      return holidayDate === dateString;
    });
    
    if (isDayEnabled && !isDateUnavailable) {
      dates.push({
        value: dateString,
        label: date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        date: date
      });
    }
  }
  
  return dates;
};

// Helper function to format time to 12-hour format
const formatTime12Hour = (time24) => {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};
