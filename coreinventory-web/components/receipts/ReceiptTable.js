'use client';

import Link from 'next/link';
import { Eye, Edit, Trash2, CheckCircle, XCircle, Package, Calendar, User, Building } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';
import Button from '../ui/Button';

export default function ReceiptTable({ 
  receipts, 
  isLoading, 
  onValidate,
  onCancel,
  pagination,
  onPageChange,
  showActions = true
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F9F7FF] border-b border-[#EDE9FE]">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Receipt #</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Supplier</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Warehouse</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Date</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Status</th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Items</th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Quantity</th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F0FF]">
            {receipts.map((receipt) => (
              <tr key={receipt._id} className="hover:bg-[#F9F7FF] transition-colors">
                <td className="py-4 px-6">
                  <Link 
                    href={`/operations/receipts/${receipt._id}`}
                    className="font-mono text-sm font-semibold text-[#7C3AED] hover:text-[#6d28d9]"
                  >
                    {receipt.receiptNumber}
                  </Link>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Building size={14} className="text-[#9CA3AF]" />
                    <span className="text-sm font-medium text-[#1a1a2e]">{receipt.supplier?.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-[#374151]">{receipt.warehouseId?.name}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#9CA3AF]" />
                    <span className="text-sm text-[#374151]">{formatDate(receipt.receiptDate)}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <StatusBadge status={receipt.status} />
                </td>
                <td className="py-4 px-6 text-right">
                  <span className="text-sm font-medium text-[#1a1a2e]">{receipt.items?.length || 0}</span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div>
                    <span className="text-sm font-semibold text-[#1a1a2e]">{receipt.totalExpectedQuantity || 0}</span>
                    {receipt.totalReceivedQuantity > 0 && (
                      <span className="text-xs text-[#6B7280] ml-1">
                        (rec: {receipt.totalReceivedQuantity})
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/operations/receipts/${receipt._id}`}
                      className="p-2 text-[#6B7280] hover:text-[#7C3AED] hover:bg-[#F3F0FF] rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </Link>
                    
                    {receipt.status === 'Draft' && (
                      <>
                        <Link
                          href={`/operations/receipts/${receipt._id}/edit`}
                          className="p-2 text-[#6B7280] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => onValidate?.(receipt)}
                          className="p-2 text-[#6B7280] hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Validate"
                        >
                          <CheckCircle size={18} />
                        </button>
                      </>
                    )}
                    
                    {receipt.status === 'Draft' && (
                      <button
                        onClick={() => onCancel?.(receipt)}
                        className="p-2 text-[#6B7280] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Cancel"
                      >
                        <XCircle size={18} />
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
