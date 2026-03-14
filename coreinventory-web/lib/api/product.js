import apiClient from '../api-client';

export const getProducts = async (params = {}) => {
  try {
    const response = await apiClient.get('/products', { params });
    console.log('Products response:', response.data);
    
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
    console.error('Error fetching products:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch products',
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 1 }
    };
  }
};

export const getProductById = async (id) => {
  try {
    const response = await apiClient.get(`/products/${id}`);
    console.log('Product by ID response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data
      };
    }
    return {
      success: false,
      message: 'Product not found'
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch product'
    };
  }
};

export const getProductStock = async (id, warehouseId = null) => {
  try {
    const params = warehouseId ? { warehouseId } : {};
    const response = await apiClient.get(`/products/${id}/stock`, { params });
    console.log('Product stock response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data
      };
    }
    return {
      success: false,
      message: 'Failed to fetch stock'
    };
  } catch (error) {
    console.error('Error fetching product stock:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch stock'
    };
  }
};

export const createProduct = async (data) => {
  try {
    const response = await apiClient.post('/products', data);
    console.log('Create product response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Product created successfully'
      };
    }
    return {
      success: false,
      message: response.data?.message || 'Failed to create product'
    };
  } catch (error) {
    console.error('Error creating product:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to create product'
    };
  }
};

export const updateProduct = async (id, data) => {
  try {
    const response = await apiClient.put(`/products/${id}`, data);
    console.log('Update product response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Product updated successfully'
      };
    }
    return {
      success: false,
      message: response.data?.message || 'Failed to update product'
    };
  } catch (error) {
    console.error('Error updating product:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to update product'
    };
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await apiClient.delete(`/products/${id}`);
    console.log('Delete product response:', response.data);
    
    if (response.data?.success === true) {
      return {
        success: true,
        message: response.data.message || 'Product deleted successfully'
      };
    }
    return {
      success: false,
      message: response.data?.message || 'Failed to delete product'
    };
  } catch (error) {
    console.error('Error deleting product:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to delete product'
    };
  }
};

export default {
  getProducts,
  getProductById,
  getProductStock,
  createProduct,
  updateProduct,
  deleteProduct
};
