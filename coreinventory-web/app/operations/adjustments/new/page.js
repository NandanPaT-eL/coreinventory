'use client';

import { useRouter } from 'next/navigation';
import AdjustmentForm from '../../../../components/adjustments/AdjustmentForm';
import { useAdjustments } from '../../../../hooks/useAdjustments';

export default function NewAdjustmentPage() {
  const router = useRouter();
  const { createNewAdjustment, loading } = useAdjustments();

  const handleSubmit = async (formData) => {
    const result = await createNewAdjustment(formData);
    
    if (result.success) {
      router.push(`/operations/adjustments/${result.data._id}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="display-font text-2xl font-bold text-[#1a1a2e]">Create New Adjustment</h1>
        <p className="text-[#6B7280] mt-1">Fix stock discrepancies by adjusting quantities</p>
      </div>

      <AdjustmentForm
        onSubmit={handleSubmit}
        isLoading={loading}
        isEdit={false}
      />
    </div>
  );
}
