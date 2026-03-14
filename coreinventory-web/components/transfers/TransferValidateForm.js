'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle, 
  Package, 
  Barcode,
  MapPin,
  AlertCircle,
  ArrowLeftRight
} from 'lucide-react';
import Button from '../ui/Button';

export default function TransferValidateForm({ transfer, onSubmit, isLoading }) {
  const router = useRouter();
  const [items, setItems] = useState(
    transfer.items.map(item => ({
      productId: item.productId._id || item.productId,
      quantity: item.quantity,
      fromLocation: item.fromLocation || '',
      toLocation: item.toLocation || '',
      batchNumber: item.batchNumber || '',
      verified: true,
      notes: item.notes || ''
    }))
  );

  const [validationNotes, setValidationNotes] = useState('');

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      items: items.map(item => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        fromLocation: item.fromLocation,
        toLocation: item.toLocation,
        batchNumber: item.batchNumber,
        notes: item.notes
      })),
      notes: validationNotes
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Validation Header */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-amber-800">Complete Transfer</h4>
          <p className="text-sm text-amber-700">
            Verify all items before completing the transfer. This will move stock from 
            {transfer.fromWarehouse?.name} to {transfer.toWarehouse?.name}.
          </p>
        </div>
      </div>

      {/* Transfer Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-[#6B7280] mb-1">From</p>
            <p className="font-semibold text-[#1a1a2e]">{transfer.fromWarehouse?.name}</p>
          </div>
          <ArrowLeftRight className="text-[#9CA3AF]" size={20} />
          <div className="flex-1">
            <p className="text-sm text-[#6B7280] mb-1">To</p>
            <p className="font-semibold text-[#1a1a2e]">{transfer.toWarehouse?.name}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-4">
        <h3 className="display-font font-bold text-lg text-[#1a1a2e] flex items-center gap-2">
          <Package size={20} className="text-[#7C3AED]" />
          Verify Items
        </h3>

        {items.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-[#1a1a2e]">
                {transfer.items[index].productId?.name || 'Product'}
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`verified-${index}`}
                  checked={item.verified}
                  onChange={(e) => handleItemChange(index, 'verified', e.target.checked)}
                  className="w-4 h-4 rounded border-[#EDE9FE] text-[#7C3AED] focus:ring-[#7C3AED]"
                />
                <label htmlFor={`verified-${index}`} className="text-sm text-[#374151]">
                  Verified
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[#6B7280]">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-[#6B7280]">Batch Number</label>
                <div className="relative">
                  <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={item.batchNumber}
                    onChange={(e) => handleItemChange(index, 'batchNumber', e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
                    placeholder="BATCH001"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-[#6B7280]">From Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={item.fromLocation}
                    onChange={(e) => handleItemChange(index, 'fromLocation', e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
                    placeholder="Aisle 1, Rack 2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-[#6B7280]">To Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={item.toLocation}
                    onChange={(e) => handleItemChange(index, 'toLocation', e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
                    placeholder="Aisle 3, Rack 5"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-[#6B7280]">Item Notes</label>
              <input
                type="text"
                value={item.notes}
                onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
                placeholder="Additional notes for this item"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Validation Notes */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#374151]">Transfer Completion Notes</label>
          <textarea
            value={validationNotes}
            onChange={(e) => setValidationNotes(e.target.value)}
            className="w-full px-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
            placeholder="Any observations or notes about the transfer..."
            rows="3"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          icon={<CheckCircle size={18} />}
          isLoading={isLoading}
        >
          Complete Transfer
        </Button>
      </div>
    </form>
  );
}
