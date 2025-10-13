/**
 * Custom React Hook for Doctor Details
 * @module features/doctors/hooks/useDoctorDetails
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDoctorById } from '@/features/doctors/services/doctorService';

/**
 * Hook for managing individual doctor details
 * @param {string} doctorId - Doctor ID
 * @param {Object} options - Hook options
 * @returns {Object} Doctor state and methods
 */
export function useDoctorDetails(doctorId, options = {}) {
  const { autoLoad = true } = options;

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load doctor details
   */
  const loadDoctor = useCallback(async () => {
    if (!doctorId) {
      setError('Doctor ID is required');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await getDoctorById(doctorId);
      setDoctor(data);
    } catch (err) {
      setError(err.message || 'Failed to load doctor');
      console.error('Error loading doctor:', err);
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  /**
   * Refresh doctor details
   */
  const refresh = useCallback(() => {
    loadDoctor();
  }, [loadDoctor]);

  /**
   * Load doctor on mount or when ID changes
   */
  useEffect(() => {
    if (autoLoad && doctorId) {
      loadDoctor();
    }
  }, [autoLoad, doctorId, loadDoctor]);

  return {
    doctor,
    loading,
    error,
    loadDoctor,
    refresh,
    isLoaded: doctor !== null,
  };
}
