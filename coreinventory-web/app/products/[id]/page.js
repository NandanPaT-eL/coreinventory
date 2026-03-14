'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductDetails from '../../../components/products/ProductDetails';
import { useProducts } from '../../../hooks/useProducts';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { fetchProductById, deleteExistingProduct, loading } = useProducts();
  
  const [product, setProduct] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    const data = await fetchProductById(id);
    if (data) {
      setProduct(data);
    }
  };

  const handleEdit = () => {
    router.push(`/products/${id}/edit`);
  };

  const handleDelete = async () => {
    const result = await deleteExistingProduct(id);
    if (result.success) {
      router.push('/products');
    }
  };

  if (loading && !product) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-[#F3F0FF] rounded-xl w-64"></div>
        <div className="h-32 bg-[#F3F0FF] rounded-2xl"></div>
        <div className="h-64 bg-[#F3F0FF] rounded-2xl"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-[#1a1a2e]">Product not found</h2>
        <p className="text-[#6B7280] mt-2">The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <ProductDetails
      product={product}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}