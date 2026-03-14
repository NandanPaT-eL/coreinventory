'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Package, 
  Calendar, 
  Hash,
  Phone,
  Mail,
  MapPin,
  Truck,
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

export default function DeliveryDetails({ delivery, onValidate, onCancel }) {
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
    return (item.deliveredQuantity || item.orderedQuantity) * item.unitPrice;
  };

  const calculateTotal = () => {
    return delivery.items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const canEdit = delivery.status === 'Draft';
  const canValidate = delivery.status === 'Draft' || delivery.status === 'Ready';
  const canCancel = delivery.status === 'Draft' || delivery.status === 'Ready';

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-font text-2xl font-bold text-[#1a1a2e]">
            Delivery {delivery.deliveryNumber}
          </h1>
          <p className="text-[#6B7280] mt-1">Manage delivery details and dispatch</p>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <Link href={`/operations/deliveries/${delivery._id}/edit`}>
              <Button variant="ghost" icon={<Edit size={18} />}>
                Edit
              </Button>
            </Link>
          )}
          {canValidate && (
            <Button 
              variant="yellow" 
              icon={<CheckCircle size={18} />}
              onClick={() => onValidate?.(delivery)}
            >
              Dispatch
            </Button>
          )}
          {canCancel && (
            <Button 
              variant="ghost" 
              icon={<XCircle size={18} />}
              onClick={() => onCancel?.(delivery)}
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
          <StatusBadge status={delivery.status} />
          <div className="text-right">
            <p className="text-sm text-[#6B7280]">Delivery Date</p>
            <p className="font-semibold text-[#1a1a2e]">{formatDate(delivery.deliveryDate)}</p>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
        <h3 className="display-font font-bold text-lg text-[#1a1a2e] flex items-center gap-2 mb-4">
          <User size={20} className="text-[#7C3AED]" />
          Customer Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-[#6B7280] mb-1">Customer Name</p>
            <p className="font-semibold text-[#1a1a2e]">{delivery.customer.name}</p>
          </div>
          <div>
            <p className="text-sm text-[#6B7280] mb-1">Contact</p>
            <div className="space-y-1">
              {delivery.customer.email && (
                <div className="flex items-center gap-2 text-[#374151]">
                  <Mail size={14} className="text-[#9CA3AF]" />
                  <span>{delivery.customer.email}</span>
                </div>
              )}
              {delivery.customer.phone && (
                <div className="flex items-center gap-2 text-[#374151]">
                  <Phone size={14} className="text-[#9CA3AF]" />
                  <span>{delivery.customer.phone}</span>
                </div>
              )}
            </div>
          </div>
          {delivery.customer.address && (
            <div className="md:col-span-2">
              <p className="text-sm text-[#6B7280] mb-1">Delivery Address</p>
              <div className="flex items-start gap-2 text-[#374151]">
                <MapPin size={14} className="text-[#9CA3AF] mt-1" />
                <span>{delivery.customer.address}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Warehouse and Delivery Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-[#6B7280] mb-1">Warehouse</p>
            <p className="font-semibold text-[#1a1a2e]">{delivery.warehouseId?.name}</p>
            <p className="text-sm text-[#6B7280]">{delivery.warehouseId?.code}</p>
          </div>
          {delivery.requestedDeliveryDate && (
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Requested Delivery</p>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#9CA3AF]" />
                <span className="font-semibold text-[#1a1a2e]">
                  {formatDate(delivery.requestedDeliveryDate)}
                </span>
              </div>
            </div>
          )}
          {(delivery.carrier || delivery.trackingNumber) && (
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Shipping</p>
              <div className="space-y-1">
                {delivery.carrier && (
                  <div className="flex items-center gap-2">
                    <Truck size={14} className="text-[#9CA3AF]" />
                    <span className="text-sm">{delivery.carrier}</span>
                  </div>
                )}
                {delivery.trackingNumber && (
                  <div className="flex items-center gap-2">
                    <Hash size={14} className="text-[#9CA3AF]" />
                    <span className="text-sm font-mono">{delivery.trackingNumber}</span>
                  </div>
                )}
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
            Items to Dispatch
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9F7FF] border-b border-[#EDE9FE]">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Product</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Batch</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Ordered</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Dispatched</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Unit Price</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Total</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F0FF]">
              {delivery.items.map((item, index) => (
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
                  <td className="py-4 px-6 text-right font-mono">{item.orderedQuantity}</td>
                  <td className="py-4 px-6 text-right">
                    <span className={`font-mono font-semibold ${
                      item.deliveredQuantity > item.orderedQuantity ? 'text-amber-600' :
                      item.deliveredQuantity < item.orderedQuantity ? 'text-red-600' :
                      'text-emerald-600'
                    }`}>
                      {item.deliveredQuantity || 0}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-mono">₹{item.unitPrice}</td>
                  <td className="py-4 px-6 text-right font-mono font-semibold">
                    ₹{calculateItemTotal(item).toFixed(2)}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm">{item.location || '—'}</span>
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
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Notes */}
      {delivery.notes && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
          <h3 className="display-font font-bold text-lg text-[#1a1a2e] flex items-center gap-2 mb-4">
            <FileText size={20} className="text-[#7C3AED]" />
            Notes
          </h3>
          <p className="text-[#374151] whitespace-pre-wrap">{delivery.notes}</p>
        </div>
      )}

      {/* Created By Info */}
      <div className="bg-[#F9F7FF] rounded-2xl p-4 text-sm text-[#6B7280] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>Created by {delivery.createdBy?.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{formatDate(delivery.createdAt)}</span>
          </div>
        </div>
        {delivery.validatedAt && (
          <div className="flex items-center gap-1 text-emerald-600">
            <CheckCircle size={14} />
            <span>Dispatched on {formatDate(delivery.validatedAt)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
