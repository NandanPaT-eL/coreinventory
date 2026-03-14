'use client';

export default function StockBadge({ quantity, reorderPoint = 10, className = '' }) {
  let status = 'In Stock';
  let bgColor = 'bg-emerald-100';
  let textColor = 'text-emerald-700';
  let dotColor = 'bg-emerald-500';

  if (quantity === 0) {
    status = 'Out of Stock';
    bgColor = 'bg-red-100';
    textColor = 'text-red-700';
    dotColor = 'bg-red-500';
  } else if (quantity <= reorderPoint) {
    status = 'Low Stock';
    bgColor = 'bg-amber-100';
    textColor = 'text-amber-700';
    dotColor = 'bg-amber-500';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColor}`}></span>
      {status}: {quantity}
    </span>
  );
}
