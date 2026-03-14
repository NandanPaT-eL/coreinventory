'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package } from 'lucide-react';
import { useLedger } from '../../../../hooks/useLedger';
import LedgerTable from '../../../../components/ledger/LedgerTable';
import SectionHeading from '../../../../components/shared/SectionHeading';
import Button from '../../../../components/ui/Button';
import EmptyState from '../../../../components/shared/EmptyState';

export default function ProductMovementPage({ params }) {
  const router = useRouter();
  const { productId } = params;
  const { entries, loading, pagination, fetchProductLedger } = useLedger();
  
  const [product, setProduct] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20
  });

  const loadProductMovements = useCallback(async () => {
    const result = await fetchProductLedger(productId, filters);
    if (result.data.length > 0 && !product) {
      // Extract product info from first entry
      setProduct(result.data[0].productId);
    }
  }, [productId, filters, fetchProductLedger, product]);

  useEffect(() => {
    loadProductMovements();
  }, [productId, filters.page]);

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleRowClick = (entry) => {
    // Navigate to full ledger with filter for this transaction
    router.push(`/move-history?reference=${entry.referenceNumber}`);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1600px] mx-auto space-y-6 lg:space-y-8">
      {/* Back button */}
      <Link
        href="/move-history"
        className="inline-flex items-center text-sm text-[#6B7280] hover:text-[#7C3AED] mb-2 transition-colors group"
      >
        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Ledger
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#F3F0FF] rounded-xl flex items-center justify-center">
          <Package size={24} className="text-[#7C3AED]" />
        </div>
        <div>
          <SectionHeading
            badge="Product History"
            title={product?.name || 'Loading...'}
            highlight="Movements"
            description={`Complete movement history for ${product?.sku || ''}`}
            align="left"
          />
        </div>
      </div>

      {/* Table */}
      {entries.length > 0 ? (
        <LedgerTable
          entries={entries}
          isLoading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRowClick={handleRowClick}
        />
      ) : !loading && (
        <EmptyState
          icon={Package}
          title="No movements found"
          description="This product has no recorded stock movements yet."
        />
      )}

      {/* Loading State */}
      {loading && entries.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3AED] mx-auto"></div>
          <p className="text-[#6B7280] mt-4">Loading movements...</p>
        </div>
      )}
    </div>
  );
}