'use client';

import { useState, useEffect } from 'react';
import FilterBar from '../shared/FilterBar';

export default function LedgerFilters({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  totalResults,
  isLoading,
  warehouses = []
}) {
  const statusOptions = [
    { value: 'Draft', label: 'Draft' },
    { value: 'Waiting', label: 'Waiting' },
    { value: 'Ready', label: 'Ready' },
    { value: 'Done', label: 'Done' },
    { value: 'Canceled', label: 'Canceled' }
  ];

  const typeOptions = [
    { value: 'receipt', label: 'Receipt' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'transfer_out', label: 'Transfer Out' },
    { value: 'transfer_in', label: 'Transfer In' },
    { value: 'adjustment', label: 'Adjustment' }
  ];

  return (
    <FilterBar
      filters={filters}
      onFilterChange={onFilterChange}
      onClearFilters={onClearFilters}
      totalResults={totalResults}
      isLoading={isLoading}
      showDateRange={true}
      showStatus={true}
      showWarehouse={true}
      showType={true}
      statusOptions={statusOptions}
      typeOptions={typeOptions}
      warehouses={warehouses}
    />
  );
}
