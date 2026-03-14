'use client';

import { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';

export default function WarehouseFilters({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  totalResults,
  isLoading 
}) {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Update local state when filters change externally
  useEffect(() => {
    setSearchInput(filters.search || '');
  }, [filters.search]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFilterChange('search', searchInput);
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchInput, filters.search, onFilterChange]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleStatusChange = (e) => {
    onFilterChange('isActive', e.target.value);
  };

  const handleCityChange = (e) => {
    onFilterChange('city', e.target.value);
  };

  const handleCountryChange = (e) => {
    onFilterChange('country', e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Immediate search on Enter key
      onFilterChange('search', searchInput);
    }
  };

  const hasActiveFilters = filters.search || filters.isActive || filters.city || filters.country;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-slate-500 mr-2" />
          <h3 className="font-medium text-slate-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search with debounce */}
        <div>
          <label htmlFor="search" className="block text-xs font-medium text-slate-500 mb-1">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              id="search"
              value={searchInput}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              placeholder="Name or code..."
              className="pl-9 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-lg focus:ring-0 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 text-sm"
              disabled={isLoading}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">Type and wait or press Enter to search</p>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-xs font-medium text-slate-500 mb-1">
            Status
          </label>
          <select
            id="status"
            value={filters.isActive || ''}
            onChange={handleStatusChange}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-0 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 text-sm"
            disabled={isLoading}
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="block text-xs font-medium text-slate-500 mb-1">
            City
          </label>
          <input
            type="text"
            id="city"
            value={filters.city || ''}
            onChange={handleCityChange}
            placeholder="Filter by city..."
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-0 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 text-sm"
            disabled={isLoading}
          />
        </div>

        {/* Country */}
        <div>
          <label htmlFor="country" className="block text-xs font-medium text-slate-500 mb-1">
            Country
          </label>
          <input
            type="text"
            id="country"
            value={filters.country || ''}
            onChange={handleCountryChange}
            placeholder="Filter by country..."
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-0 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 text-sm"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Results count */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-900">{totalResults}</span> warehouses found
        </p>
      </div>
    </div>
  );
}
