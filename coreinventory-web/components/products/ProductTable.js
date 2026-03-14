'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Eye, Edit, Trash2, Package, Barcode, AlertCircle, Archive } from 'lucide-react';
import StockBadge from '../shared/StockBadge';
import Button from '../ui/Button';
import ConfirmDialog from '../shared/ConfirmDialog';

export default function ProductTable({ 
  products, 
  isLoading, 
  onDelete,
  pagination,
  onPageChange,
  showActions = true
}) {
  const [productToDelete, setProductToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-[#F3F0FF] rounded-xl"></div>
          <div className="h-20 bg-[#F3F0FF] rounded-xl"></div>
          <div className="h-20 bg-[#F3F0FF] rounded-xl"></div>
        </div>
      </div>
    );
  }

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (productToDelete && onDelete) {
      await onDelete(productToDelete);
      setShowDeleteDialog(false);
      setProductToDelete(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9F7FF] border-b border-[#EDE9FE]">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Product</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">SKU</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Category</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Unit</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Stock</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Price</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Status</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F0FF]">
              {products.map((product) => {
                const totalStock = product.stock?.reduce((sum, s) => sum + s.quantity, 0) || 0;
                const reorderPoint = product.reorderPoint || 10;
                const isLowStock = totalStock > 0 && totalStock <= reorderPoint;
                
                return (
                  <tr key={product._id} className="hover:bg-[#F9F7FF] transition-colors">
                    <td className="py-4 px-6">
                      <Link 
                        href={`/products/${product._id}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="h-10 w-10 bg-[#F3F0FF] rounded-xl flex items-center justify-center">
                          <Package size={20} className="text-[#7C3AED]" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#1a1a2e] group-hover:text-[#7C3AED] transition-colors">
                            {product.name}
                          </p>
                          {product.description && (
                            <p className="text-xs text-[#6B7280] line-clamp-1">{product.description}</p>
                          )}
                        </div>
                      </Link>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 font-mono text-sm text-[#374151]">
                        <Barcode size={14} className="text-[#9CA3AF]" />
                        {product.sku}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-[#374151]">{product.category || '—'}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-[#374151]">{product.unitOfMeasure || 'pcs'}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className={`font-mono font-semibold ${
                          totalStock === 0 ? 'text-red-600' : 
                          isLowStock ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                          {totalStock}
                        </span>
                        {isLowStock && totalStock > 0 && (
                          <AlertCircle size={14} className="text-amber-500" title="Low Stock" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-mono text-sm text-[#374151]">
                        {formatCurrency(product.sellingPrice)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <StockBadge stock={totalStock} reorderPoint={reorderPoint} />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${product._id}`}
                          className="p-2 text-[#6B7280] hover:text-[#7C3AED] hover:bg-[#F3F0FF] rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/products/${product._id}/edit`}
                          className="p-2 text-[#6B7280] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="p-2 text-[#6B7280] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-[#F9F7FF] border-t border-[#EDE9FE]">
            <p className="text-sm text-[#6B7280]">
              Showing <span className="font-semibold text-[#1a1a2e]">
                {((pagination.page - 1) * pagination.limit) + 1}
              </span> to{' '}
              <span className="font-semibold text-[#1a1a2e]">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span> of{' '}
              <span className="font-semibold text-[#1a1a2e]">{pagination.total}</span> products
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 text-sm font-semibold text-[#6B7280] bg-white border border-[#EDE9FE] rounded-full hover:bg-[#F3F0FF] hover:text-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 text-sm font-semibold text-[#6B7280] bg-white border border-[#EDE9FE] rounded-full hover:bg-[#F3F0FF] hover:text-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </>
  );
}
