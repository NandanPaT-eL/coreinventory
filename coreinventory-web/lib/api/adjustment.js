import apiClient from '../api-client';

export const getAdjustments = async (params = {}) => {
  try {
    const response = await apiClient.get('/adjustments', { params });
    console.log('Adjustments response:', response.data);
    
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
    console.error('Error fetching adjustments:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch adjustments',
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 1 }
    };
  }
};

export const getAdjustmentById = async (id) => {
  try {
    const response = await apiClient.get(`/adjustments/${id}`);
    console.log('Adjustment by ID response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data
      };
    }
    return {
      success: false,
      message: 'Adjustment not found'
    };
  } catch (error) {
    console.error('Error fetching adjustment:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch adjustment'
    };
  }
};

export const createAdjustment = async (data) => {
  try {
    const response = await apiClient.post('/adjustments', data);
    console.log('Create adjustment response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Adjustment created successfully'
      };
    }
    return {
      success: false,
      message: response.data?.message || 'Failed to create adjustment'
    };
  } catch (error) {
    console.error('Error creating adjustment:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to create adjustment'
    };
  }
};

export const updateAdjustment = async (id, data) => {
  try {
    const response = await apiClient.put(`/adjustments/${id}`, data);
    console.log('Update adjustment response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Adjustment updated successfully'
      };
    }
    return {
      success: false,
      message: response.data?.message || 'Failed to update adjustment'
    };
  } catch (error) {
    console.error('Error updating adjustment:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to update adjustment'
    };
  }
};

export const validateAdjustment = async (id, data = {}) => {
  try {
    const response = await apiClient.post(`/adjustments/${id}/validate`, data);
    console.log('Validate adjustment response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Adjustment applied successfully'
      };
    }
    return {
      success: false,
      message: response.data?.message || 'Failed to apply adjustment'
    };
  } catch (error) {
    console.error('Error validating adjustment:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to apply adjustment'
    };
  }
};

export const cancelAdjustment = async (id, reason = '') => {
  try {
    const response = await apiClient.delete(`/adjustments/${id}`, {
      data: { reason }
    });
    console.log('Cancel adjustment response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        message: response.data.message || 'Adjustment canceled successfully'
      };
    }
    return {
      success: false,
      message: response.data?.message || 'Failed to cancel adjustment'
    };
  } catch (error) {
    console.error('Error canceling adjustment:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to cancel adjustment'
    };
  }
};

export default {
  getAdjustments,
  getAdjustmentById,
  createAdjustment,
  updateAdjustment,
  validateAdjustment,
  cancelAdjustment
};
