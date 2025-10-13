/**
 * Custom React Hook for Patients
 * @module features/patients/hooks/usePatients
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getUniquePatients } from '@/features/patients/services/patientService';
import { searchPatients, sortPatients, filterPatientsByGender } from '@/features/patients/utils/patientHelpers';

export function usePatients(options = {}) {
  const {
    initialSearchTerm = '',
    initialGender = 'all',
    initialSortBy = 'name-asc',
    autoLoad = true,
  } = options;

  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [gender, setGender] = useState(initialGender);
  const [sortBy, setSortBy] = useState(initialSortBy);

  const loadPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getUniquePatients();
      setPatients(data);
    } catch (err) {
      setError(err.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    loadPatients();
  }, [loadPatients]);

  useEffect(() => {
    let result = [...patients];
    
    if (searchTerm) {
      result = searchPatients(result, searchTerm);
    }
    
    if (gender && gender !== 'all') {
      result = filterPatientsByGender(result, gender);
    }
    
    if (sortBy) {
      result = sortPatients(result, sortBy);
    }
    
    setFilteredPatients(result);
  }, [patients, searchTerm, gender, sortBy]);

  useEffect(() => {
    if (autoLoad) {
      loadPatients();
    }
  }, [autoLoad, loadPatients]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setGender('all');
    setSortBy('name-asc');
  }, []);

  return {
    patients: filteredPatients,
    allPatients: patients,
    loading,
    error,
    searchTerm,
    gender,
    sortBy,
    setSearchTerm,
    setGender,
    setSortBy,
    loadPatients,
    refresh,
    resetFilters,
    isEmpty: filteredPatients.length === 0,
    count: filteredPatients.length,
    totalCount: patients.length,
  };
}
