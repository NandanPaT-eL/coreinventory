'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TransferValidateForm from '../../../../../components/transfers/TransferValidateForm';
import { useTransfers } from '../../../../../hooks/useTransfers';

export default function ValidateTransferPage() {
  const { id } = useParams();
  const router = useRouter();
  const { fetchTransferById, validateExistingTransfer, loading } = useTransfers();
  
  const [transfer, setTransfer] = useState(null);

  useEffect(() => {
    loadTransfer();
  }, [id]);

  const loadTransfer = async () => {
    const data = await fetchTransferById(id);
    if (data) {
      setTransfer(data);
    }
  };

  const handleSubmit = async (validationData) => {
    const result = await validateExistingTransfer(id, validationData.items);
    
    if (result.success) {
      router.push(`/operations/transfers/${id}`);
    }
  };

  if (loading && !transfer) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-[#F3F0FF] rounded-xl w-64 mb-4"></div>
          <div className="h-64 bg-[#F3F0FF] rounded-2xl"></div>
        </div>
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

  if (transfer.status !== 'Draft') {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-[#1a1a2e]">Cannot Complete Transfer</h2>
        <p className="text-[#6B7280] mt-2">
          This transfer has already been {transfer.status.toLowerCase()} and cannot be completed.
        </p>
        <button
          onClick={() => router.push(`/operations/transfers/${id}`)}
          className="mt-4 px-6 py-2 bg-[#7C3AED] text-white rounded-xl hover:bg-[#6d28d9] transition-colors"
        >
          View Transfer
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="display-font text-2xl font-bold text-[#1a1a2e]">Complete Transfer</h1>
        <p className="text-[#6B7280] mt-1">
          Transfer #{transfer.transferNumber} from {transfer.fromWarehouse?.name} to {transfer.toWarehouse?.name}
        </p>
      </div>

      <TransferValidateForm
        transfer={transfer}
        onSubmit={handleSubmit}
        isLoading={loading}
      />
    </div>
  );
}