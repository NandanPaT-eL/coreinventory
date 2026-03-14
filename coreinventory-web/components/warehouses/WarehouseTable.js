'use client';

import Link from 'next/link';
import { Edit, Power, MapPin, Phone, User, Building2 } from 'lucide-react';
import Badge from '../ui/Badge';
import IconBox from '../ui/IconBox';
import Button from '../ui/Button';

export default function WarehouseTable({ 
  warehouses, 
  isLoading, 
  onDeactivate, 
  onActivate,
  pagination,
  onPageChange 
}) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-[#F3F0FF] rounded-xl"></div>
          <div className="h-20 bg-[#F3F0FF] rounded-xl"></div>
          <div className="h-20 bg-[#F3F0FF] rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!warehouses.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-12 text-center">
        <div className="w-20 h-20 bg-[#F3F0FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Building2 size={32} className="text-[#7C3AED]" />
        </div>
        <h3 className="display-font text-xl font-bold text-[#1a1a2e] mb-2">No warehouses found</h3>
        <p className="text-[#6B7280] mb-6">Get started by creating your first warehouse</p>
        <Button href="/settings/warehouses/new" variant="primary" icon={<Building2 size={16} />}>
          Add Warehouse
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F9F7FF] border-b border-[#EDE9FE]">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Code</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Name</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Location</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Contact</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Status</th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F0FF]">
            {warehouses.map((warehouse) => (
              <tr key={warehouse._id} className="hover:bg-[#F9F7FF] transition-colors">
                <td className="py-4 px-6">
                  <span className="font-mono text-sm font-bold text-[#7C3AED] bg-[#F3F0FF] px-2 py-1 rounded-lg">
                    {warehouse.code}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <p className="font-semibold text-[#1a1a2e]">{warehouse.name}</p>
                    {warehouse.metadata?.type && (
                      <Badge variant="purple" className="text-xs mt-1">
                        {warehouse.metadata.type}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-[#6B7280] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-[#374151]">{warehouse.location?.city}</p>
                      <p className="text-xs text-[#6B7280]">{warehouse.location?.state}, {warehouse.location?.country}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="space-y-1">
                    {warehouse.contact?.manager && (
                      <div className="flex items-center gap-2 text-sm text-[#374151]">
                        <User size={14} className="text-[#6B7280]" />
                        {warehouse.contact.manager}
                      </div>
                    )}
                    {warehouse.contact?.phone && (
                      <div className="flex items-center gap-2 text-sm text-[#374151]">
                        <Phone size={14} className="text-[#6B7280]" />
                        {warehouse.contact.phone}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <Badge 
                    variant={warehouse.isActive ? 'success' : 'warning'}
                    className="capitalize"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${
                      warehouse.isActive ? 'bg-emerald-500' : 'bg-amber-500'
                    }`} />
                    {warehouse.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/settings/warehouses/${warehouse._id}`}
                      className="p-2 text-[#6B7280] hover:text-[#7C3AED] hover:bg-[#F3F0FF] rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </Link>
                    {warehouse.isActive ? (
                      <button
                        onClick={() => onDeactivate(warehouse._id)}
                        className="p-2 text-[#6B7280] hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Deactivate"
                      >
                        <Power size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() => onActivate(warehouse._id)}
                        className="p-2 text-[#6B7280] hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Activate"
                      >
                        <Power size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 bg-[#F9F7FF] border-t border-[#EDE9FE]">
          <p className="text-sm text-[#6B7280]">
            Showing <span className="font-semibold text-[#1a1a2e]">
              {((pagination.page - 1) * pagination.limit) + 1}
            </span> to{' '}
            <span className="font-semibold text-[#1a1a2e]">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span> of{' '}
            <span className="font-semibold text-[#1a1a2e]">{pagination.total}</span> results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 text-sm font-semibold text-[#6B7280] bg-white border border-[#EDE9FE] rounded-full hover:bg-[#F3F0FF] hover:text-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 text-sm font-semibold text-[#6B7280] bg-white border border-[#EDE9FE] rounded-full hover:bg-[#F3F0FF] hover:text-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
