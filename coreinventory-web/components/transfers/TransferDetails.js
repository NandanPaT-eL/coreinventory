'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftRight,
  Package, 
  Calendar, 
  Building,
  MapPin,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  FileText,
  Barcode
} from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';
import Button from '../ui/Button';

export default function TransferDetails({ transfer, onValidate, onCancel }) {
  const router = useRouter();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canEdit = transfer.status === 'Draft';
  const canValidate = transfer.status === 'Draft';
  const canCancel = transfer.status === 'Draft';

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-font text-2xl font-bold text-[#1a1a2e]">
            Transfer {transfer.transferNumber}
          </h1>
          <p className="text-[#6B7280] mt-1">Manage internal stock transfer</p>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <Link href={`/operations/transfers/${transfer._id}/edit`}>
              <Button variant="ghost" icon={<Edit size={18} />}>
                Edit
              </Button>
            </Link>
          )}
          {canValidate && (
            <Button 
              variant="yellow" 
              icon={<CheckCircle size={18} />}
              onClick={() => onValidate?.(transfer)}
            >
              Complete Transfer
            </Button>
          )}
          {canCancel && (
            <Button 
              variant="ghost" 
              icon={<XCircle size={18} />}
              onClick={() => onCancel?.(transfer)}
              className="text-red-600 hover:bg-red-50"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
        <div className="flex items-center justify-between">
          <StatusBadge status={transfer.status} />
          <div className="text-right">
            <p className="text-sm text-[#6B7280]">Transfer Date</p>
            <p className="font-semibold text-[#1a1a2e]">{formatDate(transfer.transferDate)}</p>
          </div>
        </div>
      </div>

      {/* Transfer Route */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
        <h3 className="display-font font-bold text-lg text-[#1a1a2e] flex items-center gap-2 mb-4">
          <ArrowLeftRight size={20} className="text-[#7C3AED]" />
          Transfer Route
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#F9F7FF] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Building size={16} className="text-[#7C3AED]" />
              <span className="font-semibold text-[#1a1a2e]">From</span>
            </div>
            <p className="font-medium text-[#1a1a2e]">{transfer.fromWarehouse?.name}</p>
            <p className="text-sm text-[#6B7280]">{transfer.fromWarehouse?.code}</p>
          </div>

          <div className="bg-[#F9F7FF] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Building size={16} className="text-[#7C3AED]" />
              <span className="font-semibold text-[#1a1a2e]">To</span>
            </div>
            <p className="font-medium text-[#1a1a2e]">{transfer.toWarehouse?.name}</p>
            <p className="text-sm text-[#6B7280]">{transfer.toWarehouse?.code}</p>
          </div>
        </div>

        {transfer.scheduledDate && (
          <div className="mt-4 pt-4 border-t border-[#EDE9FE]">
            <div className="flex items-center gap-2 text-[#374151]">
              <Calendar size={16} className="text-[#9CA3AF]" />
              <span className="text-sm">Scheduled for: {formatDate(transfer.scheduledDate)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] overflow-hidden">
        <div className="p-6 border-b border-[#EDE9FE]">
          <h3 className="display-font font-bold text-lg text-[#1a1a2e] flex items-center gap-2">
            <Package size={20} className="text-[#7C3AED]" />
            Items to Transfer
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9F7FF] border-b border-[#EDE9FE]">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Product</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Batch</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Quantity</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">From Location</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">To Location</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F0FF]">
              {transfer.items.map((item, index) => (
                <tr key={index} className="hover:bg-[#F9F7FF] transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-semibold text-[#1a1a2e]">{item.productId?.name}</p>
                      <p className="text-xs text-[#6B7280]">SKU: {item.productId?.sku}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <Barcode size={14} className="text-[#9CA3AF]" />
                      <span className="text-sm">{item.batchNumber || '—'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="font-mono font-semibold text-[#1a1a2e]">
                      {item.quantity} {item.productId?.unitOfMeasure}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-[#9CA3AF]" />
                      <span className="text-sm">{item.fromLocation || '—'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-[#9CA3AF]" />
                      <span className="text-sm">{item.toLocation || '—'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-[#6B7280]">{item.notes || '—'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes */}
      {transfer.notes && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
          <h3 className="display-font font-bold text-lg text-[#1a1a2e] flex items-center gap-2 mb-4">
            <FileText size={20} className="text-[#7C3AED]" />
            Transfer Notes
          </h3>
          <p className="text-[#374151] whitespace-pre-wrap">{transfer.notes}</p>
        </div>
      )}

      {/* Created By Info */}
      <div className="bg-[#F9F7FF] rounded-2xl p-4 text-sm text-[#6B7280] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>Created by {transfer.createdBy?.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{formatDate(transfer.createdAt)}</span>
          </div>
        </div>
        {transfer.validatedAt && (
          <div className="flex items-center gap-1 text-emerald-600">
            <CheckCircle size={14} />
            <span>Completed on {formatDate(transfer.validatedAt)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
