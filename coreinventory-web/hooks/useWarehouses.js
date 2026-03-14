import { useState, useCallback } from 'react';
import { 
  getWarehouses, 
  getWarehouseById, 
  createWarehouse, 
  updateWarehouse, 
  deactivateWarehouse, 
  activateWarehouse 
} from '../lib/api/warehouse';
import useWarehouseStore from '../store/warehouseStore';

export function useWarehouses() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { warehouses, setWarehouses, addWarehouse, updateWarehouse: updateStoreWarehouse } = useWarehouseStore();

  const fetchWarehouses = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getWarehouses(params);
      
      if (response.success) {
        setWarehouses(response.data);
        return {
          data: response.data,
          pagination: response.pagination
        };
      } else {
        setError(response.message || 'Failed to fetch warehouses');
        return { data: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } };
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch warehouses');
      return { data: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } };
    } finally {
      setLoading(false);
    }
  }, [setWarehouses]);

  const fetchWarehouseById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getWarehouseById(id);
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch warehouse');
        return null;
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch warehouse');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewWarehouse = useCallback(async (warehouseData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createWarehouse(warehouseData);
      if (response.success) {
        addWarehouse(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Failed to create warehouse');
        return { success: false, error: response.message };
      }
    } catch (err) {
      setError(err.message || 'Failed to create warehouse');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [addWarehouse]);

  const updateExistingWarehouse = useCallback(async (id, warehouseData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateWarehouse(id, warehouseData);
      if (response.success) {
        updateStoreWarehouse(id, response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Failed to update warehouse');
        return { success: false, error: response.message };
      }
    } catch (err) {
      setError(err.message || 'Failed to update warehouse');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [updateStoreWarehouse]);

  const deactivateExistingWarehouse = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deactivateWarehouse(id);
      if (response.success) {
        updateStoreWarehouse(id, { isActive: false });
        return { success: true };
      } else {
        setError(response.message || 'Failed to deactivate warehouse');
        return { success: false, error: response.message };
      }
    } catch (err) {
      setError(err.message || 'Failed to deactivate warehouse');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [updateStoreWarehouse]);

  const activateExistingWarehouse = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await activateWarehouse(id);
      if (response.success) {
        updateStoreWarehouse(id, { isActive: true });
        return { success: true };
      } else {
        setError(response.message || 'Failed to activate warehouse');
        return { success: false, error: response.message };
      }
    } catch (err) {
      setError(err.message || 'Failed to activate warehouse');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [updateStoreWarehouse]);

  return {
    warehouses: warehouses || [],
    loading,
    error,
    fetchWarehouses,
    fetchWarehouseById,
    createNewWarehouse,
    updateExistingWarehouse,
    deactivateExistingWarehouse,
    activateExistingWarehouse
  };
}

export default useWarehouses;
