'use client';

import { Package, Search, Filter, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';

export default function EmptyState({ 
  icon = Package,
  title = 'No items found',
  description = 'Get started by creating your first item.',
  actionLabel,
  actionHref,
  onAction,
  filtered = false
}) {
  const Icon = icon;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-12 text-center">
      <div className="w-20 h-20 bg-[#F3F0FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon size={32} className="text-[#7C3AED]" />
      </div>
      
      <h3 className="display-font text-xl font-bold text-[#1a1a2e] mb-2">{title}</h3>
      
      <p className="text-[#6B7280] mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      {filtered ? (
        <div className="inline-flex items-center gap-2 text-sm text-[#6B7280] bg-[#F9F7FF] px-4 py-2 rounded-full">
          <Filter size={14} />
          <span>Try clearing your filters</span>
        </div>
      ) : actionLabel && (actionHref || onAction) ? (
        <Button 
          href={actionHref} 
          onClick={onAction}
          variant="primary"
          icon={<Package size={16} />}
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
