'use client';

import { useRouter } from 'next/navigation';
import TransferForm from '../../../../components/transfers/TransferForm';
import { useTransfers } from '../../../../hooks/useTransfers';

export default function NewTransferPage() {
  const router = useRouter();
  const { createNewTransfer, loading } = useTransfers();

  const handleSubmit = async (formData) => {
    const result = await createNewTransfer(formData);
    
    if (result.success) {
      router.push(`/operations/transfers/${result.data._id}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="display-font text-2xl font-bold text-[#1a1a2e]">Create New Transfer</h1>
        <p className="text-[#6B7280] mt-1">Move stock between warehouses or locations</p>
      </div>

      <TransferForm
        onSubmit={handleSubmit}
        isLoading={loading}
        isEdit={false}
      />
    </div>
  );
}
