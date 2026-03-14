'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { History, RefreshCw, Download } from 'lucide-react';
import { useLedger } from '../../hooks/useLedger';
import { useWarehouses } from '../../hooks/useWarehouses';
import LedgerTable from '../../components/ledger/LedgerTable';
import LedgerFilters from '../../components/ledger/LedgerFilters';
import MovementDetailModal from '../../components/ledger/MovementDetailModal';
import SectionHeading from '../../components/shared/SectionHeading';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/shared/EmptyState';

export default function MoveHistoryPage() {
  const router = useRouter();
  const { entries, loading, pagination, fetchLedgerEntries } = useLedger();
  const { warehouses, fetchWarehouses } = useWarehouses();
  
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    warehouseId: '',
    startDate: '',
    endDate: ''
  });
  
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Load warehouses for filter dropdown
  useEffect(() => {
    fetchWarehouses({ limit: 100 });
  }, []);

  const loadLedgerEntries = useCallback(async () => {
    const params = {
      page: pagination.page,
      limit: pagination.limit
    };
    
    if (filters.search) params.search = filters.search;
    if (filters.type) params.type = filters.type;
    if (filters.status) params.status = filters.status;
    if (filters.warehouseId) params.warehouseId = filters.warehouseId;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    
    await fetchLedgerEntries(params);
  }, [filters, pagination.page, pagination.limit, fetchLedgerEntries]);

  // Initial load
  useEffect(() => {
    loadLedgerEntries();
  }, []);

  // Load when filters change
  useEffect(() => {
    loadLedgerEntries();
  }, [filters.search, filters.type, filters.status, filters.warehouseId, filters.startDate, filters.endDate, pagination.page]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    // Reset to first page when filters change
    pagination.page = 1;
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      type: '',
      status: '',
      warehouseId: '',
      startDate: '',
      endDate: ''
    });
    pagination.page = 1;
  };

  const handlePageChange = (newPage) => {
    pagination.page = newPage;
  };

  const handleRowClick = (entry) => {
    setSelectedEntry(entry);
    setModalOpen(true);
  };

  const handleRefresh = () => {
    loadLedgerEntries();
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    alert('Export feature coming soon!');
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1600px] mx-auto space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <SectionHeading
          badge="Stock Ledger"
          title="Movement"
          highlight="History"
          description="Complete audit trail of all stock movements"
          align="left"
        />
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={handleRefresh}
            disabled={loading}
            icon={<RefreshCw size={16} className={loading ? 'animate-spin' : ''} />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            onClick={handleExport}
            icon={<Download size={16} />}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <LedgerFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        totalResults={pagination.total}
        isLoading={loading}
        warehouses={warehouses}
      />

      {/* Table */}
      {entries.length > 0 ? (
        <LedgerTable
          entries={entries}
          isLoading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRowClick={handleRowClick}
        />
      ) : !loading && (
        <EmptyState
          icon={History}
          title="No movements found"
          description={hasActiveFilters 
            ? "No movements match your filters. Try clearing them to see more results."
            : "The stock ledger tracks all inventory movements. Movements will appear here when you create receipts, deliveries, or adjustments."
          }
          filtered={hasActiveFilters}
          actionLabel={hasActiveFilters ? "Clear Filters" : undefined}
          onAction={hasActiveFilters ? handleClearFilters : undefined}
        />
      )}

      {/* Loading State */}
      {loading && entries.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3AED] mx-auto"></div>
          <p className="text-[#6B7280] mt-4">Loading ledger entries...</p>
        </div>
      )}

      {/* Detail Modal */}
      <MovementDetailModal
        entry={selectedEntry}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
