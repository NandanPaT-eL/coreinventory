'use client';

import Link from 'next/link';
import { 
  Package, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw, 
  AlertTriangle,
  Truck,
  Building
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function RecentMovements({ movements = [] }) {
  const getMovementIcon = (type) => {
    switch (type) {
      case 'receipt':
        return <ArrowLeft className="h-4 w-4 text-emerald-600" />;
      case 'delivery':
        return <ArrowRight className="h-4 w-4 text-blue-600" />;
      case 'transfer':
        return <RefreshCw className="h-4 w-4 text-purple-600" />;
      case 'adjustment':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getMovementColor = (type) => {
    switch (type) {
      case 'receipt':
        return 'bg-emerald-100';
      case 'delivery':
        return 'bg-blue-100';
      case 'transfer':
        return 'bg-purple-100';
      case 'adjustment':
        return 'bg-amber-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getMovementText = (movement) => {
    const delta = movement.delta;
    const absDelta = Math.abs(delta);
    const direction = delta > 0 ? 'received' : delta < 0 ? 'shipped' : 'adjusted';
    
    switch (movement.type) {
      case 'receipt':
        return `Received ${absDelta} ${movement.productId?.unitOfMeasure || 'units'}`;
      case 'delivery':
        return `Shipped ${absDelta} ${movement.productId?.unitOfMeasure || 'units'}`;
      case 'transfer':
        return `Transferred ${absDelta} ${movement.productId?.unitOfMeasure || 'units'}`;
      case 'adjustment':
        return `Adjusted ${movement.productId?.unitOfMeasure || 'units'} by ${delta > 0 ? '+' : ''}${delta}`;
      default:
        return `${movement.type} ${absDelta} units`;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] overflow-hidden">
      <div className="p-6 border-b border-[#EDE9FE]">
        <div className="flex items-center justify-between">
          <h2 className="display-font font-bold text-lg text-[#1a1a2e]">Recent Movements</h2>
          <Link 
            href="/move-history" 
            className="text-sm text-[#7C3AED] hover:text-[#6d28d9] flex items-center gap-1"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {movements.length === 0 ? (
        <div className="p-12 text-center">
          <Package className="h-12 w-12 text-[#9CA3AF] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#1a1a2e] mb-2">No movements yet</h3>
          <p className="text-[#6B7280]">Start by creating a receipt or delivery</p>
        </div>
      ) : (
        <div className="divide-y divide-[#F3F0FF]">
          {movements.map((movement) => (
            <Link
              key={movement._id}
              href={`/move-history?reference=${movement.referenceNumber}`}
              className="block p-4 hover:bg-[#F9F7FF] transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-xl ${getMovementColor(movement.type)} flex items-center justify-center flex-shrink-0`}>
                  {getMovementIcon(movement.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-[#1a1a2e] truncate">
                      {movement.productId?.name || 'Unknown Product'}
                    </p>
                    <span className="text-xs text-[#6B7280]">
                      {formatDistanceToNow(new Date(movement.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-[#6B7280] mb-1">
                    {getMovementText(movement)}
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-[#6B7280]">
                      <Building size={12} />
                      {movement.warehouseId?.name || 'Unknown'}
                    </span>
                    <span className="text-[#6B7280]">•</span>
                    <span className="font-mono text-[#6B7280]">
                      Ref: {movement.referenceNumber}
                    </span>
                    {movement.delta !== 0 && (
                      <>
                        <span className="text-[#6B7280]">•</span>
                        <span className={`font-mono font-semibold ${
                          movement.delta > 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {movement.delta > 0 ? '+' : ''}{movement.delta}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
