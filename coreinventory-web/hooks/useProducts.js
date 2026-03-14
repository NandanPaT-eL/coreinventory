import { useState, useCallback } from 'react';
import { 
  getProducts, 
  getProductById, 
  getProductStock,
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../lib/api/product';

export function useProducts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProducts(params);
      
      if (response.success) {
        setProducts(response.data);
        setPagination(response.pagination);
        return {
          data: response.data,
          pagination: response.pagination
        };
      } else {
        setError(response.message || 'Failed to fetch products');
        return { data: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } };
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      return { data: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProductById(id);
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch product');
        return null;
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch product');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductStock = useCallback(async (id, warehouseId = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProductStock(id, warehouseId);
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch stock');
        return null;
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch stock');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewProduct = useCallback(async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createProduct(productData);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Failed to create product');
        return { success: false, error: response.message };
      }
    } catch (err) {
      setError(err.message || 'Failed to create product');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateExistingProduct = useCallback(async (id, productData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateProduct(id, productData);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Failed to update product');
        return { success: false, error: response.message };
      }
    } catch (err) {
      setError(err.message || 'Failed to update product');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteExistingProduct = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteProduct(id);
      if (response.success) {
        return { success: true };
      } else {
        setError(response.message || 'Failed to delete product');
        return { success: false, error: response.message };
      }
    } catch (err) {
      setError(err.message || 'Failed to delete product');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    fetchProductById,
    fetchProductStock,
    createNewProduct,
    updateExistingProduct,
    deleteExistingProduct
  };
}

export default useProducts;
