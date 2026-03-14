'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, MapPin, Phone, User, Mail, Hash, Save } from 'lucide-react';
import Button from '../ui/Button';

export default function WarehouseForm({ initialData, onSubmit, isLoading, isEdit = false }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    code: initialData?.code || '',
    location: {
      address: initialData?.location?.address || '',
      city: initialData?.location?.city || '',
      state: initialData?.location?.state || '',
      country: initialData?.location?.country || '',
      zipCode: initialData?.location?.zipCode || ''
    },
    contact: {
      phone: initialData?.contact?.phone || '',
      email: initialData?.contact?.email || '',
      manager: initialData?.contact?.manager || ''
    },
    metadata: {
      capacity: initialData?.metadata?.capacity || '',
      type: initialData?.metadata?.type || 'finished goods',
      temperature: initialData?.metadata?.temperature || 'ambient'
    },
    isActive: initialData?.isActive ?? true
  });

  const handleChange = (section, field, value) => {
    if (section === 'root') {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="display-font font-bold text-lg text-[#1a1a2e] flex items-center gap-2">
          <Building2 size={20} className="text-[#7C3AED]" />
          Basic Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#374151]">
              Warehouse Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('root', 'name', e.target.value)}
              className="w-full px-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
              placeholder="e.g., Main Warehouse"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#374151]">
              Warehouse Code <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleChange('root', 'code', e.target.value.toUpperCase())}
                className="w-full pl-9 pr-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200 font-mono uppercase"
                placeholder="WH001"
                required
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="space-y-4">
        <h3 className="display-font font-bold text-lg text-[#1a1a2e] flex items-center gap-2">
          <MapPin size={20} className="text-[#7C3AED]" />
          Location Details
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#374151]">Address</label>
            <input
              type="text"
              value={formData.location.address}
              onChange={(e) => handleChange('location', 'address', e.target.value)}
              className="w-full px-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
              placeholder="Street address"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#374151]">City</label>
              <input
                type="text"
                value={formData.location.city}
                onChange={(e) => handleChange('location', 'city', e.target.value)}
                className="w-full px-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
                placeholder="Mumbai"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#374151]">State</label>
              <input
                type="text"
                value={formData.location.state}
                onChange={(e) => handleChange('location', 'state', e.target.value)}
                className="w-full px-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
                placeholder="Maharashtra"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#374151]">Country</label>
              <input
                type="text"
                value={formData.location.country}
                onChange={(e) => handleChange('location', 'country', e.target.value)}
                className="w-full px-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
                placeholder="India"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#374151]">ZIP Code</label>
              <input
                type="text"
                value={formData.location.zipCode}
                onChange={(e) => handleChange('location', 'zipCode', e.target.value)}
                className="w-full px-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
                placeholder="400001"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="display-font font-bold text-lg text-[#1a1a2e] flex items-center gap-2">
          <Phone size={20} className="text-[#7C3AED]" />
          Contact Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#374151]">Manager Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                type="text"
                value={formData.contact.manager}
                onChange={(e) => handleChange('contact', 'manager', e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
                placeholder="Rajesh Kumar"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#374151]">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                type="tel"
                value={formData.contact.phone}
                onChange={(e) => handleChange('contact', 'phone', e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
                placeholder="+91 98765 43210"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#374151]">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
            <input
              type="email"
              value={formData.contact.email}
              onChange={(e) => handleChange('contact', 'email', e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
              placeholder="warehouse@company.com"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Additional Metadata */}
      <div className="space-y-4">
        <h3 className="display-font font-bold text-lg text-[#1a1a2e]">Additional Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#374151]">Capacity</label>
            <input
              type="text"
              value={formData.metadata.capacity}
              onChange={(e) => handleChange('metadata', 'capacity', e.target.value)}
              className="w-full px-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
              placeholder="15000 sqft"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#374151]">Type</label>
            <select
              value={formData.metadata.type}
              onChange={(e) => handleChange('metadata', 'type', e.target.value)}
              className="w-full px-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
              disabled={isLoading}
            >
              <option value="finished goods">Finished Goods</option>
              <option value="raw materials">Raw Materials</option>
              <option value="distribution">Distribution Center</option>
              <option value="tech hub">Tech Hub</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#374151]">Temperature</label>
            <select
              value={formData.metadata.temperature}
              onChange={(e) => handleChange('metadata', 'temperature', e.target.value)}
              className="w-full px-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
              disabled={isLoading}
            >
              <option value="ambient">Ambient</option>
              <option value="refrigerated">Refrigerated</option>
              <option value="frozen">Frozen</option>
              <option value="controlled">Controlled</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#374151]">Status</label>
            <select
              value={formData.isActive}
              onChange={(e) => handleChange('root', 'isActive', e.target.value === 'true')}
              className="w-full px-4 py-3 bg-[#F9F7FF] border border-[#EDE9FE] rounded-xl focus:ring-0 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all duration-200"
              disabled={isLoading}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F3F0FF]">
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
          icon={<Save size={16} />}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : isEdit ? 'Update Warehouse' : 'Create Warehouse'}
        </Button>
      </div>
    </form>
  );
}
