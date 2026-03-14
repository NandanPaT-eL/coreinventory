'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2 } from 'lucide-react';
import { useWarehouses } from '../../../../hooks/useWarehouses';
import WarehouseForm from '../../../../components/warehouses/WarehouseForm';

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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link
          href="/settings/warehouses"
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Warehouses
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Add New Warehouse</h1>
          <p className="text-slate-600 mt-1">Create a new warehouse location</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
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
