import apiClient from '../api-client';

export const getDashboardKPIs = async () => {
  try {
    const response = await apiClient.get('/dashboard/kpis');
    console.log('Dashboard KPIs response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data
      };
    }
    return {
      success: false,
      message: 'Failed to fetch dashboard KPIs',
      data: {
        totalProducts: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
        pendingReceipts: 0,
        pendingDeliveries: 0,
        pendingTransfers: 0
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard KPIs:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch dashboard KPIs',
      data: {
        totalProducts: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
        pendingReceipts: 0,
        pendingDeliveries: 0,
        pendingTransfers: 0
      }
    };
  }
};

export const getRecentMovements = async (limit = 10) => {
  try {
    const response = await apiClient.get(`/dashboard/recent?limit=${limit}`);
    console.log('Recent movements response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data
      };
    }
    return {
      success: false,
      message: 'Failed to fetch recent movements',
      data: []
    };
  } catch (error) {
    console.error('Error fetching recent movements:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch recent movements',
      data: []
    };
  }
};

export const getLowStockProducts = async (limit = 5) => {
  try {
    const response = await apiClient.get(`/dashboard/low-stock?limit=${limit}`);
    console.log('Low stock products response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data
      };
    }
    return {
      success: false,
      message: 'Failed to fetch low stock products',
      data: []
    };
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch low stock products',
      data: []
    };
  }
};

export const getChartData = async (days = 7) => {
  try {
    const response = await apiClient.get(`/dashboard/charts?days=${days}`);
    console.log('Chart data response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data
      };
    }
    return {
      success: false,
      message: 'Failed to fetch chart data',
      data: {
        movements: [],
        stockByWarehouse: []
      }
    };
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch chart data',
      data: {
        movements: [],
        stockByWarehouse: []
      }
    };
  }
};

export default {
  getDashboardKPIs,
  getRecentMovements,
  getLowStockProducts,
  getChartData
};
