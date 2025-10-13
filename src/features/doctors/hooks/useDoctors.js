/**
 * Custom React Hook for Doctors
 * @module features/doctors/hooks/useDoctors
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDoctors } from '@/features/doctors/services/doctorService';
import { 
  searchDoctors, 
  sortDoctors, 
  filterDoctorsBySpecialization,
  filterDoctorsByStatus 
} from '@/features/doctors/utils/doctorHelpers';

/**
 * Hook for managing doctors list with search, filter, and sort
 * @param {Object} options - Hook options
 * @returns {Object} Doctors state and methods
 */
export function useDoctors(options = {}) {
  const {
    initialSearchTerm = '',
    initialSpecialization = 'all',
    initialStatus = 'all',
    initialSortBy = 'name-asc',
    autoLoad = true,
  } = options;

  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [specialization, setSpecialization] = useState(initialSpecialization);
  const [status, setStatus] = useState(initialStatus);
  const [sortBy, setSortBy] = useState(initialSortBy);

  /**
   * Load doctors from service
   */
  const loadDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getDoctors();
      setDoctors(data);
    } catch (err) {
      setError(err.message || 'Failed to load doctors');
      console.error('Error loading doctors:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh doctors list
   */
  const refresh = useCallback(() => {
    loadDoctors();
  }, [loadDoctors]);

  /**
   * Apply filters and sorting
   */
  useEffect(() => {
    let result = [...doctors];
    
    // Apply search
    if (searchTerm) {
      result = searchDoctors(result, searchTerm);
    }
    
    // Apply specialization filter
    if (specialization && specialization !== 'all') {
      result = filterDoctorsBySpecialization(result, specialization);
    }
    
    // Apply status filter
    if (status && status !== 'all') {
      result = filterDoctorsByStatus(result, status);
    }
    
    // Apply sorting
    if (sortBy) {
      result = sortDoctors(result, sortBy);
    }
    
    setFilteredDoctors(result);
  }, [doctors, searchTerm, specialization, status, sortBy]);

  /**
   * Load doctors on mount
   */
  useEffect(() => {
    if (autoLoad) {
      loadDoctors();
    }
  }, [autoLoad, loadDoctors]);

  /**
   * Reset all filters
   */
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSpecialization('all');
    setStatus('all');
    setSortBy('name-asc');
  }, []);

  return {
    // Data
    doctors: filteredDoctors,
    allDoctors: doctors,
    
    // Loading states
    loading,
    error,
    
    // Filter states
    searchTerm,
    specialization,
    status,
    sortBy,
    
    // Filter setters
    setSearchTerm,
    setSpecialization,
    setStatus,
    setSortBy,
    
    // Actions
    loadDoctors,
    refresh,
    resetFilters,
    
    // Computed
    isEmpty: filteredDoctors.length === 0,
    count: filteredDoctors.length,
    totalCount: doctors.length,
  };
}
