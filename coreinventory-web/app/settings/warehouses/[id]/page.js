'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2, Loader2 } from 'lucide-react';
import { useWarehouses } from '../../../../hooks/useWarehouses';
import WarehouseForm from '../../../../components/warehouses/WarehouseForm';

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
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !warehouse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Warehouse not found</h2>
          <p className="text-slate-600 mb-4">The warehouse you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/settings/warehouses"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Warehouses
          </Link>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-slate-900">Edit Warehouse</h1>
          <p className="text-slate-600 mt-1">Update warehouse information</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
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