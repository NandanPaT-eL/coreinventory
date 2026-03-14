'use client';

export default function Badge({ 
  children, 
  variant = 'default',
  className = '',
  ...props 
}) {
  const variants = {
    default: 'bg-[#FFD93D] text-[#1a1a2e]',
    purple: 'bg-[#F3F0FF] text-[#7C3AED]',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
    'dark-light': 'bg-[#1F2937] text-[#6B7280]',
  };

  return (
    <span 
      className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
