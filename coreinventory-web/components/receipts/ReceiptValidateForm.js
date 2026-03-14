'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle, 
  Package, 
  Barcode,
  MapPin,
  Calendar,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import Button from '../ui/Button';

export default function ReceiptValidateForm({ receipt, onSubmit, isLoading }) {
  const router = useRouter();
  const [items, setItems] = useState(
    receipt.items.map(item => ({
      productId: item.productId._id || item.productId,
      expectedQuantity: item.expectedQuantity,
      receivedQuantity: item.receivedQuantity || item.expectedQuantity,
      batchNumber: item.batchNumber || '',
      expiryDate: item.expiryDate ? item.expiryDate.split('T')[0] : '',
      location: item.location || '',
      unitCost: item.unitCost
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
        receivedQuantity: Number(item.receivedQuantity),
        batchNumber: item.batchNumber,
        expiryDate: item.expiryDate,
        location: item.location
      })),
      notes: validationNotes
    });
  };

  const calculateVariance = (expected, received) => {
    const diff = received - expected;
    if (diff === 0) return { text: 'Match', color: 'text-emerald-600' };
    if (diff > 0) return { text: `+${diff} extra`, color: 'text-amber-600' };
    return { text: `${diff} short`, color: 'text-red-600' };
  };

  const hasVariance = items.some(
    item => Number(item.receivedQuantity) !== Number(item.expectedQuantity)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Validation Header */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-amber-800">Validation in Progress</h4>
          <p className="text-sm text-amber-700">
            Verify each item's quantity, batch number, expiry date, and storage location.
            This action will update inventory levels.
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-4">
        <h3 className="display-font font-bold text-lg text-[#1a1a2e] flex items-center gap-2">
          <Package size={20} className="text-[#7C3AED]" />
          Verify Received Items
        </h3>

        {items.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-[#1a1a2e]">
                {receipt.items[index].productId?.name || 'Product'} 
                <span className="text-sm font-normal text-[#6B7280] ml-2">
                  (Expected: {item.expectedQuantity})
                </span>
              </h4>
              <div className={`text-sm font-medium ${calculateVariance(item.expectedQuantity, item.receivedQuantity).color}`}>
                {calculateVariance(item.expectedQuantity, item.receivedQuantity).text}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[#6B7280]">
                  Received Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={item.receivedQuantity}
                  onChange={(e) => handleItemChange(index, 'receivedQuantity', e.target.value)}
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
                <label className="block text-xs font-medium text-[#6B7280]">Expiry Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                  <input
                    type="date"
                    value={item.expiryDate}
                    onChange={(e) => handleItemChange(index, 'expiryDate', e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-[#6B7280]">Storage Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={item.location}
                    onChange={(e) => handleItemChange(index, 'location', e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
                    placeholder="Aisle 1, Rack 2"
                  />
                </div>
              </div>
            </div>

            {/* Unit Cost (read-only) */}
            <div className="text-sm text-[#6B7280] flex items-center gap-1">
              <DollarSign size={14} />
              Unit Cost: ₹{item.unitCost}
            </div>
          </div>
        ))}
      </div>

      {/* Validation Notes */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#374151]">Validation Notes</label>
          <textarea
            value={validationNotes}
            onChange={(e) => setValidationNotes(e.target.value)}
            className="w-full px-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
            placeholder="Any observations or notes about the received items..."
            rows="3"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Warning for variance */}
      {hasVariance && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Some items have quantities that differ from what was expected. 
            This will be recorded in the system.
          </p>
        </div>
      )}

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
          Validate Receipt
        </Button>
      </div>
    </form>
  );
}
