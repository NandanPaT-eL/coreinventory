import apiClient from '../api-client';

export const getTransfers = async (params = {}) => {
  try {
    const response = await apiClient.get('/transfers', { params });
    console.log('Transfers response:', response.data);
    
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
    console.error('Error fetching transfers:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch transfers',
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 1 }
    };
  }
};

export const getTransferById = async (id) => {
  try {
    const response = await apiClient.get(`/transfers/${id}`);
    console.log('Transfer by ID response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data
      };
    }
    return {
      success: false,
      message: 'Transfer not found'
    };
  } catch (error) {
    console.error('Error fetching transfer:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch transfer'
    };
  }
};

export const createTransfer = async (data) => {
  try {
    const response = await apiClient.post('/transfers', data);
    console.log('Create transfer response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Transfer created successfully'
      };
    }
    return {
      success: false,
      message: response.data?.message || 'Failed to create transfer'
    };
  } catch (error) {
    console.error('Error creating transfer:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to create transfer'
    };
  }
};

export const updateTransfer = async (id, data) => {
  try {
    const response = await apiClient.put(`/transfers/${id}`, data);
    console.log('Update transfer response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Transfer updated successfully'
      };
    }
    return {
      success: false,
      message: response.data?.message || 'Failed to update transfer'
    };
  } catch (error) {
    console.error('Error updating transfer:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to update transfer'
    };
  }
};

export const validateTransfer = async (id, data = {}) => {
  try {
    const response = await apiClient.post(`/transfers/${id}/validate`, data);
    console.log('Validate transfer response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Transfer validated successfully'
      };
    }
    return {
      success: false,
      message: response.data?.message || 'Failed to validate transfer'
    };
  } catch (error) {
    console.error('Error validating transfer:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to validate transfer'
    };
  }
};

export const cancelTransfer = async (id, reason = '') => {
  try {
    const response = await apiClient.delete(`/transfers/${id}`, {
      data: { reason }
    });
    console.log('Cancel transfer response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        message: response.data.message || 'Transfer canceled successfully'
      };
    }
    return {
      success: false,
      message: response.data?.message || 'Failed to cancel transfer'
    };
  } catch (error) {
    console.error('Error canceling transfer:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to cancel transfer'
    };
  }
};

export default {
  getTransfers,
  getTransferById,
  createTransfer,
  updateTransfer,
  validateTransfer,
  cancelTransfer
};
