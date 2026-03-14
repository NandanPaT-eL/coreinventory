import { useState, useCallback } from 'react';
import { 
  getTransfers, 
  getTransferById, 
  createTransfer, 
  updateTransfer, 
  validateTransfer, 
  cancelTransfer 
} from '../lib/api/transfer';

export function useTransfers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transfers, setTransfers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  const fetchTransfers = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTransfers(params);
      
      if (response.success) {
        setTransfers(response.data);
        setPagination(response.pagination);
        return {
          data: response.data,
          pagination: response.pagination
        };
      } else {
        setError(response.message || 'Failed to fetch transfers');
        return { data: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } };
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch transfers');
      return { data: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTransferById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTransferById(id);
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch transfer');
        return null;
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch transfer');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewTransfer = useCallback(async (transferData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createTransfer(transferData);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Failed to create transfer');
        return { success: false, error: response.message };
      }
    } catch (err) {
      setError(err.message || 'Failed to create transfer');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateExistingTransfer = useCallback(async (id, transferData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateTransfer(id, transferData);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Failed to update transfer');
        return { success: false, error: response.message };
      }
    } catch (err) {
      setError(err.message || 'Failed to update transfer');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const validateExistingTransfer = useCallback(async (id, items = []) => {
    setLoading(true);
    setError(null);
    try {
      const response = await validateTransfer(id, { items });
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Failed to validate transfer');
        return { success: false, error: response.message };
      }
    } catch (err) {
      setError(err.message || 'Failed to validate transfer');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelExistingTransfer = useCallback(async (id, reason = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await cancelTransfer(id, reason);
      if (response.success) {
        return { success: true };
      } else {
        setError(response.message || 'Failed to cancel transfer');
        return { success: false, error: response.message };
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel transfer');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    transfers,
    loading,
    error,
    pagination,
    fetchTransfers,
    fetchTransferById,
    createNewTransfer,
    updateExistingTransfer,
    validateExistingTransfer,
    cancelExistingTransfer
  };
}

export default useTransfers;
