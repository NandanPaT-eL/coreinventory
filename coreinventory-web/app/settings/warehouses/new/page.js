'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useWarehouses } from '../../../../hooks/useWarehouses';
import WarehouseForm from '../../../../components/warehouses/WarehouseForm';
import SectionHeading from '../../../../components/shared/SectionHeading';

export default function NewWarehousePage() {
  const router = useRouter();
  const { createNewWarehouse, loading } = useWarehouses();

  const handleSubmit = async (formData) => {
    const result = await createNewWarehouse(formData);
    if (result.success) {
      router.push('/settings/warehouses');
    } else {
      alert(result.error || 'Failed to create warehouse');
    }
  };

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
          badge="New Warehouse"
          title="Add"
          highlight="Location"
          description="Create a new warehouse to manage inventory"
          align="left"
          className="mb-8"
        />

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#EDE9FE] p-8">
          <WarehouseForm
            onSubmit={handleSubmit}
            isLoading={loading}
            isEdit={false}
          />
        </div>
      </div>
    </div>
  );
}
