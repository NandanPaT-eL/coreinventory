'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdjustmentValidateForm from '../../../../../components/adjustments/AdjustmentValidateForm';
import { useAdjustments } from '../../../../../hooks/useAdjustments';

export default function ValidateAdjustmentPage() {
  const { id } = useParams();
  const router = useRouter();
  const { fetchAdjustmentById, validateExistingAdjustment, loading } = useAdjustments();
  
  const [adjustment, setAdjustment] = useState(null);

  useEffect(() => {
    loadAdjustment();
  }, [id]);

  const loadAdjustment = async () => {
    const data = await fetchAdjustmentById(id);
    if (data) {
      setAdjustment(data);
    }
  };

  const handleSubmit = async (validationData) => {
    const result = await validateExistingAdjustment(id, validationData.items);
    
    if (result.success) {
      router.push(`/operations/adjustments/${id}`);
    }
  };

  if (loading && !adjustment) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-[#F3F0FF] rounded-xl w-64 mb-4"></div>
          <div className="h-64 bg-[#F3F0FF] rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!adjustment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-[#1a1a2e]">Adjustment not found</h2>
        <p className="text-[#6B7280] mt-2">The adjustment you're looking for doesn't exist.</p>
      </div>
    );
  }

  if (adjustment.status !== 'Draft') {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-[#1a1a2e]">Cannot Apply Adjustment</h2>
        <p className="text-[#6B7280] mt-2">
          This adjustment has already been {adjustment.status.toLowerCase()} and cannot be applied.
        </p>
        <button
          onClick={() => router.push(`/operations/adjustments/${id}`)}
          className="mt-4 px-6 py-2 bg-[#7C3AED] text-white rounded-xl hover:bg-[#6d28d9] transition-colors"
        >
          View Adjustment
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="display-font text-2xl font-bold text-[#1a1a2e]">Apply Adjustment</h1>
        <p className="text-[#6B7280] mt-1">
          Adjustment #{adjustment.adjustmentNumber} in {adjustment.warehouseId?.name}
        </p>
      </div>

      <AdjustmentValidateForm
        adjustment={adjustment}
        onSubmit={handleSubmit}
        isLoading={loading}
      />
    </div>
  );
}