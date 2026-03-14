import { useState, useCallback } from 'react';
import { 
  getAdjustments, 
  getAdjustmentById, 
  createAdjustment, 
  updateAdjustment, 
  validateAdjustment, 
  cancelAdjustment 
} from '../lib/api/adjustment';

export function useAdjustments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [adjustments, setAdjustments] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  const fetchAdjustments = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAdjustments(params);
      
      if (response.success) {
        setAdjustments(response.data);
        setPagination(response.pagination);
        return {
          data: response.data,
          pagination: response.pagination
        };
      } else {
        setError(response.message || 'Failed to fetch adjustments');
        return { data: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } };
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch adjustments');
      return { data: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAdjustmentById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAdjustmentById(id);
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch adjustment');
        return null;
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch adjustment');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewAdjustment = useCallback(async (adjustmentData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createAdjustment(adjustmentData);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Failed to create adjustment');
        return { success: false, error: response.message };
      }
    } catch (err) {
      setError(err.message || 'Failed to create adjustment');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateExistingAdjustment = useCallback(async (id, adjustmentData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateAdjustment(id, adjustmentData);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Failed to update adjustment');
        return { success: false, error: response.message };
      }
    } catch (err) {
      setError(err.message || 'Failed to update adjustment');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const validateExistingAdjustment = useCallback(async (id, items = []) => {
    setLoading(true);
    setError(null);
    try {
      const response = await validateAdjustment(id, { items });
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Failed to apply adjustment');
        return { success: false, error: response.message };
      }
    } catch (err) {
      setError(err.message || 'Failed to apply adjustment');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelExistingAdjustment = useCallback(async (id, reason = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await cancelAdjustment(id, reason);
      if (response.success) {
        return { success: true };
      } else {
        setError(response.message || 'Failed to cancel adjustment');
        return { success: false, error: response.message };
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel adjustment');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    adjustments,
    loading,
    error,
    pagination,
    fetchAdjustments,
    fetchAdjustmentById,
    createNewAdjustment,
    updateExistingAdjustment,
    validateExistingAdjustment,
    cancelExistingAdjustment
  };
}

export default useAdjustments;
