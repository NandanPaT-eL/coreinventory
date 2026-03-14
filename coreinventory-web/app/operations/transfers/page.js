'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Filter, Search, RefreshCw, ArrowLeftRight } from 'lucide-react';
import TransferTable from '../../../components/transfers/TransferTable';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/shared/EmptyState';
import ConfirmDialog from '../../../components/shared/ConfirmDialog';
import { useTransfers } from '../../../hooks/useTransfers';
import { useWarehouses } from '../../../hooks/useWarehouses';

export default function TransfersPage() {
  const { 
    transfers, 
    loading, 
    pagination, 
    fetchTransfers,
    validateExistingTransfer,
    cancelExistingTransfer
  } = useTransfers();

  const { warehouses, fetchWarehouses } = useWarehouses();

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    fromWarehouse: '',
    toWarehouse: '',
    search: '',
    page: 1,
    limit: 10
  });

  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [showValidateDialog, setShowValidateDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchWarehouses({ limit: 100 });
  }, []);

  useEffect(() => {
    loadTransfers();
  }, [filters.page, filters.status, filters.fromWarehouse, filters.toWarehouse, filters.search]);

  const loadTransfers = async () => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.fromWarehouse) params.fromWarehouse = filters.fromWarehouse;
    if (filters.toWarehouse) params.toWarehouse = filters.toWarehouse;
    if (filters.search) params.search = filters.search;
    params.page = filters.page;
    params.limit = filters.limit;
    
    await fetchTransfers(params);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleValidate = (transfer) => {
    setSelectedTransfer(transfer);
    setShowValidateDialog(true);
  };

  const handleCancel = (transfer) => {
    setSelectedTransfer(transfer);
    setShowCancelDialog(true);
  };

  const confirmValidate = async () => {
    if (!selectedTransfer) return;
    
    setActionLoading(true);
    const result = await validateExistingTransfer(selectedTransfer._id);
    setActionLoading(false);
    
    if (result.success) {
      setShowValidateDialog(false);
      setSelectedTransfer(null);
      loadTransfers();
    }
  };

  const confirmCancel = async () => {
    if (!selectedTransfer) return;
    
    setActionLoading(true);
    const result = await cancelExistingTransfer(selectedTransfer._id, 'Canceled by user');
    setActionLoading(false);
    
    if (result.success) {
      setShowCancelDialog(false);
      setSelectedTransfer(null);
      loadTransfers();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-font text-2xl font-bold text-[#1a1a2e]">Internal Transfers</h1>
          <p className="text-[#6B7280] mt-1">Move stock between warehouses and locations</p>
        </div>
        <Link href="/operations/transfers/new">
          <Button variant="primary" icon={<Plus size={18} />}>
            New Transfer
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
              placeholder="Search transfers..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
            />
          </div>
          
          <button
            onClick={loadTransfers}
            className="p-2 text-[#6B7280] hover:text-[#7C3AED] hover:bg-[#F3F0FF] rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-[#EDE9FE] grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-2 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
              >
                <option value="">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Done">Completed</option>
                <option value="Canceled">Canceled</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">From Warehouse</label>
              <select
                value={filters.fromWarehouse}
                onChange={(e) => handleFilterChange('fromWarehouse', e.target.value)}
                className="w-full px-4 py-2 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
              >
                <option value="">All Warehouses</option>
                {warehouses.map(w => (
                  <option key={w._id} value={w._id}>{w.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">To Warehouse</label>
              <select
                value={filters.toWarehouse}
                onChange={(e) => handleFilterChange('toWarehouse', e.target.value)}
                className="w-full px-4 py-2 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
              >
                <option value="">All Warehouses</option>
                {warehouses.map(w => (
                  <option key={w._id} value={w._id}>{w.name}</option>
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

      {/* Transfers Table */}
      {transfers.length === 0 && !loading ? (
        <EmptyState
          title="No transfers found"
          description="Create your first internal transfer to move stock between warehouses"
          icon={<ArrowLeftRight className="h-12 w-12 text-[#9CA3AF]" />}
          action={
            <Link href="/operations/transfers/new">
              <Button variant="primary" icon={<Plus size={18} />}>
                Create Transfer
              </Button>
            </Link>
          }
        />
      ) : (
        <TransferTable
          transfers={transfers}
          isLoading={loading}
          onValidate={handleValidate}
          onCancel={handleCancel}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}

      {/* Validate Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showValidateDialog}
        onClose={() => setShowValidateDialog(false)}
        onConfirm={confirmValidate}
        title="Complete Transfer"
        message={`Are you sure you want to complete transfer ${selectedTransfer?.transferNumber}? This will move stock between warehouses.`}
        confirmText="Complete Transfer"
        type="success"
        isLoading={actionLoading}
      />

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={confirmCancel}
        title="Cancel Transfer"
        message={`Are you sure you want to cancel transfer ${selectedTransfer?.transferNumber}? This action cannot be undone.`}
        confirmText="Cancel Transfer"
        type="danger"
        isLoading={actionLoading}
      />
    </div>
  );
}
