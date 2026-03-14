'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DeliveryValidateForm from '../../../../../components/deliveries/DeliveryValidateForm';
import { useDeliveries } from '../../../../../hooks/useDeliveries';

export default function ValidateDeliveryPage() {
  const { id } = useParams();
  const router = useRouter();
  const { fetchDeliveryById, validateExistingDelivery, loading } = useDeliveries();
  
  const [delivery, setDelivery] = useState(null);

  useEffect(() => {
    loadDelivery();
  }, [id]);

  const loadDelivery = async () => {
    const data = await fetchDeliveryById(id);
    if (data) {
      setDelivery(data);
    }
  };

  const handleSubmit = async (validationData) => {
    const result = await validateExistingDelivery(id, validationData.items);
    
    if (result.success) {
      router.push(`/operations/deliveries/${id}`);
    }
  };

  if (loading && !delivery) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-[#F3F0FF] rounded-xl w-64 mb-4"></div>
          <div className="h-64 bg-[#F3F0FF] rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-[#1a1a2e]">Delivery not found</h2>
        <p className="text-[#6B7280] mt-2">The delivery you're looking for doesn't exist.</p>
      </div>
    );
  }

  if (delivery.status !== 'Draft' && delivery.status !== 'Ready') {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-[#1a1a2e]">Cannot Dispatch</h2>
        <p className="text-[#6B7280] mt-2">
          This delivery has already been {delivery.status.toLowerCase()} and cannot be dispatched.
        </p>
        <button
          onClick={() => router.push(`/operations/deliveries/${id}`)}
          className="mt-4 px-6 py-2 bg-[#7C3AED] text-white rounded-xl hover:bg-[#6d28d9] transition-colors"
        >
          View Delivery
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="display-font text-2xl font-bold text-[#1a1a2e]">Confirm Dispatch</h1>
        <p className="text-[#6B7280] mt-1">
          Delivery #{delivery.deliveryNumber} to {delivery.customer.name}
        </p>
      </div>

      <DeliveryValidateForm
        delivery={delivery}
        onSubmit={handleSubmit}
        isLoading={loading}
      />
    </div>
  );
}