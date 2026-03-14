'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Filter, Search, RefreshCw } from 'lucide-react';
import ReceiptTable from '../../../components/receipts/ReceiptTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/shared/EmptyState';
import ConfirmDialog from '../../../components/shared/ConfirmDialog';
import { useReceipts } from '../../../hooks/useReceipts';

export default function ReceiptsPage() {
  const { 
    receipts, 
    loading, 
    pagination, 
    fetchReceipts,
    validateExistingReceipt,
    cancelExistingReceipt
  } = useReceipts();

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    warehouseId: '',
    search: '',
    page: 1,
    limit: 10
  });

  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showValidateDialog, setShowValidateDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadReceipts();
  }, [filters.page, filters.status, filters.warehouseId, filters.search]);

  const loadReceipts = async () => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.warehouseId) params.warehouseId = filters.warehouseId;
    if (filters.search) params.search = filters.search;
    params.page = filters.page;
    params.limit = filters.limit;
    
    await fetchReceipts(params);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleValidate = (receipt) => {
    setSelectedReceipt(receipt);
    setShowValidateDialog(true);
  };

  const handleCancel = (receipt) => {
    setSelectedReceipt(receipt);
    setShowCancelDialog(true);
  };

  const confirmValidate = async () => {
    if (!selectedReceipt) return;
    
    setActionLoading(true);
    const result = await validateExistingReceipt(selectedReceipt._id);
    setActionLoading(false);
    
    if (result.success) {
      setShowValidateDialog(false);
      setSelectedReceipt(null);
      loadReceipts();
    }
  };

  const confirmCancel = async () => {
    if (!selectedReceipt) return;
    
    setActionLoading(true);
    const result = await cancelExistingReceipt(selectedReceipt._id, 'Canceled by user');
    setActionLoading(false);
    
    if (result.success) {
      setShowCancelDialog(false);
      setSelectedReceipt(null);
      loadReceipts();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-font text-2xl font-bold text-[#1a1a2e]">Receipts</h1>
          <p className="text-[#6B7280] mt-1">Manage incoming inventory receipts</p>
        </div>
        <Link href="/operations/receipts/new">
          <Button variant="primary" icon={<Plus size={18} />}>
            New Receipt
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
              placeholder="Search receipts..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
            />
          </div>
          
          <button
            onClick={loadReceipts}
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
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-2 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
              >
                <option value="">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Waiting">Waiting</option>
                <option value="Ready">Ready</option>
                <option value="Done">Done</option>
                <option value="Canceled">Canceled</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Warehouse</label>
              <select
                value={filters.warehouseId}
                onChange={(e) => handleFilterChange('warehouseId', e.target.value)}
                className="w-full px-4 py-2 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
              >
                <option value="">All Warehouses</option>
                {/* Warehouse options would be populated here */}
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

      {/* Receipts Table */}
      {receipts.length === 0 && !loading ? (
        <EmptyState
          title="No receipts found"
          description="Create your first receipt to start tracking incoming inventory"
          icon={<Package className="h-12 w-12 text-[#9CA3AF]" />}
          action={
            <Link href="/operations/receipts/new">
              <Button variant="primary" icon={<Plus size={18} />}>
                Create Receipt
              </Button>
            </Link>
          }
        />
      ) : (
        <ReceiptTable
          receipts={receipts}
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
        title="Validate Receipt"
        message={`Are you sure you want to validate receipt ${selectedReceipt?.receiptNumber}? This will update inventory levels.`}
        confirmText="Validate"
        type="success"
        isLoading={actionLoading}
      />

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={confirmCancel}
        title="Cancel Receipt"
        message={`Are you sure you want to cancel receipt ${selectedReceipt?.receiptNumber}? This action cannot be undone.`}
        confirmText="Cancel Receipt"
        type="danger"
        isLoading={actionLoading}
      />
    </div>
  );
}
