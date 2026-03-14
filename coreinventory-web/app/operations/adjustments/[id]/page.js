'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdjustmentDetails from '../../../../components/adjustments/AdjustmentDetails';
import ConfirmDialog from '../../../../components/shared/ConfirmDialog';
import { useAdjustments } from '../../../../hooks/useAdjustments';

export default function AdjustmentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { fetchAdjustmentById, validateExistingAdjustment, cancelExistingAdjustment, loading } = useAdjustments();
  
  const [adjustment, setAdjustment] = useState(null);
  const [showValidateDialog, setShowValidateDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadAdjustment();
  }, [id]);

  const loadAdjustment = async () => {
    const data = await fetchAdjustmentById(id);
    if (data) {
      setAdjustment(data);
    }
  };

  const handleValidate = () => {
    router.push(`/operations/adjustments/${id}/validate`);
  };

  const handleCancelClick = () => {
    setShowCancelDialog(true);
  };

  const confirmCancel = async () => {
    setActionLoading(true);
    const result = await cancelExistingAdjustment(id, 'Canceled from details page');
    setActionLoading(false);
    
    if (result.success) {
      setShowCancelDialog(false);
      loadAdjustment(); // Reload to show updated status
    }
  };

  if (loading && !adjustment) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-[#F3F0FF] rounded-xl w-64"></div>
        <div className="h-32 bg-[#F3F0FF] rounded-2xl"></div>
        <div className="h-64 bg-[#F3F0FF] rounded-2xl"></div>
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

  return (
    <>
      <AdjustmentDetails
        adjustment={adjustment}
        onValidate={handleValidate}
        onCancel={handleCancelClick}
      />

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={confirmCancel}
        title="Cancel Adjustment"
        message={`Are you sure you want to cancel adjustment ${adjustment.adjustmentNumber}? This action cannot be undone.`}
        confirmText="Cancel Adjustment"
        type="danger"
        isLoading={actionLoading}
      />
    </>
  );
}