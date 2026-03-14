import apiClient from '../api-client';

export const getLedgerEntries = async (params = {}) => {
  try {
    const response = await apiClient.get('/ledger', { params });
    console.log('Ledger entries response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data || [],
        pagination: response.data.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          pages: 1
        }
      };
    }
    return {
      success: false,
      message: 'Invalid response format',
      data: [],
      pagination: { page: 1, limit: 20, total: 0, pages: 1 }
    };
  } catch (error) {
    console.error('Error fetching ledger entries:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch ledger entries',
      data: [],
      pagination: { page: 1, limit: 20, total: 0, pages: 1 }
    };
  }
};

export const getProductLedger = async (productId, params = {}) => {
  try {
    const response = await apiClient.get(`/ledger/product/${productId}`, { params });
    console.log('Product ledger response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data || [],
        pagination: response.data.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          pages: 1
        }
      };
    }
    return {
      success: false,
      message: 'Invalid response format',
      data: []
    };
  } catch (error) {
    console.error('Error fetching product ledger:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch product ledger',
      data: []
    };
  }
};

export const getStockValuation = async (params = {}) => {
  try {
    const response = await apiClient.get('/ledger/valuation', { params });
    console.log('Stock valuation response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data || []
      };
    }
    return {
      success: false,
      message: 'Invalid response format',
      data: []
    };
  } catch (error) {
    console.error('Error fetching stock valuation:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch stock valuation',
      data: []
    };
  }
};

export const getDailySummary = async (date) => {
  try {
    const response = await apiClient.get('/ledger/summary/daily', { params: { date } });
    console.log('Daily summary response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data || [],
        date: response.data.date
      };
    }
    return {
      success: false,
      message: 'Invalid response format',
      data: []
    };
  } catch (error) {
    console.error('Error fetching daily summary:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch daily summary',
      data: []
    };
  }
};

export default {
  getLedgerEntries,
  getProductLedger,
  getStockValuation,
  getDailySummary
};
