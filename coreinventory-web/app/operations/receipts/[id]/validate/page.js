'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReceiptValidateForm from '../../../../../components/receipts/ReceiptValidateForm';
import { useReceipts } from '../../../../../hooks/useReceipts';

export default function ValidateReceiptPage() {
  const { id } = useParams();
  const router = useRouter();
  const { fetchReceiptById, validateExistingReceipt, loading } = useReceipts();
  
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    loadReceipt();
  }, [id]);

  const loadReceipt = async () => {
    const data = await fetchReceiptById(id);
    if (data) {
      setReceipt(data);
    }
  };

  const handleSubmit = async (validationData) => {
    const result = await validateExistingReceipt(id, validationData.items);
    
    if (result.success) {
      router.push(`/operations/receipts/${id}`);
    }
  };

  if (loading && !receipt) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-[#F3F0FF] rounded-xl w-64 mb-4"></div>
          <div className="h-64 bg-[#F3F0FF] rounded-2xl"></div>
        </div>
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

  if (receipt.status !== 'Draft') {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-[#1a1a2e]">Cannot Validate</h2>
        <p className="text-[#6B7280] mt-2">
          This receipt has already been {receipt.status.toLowerCase()} and cannot be validated.
        </p>
        <button
          onClick={() => router.push(`/operations/receipts/${id}`)}
          className="mt-4 px-6 py-2 bg-[#7C3AED] text-white rounded-xl hover:bg-[#6d28d9] transition-colors"
        >
          View Receipt
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="display-font text-2xl font-bold text-[#1a1a2e]">Validate Receipt</h1>
        <p className="text-[#6B7280] mt-1">
          Receipt #{receipt.receiptNumber} from {receipt.supplier.name}
        </p>
      </div>

      <ReceiptValidateForm
        receipt={receipt}
        onSubmit={handleSubmit}
        isLoading={loading}
      />
    </div>
  );
}