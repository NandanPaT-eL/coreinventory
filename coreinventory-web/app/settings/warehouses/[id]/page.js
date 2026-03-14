'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2, Loader2 } from 'lucide-react';
import { useWarehouses } from '../../../../hooks/useWarehouses';
import WarehouseForm from '../../../../components/warehouses/WarehouseForm';
import SectionHeading from '../../../../components/shared/SectionHeading';

export default function EditWarehousePage({ params }) {
  const router = useRouter();
  const { id } = params;
  const { fetchWarehouseById, updateExistingWarehouse, loading } = useWarehouses();
  
  const [warehouse, setWarehouse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWarehouse();
  }, [id]);

  const loadWarehouse = async () => {
    setIsLoading(true);
    try {
      const data = await fetchWarehouseById(id);
      if (data) {
        setWarehouse(data);
      } else {
        setError('Warehouse not found');
      }
    } catch (err) {
      setError('Failed to load warehouse');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    const result = await updateExistingWarehouse(id, formData);
    if (result.success) {
      router.push('/settings/warehouses');
    } else {
      alert(result.error || 'Failed to update warehouse');
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#7C3AED]" />
      </div>
    );
  }

  if (error || !warehouse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-[#F3F0FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 size={32} className="text-[#7C3AED]" />
          </div>
          <h2 className="display-font text-xl font-bold text-[#1a1a2e] mb-2">Warehouse not found</h2>
          <p className="text-[#6B7280] mb-6">The warehouse you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/settings/warehouses"
            className="inline-flex items-center text-[#7C3AED] hover:text-[#6d28d9] font-semibold"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Warehouses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link
          href="/settings/warehouses"
          className="inline-flex items-center text-sm text-[#6B7280] hover:text-[#7C3AED] mb-6 transition-colors group"
        >
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Warehouses
        </Link>

        {/* Header */}
        <SectionHeading
          badge="Edit Warehouse"
          title="Update"
          highlight={warehouse.name}
          description="Modify warehouse information and settings"
          align="left"
          className="mb-8"
        />

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#EDE9FE] p-8">
          <WarehouseForm
            initialData={warehouse}
            onSubmit={handleSubmit}
            isLoading={loading}
            isEdit={true}
          />
        </div>
      </div>
    </div>
  );
}