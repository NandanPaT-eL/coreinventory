'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Plus, Building2, RefreshCw } from 'lucide-react';
import { useWarehouses } from '../../../hooks/useWarehouses';
import WarehouseTable from '../../../components/warehouses/WarehouseTable';
import WarehouseFilters from '../../../components/warehouses/WarehouseFilters';

export default function WarehousesPage() {
  const { 
    warehouses, 
    loading, 
    error, 
    fetchWarehouses, 
    deactivateExistingWarehouse,
    activateExistingWarehouse 
  } = useWarehouses();
  
  const [filters, setFilters] = useState({
    search: '',
    isActive: '',
    city: '',
    country: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  const initialLoadDone = useRef(false);

  const loadWarehouses = useCallback(async () => {
    const params = {
      page: pagination.page,
      limit: pagination.limit
    };
    
    // Only add filters if they have values
    if (filters.search && filters.search.trim() !== '') {
      params.search = filters.search.trim();
    }
    if (filters.isActive && filters.isActive !== '') {
      params.isActive = filters.isActive === 'true';
    }
    if (filters.city && filters.city.trim() !== '') {
      params.city = filters.city.trim();
    }
    if (filters.country && filters.country.trim() !== '') {
      params.country = filters.country.trim();
    }
    
    console.log('Fetching warehouses with params:', params);
    
    const result = await fetchWarehouses(params);
    
    if (result?.pagination) {
      setPagination(result.pagination);
    }
  }, [filters, pagination.page, pagination.limit, fetchWarehouses]);

  // Initial load
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      loadWarehouses();
    }
  }, [loadWarehouses]);

  // Load when filters or page change
  useEffect(() => {
    if (initialLoadDone.current) {
      loadWarehouses();
    }
  }, [filters.search, filters.isActive, filters.city, filters.country, pagination.page, loadWarehouses]);

  const handleFilterChange = (key, value) => {
    console.log('Filter change:', key, value);
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      isActive: '',
      city: '',
      country: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleDeactivate = async (id) => {
    if (confirm('Are you sure you want to deactivate this warehouse?')) {
      const result = await deactivateExistingWarehouse(id);
      if (result.success) {
        loadWarehouses(); // Reload after action
      }
    }
  };

  const handleActivate = async (id) => {
    const result = await activateExistingWarehouse(id);
    if (result.success) {
      loadWarehouses(); // Reload after action
    }
  };

  const handleRefresh = () => {
    loadWarehouses();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Warehouses</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={handleRefresh}
              className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Warehouses</h1>
            <p className="text-slate-600 mt-1">Manage your warehouse locations</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="bg-white text-slate-700 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all border border-slate-200 flex items-center disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link
              href="/settings/warehouses/new"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Warehouse
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <WarehouseFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            totalResults={pagination?.total || 0}
            isLoading={loading}
          />
        </div>

        {/* Table */}
        {warehouses.length > 0 ? (
          <WarehouseTable
            warehouses={warehouses}
            isLoading={loading}
            onDeactivate={handleDeactivate}
            onActivate={handleActivate}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        ) : !loading && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No warehouses found</h3>
            <p className="text-slate-600 mb-6">
              {filters.search || filters.city || filters.country || filters.isActive 
                ? 'No warehouses match your filters. Try clearing them.' 
                : 'Get started by creating your first warehouse'}
            </p>
            {filters.search || filters.city || filters.country || filters.isActive ? (
              <button
                onClick={clearFilters}
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                href="/settings/warehouses/new"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Warehouse
              </Link>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && warehouses.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-slate-600 mt-4">Loading warehouses...</p>
          </div>
        )}
      </div>
    </div>
  );
}
