import apiClient from '../api-client';

export const getReceipts = async (params = {}) => {
  try {
    const response = await apiClient.get('/receipts', { params });
    console.log('Receipts response:', response.data);
    
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
    console.error('Error fetching receipts:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch receipts',
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 1 }
    };
  }
};

export const getReceiptById = async (id) => {
  try {
    const response = await apiClient.get(`/receipts/${id}`);
    console.log('Receipt by ID response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data
      };
    }
    return {
      success: false,
      message: 'Receipt not found'
    };
  } catch (error) {
    console.error('Error fetching receipt:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch receipt'
    };
  }
};

export const createReceipt = async (data) => {
  try {
    const response = await apiClient.post('/receipts', data);
    console.log('Create receipt response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Receipt created successfully'
      };
    }
    return {
      success: false,
      message: response.data?.message || 'Failed to create receipt'
    };
  } catch (error) {
    console.error('Error creating receipt:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to create receipt'
    };
  }
};

export const updateReceipt = async (id, data) => {
  try {
    const response = await apiClient.put(`/receipts/${id}`, data);
    console.log('Update receipt response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Receipt updated successfully'
      };
    }
    return {
      success: false,
      message: response.data?.message || 'Failed to update receipt'
    };
  } catch (error) {
    console.error('Error updating receipt:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to update receipt'
    };
  }
};

export const validateReceipt = async (id, data = {}) => {
  try {
    const response = await apiClient.post(`/receipts/${id}/validate`, data);
    console.log('Validate receipt response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Receipt validated successfully'
      };
    }
    return {
      success: false,
      message: response.data?.message || 'Failed to validate receipt'
    };
  } catch (error) {
    console.error('Error validating receipt:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to validate receipt'
    };
  }
};

export const cancelReceipt = async (id, reason = '') => {
  try {
    const response = await apiClient.delete(`/receipts/${id}`, {
      data: { reason }
    });
    console.log('Cancel receipt response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        message: response.data.message || 'Receipt canceled successfully'
      };
    }
    return {
      success: false,
      message: response.data?.message || 'Failed to cancel receipt'
    };
  } catch (error) {
    console.error('Error canceling receipt:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to cancel receipt'
    };
  }
};

export default {
  getReceipts,
  getReceiptById,
  createReceipt,
  updateReceipt,
  validateReceipt,
  cancelReceipt
};
