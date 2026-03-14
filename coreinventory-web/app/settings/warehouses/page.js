'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Plus, Building2, RefreshCw } from 'lucide-react';
import { useWarehouses } from '../../../hooks/useWarehouses';
import WarehouseTable from '../../../components/warehouses/WarehouseTable';
import WarehouseFilters from '../../../components/warehouses/WarehouseFilters';
import Button from '../../../components/ui/Button';
import SectionHeading from '../../../components/shared/SectionHeading';

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
    
    if (filters.search?.trim()) params.search = filters.search.trim();
    if (filters.isActive) params.isActive = filters.isActive === 'true';
    if (filters.city?.trim()) params.city = filters.city.trim();
    if (filters.country?.trim()) params.country = filters.country.trim();
    
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

  // Load when filters change
  useEffect(() => {
    if (initialLoadDone.current) {
      loadWarehouses();
    }
  }, [filters.search, filters.isActive, filters.city, filters.country, pagination.page, loadWarehouses]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
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
      await deactivateExistingWarehouse(id);
      loadWarehouses();
    }
  };

  const handleActivate = async (id) => {
    await activateExistingWarehouse(id);
    loadWarehouses();
  };

  const handleRefresh = () => {
    loadWarehouses();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Warehouses</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="primary">
              Try Again
            </Button>
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
          <SectionHeading
            badge="Warehouses"
            title="Manage"
            highlight="Locations"
            description="View and manage all your warehouse locations"
            align="left"
          />
          
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={handleRefresh}
              disabled={loading}
              icon={<RefreshCw size={16} className={loading ? 'animate-spin' : ''} />}
            >
              Refresh
            </Button>
            <Link href="/settings/warehouses/new">
              <Button variant="primary" icon={<Plus size={16} />}>
                Add Warehouse
              </Button>
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
        <WarehouseTable
          warehouses={warehouses}
          isLoading={loading}
          onDeactivate={handleDeactivate}
          onActivate={handleActivate}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
