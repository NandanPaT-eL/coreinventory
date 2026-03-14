'use client';

import { X, Package, Warehouse, User, Calendar, Hash, FileText, Tag } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function MovementDetailModal({ entry, isOpen, onClose }) {
  if (!isOpen || !entry) return null;

  const getTypeColor = (type) => {
    switch(type) {
      case 'receipt': return 'text-emerald-600 bg-emerald-50';
      case 'delivery': return 'text-amber-600 bg-amber-50';
      case 'transfer_out': return 'text-blue-600 bg-blue-50';
      case 'transfer_in': return 'text-blue-600 bg-blue-50';
      case 'adjustment': return 'text-purple-600 bg-purple-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'medium'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-[#6B7280] hover:text-[#7C3AED] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="display-font text-2xl font-bold text-[#1a1a2e]">
                Movement Details
              </h2>
              <Badge variant="purple" className="text-xs">
                ID: {entry._id.slice(-8)}
              </Badge>
            </div>

            <div className="space-y-6">
              {/* Type & Status */}
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getTypeColor(entry.type)}`}>
                  {entry.type.replace('_', ' ').toUpperCase()}
                </div>
                <StatusBadge status={entry.status || 'Done'} />
              </div>

              {/* Product Info */}
              <div className="bg-[#F9F7FF] rounded-xl p-4">
                <h3 className="text-sm font-medium text-[#6B7280] mb-3">Product Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Package size={16} className="text-[#7C3AED] mt-1" />
                    <div>
                      <p className="text-xs text-[#6B7280]">Product</p>
                      <p className="font-medium text-[#1a1a2e]">{entry.productId?.name}</p>
                      <p className="text-xs text-[#9CA3AF]">SKU: {entry.productId?.sku}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Warehouse size={16} className="text-[#7C3AED] mt-1" />
                    <div>
                      <p className="text-xs text-[#6B7280]">Warehouse</p>
                      <p className="font-medium text-[#1a1a2e]">{entry.warehouseId?.name}</p>
                      <p className="text-xs text-[#9CA3AF]">Code: {entry.warehouseId?.code}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stock Change */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F9F7FF] rounded-xl p-4">
                  <p className="text-xs text-[#6B7280] mb-1">Quantity Change</p>
                  <p className={`text-2xl font-bold ${
                    entry.delta > 0 ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {entry.delta > 0 ? '+' : ''}{entry.delta}
                  </p>
                </div>
                <div className="bg-[#F9F7FF] rounded-xl p-4">
                  <p className="text-xs text-[#6B7280] mb-1">New Stock Level</p>
                  <p className="text-2xl font-bold text-[#1a1a2e]">{entry.newStock}</p>
                </div>
              </div>

              {/* Reference Info */}
              <div className="bg-[#F9F7FF] rounded-xl p-4">
                <h3 className="text-sm font-medium text-[#6B7280] mb-3">Reference Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Hash size={16} className="text-[#7C3AED]" />
                    <div>
                      <p className="text-xs text-[#6B7280]">Reference Number</p>
                      <p className="font-medium text-[#1a1a2e]">{entry.referenceNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-[#7C3AED]" />
                    <div>
                      <p className="text-xs text-[#6B7280]">Reference Type</p>
                      <p className="font-medium text-[#1a1a2e]">{entry.referenceModel}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User size={16} className="text-[#9CA3AF]" />
                  <div>
                    <p className="text-xs text-[#6B7280]">Performed By</p>
                    <p className="font-medium text-[#1a1a2e]">{entry.performedBy?.name || 'System'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-[#9CA3AF]" />
                  <div>
                    <p className="text-xs text-[#6B7280]">Date & Time</p>
                    <p className="font-medium text-[#1a1a2e]">{formatDate(entry.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Note */}
              {entry.note && (
                <div className="bg-[#F9F7FF] rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Tag size={16} className="text-[#7C3AED] mt-1" />
                    <div>
                      <p className="text-xs text-[#6B7280]">Note</p>
                      <p className="text-[#374151]">{entry.note}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Batch Info */}
              {entry.batchNumber && (
                <div className="bg-[#F9F7FF] rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Hash size={16} className="text-[#7C3AED] mt-1" />
                    <div>
                      <p className="text-xs text-[#6B7280]">Batch Number</p>
                      <p className="font-medium text-[#1a1a2e]">{entry.batchNumber}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-4 bg-[#F9F7FF] border-t border-[#EDE9FE] flex justify-end">
            <Button onClick={onClose} variant="primary">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
