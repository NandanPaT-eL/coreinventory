'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  Barcode, 
  Save,
  Tag,
  Scale,
  DollarSign,
  AlertCircle,
  FileText
} from 'lucide-react';
import Button from '../ui/Button';

export default function ProductForm({ initialData, onSubmit, isLoading, isEdit = false }) {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    sku: initialData?.sku || '',
    category: initialData?.category || '',
    description: initialData?.description || '',
    unitOfMeasure: initialData?.unitOfMeasure || 'pcs',
    costPrice: initialData?.costPrice || 0,
    sellingPrice: initialData?.sellingPrice || 0,
    reorderPoint: initialData?.reorderPoint || 10,
    isActive: initialData?.isActive !== false
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Format numeric fields
    const submitData = {
      ...formData,
      costPrice: Number(formData.costPrice),
      sellingPrice: Number(formData.sellingPrice),
      reorderPoint: Number(formData.reorderPoint)
    };
    
    onSubmit(submitData);
  };

  const unitOptions = [
    { value: 'pcs', label: 'Pieces (pcs)' },
    { value: 'kg', label: 'Kilogram (kg)' },
    { value: 'g', label: 'Gram (g)' },
    { value: 'l', label: 'Liter (l)' },
    { value: 'ml', label: 'Milliliter (ml)' },
    { value: 'm', label: 'Meter (m)' },
    { value: 'ft', label: 'Feet (ft)' },
    { value: 'box', label: 'Box' },
    { value: 'pack', label: 'Pack' },
    { value: 'dozen', label: 'Dozen' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6 space-y-4">
        <h3 className="display-font font-bold text-lg text-[#1a1a2e] flex items-center gap-2">
          <Package size={20} className="text-[#7C3AED]" />
          Basic Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#374151]">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
              placeholder="e.g., Steel Rods"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#374151]">
              SKU <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => handleChange('sku', e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
                placeholder="e.g., SR-001"
                required
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#374151]">Category</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
                placeholder="e.g., Raw Materials"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#374151]">
              Unit of Measure <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Scale className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <select
                value={formData.unitOfMeasure}
                onChange={(e) => handleChange('unitOfMeasure', e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200 appearance-none"
                required
                disabled={isLoading}
              >
                {unitOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#374151]">Description</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-4 w-4 text-[#9CA3AF]" />
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
              placeholder="Product description..."
              rows="3"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Pricing & Stock Rules */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6 space-y-4">
        <h3 className="display-font font-bold text-lg text-[#1a1a2e] flex items-center gap-2">
          <DollarSign size={20} className="text-[#7C3AED]" />
          Pricing & Stock Rules
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#374151]">Cost Price (₹)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.costPrice}
                onChange={(e) => handleChange('costPrice', e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#374151]">Selling Price (₹)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.sellingPrice}
                onChange={(e) => handleChange('sellingPrice', e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#374151]">
              Reorder Point
            </label>
            <div className="relative">
              <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                type="number"
                min="0"
                value={formData.reorderPoint}
                onChange={(e) => handleChange('reorderPoint', e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
                placeholder="10"
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-[#6B7280]">Alert when stock falls below this</p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => handleChange('isActive', e.target.checked)}
            className="w-4 h-4 rounded border-[#EDE9FE] text-[#7C3AED] focus:ring-[#7C3AED]"
            disabled={isLoading}
          />
          <label htmlFor="isActive" className="text-sm text-[#374151]">
            Active (product is available for operations)
          </label>
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
          {isEdit ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}
