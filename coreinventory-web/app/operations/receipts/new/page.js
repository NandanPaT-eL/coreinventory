'use client';

import { useRouter } from 'next/navigation';
import ReceiptForm from '../../../../components/receipts/ReceiptForm';
import { useReceipts } from '../../../../hooks/useReceipts';

export default function NewReceiptPage() {
  const router = useRouter();
  const { createNewReceipt, loading } = useReceipts();

  const handleSubmit = async (formData) => {
    const result = await createNewReceipt(formData);
    
    if (result.success) {
      router.push(`/operations/receipts/${result.data._id}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="display-font text-2xl font-bold text-[#1a1a2e]">Create New Receipt</h1>
        <p className="text-[#6B7280] mt-1">Add a new incoming inventory receipt</p>
      </div>

      <ReceiptForm
        onSubmit={handleSubmit}
        isLoading={loading}
        isEdit={false}
      />
    </div>
  );
}
