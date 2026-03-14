import apiClient from '../api-client';

export const getDeliveries = async (params = {}) => {
  try {
    const response = await apiClient.get('/deliveries', { params });
    console.log('Deliveries response:', response.data);
    
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
    console.error('Error fetching deliveries:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch deliveries',
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 1 }
    };
  }
};

export const getDeliveryById = async (id) => {
  try {
    const response = await apiClient.get(`/deliveries/${id}`);
    console.log('Delivery by ID response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data
      };
    }
    return {
      success: false,
      message: 'Delivery not found'
    };
  } catch (error) {
    console.error('Error fetching delivery:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch delivery'
    };
  }
};

export const createDelivery = async (data) => {
  try {
    const response = await apiClient.post('/deliveries', data);
    console.log('Create delivery response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Delivery created successfully'
      };
    }
    return {
      success: false,
      message: response.data?.message || 'Failed to create delivery'
    };
  } catch (error) {
    console.error('Error creating delivery:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to create delivery'
    };
  }
};

export const updateDelivery = async (id, data) => {
  try {
    const response = await apiClient.put(`/deliveries/${id}`, data);
    console.log('Update delivery response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Delivery updated successfully'
      };
    }
    return {
      success: false,
      message: response.data?.message || 'Failed to update delivery'
    };
  } catch (error) {
    console.error('Error updating delivery:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to update delivery'
    };
  }
};

export const validateDelivery = async (id, data = {}) => {
  try {
    const response = await apiClient.post(`/deliveries/${id}/validate`, data);
    console.log('Validate delivery response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Delivery validated successfully'
      };
    }
    return {
      success: false,
      message: response.data?.message || 'Failed to validate delivery'
    };
  } catch (error) {
    console.error('Error validating delivery:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to validate delivery'
    };
  }
};

export const cancelDelivery = async (id, reason = '') => {
  try {
    const response = await apiClient.delete(`/deliveries/${id}`, {
      data: { reason }
    });
    console.log('Cancel delivery response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        message: response.data.message || 'Delivery canceled successfully'
      };
    }
    return {
      success: false,
      message: response.data?.message || 'Failed to cancel delivery'
    };
  } catch (error) {
    console.error('Error canceling delivery:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to cancel delivery'
    };
  }
};

export default {
  getDeliveries,
  getDeliveryById,
  createDelivery,
  updateDelivery,
  validateDelivery,
  cancelDelivery
};
