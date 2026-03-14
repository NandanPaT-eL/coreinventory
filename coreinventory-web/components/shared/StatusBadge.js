'use client';

export default function StatusBadge({ status, className = '' }) {
  const statusConfig = {
    Draft: {
      bg: 'bg-[#F3F0FF]',
      text: 'text-[#7C3AED]',
      label: 'Draft'
    },
    Waiting: {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      label: 'Waiting'
    },
    Ready: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      label: 'Ready'
    },
    Done: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      label: 'Done'
    },
    Canceled: {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      label: 'Canceled'
    }
  };

  const config = statusConfig[status] || statusConfig.Draft;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        status === 'Done' ? 'bg-emerald-500' :
        status === 'Canceled' ? 'bg-slate-400' :
        status === 'Waiting' ? 'bg-amber-500' :
        status === 'Ready' ? 'bg-blue-500' :
        'bg-[#7C3AED]'
      }`}></span>
      {config.label}
    </span>
  );
}
