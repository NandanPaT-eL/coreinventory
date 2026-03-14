'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle, 
  Package, 
  AlertCircle,
  Building
} from 'lucide-react';
import Button from '../ui/Button';

export default function AdjustmentValidateForm({ adjustment, onSubmit, isLoading }) {
  const router = useRouter();
  const [items, setItems] = useState(
    adjustment.items.map(item => ({
      productId: item.productId._id || item.productId,
      expectedQuantity: item.expectedQuantity,
      countedQuantity: item.countedQuantity,
      reason: item.reason || 'correction',
      notes: item.notes || '',
      verified: true
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
        countedQuantity: Number(item.countedQuantity),
        reason: item.reason,
        notes: item.notes
      })),
      notes: validationNotes
    });
  };

  const calculateVariance = (expected, counted) => {
    return counted - expected;
  };

  const getVarianceColor = (variance) => {
    if (variance === 0) return 'text-emerald-600';
    if (variance > 0) return 'text-amber-600';
    return 'text-red-600';
  };

  const hasVariance = items.some(
    item => Number(item.countedQuantity) !== Number(item.expectedQuantity)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Validation Header */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-amber-800">Apply Stock Adjustment</h4>
          <p className="text-sm text-amber-700">
            Review and confirm the counted quantities. This will update inventory levels 
            in {adjustment.warehouseId?.name}.
          </p>
        </div>
      </div>

      {/* Warehouse Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
        <div className="flex items-center gap-3">
          <Building size={20} className="text-[#7C3AED]" />
          <div>
            <p className="text-sm text-[#6B7280]">Warehouse</p>
            <p className="font-semibold text-[#1a1a2e]">{adjustment.warehouseId?.name}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-4">
        <h3 className="display-font font-bold text-lg text-[#1a1a2e] flex items-center gap-2">
          <Package size={20} className="text-[#7C3AED]" />
          Verify Adjusted Items
        </h3>

        {items.map((item, index) => {
          const variance = calculateVariance(item.expectedQuantity, item.countedQuantity);
          
          return (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-[#1a1a2e]">
                  {adjustment.items[index].productId?.name || 'Product'}
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-[#6B7280]">Expected Quantity</label>
                  <input
                    type="number"
                    value={item.expectedQuantity}
                    className="w-full px-4 py-2.5 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl text-sm"
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-[#6B7280]">
                    Counted Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={item.countedQuantity}
                    onChange={(e) => handleItemChange(index, 'countedQuantity', e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-[#6B7280]">Reason</label>
                  <select
                    value={item.reason}
                    onChange={(e) => handleItemChange(index, 'reason', e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
                  >
                    <option value="correction">Correction</option>
                    <option value="damage">Damage</option>
                    <option value="loss">Loss</option>
                    <option value="theft">Theft</option>
                    <option value="found">Found</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Variance Indicator */}
              <div className={`p-3 rounded-xl ${
                variance === 0 ? 'bg-emerald-50' :
                variance > 0 ? 'bg-amber-50' : 'bg-red-50'
              }`}>
                <p className={`text-sm font-medium ${
                  variance === 0 ? 'text-emerald-700' :
                  variance > 0 ? 'text-amber-700' : 'text-red-700'
                }`}>
                  {variance === 0 ? '✓ Stock matches count' :
                   variance > 0 ? `⚠️ Found ${variance} extra units` :
                   `⚠️ Missing ${Math.abs(variance)} units`}
                </p>
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
          );
        })}
      </div>

      {/* Validation Notes */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#374151]">Adjustment Notes</label>
          <textarea
            value={validationNotes}
            onChange={(e) => setValidationNotes(e.target.value)}
            className="w-full px-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
            placeholder="Any final notes about this adjustment..."
            rows="3"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Warning for variance */}
      {hasVariance && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Some items have quantity variances. This will update 
            inventory levels in the system.
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
          Apply Adjustment
        </Button>
      </div>
    </form>
  );
}
