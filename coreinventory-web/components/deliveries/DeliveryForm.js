'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Package, 
  Calendar, 
  Plus, 
  Trash2, 
  Save,
  Hash,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Barcode,
  Truck
} from 'lucide-react';
import Button from '../ui/Button';
import { useProducts } from '../../hooks/useProducts';
import { useWarehouses } from '../../hooks/useWarehouses';

export default function DeliveryForm({ initialData, onSubmit, isLoading, isEdit = false }) {
  const router = useRouter();
  const { products, fetchProducts } = useProducts();
  const { warehouses, fetchWarehouses } = useWarehouses();
  
  const [formData, setFormData] = useState({
    customer: {
      name: initialData?.customer?.name || '',
      email: initialData?.customer?.email || '',
      phone: initialData?.customer?.phone || '',
      address: initialData?.customer?.address || ''
    },
    warehouseId: initialData?.warehouseId?._id || initialData?.warehouseId || '',
    items: initialData?.items?.length > 0 ? initialData.items.map(item => ({
      productId: item.productId?._id || item.productId || '',
      orderedQuantity: item.orderedQuantity || 1,
      unitPrice: item.unitPrice || 0,
      batchNumber: item.batchNumber || '',
      location: item.location || ''
    })) : [{
      productId: '',
      orderedQuantity: 1,
      unitPrice: 0,
      batchNumber: '',
      location: ''
    }],
    requestedDeliveryDate: initialData?.requestedDeliveryDate ? 
      initialData.requestedDeliveryDate.split('T')[0] : '',
    carrier: initialData?.carrier || '',
    trackingNumber: initialData?.trackingNumber || '',
    notes: initialData?.notes || ''
  });

  // Load products and warehouses for dropdowns
  useEffect(() => {
    fetchProducts({ limit: 100 });
    fetchWarehouses({ limit: 100 });
  }, []);

  const handleCustomerChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      customer: { ...prev.customer, [field]: value }
    }));
  };

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
        orderedQuantity: 1,
        unitPrice: 0,
        batchNumber: '',
        location: ''
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
        orderedQuantity: Number(item.orderedQuantity),
        unitPrice: Number(item.unitPrice)
      }))
    };
    
    onSubmit(submitData);
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => 
      sum + (Number(item.orderedQuantity) * Number(item.unitPrice)), 0
    ).toFixed(2);
  };

  const calculateTotalQuantity = () => {
    return formData.items.reduce((sum, item) => 
      sum + Number(item.orderedQuantity), 0
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Customer Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6 space-y-4">
        <h3 className="display-font font-bold text-lg text-[#1a1a2e] flex items-center gap-2">
          <User size={20} className="text-[#7C3AED]" />
          Customer Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#374151]">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.customer.name}
              onChange={(e) => handleCustomerChange('name', e.target.value)}
              className="w-full px-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
              placeholder="Enter customer name"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#374151]">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                type="email"
                value={formData.customer.email}
                onChange={(e) => handleCustomerChange('email', e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
                placeholder="customer@example.com"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#374151]">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                type="tel"
                value={formData.customer.phone}
                onChange={(e) => handleCustomerChange('phone', e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
                placeholder="+91 98765 43210"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#374151]">Delivery Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-[#9CA3AF]" />
            <textarea
              value={formData.customer.address}
              onChange={(e) => handleCustomerChange('address', e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
              placeholder="Customer address"
              rows="2"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Warehouse & Delivery Date */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#374151]">Requested Delivery Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                type="date"
                value={formData.requestedDeliveryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, requestedDeliveryDate: e.target.value }))}
                className="w-full pl-9 pr-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
        <h3 className="display-font font-bold text-lg text-[#1a1a2e] flex items-center gap-2 mb-4">
          <Truck size={20} className="text-[#7C3AED]" />
          Shipping Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#374151]">Carrier</label>
            <input
              type="text"
              value={formData.carrier}
              onChange={(e) => setFormData(prev => ({ ...prev, carrier: e.target.value }))}
              className="w-full px-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
              placeholder="e.g., Fast Delivery Co"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#374151]">Tracking Number</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                type="text"
                value={formData.trackingNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, trackingNumber: e.target.value }))}
                className="w-full pl-9 pr-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
                placeholder="FD123456789"
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
            Items
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      {product.name} ({product.sku}) - Stock: {product.currentStock || 0}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-[#6B7280]">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={item.orderedQuantity}
                  onChange={(e) => handleItemChange(index, 'orderedQuantity', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-[#6B7280]">
                  Unit Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
                    required
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
                <label className="block text-xs font-medium text-[#6B7280]">Location</label>
                <input
                  type="text"
                  value={item.location}
                  onChange={(e) => handleItemChange(index, 'location', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] text-sm"
                  placeholder="Aisle 1, Rack 2"
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
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#6B7280]">Total Value:</span>
              <span className="font-semibold text-lg text-[#7C3AED]">₹{calculateTotal()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#374151]">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full px-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
            placeholder="Any additional notes..."
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
          {isEdit ? 'Update Delivery' : 'Create Delivery'}
        </Button>
      </div>
    </form>
  );
}
