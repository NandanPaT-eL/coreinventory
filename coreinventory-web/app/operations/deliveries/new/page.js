'use client';

import { useRouter } from 'next/navigation';
import DeliveryForm from '../../../../components/deliveries/DeliveryForm';
import { useDeliveries } from '../../../../hooks/useDeliveries';

export default function NewDeliveryPage() {
  const router = useRouter();
  const { createNewDelivery, loading } = useDeliveries();

  const handleSubmit = async (formData) => {
    const result = await createNewDelivery(formData);
    
    if (result.success) {
      router.push(`/operations/deliveries/${result.data._id}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="display-font text-2xl font-bold text-[#1a1a2e]">Create New Delivery</h1>
        <p className="text-[#6B7280] mt-1">Add a new outgoing inventory delivery</p>
      </div>

      <DeliveryForm
        onSubmit={handleSubmit}
        isLoading={loading}
        isEdit={false}
      />
    </div>
  );
}
