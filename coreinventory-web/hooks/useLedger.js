import { useState, useCallback } from 'react';
import { 
  getLedgerEntries, 
  getProductLedger, 
  getStockValuation, 
  getDailySummary 
} from '../lib/api/ledger';

export function useLedger() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [entries, setEntries] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });

  const fetchLedgerEntries = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getLedgerEntries(params);
      
      if (response.success) {
        setEntries(response.data);
        setPagination(response.pagination);
        return {
          data: response.data,
          pagination: response.pagination
        };
      } else {
        setError(response.message || 'Failed to fetch ledger entries');
        return { data: [], pagination: { page: 1, limit: 20, total: 0, pages: 1 } };
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch ledger entries');
      return { data: [], pagination: { page: 1, limit: 20, total: 0, pages: 1 } };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductLedger = useCallback(async (productId, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProductLedger(productId, params);
      
      if (response.success) {
        return {
          data: response.data,
          pagination: response.pagination
        };
      } else {
        setError(response.message || 'Failed to fetch product ledger');
        return { data: [], pagination: { page: 1, limit: 20, total: 0, pages: 1 } };
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch product ledger');
      return { data: [], pagination: { page: 1, limit: 20, total: 0, pages: 1 } };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStockValuation = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getStockValuation(params);
      
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch stock valuation');
        return [];
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch stock valuation');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDailySummary = useCallback(async (date) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDailySummary(date);
      
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch daily summary');
        return [];
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch daily summary');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    entries,
    loading,
    error,
    pagination,
    fetchLedgerEntries,
    fetchProductLedger,
    fetchStockValuation,
    fetchDailySummary
  };
}

export default useLedger;
