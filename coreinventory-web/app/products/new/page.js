'use client';

import { useRouter } from 'next/navigation';
import ProductForm from '../../../components/products/ProductForm';
import { useProducts } from '../../../hooks/useProducts';

export default function NewProductPage() {
  const router = useRouter();
  const { createNewProduct, loading } = useProducts();

  const handleSubmit = async (formData) => {
    const result = await createNewProduct(formData);
    
    if (result.success) {
      router.push(`/products/${result.data._id}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="display-font text-2xl font-bold text-[#1a1a2e]">Create New Product</h1>
        <p className="text-[#6B7280] mt-1">Add a new product to your inventory</p>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        isLoading={loading}
        isEdit={false}
      />
    </div>
  );
}
