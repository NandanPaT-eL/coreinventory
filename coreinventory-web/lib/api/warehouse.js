import apiClient from '../api-client';

export const getWarehouses = async (params = {}) => {
  try {
    const response = await apiClient.get('/warehouses', { params });
    console.log('Warehouses API response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data || [],
        pagination: response.data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          pages: 1
        }
      };
    }
    return {
      success: false,
      message: 'Invalid response format',
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 1 }
    };
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch warehouses',
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 1 }
    };
  }
};

export const getWarehouseById = async (id) => {
  try {
    const response = await apiClient.get(`/warehouses/${id}`);
    console.log('Warehouse by ID response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data
      };
    }
    return {
      success: false,
      message: 'Warehouse not found'
    };
  } catch (error) {
    console.error('Error fetching warehouse:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch warehouse'
    };
  }
};

export const createWarehouse = async (data) => {
  try {
    const response = await apiClient.post('/warehouses', data);
    console.log('Create warehouse response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Warehouse created successfully'
      };
    }
    return {
      success: false,
      message: response.data?.message || 'Failed to create warehouse'
    };
  } catch (error) {
    console.error('Error creating warehouse:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to create warehouse'
    };
  }
};

export const updateWarehouse = async (id, data) => {
  try {
    const response = await apiClient.put(`/warehouses/${id}`, data);
    console.log('Update warehouse response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Warehouse updated successfully'
      };
    }
    return {
      success: false,
      message: response.data?.message || 'Failed to update warehouse'
    };
  } catch (error) {
    console.error('Error updating warehouse:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to update warehouse'
    };
  }
};

export const deactivateWarehouse = async (id) => {
  try {
    const response = await apiClient.delete(`/warehouses/${id}`);
    console.log('Deactivate warehouse response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        message: response.data.message || 'Warehouse deactivated successfully'
      };
    }
    return {
      success: false,
      message: response.data?.message || 'Failed to deactivate warehouse'
    };
  } catch (error) {
    console.error('Error deactivating warehouse:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to deactivate warehouse'
    };
  }
};

export const activateWarehouse = async (id) => {
  try {
    const response = await apiClient.patch(`/warehouses/${id}/activate`);
    console.log('Activate warehouse response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        message: response.data.message || 'Warehouse activated successfully'
      };
    }
    return {
      success: false,
      message: response.data?.message || 'Failed to activate warehouse'
    };
  } catch (error) {
    console.error('Error activating warehouse:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to activate warehouse'
    };
  }
};

export default {
  getWarehouses,
  getWarehouseById,
  createWarehouse,
  updateWarehouse,
  deactivateWarehouse,
  activateWarehouse
};
