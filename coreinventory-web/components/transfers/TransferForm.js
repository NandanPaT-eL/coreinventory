'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeftRight,
  Package, 
  Calendar, 
  Plus, 
  Trash2, 
  Save,
  Building,
  Barcode,
  MapPin
} from 'lucide-react';
import Button from '../ui/Button';
import { useProducts } from '../../hooks/useProducts';
import { useWarehouses } from '../../hooks/useWarehouses';

export default function TransferForm({ initialData, onSubmit, isLoading, isEdit = false }) {
  const router = useRouter();
  const { products, fetchProducts } = useProducts();
  const { warehouses, fetchWarehouses } = useWarehouses();
  
  const [formData, setFormData] = useState({
    fromWarehouseId: initialData?.fromWarehouse?._id || initialData?.fromWarehouseId || '',
    toWarehouseId: initialData?.toWarehouse?._id || initialData?.toWarehouseId || '',
    items: initialData?.items?.length > 0 ? initialData.items.map(item => ({
      productId: item.productId?._id || item.productId || '',
      quantity: item.quantity || 1,
      fromLocation: item.fromLocation || '',
      toLocation: item.toLocation || '',
      batchNumber: item.batchNumber || '',
      notes: item.notes || ''
    })) : [{
      productId: '',
      quantity: 1,
      fromLocation: '',
      toLocation: '',
      batchNumber: '',
      notes: ''
    }],
    scheduledDate: initialData?.scheduledDate ? 
      initialData.scheduledDate.split('T')[0] : '',
    notes: initialData?.notes || ''
  });

  const [selectedProductDetails, setSelectedProductDetails] = useState({});

  // Load products and warehouses for dropdowns
  useEffect(() => {
    fetchProducts({ limit: 100 });
    fetchWarehouses({ limit: 100 });
  }, []);

  // Fetch product stock when product is selected
  useEffect(() => {
    formData.items.forEach(async (item, index) => {
      if (item.productId && formData.fromWarehouseId) {
        const product = products.find(p => p._id === item.productId);
        if (product) {
          const stockInWarehouse = product.stock?.find(
            s => s.warehouseId === formData.fromWarehouseId
          );
          setSelectedProductDetails(prev => ({
            ...prev,
            [index]: {
              availableStock: stockInWarehouse?.quantity || 0,
              unitOfMeasure: product.unitOfMeasure || 'pcs'
            }
          }));
        }
      }
    });
  }, [formData.items, formData.fromWarehouseId, products]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        productId: '',
        quantity: 1,
        fromLocation: '',
        toLocation: '',
        batchNumber: '',
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
        quantity: Number(item.quantity)
      }))
    };
    
    onSubmit(submitData);
  };

  const calculateTotalQuantity = () => {
    return formData.items.reduce((sum, item) => sum + Number(item.quantity), 0);
  };

  const isSameWarehouse = formData.fromWarehouseId && formData.toWarehouseId && 
    formData.fromWarehouseId === formData.toWarehouseId;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Warning for same warehouse */}
      {isSameWarehouse && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-800">
            <strong>Warning:</strong> Source and destination warehouses are the same. 
            This will create a location-to-location transfer within the same warehouse.
          </p>
        </div>
      )}

      {/* Warehouse Selection */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
        <h3 className="display-font font-bold text-lg text-[#1a1a2e] flex items-center gap-2 mb-4">
          <Building size={20} className="text-[#7C3AED]" />
          Transfer Route
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#374151]">
              From Warehouse <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.fromWarehouseId}
              onChange={(e) => setFormData(prev => ({ ...prev, fromWarehouseId: e.target.value }))}
              className="w-full px-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
              required
              disabled={isLoading}
            >
              <option value="">Select source warehouse</option>
              {warehouses.map(warehouse => (
                <option key={warehouse._id} value={warehouse._id}>
                  {warehouse.name} ({warehouse.code})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#374151]">
              To Warehouse <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.toWarehouseId}
              onChange={(e) => setFormData(prev => ({ ...prev, toWarehouseId: e.target.value }))}
              className="w-full px-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
              required
              disabled={isLoading}
            >
              <option value="">Select destination warehouse</option>
              {warehouses.map(warehouse => (
                <option key={warehouse._id} value={warehouse._id}>
                  {warehouse.name} ({warehouse.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#374151]">Scheduled Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                className="w-full pl-9 pr-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="display-font font-bold text-lg text-[#1a1a2e] flex items-center gap-2">
            <Package size={20} className="text-[#7C3AED]" />
            Items to Transfer
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

        {formData.items.map((item, index) => (
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
                  {products.map(product => {
                    const stock = product.stock?.find(
                      s => s.warehouseId === formData.fromWarehouseId
                    );
                    return (
                      <option key={product._id} value={product._id}>
                        {product.name} ({product.sku}) - Available: {stock?.quantity || 0} {product.unitOfMeasure}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-[#6B7280]">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedProductDetails[index]?.availableStock || 999999}
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
                  required
                />
                {selectedProductDetails[index] && (
                  <p className="text-xs text-[#6B7280]">
                    Available: {selectedProductDetails[index].availableStock} {selectedProductDetails[index].unitOfMeasure}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[#6B7280]">From Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={item.fromLocation}
                    onChange={(e) => handleItemChange(index, 'fromLocation', e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
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
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
                    placeholder="Aisle 3, Rack 5"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[#6B7280]">Batch Number</label>
                <div className="relative">
                  <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={item.batchNumber}
                    onChange={(e) => handleItemChange(index, 'batchNumber', e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
                    placeholder="BATCH001"
                  />
                </div>
              </div>

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
          </div>
        ))}

        {/* Summary */}
        <div className="flex justify-end pt-4 border-t border-[#EDE9FE]">
          <div className="text-right space-y-2">
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#6B7280]">Total Items:</span>
              <span className="font-semibold text-[#1a1a2e]">{formData.items.length}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#6B7280]">Total Quantity:</span>
              <span className="font-semibold text-[#1a1a2e]">{calculateTotalQuantity()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#374151]">Transfer Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full px-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
            placeholder="Any additional notes about this transfer..."
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
          {isEdit ? 'Update Transfer' : 'Create Transfer'}
        </Button>
      </div>
    </form>
  );
}
