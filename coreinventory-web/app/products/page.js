'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Filter, Search, RefreshCw, Package } from 'lucide-react';
import ProductTable from '../../components/products/ProductTable';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/shared/EmptyState';
import { useProducts } from '../../hooks/useProducts';

export default function ProductsPage() {
  const { 
    products, 
    loading, 
    pagination, 
    fetchProducts,
    deleteExistingProduct
  } = useProducts();

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    page: 1,
    limit: 10
  });

  useEffect(() => {
    loadProducts();
  }, [filters.page, filters.category, filters.search]);

  const loadProducts = async () => {
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.search) params.search = filters.search;
    params.page = filters.page;
    params.limit = filters.limit;
    
    await fetchProducts(params);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleDelete = async (product) => {
    const result = await deleteExistingProduct(product._id);
    if (result.success) {
      loadProducts();
    }
  };

  // Get unique categories for filter
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-font text-2xl font-bold text-[#1a1a2e]">Products</h1>
          <p className="text-[#6B7280] mt-1">Manage your inventory items</p>
        </div>
        <Link href="/products/new">
          <Button variant="primary" icon={<Plus size={18} />}>
            New Product
          </Button>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-[#6B7280] hover:text-[#7C3AED] hover:bg-[#F3F0FF] rounded-xl transition-colors"
          >
            <Filter size={18} />
            <span className="text-sm font-medium">Filters</span>
          </button>
          
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
            />
          </div>
          
          <button
            onClick={loadProducts}
            className="p-2 text-[#6B7280] hover:text-[#7C3AED] hover:bg-[#F3F0FF] rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-[#EDE9FE] grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-2 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Items per page</label>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', Number(e.target.value))}
                className="w-full px-4 py-2 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Products Table */}
      {products.length === 0 && !loading ? (
        <EmptyState
          title="No products found"
          description="Create your first product to start tracking inventory"
          icon={<Package className="h-12 w-12 text-[#9CA3AF]" />}
          action={
            <Link href="/products/new">
              <Button variant="primary" icon={<Plus size={18} />}>
                Create Product
              </Button>
            </Link>
          }
        />
      ) : (
        <ProductTable
          products={products}
          isLoading={loading}
          onDelete={handleDelete}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
