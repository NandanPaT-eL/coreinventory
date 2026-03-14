'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReceiptDetails from '../../../../components/receipts/ReceiptDetails';
import ConfirmDialog from '../../../../components/shared/ConfirmDialog';
import { useReceipts } from '../../../../hooks/useReceipts';

export default function ReceiptDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { fetchReceiptById, validateExistingReceipt, cancelExistingReceipt, loading } = useReceipts();
  
  const [receipt, setReceipt] = useState(null);
  const [showValidateDialog, setShowValidateDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadReceipt();
  }, [id]);

  const loadReceipt = async () => {
    const data = await fetchReceiptById(id);
    if (data) {
      setReceipt(data);
    }
  };

  const handleValidate = () => {
    router.push(`/operations/receipts/${id}/validate`);
  };

  const handleCancelClick = () => {
    setShowCancelDialog(true);
  };

  const confirmCancel = async () => {
    setActionLoading(true);
    const result = await cancelExistingReceipt(id, 'Canceled from details page');
    setActionLoading(false);
    
    if (result.success) {
      setShowCancelDialog(false);
      loadReceipt(); // Reload to show updated status
    }
  };

  if (loading && !receipt) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-[#F3F0FF] rounded-xl w-64"></div>
        <div className="h-32 bg-[#F3F0FF] rounded-2xl"></div>
        <div className="h-64 bg-[#F3F0FF] rounded-2xl"></div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-[#1a1a2e]">Receipt not found</h2>
        <p className="text-[#6B7280] mt-2">The receipt you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <>
      <ReceiptDetails
        receipt={receipt}
        onValidate={handleValidate}
        onCancel={handleCancelClick}
      />

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={confirmCancel}
        title="Cancel Receipt"
        message={`Are you sure you want to cancel receipt ${receipt.receiptNumber}? This action cannot be undone.`}
        confirmText="Cancel Receipt"
        type="danger"
        isLoading={actionLoading}
      />
    </>
  );
}