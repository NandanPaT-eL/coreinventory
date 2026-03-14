'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  Plus, 
  Trash2, 
  Save,
  Building,
  Barcode,
  AlertTriangle,
  FileText
} from 'lucide-react';
import Button from '../ui/Button';
import { useProducts } from '../../hooks/useProducts';
import { useWarehouses } from '../../hooks/useWarehouses';

export default function AdjustmentForm({ initialData, onSubmit, isLoading, isEdit = false }) {
  const router = useRouter();
  const { products, fetchProducts } = useProducts();
  const { warehouses, fetchWarehouses } = useWarehouses();
  
  const [formData, setFormData] = useState({
    warehouseId: initialData?.warehouseId?._id || initialData?.warehouseId || '',
    items: initialData?.items?.length > 0 ? initialData.items.map(item => ({
      productId: item.productId?._id || item.productId || '',
      expectedQuantity: item.expectedQuantity || 0,
      countedQuantity: item.countedQuantity || 0,
      reason: item.reason || 'correction',
      notes: item.notes || ''
    })) : [{
      productId: '',
      expectedQuantity: 0,
      countedQuantity: 0,
      reason: 'correction',
      notes: ''
    }],
    notes: initialData?.notes || ''
  });

  const [selectedProductDetails, setSelectedProductDetails] = useState({});
  const [availableStock, setAvailableStock] = useState({});

  // Load products and warehouses
  useEffect(() => {
    fetchProducts({ limit: 100 });
    fetchWarehouses({ limit: 100 });
  }, []);

  // Fetch expected quantity when product and warehouse are selected
  useEffect(() => {
    formData.items.forEach(async (item, index) => {
      if (item.productId && formData.warehouseId) {
        const product = products.find(p => p._id === item.productId);
        if (product) {
          const stockInWarehouse = product.stock?.find(
            s => s.warehouseId === formData.warehouseId
          );
          
          const currentStock = stockInWarehouse?.quantity || 0;
          
          setAvailableStock(prev => ({
            ...prev,
            [index]: currentStock
          }));

          // Auto-fill expected quantity if not already set
          if (!item.expectedQuantity || item.expectedQuantity === 0) {
            handleItemChange(index, 'expectedQuantity', currentStock);
          }

          setSelectedProductDetails(prev => ({
            ...prev,
            [index]: {
              name: product.name,
              sku: product.sku,
              unitOfMeasure: product.unitOfMeasure || 'pcs'
            }
          }));
        }
      }
    });
  }, [formData.items, formData.warehouseId, products]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // If counted quantity changes, ensure it's a number
    if (field === 'countedQuantity') {
      updatedItems[index].countedQuantity = Number(value);
    }
    
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        productId: '',
        expectedQuantity: 0,
        countedQuantity: 0,
        reason: 'correction',
        notes: ''
      }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, items: updatedItems }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Format the data for submission
    const submitData = {
      ...formData,
      items: formData.items.map(item => ({
        ...item,
        expectedQuantity: Number(item.expectedQuantity),
        countedQuantity: Number(item.countedQuantity)
      }))
    };
    
    onSubmit(submitData);
  };

  const calculateVariance = (expected, counted) => {
    return counted - expected;
  };

  const reasonOptions = [
    { value: 'correction', label: 'Correction' },
    { value: 'damage', label: 'Damage' },
    { value: 'loss', label: 'Loss' },
    { value: 'theft', label: 'Theft' },
    { value: 'found', label: 'Found' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Warehouse Selection */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
        <h3 className="display-font font-bold text-lg text-[#1a1a2e] flex items-center gap-2 mb-4">
          <Building size={20} className="text-[#7C3AED]" />
          Warehouse
        </h3>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#374151]">
            Warehouse <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.warehouseId}
            onChange={(e) => setFormData(prev => ({ ...prev, warehouseId: e.target.value }))}
            className="w-full px-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
            required
            disabled={isLoading}
          >
            <option value="">Select warehouse</option>
            {warehouses.map(warehouse => (
              <option key={warehouse._id} value={warehouse._id}>
                {warehouse.name} ({warehouse.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="display-font font-bold text-lg text-[#1a1a2e] flex items-center gap-2">
            <Package size={20} className="text-[#7C3AED]" />
            Items to Adjust
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addItem}
            icon={<Plus size={16} />}
          >
            Add Item
          </Button>
        </div>

        {formData.items.map((item, index) => {
          const variance = calculateVariance(item.expectedQuantity, item.countedQuantity);
          
          return (
            <div key={index} className="bg-[#F9F7FF] rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-[#1a1a2e]">Item #{index + 1}</h4>
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-[#6B7280]">
                    Product <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={item.productId}
                    onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
                    required
                  >
                    <option value="">Select product</option>
                    {products.map(product => (
                      <option key={product._id} value={product._id}>
                        {product.name} ({product.sku})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-[#6B7280]">Reason</label>
                  <select
                    value={item.reason}
                    onChange={(e) => handleItemChange(index, 'reason', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
                  >
                    {reasonOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-[#6B7280]">
                    Expected Quantity
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={item.expectedQuantity}
                      onChange={(e) => handleItemChange(index, 'expectedQuantity', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
                      readOnly={!isEdit}
                    />
                  </div>
                  {availableStock[index] !== undefined && (
                    <p className="text-xs text-[#6B7280]">
                      System stock: {availableStock[index]} {selectedProductDetails[index]?.unitOfMeasure}
                    </p>
                  )}
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
                    className="w-full px-4 py-2.5 bg-white border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
                    required
                  />
                </div>
              </div>

              {/* Variance Indicator */}
              {item.productId && (
                <div className={`p-3 rounded-xl ${
                  variance === 0 ? 'bg-emerald-50' :
                  variance > 0 ? 'bg-amber-50' : 'bg-red-50'
                }`}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className={
                      variance === 0 ? 'text-emerald-600' :
                      variance > 0 ? 'text-amber-600' : 'text-red-600'
                    } />
                    <span className={`text-sm font-medium ${
                      variance === 0 ? 'text-emerald-700' :
                      variance > 0 ? 'text-amber-700' : 'text-red-700'
                    }`}>
                      {variance === 0 ? 'Stock matches count' :
                       variance > 0 ? `Found ${variance} extra units` :
                       `Missing ${Math.abs(variance)} units`}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-xs font-medium text-[#6B7280]">Item Notes</label>
                <input
                  type="text"
                  value={item.notes}
                  onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
                  placeholder="Optional notes for this item"
                />
              </div>
            </div>
          );
        })}

        {/* Summary */}
        <div className="flex justify-end pt-4 border-t border-[#EDE9FE]">
          <div className="text-right space-y-2">
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#6B7280]">Total Items:</span>
              <span className="font-semibold text-[#1a1a2e]">{formData.items.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#374151]">Adjustment Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full px-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
            placeholder="Any additional notes about this adjustment..."
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
          icon={<Save size={18} />}
          isLoading={isLoading}
        >
          {isEdit ? 'Update Adjustment' : 'Create Adjustment'}
        </Button>
      </div>
    </form>
  );
}
