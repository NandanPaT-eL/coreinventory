'use client';

import Link from 'next/link';
import { Eye, Edit, CheckCircle, XCircle, Package, Calendar, Building, AlertTriangle } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';
import Button from '../ui/Button';

export default function AdjustmentTable({ 
  adjustments, 
  isLoading, 
  onValidate,
  onCancel,
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateVariance = (item) => {
    const diff = item.countedQuantity - item.expectedQuantity;
    if (diff === 0) return { text: 'Match', color: 'text-emerald-600' };
    if (diff > 0) return { text: `+${diff}`, color: 'text-amber-600' };
    return { text: `${diff}`, color: 'text-red-600' };
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F9F7FF] border-b border-[#EDE9FE]">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Adjustment #</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Warehouse</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Date</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Status</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Items</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Variance</th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F0FF]">
            {adjustments.map((adjustment) => {
              const totalVariance = adjustment.items.reduce((sum, item) => 
                sum + (item.countedQuantity - item.expectedQuantity), 0
              );
              
              return (
                <tr key={adjustment._id} className="hover:bg-[#F9F7FF] transition-colors">
                  <td className="py-4 px-6">
                    <Link 
                      href={`/operations/adjustments/${adjustment._id}`}
                      className="font-mono text-sm font-semibold text-[#7C3AED] hover:text-[#6d28d9]"
                    >
                      {adjustment.adjustmentNumber}
                    </Link>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Building size={14} className="text-[#9CA3AF]" />
                      <span className="text-sm font-medium text-[#1a1a2e]">{adjustment.warehouseId?.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-[#9CA3AF]" />
                      <span className="text-sm text-[#374151]">{formatDate(adjustment.adjustmentDate)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={adjustment.status} />
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-medium text-[#1a1a2e]">{adjustment.items?.length || 0} items</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <AlertTriangle size={14} className={
                        totalVariance === 0 ? 'text-emerald-500' :
                        totalVariance > 0 ? 'text-amber-500' : 'text-red-500'
                      } />
                      <span className={`text-sm font-mono ${
                        totalVariance === 0 ? 'text-emerald-600' :
                        totalVariance > 0 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {totalVariance > 0 ? '+' : ''}{totalVariance}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/operations/adjustments/${adjustment._id}`}
                        className="p-2 text-[#6B7280] hover:text-[#7C3AED] hover:bg-[#F3F0FF] rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </Link>
                      
                      {adjustment.status === 'Draft' && (
                        <>
                          <Link
                            href={`/operations/adjustments/${adjustment._id}/edit`}
                            className="p-2 text-[#6B7280] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => onValidate?.(adjustment)}
                            className="p-2 text-[#6B7280] hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Apply Adjustment"
                          >
                            <CheckCircle size={18} />
                          </button>
                        </>
                      )}
                      
                      {adjustment.status === 'Draft' && (
                        <button
                          onClick={() => onCancel?.(adjustment)}
                          className="p-2 text-[#6B7280] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Cancel"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
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
