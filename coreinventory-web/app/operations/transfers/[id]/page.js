'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TransferDetails from '../../../../components/transfers/TransferDetails';
import ConfirmDialog from '../../../../components/shared/ConfirmDialog';
import { useTransfers } from '../../../../hooks/useTransfers';

export default function TransferDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { fetchTransferById, validateExistingTransfer, cancelExistingTransfer, loading } = useTransfers();
  
  const [transfer, setTransfer] = useState(null);
  const [showValidateDialog, setShowValidateDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadTransfer();
  }, [id]);

  const loadTransfer = async () => {
    const data = await fetchTransferById(id);
    if (data) {
      setTransfer(data);
    }
  };

  const handleValidate = () => {
    router.push(`/operations/transfers/${id}/validate`);
  };

  const handleCancelClick = () => {
    setShowCancelDialog(true);
  };

  const confirmCancel = async () => {
    setActionLoading(true);
    const result = await cancelExistingTransfer(id, 'Canceled from details page');
    setActionLoading(false);
    
    if (result.success) {
      setShowCancelDialog(false);
      loadTransfer(); // Reload to show updated status
    }
  };

  if (loading && !transfer) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-[#F3F0FF] rounded-xl w-64"></div>
        <div className="h-32 bg-[#F3F0FF] rounded-2xl"></div>
        <div className="h-64 bg-[#F3F0FF] rounded-2xl"></div>
      </div>
    );
  }

  if (!transfer) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-[#1a1a2e]">Transfer not found</h2>
        <p className="text-[#6B7280] mt-2">The transfer you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <>
      <TransferDetails
        transfer={transfer}
        onValidate={handleValidate}
        onCancel={handleCancelClick}
      />

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={confirmCancel}
        title="Cancel Transfer"
        message={`Are you sure you want to cancel transfer ${transfer.transferNumber}? This action cannot be undone.`}
        confirmText="Cancel Transfer"
        type="danger"
        isLoading={actionLoading}
      />
    </>
  );
}