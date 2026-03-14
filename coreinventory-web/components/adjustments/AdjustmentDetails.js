'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, 
  Calendar, 
  Building,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  FileText,
  Barcode,
  AlertTriangle
} from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';
import Button from '../ui/Button';

export default function AdjustmentDetails({ adjustment, onValidate, onCancel }) {
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

  const canEdit = adjustment.status === 'Draft';
  const canValidate = adjustment.status === 'Draft';
  const canCancel = adjustment.status === 'Draft';

  const calculateVariance = (expected, counted) => {
    return counted - expected;
  };

  const getVarianceColor = (variance) => {
    if (variance === 0) return 'text-emerald-600';
    if (variance > 0) return 'text-amber-600';
    return 'text-red-600';
  };

  const getVarianceIcon = (variance) => {
    if (variance === 0) return null;
    return <AlertTriangle size={14} className={variance > 0 ? 'text-amber-500' : 'text-red-500'} />;
  };

  const totalVariance = adjustment.items.reduce((sum, item) => 
    sum + calculateVariance(item.expectedQuantity, item.countedQuantity), 0
  );

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-font text-2xl font-bold text-[#1a1a2e]">
            Adjustment {adjustment.adjustmentNumber}
          </h1>
          <p className="text-[#6B7280] mt-1">Manage stock adjustment</p>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <Link href={`/operations/adjustments/${adjustment._id}/edit`}>
              <Button variant="ghost" icon={<Edit size={18} />}>
                Edit
              </Button>
            </Link>
          )}
          {canValidate && (
            <Button 
              variant="yellow" 
              icon={<CheckCircle size={18} />}
              onClick={() => onValidate?.(adjustment)}
            >
              Apply Adjustment
            </Button>
          )}
          {canCancel && (
            <Button 
              variant="ghost" 
              icon={<XCircle size={18} />}
              onClick={() => onCancel?.(adjustment)}
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
          <StatusBadge status={adjustment.status} />
          <div className="text-right">
            <p className="text-sm text-[#6B7280]">Adjustment Date</p>
            <p className="font-semibold text-[#1a1a2e]">{formatDate(adjustment.adjustmentDate)}</p>
          </div>
        </div>
      </div>

      {/* Warehouse */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
        <h3 className="display-font font-bold text-lg text-[#1a1a2e] flex items-center gap-2 mb-4">
          <Building size={20} className="text-[#7C3AED]" />
          Warehouse
        </h3>
        
        <div>
          <p className="font-semibold text-[#1a1a2e]">{adjustment.warehouseId?.name}</p>
          <p className="text-sm text-[#6B7280]">{adjustment.warehouseId?.code}</p>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] overflow-hidden">
        <div className="p-6 border-b border-[#EDE9FE]">
          <h3 className="display-font font-bold text-lg text-[#1a1a2e] flex items-center gap-2">
            <Package size={20} className="text-[#7C3AED]" />
            Adjusted Items
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9F7FF] border-b border-[#EDE9FE]">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Product</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Reason</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Expected</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Counted</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Variance</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F0FF]">
              {adjustment.items.map((item, index) => {
                const variance = calculateVariance(item.expectedQuantity, item.countedQuantity);
                
                return (
                  <tr key={index} className="hover:bg-[#F9F7FF] transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-[#1a1a2e]">{item.productId?.name}</p>
                        <p className="text-xs text-[#6B7280]">SKU: {item.productId?.sku}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="capitalize text-sm">{item.reason || 'correction'}</span>
                    </td>
                    <td className="py-4 px-6 text-right font-mono">{item.expectedQuantity}</td>
                    <td className="py-4 px-6 text-right font-mono font-semibold">{item.countedQuantity}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {getVarianceIcon(variance)}
                        <span className={`font-mono font-semibold ${getVarianceColor(variance)}`}>
                          {variance > 0 ? '+' : ''}{variance}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-[#6B7280]">{item.notes || '—'}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-[#F9F7FF] border-t border-[#EDE9FE]">
              <tr>
                <td colSpan="4" className="py-4 px-6 text-right font-semibold text-[#1a1a2e]">
                  Total Variance:
                </td>
                <td className="py-4 px-6 text-right">
                  <span className={`font-mono font-bold ${getVarianceColor(totalVariance)}`}>
                    {totalVariance > 0 ? '+' : ''}{totalVariance}
                  </span>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Notes */}
      {adjustment.notes && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
          <h3 className="display-font font-bold text-lg text-[#1a1a2e] flex items-center gap-2 mb-4">
            <FileText size={20} className="text-[#7C3AED]" />
            Adjustment Notes
          </h3>
          <p className="text-[#374151] whitespace-pre-wrap">{adjustment.notes}</p>
        </div>
      )}

      {/* Created By Info */}
      <div className="bg-[#F9F7FF] rounded-2xl p-4 text-sm text-[#6B7280] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>Created by {adjustment.createdBy?.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{formatDate(adjustment.createdAt)}</span>
          </div>
        </div>
        {adjustment.validatedAt && (
          <div className="flex items-center gap-1 text-emerald-600">
            <CheckCircle size={14} />
            <span>Applied on {formatDate(adjustment.validatedAt)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
