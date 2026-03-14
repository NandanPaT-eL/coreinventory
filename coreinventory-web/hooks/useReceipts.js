import { useState, useCallback } from 'react';
import { 
  getReceipts, 
  getReceiptById, 
  createReceipt, 
  updateReceipt, 
  validateReceipt, 
  cancelReceipt 
} from '../lib/api/receipt';

export function useReceipts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [receipts, setReceipts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  const fetchReceipts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getReceipts(params);
      
      if (response.success) {
        setReceipts(response.data);
        setPagination(response.pagination);
        return {
          data: response.data,
          pagination: response.pagination
        };
      } else {
        setError(response.message || 'Failed to fetch receipts');
        return { data: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } };
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch receipts');
      return { data: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReceiptById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getReceiptById(id);
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch receipt');
        return null;
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch receipt');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewReceipt = useCallback(async (receiptData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createReceipt(receiptData);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Failed to create receipt');
        return { success: false, error: response.message };
      }
    } catch (err) {
      setError(err.message || 'Failed to create receipt');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateExistingReceipt = useCallback(async (id, receiptData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateReceipt(id, receiptData);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Failed to update receipt');
        return { success: false, error: response.message };
      }
    } catch (err) {
      setError(err.message || 'Failed to update receipt');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const validateExistingReceipt = useCallback(async (id, items = []) => {
    setLoading(true);
    setError(null);
    try {
      const response = await validateReceipt(id, { items });
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Failed to validate receipt');
        return { success: false, error: response.message };
      }
    } catch (err) {
      setError(err.message || 'Failed to validate receipt');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelExistingReceipt = useCallback(async (id, reason = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await cancelReceipt(id, reason);
      if (response.success) {
        return { success: true };
      } else {
        setError(response.message || 'Failed to cancel receipt');
        return { success: false, error: response.message };
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel receipt');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    receipts,
    loading,
    error,
    pagination,
    fetchReceipts,
    fetchReceiptById,
    createNewReceipt,
    updateExistingReceipt,
    validateExistingReceipt,
    cancelExistingReceipt
  };
}

export default useReceipts;
