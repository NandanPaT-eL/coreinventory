'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  Barcode, 
  Tag,
  Scale,
  DollarSign,
  AlertCircle,
  Edit,
  Trash2,
  Building,
  Calendar,
  ArrowLeft,
  FileText
} from 'lucide-react';
import StockBadge from '../shared/StockBadge';
import Button from '../ui/Button';
import ConfirmDialog from '../shared/ConfirmDialog';
import { useWarehouses } from '../../hooks/useWarehouses';

export default function ProductDetails({ product, onDelete, onEdit }) {
  const router = useRouter();
  const { warehouses, fetchWarehouses } = useWarehouses();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [stockByWarehouse, setStockByWarehouse] = useState([]);

  useEffect(() => {
    fetchWarehouses({ limit: 100 });
  }, []);

  useEffect(() => {
    if (product?.stock && warehouses.length > 0) {
      // Map stock to warehouse names
      const mapped = product.stock.map(s => {
        const warehouse = warehouses.find(w => w._id === s.warehouseId);
        return {
          ...s,
          warehouseName: warehouse?.name || 'Unknown',
          warehouseCode: warehouse?.code || '—'
        };
      });
      setStockByWarehouse(mapped);
    }
  }, [product, warehouses]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalStock = product?.stock?.reduce((sum, s) => sum + s.quantity, 0) || 0;
  const reorderPoint = product?.reorderPoint || 10;
  const isLowStock = totalStock > 0 && totalStock <= reorderPoint;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-[#6B7280] hover:text-[#7C3AED] hover:bg-[#F3F0FF] rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="display-font text-2xl font-bold text-[#1a1a2e]">{product?.name}</h1>
            <p className="text-[#6B7280] mt-1">Manage product details and stock</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            icon={<Edit size={18} />}
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button 
            variant="ghost" 
            icon={<Trash2 size={18} />}
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 hover:bg-red-50"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Product Info Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 bg-[#F3F0FF] rounded-2xl flex items-center justify-center">
              <Package size={32} className="text-[#7C3AED]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1a1a2e]">{product?.name}</h2>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-sm text-[#6B7280]">
                  <Barcode size={14} />
                  <span className="font-mono">{product?.sku}</span>
                </div>
                {product?.category && (
                  <div className="flex items-center gap-1 text-sm text-[#6B7280]">
                    <Tag size={14} />
                    <span>{product.category}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-sm text-[#6B7280]">
                  <Scale size={14} />
                  <span>{product?.unitOfMeasure || 'pcs'}</span>
                </div>
              </div>
            </div>
          </div>
          <StockBadge stock={totalStock} reorderPoint={reorderPoint} size="lg" />
        </div>

        {product?.description && (
          <div className="mt-4 pt-4 border-t border-[#EDE9FE]">
            <div className="flex items-start gap-2 text-[#374151]">
              <FileText size={16} className="text-[#9CA3AF] mt-1" />
              <p>{product.description}</p>
            </div>
          </div>
        )}
      </div>

      {/* Pricing & Stock Rules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
          <p className="text-sm text-[#6B7280] mb-1">Cost Price</p>
          <p className="text-2xl font-bold text-[#1a1a2e]">{formatCurrency(product?.costPrice)}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
          <p className="text-sm text-[#6B7280] mb-1">Selling Price</p>
          <p className="text-2xl font-bold text-[#1a1a2e]">{formatCurrency(product?.sellingPrice)}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-6">
          <p className="text-sm text-[#6B7280] mb-1">Reorder Point</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-[#1a1a2e]">{product?.reorderPoint || 10}</p>
            <span className="text-sm text-[#6B7280]">units</span>
          </div>
          {isLowStock && (
            <div className="mt-2 flex items-center gap-1 text-amber-600 text-sm">
              <AlertCircle size={14} />
              <span>Low stock alert</span>
            </div>
          )}
        </div>
      </div>

      {/* Stock by Warehouse */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] overflow-hidden">
        <div className="p-6 border-b border-[#EDE9FE]">
          <h3 className="display-font font-bold text-lg text-[#1a1a2e] flex items-center gap-2">
            <Building size={20} className="text-[#7C3AED]" />
            Stock by Warehouse
          </h3>
        </div>

        {stockByWarehouse.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F9F7FF] border-b border-[#EDE9FE]">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Warehouse</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Quantity</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Location</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F0FF]">
                {stockByWarehouse.map((stock, index) => (
                  <tr key={index} className="hover:bg-[#F9F7FF] transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-[#1a1a2e]">{stock.warehouseName}</p>
                        <p className="text-xs text-[#6B7280]">Code: {stock.warehouseCode}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className={`font-mono font-bold ${
                        stock.quantity === 0 ? 'text-red-600' : 
                        stock.quantity <= reorderPoint ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {stock.quantity}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm">{stock.location || '—'}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 text-sm text-[#6B7280]">
                        <Calendar size={14} />
                        <span>{stock.lastUpdated ? formatDate(stock.lastUpdated) : '—'}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Package className="h-12 w-12 text-[#9CA3AF] mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-[#1a1a2e] mb-2">No Stock Found</h4>
            <p className="text-[#6B7280]">This product hasn't been received in any warehouse yet.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={onDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${product?.name}"? This action cannot be undone.`}
        confirmText="Delete Product"
        type="danger"
      />
    </div>
  );
}
