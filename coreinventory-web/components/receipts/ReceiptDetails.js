'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building, 
  Package, 
  Calendar, 
  Hash,
  Phone,
  Mail,
  MapPin,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  FileText,
  DollarSign,
  Barcode
} from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';
import Button from '../ui/Button';

export default function ReceiptDetails({ receipt, onValidate, onCancel }) {
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const calculateItemTotal = (item) => {
    return (item.receivedQuantity || item.expectedQuantity) * item.unitCost;
  };

  const calculateTotal = () => {
    return receipt.items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const canEdit = receipt.status === 'Draft';
  const canValidate = receipt.status === 'Draft';
  const canCancel = receipt.status === 'Draft' || receipt.status === 'Waiting' || receipt.status === 'Ready';

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-font text-2xl font-bold text-[#1a1a2e]">
            Receipt {receipt.receiptNumber}
          </h1>
          <p className="text-[#6B7280] mt-1">Manage receipt details and validation</p>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <Link href={`/operations/receipts/${receipt._id}/edit`}>
              <Button variant="ghost" icon={<Edit size={18} />}>
                Edit
              </Button>
            </Link>
          )}
          {canValidate && (
            <Button 
              variant="yellow" 
              icon={<CheckCircle size={18} />}
              onClick={() => onValidate?.(receipt)}
            >
              Validate
            </Button>
          )}
          {canCancel && (
            <Button 
              variant="ghost" 
              icon={<XCircle size={18} />}
              onClick={() => onCancel?.(receipt)}
              className="text-red-600 hover:bg-red-50"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Status and Reference */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <StatusBadge status={receipt.status} />
            {receipt.referenceNumber && (
              <div className="flex items-center gap-2 text-[#6B7280]">
                <Hash size={16} />
                <span>Ref: {receipt.referenceNumber}</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-[#6B7280]">Receipt Date</p>
            <p className="font-semibold text-[#1a1a2e]">{formatDate(receipt.receiptDate)}</p>
          </div>
        </div>
      </div>

      {/* Supplier Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
        <h3 className="display-font font-bold text-lg text-[#1a1a2e] flex items-center gap-2 mb-4">
          <Building size={20} className="text-[#7C3AED]" />
          Supplier Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-[#6B7280] mb-1">Supplier Name</p>
            <p className="font-semibold text-[#1a1a2e]">{receipt.supplier.name}</p>
          </div>
          <div>
            <p className="text-sm text-[#6B7280] mb-1">Contact</p>
            <div className="space-y-1">
              {receipt.supplier.email && (
                <div className="flex items-center gap-2 text-[#374151]">
                  <Mail size={14} className="text-[#9CA3AF]" />
                  <span>{receipt.supplier.email}</span>
                </div>
              )}
              {receipt.supplier.phone && (
                <div className="flex items-center gap-2 text-[#374151]">
                  <Phone size={14} className="text-[#9CA3AF]" />
                  <span>{receipt.supplier.phone}</span>
                </div>
              )}
            </div>
          </div>
          {receipt.supplier.address && (
            <div className="md:col-span-2">
              <p className="text-sm text-[#6B7280] mb-1">Address</p>
              <div className="flex items-start gap-2 text-[#374151]">
                <MapPin size={14} className="text-[#9CA3AF] mt-1" />
                <span>{receipt.supplier.address}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Warehouse and Delivery Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-[#6B7280] mb-1">Warehouse</p>
            <p className="font-semibold text-[#1a1a2e]">{receipt.warehouseId?.name}</p>
            <p className="text-sm text-[#6B7280]">{receipt.warehouseId?.code}</p>
          </div>
          {receipt.expectedDeliveryDate && (
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Expected Delivery</p>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#9CA3AF]" />
                <span className="font-semibold text-[#1a1a2e]">
                  {formatDate(receipt.expectedDeliveryDate)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] overflow-hidden">
        <div className="p-6 border-b border-[#EDE9FE]">
          <h3 className="display-font font-bold text-lg text-[#1a1a2e] flex items-center gap-2">
            <Package size={20} className="text-[#7C3AED]" />
            Items Received
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9F7FF] border-b border-[#EDE9FE]">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Product</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Batch</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Expected</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Received</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Unit Cost</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Total</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Location</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Expiry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F0FF]">
              {receipt.items.map((item, index) => (
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
                  <td className="py-4 px-6 text-right font-mono">{item.expectedQuantity}</td>
                  <td className="py-4 px-6 text-right">
                    <span className={`font-mono font-semibold ${
                      item.receivedQuantity > item.expectedQuantity ? 'text-amber-600' :
                      item.receivedQuantity < item.expectedQuantity ? 'text-red-600' :
                      'text-emerald-600'
                    }`}>
                      {item.receivedQuantity || 0}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-mono">₹{item.unitCost}</td>
                  <td className="py-4 px-6 text-right font-mono font-semibold">
                    ₹{calculateItemTotal(item).toFixed(2)}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm">{item.location || '—'}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm">
                      {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#F9F7FF] border-t border-[#EDE9FE]">
              <tr>
                <td colSpan="5" className="py-4 px-6 text-right font-semibold text-[#1a1a2e]">
                  Total Value:
                </td>
                <td className="py-4 px-6 text-right font-mono font-bold text-[#7C3AED]">
                  {formatCurrency(calculateTotal())}
                </td>
                <td colSpan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Notes */}
      {receipt.notes && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
          <h3 className="display-font font-bold text-lg text-[#1a1a2e] flex items-center gap-2 mb-4">
            <FileText size={20} className="text-[#7C3AED]" />
            Notes
          </h3>
          <p className="text-[#374151] whitespace-pre-wrap">{receipt.notes}</p>
        </div>
      )}

      {/* Created By Info */}
      <div className="bg-[#F9F7FF] rounded-2xl p-4 text-sm text-[#6B7280] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>Created by {receipt.createdBy?.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{formatDate(receipt.createdAt)}</span>
          </div>
        </div>
        {receipt.validatedAt && (
          <div className="flex items-center gap-1 text-emerald-600">
            <CheckCircle size={14} />
            <span>Validated on {formatDate(receipt.validatedAt)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
