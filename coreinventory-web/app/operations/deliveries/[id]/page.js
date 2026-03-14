'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DeliveryDetails from '../../../../components/deliveries/DeliveryDetails';
import ConfirmDialog from '../../../../components/shared/ConfirmDialog';
import { useDeliveries } from '../../../../hooks/useDeliveries';

export default function DeliveryDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { fetchDeliveryById, validateExistingDelivery, cancelExistingDelivery, loading } = useDeliveries();
  
  const [delivery, setDelivery] = useState(null);
  const [showValidateDialog, setShowValidateDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadDelivery();
  }, [id]);

  const loadDelivery = async () => {
    const data = await fetchDeliveryById(id);
    if (data) {
      setDelivery(data);
    }
  };

  const handleValidate = () => {
    router.push(`/operations/deliveries/${id}/validate`);
  };

  const handleCancelClick = () => {
    setShowCancelDialog(true);
  };

  const confirmCancel = async () => {
    setActionLoading(true);
    const result = await cancelExistingDelivery(id, 'Canceled from details page');
    setActionLoading(false);
    
    if (result.success) {
      setShowCancelDialog(false);
      loadDelivery(); // Reload to show updated status
    }
  };

  if (loading && !delivery) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-[#F3F0FF] rounded-xl w-64"></div>
        <div className="h-32 bg-[#F3F0FF] rounded-2xl"></div>
        <div className="h-64 bg-[#F3F0FF] rounded-2xl"></div>
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

  return (
    <>
      <DeliveryDetails
        delivery={delivery}
        onValidate={handleValidate}
        onCancel={handleCancelClick}
      />

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={confirmCancel}
        title="Cancel Delivery"
        message={`Are you sure you want to cancel delivery ${delivery.deliveryNumber}? This action cannot be undone.`}
        confirmText="Cancel Delivery"
        type="danger"
        isLoading={actionLoading}
      />
    </>
  );
}