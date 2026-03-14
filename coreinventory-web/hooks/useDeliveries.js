import { useState, useCallback } from 'react';
import { 
  getDeliveries, 
  getDeliveryById, 
  createDelivery, 
  updateDelivery, 
  validateDelivery, 
  cancelDelivery 
} from '../lib/api/delivery';

export function useDeliveries() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  const fetchDeliveries = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDeliveries(params);
      
      if (response.success) {
        setDeliveries(response.data);
        setPagination(response.pagination);
        return {
          data: response.data,
          pagination: response.pagination
        };
      } else {
        setError(response.message || 'Failed to fetch deliveries');
        return { data: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } };
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch deliveries');
      return { data: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDeliveryById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDeliveryById(id);
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch delivery');
        return null;
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch delivery');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewDelivery = useCallback(async (deliveryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createDelivery(deliveryData);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Failed to create delivery');
        return { success: false, error: response.message };
      }
    } catch (err) {
      setError(err.message || 'Failed to create delivery');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateExistingDelivery = useCallback(async (id, deliveryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateDelivery(id, deliveryData);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Failed to update delivery');
        return { success: false, error: response.message };
      }
    } catch (err) {
      setError(err.message || 'Failed to update delivery');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const validateExistingDelivery = useCallback(async (id, items = []) => {
    setLoading(true);
    setError(null);
    try {
      const response = await validateDelivery(id, { items });
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Failed to validate delivery');
        return { success: false, error: response.message };
      }
    } catch (err) {
      setError(err.message || 'Failed to validate delivery');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelExistingDelivery = useCallback(async (id, reason = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await cancelDelivery(id, reason);
      if (response.success) {
        return { success: true };
      } else {
        setError(response.message || 'Failed to cancel delivery');
        return { success: false, error: response.message };
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel delivery');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    deliveries,
    loading,
    error,
    pagination,
    fetchDeliveries,
    fetchDeliveryById,
    createNewDelivery,
    updateExistingDelivery,
    validateExistingDelivery,
    cancelExistingDelivery
  };
}

export default useDeliveries;
