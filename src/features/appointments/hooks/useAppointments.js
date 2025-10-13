/**
 * Custom hook for managing appointments
 * Provides CRUD operations and state management for appointments
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAppointments } from '../services/appointmentService';

/**
 * @param {Object} options
 * @param {string} [options.searchQuery] - Search query for filtering
 * @param {string} [options.doctorId] - Filter by doctor ID
 * @param {string} [options.patientId] - Filter by patient ID
 * @param {boolean} [options.autoFetch=true] - Auto-fetch on mount
 */
export function useAppointments(options = {}) {
  const { searchQuery, doctorId, patientId, autoFetch = true } = options;
  
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const filters = {
        searchQuery,
        doctorId,
        patientId,
      };
      
      const data = await getAppointments(filters);
      setAppointments(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, doctorId, patientId]);

  useEffect(() => {
    if (autoFetch) {
      fetchAppointments();
    }
  }, [autoFetch, fetchAppointments]);

  const refresh = useCallback(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    appointments,
    loading,
    error,
    refresh,
    fetchAppointments,
  };
}
