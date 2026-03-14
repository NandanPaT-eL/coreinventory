'use client';

import { useState, useEffect } from 'react';
import { Search, X, Filter, MapPin, Globe } from 'lucide-react';
import Badge from '../ui/Badge';

export default function WarehouseFilters({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  totalResults,
  isLoading 
}) {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  useEffect(() => {
    setSearchInput(filters.search || '');
  }, [filters.search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFilterChange('search', searchInput);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, filters.search, onFilterChange]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onFilterChange('search', searchInput);
    }
  };

  const hasActiveFilters = filters.search || filters.isActive || filters.city || filters.country;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-[#6B7280]" />
          <h3 className="font-semibold text-[#1a1a2e]">Filters</h3>
          {hasActiveFilters && (
            <Badge variant="purple" className="ml-2">
              Active filters
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-[#7C3AED] hover:text-[#6d28d9] font-medium flex items-center gap-1 transition-colors"
          >
            <X size={16} />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              placeholder="Name or code..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200 text-sm placeholder:text-[#9CA3AF]"
              disabled={isLoading}
            />
          </div>
          <p className="text-xs text-[#9CA3AF]">Type and wait or press Enter</p>
        </div>

        {/* Status */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider">
            Status
          </label>
          <select
            value={filters.isActive || ''}
            onChange={(e) => onFilterChange('isActive', e.target.value)}
            className="w-full px-4 py-2.5 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200 text-sm"
            disabled={isLoading}
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* City */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider">
            City
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
            <input
              type="text"
              value={filters.city || ''}
              onChange={(e) => onFilterChange('city', e.target.value)}
              placeholder="Filter by city..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200 text-sm placeholder:text-[#9CA3AF]"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Country */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider">
            Country
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
            <input
              type="text"
              value={filters.country || ''}
              onChange={(e) => onFilterChange('country', e.target.value)}
              placeholder="Filter by country..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200 text-sm placeholder:text-[#9CA3AF]"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mt-4 pt-4 border-t border-[#F3F0FF]">
        <p className="text-sm text-[#6B7280]">
          <span className="font-bold text-[#7C3AED] text-lg mr-1">{totalResults}</span>
          warehouse{totalResults !== 1 ? 's' : ''} found
        </p>
      </div>
    </div>
  );
}
