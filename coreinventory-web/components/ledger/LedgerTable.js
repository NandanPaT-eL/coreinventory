'use client';

import Link from 'next/link';
import { Package, Warehouse, User, Calendar, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';
import Badge from '../ui/Badge';

export default function LedgerTable({ 
  entries, 
  isLoading, 
  pagination,
  onPageChange,
  onRowClick
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

  const getTypeIcon = (type) => {
    switch(type) {
      case 'receipt': return <ArrowUp size={14} className="text-emerald-600" />;
      case 'delivery': return <ArrowDown size={14} className="text-amber-600" />;
      case 'transfer_out': return <ArrowUp size={14} className="text-blue-600" />;
      case 'transfer_in': return <ArrowDown size={14} className="text-blue-600" />;
      case 'adjustment': return <Package size={14} className="text-purple-600" />;
      default: return <Package size={14} className="text-slate-600" />;
    }
  };

  const getTypeBadge = (type) => {
    switch(type) {
      case 'receipt': return <Badge variant="success" className="text-xs">Receipt</Badge>;
      case 'delivery': return <Badge variant="warning" className="text-xs">Delivery</Badge>;
      case 'transfer_out': return <Badge variant="purple" className="text-xs">Transfer Out</Badge>;
      case 'transfer_in': return <Badge variant="purple" className="text-xs">Transfer In</Badge>;
      case 'adjustment': return <Badge variant="default" className="text-xs">Adjustment</Badge>;
      default: return <Badge variant="default" className="text-xs">{type}</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F9F7FF] border-b border-[#EDE9FE]">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Date</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Type</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Product</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Warehouse</th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Quantity</th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Balance</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Reference</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F0FF]">
            {entries.map((entry) => (
              <tr 
                key={entry._id} 
                className="hover:bg-[#F9F7FF] transition-colors cursor-pointer"
                onClick={() => onRowClick?.(entry)}
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#9CA3AF]" />
                    <span className="text-sm text-[#374151]">
                      {new Date(entry.createdAt).toLocaleString()}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#F3F0FF] rounded-lg flex items-center justify-center">
                      {getTypeIcon(entry.type)}
                    </div>
                    {getTypeBadge(entry.type)}
                  </div>
                </td>
                <td className="py-4 px-6">
                  {entry.productId ? (
                    <Link 
                      href={`/products/${entry.productId._id}`}
                      className="flex items-center gap-2 group"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Package size={14} className="text-[#7C3AED]" />
                      <span className="text-sm font-medium text-[#1a1a2e] group-hover:text-[#7C3AED]">
                        {entry.productId.name}
                      </span>
                      <span className="text-xs text-[#9CA3AF]">({entry.productId.sku})</span>
                    </Link>
                  ) : (
                    <span className="text-sm text-[#6B7280]">-</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  {entry.warehouseId ? (
                    <div className="flex items-center gap-2">
                      <Warehouse size={14} className="text-[#9CA3AF]" />
                      <span className="text-sm text-[#374151]">{entry.warehouseId.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-[#6B7280]">-</span>
                  )}
                </td>
                <td className="py-4 px-6 text-right">
                  <span className={`text-sm font-semibold ${
                    entry.delta > 0 ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {entry.delta > 0 ? '+' : ''}{entry.delta}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <span className="text-sm font-semibold text-[#1a1a2e]">{entry.newStock}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#6B7280]">{entry.referenceNumber}</span>
                    <ExternalLink size={12} className="text-[#9CA3AF]" />
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-[#9CA3AF]" />
                    <span className="text-sm text-[#374151]">{entry.performedBy?.name || 'System'}</span>
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
